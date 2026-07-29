namespace Order.API.Models;

public record OrderItemResponse(string ProductId, string Sku, string ProductName, decimal UnitPrice, int Quantity);
public record OrderResponse(Guid Id, string UserId, List<OrderItemResponse> Items, decimal TotalAmount, string Status, string? CancelledReason, DateTime CreatedAtUtc);