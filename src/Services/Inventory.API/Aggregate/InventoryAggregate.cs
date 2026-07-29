using Inventory.API.Events;

namespace Inventory.API.Aggregate;

public class InventoryAggregate
{
    public string Sku { get; private set; } = default!;
    public string ProductName { get; private set; } = default!;
    public int OnHand { get; private set; }
    public int Reserved { get; private set; }
    public int Available => OnHand - Reserved;

    // Version = vị trí event cuối cùng trong stream. -1 nghĩa là stream chưa từng tồn tại.
    public long Version { get; private set; } = -1;

    private readonly List<object> _uncommittedEvents = new();
    public IReadOnlyList<object> UncommittedEvents => _uncommittedEvents;

    public static InventoryAggregate Create(string sku, string productName, int initialQuantity)
    {
        var aggregate = new InventoryAggregate();
        var evt = new StockInitialized(sku, productName, initialQuantity, DateTime.UtcNow);
        aggregate.Apply(evt);
        aggregate._uncommittedEvents.Add(evt);
        return aggregate;
    }

    public void Reserve(int quantity, string orderId)
    {
        if (quantity <= 0) throw new InvalidOperationException("Số lượng đặt trước phải > 0");
        if (Available < quantity)
            throw new InvalidOperationException($"Không đủ tồn kho: còn {Available}, cần {quantity}");

        var evt = new StockReserved(Sku, quantity, orderId, DateTime.UtcNow);
        Apply(evt);
        _uncommittedEvents.Add(evt);
    }

    public void Release(int quantity, string orderId)
    {
        var evt = new StockReleased(Sku, quantity, orderId, DateTime.UtcNow);
        Apply(evt);
        _uncommittedEvents.Add(evt);
    }

    public void Replenish(int quantity)
    {
        var evt = new StockReplenished(Sku, quantity, DateTime.UtcNow);
        Apply(evt);
        _uncommittedEvents.Add(evt);
    }

    // Apply KHÔNG validate gì cả — chỉ cập nhật state dựa trên event đã xảy ra.
    // Business rule (VD: check đủ hàng) nằm ở method public phía trên (Reserve/Release),
    // vì Apply còn được dùng lại để REPLAY event cũ khi load aggregate từ KurrentDB —
    // lúc đó event đã là sự thật lịch sử, không cần validate lại lần nữa.
    public void Apply(object evt)
    {
        switch (evt)
        {
            case StockInitialized e:
                Sku = e.Sku; ProductName = e.ProductName; OnHand = e.InitialQuantity; Reserved = 0;
                break;
            case StockReserved e:
                Reserved += e.Quantity;
                break;
            case StockReleased e:
                Reserved -= e.Quantity;
                break;
            case StockReplenished e:
                OnHand += e.Quantity;
                break;
        }
        Version++;
    }

    public void ClearUncommittedEvents() => _uncommittedEvents.Clear();
}