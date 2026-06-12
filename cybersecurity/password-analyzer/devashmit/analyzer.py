"""Password Strength Analyzer — Day 14 Cybersecurity | Author: devashmit"""
import getpass, math, re, sys

COMMON = {"123456","password","123456789","12345678","12345","qwerty","abc123","111111",
          "iloveyou","admin","letmein","monkey","dragon","master","sunshine","princess",
          "welcome","shadow","superman","michael","football","pass","baseball","pokemon",
          "batman","ninja","trustno1","hunter","hello","whatever","donald","access","696969"}

def entropy(pw):
    if not pw: return 0.0
    freq = {}
    for c in pw: freq[c] = freq.get(c,0)+1
    n = len(pw)
    return -sum((f/n)*math.log2(f/n) for f in freq.values())

def analyze(pw):
    score = 0; suggestions = []
    length = len(pw)
    if   length >= 20: score += 30
    elif length >= 12: score += 20
    elif length >= 8:  score += 10; suggestions.append("Use at least 12 characters")
    else:              score += 5;  suggestions.append("Too short — use 12+ characters")

    has_upper  = bool(re.search(r"[A-Z]", pw))
    has_lower  = bool(re.search(r"[a-z]", pw))
    has_digit  = bool(re.search(r"\d",    pw))
    has_symbol = bool(re.search(r"[^A-Za-z0-9]", pw))

    if has_upper:  score += 10
    else:          suggestions.append("Add uppercase letters (A–Z)")
    if has_lower:  score += 10
    else:          suggestions.append("Add lowercase letters (a–z)")
    if has_digit:  score += 10
    else:          suggestions.append("Include numbers (0–9)")
    if has_symbol: score += 10
    else:          suggestions.append("Add symbols (!@#$%)")

    ent = entropy(pw)
    if   ent >= 4.0: score += 20
    elif ent >= 3.0: score += 15
    elif ent >= 2.0: score += 10
    elif ent >= 1.0: score += 5
    else:            suggestions.append("Avoid repetitive characters")

    if pw.lower() in COMMON:
        score = max(0, score - 50)
        suggestions.insert(0, "This is a very common password — never use it")

    if re.search(r"(.)\1{2,}", pw):
        score = max(0, score - 10)
        suggestions.append("Avoid 3+ repeated characters in a row")

    score = min(100, max(0, score))
    if   score >= 80: level = "💚 Strong"
    elif score >= 60: level = "🟡 Moderate"
    elif score >= 40: level = "🟠 Weak"
    else:             level = "🔴 Very Weak"

    return {"score":score,"level":level,"entropy":round(ent,2),"length":length,"suggestions":suggestions}

def main():
    print("\n🔐 Password Strength Analyzer\n")
    while True:
        try: pw = getpass.getpass("   Password (hidden): ")
        except (KeyboardInterrupt, EOFError): print("\nBye."); break
        if not pw: print("   Enter a password.\n"); continue
        r = analyze(pw)
        print(f"\n   Score   : {r['score']}/100  {r['level']}")
        print(f"   Length  : {r['length']} chars")
        print(f"   Entropy : {r['entropy']} bits")
        if r["suggestions"]:
            print("\n   Suggestions:")
            for s in r["suggestions"]: print(f"     • {s}")
        else: print("\n   ✅ Great password!")
        print()
        if input("   Analyze another? (y/n): ").strip().lower() != "y": break
    print()

if __name__ == "__main__": main()
