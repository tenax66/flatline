#!/usr/bin/env python3

import sys

def main():
    # 引数のチェック
    if len(sys.argv) < 4:
        print("使用方法: {} <タイトル> <作者> <短歌>".format(sys.argv[0]))
        sys.exit(1)

    title = sys.argv[1]
    author = sys.argv[2]
    tanka = sys.argv[3]

    # 作者名と絵文字の対応リストを定義
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
        "ゆるもちゆ": "🍡", "唯織明": "🖱️", "蛸": "🧝‍♂️"
    }

    # 絵文字の取得 (該当がなければデフォルト)
    emoji = emoji_map.get(author, "❓")

    # 短歌の整形 (改行を <p> タグに変換)
    tanka_lines = tanka.split("\\n")
    tanka_main = "\n".join(f"<p>{line}</p>" for line in tanka_lines)
    tanka_summary = "<br/>".join(tanka_lines)

    # Jekyll用の投稿フォーマットを生成
    output_html = f"""---
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
<br/>
</details>

{author}"""

    # 結果を表示
    print(output_html)

if __name__ == "__main__":
    main()
