# TONGBAO Landing Page

Landing page tĩnh tối ưu cho Cloudflare Pages, không dùng framework nặng.

## Cấu trúc source

- `index.html` — chỉ chứa cấu trúc trang, SEO và nội dung section.
- `assets/css/main.css` — toàn bộ giao diện, responsive và animation nhẹ.
- `assets/js/product-data.js` — dữ liệu sản phẩm, thông số và ứng dụng.
- `assets/js/main.js` — chỉ xử lý filter sản phẩm, modal, menu mobile và reveal animation.
- `assets/images/brand/` — logo và hero.
- `assets/images/products/` — ảnh sản phẩm tách từ catalogue PDF.
- `assets/images/applications/` — ảnh mẫu ứng dụng tách từ catalogue PDF.
- `_headers` — cache asset và security headers cho Cloudflare Pages.

## Nguyên tắc update

1. Không nhét CSS/JS mới trực tiếp vào `index.html`.
2. Cập nhật thông số sản phẩm ở `product-data.js`; không tạo bản dữ liệu trùng ở file khác.
3. Thay ảnh bằng đúng tên file hiện tại nếu là phiên bản mới; xóa ảnh cũ nếu đổi tên để tránh asset rác.
4. Tính năng tương tác mới đưa vào `main.js`; style tương ứng đưa vào `main.css`.
5. Trước khi deploy, xóa file thử nghiệm/ảnh không dùng và kiểm tra toàn bộ đường dẫn asset.

## Deploy Cloudflare Pages

Static site, không cần build command. Chọn thư mục gốc repository làm output directory.
