namespace Shared.Contracts;

// Quartz job publish message này khi hết 30 giây mà chưa có phản hồi từ Inventory —
// saga coi đây như 1 event bình thường, y hệt StockReserved/StockReservationFailed.
public record ReservationTimeoutExpired(Guid OrderId, DateTime OccurredAtUtc);