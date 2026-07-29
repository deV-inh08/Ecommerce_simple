using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace Order.API;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<CustomerOrder> Orders => Set<CustomerOrder>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CustomerOrder>(entity =>
        {
            entity.HasMany(o => o.Items)
                  .WithOne()
                  .HasForeignKey(i => i.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(o => o.UserId);

            // Lưu enum dạng string trong DB thay vì số — dễ đọc trực tiếp khi debug
            // bằng sqlcmd, đúng tinh thần "production hardening" đã bàn.
            entity.Property(o => o.Status).HasConversion<string>();
        });

        // 3 bảng nội bộ của MassTransit — thay thế hoàn toàn bảng OutboxMessage
        // mình tự viết tay trước đó. InboxState dùng cho consumer (Order.API sẽ
        // nhận OrderConfirmedEvent/OrderCancelledEvent ở bước sau) để đảm bảo
        // idempotent — không xử lý trùng nếu RabbitMQ gửi lại message.
        modelBuilder.AddInboxStateEntity();
        modelBuilder.AddOutboxMessageEntity();
        modelBuilder.AddOutboxStateEntity();
    }
}