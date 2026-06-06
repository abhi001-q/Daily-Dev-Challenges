"""
Password Strength Analyzer — Day 9 Cybersecurity Challenge
Author: devashmit
"""
import getpass, math, re, sys

# Top 50 most common passwords (representative sample)
COMMON_PASSWORDS = {
    "123456","password","123456789","12345678","12345","1234567","1234567890",
    "qwerty","abc123","111111","iloveyou","admin","letmein","monkey","1234",
    "dragon","master","sunshine","princess","welcome","shadow","superman",
    "michael","football","pass","baseball","soccer","pokemon","batman","ninja",
    "harley","trustno1","hunter","ranger","buster","thomas","tiger","robert",
    "charlie","ashley","jessica","jennifer","pepper","joshua","george","andrew",
    "maggie","666666","hello","whatever","donald","access","696969","batman",
}


def entropy(password: str) -> float:
    """Shannon entropy in bits."""
    if not password: return 0.0
    freq = {}
    for c in password:
        freq[c] = freq.get(c, 0) + 1
    n = len(password)
    return -sum((f/n) * math.log2(f/n) for f in freq.values())


def analyze(password: str) -> dict:
    score = 0
    suggestions = []

    # Length scoring (max 30)
    length = len(password)
    if   length >= 20: score += 30
    elif length >= 16: score += 25
    elif length >= 12: score += 20
    elif length >= 8:  score += 10; suggestions.append("Use at least 12 characters for better security")
    elif length >= 6:  score += 5;  suggestions.append("Password is too short — aim for 12+ characters")
    else:              suggestions.append("Password is way too short")

    # Character mix (max 40)
    has_upper  = bool(re.search(r"[A-Z]", password))
    has_lower  = bool(re.search(r"[a-z]", password))
    has_digit  = bool(re.search(r"\d",    password))
    has_symbol = bool(re.search(r"[^A-Za-z0-9]", password))

    if has_upper:  score += 10
    else:          suggestions.append("Add uppercase letters (A–Z)")
    if has_lower:  score += 10
    else:          suggestions.append("Add lowercase letters (a–z)")
    if has_digit:  score += 10
    else:          suggestions.append("Include numbers (0–9)")
    if has_symbol: score += 10
    else:          suggestions.append("Add symbols (!@#$%^&*)")

    # Entropy bonus (max 20)
    ent = entropy(password)
    if   ent >= 4.0: score += 20
    elif ent >= 3.0: score += 15
    elif ent >= 2.0: score += 10
    elif ent >= 1.0: score += 5
    else:            suggestions.append("Avoid repetitive characters")

    # Common password penalty
    if password.lower() in COMMON_PASSWORDS:
        score = max(0, score - 50)
        suggestions.insert(0, "This is a very common password — never use it")

    # Repeated chars penalty
    if re.search(r"(.)\1{2,}", password):
        score = max(0, score - 10)
        suggestions.append("Avoid 3+ repeated characters in a row")

    # Sequential penalty
    sequences = ["abcdefghijklmnopqrstuvwxyz", "0123456789", "qwertyuiop", "asdfghjkl"]
    for seq in sequences:
        for i in range(len(seq) - 3):
            if seq[i:i+4] in password.lower():
                score = max(0, score - 10)
                suggestions.append("Avoid sequential characters (abc, 1234, qwer)")
                break

    score = min(100, max(0, score))

    if   score >= 80: level = "💚 Strong"
    elif score >= 60: level = "🟡 Moderate"
    elif score >= 40: level = "🟠 Weak"
    else:             level = "🔴 Very Weak"

    return {"score": score, "level": level, "entropy": round(ent, 2),
            "length": length, "suggestions": suggestions}


def main() -> None:
    print("\n🔐 Password Strength Analyzer")
    print("   Enter a password to analyze (input is hidden).\n")

    while True:
        try:
            password = getpass.getpass("   Password: ")
        except (KeyboardInterrupt, EOFError):
            print("\nExiting.")
            sys.exit(0)

        if not password:
            print("   Please enter a password.\n")
            continue

        result = analyze(password)

        print(f"\n   Score   : {result['score']}/100  {result['level']}")
        print(f"   Length  : {result['length']} characters")
        print(f"   Entropy : {result['entropy']} bits")

        if result["suggestions"]:
            print("\n   Suggestions:")
            for s in result["suggestions"]:
                print(f"     • {s}")
        else:
            print("\n   ✅ Great password — no suggestions!")

        print()
        again = input("   Analyze another? (y/n): ").strip().lower()
        if again != "y":
            break

    print("\nStay secure! 🔒\n")


if __name__ == "__main__":
    main()
