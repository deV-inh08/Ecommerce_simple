namespace Catalog.API.Models;

public record ProductRequest(
    string Sku,
    string Name,
    string? Description,
    decimal Price,
    string Currency,
    string Category,
    Dictionary<string, string>? Attributes);