using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Http.Resilience;
using Microsoft.Extensions.Logging;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;
using Polly;

namespace Microsoft.Extensions.Hosting;

// Extension dùng chung cho MỌI service .NET trong hệ thống (Gateway, Identity, Order, Inventory, Checkout).
// Gọi builder.AddServiceDefaults() ngay đầu Program.cs của từng service.
public static class Extensions
{
    public static TBuilder AddServiceDefaults<TBuilder>(this TBuilder builder)
        where TBuilder : IHostApplicationBuilder
    {
        builder.ConfigureOpenTelemetry();
        builder.AddDefaultHealthChecks();

        builder.Services.AddServiceDiscovery();

        // Resilience mặc định (retry + circuit breaker + timeout) cho MỌI HttpClient
        // được tạo qua IHttpClientFactory trong service này.
        builder.Services.ConfigureHttpClientDefaults(http =>
        {
            http.AddStandardResilienceHandler();
            http.AddServiceDiscovery();
        });

        return builder;
    }

    public static TBuilder ConfigureOpenTelemetry<TBuilder>(this TBuilder builder)
        where TBuilder : IHostApplicationBuilder
    {
        builder.Logging.AddOpenTelemetry(logging =>
        {
            logging.IncludeFormattedMessage = true;
            logging.IncludeScopes = true;
        });

        builder.Services.AddOpenTelemetry()
            .WithMetrics(metrics =>
            {
                metrics.AddAspNetCoreInstrumentation()
                       .AddHttpClientInstrumentation()
                       .AddRuntimeInstrumentation();
            })
            .WithTracing(tracing =>
            {
                tracing.AddAspNetCoreInstrumentation()
                       .AddHttpClientInstrumentation();
            });

        builder.AddOpenTelemetryExporters();

        return builder;
    }

    private static TBuilder AddOpenTelemetryExporters<TBuilder>(this TBuilder builder)
        where TBuilder : IHostApplicationBuilder
    {
        // Đọc OTEL_EXPORTER_OTLP_ENDPOINT từ appsettings/env — trỏ vào Jaeger (port 4317) đã dựng ở Sprint 0.
        var useOtlpExporter = !string.IsNullOrWhiteSpace(
            builder.Configuration["OTEL_EXPORTER_OTLP_ENDPOINT"]);

        if (useOtlpExporter)
        {
            builder.Services.AddOpenTelemetry().UseOtlpExporter();
        }

        return builder;
    }

    public static TBuilder AddDefaultHealthChecks<TBuilder>(this TBuilder builder)
        where TBuilder : IHostApplicationBuilder
    {
        builder.Services.AddHealthChecks()
            // Liveness: chỉ kiểm tra process còn phản hồi, KHÔNG check dependency
            // (đúng nguyên tắc đã bàn: DB chết không có nghĩa là phải restart pod).
            .AddCheck("self", () => HealthCheckResult.Healthy(), tags: ["live"]);

        return builder;
    }

    // Gọi ở cuối Program.cs, sau khi build app: app.MapDefaultEndpoints();
    public static WebApplication MapDefaultEndpoints(this WebApplication app)
    {
        // Readiness: check TẤT CẢ health check đã đăng ký (bao gồm dependency
        // mà từng service tự thêm sau này, VD: DB, Redis, RabbitMQ).
        app.MapHealthChecks("/healthz/ready");

        // Liveness: chỉ check những cái được tag "live" (self-check, không dependency).
        app.MapHealthChecks("/healthz/live", new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains("live")
        });

        return app;
    }
}