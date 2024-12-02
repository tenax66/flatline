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

<canvas id="fruitChart" class="fruitChart" width="400" height="200"></canvas>

<script>
    const lightThemeColors = {
        backgroundColor: '',
        borderColor: '',
        gridColor: '96968C',
        color: '#212529',
    };

    const darkThemeColors = {
        backgroundColor: '',
        borderColor: '',
        gridColor: '#96968C',
        textColor: '#E1E1E1',
    };

    function getThemeColors() {
        const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

        return isDarkTheme ? darkThemeColors : lightThemeColors;
    }

    const themeColors = getThemeColors();

    const data = {
        labels: ['いちご', 'いちじく', '柿', 'スイカ', '梨', 'パイナップル', 'バナナ', 'びわ', 'ぶどう','みかん', '柚子', '桃', 'ライチ', 'りんご'].map((v)=>v.split("")),
        datasets: [{
            data: [1, 1, 1, 1, 2, 4, 1, 2, 4, 1, 1, 1, 1, 1], 
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

**[青野ゆらぎ](https://x.com/aonoyuragi)**

1. バナナ
2. そのまま持っても手が汚れず、栄養価が高い。

**[犬の注射](https://x.com/kanetomo_seihyo)**

1. 梨
2. 上品だから

**[宇佐田灰加](https://twitter.com/_duckengineer)**
1. 生まれ変わったらぶどうになりたいです！
2. たくさんだから

**[江間あやせ](https://x.com/emma_sama_sama)**

1. パイナップル
2. 派手で攻撃力が高そうだから

**[奥園](https://x.com/okuzono___)**

1. 温州みかん
2. 語感が良い！

**[おざわ](https://www.instagram.com/gay.tanka/)**

1. パイナップル
2. 見た目ゴツゴツして強そうなのに、中身甘くて美味しくてギャップがあってセクシーだから

**[オルター堂](https://x.com/_reijio)**

1. スイカ
2. デカくてつよそう

**㐂子**

1. びわ
2. お父さんが会食でゲットした種を植えたら、小さい木になったから

**[白湯ささみ](https://x.com/sayu_73)**

1. 桃
2. 「廃村を告げる活字に桃の皮ふれればにじみゆくばかり　来て／東直子」が好きだから

**[サラリーマン予想](https://x.com/4sigong)**

1. 柿
2. 高確率でまた日本に生まれられそうだから

**砂時計**

1. びわ
2. めっちゃ美味しいのに誰の一番でもないから

**[点線画鋲](https://x.com/gabyo_p)**

1. イチジク
2. 余裕のある感じ、自分にはない部分なので憧れます！

**[domeki](https://x.com/d0030m)**

1. ライチ
2. 基本、食べられたくない。皮と種でちょっと嫌な思いをさせたい。

**[特上あいう](https://x.com/SF_nek0)**

1. りんご
2. 甘くておいしい種類が多いのに、原罪の象徴みたいな一面もあるのでかっこいい

**[冨岡正太郎](https://twitter.com/left_ov)**

1. シャインマスカット
2. 自我がたくさんありそうだから

**[八谷のり](https://x.com/noriko_kenkou)**
1. 梨
2. 秋だけ生きたいから

**非鋭理反**

1. 柚子
2. 温泉に浸かれる可能性に賭けたい。

**[東川夢物語](https://x.com/m_p_d_w)**

1. パイナップル
2. お肉を柔らかくできるから

**[彦凪　至](https://x.com/hiko6240)**

1. パイナップル
2. 絶対に陽キャだから

**[ヒミツー](https://x.com/secret_of_himi2)**

1. ぶどう
2. 出世したらワイン（かっこいい酒）になれるから。

**福住電**

1. ぶどう
2. 生まれ変わってもぶどうで大丈夫です

**[夕凪らこ]()**

1. いちご
2. 可愛くて温室育ちで他の実ともある程度の距離感があるから
