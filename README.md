# Wind Turbine RWA Tokenization PoC (50MW Green Energy)

> **Nền tảng PoC Mã hóa Tài sản Thực (RWA Tokenization)** cho Dự án Cụm Nhà máy Điện gió 50MW - Tích hợp Hợp đồng Thông minh **Stellar Soroban (Rust)** & **ERC-3643 (Solidity EVM)**, **Fireblocks MPC Vault**, **Tài khoản Escrow BIDV Core Banking** và **Động cơ Phân bổ Dòng tiền Waterfall**.

---

## 🌟 Tổng Quan Dự Án

Dự án mô phỏng toàn vẹn quy trình token hóa tài sản tài chính xanh (Green Finance RWA) tại Việt Nam theo định hướng của Ngân hàng Nhà nước và Ủy ban Chứng khoán Nhà nước:
1. **Cấu trúc SPV & Định giá**: Token hóa cụm turbine điện gió 50MW thành 2.000.000 WIND Token (Định giá 200 tỷ VNĐ).
2. **Lưu ký & Bảo mật MPC 3/3**: Phê duyệt đa bên qua công nghệ phân mảnh khóa mật mã MPC (SPV - BIDV - PwC).
3. **Xác minh Định danh ONCHAINID**: Kiểm tra điều kiện eKYC/AML và hạn mức nhà đầu tư cá nhân (<100 người).
4. **Thác Phân bổ Dòng tiền Waterfall**: Kết nối doanh thực bán điện EVN từ Tài khoản Phong tỏa (Escrow) BIDV để phân phối cổ tức tự động đến ví nhà đầu tư.
5. **Trợ lý AI Gemini RWA**: Phân tích cấu trúc tín dụng, đánh giá rủi ro pháp lý và tư vấn khung tài chính xanh.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion, Lucide React.
- **Backend**: Express.js (Node.js), Gemini AI API (`@google/genai`).
- **Smart Contracts**:
  - **Rust (Soroban Stellar v21)**: `rwa_token.rs`, `identity_registry.rs`, `compliance_rules.rs`, `escrow_waterfall_bridge.rs`.
  - **Solidity (EVM ERC-3643)**: `RWAWindToken.sol`, `IdentityRegistry.sol`, `ComplianceRules.sol`, `BIDVEscrowWaterfallBridge.sol`.
- **Lưu ký & Banking**: Fireblocks Vault Architecture, BIDV Escrow Integration Mock.

---

## 📁 Cấu Trúc Thư Mục

```text
├── src/
│   ├── components/            # Các tab chức năng & thành phần giao diện
│   │   ├── IssuanceAndCustodyTab.tsx   # Phát hành, Lưu ký MPC & Mã nguồn Smart Contract
│   │   ├── WaterfallCashflowTab.tsx   # Thác phân bổ dòng tiền doanh thu EVN
│   │   ├── TradingAndLiquidityTab.tsx # Sàn giao dịch thứ cấp & Orderbook
│   │   ├── AiAdvisorTab.tsx           # Trợ lý AI Gemini phân tích RWA
│   │   └── ...
│   ├── App.tsx                # Layout chính & Điều hướng ứng dụng
│   ├── types.ts               # Khai báo TypeScript Interfaces & Data Models
│   └── main.tsx               # Entry point React
├── server.ts                  # Server Express proxy Gemini API & Static Assets
├── .env.example               # Mẫu biến môi trường
├── package.json               # Cấu hình dependencies & npm scripts
├── tsconfig.json              # Cấu hình TypeScript
└── vite.config.ts             # Cấu hình Vite Build Engine
```

---

## 🚀 Hướng Dẫn Khởi Chạy Cục Bộ (Local Setup)

### 1. Yêu cầu hệ thống
- **Node.js**: `v18.0.0` trở lên
- **npm** hoặc **yarn** / **pnpm** / **bun**

### 2. Cài đặt Dependencies
```bash
npm install
```

### 3. Cấu hình Biến Môi trường
Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```
Cập nhật khóa API Gemini vào file `.env`:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 4. Chạy Môi trường Phát triển (Dev Server)
```bash
npm run dev
```
Truy cập trình duyệt tại địa chỉ: `http://localhost:3000`

### 5. Kiểm tra & Đóng gói Production Build
```bash
# Kiểm tra Type Safety (Linting)
npm run lint

# Đóng gói sản phẩm (Build)
npm run build

# Khởi chạy bản Production
npm run start
```

