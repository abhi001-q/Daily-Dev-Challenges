"""
Data Analysis with Pandas
Day 5 — Python Challenge
Author: devashmit
"""

import os
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use("Agg")  # non-interactive backend for saving files

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def load_data(path: str = "data/sample_sales.csv") -> pd.DataFrame:
    df = pd.read_csv(path)
    print(f"\n✅ Loaded {len(df)} rows, {len(df.columns)} columns")
    print(f"   Columns: {list(df.columns)}")
    return df


def inspect(df: pd.DataFrame) -> None:
    print("\n── Shape ──────────────────────────")
    print(df.shape)
    print("\n── Head ───────────────────────────")
    print(df.head())
    print("\n── Info ───────────────────────────")
    df.info()
    print("\n── Describe ───────────────────────")
    print(df.describe())
    print("\n── Missing values ─────────────────")
    print(df.isnull().sum())


def clean(df: pd.DataFrame) -> pd.DataFrame:
    before = len(df)
    df = df.drop_duplicates()
    df = df.dropna(subset=["Sales", "Category"])
    df["Sales"] = pd.to_numeric(df["Sales"], errors="coerce").fillna(0)
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    after = len(df)
    print(f"\n🧹 Cleaned: {before - after} rows removed ({after} remaining)")
    return df


def analyse(df: pd.DataFrame) -> None:
    print("\n── Sales by Category ──────────────")
    by_cat = df.groupby("Category")["Sales"].agg(["sum", "mean", "count"])
    by_cat.columns = ["Total Sales", "Avg Sale", "Count"]
    print(by_cat.sort_values("Total Sales", ascending=False))

    print("\n── Top 5 Products ─────────────────")
    if "Product" in df.columns:
        print(df.groupby("Product")["Sales"].sum().nlargest(5))


def plot_bar(df: pd.DataFrame) -> None:
    by_cat = df.groupby("Category")["Sales"].sum().sort_values(ascending=False)
    fig, ax = plt.subplots(figsize=(9, 5))
    ax.bar(by_cat.index, by_cat.values, color="#6366f1", edgecolor="#1a1d2e")
    ax.set_title("Total Sales by Category", fontsize=14, fontweight="bold")
    ax.set_xlabel("Category")
    ax.set_ylabel("Total Sales ($)")
    plt.xticks(rotation=30, ha="right")
    plt.tight_layout()
    plt.savefig(f"{OUTPUT_DIR}/sales_by_category.png", dpi=120)
    plt.close()
    print("  Saved: output/sales_by_category.png")


def plot_histogram(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.hist(df["Sales"].dropna(), bins=30, color="#4ade80", edgecolor="#0f1117")
    ax.set_title("Sales Distribution", fontsize=14, fontweight="bold")
    ax.set_xlabel("Sale Amount ($)")
    ax.set_ylabel("Frequency")
    plt.tight_layout()
    plt.savefig(f"{OUTPUT_DIR}/sales_histogram.png", dpi=120)
    plt.close()
    print("  Saved: output/sales_histogram.png")


def plot_correlation(df: pd.DataFrame) -> None:
    numeric = df.select_dtypes(include="number")
    if numeric.shape[1] < 2:
        print("  Skipping correlation — not enough numeric columns.")
        return
    try:
        import seaborn as sns
        fig, ax = plt.subplots(figsize=(8, 6))
        sns.heatmap(numeric.corr(), annot=True, fmt=".2f", cmap="coolwarm", ax=ax)
        ax.set_title("Correlation Heatmap", fontsize=14, fontweight="bold")
        plt.tight_layout()
        plt.savefig(f"{OUTPUT_DIR}/correlation_heatmap.png", dpi=120)
        plt.close()
        print("  Saved: output/correlation_heatmap.png")
    except ImportError:
        print("  Install seaborn for heatmap: pip install seaborn")


def main() -> None:
    print("🧠 Data Analysis with Pandas")
    df = load_data()
    inspect(df)
    df = clean(df)
    analyse(df)
    print("\n📊 Generating visualizations…")
    plot_bar(df)
    plot_histogram(df)
    plot_correlation(df)
    print("\n✅ Done. Check the output/ folder for charts.")


if __name__ == "__main__":
    main()
