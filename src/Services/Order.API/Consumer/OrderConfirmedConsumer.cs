using MassTransit;
using Shared.Contracts;

namespace Order.API.Consumers;

public class OrderConfirmedConsumer(AppDbContext db, ILogger<OrderConfirmedConsumer> logger) : IConsumer<OrderConfirmedEvent>
{
    public async Task Consume(ConsumeContext<OrderConfirmedEvent> context)
    {
        var order = await db.Orders.FindAsync(context.Message.OrderId);
        if (order is null)
        {
            logger.LogWarning("OrderConfirmedEvent cho Order {OrderId} không tồn tại", context.Message.OrderId);
            return;
        }

        if (order.Status != OrderStatus.Pending)
        {
            logger.LogInformation("Order {OrderId} đã ở trạng thái {Status}, bỏ qua", order.Id, order.Status);
            return;
        }

        order.Status = OrderStatus.Confirmed;
        await db.SaveChangesAsync();
    }
}