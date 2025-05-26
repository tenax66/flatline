import sys
import os


def main():
    if len(sys.argv) != 4:
        print("使い方: python generate_markdown.py YYYY-MM-DD '【月: テーマ】' input.txt")
        return

    date_arg = sys.argv[1]
    title_arg = sys.argv[2]
    input_file = sys.argv[3]
    output_file = "output.md"

    if not os.path.isfile(input_file):
        print(f"エラー: 入力ファイル '{input_file}' が見つかりません。")
        return

    # YAML front matter
    front_matter = f"""---
date: "{date_arg} 12:00:00"
layout: post
title: "{title_arg}"
image: /assets/images/ogp_default.png
author: flatline
category: flatline
---

"""

    entries = []

    with open(input_file, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip()]

    i = 0
    while i < len(lines):
        title = lines[i]
        slug = lines[i+1]
        author = lines[i+2]
        print(f"[{title}]({{ site.baseurl }}/{slug}) - {author}")
        entries.append(f"[{title}]({{{{ site.baseurl }}}}/{slug}) - {author}\n")
        i += 9  # 各作品は8行構成（タイトル、slug、作者、短歌×5、--）

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(front_matter)
        f.write("\n".join(entries))
        f.write("\n")

    print(f"Markdownファイルを '{output_file}' として出力しました。")


if __name__ == "__main__":
    main()
