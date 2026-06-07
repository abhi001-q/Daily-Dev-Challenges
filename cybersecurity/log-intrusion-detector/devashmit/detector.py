"""
Log File Intrusion Detector — Day 10 Cybersecurity Challenge
Author: devashmit
"""
import argparse, re
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

BRUTE_FORCE_THRESHOLD = 5
SCAN_404_THRESHOLD    = 10
RAPID_REQ_THRESHOLD   = 30

def parse_access_log(line):
    m = re.match(r'(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) \S+" (\d+) \d+', line)
    if not m: return None
    return {"ip":m.group(1),"method":m.group(3),"path":m.group(4),"status":int(m.group(5))}

def parse_auth_log(line):
    m = re.search(r"Failed password for .+ from (\S+)", line)
    return {"ip":m.group(1),"type":"failed_login"} if m else None

def analyze_access(lines):
    ip_req = Counter(); ip_404 = Counter(); threats = []
    for l in lines:
        e = parse_access_log(l)
        if not e: continue
        ip_req[e["ip"]] += 1
        if e["status"] == 404: ip_404[e["ip"]] += 1
    for ip,cnt in ip_404.items():
        if cnt >= SCAN_404_THRESHOLD:
            threats.append({"ip":ip,"type":"404 Scanner","count":cnt,"detail":f"{cnt} not-found requests"})
    for ip,cnt in ip_req.items():
        if cnt >= RAPID_REQ_THRESHOLD:
            threats.append({"ip":ip,"type":"High Request Rate","count":cnt,"detail":f"{cnt} total requests"})
    return {"threats":threats,"ip_requests":ip_req,"ip_404s":ip_404}

def analyze_auth(lines):
    ip_fail = Counter(); threats = []
    for l in lines:
        e = parse_auth_log(l)
        if e: ip_fail[e["ip"]] += 1
    for ip,cnt in ip_fail.items():
        if cnt >= BRUTE_FORCE_THRESHOLD:
            threats.append({"ip":ip,"type":"Brute Force","count":cnt,"detail":f"{cnt} failed login attempts"})
    return {"threats":threats,"ip_failures":ip_fail}

def report(results, log_type, log_path):
    lines = ["="*55,"  INTRUSION DETECTION REPORT",
             f"  Log File : {log_path}",f"  Log Type : {log_type.upper()}",
             f"  Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}","="*55,""]
    threats = results.get("threats",[])
    if not threats:
        lines.append("No suspicious activity detected.")
    else:
        lines.append(f"{len(threats)} threat(s) detected:\n")
        for t in sorted(threats,key=lambda x:-x["count"]):
            lines += [f"  [{t['type']}]",f"    IP     : {t['ip']}",f"    Detail : {t['detail']}",""]
    if "ip_requests" in results:
        lines.append("Top 5 IPs:"); 
        for ip,c in results["ip_requests"].most_common(5): lines.append(f"  {ip:<18} {c} requests")
    return "\n".join(lines)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--log", required=True)
    parser.add_argument("--type", choices=["access","auth"], default="access")
    args = parser.parse_args()
    path = Path(args.log)
    if not path.exists(): print(f"Error: {path} not found"); return
    lines = path.read_text(errors="ignore").splitlines()
    print(f"\nAnalyzing {len(lines)} lines from {path.name}...")
    results = analyze_auth(lines) if args.type=="auth" else analyze_access(lines)
    r = report(results, args.type, str(path))
    print("\n"+r)
    Path("intrusion_report.txt").write_text(r)
    print(f"\nReport saved to intrusion_report.txt")

if __name__=="__main__": main()
