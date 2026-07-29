namespace Shared.Contracts;

public record StockReservationItem(string Sku, int Quantity);

// Checkout.API publish, Inventory.API consume.
public record ReserveStockRequestedEvent(Guid OrderId, List<StockReservationItem> Items, DateTime OccurredAtUtc);

// Inventory.API publish sau khi reserve TẤT CẢ item thành công.
public record StockReservedEvent(Guid OrderId, DateTime OccurredAtUtc);

// Inventory.API publish nếu BẤT KỲ item nào không đủ hàng — kèm lý do cụ thể.
public record StockReservationFailedEvent(Guid OrderId, string Reason, DateTime OccurredAtUtc);