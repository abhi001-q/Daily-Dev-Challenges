# 🔐 Log File Intrusion Detector — Day 10 Cybersecurity Challenge

**Issue:** [#299](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/299) | Week 2 | Intermediate

## 📋 Description

Analyzes web server/auth logs to detect brute force attempts, 404 scanners, and rapid request patterns. Generates a detailed intrusion report.

## ✨ Features
- Brute force detection (repeated failed logins)
- 404 scanner detection
- High-rate request detection
- Report export to `intrusion_report.txt`
- Works on Apache/Nginx access logs and auth.log

## 🚀 How to Run
```bash
python detector.py --log sample_access.log
python detector.py --log auth.log --type auth
```
