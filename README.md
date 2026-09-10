# TONGBAO Landing Page

Landing page tĩnh cho TONGBAO Việt Nam, tối ưu chạy trực tiếp trên Cloudflare Pages và không dùng framework nặng.

## Mục tiêu

Trang được tổ chức theo luồng chuyển đổi: **vấn đề thực tế → bằng chứng/ứng dụng → chọn nhóm máy → xem model → quy trình test mẫu → gửi yêu cầu tư vấn**. Không xây theo kiểu catalogue dài thuần thông số.

## Cấu trúc source

- `index.html` — cấu trúc trang, SEO và nội dung từng section.
- `assets/css/main.css` — hệ thống giao diện, layout, responsive và animation dùng chung.
- `assets/css/media.css` — duy nhất phần hiển thị ảnh sản phẩm/media để tránh ảnh bị crop hoặc scale sai.
- `assets/css/conversion.css` — các section phục vụ chuyển đổi: hero, proof, chọn máy, application, quy trình và sticky CTA.
- `assets/js/product-data.js` — nguồn dữ liệu/thông số sản phẩm duy nhất.
- `assets/js/main.js` — filter sản phẩm, modal, menu mobile, reveal animation và điều hướng từ nhu cầu → nhóm sản phẩm.
- `assets/images/brand/` — logo và ảnh hero.
- `assets/images/products/` — mỗi model dùng một file ảnh riêng, không dùng sprite.
- `_headers` — cache asset và security headers cho Cloudflare Pages.
- `robots.txt` — cấu hình crawl cơ bản.

## Nguyên tắc update

1. Không nhét CSS/JS mới trực tiếp vào `index.html` khi đã có file chuyên trách.
2. Thông số và đường dẫn ảnh sản phẩm chỉ cập nhật trong `product-data.js`.
3. Style nền tảng dùng `main.css`; style media dùng `media.css`; style conversion dùng `conversion.css`.
4. Logic tương tác tập trung trong `main.js`; không tạo script trùng chức năng.
5. Khi đổi asset, thay đúng file đang được sử dụng và xóa asset/reference cũ.
6. Không dùng lại sprite ảnh catalogue vì gây giảm chất lượng khi phóng lớn.
7. Trước deploy phải kiểm tra đường dẫn ảnh, filter, modal, mobile menu và CTA.

## Luồng nội dung hiện tại

1. Hero: định vị TONGBAO theo hướng “đừng chọn máy trước khi biết mẫu in có đạt hay không”.
2. Trust strip: giải thích quy trình chọn máy dựa trên mẫu/dây chuyền.
3. Proof: ba nhóm bài toán chính — in date, in độ phân giải cao, khắc laser.
4. Chọn máy: người dùng bấm nhu cầu để tự động lọc đúng nhóm sản phẩm.
5. Sản phẩm: 9 dòng model lấy từ catalogue.
6. Ứng dụng: chai/lọ, thùng/hộp, ống/cáp, kim loại, nhựa/film, QR/truy xuất.
7. Quy trình test mẫu: gửi mẫu → chọn công nghệ → test → chốt cấu hình.
8. CTA cuối + sticky CTA trên mobile/desktop.

## Deploy Cloudflare Pages

Đây là static site: không cần build command. Chọn thư mục gốc repository làm output directory.
