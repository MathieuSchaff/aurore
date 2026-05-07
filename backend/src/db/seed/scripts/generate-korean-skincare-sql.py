#!/usr/bin/env python3
"""
Generate SQL for Korean skincare products import.
  Task A: UPDATE image_url for 80 products with broken/missing images
  Task B: INSERT ~1059 new products from korean-skincare-brands.json

Output: two .sql files in the seed/scripts/ directory
"""

import json
import re
import subprocess
import sys
from pathlib import Path

SEED_DIR = Path(__file__).parent.parent
BRANDS_JSON = SEED_DIR / "data" / "korean-skincare-brands.json"
IMAGES_JSON = SEED_DIR / "data" / "korean-skincare-images.json"
OUT_A = Path(__file__).parent / "task-a-patch-images.sql"
OUT_B = Path(__file__).parent / "task-b-insert-products.sql"

SEED_USER = "019de09c-3403-7f67-8b49-560aecb2d9c9"

# ──────────────────────────────────────────────────────────────────────────────
# DB helpers
# ──────────────────────────────────────────────────────────────────────────────

def psql(sql: str) -> list[str]:
    cmd = [
        "docker", "compose",
        "-f", "docker-compose.yml",
        "-f", "docker-compose.dev.yml",
        "--env-file", ".env.dev",
        "exec", "-T", "db",
        "psql", "-U", "app", "-d", "appdb", "-t", "-A", "-c", sql,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=SEED_DIR.parent.parent.parent.parent)
    if result.returncode != 0:
        print(f"psql error: {result.stderr}", file=sys.stderr)
        sys.exit(1)
    return [line for line in result.stdout.strip().split("\n") if line]


def fetch_existing_slugs() -> set[str]:
    rows = psql("SELECT slug FROM products WHERE category='skincare';")
    return set(rows)


def fetch_products_by_brand_name() -> dict[tuple[str, str], dict]:
    rows = psql("SELECT lower(brand), lower(name), slug, image_url FROM products WHERE category='skincare';")
    result = {}
    for row in rows:
        parts = row.split("|")
        if len(parts) == 4:
            brand, name, slug, image_url = parts
            result[(brand.strip(), name.strip())] = {"slug": slug.strip(), "image_url": image_url.strip()}
    return result


# ──────────────────────────────────────────────────────────────────────────────
# Inference helpers
# ──────────────────────────────────────────────────────────────────────────────

def infer_kind(name: str) -> str:
    n = name.lower()
    if "eye" in n:
        return "eye-cream"
    if "lip" in n:
        return "lip-care"
    if any(x in n for x in ["cleansing foam", "cleansing gel", "cleansing bar", "foam cleanser",
                              "foaming cleanser", "cleansing water", "micellar", "gel cleanser",
                              "cleansing powder", "cleansing milk", "bubble cleanser", "face wash",
                              "makeup remover", "cleansing balm"]):
        return "cleanser"
    if "cleansing oil" in n:
        return "cleanser"
    if any(x in n for x in ["peeling gel", "scrub", "exfoliating", "peel "]):
        return "exfoliant"
    if any(x in n for x in ["toner pad", "clear pad", "soothing pad", "moisture pad",
                              "brightening pad", "niacin pad"]):
        return "toner"
    if "pad" in n:
        return "exfoliant"
    if any(x in n for x in ["sheet mask", "sleeping mask", "overnight mask", "mask pack",
                              "hydrogel mask", "modeling pack", "clay mask"]):
        return "mask"
    if " mask" in n or n.endswith("mask"):
        return "mask"
    if "patch" in n:
        return "patch"
    if any(x in n for x in ["mist", "facial spray"]):
        return "mist"
    if any(x in n for x in ["cleansing foam", "foam"]):
        return "cleanser"
    if "toner" in n or "skin softener" in n:
        return "toner"
    if "facial oil" in n or (n.endswith(" oil") and "cleansing" not in n):
        return "oil"
    if "balm" in n:
        return "balm"
    if any(x in n for x in ["spot cream", "blemish cream", "spot treatment"]):
        return "spot-treatment"
    if any(x in n for x in ["essence", "treatment essence", "activating serum"]):
        return "essence"
    if any(x in n for x in ["serum", "ampoule", "ampule", "booster serum", "concentrate"]):
        return "serum"
    if any(x in n for x in ["cream", "moisturizer", "moisturising", "gel cream", "gel-cream",
                              "emulsion", "lotion", "milk", "fluid"]):
        return "moisturizer"
    return "moisturizer"


def infer_unit(name: str, kind: str) -> str:
    n = name.lower()
    if "bar" in n or "soap" in n:
        return "bar"
    if "spray" in n or "mist" in n:
        return "spray"
    if kind in ("mask", "patch"):
        return "pack"
    if kind == "exfoliant" and "pad" in n:
        return "pack"
    if kind == "toner" and "pad" in n:
        return "pack"
    if kind == "serum":
        return "dropper"
    if kind == "oil":
        return "dropper"
    if kind == "essence":
        return "dropper"
    if kind == "toner":
        return "pump"
    if kind == "cleanser":
        return "tube"
    if kind == "moisturizer":
        return "jar"
    if kind == "eye-cream":
        return "jar"
    if kind == "balm":
        return "jar"
    if kind == "lip-care":
        return "tube"
    if kind == "spot-treatment":
        return "tube"
    if kind == "mist":
        return "spray"
    return "jar"


