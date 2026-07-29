using Checkout.API.SagaState;
using MassTransit;
using MassTransit.EntityFrameworkCoreIntegration;
using Microsoft.EntityFrameworkCore;

namespace Checkout.API;

public class CheckoutDbContext(DbContextOptions options) : SagaDbContext(options)
{
    protected override IEnumerable<ISagaClassMap> Configurations =>
        new ISagaClassMap[] { new CheckoutSagaStateMap() };
}

public class CheckoutSagaStateMap : SagaClassMap<CheckoutSagaState>
{
    protected override void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<CheckoutSagaState> entity, ModelBuilder model)
    {
        entity.Property(x => x.CurrentState).HasMaxLength(64);
        entity.Property(x => x.UserId).HasMaxLength(128);
        entity.Property(x => x.TotalAmount).HasColumnType("decimal(18,2)");
    }
}