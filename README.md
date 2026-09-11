# TONGBAO landing page

Landing page tĩnh, tối ưu cho Cloudflare Pages và hai nhóm màn hình desktop/mobile.

## Cấu trúc

- `index.html`: nội dung và thứ tự các section.
- `assets/css/main.css`: token, component và layout chính.
- `assets/css/media.css`: responsive tablet/mobile.
- `assets/js/product-data.js`: dữ liệu 9 sản phẩm; sửa nội dung/ảnh tại đây.
- `assets/js/catalog.js`: bộ lọc và modal sản phẩm.
- `assets/js/form.js`: kiểm tra form, UTM và tạo nội dung gửi Zalo.
- `assets/js/main.js`: menu, header và hiệu ứng xuất hiện.
- `assets/images/catalog-products/`: bộ ảnh sản phẩm WebP 4:3, kích thước 1000 × 750, dựng theo ảnh tham chiếu trong catalog.

## Cập nhật sản phẩm

1. Chỉ thêm sản phẩm đã xuất hiện trong catalog được duyệt.
2. Xuất ảnh WebP tỷ lệ 4:3 vào `assets/images/catalog-products/`; không dùng khung hình cắt từ video.
3. Thêm hoặc sửa một object trong `assets/js/product-data.js`.
4. Giữ ảnh dưới khoảng 200 KB để trang tải mượt trên mạng di động.

## Biểu mẫu

Biểu mẫu hiện tạo bản tóm tắt để khách sao chép và gửi Zalo. Không có dữ liệu cá nhân nào tự động gửi sang dịch vụ khác. Nếu kết nối Google Sheets/CRM sau này, bổ sung endpoint trong một module tích hợp riêng, không đặt khóa bí mật ở mã phía trình duyệt.

## Triển khai

Cloudflare Pages phục vụ trực tiếp thư mục gốc, không cần build command.
