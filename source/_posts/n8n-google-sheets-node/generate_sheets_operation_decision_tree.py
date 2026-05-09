#!/usr/bin/env python3
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WIDTH = 1440
HEIGHT = 860
BG = "#0d1117"
TEXT = "#ffffff"
MUTED = "#94a3b8"
GRID = "#263042"
CARD = "#1a1f2e"
PILL = "#202938"
RECOMMENDED = "#f97316"
NORMAL = "#15803d"
WATERMARK = "#6b7280"
TITLE = "Google Sheets 節點 — 我該用哪個 Operation？"
SUBTITLE = "從你的使用情境出發，對應到右邊的 Operation"
FONT_PATH = "/System/Library/AssetsV2/com_apple_MobileAsset_Font8/86ba2c91f017a3749571a82f2c6d890ac7ffb2fb.asset/AssetData/PingFang.ttc"
EMOJI_FONT_PATH = "/System/Library/Fonts/Apple Color Emoji.ttc"
BASE_DIR = Path("/Users/darrellwang/Darrell/code/blog/source/_posts/n8n-google-sheets-node")
OUT_A = BASE_DIR / "sheets_operation_decision_tree_va.png"
OUT_B = BASE_DIR / "sheets_operation_decision_tree_vb.png"
OUT_C = BASE_DIR / "sheets_operation_decision_tree_vc.png"

CATEGORY_COLORS = {
    "新增資料": "#2563eb",
    "修改資料": "#7c3aed",
    "讀取資料": "#0f766e",
    "清空刪除": "#b91c1c",
}

ROWS = [
    {
        "category": "新增資料",
        "emoji": "📥",
        "condition": "新增資料 ＋ 怕重複寫入（發票、訂單、Email）",
        "operation": "★ Append or Update Row",
        "recommended": True,
    },
    {
        "category": "新增資料",
        "emoji": "📥",
        "condition": "新增資料 ＋ 不怕重複（log、留言、紀錄）",
        "operation": "Append Row",
        "recommended": False,
    },
    {
        "category": "修改資料",
        "emoji": "✏️",
        "condition": "修改現有資料 ＋ 已知 Row Number",
        "operation": "Update Row",
        "recommended": False,
    },
    {
        "category": "修改資料",
        "emoji": "✏️",
        "condition": "修改現有資料 ＋ 只知道某欄位的值（如 Email）",
        "operation": "★ Append or Update Row",
        "recommended": True,
    },
    {
        "category": "讀取資料",
        "emoji": "📖",
        "condition": "讀取資料 ＋ 讀全部 / 指定範圍",
        "operation": "Get Rows",
        "recommended": False,
    },
    {
        "category": "讀取資料",
        "emoji": "📖",
        "condition": "讀取資料 ＋ 需要篩選特定條件",
        "operation": "Get Rows + Filters / Filter 節點",
        "recommended": False,
    },
    {
        "category": "清空刪除",
        "emoji": "🗑️",
        "condition": "清空 / 刪除 ＋ 清空內容，保留欄位格式",
        "operation": "Clear",
        "recommended": False,
    },
    {
        "category": "清空刪除",
        "emoji": "🗑️",
        "condition": "清空 / 刪除 ＋ 刪掉整列或整欄",
        "operation": "Delete Rows or Columns",
        "recommended": False,
    },
]


def font(size: int, bold: bool = False):
    index = 0 if bold else 3
    return ImageFont.truetype(FONT_PATH, size=size, index=index)


def emoji_font(size: int):
    path = Path(EMOJI_FONT_PATH)
    if path.exists():
        try:
            return ImageFont.truetype(str(path), size=size)
        except OSError:
            pass
    return font(size)


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt):
    left, top, right, bottom = draw.textbbox((0, 0), text, font=fnt)
    return right - left, bottom - top


def draw_text(
    draw: ImageDraw.ImageDraw,
    xy,
    text: str,
    fnt,
    fill=TEXT,
    anchor="lt",
    embedded_color=False,
):
    try:
        draw.text(xy, text, font=fnt, fill=fill, anchor=anchor, embedded_color=embedded_color)
    except TypeError:
        draw.text(xy, text, font=fnt, fill=fill, anchor=anchor)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, fnt, max_width: int):
    if "\n" in text:
        lines = []
        for part in text.split("\n"):
            lines.extend(wrap_text(draw, part, fnt, max_width))
        return lines
    words = text.split(" ")
    lines = []
    current = ""
    for word in words:
        candidate = word if not current else current + " " + word
        if text_size(draw, candidate, fnt)[0] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_multiline(draw: ImageDraw.ImageDraw, box, text: str, fnt, fill=TEXT, line_gap=8, align="left"):
    x1, y1, x2, y2 = box
    lines = wrap_text(draw, text, fnt, x2 - x1)
    line_heights = [text_size(draw, line, fnt)[1] for line in lines]
    total_h = sum(line_heights) + max(0, len(lines) - 1) * line_gap
    y = y1 + (y2 - y1 - total_h) / 2
    for idx, line in enumerate(lines):
        w, h = text_size(draw, line, fnt)
        if align == "center":
            x = x1 + (x2 - x1 - w) / 2
        elif align == "right":
            x = x2 - w
        else:
            x = x1
        draw_text(draw, (x, y), line, fnt, fill=fill)
        y += h + line_gap


