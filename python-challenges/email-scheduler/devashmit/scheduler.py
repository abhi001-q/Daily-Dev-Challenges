"""Email Automation Scheduler — Day 14 Python | Author: devashmit"""
import argparse, csv, json, logging, os, smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

logging.basicConfig(filename="scheduler.log", level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "your@email.com")
SMTP_PASS = os.getenv("SMTP_PASS", "your_app_password")
FROM_NAME = os.getenv("FROM_NAME", "Daily Dev Challenges")

def render(template, variables):
    for k, v in variables.items():
        template = template.replace(f"{{{{{k}}}}}", v)
    return template

def load_recipients(path):
    ext = Path(path).suffix.lower()
    if ext == ".csv":
        with open(path, newline="", encoding="utf-8") as f:
            return list(csv.DictReader(f))
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def send_email(to, subject, body, dry_run):
    if dry_run:
        print(f"  [DRY RUN] → {to}: {subject[:50]}")
        logging.info(f"DRY RUN | to={to} subject={subject}")
        return
    msg = MIMEMultipart()
    msg["Subject"] = subject
    msg["From"] = f"{FROM_NAME} <{SMTP_USER}>"
    msg["To"] = to
    msg.attach(MIMEText(body, "plain"))
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
            s.ehlo(); s.starttls(); s.login(SMTP_USER, SMTP_PASS)
            s.sendmail(SMTP_USER, to, msg.as_string())
        print(f"  ✅ Sent → {to}"); logging.info(f"SENT | to={to}")
    except Exception as e:
        print(f"  ❌ Failed → {to}: {e}"); logging.error(f"FAILED | to={to} error={e}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--recipients", default="recipients.csv")
    parser.add_argument("--template", default="template.txt")
    parser.add_argument("--subject", default="Hello, {{name}}!")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    print(f"\n📧 Email Scheduler | {'DRY RUN' if args.dry_run else 'LIVE'}\n")

    try:
        body_tpl = Path(args.template).read_text(encoding="utf-8")
    except FileNotFoundError:
        body_tpl = "Hi {{name}},\n\nThis is a scheduled message.\n\nBest,\n{{sender}}"
        print("  (Using default template)")

    try:
        recipients = load_recipients(args.recipients)
    except FileNotFoundError:
        recipients = [{"email":"alice@example.com","name":"Alice"},{"email":"bob@example.com","name":"Bob"}]
        print("  (recipients.csv not found — using demo list)\n")

    print(f"  Sending to {len(recipients)} recipient(s)...\n")
    for r in recipients:
        email = r.get("email","").strip()
        if not email: continue
        subject = render(args.subject, {**r, "sender": FROM_NAME})
        body    = render(body_tpl,     {**r, "sender": FROM_NAME})
        send_email(email, subject, body, args.dry_run)
    print("\nDone. Check scheduler.log for details.")

if __name__ == "__main__": main()
