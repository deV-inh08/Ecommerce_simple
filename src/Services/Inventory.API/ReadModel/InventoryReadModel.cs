using MongoDB.Bson.Serialization.Attributes;

namespace Inventory.API;

public class InventoryReadModel
{
    [BsonId]
    public string Sku { get; set; } = default!;
    public string ProductName { get; set; } = default!;
    public int OnHand { get; set; }
    public int Reserved { get; set; }
    public int Available => OnHand - Reserved;
    public DateTime UpdatedAtUtc { get; set; }
}