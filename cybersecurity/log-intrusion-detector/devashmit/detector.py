"""
Log File Intrusion Detector
Day 5 — Cybersecurity Challenge
Author: devashmit
"""

import argparse
import re
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

# ── Thresholds ─────────────────────────────────────────────────────────────────
BRUTE_FORCE_THRESHOLD = 5     # failed logins from same IP
SCAN_404_THRESHOLD    = 10    # 404s from same IP
RAPID_REQ_THRESHOLD   = 30    # requests from same IP in a log window


def parse_access_log(line: str) -> dict | None:
    """Parse Apache/Nginx combined log format."""
    pattern = r'(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) \S+" (\d+) \d+'
    m = re.match(pattern, line)
    if not m:
        return None
    return {
        "ip":     m.group(1),
        "time":   m.group(2),
        "method": m.group(3),
        "path":   m.group(4),
        "status": int(m.group(5)),
    }


def parse_auth_log(line: str) -> dict | None:
    """Parse Linux auth.log for failed password attempts."""
    m = re.search(r"Failed password for .+ from (\S+)", line)
    if m:
        return {"ip": m.group(1), "type": "failed_login"}
    return None


def analyze_access(lines: list[str]) -> dict:
    ip_requests: Counter      = Counter()
    ip_404s:     Counter      = Counter()
    ip_methods:  defaultdict  = defaultdict(Counter)
    threats                   = []

    for line in lines:
        entry = parse_access_log(line)
        if not entry:
            continue
        ip = entry["ip"]
        ip_requests[ip] += 1
        ip_methods[ip][entry["method"]] += 1
        if entry["status"] == 404:
            ip_404s[ip] += 1

    # Detect 404 scanners
    for ip, count in ip_404s.items():
        if count >= SCAN_404_THRESHOLD:
            threats.append({
                "ip": ip,
                "type": "404 Scanner",
                "count": count,
                "detail": f"{count} not-found requests",
            })

    # Detect high-volume requesters
    for ip, count in ip_requests.items():
        if count >= RAPID_REQ_THRESHOLD:
            threats.append({
                "ip": ip,
                "type": "High Request Rate",
                "count": count,
                "detail": f"{count} total requests",
            })

    return {"threats": threats, "ip_requests": ip_requests, "ip_404s": ip_404s}


def analyze_auth(lines: list[str]) -> dict:
    ip_failures: Counter = Counter()
    threats = []

    for line in lines:
        entry = parse_auth_log(line)
        if entry:
            ip_failures[entry["ip"]] += 1

    for ip, count in ip_failures.items():
        if count >= BRUTE_FORCE_THRESHOLD:
            threats.append({
                "ip": ip,
                "type": "Brute Force",
                "count": count,
                "detail": f"{count} failed login attempts",
            })

    return {"threats": threats, "ip_failures": ip_failures}


def generate_report(results: dict, log_type: str, log_path: str) -> str:
    lines = [
        "=" * 55,
        "  INTRUSION DETECTION REPORT",
        f"  Log File : {log_path}",
        f"  Log Type : {log_type.upper()}",
        f"  Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "=" * 55,
        "",
    ]

    threats = results.get("threats", [])
    if not threats:
        lines.append("✅ No suspicious activity detected.")
    else:
        lines.append(f"⚠️  {len(threats)} threat(s) detected:\n")
        for t in sorted(threats, key=lambda x: -x["count"]):
            lines.append(f"  [{t['type']}]")
            lines.append(f"    IP     : {t['ip']}")
            lines.append(f"    Detail : {t['detail']}")
            lines.append("")

    if "ip_requests" in results:
        lines.append("Top 5 IPs by request count:")
        for ip, cnt in results["ip_requests"].most_common(5):
            lines.append(f"  {ip:<18} {cnt} requests")
        lines.append("")

    if "ip_failures" in results:
        lines.append("Top 5 IPs by failed logins:")
        for ip, cnt in results["ip_failures"].most_common(5):
            lines.append(f"  {ip:<18} {cnt} failures")

    lines.append("\n" + "=" * 55)
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Log File Intrusion Detector")
    parser.add_argument("--log",  required=True, help="Path to log file")
    parser.add_argument("--type", choices=["access", "auth"], default="access")
    args = parser.parse_args()

    log_path = Path(args.log)
    if not log_path.exists():
        print(f"Error: '{log_path}' not found.")
        return

    lines = log_path.read_text(errors="ignore").splitlines()
    print(f"\n🔐 Analyzing {len(lines)} lines from {log_path.name}…")

    if args.type == "auth":
        results = analyze_auth(lines)
    else:
        results = analyze_access(lines)

    report = generate_report(results, args.type, str(log_path))
    print("\n" + report)

    report_path = "intrusion_report.txt"
    Path(report_path).write_text(report)
    print(f"\nReport saved to: {report_path}")


if __name__ == "__main__":
    main()
