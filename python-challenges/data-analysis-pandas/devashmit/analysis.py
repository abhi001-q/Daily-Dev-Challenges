"""
Data Analysis with Pandas — Day 10 Python Challenge
Author: devashmit
"""
import os, pandas as pd, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

OUTPUT = "output"
os.makedirs(OUTPUT, exist_ok=True)

def load(path="data/sample_sales.csv"):
    df = pd.read_csv(path)
    print(f"Loaded {len(df)} rows, {len(df.columns)} columns")
    return df

def clean(df):
    before = len(df)
    df = df.drop_duplicates().dropna(subset=["Sales","Category"])
    df["Sales"] = pd.to_numeric(df["Sales"], errors="coerce").fillna(0)
    df["Date"]  = pd.to_datetime(df["Date"], errors="coerce")
    print(f"Cleaned: {before-len(df)} rows removed ({len(df)} remaining)")
    return df

def analyse(df):
    print("\nSales by Category:")
    print(df.groupby("Category")["Sales"].agg(["sum","mean","count"]))

def plot_bar(df):
    ax = df.groupby("Category")["Sales"].sum().sort_values(ascending=False).plot(kind="bar", color="#6366f1", figsize=(9,5))
    ax.set_title("Total Sales by Category"); ax.set_xlabel("Category"); ax.set_ylabel("Sales ($)")
    plt.tight_layout(); plt.savefig(f"{OUTPUT}/sales_by_category.png", dpi=120); plt.close()
    print("Saved output/sales_by_category.png")

def plot_hist(df):
    df["Sales"].dropna().plot(kind="hist", bins=20, color="#4ade80", figsize=(8,5))
    plt.title("Sales Distribution"); plt.xlabel("Amount ($)")
    plt.tight_layout(); plt.savefig(f"{OUTPUT}/sales_histogram.png", dpi=120); plt.close()
    print("Saved output/sales_histogram.png")

def main():
    print("Data Analysis with Pandas\n")
    df = clean(load())
    analyse(df)
    print("\nGenerating charts...")
    plot_bar(df); plot_hist(df)
    print("\nDone.")

if __name__=="__main__": main()
