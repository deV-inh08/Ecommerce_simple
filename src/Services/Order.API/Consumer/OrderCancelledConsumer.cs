using MassTransit;
using Shared.Contracts;

namespace Order.API.Consumers;

public class OrderCancelledConsumer(AppDbContext db, ILogger<OrderCancelledConsumer> logger) : IConsumer<OrderCancelledEvent>
{
    public async Task Consume(ConsumeContext<OrderCancelledEvent> context)
    {
        var order = await db.Orders.FindAsync(context.Message.OrderId);
        if (order is null)
        {
            logger.LogWarning("OrderCancelledEvent cho Order {OrderId} không tồn tại", context.Message.OrderId);
            return;
        }

        if (order.Status != OrderStatus.Pending)
        {
            logger.LogInformation("Order {OrderId} đã ở trạng thái {Status}, bỏ qua", order.Id, order.Status);
            return;
        }

        order.Status = OrderStatus.Cancelled;
        order.CancelledReason = context.Message.Reason;
        await db.SaveChangesAsync();
    }
}