#!/usr/bin/env python3
"""Translate English Strong's definitions to French and merge them into the public dictionaries.

Keeps the short UBS gloss in `g` and stores the full translation in `df`.
Results are cached in scripts/data/strongs-fr-defs.json so rebuilds can reuse them.
"""

from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "Frontend/public/interlinear"
CACHE = ROOT / "scripts/data/strongs-fr-defs.json"
SEP = "\n§§§\n"
MAX_CHARS = 3500


def translate_batch(texts: list[str]) -> list[str]:
    joined = SEP.join(texts)
    url = (
        "https://translate.googleapis.com/translate_a/single"
        f"?client=gtx&sl=en&tl=fr&dt=t&q={urllib.parse.quote(joined)}"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 ScriptureGraph/1.0"})
    with urllib.request.urlopen(req, timeout=45) as response:
        payload = json.loads(response.read().decode())
    translated = "".join(part[0] for part in payload[0] if part and part[0])
    parts = [part.strip() for part in translated.split("§§§")]
    if len(parts) != len(texts):
        raise ValueError(f"separator mismatch: expected {len(texts)}, got {len(parts)}")
    return parts


def translate_one(text: str) -> str:
    url = (
        "https://translate.googleapis.com/translate_a/single"
        f"?client=gtx&sl=en&tl=fr&dt=t&q={urllib.parse.quote(text)}"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 ScriptureGraph/1.0"})
    with urllib.request.urlopen(req, timeout=45) as response:
        payload = json.loads(response.read().decode())
    return "".join(part[0] for part in payload[0] if part and part[0]).strip()


def load_cache() -> dict[str, str]:
    if CACHE.exists():
        return json.loads(CACHE.read_text(encoding="utf-8"))
    return {}


def save_cache(cache: dict[str, str]) -> None:
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=0, sort_keys=True), encoding="utf-8")


def collect_work(cache: dict[str, str]) -> list[tuple[str, str]]:
    pending: list[tuple[str, str]] = []
    seen: set[str] = set()
    for name in ("strongs-he.json", "strongs-el.json"):
        data = json.loads((PUBLIC / name).read_text(encoding="utf-8"))
        for sid, entry in data.items():
            english = (entry.get("d") or "").strip()
            if not english or sid in cache or english in seen:
                continue
            seen.add(english)
            pending.append((sid, english))
    return pending


def chunk_pending(pending: list[tuple[str, str]]) -> list[list[tuple[str, str]]]:
    batches: list[list[tuple[str, str]]] = []
    current: list[tuple[str, str]] = []
    size = 0
    for item in pending:
        extra = len(item[1]) + len(SEP)
        if current and size + extra > MAX_CHARS:
            batches.append(current)
            current = []
            size = 0
        current.append(item)
        size += extra
    if current:
        batches.append(current)
    return batches


def translate_all() -> dict[str, str]:
    cache = load_cache()
    pending = collect_work(cache)
    print(f"cached {len(cache)}, pending unique {len(pending)}")
    batches = chunk_pending(pending)
    for index, batch in enumerate(batches, start=1):
        texts = [text for _, text in batch]
        try:
            translated = translate_batch(texts)
        except Exception as error:
            print(f"  batch {index}/{len(batches)} failed ({error}); falling back to one-by-one")
            translated = []
            for text in texts:
                time.sleep(0.2)
                translated.append(translate_one(text))
        for (sid, english), french in zip(batch, translated):
            cache[sid] = french
            # Reuse the same French for later ids that share this English text.
            cache.setdefault(f"text::{english}", french)
        if index % 5 == 0 or index == len(batches):
            save_cache({k: v for k, v in cache.items() if not k.startswith("text::")})
            print(f"  {index}/{len(batches)} batches")
        time.sleep(0.15)
    # Expand text-level cache to every Strong's id.
    text_map = {k[6:]: v for k, v in cache.items() if k.startswith("text::")}
    for name in ("strongs-he.json", "strongs-el.json"):
        data = json.loads((PUBLIC / name).read_text(encoding="utf-8"))
        for sid, entry in data.items():
            english = (entry.get("d") or "").strip()
            if sid in cache:
                continue
            if english in text_map:
                cache[sid] = text_map[english]
    cleaned = {k: v for k, v in cache.items() if not k.startswith("text::")}
    save_cache(cleaned)
    return cleaned


def merge_into_dictionaries(defs: dict[str, str]) -> None:
    for name in ("strongs-he.json", "strongs-el.json"):
        path = PUBLIC / name
        data = json.loads(path.read_text(encoding="utf-8"))
        moved = 0
        filled = 0
        for sid, entry in data.items():
            current = (entry.get("df") or "").strip()
            full = (defs.get(sid) or "").strip()
            # First-time migration: previous df was a one-word UBS gloss.
            if current and (not entry.get("g")) and (not full or current != full) and len(current.split()) <= 6:
                entry["g"] = current
                moved += 1
            if full:
                entry["df"] = full
                filled += 1
        path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        print(f"{name}: glosses kept {moved}, full French {filled}/{len(data)}")


def main() -> None:
    defs = translate_all()
    merge_into_dictionaries(defs)
    print("done", len(defs), "French definitions")


if __name__ == "__main__":
    main()
