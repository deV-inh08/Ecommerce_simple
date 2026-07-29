using Inventory.API.Aggregate;
using KurrentDB.Client;
using MongoDB.Driver;

namespace Inventory.API;

public class InventoryService(InventoryRepository repository, IMongoDatabase mongoDatabase, ILogger<InventoryService> logger)
{
    private IMongoCollection<InventoryReadModel> ReadCollection => mongoDatabase.GetCollection<InventoryReadModel>("inventoryItems");

    public async Task<bool> InitializeAsync(string sku, string productName, int initialQuantity)
    {
        var existing = await repository.LoadAsync(sku);
        if (existing is not null) return false;

        var aggregate = InventoryAggregate.Create(sku, productName, initialQuantity);
        await repository.SaveAsync(aggregate, expectedVersion: -1);
        return true;
    }

    // Retry khi 2 request cùng reserve 1 SKU tại cùng thời điểm — 1 trong 2 sẽ bị
    // KurrentDB từ chối (WrongExpectedVersionException), load lại state mới nhất
    // rồi thử lại là đủ cho hầu hết trường hợp thực tế (đây chính là "optimistic
    // concurrency + retry" đã bàn ở phần lý thuyết, thay vì lock trước khi đọc).
    public async Task<(bool Success, string? Error)> ReserveAsync(string sku, int quantity, string orderId)
    {
        const int maxRetries = 3;

        for (var attempt = 0; attempt < maxRetries; attempt++)
        {
            var aggregate = await repository.LoadAsync(sku);
            if (aggregate is null) return (false, "SKU không tồn tại");

            var expectedVersion = aggregate.Version;

            try
            {
                aggregate.Reserve(quantity, orderId);
                await repository.SaveAsync(aggregate, expectedVersion);
                return (true, null);
            }
            catch (InvalidOperationException ex)
            {
                return (false, ex.Message); // lỗi nghiệp vụ (không đủ hàng) — không cần retry
            }
            catch (WrongExpectedVersionException) when (attempt < maxRetries - 1)
            {
                logger.LogWarning("Xung đột concurrency khi reserve {Sku}, thử lại lần {Attempt}", sku, attempt + 1);
            }
        }

        return (false, "Xung đột dữ liệu, vui lòng thử lại");
    }

    public async Task<(bool Success, string? Error)> ReleaseAsync(string sku, int quantity, string orderId)
    {
        var aggregate = await repository.LoadAsync(sku);
        if (aggregate is null) return (false, "SKU không tồn tại");

        var expectedVersion = aggregate.Version;
        aggregate.Release(quantity, orderId);
        await repository.SaveAsync(aggregate, expectedVersion);
        return (true, null);
    }

    public async Task<(bool Success, string? Error)> ReplenishAsync(string sku, int quantity)
    {
        var aggregate = await repository.LoadAsync(sku);
        if (aggregate is null) return (false, "SKU không tồn tại");

        var expectedVersion = aggregate.Version;
        aggregate.Replenish(quantity);
        await repository.SaveAsync(aggregate, expectedVersion);
        return (true, null);
    }

    // Query LUÔN đọc từ MongoDB, KHÔNG đọc từ KurrentDB — tách hẳn đường đọc khỏi đường ghi.
    public async Task<InventoryReadModel?> GetBySkuAsync(string sku) =>
        await ReadCollection.Find(x => x.Sku == sku).FirstOrDefaultAsync();

    public async Task<List<InventoryReadModel>> GetAllAsync() =>
        await ReadCollection.Find(FilterDefinition<InventoryReadModel>.Empty).ToListAsync();
}