using Inventory.API.Aggregate;
using Inventory.API.Events;
using KurrentDB.Client;
using System.Text;
using System.Text.Json;

namespace Inventory.API;

public class InventoryRepository(KurrentDBClient client)
{
    private static string StreamName(string sku) => $"inventory-{sku}";

    private static readonly Dictionary<string, Type> EventTypeMap = new()
    {
        [nameof(StockInitialized)] = typeof(StockInitialized),
        [nameof(StockReserved)] = typeof(StockReserved),
        [nameof(StockReleased)] = typeof(StockReleased),
        [nameof(StockReplenished)] = typeof(StockReplenished),
    };

    // Load = đọc TOÀN BỘ event của 1 SKU từ đầu, replay lại để có state hiện tại.
    // Với hệ thống lớn, chỗ này sẽ dùng "snapshot" để khỏi replay hàng nghìn event
    // mỗi lần — nhưng ở quy mô 1 SKU (vài chục event/ngày) thì replay trực tiếp là đủ.
    public async Task<InventoryAggregate?> LoadAsync(string sku)
    {
        var stream = client.ReadStreamAsync(Direction.Forwards, StreamName(sku), StreamPosition.Start);

        if (await stream.ReadState == ReadState.StreamNotFound)
            return null;

        var aggregate = new InventoryAggregate();

        await foreach (var resolvedEvent in stream)
        {
            var eventType = resolvedEvent.Event.EventType;
            if (!EventTypeMap.TryGetValue(eventType, out var clrType)) continue;

            var json = Encoding.UTF8.GetString(resolvedEvent.Event.Data.Span);
            var evt = JsonSerializer.Deserialize(json, clrType);
            if (evt is not null) aggregate.Apply(evt);
        }

        return aggregate;
    }

    // expectedVersion chính là cơ chế optimistic concurrency: nói với KurrentDB
    // "tôi đang ghi dựa trên version X tôi đã đọc". Nếu có ai ghi trước, KurrentDB
    // ném WrongExpectedVersionException thay vì âm thầm ghi đè.
    public async Task SaveAsync(InventoryAggregate aggregate, long expectedVersion)
    {
        if (aggregate.UncommittedEvents.Count == 0) return;

        var eventData = aggregate.UncommittedEvents.Select(evt => new EventData(
            Uuid.NewUuid(),
            evt.GetType().Name,
            JsonSerializer.SerializeToUtf8Bytes(evt, evt.GetType())
        ));

        var streamState = expectedVersion < 0
            ? StreamState.NoStream
            : StreamState.StreamRevision((ulong)expectedVersion);

        await client.AppendToStreamAsync(StreamName(aggregate.Sku), streamState, eventData);

        aggregate.ClearUncommittedEvents();
    }
}