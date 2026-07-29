namespace Inventory.API.Events;

public record StockInitialized(string Sku, string ProductName, int InitialQuantity, DateTime OccurredAtUtc);
public record StockReserved(string Sku, int Quantity, string OrderId, DateTime OccurredAtUtc);
public record StockReleased(string Sku, int Quantity, string OrderId, DateTime OccurredAtUtc);
public record StockReplenished(string Sku, int Quantity, DateTime OccurredAtUtc);