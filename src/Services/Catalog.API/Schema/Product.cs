using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Catalog.API;

public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public string Sku { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "VND";
    public string Category { get; set; } = default!;

    // Thuộc tính động, khác nhau tuỳ loại sản phẩm (VD: size/color cho áo,
    // RAM/storage cho điện thoại) — đây là chỗ NoSQL tự nhiên hơn hẳn bảng cứng.
    public Dictionary<string, string> Attributes { get; set; } = new();

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
}