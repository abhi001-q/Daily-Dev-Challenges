# 🔐 Multi-threaded Port Scanner — Day 12 Cybersecurity Challenge

**Issue:** [#317](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/317) | Week 2 | Beginner

## 📋 Description

Multi-threaded port scanner using `socket` + `threading`. Scans a given IP for open ports, displays service names for common ports, exports a scan report.

> ⚠️ Only scan systems you own or have explicit permission to scan.

## ✨ Features
- Multi-threaded scanning (configurable thread count)
- 0.5s timeout per port
- Service name lookup for common ports
- Exports to `scan_report.txt`

## 🚀 How to Run
```bash
python port_scanner.py
```
