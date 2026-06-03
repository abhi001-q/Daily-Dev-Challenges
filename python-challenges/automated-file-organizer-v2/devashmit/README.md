# 🐍 Automated File Organizer [PYTHON] — Day 6

**Issue:** [#257](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/257) | Week 1 | Beginner

## 📋 Description

A CLI tool that scans a folder and automatically sorts files into subfolders by extension. Logs every move. Supports `--dry-run` flag to preview changes.

## ✨ Features

- Organizes into `images/`, `documents/`, `videos/`, `audio/`, `code/`, `others/`
- `--dry-run` preview mode
- `--source` flag for target folder
- Logs every move to `organizer.log`
- Safe duplicate filename handling

## 🚀 How to Run

```bash
python organizer.py --source /path/to/folder --dry-run
python organizer.py --source /path/to/folder
```
