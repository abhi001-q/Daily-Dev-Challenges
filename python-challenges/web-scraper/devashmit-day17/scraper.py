"""Web Scraper with BeautifulSoup — Day 17 Python | Author: devashmit"""
import csv, json, time
import requests
from bs4 import BeautifulSoup

BASE = "http://quotes.toscrape.com"

def scrape_page(url):
    r = requests.get(url, timeout=10); r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    quotes = [{"text":q.select_one("span.text").get_text(strip=True),
               "author":q.select_one("small.author").get_text(strip=True),
               "tags":[t.get_text(strip=True) for t in q.select("a.tag")]}
              for q in soup.select("div.quote")]
    nxt = soup.select_one("li.next > a")
    return quotes, (BASE + nxt["href"]) if nxt else None

def main():
    print("\nScraping quotes.toscrape.com...")
    all_q, page, url = [], 1, BASE
    while url:
        print(f"  Page {page}: {url}")
        q, url = scrape_page(url)
        all_q.extend(q); print(f"    {len(q)} quotes (total: {len(all_q)})")
        page += 1
        if url: time.sleep(1)
    with open("quotes.json","w",encoding="utf-8") as f:
        json.dump(all_q, f, ensure_ascii=False, indent=2)
    with open("quotes.csv","w",newline="",encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["text","author","tags"])
        w.writeheader()
        for q in all_q: w.writerow({**q,"tags":", ".join(q["tags"])})
    print(f"\nDone — {len(all_q)} quotes → quotes.json + quotes.csv")

if __name__ == "__main__": main()
