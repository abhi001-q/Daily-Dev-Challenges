# 🔐 Network Packet Sniffer with Scapy [CYBERSECURITY] — Day 6

**Issue:** [#260](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/260) | Week 1 | Beginner

## 📋 Description

A network packet sniffer built with Scapy. Captures live packets and displays source IP, destination IP, protocol (TCP/UDP/ICMP), and payload size. Saves captures to a `.pcap` file viewable in Wireshark.

> ⚠️ Only use on networks you own or have permission to monitor. Run with root/admin privileges.

## ✨ Features

- Captures TCP, UDP, ICMP packets
- Displays: source IP, destination IP, protocol, payload size
- Saves to `capture.pcap` (Wireshark compatible)
- Configurable packet count and BPF filter

## 🧠 Concepts Practiced

`Scapy` · `TCP/IP layers` · `Packet filtering` · `PCAP`

## 🚀 How to Run

```bash
pip install scapy
# Run as root/admin
python sniffer.py
```

## 🗂 Project Structure

```
devashmit/
├── sniffer.py
└── README.md
```
