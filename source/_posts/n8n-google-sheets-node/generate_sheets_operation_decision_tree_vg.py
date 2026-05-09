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
    "/Users/darrellwang/Darrell/code/blog/source/_posts/n8n-google-sheets-node/sheets_operation_decision_tree_vg.png"
)

BG = "#0d1117"
CARD_BG = "#161b22"
GREEN = "#1a7f4b"
GREEN_LIGHT = "#22c55e"
AMBER_BG = "#78350f"
AMBER_TEXT = "#fcd34d"
WHITE = "#ffffff"
MUTED = "#8b949e"
BORDER = "#30363d"

SLOTS = [105, 205, 315, 415, 525, 625, 720, 805]
GROUPS = [
    ("新增資料", 155, [105, 205]),
    ("修改資料", 365, [315, 415]),
    ("讀取資料", 575, [525, 625]),
    ("清空/刪除", 763, [720, 805]),
]
CONDITIONS = [
    "怕重複寫入 (訂單、發票、Email)",
    "不怕重複 (log、留言)",
    "只知道某欄位值（如 Email）",
    "已知 Row Number",
    "讀全部或指定範圍",
    "需要篩選特定條件",
    "清空內容，保留欄位格式",
    "刪掉整列或整欄",
]
BADGES = [
    (AMBER_BG, AMBER_TEXT, "★  Append or Update Row", True),
    (CARD_BG, WHITE, "Append Row", False),
    (AMBER_BG, AMBER_TEXT, "★  Append or Update Row", True),
    (CARD_BG, WHITE, "Update Row", False),
    (CARD_BG, WHITE, "Get Rows", False),
    (CARD_BG, WHITE, "Get Rows + Filters", False),
    (CARD_BG, WHITE, "Clear", False),
    (CARD_BG, WHITE, "Delete Rows or Columns", False),
]


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


def add_google_sheets_icon(ax):
    add_round_box(ax, 36, 11, 38, 46, GREEN, GREEN, 0, 4)
    fold = Polygon([(74, 11), (74, 19), (66, 11)], closed=True, facecolor=CARD_BG, edgecolor=CARD_BG)
    ax.add_patch(fold)
    for y in (26, 33, 40):
        ax.plot([41, 71], [y, y], color=WHITE, linewidth=2)
    ax.plot([55, 55], [19, 49], color=WHITE, linewidth=2)


def draw_title_bar(ax):
    ax.add_patch(Rectangle((0, 0), WIDTH, 72, facecolor=CARD_BG, edgecolor="none"))
    add_google_sheets_icon(ax)
    add_text(ax, 98, 36, "Google Sheets 節點 — 我該用哪個 Operation？", 21, WHITE, weight="bold")
    add_text(ax, 98, 56, "從你的使用情境出發，找到右邊對應的 Operation", 13, MUTED)
    ax.plot([0, WIDTH], [72, 72], color=BORDER, linewidth=1)


def draw_start_node(ax):
    add_round_box(ax, 30, 390, 108, 60, GREEN, GREEN_LIGHT, 1.5, 10)
    add_text(ax, 84, 420, "你想\n做什麼？", 15, WHITE, ha="center", weight="bold", linespacing=1.3)


def draw_group_connectors(ax):
    ax.plot([138, 146], [420, 420], color=GREEN_LIGHT, linewidth=1.5)
    for _, center_y, _ in GROUPS:
        ax.plot([146, 146], [420, center_y], color=GREEN_LIGHT, linewidth=1.5)
        ax.plot([146, 155], [center_y, center_y], color=GREEN_LIGHT, linewidth=1.5)


def draw_group_labels(ax):
    for label, center_y, slot_ys in GROUPS:
        top = center_y - 23
        add_round_box(ax, 155, top, 120, 46, CARD_BG, GREEN_LIGHT, 1.5, 8)
        add_text(ax, 215, center_y, label, 14, WHITE, ha="center", weight="bold")
        for slot_y in slot_ys:
            ax.plot([275, 295], [slot_y, slot_y], color=GREEN_LIGHT, linewidth=1.5)


def draw_slot_rows(ax):
    for idx, slot_y in enumerate(SLOTS):
        add_text(ax, 310, slot_y, CONDITIONS[idx], 13, WHITE)
        arrow = FancyArrowPatch(
            (505, slot_y),
            (520, slot_y),
            arrowstyle="-|>",
            mutation_scale=10,
            linewidth=1.5,
            color=GREEN_LIGHT,
            shrinkA=0,
            shrinkB=0,
        )
        ax.add_patch(arrow)

        fill, text_color, label, recommended = BADGES[idx]
        add_round_box(ax, 520, slot_y - 22, 870, 44, fill, AMBER_TEXT if recommended else GREEN_LIGHT, 1.5, 22)
        add_text(
            ax,
            955,
            slot_y,
            label,
            14,
            text_color,
            ha="center",
            weight="bold" if recommended else "normal",
        )


def draw_dividers(ax):
    for y in (260, 470, 670):
        ax.plot([145, 1395], [y, y], color=BORDER, linewidth=0.8, linestyle=(0, (4, 4)))


def draw_legend(ax):
    ax.add_patch(Rectangle((36, 838), 14, 14, facecolor=AMBER_BG, edgecolor="none"))
    add_text(ax, 58, 845, "★ 建議優先學的 Operation", 11, MUTED)
    add_text(ax, 1400, 845, "darrelltw.com", 11, MUTED, ha="right")


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

    draw_title_bar(ax)
    draw_start_node(ax)
    draw_group_connectors(ax)
    draw_group_labels(ax)
    draw_slot_rows(ax)
    draw_dividers(ax)
    draw_legend(ax)

    fig.savefig(OUTPUT_PATH, dpi=DPI, facecolor=BG, bbox_inches=None, pad_inches=0)
    plt.close(fig)

    with Image.open(OUTPUT_PATH) as image:
        print(f"created: {OUTPUT_PATH}")
        print(f"size: {image.size[0]}x{image.size[1]}")


if __name__ == "__main__":
    main()
