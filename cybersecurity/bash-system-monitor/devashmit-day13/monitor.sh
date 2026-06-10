#!/usr/bin/env bash
# Bash System Monitoring Tool — Day 13 Cybersecurity | Author: devashmit
# Cron: */5 * * * * /path/to/monitor.sh

CPU_WARN=70; CPU_CRIT=90; RAM_WARN=75; RAM_CRIT=90; DISK_WARN=80; DISK_CRIT=95
LOG_FILE="/var/log/sysmonitor.log"; TS=$(date '+%Y-%m-%d %H:%M:%S')
RED='\033[0;31m'; YEL='\033[0;33m'; GRN='\033[0;32m'; BOLD='\033[1m'; RST='\033[0m'

colorize(){ local v=$1 w=$2 c=$3
  if (( $(echo "$v >= $c"|bc -l) )); then echo -e "${RED}${v}%${RST}"
  elif (( $(echo "$v >= $w"|bc -l) )); then echo -e "${YEL}${v}%${RST}"
  else echo -e "${GRN}${v}%${RST}"; fi; }

log(){ echo -e "$1"; echo "[$TS] $(echo "$1"|sed 's/\x1b\[[0-9;]*m//g')" >> "$LOG_FILE" 2>/dev/null||true; }

get_cpu(){ local idle; idle=$(top -bn1|grep "Cpu(s)"|awk '{print $8}'|tr -d '%,')
  [[ -z "$idle" ]] && idle=0; printf "%.1f" "$(echo "100 - $idle"|bc -l)"; }

get_ram(){ free|awk '/^Mem:/{printf "%.1f",($3/$2)*100}'; }

main(){
  echo ""
  log "${BOLD}╔══════════════════════════════╗${RST}"
  log "${BOLD}║  System Monitor — $TS  ║${RST}"
  log "${BOLD}╚══════════════════════════════╝${RST}"
  echo ""
  log "  ${BOLD}CPU:${RST}  $(colorize "$(get_cpu)" $CPU_WARN $CPU_CRIT)"
  log "  ${BOLD}RAM:${RST}  $(colorize "$(get_ram)" $RAM_WARN $RAM_CRIT)"
  echo ""
  log "  ${BOLD}Disk:${RST}"
  while IFS= read -r line; do
    mount=$(echo "$line"|awk '{print $1}'); pct=$(echo "$line"|awk '{print $2}'|tr -d '%')
    [[ -n "$pct" ]] && log "    $mount  $(colorize "$pct" $DISK_WARN $DISK_CRIT)"
  done <<< "$(df -h --output=target,pcent|tail -n +2|grep -v 'tmpfs\|udev\|loop')"
  echo ""
  conns=$(ss -tn state established 2>/dev/null|tail -n +2|wc -l)
  nc="${GRN}"; (( conns >= 500 )) && nc="${RED}"; (( conns >= 100 && conns < 500 )) && nc="${YEL}"
  log "  ${BOLD}Connections:${RST}  ${nc}${conns}${RST}"
  echo ""
}
main
