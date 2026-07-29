using MassTransit;
using Microsoft.EntityFrameworkCore;
using Shared.Contracts;

namespace Order.API;

public class OrderService(AppDbContext db, CartApiClient cartApiClient, IPublishEndpoint publishEndpoint, ILogger<OrderService> logger)
{
    public async Task<CustomerOrder?> CheckoutAsync(string userId, string bearerToken)
    {
        var cart = await cartApiClient.GetCartAsync(bearerToken);
        if (cart is null || cart.Items.Count == 0)
        {
            logger.LogWarning("Checkout thất bại: giỏ hàng rỗng cho user {UserId}", userId);
            return null;
        }

        var order = new CustomerOrder
        {
            UserId = userId,
            Items = cart.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Sku = i.Sku,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity
            }).ToList(),
            TotalAmount = cart.Total,
            Status = OrderStatus.Pending
        };

        db.Orders.Add(order);

        // Publish TRƯỚC SaveChangesAsync. Nhờ UseBusOutbox() đã cấu hình ở Program.cs,
        // MassTransit tự động "chặn" lời gọi Publish này lại, ghi vào bảng OutboxMessage
        // CÙNG transaction với dòng Order khi SaveChangesAsync chạy — không cần tự
        // BeginTransaction/Commit thủ công như OutboxPublisherWorker cũ nữa.
        await publishEndpoint.Publish(new OrderSubmittedEvent(
            order.Id,
            userId,
            order.Items.Select(i => new OrderItemContract(i.ProductId, i.Sku, i.ProductName, i.UnitPrice, i.Quantity)).ToList(),
            order.TotalAmount,
            DateTime.UtcNow));

        await db.SaveChangesAsync();

        try
        {
            await cartApiClient.ClearCartAsync(bearerToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Không xoá được giỏ hàng sau checkout cho user {UserId} — không ảnh hưởng Order", userId);
        }

        return order;
    }

    public async Task<CustomerOrder?> GetByIdAsync(Guid id, string userId) =>
        await db.Orders.Include(o => o.Items).Where(o => o.Id == id && o.UserId == userId).FirstOrDefaultAsync();

    public async Task<List<CustomerOrder>> GetMyOrdersAsync(string userId) =>
        await db.Orders.Include(o => o.Items).Where(o => o.UserId == userId).ToListAsync();
}