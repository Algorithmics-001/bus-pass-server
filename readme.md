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

# sudoers for ci/cd
```
github ALL=NOPASSWD: /usr/bin/systemctl stop bus-pass-mobile-api,/usr/bin/systemctl stop bus-college-api,/usr/bin/systemctl stop bus-pass-service-api,/usr/bin/systemctl stop bus-pass-admin-api, /usr/bin/systemctl restart bus-pass-mobile-api, /usr/bin/systemctl restart bus-pass-api-update, /usr/bin/systemctl stop meet-share, /usr/bin/systemctl restart meet-share, /usr/bin/systemctl restart bus-pass-college-api, /usr/bin/systemctl restart bus-pass-service-api, /usr/bin/systemctl restart bus-pass-admin-api
```