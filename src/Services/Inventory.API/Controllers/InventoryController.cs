using Inventory.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.API.Controllers;

[ApiController]
[Route("api/v1/inventory")]
public class InventoryController(InventoryService inventoryService) : ControllerBase
{
    [Authorize(Roles = "Admin")]
    [HttpPost("items")]
    public async Task<IActionResult> Initialize(InitializeStockRequest req)
    {
        var success = await inventoryService.InitializeAsync(req.Sku, req.ProductName, req.InitialQuantity);
        return success ? Created($"/api/v1/inventory/items/{req.Sku}", null) : Conflict(new { message = "SKU đã tồn tại" });
    }

    [HttpGet("items")]
    public async Task<IActionResult> GetAll() => Ok(await inventoryService.GetAllAsync());

    [HttpGet("items/{sku}")]
    public async Task<IActionResult> GetBySku(string sku)
    {
        var item = await inventoryService.GetBySkuAsync(sku);
        return item is null ? NotFound() : Ok(item);
    }

    // Sẽ được Checkout.API gọi ở Sprint sau. Checkout.API là pure message consumer
    // (không có HTTP surface, không có JWT user) — bảo mật service-to-service cho
    // 2 endpoint này sẽ cần xem lại kỹ khi làm Checkout.API (khác cơ chế JWT user).
    [Authorize]
    [HttpPost("items/{sku}/reserve")]
    public async Task<IActionResult> Reserve(string sku, ReserveStockRequest req)
    {
        var (success, error) = await inventoryService.ReserveAsync(sku, req.Quantity, req.OrderId);
        return success ? Ok() : BadRequest(new { message = error });
    }

    [Authorize]
    [HttpPost("items/{sku}/release")]
    public async Task<IActionResult> Release(string sku, ReleaseStockRequest req)
    {
        var (success, error) = await inventoryService.ReleaseAsync(sku, req.Quantity, req.OrderId);
        return success ? Ok() : BadRequest(new { message = error });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("items/{sku}/replenish")]
    public async Task<IActionResult> Replenish(string sku, ReplenishStockRequest req)
    {
        var (success, error) = await inventoryService.ReplenishAsync(sku, req.Quantity);
        return success ? Ok() : BadRequest(new { message = error });
    }
}