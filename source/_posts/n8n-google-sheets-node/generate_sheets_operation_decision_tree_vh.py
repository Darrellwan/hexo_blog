#!/usr/bin/env python3
import os
from pathlib import Path

MPLCONFIGDIR = Path("/private/tmp/matplotlib-cache")
MPLCONFIGDIR.mkdir(parents=True, exist_ok=True)
os.environ.setdefault("MPLCONFIGDIR", str(MPLCONFIGDIR))

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch, Polygon, Rectangle
from PIL import Image


WIDTH = 1440
HEIGHT = 860
DPI = 150

FONT_PATH = "/System/Library/AssetsV2/com_apple_MobileAsset_Font8/86ba2c91f017a3749571a82f2c6d890ac7ffb2fb.asset/AssetData/PingFang.ttc"
OUTPUT_PATH = Path(
    "/Users/darrellwang/Darrell/code/blog/source/_posts/n8n-google-sheets-node/sheets_operation_decision_tree_vh.png"
)

BG = "#ffffff"
SURFACE = "#f6fdf9"
GREEN_HEADER = "#1a7f4b"
GREEN_BADGE = "#188038"
GREEN_BORDER = "#34a853"
GREEN_LIGHT = "#e6f4ea"
AMBER_BG = "#e37400"
AMBER_TEXT = "#ffffff"
DARK = "#1f2937"
MUTED = "#6b7280"
SEPARATOR = "#d1fae5"
GRAY = "#cccccc"
WHITE = "#ffffff"

SLOTS = [105, 210, 320, 425, 535, 640, 735, 820]
GROUPS = [
    ("新增資料", 158),
    ("修改資料", 372),
    ("讀取資料", 588),
    ("清空/刪除", 778),
]
ROWS = [
    ("怕重複寫入 (訂單、發票、Email)", "★  Append or Update Row", True),
    ("不怕重複 (log、留言)", "Append Row", False),
    ("只知道某欄位值（如 Email）", "★  Append or Update Row", True),
    ("已知 Row Number", "Update Row", False),
    ("讀全部或指定範圍", "Get Rows", False),
    ("需要篩選特定條件", "Get Rows + Filters", False),
    ("清空內容，保留欄位格式", "Clear", False),
    ("刪掉整列或整欄", "Delete Rows or Columns", False),
]
BANDS = [
    (72, 265, SURFACE),
    (265, 465, BG),
    (465, 685, SURFACE),
    (685, 845, BG),
]


def px_to_pt(px):
    return px * 72 / DPI


def add_text(ax, x, y, text, size, color, *, ha="left", va="center", weight="normal", linespacing=1.2):
    font = FontProperties(fname=FONT_PATH, size=px_to_pt(size), weight=weight)
    ax.text(
        x,
        y,
        text,
        ha=ha,
        va=va,
        color=color,
        fontproperties=font,
        linespacing=linespacing,
    )


def add_round_box(ax, x, y, w, h, fill, edge, linewidth, rounding_size):
    patch = FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle=f"round,pad=0,rounding_size={rounding_size}",
        facecolor=fill,
        edgecolor=edge,
        linewidth=linewidth,
    )
    ax.add_patch(patch)
    return patch


def draw_header(ax):
    ax.add_patch(Rectangle((0, 0), WIDTH, 70, facecolor=GREEN_HEADER, edgecolor="none"))
    add_round_box(ax, 32, 12, 36, 44, WHITE, WHITE, 0, 4)
    ax.add_patch(Polygon([(68, 12), (68, 22), (58, 12)], closed=True, facecolor=GREEN_HEADER, edgecolor=GREEN_HEADER))
    ax.add_patch(Rectangle((32, 26), 36, 8, facecolor=GREEN_HEADER, edgecolor="none"))
    for y in (38, 42, 46):
        ax.plot([36, 64], [y, y], color=GRAY, linewidth=1)
    ax.plot([50, 50], [38, 54], color=GRAY, linewidth=1)
    add_text(ax, 92, 32, "Google Sheets 節點 — 我該用哪個 Operation？", 21, WHITE, weight="bold")
    add_text(ax, 92, 54, "從你的使用情境出發，找到右邊對應的 Operation", 13, "#b2dfcc")


