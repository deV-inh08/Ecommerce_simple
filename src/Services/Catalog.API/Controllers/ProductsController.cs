using Catalog.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.Controllers;

[ApiController]
[Route("api/v1/catalog")]
public class ProductsController(CatalogService catalogService) : ControllerBase
{
    // Public — ai cũng xem được sản phẩm, không cần đăng nhập.
    [HttpGet("products")]
    public async Task<IActionResult> GetAll([FromQuery] string? category)
    {
        var products = await catalogService.GetAllAsync(category);
        return Ok(products);
    }

    [HttpGet("products/{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var product = await catalogService.GetByIdAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    // Ghi dữ liệu — chỉ Admin.
    [Authorize(Roles = "Admin")]
    [HttpPost("products")]
    public async Task<IActionResult> Create(ProductRequest req)
    {
        var product = new Product
        {
            Sku = req.Sku,
            Name = req.Name,
            Description = req.Description,
            Price = req.Price,
            Currency = req.Currency,
            Category = req.Category,
            Attributes = req.Attributes ?? new()
        };

        var created = await catalogService.CreateAsync(product);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("products/{id}")]
    public async Task<IActionResult> Update(string id, ProductRequest req)
    {
        var product = new Product
        {
            Id = id,
            Sku = req.Sku,
            Name = req.Name,
            Description = req.Description,
            Price = req.Price,
            Currency = req.Currency,
            Category = req.Category,
            Attributes = req.Attributes ?? new()
        };

        var success = await catalogService.UpdateAsync(id, product);
        return success ? NoContent() : NotFound();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("products/{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var success = await catalogService.DeleteAsync(id);
        return success ? NoContent() : NotFound();
    }
}