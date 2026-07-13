"""
scraper.py — Caleb University FAQ Knowledge Base Builder
=========================================================
Uses Playwright (real headless Chrome) to bypass Cloudflare bot
protection and scrape key public pages from calebuniversity.edu.ng.

SETUP (run once):
    pip install playwright beautifulsoup4
    playwright install chromium

USAGE:
    python3 scraper.py

OUTPUT:
    scraped_knowledge.txt — paste its contents into FAQ_KNOWLEDGE in chat.mjs
"""

import time
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

# Public pages to scrape — no login required
PAGES = [
    {"label": "UNIVERSITY OVERVIEW",      "url": "https://calebuniversity.edu.ng/university/"},
    {"label": "REGISTRY",                  "url": "https://calebuniversity.edu.ng/registry/"},
    {"label": "ADMISSIONS",               "url": "https://calebuniversity.edu.ng/admissions-2/"},
    {"label": "UNDERGRADUATE PROGRAMMES", "url": "https://calebuniversity.edu.ng/undergraduate/"},
    {"label": "COLLEGES",                 "url": "https://calebuniversity.edu.ng/colleges/"},
    {"label": "BURSARY",                  "url": "https://calebuniversity.edu.ng/bursary/"},
    {"label": "LIBRARY",                  "url": "https://calebuniversity.edu.ng/library-2/"},
    {"label": "STUDENT AFFAIRS",          "url": "https://calebuniversity.edu.ng/student-affairs/"},
]

# Text fragments to skip — nav items, social links, legal boilerplate
SKIP_FRAGMENTS = [
    "follow us", "facebook", "youtube", "whatsapp",
    "skip to content", "copyright", "all rights reserved",
    "home", "about us", "academics", "life on campus",
    "news reel", "portal", "alumni", "cookie",
]

# Tags whose content we never want
SKIP_TAGS = {"nav", "header", "footer", "script", "style", "noscript", "iframe"}


def clean_html(html: str, url: str) -> str:
    soup = BeautifulSoup(html, "html.parser")

    # Remove unwanted tags
    for tag in soup.find_all(SKIP_TAGS):
        tag.decompose()

    # Prefer main content area
    main = (
        soup.find("main")
        or soup.find("article")
        or soup.find(id="content")
        or soup.find(class_="entry-content")
        or soup.find(class_="elementor-section-wrap")
        or soup.body
    )
    if not main:
        return f"(Could not extract content from {url})"

    lines = []
    seen = set()

    for el in main.find_all(["h1","h2","h3","h4","h5","p","li","td","th","strong"]):
        text = el.get_text(separator=" ", strip=True)
        if (
            len(text) < 25
            or text in seen
            or any(skip in text.lower() for skip in SKIP_FRAGMENTS)
        ):
            continue
        seen.add(text)
        lines.append(text)

    return "\n".join(lines)


def scrape_all():
    sections = []

    with sync_playwright() as p:
        # Launch real Chromium — passes Cloudflare checks
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/125.0.0.0 Safari/537.36"
            ),
            locale="en-US",
            viewport={"width": 1280, "height": 800},
        )
        page = context.new_page()

        for item in PAGES:
            label = item["label"]
            url   = item["url"]
            print(f"  Scraping [{label}]: {url}")

            try:
                page.goto(url, wait_until="domcontentloaded", timeout=20000)
                # Wait a moment for any JS-rendered content to settle
                time.sleep(2)
                html    = page.content()
                content = clean_html(html, url)
                sections.append(f"[{label}]\nSource: {url}\n\n{content}\n")
                print(f"    OK — {len(content)} chars extracted")
            except Exception as e:
                print(f"    ! Failed: {e}")
                sections.append(f"[{label}]\n(Failed to scrape {url}: {e})\n")

            time.sleep(1.5)   # polite delay between pages

        browser.close()

    return sections


def main():
    print("Caleb University FAQ Scraper (Playwright)")
    print("=" * 45)

    sections = scrape_all()

    divider = "\n" + ("=" * 60) + "\n"
    output  = divider.join(sections)

    with open("scraped_knowledge.txt", "w", encoding="utf-8") as f:
        f.write(output)

    print("\n✅  Done! Written to: scraped_knowledge.txt")
    print("    Copy its contents into FAQ_KNOWLEDGE in chat.mjs")
    print("    Then redeploy: netlify deploy --prod")


if __name__ == "__main__":
    main()
