namespace Order.API;

public enum OrderStatus
{
    Pending = 0,    // trạng thái ban đầu — saga ở Checkout.API sẽ quyết định Confirmed hay Cancelled
    Confirmed = 1,
    Cancelled = 2
}

public class OrderItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ProductId { get; set; } = default!;
    public string Sku { get; set; } = default!;
    public string ProductName { get; set; } = default!;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }

    public Guid OrderId { get; set; }
}

public class CustomerOrder
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; } = default!;
    public List<OrderItem> Items { get; set; } = new();
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    // Chỉ có giá trị khi Status = Cancelled — VD: "InsufficientStock", "Timeout".
    // Đây là "compensation = forward-only": Reason mô tả 1 SỰ THẬT MỚI, không phải rollback.
    public string? CancelledReason { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}