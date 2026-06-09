# 🐍 Web Scraper with BeautifulSoup — Day 12 Python Challenge

**Issue:** [#314](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/314) | Week 2 | Intermediate

## 📋 Description

Scrapes quotes.toscrape.com — extracts all quotes, authors, and tags across all pages. Handles pagination automatically. Saves to `.json` and `.csv`.

## ✨ Features
- Scrapes all pages via automatic pagination
- Extracts: quote text, author, tags
- Exports to `quotes.json` and `quotes.csv`
- Polite scraping with `time.sleep(1)` between requests

## 🚀 How to Run
```bash
pip install requests beautifulsoup4
python scraper.py
```
