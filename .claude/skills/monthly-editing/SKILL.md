---
name: monthly-editing
description: FLATLINE の月刊号（各作者の短歌ポスト＋月まとめページ）を chore/input.txt から生成して _posts/ に配置する。「今月の post を作成して」「2026-09-01 の記事を作って」「input.txt から記事を生成」「月刊号を組んで」といった依頼で使う。
---

# FLATLINE 月刊号の組版

`chore/input.txt`（作者から集めた投稿の一括テキスト）を入力に、その月の
**各作者ポスト N 件＋月まとめページ 1 件**を `_posts/` に生成する。

登場するファイル:

| パス | 役割 |
|---|---|
| `chore/input.txt` | 入力。9行×N ブロック |
| `chore/input_sample.txt` | 入力フォーマットの正 |
| `chore/generate_tanka_pages.py` | 各作者ポストを生成。作者→絵文字の対応表を内蔵 |
| `chore/generate_month_page.py` | 月まとめページを `output.md` に生成 |
| `_posts/YYYY-MM-01-<slug>.md` | 出力（各作者ポスト） |
| `_posts/YYYY-MM-01-<英語月名>-<テーマ英訳>.md` | 出力（月まとめ、例 `2026-09-01-september-star.md`） |

## 1. 入力を検証する（生成前に必ず）

1ブロック = 9行（タイトル / スラッグ / 作者 / 短歌×5 / `--`）。空行は無視される。

```sh
python3 - <<'EOF'
lines=[l.strip() for l in open('chore/input.txt',encoding='utf-8') if l.strip()]
assert len(lines)%9==0, f'行数 {len(lines)} が9の倍数でない'
for i in range(0,len(lines),9):
    assert lines[i+8]=='--', f'ブロック{i//9+1} の区切りが不正: {lines[i+8]!r}'
    print(i//9+1, lines[i], '|', lines[i+1], '|', lines[i+2])
EOF
```

行数が9の倍数でない・`--` が合わない場合は、短歌が4首/6首のブロックや区切り忘れが原因。
**自分で行を足し引きして辻褄を合わせず、該当ブロックを示してユーザーに確認する。**

続けてスラッグと作者をチェックする。

- **スラッグに半角スペースが入っていないか** — ファイル名・URL が壊れる。前例なし。
  ユーザーにハイフン区切り案を提示して確認し、`chore/input.txt` を直す。
- **非ASCII のスラッグは許容** —  `gödel-sphere` など前例あり
- **スラッグの重複**（既存 `_posts/` を含む）がないか。
- **全作者が `generate_tanka_pages.py` の `emoji_map` にいるか** — 無いと `❓` になる。
  新規作者は、その人の短歌の題材から候補を2〜3案出してユーザーに選んでもらい、
  `emoji_map` の末尾に追記する（既存の絵文字と重複しないこと）。

## 2. ユーザーに確認する

1. 未登録作者の絵文字（上記）
2. 空白入りスラッグの修正案（上記）
3. 月まとめページのタイトル `【N月: テーマ】` — 全作品に共通するお題から推定し、確認を取る
4. まとめページのファイル名スラッグ（`september-star` のように `<英語月名>-<テーマ英訳>`）

## 3. 各作者ポストを生成する

スクリプトはカレントディレクトリに出力するので、**必ずスクラッチパッドで実行してから `_posts/` にコピー**する（リポジトリ直下を汚さない）。

```sh
mkdir -p "$SCRATCH/gen" && cd "$SCRATCH/gen"
python3 <repo>/chore/generate_tanka_pages.py <repo>/chore/input.txt YYYY-MM-DD
grep -l "❓" *.md   # 何も出ないこと
```

中身を1〜2件（ルビや全角記号を含むものを選ぶ）目視して、`<ruby>` タグや全角スペースが
そのまま通っていることを確認したうえで `_posts/` にコピーする。

各ポストに `date:` は入らない（ファイル名の日付が効く）。パーマリンクは `_config.yml` の
`/:title/` により、ファイル名のスラッグ部分になる。

## 4. 月まとめページを生成する

```sh
cd "$SCRATCH" && python3 <repo>/chore/generate_month_page.py YYYY-MM-DD '【N月: テーマ】' <repo>/chore/input.txt
```

`output.md` は **input.txt の並び順のまま**出てくる。過去号のまとめページは
**作者の五十音順**なので、並べ替えてから `_posts/` に保存する。

- 基準は `references/author-order.md`（過去号から起こした掲載順の実績表）。
- **そこに無い新規作者だけ読みを推定して挿入し、推定した読みは完了報告でユーザーに提示する。**
  漢字名の読みは推測になるため、勝手に確定させない。
- 濁点は無視して比較する（`なかの` < `ながい`）。

まとめページの front matter は `date: "YYYY-MM-DD 12:00:00"` 付き（各作者ポストより後に並ぶ）。

## 5. ビルドで検証する

当月号は未来日付なので `--future` が要る（`publish.yml` の preview ビルドと同じ）。

```sh
bundle exec jekyll build --future
```

そのうえで、まとめページの全リンクが実在するページを指しているか確認する:

```sh
python3 - <<'EOF'
import os,re
p=open('_posts/YYYY-MM-01-<まとめスラッグ>.md',encoding='utf-8').read()
slugs=re.findall(r'site\.baseurl \}\}/([^)]+)\)',p)
missing=[s for s in slugs if not os.path.isdir(os.path.join('_site',s.rstrip('/')))]
print('links:',len(slugs),'missing:',missing)
EOF
```

`links` が作者数と一致し `missing` が空であること。

## 6. 完了報告

- 生成ファイル数と配置先
- `chore/` 側に加えた変更（スラッグ修正・`emoji_map` 追記）
- ビルドとリンク検証の結果
- 五十音順で読みを推定した作者名（ユーザーが直せるように）

コミット・プッシュは頼まれるまでしない。`main` / `preview/**` への push は
Cloudflare Pages への自動デプロイを起動する。
