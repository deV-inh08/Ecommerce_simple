namespace Cart.API;

public class CartItem
{
    public string ProductId { get; set; } = default!;
    public string Sku { get; set; } = default!;
    public string ProductName { get; set; } = default!;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}

public class ShoppingCart
{
    public string UserId { get; set; } = default!;
    public List<CartItem> Items { get; set; } = new();
    public decimal Total => Items.Sum(i => i.UnitPrice * i.Quantity);
}