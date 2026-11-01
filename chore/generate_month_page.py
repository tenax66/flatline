import argparse

from tanka_input import read_tanka_blocks


def main():
    parser = argparse.ArgumentParser(description="月まとめページを生成する")
    parser.add_argument("date", help="YYYY-MM-DD")
    parser.add_argument("title")
    parser.add_argument("input_file")
    parser.add_argument("english_titles", nargs="+", help="入力順の英題（URL用スラッグ）")
    args = parser.parse_args()
    try:
        blocks = read_tanka_blocks(args.input_file, args.english_titles)
    except (OSError, ValueError) as error:
        parser.error(str(error))
    date_arg = args.date
    title_arg = args.title
    output_file = "output.md"

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

    for title, slug, author, tanka in blocks:
        entries.append(f"[{title}]({{{{ site.baseurl }}}}/{slug}) - {author}\n")

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(front_matter)
        f.write("\n".join(entries))
        f.write("\n")

    print(f"Markdownファイルを '{output_file}' として出力しました。")


if __name__ == "__main__":
    main()
