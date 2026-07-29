using System.Text.Json;
using MongoDB.Driver;
using StackExchange.Redis;

namespace Catalog.API;

public class CatalogService(MongoContext mongo, IConnectionMultiplexer redis, RabbitMqPublisher publisher, ILogger<CatalogService> logger)
{
    private IDatabase Cache => redis.GetDatabase();
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(10);
    private static string CacheKey(string id) => $"catalog:product:{id}";

    public async Task<Product?> GetByIdAsync(string id)
    {
        // 1. Đọc cache trước (cache-aside)
        var cached = await Cache.StringGetAsync(CacheKey(id));
        if (cached.HasValue)
        {
            logger.LogInformation("Cache HIT cho product {ProductId}", id);
            return JsonSerializer.Deserialize<Product>((string)cached!);
        }

        logger.LogInformation("Cache MISS cho product {ProductId}", id);

        // 2. Miss thì query MongoDB
        var product = await mongo.Products.Find(p => p.Id == id && p.IsActive).FirstOrDefaultAsync();
        if (product is null) return null;

        // 3. Ghi lại cache với TTL
        await Cache.StringSetAsync(CacheKey(id), JsonSerializer.Serialize(product), CacheTtl);

        return product;
    }

    public async Task<List<Product>> GetAllAsync(string? category)
    {
        // Danh sách sản phẩm không cache ở bước này (dễ stale theo filter/category,
        // và ít lợi ích hơn cache theo từng sản phẩm đơn lẻ — có thể tối ưu sau
        // bằng cách cache riêng danh sách ID theo category).
        var filter = category is null
            ? Builders<Product>.Filter.Eq(p => p.IsActive, true)
            : Builders<Product>.Filter.And(
                Builders<Product>.Filter.Eq(p => p.IsActive, true),
                Builders<Product>.Filter.Eq(p => p.Category, category));

        return await mongo.Products.Find(filter).ToListAsync();
    }

    public async Task<Product> CreateAsync(Product product)
    {
        await mongo.Products.InsertOneAsync(product);
        await publisher.PublishProductUpdatedAsync(new ProductUpdatedEvent(product.Id, product.Sku, "Created", DateTime.UtcNow));
        return product;
    }

    public async Task<bool> UpdateAsync(string id, Product update)
    {
        update.UpdatedAtUtc = DateTime.UtcNow;

        var result = await mongo.Products.ReplaceOneAsync(p => p.Id == id, update);
        if (result.MatchedCount == 0) return false;

        // Invalidate cache NGAY sau khi ghi DB thành công — không chờ TTL hết hạn.
        // Đây chính là điểm mấu chốt chống stale data đã bàn ở phần lý thuyết.
        await Cache.KeyDeleteAsync(CacheKey(id));

        await publisher.PublishProductUpdatedAsync(new ProductUpdatedEvent(id, update.Sku, "Updated", DateTime.UtcNow));

        return true;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await mongo.Products.UpdateOneAsync(
            p => p.Id == id,
            Builders<Product>.Update.Set(p => p.IsActive, false).Set(p => p.UpdatedAtUtc, DateTime.UtcNow));

        if (result.MatchedCount == 0) return false;

        await Cache.KeyDeleteAsync(CacheKey(id));
        await publisher.PublishProductUpdatedAsync(new ProductUpdatedEvent(id, "", "Deleted", DateTime.UtcNow));

        return true;
    }
}