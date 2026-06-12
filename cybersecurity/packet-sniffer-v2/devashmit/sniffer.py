"""
Network Packet Sniffer with Scapy — Day 6 Cybersecurity Challenge
Author: devashmit

ETHICS: Only use on networks you own or have explicit permission to monitor.
Run with root/administrator privileges.
"""

from scapy.all import IP, TCP, UDP, ICMP, sniff, wrpcap

PCAP_FILE = "capture.pcap"
captured  = []

PROTO = {6: "TCP", 17: "UDP", 1: "ICMP"}


def handle_packet(pkt) -> None:
    if not pkt.haslayer(IP):
        return
    ip   = pkt[IP]
    proto = PROTO.get(ip.proto, f"OTHER({ip.proto})")
    size  = len(ip.payload)
    print(f"  [{proto:<5}]  {ip.src:<18} → {ip.dst:<18}  {size} bytes")
    captured.append(pkt)


def main() -> None:
    print("\n🔐 Network Packet Sniffer")
    print("   Only scan networks you own or have permission to monitor.\n")

    try:
        count  = int(input("Packets to capture (e.g. 20): ").strip())
        bpf    = input("BPF filter (e.g. 'tcp', blank = all): ").strip()
    except ValueError:
        count, bpf = 20, ""

    print(f"\n  Capturing {count} packet(s)... Ctrl+C to stop early\n")

    try:
        sniff(filter=bpf or None, prn=handle_packet, count=count, store=False)
    except KeyboardInterrupt:
        print("\n  Stopped by user.")
    except PermissionError:
        print("\nError: Run with root/administrator privileges.")
        return

    if captured:
        wrpcap(PCAP_FILE, captured)
        print(f"\n✅ Captured {len(captured)} packet(s). Saved → {PCAP_FILE}")
    else:
        print("\nNo packets captured.")


if __name__ == "__main__":
    main()
