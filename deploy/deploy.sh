#!/bin/bash
set -e

echo "========================================="
echo "  WithPet Deployment Script"
echo "========================================="

cd /home/ec2-user/withpet

# 1. Pull latest code
echo "[1/6] Pulling latest code..."
git pull origin main

# 2. Build frontend
echo "[2/6] Building frontend..."
cd frontend
npm install --production=false
npm run build
cd ..

# 3. Deploy frontend static files
echo "[3/6] Deploying frontend..."
rm -rf /home/ec2-user/withpet-frontend
cp -r frontend/dist /home/ec2-user/withpet-frontend

# 4. Setup Nginx config
echo "[4/6] Configuring Nginx..."
sudo cp deploy/nginx-withpet.conf /etc/nginx/conf.d/withpet.conf
sudo nginx -t && sudo systemctl reload nginx

# 5. Build and start backend with Docker Compose
echo "[5/6] Building and starting backend..."
docker compose down 2>/dev/null || true
docker compose up -d --build

# 6. Wait and verify
echo "[6/6] Verifying deployment..."
sleep 15

if docker compose ps | grep -q "running"; then
    echo ""
    echo "========================================="
    echo "  Deployment successful!"
    echo "  Backend: http://3.39.125.216:8082"
    echo "  Frontend: http://3.39.125.216"
    echo "  Domain: http://withpet.shop"
    echo "========================================="
else
    echo "ERROR: Backend container not running!"
    docker compose logs --tail=30
    exit 1
fi
