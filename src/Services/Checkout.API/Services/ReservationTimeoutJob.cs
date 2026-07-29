using MassTransit;
using Quartz;
using Shared.Contracts;

namespace Checkout.API;

public class ReservationTimeoutJob(IPublishEndpoint publishEndpoint) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var orderId = Guid.Parse(context.JobDetail.JobDataMap.GetString("OrderId")!);
        await publishEndpoint.Publish(new ReservationTimeoutExpired(orderId, DateTime.UtcNow));
    }
}