"""Web Scraper with BeautifulSoup — Day 12 Python | Author: devashmit"""
import csv, json, time
import requests
from bs4 import BeautifulSoup

BASE_URL = "http://quotes.toscrape.com"

def scrape_page(url):
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    quotes = []
    for q in soup.select("div.quote"):
        quotes.append({
            "text":   q.select_one("span.text").get_text(strip=True),
            "author": q.select_one("small.author").get_text(strip=True),
            "tags":   [t.get_text(strip=True) for t in q.select("a.tag")],
        })
    nxt = soup.select_one("li.next > a")
    return quotes, (BASE_URL + nxt["href"]) if nxt else None

def main():
    print("\nScraping quotes.toscrape.com...")
    all_quotes, page, current = [], 1, BASE_URL
    while current:
        print(f"  Page {page}: {current}")
        q, current = scrape_page(current)
        all_quotes.extend(q)
        print(f"    {len(q)} quotes (total: {len(all_quotes)})")
        page += 1
        if current: time.sleep(1)

    with open("quotes.json","w",encoding="utf-8") as f:
        json.dump(all_quotes, f, ensure_ascii=False, indent=2)
    with open("quotes.csv","w",newline="",encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["text","author","tags"])
        w.writeheader()
        for q in all_quotes: w.writerow({**q,"tags":", ".join(q["tags"])})

    print(f"\nDone — {len(all_quotes)} quotes saved to quotes.json and quotes.csv")

if __name__ == "__main__": main()
