#!/bin/bash
set -e

echo "=========================================================="
echo "  Deploying Miss Hmong Vientiane 2027 Voting Platform"
echo "=========================================================="

# 1. Update and install Node.js 22 LTS, git, nginx
echo "--> Installing Node.js 22, Git, and Nginx..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get update -y
apt-get install -y nodejs git nginx
npm install -g pm2

# 2. Setup project directory
echo "--> Cloning repository..."
mkdir -p /var/www
cd /var/www
rm -rf miss-hmong-voting
git clone https://github.com/LM131dev/miss-hmong-voting-2027.git miss-hmong-voting
cd miss-hmong-voting

# 3. Install packages & build
echo "--> Installing npm dependencies..."
npm install

echo "--> Building Next.js application..."
npm run build

# 4. Start with PM2
echo "--> Starting with PM2 daemon..."
pm2 delete miss-hmong-voting 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root 2>/dev/null || true

# 5. Configure Nginx Reverse Proxy
echo "--> Configuring Nginx reverse proxy on port 80..."
cat << 'EOF' > /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    client_max_body_size 30M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

nginx -t
systemctl reload nginx

# 6. Configure UFW firewall
echo "--> Configuring firewall..."
ufw allow 22/tcp 2>/dev/null || true
ufw allow 80/tcp 2>/dev/null || true
ufw allow 443/tcp 2>/dev/null || true
ufw --force enable 2>/dev/null || true

echo "=========================================================="
echo "  DEPLOYMENT SUCCESSFUL!"
echo "  Website is LIVE at: http://189.31.37.225"
echo "  Admin Backoffice:   http://189.31.37.225/admin"
echo "=========================================================="