---

## 📤 Hướng Dẫn Push Code Lên GitHub

Để tải toàn bộ dự án này lên GitHub repository của bạn:

```bash
# 1. Khởi tạo Git repository (nếu chưa có)
git init

# 2. Thêm tất cả các file vào Staging
git add .

# 3. Commit thay đổi ban đầu
git commit -m "feat: Initial commit for Wind Turbine RWA Tokenization PoC"

# 4. Liên kết với GitHub Repository của bạn (Thay thế URL bằng URL repo của bạn)
git remote add origin https://github.com/USERNAME/REPOSITORY_NAME.git

# 5. Đổi tên branch chính thành main và Push code lên GitHub
git branch -M main
git push -u origin main
```

---

## 🌐 Hướng Dẫn Deploy Web Lên GitHub Pages (Đã fix lỗi 404)

### 🚨 Nguyên nhân lỗi 404 trên GitHub Pages & Cách khắc phục:
Trình duyệt không thể chạy trực tiếp file `.tsx` chưa biên dịch (`/src/main.tsx`). Đồng thời, đường dẫn tương đối cần được bật để assets tải đúng từ thư mục con `/TokenTurbine/`. Dự án đã được tinh chỉnh toàn diện:
1. **Đã cấu hình `base: './'` trong `vite.config.ts`**: Đảm bảo tất cả file JavaScript/CSS được biên dịch ra đường dẫn tương đối.
2. **Thêm dữ liệu dự phòng Client-side**: Giúp trang web hoạt động 100% mượt mà cả ở dạng Static SPA trên GitHub Pages (không cần server Node).
3. **Thêm GitHub Actions Workflow (`.github/workflows/deploy.yml`)**: Tự động build và deploy lên GitHub Pages mỗi khi push code lên `main`.

### ⚡ Các bước kích hoạt GitHub Pages trên Repository của bạn:

#### Cách 1: Cấu hình thư mục `/docs` trên nhánh `main` (Đơn giản & Nhanh nhất - 10 giây)
Do toàn bộ sản phẩm đã được tự động biên dịch vào thư mục `/docs` sẵn sàng:
1. Vào repository trên GitHub: `https://github.com/kysirong39/TokenTurbine`
2. Vào tab **Settings** -> mục **Pages** (cột bên trái).
3. Tại mục **Build and deployment**:
   - **Source**: Chọn **Deploy from a branch**
   - **Branch**: Chọn **main**
   - **Thư mục (Folder)**: Chọn **/docs** *(Thay vì / (root))*
4. Nhấn **Save**.
5. Đợi 1-2 phút rồi F5 lại trang `https://kysirong39.github.io/TokenTurbine/`. Web sẽ load mượt mà 100%!

#### Cách 2: Sử dụng GitHub Actions (Tự động)
1. Vào repository trên GitHub -> **Settings** -> **Pages**.
2. Tại mục **Source**: Chọn **GitHub Actions**.
3. Workflow tự động chạy trong tab **Actions** sẽ deploy bản build mới nhất.

#### Cách 3: Deploy qua lệnh `npm run deploy` (Nhánh gh-pages)
Chạy lệnh `npm run deploy` ở máy cá nhân để tự động tạo nhánh `gh-pages`. Sau đó chọn branch `gh-pages` và folder `/ (root)` trong GitHub Pages settings.

---

## 🌐 Hướng Dẫn Deploy Full-Stack Node/Express (Render / Cloud Run)
Do ứng dụng bao gồm cả Node/Express server backend cho Gemini API:
1. Tạo Web Service mới trên **Render** hoặc **Railway**.
2. Kết nối tới GitHub Repository vừa push.
3. Cấu hình Build & Start command:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
4. Khai báo biến môi trường `GEMINI_API_KEY` trong bảng điều khiển Environment Variables của dịch vụ hosting.

### Phương án 2: Deploy Static Frontend (Vercel / Netlify)
Nếu chỉ muốn deploy giao diện Frontend (Client-side SPA):
- **Build Command**: `npx vite build`
- **Output Directory**: `dist`

---

## 📜 Giấy Phép (License)

Dự án này phục vụ mục đích nghiên cứu, khảo sát khả thi (Proof of Concept) và demo giải pháp công nghệ Token hóa Tài sản Thực (RWA) cho lĩnh vực Tài chính Xanh tại Việt Nam.