def draw_bands(ax):
    for top, bottom, color in BANDS:
        ax.add_patch(Rectangle((0, top), WIDTH, bottom - top, facecolor=color, edgecolor="none"))


def draw_start_node(ax):
    add_round_box(ax, 28, 388, 110, 60, GREEN_HEADER, GREEN_BORDER, 2, 10)
    add_text(ax, 83, 418, "你想\n做什麼？", 15, WHITE, ha="center", weight="bold", linespacing=1.3)


def draw_category_labels(ax):
    for label, center_y in GROUPS:
        add_round_box(ax, 168, center_y - 22, 118, 44, GREEN_LIGHT, GREEN_BORDER, 1.5, 8)
        add_text(ax, 227, center_y, label, 14, DARK, ha="center", weight="bold")


def draw_connectors(ax):
    group_ys = [center_y for _, center_y in GROUPS]
    ax.plot([138, 154], [418, 418], color=GREEN_BORDER, linewidth=1.8)
    ax.plot([154, 154], [min(group_ys), max(group_ys)], color=GREEN_BORDER, linewidth=1.8)
    for center_y in group_ys:
        ax.plot([154, 168], [center_y, center_y], color=GREEN_BORDER, linewidth=1.8)


def draw_rows(ax):
    for slot_y, (condition, badge, recommended) in zip(SLOTS, ROWS):
        add_text(ax, 310, slot_y, condition, 13, DARK)
        arrow = FancyArrowPatch(
            (498, slot_y),
            (518, slot_y),
            arrowstyle="->",
            mutation_scale=10,
            linewidth=1.6,
            color=GREEN_BORDER,
            shrinkA=0,
            shrinkB=0,
        )
        ax.add_patch(arrow)
        fill = AMBER_BG if recommended else GREEN_BADGE
        add_round_box(ax, 520, slot_y - 20, 880, 40, fill, fill, 0, 20)
        add_text(
            ax,
            960,
            slot_y,
            badge,
            14,
            AMBER_TEXT,
            ha="center",
            weight="bold" if recommended else "normal",
        )


def draw_separators(ax):
    for y in (265, 465, 685):
        ax.plot([0, WIDTH], [y, y], color=SEPARATOR, linewidth=1)


def draw_legend(ax):
    ax.add_patch(Rectangle((36, 847), 12, 12, facecolor=AMBER_BG, edgecolor="none"))
    add_text(ax, 56, 853, "★ 建議優先學的 Operation", 11, MUTED)
    add_text(ax, 1400, 853, "darrelltw.com", 11, MUTED, ha="right")


def main():
    if not Path(FONT_PATH).exists():
        raise FileNotFoundError(f"字型不存在: {FONT_PATH}")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    fig = plt.figure(figsize=(WIDTH / DPI, HEIGHT / DPI), dpi=DPI, facecolor=BG)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, WIDTH)
    ax.set_ylim(HEIGHT, 0)
    ax.set_facecolor(BG)
    ax.axis("off")

    draw_bands(ax)
    draw_header(ax)
    draw_start_node(ax)
    draw_category_labels(ax)
    draw_connectors(ax)
    draw_rows(ax)
    draw_separators(ax)
    draw_legend(ax)

    fig.savefig(OUTPUT_PATH, dpi=DPI, facecolor=BG, bbox_inches=None, pad_inches=0)
    plt.close(fig)

    with Image.open(OUTPUT_PATH) as image:
        print(f"created: {OUTPUT_PATH}")
        print(f"size: {image.size[0]}x{image.size[1]}")
        print(f"dpi: {image.info.get('dpi')}")


if __name__ == "__main__":
    main()
