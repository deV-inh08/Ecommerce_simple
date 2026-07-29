using MassTransit;

namespace Checkout.API.SagaState;

// CorrelationId = chính OrderId — không sinh thêm ID riêng, đúng thiết kế đã bàn ở Contracts.
public class CheckoutSagaState : SagaStateMachineInstance
{
    public Guid CorrelationId { get; set; }
    public string CurrentState { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}