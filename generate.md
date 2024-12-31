---
layout: page
title: Generator
permalink: /generator/
image: /assets/images/ogp_default.png
---

<div class="form-group">
    <label for="author">Author</label>
    <select id="author" class="form-control">
        <option value="青野ゆらぎ">青野ゆらぎ</option>
        <option value="犬の注射">犬の注射</option>
        <option value="domeki">domeki</option>
        <option value="サラリーマン予想">サラリーマン予想</option>
        <option value="オルター堂">オルター堂</option>
        <option value="福住電">福住電</option>
        <option value="東川夢物語">東川夢物語</option>
        <option value="おざわ">おざわ</option>
        <option value="江間あやせ">江間あやせ</option>
        <option value="非鋭理反">非鋭理反</option>
        <option value="彦凪　至">彦凪　至</option>
        <option value="特上あいう">特上あいう</option>
        <option value="点線画鋲">点線画鋲</option>
        <option value="奥園">奥園</option>
        <option value="ヒミツー">ヒミツー</option>
        <option value="冨岡正太郎">冨岡正太郎</option>
        <option value="夕凪らこ">夕凪らこ</option>
        <option value="㐂子">㐂子</option>
        <option value="宇佐田灰加">宇佐田灰加</option>
        <option value="八谷のり">八谷のり</option>
        <option value="京野正午">京野正午</option>
        <option value="三好しほ">三好しほ</option>
        <option value="福田六個">福田六個</option>
        <option value="太朗千尋">太朗千尋</option>
    </select>
</div>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" class="form-control" placeholder="新古今和歌集">
</div>

<div class="form-group">
    <label for="tanka">Tanka</label>
    <textarea id="tanka" class="form-control" rows="5" placeholder="見わたせば花も紅葉もなかりけり浦のとまやの秋の夕暮"></textarea>
</div>

<div class="form-group">
    <label for="emoji">Emoji</label>
    <select id="emoji" class="form-control">
        <option value="🐕">🐕 青野ゆらぎ</option>
        <option value="💉">💉 犬の注射</option>
        <option value="🏝️">🏝️ domeki</option>
        <option value="🏘️">🏘️ サラリーマン予想</option>
        <option value="🎸">🎸 オルター堂</option>
        <option value="💡">💡 福住電</option>
        <option value="🦷">🦷 東川夢物語</option>
        <option value="🧢">🧢 おざわ</option>
        <option value="🍳">🍳 江間あやせ</option>
        <option value="🕯️">🕯️ 非鋭理反</option>
        <option value="🧭">🧭 彦凪　至</option>
        <option value="🎠">🎠 特上あいう</option>
        <option value="📌">📌 点線画鋲</option>
        <option value="🪴">🪴 奥園</option>
        <option value="🤫">🤫 ヒミツー</option>
        <option value="🎺">🎺 冨岡正太郎</option>
        <option value="🧊">🧊 夕凪らこ</option>
        <option value="🍑">🍑 㐂子</option>
        <option value="🐰">🐰 宇佐田灰加</option>
        <option value="🍞">🍞 八谷のり</option>
        <option value="☕️">☕️ 京野正午</option>
        <option value="🫖">🫖 三好しほ</option>
        <option value="☁️">☁️ 福田六個</option>
        <option value="🌲">🌲 太朗千尋</option>
    </select>
</div>

<button class="btn btn-primary" onclick="generateTanka()">Generate HTML</button>

<div class="form-group mt-4">
    <label for="outputHtml">Generated HTML</label>
    <textarea id="outputHtml" class="form-control" rows="5" readonly></textarea>
</div>

<script>
function generateTanka() {
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const tanka = document.getElementById('tanka').value;
    const emoji = document.getElementById('emoji').value;

    // 改行で短歌を分割
    const tankaLines = tanka.split('\n');

    var tankaMain = [];
    tankaLines.forEach(function(line) {
        tankaMain.push('<p>' + line + '</p>' + '\n');
    });

    var tankaSummary = [];
    tankaLines.forEach(function(line) {
        tankaSummary.push(line + '<br/>');
    });

    // 出力されるHTML文字列を生成
    // TODO: 絵文字を簡単に選べるようにする
    const outputHtml = [
       `---`,
       `layout: post`,
       `title: ` + title, 
       `image: /assets/images/ogp_default.png`,
       `author: ` + author,
       `category: ` + author,
       `emoji: ` + emoji,
       `---\n`,
        `<div class="tanka-area"><div class="tanka">`,
    ].concat(
        tankaMain, 
        [
            `</div></div>\n`, 
            `---\n`,
            `<details><summary>` + title + `</summary>`,
        ],
        tankaSummary,
        `<br/>\n`,
        `</details>\n`,
        author + '\n',
    ).join('\n');

    // 生成されたHTMLをテキストボックスにプレーンテキストとして出力
    document.getElementById('outputHtml').value = outputHtml;
}
</script>
