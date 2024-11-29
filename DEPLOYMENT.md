# Deployment Guide for Portfolio2025

This guide explains how to deploy this Angular application on an Ubuntu server.

## Prerequisites

1. Ubuntu Server (20.04 LTS or newer)
2. Node.js (v18.x or newer)
3. Angular CLI
4. Nginx

## Server Setup

1. Update Ubuntu packages:
```bash
sudo apt update
sudo apt upgrade
```

2. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

3. Install Angular CLI:
```bash
npm install -g @angular/cli
```

4. Install Nginx:
```bash
sudo apt install nginx
```

## Application Deployment

1. Clone your repository to the server:
```bash
git clone https://github.com/markbrutx/portfolio2025 /var/www/portfolio2025
cd /var/www/portfolio2025
```

2. Install dependencies and build for production:
```bash
npm install
npm run build:prod
```

3. Configure Nginx:

Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name host;

    root /var/www/portfolio2025/dist/portfolio2025/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression for better performance
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Add security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}
```

4. Set correct permissions:
```bash
sudo chown -R www-data:www-data /var/www/portfolio2025
```

5. Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Updating the Application

When you need to update the application after pushing new changes to GitHub, follow these steps:

1. Connect to your server via SSH
```bash
ssh username@host
```

2. Go to the project directory:
```bash
cd /var/www/portfolio2025
```

3. Pull the latest changes:
```bash
git pull origin main
```

4. Install dependencies (if any new were added):
```bash
npm install
```

5. Build the application:
```bash
npm run build
```

6. Update permissions if needed:
```bash
sudo chown -R www-data:www-data /var/www/portfolio2025
```

7. Restart Nginx (only if you changed Nginx configuration):
```bash
sudo systemctl restart nginx
```

# If you encounter a "dubious ownership" error, first run:
```bash
git config --global --add safe.directory /var/www/portfolio2025
```
## Troubleshooting

1. Check Nginx logs:
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

2. Check if Nginx is running:
```bash
sudo systemctl status nginx
```

3. Verify Nginx configuration:
```bash
sudo nginx -t
```

4. Check Node.js and npm versions:
```bash
node -v
npm -v
```

5. Check Angular CLI version:
```bash
ng version
```

6. Check application files:
```bash
ls -la /var/www/portfolio2025/dist/portfolio2025/browser
```

7. If the site is not updating after deployment:
```bash
# Clear Nginx cache
sudo rm -rf /var/cache/nginx/*

# Restart Nginx
sudo systemctl restart nginx
