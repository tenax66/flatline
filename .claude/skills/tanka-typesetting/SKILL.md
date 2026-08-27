---
name: tanka-typesetting
description: FLATLINE の短歌ポスト（_posts/*.md）の縦組み組版ルール。縦中横・三点リーダ・ダッシュ・矢印・ルビ・圏点・詞書の書き方と、縦組みとフォールバックの字種対応を定める。「縦中横にして」「三点リーダが横向きになる」「この歌の組みを直して」といった依頼や、月刊号を組んだあとの組版パスで使う。
---

# 短歌ポストの縦組み組版

`_posts/*.md` の短歌ポストは **1ポスト＝二重構造**になっている。

```html
<div class="tanka-area"><div class="tanka">   ← ① 縦組み（表示の本体）
<p>…</p>
</div></div>

---

<details open><summary>タイトル</summary>       ← ② フォールバック（横組みプレーン）
…<br />
<br />
</details>

作者名
```

- ① `.tanka` は `writing-mode: vertical-rl` / `text-orientation: mixed` / `white-space: nowrap`
  （`_sass/main.scss` の `/* tanka */` 節）。**縦組み固有の指定はすべてここだけに書く。**
- ② `<details>` は検索・コピペ・スクリーンリーダ向けの素のテキスト。
  **縦組み用のクラスと縦書き専用グリフを持ち込まない**（縦中横を使う26ポスト中23ポストがこの方針。
  持ち込んでいる `2026-07-01-royal-we.md` などは少数派で、真似しない）。

`chore/generate_tanka_pages.py` は投稿テキストを①②へそのまま流し込むだけなので、
**組版は生成後の手作業パス**になる。以下はその手順書。

## 0. 字種対応表（最重要）

同じ一首が①と②で字種だけ変わる。数は 1:1 で対応させる（`︙︙` → `……`）。

| ① 縦組み | ② フォールバック | 用途 |
|---|---|---|
| `︙` U+FE19 | `…` U+2026 | 三点リーダ |
| `︰` U+FE30 | `‥` U+2025 | 二点リーダ |
| `<span class="tate-chu-yoko-upright">42</span>` | `42` | 2桁の数字 |
| 全角 `Ａ` `１` `（` `）` `／` `％` | 半角 `A` `1` `(` `)` `/` `%` | 正立させたい欧字・数字・約物 |
| `<span class="dash">——</span>` | `——` | ダッシュ（span だけ外す） |
| `<ruby>…<rp>（</rp><rt>…</rt><rp>）</rp></ruby>` | **そのまま残す** | ルビ（83件中81件が両方に置く） |
| `<span style="text-emphasis: filled dot;">…</span>` | **そのまま残す** | 圏点 |

## 1. 三点リーダ

`…`（U+2026）を縦組みに置くと横倒しの「…」のまま寝てしまうので、
**縦組み側は `︙`（U+FE19）に置き換える。** `⋯`（U+22EF）は使わない。

```html
<p>棺桶にかくれるという発想を、ふたりの人が同時にしたら︙︙</p>   ← ①
棺桶にかくれるという発想を、ふたりの人が同時にしたら……<br />   ← ②
```

- 慣例どおり **2つ重ね（`︙︙`）が既定**。1つだけ（`︙`）は「言いさし」「口ごもり」を短く
  出したいときに使う（`2026-07-01-royal-we.md`、`2026-02-01-honestly-im-a-neet.md`）。
- 二点リーダも同様に `︰`（`2026-04-02-allegory.md`）。
- 括弧内など、行の中心からわずかに左へ寄せたいときだけ
  `<span class="left-align-vertical">︙</span>`（`2026-01-02-Pygmalion.md`）。

## 2. 数字（縦中横）

| 桁 | 書き方 |
|---|---|
| 1桁 | 全角（`５分`）。半角のままだと寝る |
| 2桁 | 半角＋`tate-chu-yoko-upright`（`<span class="tate-chu-yoko-upright">42</span>回`） |
| 3桁 | 原則そのまま（寝かせる）。詰めても読める短い語なら縦中横可（前例 `126歩`） |
| 4桁以上 | 縦中横にしない。半角のまま寝かせる（`1875年`）か、正立させたければ全角で1桁ずつ積む |

- クラスは2種類ある。混同しない。
  - `.tate-chu-yoko-upright` = `text-combine-upright: all` … **複数文字を1文字ぶんに詰めて正立**。数字はこちら。
  - `.tate-chu-yoko` = `text-orientation: upright` … 詰めずに正立させるだけ。半角記号1文字用
    （`<span class="tate-chu-yoko">!</span>`、`<span class="tate-chu-yoko">－</span>`）。
- 中身は**半角**で書く（全角を入れると詰めても幅が余る）。
- 時刻・日付は各数値を個別に包む: `<span class="…">21</span>時<span class="…">23</span>分`。
- 数字以外でも、詰めて1マスに入れたい2文字には使える（`！！`、脚注番号 `(１)`）。
- Chromium で縦中横グリフが右にズレる件は `.is-blink .tate-chu-yoko-upright` が
  自動補正している。**ポスト側で位置調整を書かない。**

## 3. 欧字

| 長さ | 書き方 |
|---|---|
| 2〜3文字の略語 | 全角（`ＯＫ` `ＴＬ` `ＶＨＳ` `ＱＲ` `Ｂ４`）で正立して積む |
| 単語・文 | 半角のまま。`text-orientation: mixed` で寝るので横倒しで読める |
| 長い語を1文字ずつ寝かせたい | 全角＋`<span class="text-sideways">Ｔｅｌｅｖｉｓｉｏｎ</span>`（`2026-09-01-gödel-sphere.md`） |

②では全角を半角に戻す（`ＯＫ`→`OK`、`Ｂ４`→`B4`）。

## 4. ダッシュ・波ダッシュ

- ダッシュは `<span class="dash">——</span>`。`.dash` が字送りを詰めて上下位置を補正し、
  ピクセルフォントに繋がる罫がないためゴシックへ切り替える。**素の `——` を直に置かない。**
- 長さは意味に合わせて `——`（2倍）が基準、強調で `———`（3倍）。U+2014 EM DASH を使う。
- ②では span を外して `——` のまま残す。
- 波ダッシュ（`〜` U+301C / `～` U+FF5E）は伸ばし音・ゆらぎの表現なので**素で置く**。①②とも同じ。

## 5. 矢印・回転が要る記号

縦組みでの矢印やシンボルの向きはブラウザで挙動が割れるため、回転ユーティリティで揃える。

| クラス | 効果 |
|---|---|
| `.rotate-negative` / `.rotate-positive` | 全ブラウザで ∓90° |
| `.safari-rotate` / `.safari-rotate-positive` | Safari だけ ∓90° |
| `.safari-no-rotate` | Safari だけ回転を打ち消す |

実績のある組み合わせ:

- 流れの向き（＝下）を指す矢印: `<span class="rotate-negative safari-no-rotate">→</span>`
  （`2026-03-01-tracing-the-in-between.md`、`2026-02-01-invaders-must-die.md`）
- 正立させたい記号（`▲` `★` `◊` `￢` `＝`）: `<span class="rotate-positive">▲</span>`
  （`2025-11-01-result.md`）
- 絵文字・記号を寝かせたくない: `<span class="safari-rotate">🫵</span>`（`2025-10-01-a4366ef0.md`）

**この節のクラスを新しく使うときは Chrome と Safari の両方で実物を見て決める**
（挙動が分かれるからこそ Safari 専用クラスが用意されている）。②では span を外し、
横組みで自然な向きの矢印（`→`）に直す。

## 6. ルビ

`<rp>` 込みで書き、①②の両方に同じものを置く。

```html
<ruby>顔面<rp>（</rp><rt>フェイス</rt><rp>）</rp></ruby>
```

- `<rp>` は全角括弧。ruby 非対応環境で「顔面（フェイス）」と読める。
- ルビの中に縦中横を入れてよい: `<ruby><span class="tate-chu-yoko-upright">19</span>時<rp>（</rp><rt>よるしちじ</rt><rp>）</rp></ruby>`
- 記号にルビで意味を与える用法もある（`<ruby>⇔<rp>（</rp><rt>対義語</rt><rp>）</rp></ruby>`）。

## 7. 圏点

`<span style="text-emphasis: filled dot;">…</span>` をインラインで書く（クラスは作っていない）。
縦組みでは右側に点が付く。①②の両方に残す。

## 8. 詞書・小書き

```html
<p class="kotobagaki-padding"><span class="kotobagaki">　　亜細亜</span><br />Ｚ軸に拡張された…</p>
```

- `.kotobagaki` は 0.8rem。行頭は全角スペース2つで落とす。
- `.kotobagaki-padding` は `margin-right: -10px` で、小書きぶん空く行間を詰める。
  **詞書を入れた `<p>` に必ず併せて付ける。**
- 詞書と本文は同じ `<p>` の中で `<br />` で分ける（別 `<p>` にすると一首ぶんの間隔が空く）。

## 9. 空白・改行・行間

- 句切れの空きは**全角スペース**（U+3000）。半角スペースは使わない。
- `.tanka p` は `white-space: nowrap` なので自動改行しない。折り返したい箇所は `<br />` を明示する。
- 一首＝1つの `<p>`。2首目以降は `.tanka p:nth-child(n+2)` が 100px（モバイルは vw）の
  行間を取る。この間隔を触りたいときだけ:
  - 全首の間隔を消す: `<div class="tanka no-padding">`
  - 特定の1首だけ詰める: そのポストに `<style>` を置いて `.tanka p.tanka-gap-narrow` のような
    ページ限定クラスを定義する（`2026-09-01-supernova.md` に前例。**何のための指定か
    コメントを1行書く**）

## 10. 一回限りの表現

囲み文字（`.boxed-text`）、鏡文字（`.tanka-mirror-line`）、背景画像（`.tanka-background-dark`）など、
1ポストのためだけのクラスが `_sass/main.scss` にいくつかある。新しく足すときは:

1. まずそのポスト内の `<style>` で済ませられないか検討する（3ポストに前例）。
2. `main.scss` に足すなら、`DESIGN.md` の禁則（グロー・ぼかし・グラデーション・影は使わない）を守り、
   どのポスト用かコメントに書く（`/* 2024-09-01-the-children-of-anchor-bay.md */` の形）。

## 11. 仕上げのチェック

組み終わったら、そのポストについて次を確認する。

- [ ] ①の `︙` `︰` が②で `…` `‥` になっていて、**個数が一致**している
- [ ] ①の全角 `Ａ１（）` が②で半角に戻っている
- [ ] ②に `tate-chu-yoko` / `dash` / `rotate-` が残っていない
- [ ] ルビと圏点は①②の両方にある
- [ ] ①②の本文がタグを除くと**同じ読み**になる（下のスクリプトで差分を見る）
- [ ] `bundle exec jekyll serve` で開き、**Chrome と Safari の両方**、および幅 480px 以下で確認

```sh
python3 - <<'EOF'
import re,sys,difflib
p=sys.argv[1] if len(sys.argv)>1 else '_posts/YYYY-MM-01-slug.md'
t=open(p,encoding='utf-8').read()
i=t.find('<div class="tanka-area"'); j=t.find('<details',i); k=t.find('</details>',j)
def txt(s):
    s=re.sub(r'<rp>.*?</rp>','',s,flags=re.S)
    s=re.sub(r'<br\s*/?>','\n',s); s=re.sub(r'<[^>]+>','',s)
    return [l.strip() for l in s.split('\n') if l.strip()]
a,b=txt(t[i:j]),txt(t[j:k])[1:]
for l in difflib.unified_diff(a,b,'vertical','details',lineterm=''): print(l)
EOF
```

字種対応（`︙`→`…`、全角→半角）**以外の差分が出たら組み間違い**。
