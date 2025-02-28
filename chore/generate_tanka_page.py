#!/usr/bin/env python3

import sys


def process_tanka_blocks(lines):
    output_list = []
    i = 0
    count = 1
    while i < len(lines):
        title = lines[i].strip()
        author = lines[i + 1].strip()
        tanka = "\n".join(lines[i + 2:i + 7]).strip()
        output_list.append((count, title, author, generate_tanka_html(title, author, tanka)))
        count += 1
        i += 7  # Move to the next block
    return output_list


def generate_tanka_html(title, author, tanka):
    emoji_map = {
        "青野ゆらぎ": "🐕", "犬の注射": "💉", "domeki": "🏝️",
        "サラリーマン予想": "🏘️", "オルター堂": "🎸", "福住電": "💡",
        "東川夢物語": "🦷", "おざわ": "🧢", "江間あやせ": "🍳",
        "非鋭理反": "🕯️", "彦凪 至": "🧭", "特上あいう": "🎠",
        "点線画鋲": "📌", "奥園": "🪴", "ヒミツー": "🤫",
        "冨岡正太郎": "🎺", "夕凪らこ": "🧊", "㐂子": "🍑",
        "宇佐田灰加": "🐰", "八谷のり": "🍞", "京野正午": "🕛",
        "三好しほ": "🫖", "福田六個": "🦟", "太朗千尋": "💻",
        "尾内甲太郎": "🪲", "神乃": "🦀", "高橋寧": "🎪",
        "織原禾": "⛪️", "鵺沼こもり": "🎩", "小西善仁": "🍊",
        "ゆるもちゆ": "🍡", "唯織明": "🖱️", "蛸": "🧝‍♂️",
        "新戸鴎二": "🐔", "永井文鳥": "🐦", "nes": "🌇"
    }
    emoji = emoji_map.get(author, "❓")

    tanka_lines = tanka.split("\n")
    tanka_main = "\n".join(f"<p>{line}</p>" for line in tanka_lines)
    tanka_summary = "<br/>\n".join(tanka_lines)

    return f"""---
layout: post
title: {title}
image: /assets/images/ogp_default.png
author: {author}
category: {author}
emoji: {emoji}
---

<div class=\"tanka-area\"><div class=\"tanka\">
{tanka_main}</div></div>

---

<details><summary>{title}</summary>
{tanka_summary}<br/>
</details>

{author}
"""


def main():
    if len(sys.argv) < 3:
        print("使用方法: {} <入力ファイル> <日付 (YYYY-MM-DD)>".format(sys.argv[0]))
        sys.exit(1)

    input_file = sys.argv[1]
    date_str = sys.argv[2]

    with open(input_file, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]

    output_list = process_tanka_blocks(lines)

    for count, title, author, output in output_list:
        output_filename = f"{date_str}-tanka{count}.md"
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"出力ファイル: {output_filename}")


if __name__ == "__main__":
    main()
