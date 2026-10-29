import re


def read_tanka_blocks(input_file, english_titles):
    """Read title / author / five poems / -- blocks with external URL slugs."""
    with open(input_file, encoding="utf-8") as source:
        lines = [line.strip() for line in source if line.strip()]
    if not lines or len(lines) % 8:
        raise ValueError("入力は8行単位（タイトル / 作者 / 短歌×5 / --）にしてください")
    if len(english_titles) != len(lines) // 8:
        raise ValueError("英題の数を入力ブロック数に合わせてください")
    if len(set(english_titles)) != len(english_titles):
        raise ValueError("英題が重複しています")
    for slug in english_titles:
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
            raise ValueError(f"英題は英小文字・数字をハイフンで区切ってください: {slug!r}")
    blocks = []
    for index, slug in enumerate(english_titles):
        block = lines[index * 8 : (index + 1) * 8]
        if block[7] != "--" or "--" in block[:7]:
            raise ValueError(f"ブロック{index + 1}の区切りが不正です")
        blocks.append((block[0], slug, block[1], "\n".join(block[2:7])))
    return blocks