def parse_quantity(quantity: str | None) -> tuple[int | None, str | None]:
    if not quantity:
        return None, None
    q = quantity.lower().strip()
    # Standard: 100ml, 50g, 30gr
    m = re.match(r"^(\d+(?:\.\d+)?)\s*(ml|g|gr|kg|l)$", q)
    if m:
        unit = m.group(2)
        if unit == "gr":
            unit = "g"
        return int(float(m.group(1))), unit
    # Pcs: 60pcs, 1pc, 30ea
    m = re.match(r"^(\d+)\s*(pcs?|ea|pairs?|sheets?)$", q)
    if m:
        return int(m.group(1)), "pcs"
    # Complex with ml: "120ml / 70 pads", "150ml - 80 pads"
    m = re.search(r"(\d+(?:\.\d+)?)\s*(ml|g|gr)", q)
    if m:
        unit = m.group(2)
        if unit == "gr":
            unit = "g"
        return int(float(m.group(1))), unit
    # Pcs only: "60ea", "70 pads", "60 patches"
    m = re.match(r"^(\d+)\s*(ea|pads?|patches?)$", q)
    if m:
        return int(m.group(1)), "pcs"
    return None, None


def sql_str(s: str | None) -> str:
    if s is None:
        return "NULL"
    escaped = s.replace("'", "''")
    return f"'{escaped}'"


# ──────────────────────────────────────────────────────────────────────────────
# Task A: patch image_url for existing products
# ──────────────────────────────────────────────────────────────────────────────

def generate_task_a(db_index: dict[tuple[str, str], dict]) -> None:
    with open(IMAGES_JSON) as f:
        images_data = json.load(f)

    entries = images_data.get("found", [])
    lines = []
    matched = 0
    unmatched = []

    for entry in entries:
        brand = entry["brand"].lower().strip()
        name = entry["name"].lower().strip()
        image_url = entry["image_url"].strip()

        match = db_index.get((brand, name))
        if match:
            slug = match["slug"]
            lines.append(f"UPDATE products SET image_url = {sql_str(image_url)}, updated_at = now() WHERE slug = {sql_str(slug)};")
            matched += 1
        else:
            unmatched.append(f"  -- {entry['brand']} / {entry['name']}")

    sql = "-- Task A: patch image_url for products with broken/missing images\n"
    sql += f"-- {matched} matched, {len(unmatched)} unmatched\n\n"
    sql += "\n".join(lines)
    if unmatched:
        sql += "\n\n-- UNMATCHED (manual review needed):\n"
        sql += "\n".join(unmatched)

    OUT_A.write_text(sql)
    print(f"Task A: {matched} UPDATE statements → {OUT_A.name}")
    if unmatched:
        print(f"  {len(unmatched)} unmatched entries (see comments in SQL file)")


# ──────────────────────────────────────────────────────────────────────────────
# Task B: insert new products
# ──────────────────────────────────────────────────────────────────────────────

def generate_task_b(existing_slugs: set[str]) -> None:
    with open(BRANDS_JSON) as f:
        brands_data = json.load(f)

    inserts = []
    skipped = 0
    kind_counts: dict[str, int] = {}

    for brand_name, products in brands_data.items():
        for p in products:
            slug = p["slug"]
            if slug in existing_slugs:
                skipped += 1
                continue

            name = p["name"]
            brand = p["brand"]
            inci = p.get("inci") or None
            description = p.get("description") or None
            how_to_use = p.get("how_to_use") or None
            price_cents = p.get("price_cents")
            url = p.get("url") or None
            images = p.get("images") or []
            image_url = images[0] if images else None
            quantity = p.get("quantity")

            kind = infer_kind(name)
            unit = infer_unit(name, kind)
            total_amount, amount_unit = parse_quantity(quantity)

            kind_counts[kind] = kind_counts.get(kind, 0) + 1

            row = (
                f"INSERT INTO products "
                f"(created_by, name, brand, kind, unit, inci, description, "
                f"total_amount, amount_unit, slug, url, image_url, notes, price_cents, category) VALUES ("
                f"'{SEED_USER}', "
                f"{sql_str(name)}, "
                f"{sql_str(brand)}, "
                f"{sql_str(kind)}, "
                f"{sql_str(unit)}, "
                f"{sql_str(inci)}, "
                f"{sql_str(description)}, "
                f"{'NULL' if total_amount is None else total_amount}, "
                f"{sql_str(amount_unit)}, "
                f"{sql_str(slug)}, "
                f"{sql_str(url)}, "
                f"{sql_str(image_url)}, "
                f"{sql_str(how_to_use)}, "
                f"{'NULL' if price_cents is None else price_cents}, "
                f"'skincare'"
                f") ON CONFLICT DO NOTHING;"
            )
            inserts.append(row)

    sql = f"-- Task B: insert {len(inserts)} new Korean skincare products\n"
    sql += f"-- Skipped {skipped} already in DB\n"
    sql += "-- kind distribution:\n"
    for k, c in sorted(kind_counts.items(), key=lambda x: -x[1]):
        sql += f"--   {k}: {c}\n"
    sql += "\n"
    sql += "\n".join(inserts)

    OUT_B.write_text(sql)
    print(f"Task B: {len(inserts)} INSERT statements → {OUT_B.name}")
    print(f"  Skipped {skipped} existing products")
    print(f"  Kind distribution: {dict(sorted(kind_counts.items(), key=lambda x: -x[1]))}")


# ──────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Fetching existing DB state...")
    existing_slugs = fetch_existing_slugs()
    db_index = fetch_products_by_brand_name()
    print(f"  {len(existing_slugs)} skincare products in DB")

    generate_task_a(db_index)
    generate_task_b(existing_slugs)
    print("\nDone. Review the SQL files before running.")
