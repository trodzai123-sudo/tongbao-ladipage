# TONGBAO landing page

Landing page B2B cho thiết bị in date, in mã và khắc laser. Danh mục hiện có 11 cấu hình, giữ nguyên thông số và thông tin liên hệ đã có trong mã nguồn. Không bổ sung TW/TWmini.

## Sử dụng và kiểm tra

Yêu cầu Node.js 20 trở lên. Không cần cài dependency để chạy hoặc build website.

```sh
npm run check
npm run build
```

Chỉ triển khai thư mục `dist/`; thư mục này không chứa mã kiểm tra, tài liệu hoặc dữ liệu phát triển.

## Chức năng

- Tìm sản phẩm bằng từ khóa có dấu hoặc không dấu, kết hợp bộ lọc nhóm máy, số kết quả và nút xóa bộ lọc.
- Xem thông số, ảnh chi tiết và chọn đúng sản phẩm khi mở yêu cầu tư vấn.
- Một biểu mẫu dùng chung ở cuối trang và trong hộp thoại; giữ dữ liệu khi đóng/mở, kiểm tra số di động Việt Nam và xóa bản tóm tắt cũ khi nội dung thay đổi.
- Bốn mục bắt buộc; model quan tâm, vật liệu và ghi chú là tùy chọn.
- Tạo nội dung, sao chép rồi mở Zalo hoặc Messenger; có hướng dẫn khi trình duyệt từ chối Clipboard API.
- Điều hướng bàn phím, Escape, giới hạn focus trong hộp thoại, trả lại focus và giữ vị trí cuộn trang.
- Thanh liên hệ trên điện thoại, kích thước vùng bấm tối thiểu 44 px và chế độ giảm chuyển động.
- Tất cả ảnh sản phẩm được phục vụ từ cùng website. Bốn ảnh cầm tay là bản sao nguyên trạng của các URL đã dùng trong phiên bản trước, không tạo ảnh sản phẩm mới.
- Trang 404, cache version theo nội dung file và metadata theo tên miền triển khai mới.

## Hành vi biểu mẫu

Biểu mẫu **chưa tự gửi hay lưu lead lên máy chủ**. Người dùng cần sao chép và gửi qua Zalo/Messenger; trang ghi rõ điều này trước và sau khi tạo nội dung. Không lưu tên, số điện thoại hoặc nội dung yêu cầu trong localStorage, URL hay analytics.

Đã chuẩn bị các sự kiện `dataLayer`: `product_filter`, `product_view`, `consultation_open`, `consultation_prepared`, `consultation_copied`, `contact_click`. Các sự kiện chỉ có mã/nhóm sản phẩm hoặc kênh liên hệ; chưa cài thẻ quảng cáo hay analytics bên ngoài. `consultation_prepared` không có nghĩa là đã gửi hoặc đã nhận lead.

## Triển khai Cloudflare mới

Tạo **Pages project mới** từ GitHub, chọn repo này và cấu hình:

| Trường | Giá trị |
| --- | --- |
| Production branch | `codex/tongbao-ready-20260930` |
| Framework preset | `None` |
| Build command | `npm run check && npm run build` |
| Build output directory | `dist` |
| Root directory | Để trống |

Đặt biến môi trường production `SITE_URL` thành địa chỉ HTTPS chính thức của project mới, ví dụ `https://TEN-PROJECT.pages.dev`, rồi triển khai lại. Không dùng giá trị ví dụ làm hostname thật. Khi có tên miền riêng, đổi `SITE_URL` sang tên miền đó và triển khai lại.

Build sinh canonical, Open Graph URL, Organization JSON-LD, robots.txt và sitemap.xml từ `SITE_URL`. Nếu chưa cấu hình, build vẫn chạy nhưng bỏ canonical, structured data và sitemap để tránh trỏ về Cloudflare cũ. Không sửa hostname trực tiếp trong HTML.

Nhánh riêng giúp chuẩn bị Cloudflare mới mà không đẩy thay đổi vào nhánh `main` đang có thể được Cloudflare cũ theo dõi. Chưa thực hiện chuyển tên miền hoặc thay đổi DNS.

## Cấu trúc

- `index.html`: các phần giới thiệu, danh mục, ứng dụng, quy trình, FAQ, liên hệ và hộp thoại.
- `assets/js/product-data.js`: 11 cấu hình hiện có.
- `assets/js/site.js`: tiện ích dùng chung, hộp thoại và sự kiện tương tác không chứa thông tin cá nhân.
- `assets/js/catalog.js`: tìm kiếm, bộ lọc và chi tiết sản phẩm.
- `assets/js/form.js`: chọn sản phẩm, kiểm tra biểu mẫu, tóm tắt và sao chép.
- `assets/js/main.js`: menu, header, liên hệ và xử lý ảnh lỗi.
- `assets/css/completion.css`: điều chỉnh khả năng sử dụng và responsive trên nền giao diện cũ.
- `scripts/check.mjs`: kiểm tra cấu trúc, anchor, script và đường dẫn ảnh.
- `scripts/build.mjs`: đóng gói file public và metadata Cloudflare.

## Kiểm tra bản ngày 30/09/2026

- Kiểm tra cấu trúc và build: đạt; 11 sản phẩm và 25 đường dẫn tài nguyên cục bộ.
- Mô phỏng DOM ngoại tuyến: đạt các luồng tìm/lọc, trạng thái trống, 11 hộp thoại sản phẩm, gallery, chọn model vào biểu mẫu, kiểm tra số điện thoại, sao chép thành công/từ chối, cập nhật nội dung, giữ form, focus/keyboard, menu và sự kiện không chứa dữ liệu cá nhân.
- Thông số kỹ thuật: đã đối chiếu toàn bộ trường dữ liệu với commit gốc, chỉ thay URL ảnh cầm tay bằng bản sao cục bộ.
- Chưa kiểm tra trực quan bằng trình duyệt hoặc thiết bị thật: môi trường preview bị chặn truy cập. Cần kiểm tra trên URL Cloudflare mới sau khi triển khai.
- Chưa triển khai Cloudflare: dashboard dừng ở bước xác minh bảo mật của trình duyệt tự động.
