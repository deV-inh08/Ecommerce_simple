using MassTransit;
using Shared.Contracts;

namespace Inventory.API.Consumers;

public class ReserveStockRequestedConsumer(InventoryService inventoryService, ILogger<ReserveStockRequestedConsumer> logger) : IConsumer<ReserveStockRequestedEvent>
{
    public async Task Consume(ConsumeContext<ReserveStockRequestedEvent> context)
    {
        var message = context.Message;

        // Đơn hàng có thể chứa nhiều SKU — phải reserve TẤT CẢ hoặc KHÔNG CÁI NÀO.
        // Nếu SKU thứ 3 hết hàng, phải hoàn lại SKU 1 và 2 đã reserve thành công
        // trước đó TRONG CHÍNH consumer này — đây là compensation ở tầng Inventory,
        // tách biệt với compensation ở tầng saga (Checkout.API sẽ tự lo phần huỷ Order).
        var reservedSoFar = new List<StockReservationItem>();

        foreach (var item in message.Items)
        {
            var (success, error) = await inventoryService.ReserveAsync(item.Sku, item.Quantity, message.OrderId.ToString());

            if (!success)
            {
                logger.LogWarning("Reserve thất bại cho SKU {Sku}, Order {OrderId}: {Error}", item.Sku, message.OrderId, error);

                foreach (var reserved in reservedSoFar)
                    await inventoryService.ReleaseAsync(reserved.Sku, reserved.Quantity, message.OrderId.ToString());

                await context.Publish(new StockReservationFailedEvent(message.OrderId, error ?? "Không đủ tồn kho", DateTime.UtcNow));
                return;
            }

            reservedSoFar.Add(item);
        }

        logger.LogInformation("Reserve thành công toàn bộ item cho Order {OrderId}", message.OrderId);
        await context.Publish(new StockReservedEvent(message.OrderId, DateTime.UtcNow));
    }
}