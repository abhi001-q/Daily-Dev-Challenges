# 🐍 Email Automation Scheduler — Day 14 Python Challenge

**Issue:** [#332](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/332) | Week 2 | Intermediate

## 📋 Description

CLI email automation scheduler. Reads recipients from CSV, uses template variable substitution, sends via SMTP. Supports `--dry-run` mode and logs every send.

## ✨ Features
- CSV recipient list
- Template `{{name}}` substitution
- SMTP send via `smtplib`
- `--dry-run` preview mode
- Logging to `scheduler.log`

## 🚀 How to Run
```bash
python scheduler.py --dry-run
python scheduler.py
```
