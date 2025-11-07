# 🌾 AgriSmart - Deployment Guide

## 📋 Prerequisites

- Node.js v18+ and npm
- MongoDB v6+ (local or MongoDB Atlas)
- Git

## 🚀 Deployment Options

### Option 1: Deploy to Render (Recommended - Free Tier Available)

#### Backend Deployment

1. **Create Render Account** at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select `backend` directory as root directory
   - Configure build settings:
     ```
     Build Command: npm install
     Start Command: node server.js
     ```

3. **Set Environment Variables** in Render Dashboard:
   ```
   NODE_ENV=production
   MONGO_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<generate-strong-secret>
   JWT_EXPIRE=30d
   CLIENT_URL=<your-frontend-url>
   ```

4. **MongoDB Atlas Setup** (if not already done):
   - Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Create database user
   - Whitelist IP addresses (0.0.0.0/0 for Render)
   - Get connection string

#### Frontend Deployment

1. **Deploy to Vercel/Netlify**
   
   **Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Navigate to frontend: `cd frontend`
   - Run: `vercel`
   - Follow prompts
   
   **Netlify:**
   - Install Netlify CLI: `npm i -g netlify-cli`
   - Build: `npm run build`
   - Deploy: `netlify deploy --prod`

2. **Set Environment Variables**:
   ```
   VITE_API_URL=<your-render-backend-url>
   VITE_SOCKET_URL=<your-render-backend-url>
   ```

3. **Update Backend CORS**:
   - Add your frontend URL to `CLIENT_URL` in backend environment variables

---

### Option 2: Deploy to Railway

1. **Create Railway Account** at [railway.app](https://railway.app)

2. **Deploy Backend**:
   - New Project → Deploy from GitHub repo
   - Select `backend` directory
   - Add MongoDB plugin or connect to Atlas
   - Set environment variables

3. **Deploy Frontend**:
   - New Project → Deploy from GitHub repo
   - Select `frontend` directory
   - Set `VITE_API_URL` to backend Railway URL

---

### Option 3: VPS Deployment (DigitalOcean, AWS, etc.)

#### Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### Backend Deployment

```bash
# Clone repository
git clone https://github.com/PLP-MERN-Stack-Development/mern-final-project-Brandon05-dev.git
cd mern-final-project-Brandon05-dev/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables

# Start with PM2
pm2 start server.js --name agrismart-backend
pm2 save
pm2 startup
```

#### Frontend Deployment

```bash
cd ../frontend

# Create .env file
nano .env
# Add VITE_API_URL=http://your-server-ip:5000

# Build for production
npm run build

# Copy to nginx directory
sudo cp -r dist/* /var/www/html/
```

#### Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/agrismart
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/agrismart /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL Setup (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔒 Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Use environment variables for all sensitive data
- [ ] Enable CORS only for your frontend domain
- [ ] Use HTTPS in production
- [ ] Set NODE_ENV=production
- [ ] Whitelist specific IPs in MongoDB Atlas
- [ ] Use strong database passwords
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Set up rate limiting (optional)
- [ ] Enable MongoDB authentication

---

## 🧪 Testing Before Deployment

```bash
# Backend tests
cd backend
npm test

# Check for vulnerabilities
npm audit

# Frontend build test
cd ../frontend
npm run build
```

---

## 📊 Monitoring & Maintenance

### Backend Monitoring (PM2)
```bash
pm2 status              # Check status
pm2 logs agrismart-backend  # View logs
pm2 restart agrismart-backend  # Restart
pm2 monit              # Real-time monitoring
```

### Database Backup (MongoDB)
```bash
# Backup
mongodump --uri="mongodb://localhost:27017/agrismart" --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://localhost:27017/agrismart" /backup/20250107
```

---

## 🌐 Environment Variables Reference

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/agrismart
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=30d
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com
VITE_SOCKET_URL=https://your-backend-domain.com
```

---

## 📝 Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test Farmer product creation
- [ ] Test Buyer order placement
- [ ] Verify real-time notifications work
- [ ] Test all CRUD operations
- [ ] Check mobile responsiveness
- [ ] Verify HTTPS redirect works
- [ ] Monitor error logs for 24-48 hours
- [ ] Set up uptime monitoring (UptimeRobot, etc.)

---

## 🔧 Troubleshooting

### Socket.io Not Connecting
- Ensure WebSocket is enabled on your hosting provider
- Check CORS settings in backend
- Verify VITE_SOCKET_URL is correct

### MongoDB Connection Issues
- Check IP whitelist in Atlas
- Verify connection string format
- Test connection with MongoDB Compass

### Frontend Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for missing environment variables
- Verify all imports use correct paths

---

## 📞 Support

For issues, check:
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Render Docs](https://render.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**🎉 Your AgriSmart marketplace is ready for production!**
