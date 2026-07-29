using System.Text.Json;
using StackExchange.Redis;

namespace Cart.API;

public class CartService(IConnectionMultiplexer redis)
{
    private IDatabase Db => redis.GetDatabase();
    private static readonly TimeSpan CartTtl = TimeSpan.FromDays(7);
    private static string CartKey(string userId) => $"cart:{userId}";

    public async Task<ShoppingCart> GetCartAsync(string userId)
    {
        var raw = await Db.StringGetAsync(CartKey(userId));
        if (!raw.HasValue)
            return new ShoppingCart { UserId = userId };

        return JsonSerializer.Deserialize<ShoppingCart>((string)raw!) ?? new ShoppingCart { UserId = userId };
    }

    public async Task<ShoppingCart> AddItemAsync(string userId, CartItem newItem)
    {
        var cart = await GetCartAsync(userId);
        var existing = cart.Items.FirstOrDefault(i => i.ProductId == newItem.ProductId);
        if (existing is not null)
        {
            existing.Quantity += newItem.Quantity;
            existing.Sku = newItem.Sku;
            existing.ProductName = newItem.ProductName;
            existing.UnitPrice = newItem.UnitPrice;
        }
        else
        {
            cart.Items.Add(newItem);
        }
        await SaveAsync(cart);
        return cart;
    }

    public async Task<ShoppingCart?> UpdateQuantityAsync(string userId, string productId, int quantity)
    {
        var cart = await GetCartAsync(userId);
        var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);
        if (item is null) return null;

        if (quantity <= 0)
            cart.Items.Remove(item);
        else
            item.Quantity = quantity;

        await SaveAsync(cart);
        return cart;
    }

    public async Task<ShoppingCart> RemoveItemAsync(string userId, string productId)
    {
        var cart = await GetCartAsync(userId);
        cart.Items.RemoveAll(i => i.ProductId == productId);
        await SaveAsync(cart);
        return cart;
    }

    public async Task ClearAsync(string userId)
    {
        await Db.KeyDeleteAsync(CartKey(userId));
    }

    private async Task SaveAsync(ShoppingCart cart)
    {
        await Db.StringSetAsync(CartKey(cart.UserId), JsonSerializer.Serialize(cart), CartTtl);
    }
}