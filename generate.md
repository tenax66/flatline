---
layout: page
title: Generator
permalink: /generator/
image: /assets/images/ogp_default.jpg
---
<div class="form-group">
    <label for="author">作者名</label>
    <input type="text" id="author" class="form-control" placeholder="作者名を入力してください">
</div>

<div class="form-group">
    <label for="tanka">短歌</label>
    <textarea id="tanka" class="form-control" rows="5" placeholder="短歌を入力してください（改行で区切る）"></textarea>
</div>

<button class="btn btn-primary" onclick="generateTanka()">短歌を生成</button>

<div class="form-group mt-4">
    <label for="outputHtml">生成されたHTML</label>
    <textarea id="outputHtml" class="form-control" rows="5" readonly></textarea>
</div>

<script>
function generateTanka() {
    var author = document.getElementById('author').value;
    var tanka = document.getElementById('tanka').value;

    // 改行で短歌を分割
    var tankaLines = tanka.split('\n');
    var tankaHtml = '';

    // 短歌をHTMLに変換
    tankaLines.forEach(function(line) {
        tankaHtml += line + '<br>';
    });

    // 出力されるHTML文字列を生成
    var outputHtml = '<strong>作者: ' + author + '</strong><br>' + tankaHtml;

    // 生成されたHTMLをテキストボックスにプレーンテキストとして出力
    document.getElementById('outputHtml').value = outputHtml;
}
</script>
