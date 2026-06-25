# 🔐 Bash System Monitoring Tool — Day 28 Cybersecurity Challenge

**Issue:** [#450](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/450) | Week 4 | Intermediate

## 📋 Description

Bash script monitoring CPU, RAM, disk, and network connections. Color-coded alerts. Runs as cron job every 5 minutes. Logs to `/var/log/sysmonitor.log`.

## 🚀 How to Run
```bash
chmod +x monitor.sh && ./monitor.sh
# Cron: */5 * * * * /path/to/monitor.sh
```
