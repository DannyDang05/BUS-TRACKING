# 🚀 Deploy Backend lên Railway

## 📋 Environment Variables cần thêm vào Railway

Vào **Railway Dashboard** → **Backend Service** → **Variables** tab, thêm các biến sau:

### Biến bắt buộc:

```bash
# Server
PORT=6969
NODE_ENV=production
SERVER_URL=https://your-backend-url.up.railway.app

# CORS (thay bằng URL Frontend Vercel thật)
CORS_ORIGIN=https://bus-tracking.vercel.app,https://bus-tracking-git-main.vercel.app

# JWT
JWT_SECRET=BusTrack2025_SecureRandomKey_ABC123XYZ456
SESSION_SECRET=SessionSecret2025_RandomKey_DEF789UVW012

# Database Pool (optional, có default)
DB_POOL_MAX=10
DB_POOL_MIN=2
```

### Biến Railway tự động tạo (từ MySQL service):

Railway sẽ tự động inject các biến này khi bạn link MySQL service:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`

**KHÔNG cần thêm thủ công!**

---

## 🛠️ Các bước deploy:

### 1. Chuẩn bị code

```bash
# Đảm bảo .env không bị commit
git status
# Nếu thấy .env trong changes, xóa khỏi git:
git rm --cached BackEnd/.env
git commit -m "Remove .env from git"
```

### 2. Deploy lên Railway (Cách 1: Railway CLI)

```bash
# Cài Railway CLI
npm install -g @railway/cli

# Login
railway login

# Vào thư mục Backend
cd BackEnd

# Link project
railway link

# Deploy
railway up

# Xem logs
railway logs
```

### 3. Deploy lên Railway (Cách 2: Git Push)

```bash
# Kết nối GitHub repo với Railway project
# Vào Railway Dashboard → Project → Settings → Connect GitHub

# Push code
git add .
git commit -m "Deploy backend to Railway"
git push origin main

# Railway sẽ tự động deploy
```

### 4. Thêm Environment Variables

1. Vào **Railway Dashboard**
2. Chọn **Backend Service**
3. Click **Variables**
4. Thêm từng biến như bên trên
5. Click **Deploy** để apply changes

### 5. Link MySQL Service

1. Vào **Backend Service**
2. Click tab **Settings**
3. Scroll xuống **Service Variables**
4. Click **+ Add Variable Reference**
5. Chọn MySQL service
6. Railway sẽ tự động inject `MYSQL*` variables

### 6. Generate Domain

1. Vào **Backend Service** → **Settings**
2. Scroll xuống **Networking**
3. Click **Generate Domain**
4. Copy URL (VD: `https://bus-tracking-backend.up.railway.app`)
5. Thêm URL này vào biến `SERVER_URL` và `CORS_ORIGIN`

### 7. Test Backend

```bash
# Test health check
curl https://your-backend.up.railway.app/health

# Test API
curl https://your-backend.up.railway.app/api/v1/routes

# Xem logs real-time
railway logs --tail 100
```

---

## ✅ Checklist

- [ ] `.env` đã được thêm vào `.gitignore`
- [ ] Database đã import vào Railway MySQL
- [ ] Đã link MySQL service với Backend service
- [ ] Đã thêm tất cả ENV variables (PORT, CORS_ORIGIN, JWT_SECRET, etc.)
- [ ] Backend đã deploy thành công
- [ ] Generate domain và test API
- [ ] Cập nhật `CORS_ORIGIN` với URL Vercel Frontend
- [ ] Test kết nối WebSocket

---

## 🐛 Debug

### Lỗi Database Connection

```bash
# Kiểm tra logs
railway logs --tail 50

# Kiểm tra biến database
railway variables

# Test connection
railway run node -e "import('./src/config/connectDB.js').then(m => m.checkConnection())"
```

### Lỗi CORS

Đảm bảo `CORS_ORIGIN` không có trailing slash:
```bash
# ✅ Đúng
CORS_ORIGIN=https://bus-tracking.vercel.app

# ❌ Sai
CORS_ORIGIN=https://bus-tracking.vercel.app/
```

### Lỗi Port

Railway tự động assign PORT, đừng hardcode port trong code.

---

## 📞 Support

Nếu gặp vấn đề:
1. Check logs: `railway logs --tail 100`
2. Check variables: `railway variables`
3. Restart service: Railway Dashboard → Deployments → Latest → Restart

---

Sau khi deploy xong, copy **Railway Backend URL** để config Frontend!
