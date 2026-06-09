"""Multi-threaded Port Scanner — Day 12 Cybersecurity | Author: devashmit
ETHICS: Only scan systems you own or have permission to scan."""
import socket, threading
from datetime import datetime

SERVICES={21:"FTP",22:"SSH",23:"Telnet",25:"SMTP",53:"DNS",80:"HTTP",110:"POP3",143:"IMAP",443:"HTTPS",445:"SMB",3306:"MySQL",3389:"RDP",5432:"PostgreSQL",6379:"Redis",8080:"HTTP-Alt"}
open_ports=[]; lock=threading.Lock()

def scan(target, port):
    try:
        s=socket.socket(socket.AF_INET,socket.SOCK_STREAM); s.settimeout(0.5)
        if s.connect_ex((target,port))==0:
            svc=SERVICES.get(port,"Unknown")
            with lock: open_ports.append((port,svc)); print(f"  [OPEN] {port:<6} {svc}")
        s.close()
    except: pass

def main():
    print("\n🔐 Multi-threaded Port Scanner\n   Only scan systems you own or have permission to scan.\n")
    target=input("Target IP: ").strip()
    try: ip=socket.gethostbyname(target)
    except: print("Cannot resolve host"); return
    try: start=int(input("Start port: ")); end=int(input("End port:   "))
    except: print("Invalid ports"); return

    print(f"\n  Scanning {ip} ports {start}-{end}...\n")
    ts=[]; 
    for p in range(start,end+1):
        t=threading.Thread(target=scan,args=(ip,p),daemon=True); ts.append(t); t.start()
        if len(ts)>=100: [x.join() for x in ts]; ts=[]
    [x.join() for x in ts]

    print(f"\n  {len(open_ports)} open port(s) found.")
    with open("scan_report.txt","w") as f:
        f.write(f"Scan Report\nTarget: {ip}\nDate: {datetime.now()}\n\n")
        for port,svc in sorted(open_ports): f.write(f"  Port {port:5d}  {svc}\n")
    print("  Report saved to scan_report.txt")

if __name__=="__main__": main()
