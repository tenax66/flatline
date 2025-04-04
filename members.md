---
layout: page
title: Members
permalink: /members/
image: /assets/images/ogp_default.png
---

**名前**

1. 生まれ変わったら何のフルーツになりたいか
2. その理由

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="{{site.baseurl}}/assets/js/color-modes.js"></script>

<canvas id="fruitChart" class="fruitChart" width="400" height="200"></canvas>

<script>
    const lightThemeColors = {
        backgroundColor: '',
        borderColor: '',
        gridColor: '#96968C',
        color: '#140d00',
    };

    const darkThemeColors = {
        backgroundColor: '',
        borderColor: '',
        gridColor: '#96968C',
        textColor: '#f5e8d5',
    };

    const getStoredTheme = () => localStorage.getItem("theme");

    function getThemeColors() {
        const storedTheme = getStoredTheme();
        if (storedTheme && storedTheme !== "auto") {
            return storedTheme === 'dark' ? darkThemeColors : lightThemeColors;;
        }

        const isDarkTheme =  window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";

        return isDarkTheme ? darkThemeColors : lightThemeColors;
    }

    const themeColors = getThemeColors();

    const data = {
        labels: ['いちご', 'いちじく', '柿', '柘榴', 'スイカ', 'スターフルーツ', '梨', 'パイナップル', 'はっさく', 'バナナ', 'びわ', 'ぶどう', 'ブルーベリー', 'みかん', '柚子', '桃', 'ライチ', 'りんご'].map((v)=>v.split("")),
        datasets: [{
            data: [2, 1, 1, 1, 2, 1, 3, 4, 1, 1, 2, 5, 1, 2, 1, 2, 1, 2],
            backgroundColor: themeColors.backgroundColor,
            borderColor: themeColors.borderColor,
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: themeColors.gridColor,
                    },
                    ticks: {
                        max: 3,
                        min: 0,
                        stepSize: 1,
                        color: themeColors.textColor,
                    },
                },
                x: {
                    grid: {
                        color: themeColors.gridColor,
                    },
                    ticks: {
                        color: themeColors.textColor,
                    }
                },
            },
            plugins: {
                legend: {
                    display: false
                    },
            },
        }
    };

    const myChart = new Chart(
        document.getElementById('fruitChart'),
        config
    );
</script>

---

**[青野ゆらぎ](https://x.com/aonoyuragi){:target="_blank"}**

1. バナナ
2. そのまま持っても手が汚れず、栄養価が高い。

**[犬の注射](https://x.com/kanetomo_seihyo){:target="_blank"}**

1. 梨
2. 上品だから

**[宇佐田灰加](https://twitter.com/_duckengineer){:target="_blank"}**

1. 生まれ変わったらぶどうになりたいです！
2. たくさんだから

**[江間あやせ](https://x.com/emma_sama_sama){:target="_blank"}**

1. パイナップル
2. 派手で攻撃力が高そうだから

**[奥園](https://x.com/okuzono___){:target="_blank"}**

1. 温州みかん
2. 語感が良い！

**[おざわ](https://www.instagram.com/gay.tanka/){:target="_blank"}**

1. パイナップル
2. 見た目ゴツゴツして強そうなのに、中身甘くて美味しくてギャップがあってセクシーだから

**[尾内甲太郎](https://goki.her.jp/){:target="_blank"}**

1. 棗椰子
2. ヒトと同じ物質で創られたらしいから。

**[オルター堂](https://x.com/_reijio){:target="_blank"}**

1. スイカ
2. デカくてつよそう

**㐂子**

1. びわ
2. お父さんが会食でゲットした種を植えたら、小さい木になったから

**[京野正午](https://x.com/kyono_shogo){:target="_blank"}**

1. 柘榴
2. 耽美的でグロテスクなところに惹かれます

**小西善仁 [𝕏](https://x.com/ol_bp42){:target="_blank"} [Instagram](https://www.instagram.com/ponkoni/){:target="_blank"}**

1. りんご

2. なんかよさそう。おさまりがよろしい。一定の支持を受けている気分になれそう。

**[白湯ささみ](https://x.com/sayu_73){:target="_blank"}**

1. 桃
2. 「廃村を告げる活字に桃の皮ふれればにじみゆくばかり　来て／東直子」が好きだから

**[サラリーマン予想](https://x.com/4sigong){:target="_blank"}**

1. 柿
2. 高確率でまた日本に生まれられそうだから

**[雀100](https://x.com/suzumedancing){:target="_blank"}**

1. スイカ
2. 野菜としての顔もあるから

**砂時計**

1. びわ
2. めっちゃ美味しいのに誰の一番でもないから

**[髙山准](https://x.com/m99ejxj){:target="_blank"}**

1. いちご
2. 昔おかあさんといっしょで流れていた「いちごはいちご」という曲が好きだから

**[蛸](https://x.com/tuna_kue27){:target="_blank"}**

1. スターフルーツ
2. 形がかっこよくて、被らない

**[太朗千尋](https://x.com/Tarou_Chihiro){:target="_blank"}**

1. ブルーベリー
2. 語感が非常によい

**[点線画鋲](https://x.com/gabyo_p){:target="_blank"}**

1. イチジク
2. 余裕のある感じ、自分にはない部分なので憧れます！

**[domeki](https://x.com/d0030m){:target="_blank"}**

1. ライチ
2. 基本、食べられたくない。皮と種でちょっと嫌な思いをさせたい。

**[特上あいう](https://x.com/SF_nek0){:target="_blank"}**

1. りんご
2. 甘くておいしい種類が多いのに、原罪の象徴みたいな一面もあるのでかっこいい

**[冨岡正太郎](https://twitter.com/left_ov){:target="_blank"}**

1. シャインマスカット
2. 自我がたくさんありそうだから

**鵺沼こもり**

1. みかん
2. 白いやつ『アルベド』って名前で、錬金術において再結晶、精神的浄化って意味で、かっこいいから

**[nes](https://x.com/nes_mochir){:target="_blank"}**

1. 梨
2. いろいろと好きだから。雰囲気、味や食感、「梨」の漢字の造形など。

**[八谷のり](https://x.com/noriko_kenkou){:target="_blank"}**

1. 梨
2. 秋だけ生きたいから

**[非鋭理反](https://x.com/hyellypan)**

1. 柚子
2. 温泉に浸かれる可能性に賭けたい。

**[東川夢物語](https://x.com/m_p_d_w){:target="_blank"}**

1. パイナップル
2. お肉を柔らかくできるから

**[彦凪　至](https://x.com/hiko6240){:target="_blank"}**

1. パイナップル
2. 絶対に陽キャだから

**[ヒミツー](https://x.com/secret_of_himi2){:target="_blank"}**

1. ぶどう
2. 出世したらワイン（かっこいい酒）になれるから。

**[福住電](https://x.com/fukuzumiden){:target="_blank"}**

1. ぶどう
2. 生まれ変わってもぶどうで大丈夫です

**[福田六個](https://note.com/kuku1899){:target="_blank"}**

1. 八朔
2. 来世も名前の象徴力を頼りに生きていこうと思う

**[三好しほ](https://x.com/myss_025){:target="_blank"}**

1. 桃
2. 愛されて育ってそうだから

**[夕凪らこ](https://x.com/yunagi0ra){:target="_blank"}**

1. いちご
2. 可愛くて温室育ちで他の実ともある程度の距離感があるから

**ゆるもちゆ**

1. マスカット
2. 上品だから。普段のわたしは品の欠けらも無いので……
