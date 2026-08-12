# Project Instructions & GitHub Pages Deployment Standard (AGENTS.md)

## 🚀 Standard Operating Procedure: GitHub Pages & Static Web Publishing

Mọi ứng dụng web xuất bản lên GitHub Pages cần tuân thủ nghiêm ngặt các quy tắc dưới đây để đảm bảo ứng dụng **hoạt động 100% không lỗi MIME type, 404 hoặc đường dẫn tĩnh**:

### 1. Đường dẫn tương đối trong Vite (`vite.config.ts`)
* Luôn sử dụng `base: './'` trong `vite.config.ts`.
* Giúp các file JS, CSS, hình ảnh định tuyến chính xác bất kể ứng dụng chạy ở tên miền gốc hay subpath GitHub Pages (`https://<username>.github.io/<repo-name>/`).

### 2. Cấu hình Build & Đồng bộ Thư mục (`package.json`)
* Thêm các file bắt buộc cho GitHub Pages vào câu lệnh `build`:
  * `touch dist/.nojekyll`: Ngăn GitHub Jekyll bỏ qua các folder bắt đầu bằng dấu gạch dưới (như `_assets`).
  * `cp dist/index.html dist/404.html`: Hỗ trợ Client-side Routing (SPA) không bị lỗi 404 khi người dùng refresh trang.
  * `mkdir -p docs && cp -r dist/* docs/`: Đồng bộ tự động sang thư mục `/docs` để hỗ trợ tính năng chọn nguồn "Deploy from /docs" nhanh nhất trên GitHub.

### 3. Quy trình GitHub Actions Workflow (`.github/workflows/deploy.yml`)
* Sử dụng `npm install` thay cho `npm ci` để tránh lỗi xung đột `package-lock.json` trên CI/CD runner.
* Gọi lệnh `npm run build` để tận dụng toàn bộ quy trình đóng gói tự động.

---

## 🛠️ Hướng dẫn Kích hoạt trên GitHub Pages (Dành cho Người dùng)

### Cách 1: Triển khai nhanh từ thư mục `/docs` (Khuyên dùng - Đơn giản nhất)
1. Trên GitHub repository, truy cập **Settings** -> **Pages** (cột bên trái).
2. Tại mục **Build and deployment**:
   * **Source**: Chọn **Deploy from a branch**
   * **Branch**: Chọn **main** (hoặc `master`)
   * **Folder**: Chọn **/docs**
3. Nhấn **Save**.

### Cách 2: Triển khai tự động bằng GitHub Actions
1. Trên GitHub repository, truy cập **Settings** -> **Pages**.
2. Tại mục **Source**: Chọn **GitHub Actions**.
3. Workflow tại `.github/workflows/deploy.yml` sẽ tự động trigger và publish trang web mỗi khi đẩy code lên `main`.
