using Inventory.API.Events;
using KurrentDB.Client;
using MongoDB.Driver;
using System.Text;
using System.Text.Json;

namespace Inventory.API;

public class InventoryProjectionWorker(KurrentDBClient eventStoreClient, IMongoDatabase mongoDatabase, ILogger<InventoryProjectionWorker> logger) : BackgroundService
{
    private IMongoCollection<InventoryReadModel> Collection => mongoDatabase.GetCollection<InventoryReadModel>("inventoryItems");

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Subscribe từ đầu (FromAll.Start) mỗi lần service khởi động — đơn giản,
        // đủ cho môi trường học tập/dev. Ở production cần lưu "checkpoint" (vị trí
        // đã xử lý đến đâu) để không phải replay lại toàn bộ event mỗi lần restart.
        var filter = new SubscriptionFilterOptions(StreamFilter.Prefix("inventory-"));

        await using var subscription = eventStoreClient.SubscribeToAll(
            FromAll.Start,
            filterOptions: filter,
            cancellationToken: stoppingToken);

        await foreach (var message in subscription.Messages.WithCancellation(stoppingToken))
        {
            if (message is not StreamMessage.Event eventMessage) continue;

            try
            {
                await ProjectAsync(eventMessage.ResolvedEvent);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Lỗi khi project event {EventType}", eventMessage.ResolvedEvent.Event.EventType);
            }
        }
    }

    private async Task ProjectAsync(ResolvedEvent resolvedEvent)
    {
        var eventType = resolvedEvent.Event.EventType;
        var json = Encoding.UTF8.GetString(resolvedEvent.Event.Data.Span);

        switch (eventType)
        {
            case nameof(StockInitialized):
                {
                    var e = JsonSerializer.Deserialize<StockInitialized>(json)!;
                    var doc = new InventoryReadModel
                    {
                        Sku = e.Sku,
                        ProductName = e.ProductName,
                        OnHand = e.InitialQuantity,
                        Reserved = 0,
                        UpdatedAtUtc = DateTime.UtcNow
                    };
                    await Collection.ReplaceOneAsync(x => x.Sku == e.Sku, doc, new ReplaceOptions { IsUpsert = true });
                    break;
                }
            case nameof(StockReserved):
                {
                    var e = JsonSerializer.Deserialize<StockReserved>(json)!;
                    var update = Builders<InventoryReadModel>.Update
                        .Inc(x => x.Reserved, e.Quantity).Set(x => x.UpdatedAtUtc, DateTime.UtcNow);
                    await Collection.UpdateOneAsync(x => x.Sku == e.Sku, update);
                    break;
                }
            case nameof(StockReleased):
                {
                    var e = JsonSerializer.Deserialize<StockReleased>(json)!;
                    var update = Builders<InventoryReadModel>.Update
                        .Inc(x => x.Reserved, -e.Quantity).Set(x => x.UpdatedAtUtc, DateTime.UtcNow);
                    await Collection.UpdateOneAsync(x => x.Sku == e.Sku, update);
                    break;
                }
            case nameof(StockReplenished):
                {
                    var e = JsonSerializer.Deserialize<StockReplenished>(json)!;
                    var update = Builders<InventoryReadModel>.Update
                        .Inc(x => x.OnHand, e.Quantity).Set(x => x.UpdatedAtUtc, DateTime.UtcNow);
                    await Collection.UpdateOneAsync(x => x.Sku == e.Sku, update);
                    break;
                }
        }
    }
}