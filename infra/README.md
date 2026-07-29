# Hạ tầng SimpleStore — Sprint 0

Chứa toàn bộ dependency chạy nền cho các service: SQL Server, MongoDB, Redis, RabbitMQ, KurrentDB, Jaeger (tracing), Seq (logs).

## Chạy lần đầu

```bash
cd infra
cp .env.example .env
# (tuỳ chọn) sửa mật khẩu trong .env

docker compose up -d
```

`sqlserver-init` sẽ tự chạy 1 lần để tạo `IdentityDb`, `OrderDb`, `CheckoutDb` sau khi SQL Server healthy — không cần chạy tay. MongoDB tự tạo `CatalogDb` và `InventoryReadDb` nhờ script trong `init-scripts/mongo`.

## Kiểm tra từng service đã lên đúng chưa

| Service | Cách kiểm tra |
|---|---|
| SQL Server | `docker exec -it simplestore-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -Q "SELECT name FROM sys.databases"` — phải thấy `IdentityDb`, `OrderDb`, `CheckoutDb` |
| MongoDB | `docker exec -it simplestore-mongodb mongosh -u root -p "YourStrong!Passw0rd" --eval "db.adminCommand('listDatabases')"` |
| Redis | `docker exec -it simplestore-redis redis-cli ping` → `PONG` |
| RabbitMQ | Mở http://localhost:15672 (user/pass mặc định: `guest`/`guest`) |
| KurrentDB | Mở http://localhost:2113 |
| Jaeger UI | Mở http://localhost:16686 |
| Seq | Mở http://localhost:5341 |

## Xem log / debug

```bash
docker compose logs -f sqlserver-init   # xem log lúc tạo database, hữu ích nếu init lỗi
docker compose ps                        # xem container nào chưa healthy
```

## Dừng / dọn dẹp

```bash
docker compose down          # dừng, giữ lại volume (data)
docker compose down -v       # dừng và XOÁ SẠCH data — dùng khi muốn reset từ đầu
```

## Cổng đã map ra host

| Port | Dịch vụ |
|---|---|
| 1433 | SQL Server |
| 27017 | MongoDB |
| 6379 | Redis |
| 5672 / 15672 | RabbitMQ AMQP / Management UI |
| 2113 / 1113 | KurrentDB HTTP / TCP |
| 16686 | Jaeger UI |
| 4317 / 4318 | OTLP gRPC / HTTP (nơi các service .NET/Node.js sẽ export trace/metric tới) |
| 5341 | Seq UI |

## Ghi chú quan trọng

- **Không dùng cấu hình này cho production** — mật khẩu mặc định, không TLS, không giới hạn tài nguyên. Đây là setup cho local dev.
- `sqlserver-init` là container **chạy 1 lần rồi thoát** (`restart: "no"`) — thấy nó ở trạng thái `Exited (0)` trong `docker compose ps` là **bình thường**, không phải lỗi.
- Nếu `sqlserver-init` chạy trước khi SQL Server sẵn sàng thật sự (đôi khi healthcheck pass nhưng service chưa nhận connection), chạy lại thủ công: `docker compose up sqlserver-init`.
- KurrentDB đang chạy chế độ **insecure** (không TLS/auth) — chỉ phù hợp local dev, tuyệt đối không expose cổng 2113/1113 ra ngoài internet.
