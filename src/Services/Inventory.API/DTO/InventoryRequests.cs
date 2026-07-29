namespace Inventory.API.Models;

public record InitializeStockRequest(string Sku, string ProductName, int InitialQuantity);
public record ReserveStockRequest(int Quantity, string OrderId);
public record ReleaseStockRequest(int Quantity, string OrderId);
public record ReplenishStockRequest(int Quantity);