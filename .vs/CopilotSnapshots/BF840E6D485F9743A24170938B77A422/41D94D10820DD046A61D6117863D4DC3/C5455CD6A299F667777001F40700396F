namespace Shared.Contracts;

public record OrderItemContract(string ProductId, string Sku, string ProductName, decimal UnitPrice, int Quantity);

// Order.API publish sau khi ghi Order với status Pending — đây là điểm bắt đầu saga.
public record OrderSubmittedEvent(
    Guid OrderId,
    string UserId,
    List<OrderItemContract> Items,
    decimal TotalAmount,
    DateTime OccurredAtUtc);

// Checkout.API publish khi saga quyết định đơn hàng OK — Order.API consume để đổi status.
public record OrderConfirmedEvent(Guid OrderId, DateTime OccurredAtUtc);

// Checkout.API publish khi saga quyết định huỷ (hết hàng hoặc timeout) — đây là
// "compensation" theo nghĩa forward-only: 1 business fact MỚI, không phải rollback.
public record OrderCancelledEvent(Guid OrderId, string Reason, DateTime OccurredAtUtc);