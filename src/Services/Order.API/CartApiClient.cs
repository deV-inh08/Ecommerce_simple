using System.Net.Http.Headers;
using System.Text.Json;

namespace Order.API;

public record CartItemDto(string ProductId, string Sku, string ProductName, decimal UnitPrice, int Quantity);
public record CartDto(string UserId, List<CartItemDto> Items, decimal Total);

public class CartApiClient(HttpClient httpClient)
{
    public async Task<CartDto?> GetCartAsync(string bearerToken)
    {
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);

        var response = await httpClient.GetAsync("/api/v1/cart");
        if (!response.IsSuccessStatusCode) return null;

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<CartDto>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }

    public async Task ClearCartAsync(string bearerToken)
    {
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);
        await httpClient.DeleteAsync("/api/v1/cart");
    }
}