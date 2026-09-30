# TONGBAO PTO

Landing page tiếng Việt cho quy trình tư vấn PTO / CÓC BEN. Hotline và Zalo theo chỉ định ngày 30/09/2026: **0981763332**.

## Chức năng

- Giao diện vàng, đen, trắng; logo riêng; ảnh sản phẩm và khung xe do TONGBAO cung cấp.
- Hai luồng POSSTRANS / PUZ và HWP, sáu nhóm ứng dụng, thư viện ảnh, tài liệu tải về và FAQ.
- Phiếu bốn bước với thông số theo nhóm Transfer Case, Flywheel và Slow Walking; chưa biết thông số có thể để trống.
- HWP hoặc chưa rõ hộp số cần ảnh tem. Tối đa 6 file, 10 MB/file, tổng 24 MB; kiểm tra nội dung file ở máy chủ.
- API lưu hồ sơ trong D1 và ảnh trong R2 riêng tư, cấp mã tiếp nhận sau khi lưu; chống gửi trùng và giới hạn tần suất.
- `/admin` yêu cầu đăng nhập ChatGPT và email trong danh sách quản trị; xem hồ sơ, tải file có xác thực, đổi trạng thái, nhật ký thay đổi và xuất CSV.
- Sự kiện `dataLayer` hỗ trợ tích hợp đo lường sau; chưa gắn tài khoản quảng cáo, CRM hay email thông báo.

## Chạy và triển khai

Node >=22.13, pnpm theo `packageManager` và `pnpm-lock.yaml`. Dự án dùng React / Vinext / Vite, Cloudflare Workers, D1 và R2; không phải bản HTML tĩnh để thả lên Pages.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
node node_modules/typescript/bin/tsc --noEmit
node --experimental-strip-types --test tests/intake.test.mjs
```

Khi dùng môi trường Sites, giữ nguyên manifest `.openai/hosting.json` và các script tương thích của starter. Triển khai qua quy trình Sites để cấp DB / BUCKET, áp dụng migration và cấu hình xác thực. Không commit thông tin đăng nhập, token hoặc dữ liệu khách hàng. Khi chuyển sang hosting khác phải cấu hình lại Worker, D1, R2 và xác thực; không dùng project ID của bản Sites khác.

Biến môi trường phía máy chủ:

| Biến | Mục đích |
| --- | --- |
| `ADMIN_EMAILS` | Các email quản trị, ngăn cách bằng dấu phẩy. Không cấu hình thì từ chối truy cập. Phải khớp email tài khoản ChatGPT đăng nhập. |
| `SITE_ORIGIN` | Origin HTTPS của site, dùng kiểm tra yêu cầu gửi form. |

Schema: `db/schema.ts`. Migration đầu tiên: `drizzle/0000_new_caretaker.sql`; không chạy lặp lại migration đã áp dụng. Dữ liệu local để kiểm thử không phải dữ liệu production.

## Trạng thái kiểm tra

- TypeScript và bản build Worker đã chạy thành công trước bàn giao; 5 kiểm thử schema đã đạt.
- Kiểm tra bao gồm số điện thoại, yêu cầu ảnh tem, thông số không biết, giới hạn file, số lượng, chấp thuận và dải tốc độ.
- Chưa xác nhận thao tác toàn trình trên trình duyệt, gửi lead production hoặc quyền truy cập của tài khoản quản trị thực tế. Môi trường preview không truy cập được trong phiên này. Chưa đo Lighthouse hay thử trên iPhone / Safari.
- WebMCP `start_pto_consultation` chỉ mở và chọn luồng trên form, không gửi dữ liệu. Trình duyệt không hỗ trợ sẽ bỏ qua. Chưa có môi trường WebMCP được phép để kiểm chứng đăng ký và gọi tool.

## Trước khi chạy quảng cáo

1. Kiểm tra form bằng tài khoản thật, xác nhận hồ sơ và ảnh xuất hiện trong `/admin`, kiểm tra quyền từ chối với tài khoản khác.
2. Xác nhận email quản trị, quy trình theo dõi khách và thông báo hồ sơ mới. Hiện nhân viên phải mở trang quản trị để xem yêu cầu.
3. Cấu hình tên miền / đối tượng được xem; cập nhật origin, canonical và chính sách bảo mật theo vận hành thực tế. Bản ban đầu là riêng tư và `noindex`.
4. Gắn ID GTM / GA4 / Pixel hoặc endpoint CRM / Sheet nếu cần, rồi kiểm tra sự kiện thành công bằng lead đã lưu. Không dùng ID từ dự án khác.
5. Duyệt nội dung kỹ thuật và điều kiện thương mại với TONGBAO. Trang không tự kết luận tương thích hoặc báo giá.

Xem `docs/CONTENT_SOURCES.md` về nguồn tư liệu và phạm vi nội dung.
