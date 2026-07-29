using Microsoft.AspNetCore.Connections;
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;
using System.Threading.Channels;

namespace Catalog.API;

public record ProductUpdatedEvent(string ProductId, string Sku, string EventType, DateTime OccurredAtUtc);

public class RabbitMqPublisher : IAsyncDisposable
{
    private readonly IConfiguration _config;
    private IConnection? _connection;
    private IChannel? _channel;
    private const string ExchangeName = "catalog.events";

    public RabbitMqPublisher(IConfiguration config)
    {
        _config = config;
    }

    private async Task<IChannel> GetChannelAsync()
    {
        if (_channel is { IsOpen: true })
            return _channel;

        var factory = new ConnectionFactory
        {
            Uri = new Uri(_config.GetConnectionString("RabbitMq")!)
        };

        _connection = await factory.CreateConnectionAsync();
        _channel = await _connection.CreateChannelAsync();

        // Topic exchange: cho phép service khác sau này subscribe theo pattern
        // (VD: "catalog.product.*") thay vì phải nhận hết mọi event.
        await _channel.ExchangeDeclareAsync(ExchangeName, ExchangeType.Topic, durable: true);

        return _channel;
    }

    public async Task PublishProductUpdatedAsync(ProductUpdatedEvent evt)
    {
        var channel = await GetChannelAsync();
        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(evt));

        var routingKey = $"catalog.product.{evt.EventType.ToLowerInvariant()}"; // vd: catalog.product.updated

        await channel.BasicPublishAsync(
            exchange: ExchangeName,
            routingKey: routingKey,
            mandatory: false,
            basicProperties: new BasicProperties { Persistent = true },
            body: body);
    }

    public async ValueTask DisposeAsync()
    {
        if (_channel is not null) await _channel.CloseAsync();
        if (_connection is not null) await _connection.CloseAsync();
    }
}