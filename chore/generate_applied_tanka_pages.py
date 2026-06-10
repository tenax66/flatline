#!/usr/bin/env python3
"""短歌賞応募作CSV(筆名,連作のタイトル,短歌連作５首)から _posts 用 markdown を生成する。

使用方法:
    python3 generate_applied_tanka_pages.py <入力CSV> <日付 YYYY-MM-DD> [出力ディレクトリ] [--dry-run]

CSVは ヘッダ行から「筆名」「連作のタイトル」「短歌連作」列を自動検出する。
本文中の `X（ルビ：Y）` `X(ルビ:Y)` 等のルビ記法は ruby HTML に自動変換する。
"""

import csv
import re
import sys

# X（ルビ：Y） / X(ルビ:Y) 等を <ruby>X<rp>（</rp><rt>Y</rt><rp>）</rp></ruby> へ変換するパターン。
# 直前文字列(base)はひらがな・空白・主要な区切り文字以外で構成されるとみなす。
RUBY_PATTERN = re.compile(
    r'([^\s぀-ゟ、。「」『』，．,.\(\)（）]+?)'  # 基底文字列
    r'[（(]ルビ[：:]'                                     # 「（ルビ：」または「(ルビ:」
    r'([^）)\n]+?)'                                       # ルビ
    r'[）)]'                                              # 閉じ括弧
)


def convert_ruby(text):
    """`X（ルビ：Y）` 等を ruby タグへ変換する。"""
    return RUBY_PATTERN.sub(
        lambda m: f'<ruby>{m.group(1)}<rp>（</rp><rt>{m.group(2)}</rt><rp>）</rp></ruby>',
        text,
    )


# 短歌賞応募作は全作者一律でこの絵文字を使う
EMOJI = "📮"

