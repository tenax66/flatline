---
layout: page
title: About
permalink: /about/
image: /assets/images/ogp_default.png
---

### Member

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
        labels: ['柿', 'スイカ', '梨', 'パイナップル', 'バナナ', 'びわ', 'ぶどう', 'ライチ'],
        datasets: [{
            data: [1, 1, 1, 3, 1, 1, 1, 1], 
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

**[江間あやせ](https://x.com/emma_sama_sama)**

1. パイナップル
2. 派手で攻撃力が高そうだから

**[おざわ](https://www.instagram.com/gay.tanka/)**

1. パイナップル
2. 見た目ゴツゴツして強そうなのに、中身甘くて美味しくてギャップがあってセクシーだから

**[オルター堂](https://x.com/_reijio)**

1. スイカ
2. デカくてつよそう

**[サラリーマン予想](https://x.com/4sigong)**

1. 柿
2. 高確率でまた日本に生まれられそうだから

**砂時計**

1. びわ
2. めっちゃ美味しいのに誰の一番でもないから

**[domeki](https://x.com/d0030m)**

1. ライチ
2. 基本、食べられたくない。皮と種でちょっと嫌な思いをさせたい。

**[東川夢物語](https://x.com/m_p_d_w)**

1. パイナップル
2. お肉を柔らかくできるから

**福住電**

1. ぶどう
2. 生まれ変わってもぶどうで大丈夫です
