"""
Automated File Organizer — Day 6 Python Challenge
Author: devashmit
"""
import argparse, logging, os, shutil
from pathlib import Path

CATEGORIES = {
    "images":    {".jpg",".jpeg",".png",".gif",".bmp",".svg",".webp",".ico",".tiff"},
    "documents": {".pdf",".doc",".docx",".xls",".xlsx",".ppt",".pptx",".txt",".md",".csv"},
    "videos":    {".mp4",".mov",".avi",".mkv",".wmv",".flv",".webm"},
    "audio":     {".mp3",".wav",".flac",".aac",".ogg",".m4a"},
    "archives":  {".zip",".tar",".gz",".rar",".7z"},
    "code":      {".py",".js",".ts",".html",".css",".json",".xml",".yaml",".sh",".jsx",".tsx"},
}

def get_category(ext: str) -> str:
    for cat, exts in CATEGORIES.items():
        if ext.lower() in exts: return cat
    return "others"

def organize(source: Path, dry_run: bool) -> None:
    moved = 0
    for item in source.iterdir():
        if item.is_dir() or item.name.startswith(".") or item.name == "organizer.log": continue
        cat = get_category(item.suffix)
        dest_dir = source / cat
        dest = dest_dir / item.name
        n = 1
        while dest.exists():
            dest = dest_dir / f"{item.stem}_{n}{item.suffix}"; n += 1
        if dry_run:
            print(f"  [DRY RUN] {item.name} → {cat}/{dest.name}")
            logging.info(f"DRY RUN | {item.name} → {cat}/{dest.name}")
        else:
            dest_dir.mkdir(exist_ok=True)
            shutil.move(str(item), str(dest))
            print(f"  Moved: {item.name} → {cat}/{dest.name}")
            logging.info(f"MOVED | {item.name} → {cat}/{dest.name}")
            moved += 1
    print(f"\n{'Preview done' if dry_run else f'Done — {moved} file(s) moved'}.")

def main():
    parser = argparse.ArgumentParser(description="Auto File Organizer")
    parser.add_argument("--source", default=".", help="Folder to organize")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    source = Path(args.source).resolve()
    logging.basicConfig(filename=str(source/"organizer.log"), level=logging.INFO,
                        format="%(asctime)s %(message)s")
    print(f"\n🐍 File Organizer | Source: {source} | Mode: {'DRY RUN' if args.dry_run else 'LIVE'}\n")
    organize(source, args.dry_run)

if __name__ == "__main__": main()
