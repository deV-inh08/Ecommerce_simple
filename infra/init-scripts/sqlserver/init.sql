-- Tạo database riêng cho từng service tuân theo pattern "database per service".
-- Script này chạy 1 lần bởi container sqlserver-init sau khi sqlserver healthy.

IF DB_ID('IdentityDb') IS NULL
BEGIN
    CREATE DATABASE IdentityDb;
    PRINT 'Created IdentityDb';
END
GO

IF DB_ID('OrderDb') IS NULL
BEGIN
    CREATE DATABASE OrderDb;
    PRINT 'Created OrderDb';
END
GO

IF DB_ID('CheckoutDb') IS NULL
BEGIN
    CREATE DATABASE CheckoutDb;
    PRINT 'Created CheckoutDb';
END
GO

-- EF Core migrations sẽ tự tạo bảng bên trong các DB này khi từng service chạy
-- `dotnet ef database update` — script ở đây chỉ đảm bảo DB tồn tại trước đó.
