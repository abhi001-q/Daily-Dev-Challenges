"""
Email Automation Scheduler — Day 9 Python Challenge
Author: devashmit
"""
import argparse, csv, json, logging, smtplib, os
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path

logging.basicConfig(filename="scheduler.log", level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")

# ── Config (set via env vars in production) ──────────────────────────────────
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "your@email.com")
SMTP_PASS = os.getenv("SMTP_PASS", "your_app_password")
FROM_NAME = os.getenv("FROM_NAME", "Daily Dev Challenges")


def render_template(template: str, variables: dict) -> str:
    """Replace {{key}} placeholders with values."""
    for k, v in variables.items():
        template = template.replace(f"{{{{{k}}}}}", v)
    return template


def load_recipients(path: str) -> list[dict]:
    ext = Path(path).suffix.lower()
    if ext == ".csv":
        with open(path, newline="", encoding="utf-8") as f:
            return list(csv.DictReader(f))
    if ext == ".json":
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    raise ValueError(f"Unsupported file: {path}")


def send_email(to_email: str, subject: str, body: str, dry_run: bool) -> None:
    if dry_run:
        print(f"  [DRY RUN] → {to_email}: {subject[:50]}")
        logging.info(f"DRY RUN | to={to_email} subject={subject}")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"{FROM_NAME} <{SMTP_USER}>"
    msg["To"]      = to_email
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, to_email, msg.as_string())
        print(f"  ✅ Sent → {to_email}")
        logging.info(f"SENT | to={to_email} subject={subject}")
    except Exception as e:
        print(f"  ❌ Failed → {to_email}: {e}")
        logging.error(f"FAILED | to={to_email} error={e}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Email Automation Scheduler")
    parser.add_argument("--recipients", default="recipients.csv", help="CSV/JSON recipients file")
    parser.add_argument("--template",   default="template.txt",   help="Email body template file")
    parser.add_argument("--subject",    default="Hello, {{name}}!", help="Email subject (supports {{vars}})")
    parser.add_argument("--dry-run",    action="store_true", help="Preview emails without sending")
    args = parser.parse_args()

    print(f"\n📧 Email Scheduler | Mode: {'DRY RUN' if args.dry_run else 'LIVE'}\n")

    # Load template
    try:
        body_template = Path(args.template).read_text(encoding="utf-8")
    except FileNotFoundError:
        body_template = "Hi {{name}},\n\nThis is a scheduled message.\n\nBest,\n{{sender}}"
        print("  (Using default template — create template.txt to customise)")

    # Load recipients
    try:
        recipients = load_recipients(args.recipients)
    except FileNotFoundError:
        # Demo mode: send to a sample list
        recipients = [
            {"email": "alice@example.com", "name": "Alice"},
            {"email": "bob@example.com",   "name": "Bob"},
        ]
        print("  (recipients.csv not found — using demo list)\n")

    print(f"  Sending to {len(recipients)} recipient(s)...\n")

    for r in recipients:
        email   = r.get("email", "").strip()
        if not email: continue
        subject = render_template(args.subject, {**r, "sender": FROM_NAME})
        body    = render_template(body_template, {**r, "sender": FROM_NAME})
        send_email(email, subject, body, args.dry_run)

    print(f"\nDone. Check scheduler.log for details.")


if __name__ == "__main__":
    main()
