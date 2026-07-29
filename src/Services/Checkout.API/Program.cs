using Checkout.API.SagaState;
using MassTransit;
using MassTransit.EntityFrameworkCoreIntegration;
using Quartz;
using Checkout.API;
using Microsoft.EntityFrameworkCore;
using Quartz.Serialization.SystemTextJson;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddHealthChecks()
    .AddSqlServer(builder.Configuration.GetConnectionString("CheckoutDb")!, tags: ["ready"]);

// --- Quartz: persistent store TRÊN CHÍNH SQL SERVER CheckoutDb (dùng chung DB,
// tách bảng riêng QRTZ_*) — đây là "durable timer" sống sót qua restart. ---
builder.Services.AddQuartz(q =>
{
    q.UsePersistentStore(s =>
    {
        s.UseProperties = true;
        s.UseSqlServer(builder.Configuration.GetConnectionString("CheckoutDb")!);
        s.UseSystemTextJsonSerializer();
    });
});
builder.Services.AddQuartzHostedService(opt => opt.WaitForJobsToComplete = true);

// --- MassTransit Saga ---
builder.Services.AddMassTransit(x =>
{
    x.AddSagaStateMachine<CheckoutSagaStateMachine, CheckoutSagaState>()
        .EntityFrameworkRepository(r =>
        {
            // Pessimistic locking cho saga state — đúng khuyến nghị chuẩn của
            // MassTransit: khi 2 message cùng đến cho 1 saga instance gần như
            // đồng thời (VD: StockReserved và ReservationTimeoutExpired), khoá
            // dòng dữ liệu saga trong lúc xử lý, tránh race condition.
            r.ConcurrencyMode = ConcurrencyMode.Pessimistic;
            r.AddDbContext<DbContext, CheckoutDbContext>((provider, options) =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("CheckoutDb"));
            });

        });

    var rabbit = builder.Configuration.GetSection("RabbitMq");
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(rabbit["Host"], rabbit["VirtualHost"], h =>
        {
            h.Username(rabbit["Username"]!);
            h.Password(rabbit["Password"]!);
        });

        cfg.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

app.MapDefaultEndpoints(); // chỉ có /healthz — KHÔNG có business endpoint nào khác, đúng thiết kế "pure consumer"

app.Run();