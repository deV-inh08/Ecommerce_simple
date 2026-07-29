namespace Identity.API;

public enum UserRole
{
    Customer = 0,
    Admin = 1
}

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // --- Auth cốt lõi ---
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;

    // --- Profile cơ bản ---
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? PhoneNumber { get; set; }

    // --- Authorization ---
    public UserRole Role { get; set; } = UserRole.Customer;

    // --- Security / chống brute-force ---
    public bool EmailConfirmed { get; set; } = false;
    public bool PhoneNumberConfirmed { get; set; } = false;
    public int FailedLoginAttempts { get; set; } = 0;
    public DateTime? LockoutEndUtc { get; set; }
    public bool IsLockedOut => LockoutEndUtc is not null && LockoutEndUtc > DateTime.UtcNow;

    // Đổi mỗi khi password/security thay đổi — dùng để "vô hiệu hoá" access token cũ
    // nếu sau này bạn muốn check thêm claim này trong JWT (tuỳ chọn nâng cao).
    public string SecurityStamp { get; set; } = Guid.NewGuid().ToString();

    // --- Audit ---
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
    public DateTime? LastLoginAtUtc { get; set; }
}