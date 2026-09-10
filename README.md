# TONGBAO Landing Page

Landing page tĩnh cho TONGBAO Việt Nam, tối ưu để chạy trực tiếp trên Cloudflare Pages và không dùng framework nặng.

## Cấu trúc source

- `index.html` — cấu trúc trang, SEO và nội dung từng section.
- `assets/css/main.css` — giao diện, responsive và animation chung.
- `assets/css/sprites.css` — riêng phần hiển thị ảnh catalogue dạng sprite.
- `assets/js/product-data.js` — duy nhất dữ liệu/thông số sản phẩm.
- `assets/js/main.js` — filter sản phẩm, modal thông số, menu mobile và reveal animation.
- `assets/images/brand/` — logo và ảnh hero.
- `assets/images/sprites/` — ảnh sản phẩm + ảnh ứng dụng đã gộp/tối ưu để giảm request và dung lượng tải.
- `_headers` — cache asset và security headers cho Cloudflare Pages.
- `robots.txt` — cấu hình crawl cơ bản.

## Nguyên tắc update

1. Không nhét CSS/JS mới trực tiếp vào `index.html` nếu đã có file đảm nhiệm đúng chức năng.
2. Thông số sản phẩm chỉ cập nhật trong `product-data.js`; không tạo thêm bản dữ liệu trùng.
3. Style tổng thể dùng `main.css`; style ảnh sprite chỉ dùng `sprites.css`.
4. Tính năng tương tác dùng `main.js`; không tạo nhiều script xử lý cùng một việc.
5. Khi đổi asset, thay đúng asset đang dùng và xóa reference cũ; không để đường dẫn ảnh không còn tồn tại.
6. Trước deploy phải kiểm tra source không còn file thử nghiệm, code trùng hoặc asset rác.

## Tối ưu hiện tại

Ảnh catalogue được gom thành 2 sprite WebP (`products.webp`, `applications.webp`). Cách này giữ source gọn, giảm số request mạng và tránh phải duy trì hàng chục thumbnail riêng lẻ. Hero và logo vẫn tách riêng vì có nhiệm vụ khác nhau và được cache độc lập.

## Deploy Cloudflare Pages

Đây là static site: không cần build command. Chọn thư mục gốc repository làm output directory.
