# 🔐 Log File Intrusion Detector [CYBERSECURITY] — Day 5

**Issue:** [#250](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/250) | Week 1 | Intermediate

## 📋 Description

A Python script that analyzes web server/auth log files to detect suspicious activity: brute force attempts, port scans, and anomalous access patterns. Generates a detailed report.

## ✨ Features

- Detects brute force login attempts (> N failures from same IP)
- Detects 404 scanning (high rate of not-found requests)
- Detects rapid repeated requests (rate-based detection)
- Summary report: top offending IPs, attack types
- Exports report to `intrusion_report.txt`
- Works on Apache/Nginx access logs and auth.log format

## 🧠 Concepts Practiced

`Log parsing` · `regex` · `collections.Counter` · `Threat detection`

## 🚀 How to Run

```bash
python detector.py --log access.log
python detector.py --log auth.log --type auth
```

## 🗂 Project Structure

```
devashmit/
├── detector.py
├── sample_access.log
├── intrusion_report.txt  # generated
└── README.md
```
