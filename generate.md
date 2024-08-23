---
layout: page
title: Generator
permalink: /generator/
image: /assets/images/ogp_default.jpg
---

<div class="form-group">
    <label for="author">Author</label>
    <input type="text" id="author" class="form-control" placeholder="藤原定家">
</div>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" class="form-control" placeholder="新古今和歌集">
</div>

<div class="form-group">
    <label for="tanka">Tanka</label>
    <textarea id="tanka" class="form-control" rows="5" placeholder="見わたせば花も紅葉もなかりけり浦のとまやの秋の夕暮"></textarea>
</div>

<button class="btn btn-primary" onclick="generateTanka()">Generate HTML</button>

<div class="form-group mt-4">
    <label for="outputHtml">生成されたHTML</label>
    <textarea id="outputHtml" class="form-control" rows="5" readonly></textarea>
</div>

<script>
function generateTanka() {
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const tanka = document.getElementById('tanka').value;

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
    const outputHtml = [
       `---`,
       `layout: post`,
       `title: ` + title, 
       `image: /assets/images/ogp_default.jpg`,
       `author: ` + author,
       `category: ` + author,
       `emoji: 🐕`,
       `---`,
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
