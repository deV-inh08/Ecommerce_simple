using Identity.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace Identity.API.Controllers;

[ApiController]
[Route("api/v1/identity")]
public class IdentityController(
    AppDbContext db,
    IPasswordHasher<User> hasher,
    TokenService tokenService) : ControllerBase
{


    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        if (await db.Users.AnyAsync(u => u.Email == req.Email))
            return Conflict(new { message = "Email đã tồn tại" });

        var user = new User
        {
            Email = req.Email,
            FirstName = req.FirstName,
            LastName = req.LastName,
            PhoneNumber = req.PhoneNumber
        };
        user.PasswordHash = hasher.HashPassword(user, req.Password);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(Register), new { id = user.Id }, new { user.Id, user.Email });
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user is null)
            return Unauthorized();

        if (user.IsLockedOut)
            return Unauthorized(new { message = $"Tài khoản bị khoá tạm thời đến {user.LockoutEndUtc:u}" });

        var verifyResult = hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);
        if (verifyResult == PasswordVerificationResult.Failed)
        {
            user.FailedLoginAttempts++;

            // Sau 5 lần sai liên tiếp, khoá 15 phút — chống brute-force cơ bản.
            if (user.FailedLoginAttempts >= 5)
            {
                user.LockoutEndUtc = DateTime.UtcNow.AddMinutes(15);
                user.FailedLoginAttempts = 0;
            }

            await db.SaveChangesAsync();
            return Unauthorized();
        }

        user.FailedLoginAttempts = 0;
        user.LastLoginAtUtc = DateTime.UtcNow;

        var accessToken = tokenService.GenerateAccessToken(user);
        var (rawRefreshToken, hash) = tokenService.GenerateRefreshToken();

        db.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = hash,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(tokenService.RefreshTokenExpiryDays)
        });
        await db.SaveChangesAsync();

        return Ok(new { accessToken, refreshToken = rawRefreshToken });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshRequest req)
    {
        var hash = tokenService.Hash(req.RefreshToken);
        var existing = await db.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == hash);

        if (existing is null)
            return Unauthorized();

        // Token cũ đã bị revoke nhưng vẫn có người dùng lại -> nghi bị đánh cắp -> revoke toàn bộ session của user
        if (!existing.IsActive)
        {
            await db.RefreshTokens
                .Where(t => t.UserId == existing.UserId && t.RevokedAtUtc == null)
                .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevokedAtUtc, DateTime.UtcNow));

            return Unauthorized();
        }

        var user = await db.Users.FindAsync(existing.UserId);
        if (user is null)
            return Unauthorized();

        var (newRaw, newHash) = tokenService.GenerateRefreshToken();
        var newToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = newHash,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(tokenService.RefreshTokenExpiryDays)
        };
        db.RefreshTokens.Add(newToken);
        await db.SaveChangesAsync();

        existing.RevokedAtUtc = DateTime.UtcNow;
        existing.ReplacedByTokenId = newToken.Id;
        await db.SaveChangesAsync();

        var accessToken = tokenService.GenerateAccessToken(user);
        return Ok(new { accessToken, refreshToken = newRaw });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(RefreshRequest req)
    {
        var hash = tokenService.Hash(req.RefreshToken);
        var existing = await db.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == hash);
        if (existing is not null)
        {
            existing.RevokedAtUtc = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }
        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var email = User.FindFirstValue(JwtRegisteredClaimNames.Email);
        var role = User.FindFirstValue(ClaimTypes.Role);

        return Ok(new { userId, email, role });
    }
}