# 🔐 Bash System Monitoring Tool — Day 13 Cybersecurity Challenge

**Issue:** [#326](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/326) | Week 2 | Intermediate

## 📋 Description

Bash script monitoring CPU, RAM, disk space, and active network connections. Color-coded alerts. Runs as a cron job every 5 minutes. Logs to `/var/log/sysmonitor.log`.

## ✨ Features
- CPU / RAM / disk / network monitoring
- ANSI colors: 🟢 healthy / 🟡 warning / 🔴 danger
- Logs every run
- Cron-ready (every 5 minutes)

## 🚀 How to Run
```bash
chmod +x monitor.sh && ./monitor.sh
# Cron: */5 * * * * /path/to/monitor.sh
```
