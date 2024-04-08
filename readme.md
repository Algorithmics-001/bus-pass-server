# Project Stucture

- bus-service-web contains the api for web interface of bus service
- college-web contains the api for web interface of bus service
- super-admin-web contains the api for web interface of bus service

# Systemd service example for mobile-app:
```
[Unit]
Description=Bus Pass API Service
Documentation=https://github.com/amr/bus-pass-api
After=network.target

[Service]
Type=simple
User=github
WorkingDirectory=/home/github/bus-pass-server/mobile-app/
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```