# 連作タイトル → ファイル名スラッグ(英訳は仮案。適宜修正してください)
SLUG_MAP = {
    "黴": "mold",
    "なんもだ": "nanmoda",
    "乳歯": "baby-teeth",
    "春": "spring",
    "愛か恋か未練か": "love-or-crush-or-regret",
    "窓枠にぴたりと嵌まる冷蔵庫": "fridge-in-the-window-frame",
    "すごい歌": "sugoi-uta",
    "喫茶店 連作": "kissaten",
    "COUNTDOWN": "countdown",
    "恋の幸": "koi-no-sachi",
    "矢印": "arrow",
    "夜だけ会いたい": "only-at-night",
    "斎藤夢斗": "saito-yumeto",
    "こいのうた5こ": "koi-no-uta-5",
    "雪国": "snow-country",
    "労働傘下": "labor-umbrella",
    "終焉": "demise",
    "川柳": "senryu",
    "愛か嘘、その現実": "love-or-lies",
    "待つ宵草": "matsu-yoigusa",
    "日常の中で": "in-everyday-life",
    "黒部": "kurobe",
    "追悼歌": "elegy",
    "貝殻の心臓のおと": "seashell-heartbeat",
    "呪文": "incantation",
    "デカい蜘蛛の巣": "huge-spiderweb",
    "アイのカタチ": "shape-of-ai",
    "日々を食む": "feeding-on-days",
    "死": "death",
    "お散歩": "walking",
    "踊る短歌": "dancing-tanka",
    "鬱老おんなの短歌": "melancholy-old-woman",
    "下僕のよろこび": "servants-joy",
    "沖縄あるある": "okinawa-aruaru",
    "ひみつのきせつ": "secret-season",
    "或る密儀": "a-certain-secret-rite",
    "Recommended": "recommended",
    "フィギュア的": "figure-like",
    "橋を燃やして": "burn-the-bridge",
    "残るもの": "what-remains",
    "融化する季節": "melting-season",
    "白寿の母へ": "to-my-mother-at-99",
    # 2026/06/12以降の追加分。スラッグは仮案。
    "順路": "route",
    "美しい呪詛": "beautiful-curse",
    "海までの": "to-the-sea",
    "メッシュ付きのカーテン": "mesh-curtain",
    "泡銭残すな": "dont-leave-easy-money",
    "ビタミンカラー": "vitamin-color",
    "残照": "afterglow",
    "摘房": "thinning-bunches",
    "自由と業": "freedom-and-karma",
    "晴れて嵐": "fine-then-stormy",
    "5件の通知": "five-notifications",
    "逃飛行": "escape-flight",
    "詰めろ": "tsumero",
    "8月null日": "august-null",
    "もっちゅりん　鳴き声　［検索］": "mocchurin-cry-search",
    "トレーラー": "trailer",
    "eat": "eat",
    "42回忌": "forty-second-memorial",
    "ペイン": "pain",
    "シュガー": "sugar",
    "がんばれば": "if-i-try",
    "まだ地下室がすべて": "basement-is-all",
    "雨": "rain",
    "おひや": "ohiya",
    "花占い": "flower-fortune",
    "表情": "expression",
    "自白": "self-confession",
    "void": "void-applied",
    "やさしい絶望": "gentle-despair",
    "一般セレブ": "ordinary-celeb",
    "ふたり暮らし": "futari-gurashi",
    "不眠とか夢だとか": "insomnia-or-dreams",
    "虹": "rainbow",
    "ダミアン": "damien",
    "伝言": "message",
    "PRAY PRAY PRAY": "pray-pray-pray",
    "膨らみ具合": "degree-of-swing",
    "就活生": "job-hunter",
    "サイゼリヤ２": "saizeriya-2",
    "体育館の大きさ": "gym-size",
    "生活": "everyday-living",
    "夏への道": "roots-of-summer",
    "光沢": "gloss",
    "ゴミ": "trash",
    "タバスコ": "tabasco",
    "ランチセットＡ": "lunch-set-a",
    "追悼": "tribute",
    "次の打席": "next-at-bat",
    "VANILLA": "vanilla",
    "窓際族": "deadwood",
    "欠けている": "missing",
    "cable": "cable",
    "つつましく生": "modest-life",
    "それでもピカソ": "still-picasso",
    "王々飯店火星店": "wangwang-mars-branch",
    "嘘乙": "uso-otsu",
    "蕎麦": "soba",
    "自己紹介": "self-introduction",
    "する": "do",
    "副題": "subtitle",
    "ROYAL WE": "royal-we",
    "ミラージュ": "mirage",
    "進化ではなく": "not-evolution",
    "名称未設定": "untitled",
    "その日の午後": "that-afternoon",
    "breath": "breath-applied",
    "夏服の子供": "summer-clothes-child",
    "澪標": "miotsukushi",
    "何もしなかった日": "did-nothing-day",
    "サージカル・マスク": "surgical-mask",
    "link": "link",
    "ユメワラバグで": "in-yumewara-bug",
    "傷つくための": "to-get-hurt",
}

EXPECTED_TANKA_COUNT = 5


def split_stanzas(text):
    """短歌フィールドを1首ごとのまとまり(行のリスト)に分割する。

    空行区切りがあれば空行区切りを1首とみなし(1首が複数行のケースに対応)、
    空行がなければ1行=1首とみなす。
    """
    lines = [line.rstrip() for line in text.split("\n")]
    stanzas = []
    current = []
    for line in lines:
        if line.strip():
            current.append(line.strip())
        elif current:
            stanzas.append(current)
            current = []
    if current:
        stanzas.append(current)

    has_blank_separator = len(stanzas) > 1
    if not has_blank_separator and stanzas:
        stanzas = [[line] for line in stanzas[0]]
    return stanzas


def _find_column(header, *needles):
    """ヘッダ行から列番号を探す。needle のいずれかが列名に含まれていればマッチ。"""
    for i, name in enumerate(header):
        for needle in needles:
            if needle in name:
                return i
    raise ValueError(f"列が見つかりません: {needles} / header={header}")


