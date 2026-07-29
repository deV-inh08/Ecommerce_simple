// Script này tự động chạy bởi image mongo chính thức khi container khởi tạo lần đầu
// (mount vào /docker-entrypoint-initdb.d). Chạy với quyền root user đã khai báo qua env.

// --- Database cho Catalog.API (write side) ---
db = db.getSiblingDB('CatalogDb');
db.createCollection('products');
db.products.createIndex({ sku: 1 }, { unique: true });
db.products.createIndex({ name: 'text', description: 'text' }); // hỗ trợ full-text search sản phẩm

// --- Database cho Inventory.API (read model / CQRS query side) ---
db = db.getSiblingDB('InventoryReadDb');
db.createCollection('inventoryItems');
db.inventoryItems.createIndex({ sku: 1 }, { unique: true });

print('MongoDB init: đã tạo CatalogDb.products và InventoryReadDb.inventoryItems với index cơ bản.');
