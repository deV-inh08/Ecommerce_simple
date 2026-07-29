using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Order.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Order.API.Controllers;

[ApiController]
[Route("api/v1/orders")]
[Authorize]
public class OrdersController(OrderService orderService) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(JwtRegisteredClaimNames.Sub)!;

    private string BearerToken => Request.Headers.Authorization.ToString().Replace("Bearer ", "");

    private static OrderResponse ToResponse(CustomerOrder o) => new(
    o.Id, o.UserId,
    o.Items.Select(i => new OrderItemResponse(i.ProductId, i.Sku, i.ProductName, i.UnitPrice, i.Quantity)).ToList(),
    o.TotalAmount, o.Status.ToString(), o.CancelledReason, o.CreatedAtUtc);

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout()
    {
        var order = await orderService.CheckoutAsync(CurrentUserId, BearerToken);
        if (order is null)
            return BadRequest(new { message = "Giỏ hàng rỗng, không thể checkout" });

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, ToResponse(order));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var order = await orderService.GetByIdAsync(id, CurrentUserId);
        return order is null ? NotFound() : Ok(ToResponse(order));
    }

    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        var orders = await orderService.GetMyOrdersAsync(CurrentUserId);
        return Ok(orders.Select(ToResponse));
    }
}