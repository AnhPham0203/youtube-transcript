# 🎬 YouTube Transcript Extractor

Một ứng dụng web hiện đại giúp bạn lấy phụ đề (transcript) từ bất kỳ video YouTube nào một cách dễ dàng.

## ✨ Tính năng

- 🎯 **Lấy Transcript dễ dàng**: Chỉ cần dán link YouTube và click một nút
- 📋 **Sao chép nhanh**: Copy toàn bộ transcript với một click
- 💾 **Tải xuống**: Lưu transcript dưới dạng file `.txt`
- ⏱️ **Timeline**: Xem chi tiết thời gian cho mỗi dòng phụ đề
- 🎨 **Giao diện đẹp**: Thiết kế modern, responsive với Tailwind CSS
- ⚡ **Nhanh chóng**: Xử lý ngay lập tức nhờ serverless function
- 🌍 **Deploy trên Vercel**: Dễ dàng triển khai và quản lý

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 14+ (App Router)
- **Ngôn ngữ**: TypeScript
- **UI**: Tailwind CSS
- **Backend**: API Routes (Serverless)
- **Transcript Library**: youtubei.js (Stable & Reliable)
- **Hosting**: Vercel

## 📋 Yêu cầu

- Node.js 18+
- npm hoặc yarn

## 🚀 Cài đặt cục bộ

### 1. Clone hoặc tải dự án

```bash
cd youtube-transcript
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Chạy development server

```bash
npm run dev
```

Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)

### 4. Build cho production

```bash
npm run build
npm start
```

## 📝 Cách sử dụng

1. **Dán link YouTube**: Dán link video YouTube vào input field
2. **Nhấn "Lấy Transcript"**: Click nút để bắt đầu lấy phụ đề
3. **Xem kết quả**:
   - 📋 **Sao chép**: Copy toàn bộ text
   - 💾 **Tải xuống**: Lưu thành file
   - ⏱️ **Xem timeline**: Xem thời gian cho từng dòng

### Định dạng URL hỗ trợ

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

## 🔧 Cấu trúc dự án

```
youtube-transcript/
├── app/
│   ├── api/
│   │   └── transcript/
│   │       └── route.ts          # API route để lấy transcript
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Trang chủ
│   └── globals.css               # Global styles
├── components/
│   ├── Header.tsx                # Header component
│   ├── TranscriptForm.tsx        # Form input
│   └── TranscriptDisplay.tsx     # Hiển thị kết quả
├── public/                       # Static files
├── next.config.ts               # Next.js config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
├── vercel.json                  # Vercel config
└── package.json                 # Dependencies
```

## 🌐 Deploy trên Vercel

### Cách 1: Sử dụng Vercel CLI

```bash
npm i -g vercel
vercel
```

### Cách 2: Sử dụng GitHub

1. Push code lên GitHub repository
2. Vào [https://vercel.com/new](https://vercel.com/new)
3. Chọn repository
4. Click Deploy

## ⚙️ Biến môi trường

Tạo file `.env.local` (tùy chọn):

```
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

## 📚 API Endpoint

### GET `/api/transcript`

Kiểm tra API đã sẵn sàng:

```bash
curl http://localhost:3000/api/transcript
```

### POST `/api/transcript`

Lấy transcript từ YouTube:

**Request:**

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response (Success):**

```json
{
  "success": true,
  "data": [
    {
      "text": "Hello everyone",
      "offset": 0,
      "duration": 2000
    },
    {
      "text": "Welcome to the channel",
      "offset": 2000,
      "duration": 2000
    }
  ]
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Video này không có phụ đề hoặc không thể truy cập được."
}
```

## ⚠️ Lưu ý

- ⚠️ **Video phải có phụ đề**: Chỉ có thể lấy transcript từ video có phụ đề
- 🔒 **Không xâm phạm bản quyền**: Chỉ sử dụng cho mục đích hợp pháp
- ⏱️ **Timeout**: API có thời gian timeout 30 giây
- 📍 **Rate limiting**: Có thể bị hạn chế số request trong thời gian ngắn

## 🐛 Xử lý lỗi thông thường

| Lỗi                     | Giải pháp                                       |
| ----------------------- | ----------------------------------------------- |
| "URL không hợp lệ"      | Kiểm tra URL YouTube, nó phải có định dạng đúng |
| "Video không có phụ đề" | Video này không được tác giả tải lên phụ đề     |
| "Video bị hạn chế"      | Video có thể bị age-gated hoặc khóa bởi tác giả |
| "Timeout"               | Video quá dài, hãy thử lại sau                  |

## 📦 Dependencies chính

```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "tailwindcss": "^3.4.0",
  "youtubei.js": "^10.5.0",
  "typescript": "^5.3.0"
}
```

### 🔥 Tại sao dùng youtubei.js?

- ✅ **Ổn định**: API không thay đổi thường xuyên
- ✅ **Chính thức**: Sử dụng InnerTube API của YouTube
- ✅ **Đầy đủ tính năng**: Hỗ trợ nhiều loại transcript
- ✅ **Không phụ thuộc**: Không cần API key
- ✅ **Production-ready**: Được sử dụng bởi nhiều dự án lớn

## 📄 License

MIT - Tự do sử dụng cho mục đích cá nhân và thương mại

## 👨‍💻 Đóng góp

Hãy fork repo này, tạo branch mới, và gửi pull request!

## 📧 Liên hệ

Có câu hỏi? Hãy tạo issue hoặc liên hệ trực tiếp.

---

**Made with ❤️ for YouTube lovers**
