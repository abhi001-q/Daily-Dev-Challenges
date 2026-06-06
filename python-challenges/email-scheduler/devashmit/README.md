# 🐍 Email Automation Scheduler — Day 9 Python Challenge

**Issue:** [#286](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/286) | Week 2 | Intermediate

## 📋 Description

A CLI email automation scheduler that reads recipients and message templates from CSV/JSON, schedules emails using APScheduler, and sends via SMTP. Supports dry-run mode and logs every send.

## ✨ Features
- Schedule emails at specific times
- Template variable substitution (`{{name}}`, etc.)
- CSV recipient list support
- SMTP send via `smtplib`
- Dry-run preview mode
- Logging to `scheduler.log`

## 🚀 How to Run
```bash
pip install apscheduler
python scheduler.py --dry-run
python scheduler.py
```