def load_works(input_file):
    """CSVを読み、(筆名, タイトル)で行をまとめて作品リストを返す。"""
    works = {}  # (author, title) -> list of stanzas
    order = []
    with open(input_file, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        col_author = _find_column(header, "筆名")
        col_title = _find_column(header, "連作のタイトル", "タイトル")
        col_tanka = _find_column(header, "短歌連作", "短歌")
        for row in reader:
            if not row or not any(cell.strip() for cell in row):
                continue
            author = row[col_author].strip()
            title = row[col_title].strip()
            tanka = row[col_tanka]
            key = (author, title)
            if key not in works:
                works[key] = []
                order.append(key)
            # 同一作品が複数行に分かれている場合(1行=1首)はここで合流する
            works[key].extend(split_stanzas(tanka))
    return [(author, title, works[(author, title)]) for author, title in order]


def validate(author, title, stanzas, warnings):
    # フィールド先頭にタイトルが重複して書かれているケースを除去
    if stanzas and len(stanzas[0]) == 1:
        first = stanzas[0][0].strip("『』「」")
        if first == title:
            stanzas = stanzas[1:]
            warnings.append(f"[{author}/{title}] 本文先頭のタイトル重複行を除去しました")

    # 本文中に `---` 単独行がある場合は詞書や脚注など特殊構造の可能性があるため警告
    has_divider = any(line.strip() == "---" for s in stanzas for line in s)
    if has_divider:
        warnings.append(
            f"[{author}/{title}] 本文に '---' 区切りを検出しました。詞書や脚注など特殊構造の可能性。手動対応推奨")

    if len(stanzas) != EXPECTED_TANKA_COUNT:
        warnings.append(
            f"[{author}/{title}] 短歌が{len(stanzas)}首です(期待値: {EXPECTED_TANKA_COUNT}首)。生成対象から除外します")
        return None

    multiline = [i + 1 for i, s in enumerate(stanzas) if len(s) > 1]
    if multiline:
        warnings.append(
            f"[{author}/{title}] {multiline}首目が複数行です。全角スペースで連結して1首1行にします")

    if title not in SLUG_MAP:
        warnings.append(f"[{author}/{title}] スラッグ未定義です。SLUG_MAPに追加してください")
        return None

    return stanzas


def generate_markdown(title, author, stanzas):
    emoji = EMOJI
    # 1首が複数行の場合は全角スペースで連結し、必ず1首=1行(計5行)にする
    tanka_lines = [convert_ruby("　".join(s)) for s in stanzas]
    tanka_main = "\n".join(f"<p>{line}</p>" for line in tanka_lines)
    tanka_summary = "<br />\n".join(tanka_lines)

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

<details open><summary>{title}</summary>
{tanka_summary}<br />
<br />
</details>

{author}
"""


def main():
    args = [a for a in sys.argv[1:] if a != "--dry-run"]
    dry_run = "--dry-run" in sys.argv

    if len(args) < 2:
        print("使用方法: {} <入力CSV> <日付 (YYYY-MM-DD)> [出力ディレクトリ] [--dry-run]".format(sys.argv[0]))
        sys.exit(1)

    input_file = args[0]
    date_str = args[1]
    output_dir = args[2] if len(args) > 2 else "_posts"

    warnings = []
    for author, title, stanzas in load_works(input_file):
        stanzas = validate(author, title, stanzas, warnings)
        if not stanzas:
            continue
        output_filename = f"{output_dir}/{date_str}-{SLUG_MAP[title]}.md"
        if dry_run:
            print(f"(dry-run) {output_filename}  {author} / {title} ({len(stanzas)}首)")
        else:
            with open(output_filename, "w", encoding="utf-8") as f:
                f.write(generate_markdown(title, author, stanzas))
            print(f"出力ファイル: {output_filename}")

    if warnings:
        print("\n=== 警告 ===", file=sys.stderr)
        for w in warnings:
            print(w, file=sys.stderr)


if __name__ == "__main__":
    main()