def rounded(draw: ImageDraw.ImageDraw, box, fill, radius=18, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def badge_color(recommended: bool):
    return RECOMMENDED if recommended else NORMAL


def add_header(draw: ImageDraw.ImageDraw):
    title_font = font(38, bold=True)
    sub_font = font(20)
    draw_text(draw, (WIDTH / 2, 52), TITLE, title_font, anchor="ma")
    draw_text(draw, (WIDTH / 2, 95), SUBTITLE, sub_font, fill=MUTED, anchor="ma")


def add_legend(draw: ImageDraw.ImageDraw):
    x = 54
    y = HEIGHT - 48
    rounded(draw, (x, y - 12, x + 20, y + 8), RECOMMENDED, radius=6)
    draw_text(draw, (x + 30, y - 2), "★ 推薦優先學會的 Operation", font(16), anchor="lm")
    draw_text(draw, (WIDTH - 52, y - 2), "darrelltw.com", font(14), fill=WATERMARK, anchor="rm")


def draw_emoji(draw: ImageDraw.ImageDraw, xy, emoji: str, size: int, anchor="mm"):
    draw_text(draw, xy, emoji, emoji_font(size), anchor=anchor, embedded_color=True)


def generate_version_a():
    image = Image.new("RGBA", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    add_header(draw)

    left_x = 52
    top_y = 140
    left_w = 220
    mid_w = 420
    right_w = 700
    row_h = 150
    row_gap = 12
    category_font = font(18, bold=True)
    condition_font = font(15)
    operation_font = font(18, bold=True)

    categories = [
        ("新增資料", "📥"),
        ("修改資料", "✏️"),
        ("讀取資料", "📖"),
        ("清空刪除", "🗑️"),
    ]

    for row_idx, (category, emoji) in enumerate(categories):
        y1 = top_y + row_idx * (row_h + row_gap)
        y2 = y1 + row_h
        draw.line((left_x, y2 + row_gap / 2, left_x + left_w + mid_w + right_w, y2 + row_gap / 2), fill=GRID, width=1)
        rounded(draw, (left_x, y1, left_x + left_w, y2), CATEGORY_COLORS[category], radius=18)
        draw_emoji(draw, (left_x + 34, y1 + row_h / 2), emoji, 30)
        draw_text(draw, (left_x + 64, y1 + row_h / 2), category, category_font, anchor="lm")

        group_rows = [r for r in ROWS if r["category"] == category]
        for sub_idx, item in enumerate(group_rows):
            block_y1 = y1 + 12 + sub_idx * 68
            block_y2 = block_y1 + 56
            pill_box = (left_x + left_w + 18, block_y1, left_x + left_w + mid_w - 16, block_y2)
            rounded(draw, pill_box, PILL, radius=26, outline="#334155")
            draw_multiline(draw, (pill_box[0] + 18, pill_box[1] + 5, pill_box[2] - 18, pill_box[3] - 5), item["condition"], condition_font)

            op_box = (
                left_x + left_w + mid_w + 16,
                block_y1,
                left_x + left_w + mid_w + right_w - 4,
                block_y2,
            )
            rounded(draw, op_box, badge_color(item["recommended"]), radius=18)
            draw_multiline(draw, (op_box[0] + 18, op_box[1] + 4, op_box[2] - 18, op_box[3] - 4), item["operation"], operation_font, align="center")

    add_legend(draw)
    image.save(OUT_A)


def generate_version_b():
    image = Image.new("RGBA", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    add_header(draw)

    card_w = 648
    card_h = 148
    gap_x = 28
    gap_y = 18
    start_x = 58
    start_y = 138
    body_font = font(22, bold=True)
    small_font = font(15)
    pill_font = font(17, bold=True)

    for idx, item in enumerate(ROWS):
        col = idx % 2
        row = idx // 2
        x1 = start_x + col * (card_w + gap_x)
        y1 = start_y + row * (card_h + gap_y)
        x2 = x1 + card_w
        y2 = y1 + card_h

        rounded(draw, (x1, y1, x2, y2), CARD, radius=12, outline="#2d3748")
        draw.rounded_rectangle((x1, y1, x2, y1 + 10), radius=12, fill=CATEGORY_COLORS[item["category"]])
        draw_emoji(draw, (x1 + 72, y1 + 68), item["emoji"], 42)

        desc_box = (x1 + 122, y1 + 26, x2 - 24, y1 + 92)
        draw_multiline(draw, desc_box, item["condition"], body_font, line_gap=6)

        draw_text(draw, (x1 + 126, y1 + 118), "→", font(24, bold=True), fill=MUTED, anchor="lm")

        pill_x1 = x1 + 158
        pill_x2 = x2 - 22
        pill_y1 = y1 + 100
        pill_y2 = y1 + 134
        rounded(draw, (pill_x1, pill_y1, pill_x2, pill_y2), badge_color(item["recommended"]), radius=18)
        draw_multiline(draw, (pill_x1 + 14, pill_y1 + 2, pill_x2 - 14, pill_y2 - 2), item["operation"], pill_font, align="center")

        draw_text(draw, (x2 - 24, y1 + 24), item["category"], small_font, fill=MUTED, anchor="ra")

    add_legend(draw)
    image.save(OUT_B)


def connector(draw: ImageDraw.ImageDraw, points, color="#64748b", width=4, arrow=False):
    for start, end in zip(points, points[1:]):
        draw.line((start, end), fill=color, width=width)
    if arrow:
        end = points[-1]
        prev = points[-2]
        if end[1] >= prev[1]:
            triangle = [(end[0], end[1]), (end[0] - 8, end[1] - 12), (end[0] + 8, end[1] - 12)]
        else:
            triangle = [(end[0], end[1]), (end[0] - 8, end[1] + 12), (end[0] + 8, end[1] + 12)]
        draw.polygon(triangle, fill=color)


def generate_version_c():
    image = Image.new("RGBA", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    add_header(draw)

    root = (500, 122, 940, 176)
    rounded(draw, root, "#3b82f6", radius=24)
    draw_text(draw, ((root[0] + root[2]) / 2, (root[1] + root[3]) / 2), "你想做什麼？", font(28, bold=True), anchor="mm")

    branch_specs = [
        ("新增資料", "📥", 210),
        ("修改資料", "✏️", 530),
        ("讀取資料", "📖", 850),
        ("清空刪除", "🗑️", 1170),
    ]
    branch_y1, branch_y2 = 230, 286
    cond_y1, cond_y2 = 380, 442
    op_y1, op_y2 = 590, 654

    for category, emoji, center_x in branch_specs:
        box = (center_x - 110, branch_y1, center_x + 110, branch_y2)
        rounded(draw, box, CARD, radius=18, outline=CATEGORY_COLORS[category], width=2)
        draw_emoji(draw, (center_x - 64, (branch_y1 + branch_y2) / 2), emoji, 26)
        draw_text(draw, (center_x - 34, (branch_y1 + branch_y2) / 2), category, font(18, bold=True), anchor="lm")
        connector(draw, [((root[0] + root[2]) / 2, root[3]), ((root[0] + root[2]) / 2, 205), (center_x, 205), (center_x, branch_y1)], arrow=True)

        items = [r for r in ROWS if r["category"] == category]
        cond_centers = [center_x - 88, center_x + 88]
        op_centers = [center_x - 88, center_x + 88]

        for idx, item in enumerate(items):
            cond_box = (cond_centers[idx] - 92, cond_y1, cond_centers[idx] + 92, cond_y2)
            rounded(draw, cond_box, PILL, radius=18, outline="#334155")
            draw_multiline(draw, (cond_box[0] + 12, cond_box[1] + 6, cond_box[2] - 12, cond_box[3] - 6), item["condition"], font(13), line_gap=4, align="center")

            op_box = (op_centers[idx] - 98, op_y1, op_centers[idx] + 98, op_y2)
            rounded(draw, op_box, badge_color(item["recommended"]), radius=18)
            draw_multiline(draw, (op_box[0] + 10, op_box[1] + 4, op_box[2] - 10, op_box[3] - 4), item["operation"], font(15, bold=True), line_gap=4, align="center")

            connector(draw, [(center_x, branch_y2), (center_x, 336), (cond_centers[idx], 336), (cond_centers[idx], cond_y1)], arrow=True)
            connector(draw, [(cond_centers[idx], cond_y2), (cond_centers[idx], 520), (op_centers[idx], 520), (op_centers[idx], op_y1)], arrow=True)

    add_legend(draw)
    image.save(OUT_C)


def main():
    BASE_DIR.mkdir(parents=True, exist_ok=True)
    generate_version_a()
    generate_version_b()
    generate_version_c()
    print(str(OUT_A))
    print(str(OUT_B))
    print(str(OUT_C))


if __name__ == "__main__":
    main()
