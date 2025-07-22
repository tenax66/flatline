---
layout: page
title: 短歌縦書きテスト
description: 投稿前に短歌の縦書き表示をテストできます。
permalink: /tanka-test/
---
<p>タイトルと短歌を入力すると、縦書きのプレビューが表示されます。</p>
<label for="tanka-title"><b>タイトル</b></label><br>
<input class="form-control" id="tanka-title" type="text" placeholder="タイトルを入力" />
<br>
<label for="tanka-input"><b>短歌</b></label><br>
<textarea class="form-control" id="tanka-input" placeholder="短歌を1行ずつ入力" rows="5"></textarea>

---


<h4 id="tanka-h1-title"></h4>
<span class="fs-4 text-muted">{{ site.time | date: "%b %d, %y" }}</span>
<div class="tanka-area">
  <div class="tanka" id="tanka-preview"></div>
</div>

<details id="tanka-details">
  <summary id="tanka-details-title">タイトル</summary>
  <div id="tanka-details-content"></div>
</details>

<script>
const textarea = document.getElementById('tanka-input');
const preview = document.getElementById('tanka-preview');
const detailsContent = document.getElementById('tanka-details-content');
const titleInput = document.getElementById('tanka-title');
const detailsTitle = document.getElementById('tanka-details-title');
const h1Title = document.getElementById('tanka-h1-title');

function escapeHtml(str) {
  return str.replace(/[&<>"]/g, function(tag) {
    const chars = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'};
    return chars[tag] || tag;
  });
}

function renderTanka() {
  const lines = textarea.value.split(/\r?\n/).filter(line => line.trim() !== '');
  // 縦書きプレビュー
  preview.innerHTML = lines.map(line => `<p>${escapeHtml(line)}</p>`).join('\n');
  // detailsプレビュー
  detailsContent.innerHTML = lines.map(line => `${escapeHtml(line)}<br />`).join('');
  // タイトル反映
  const title = titleInput.value.trim();
  detailsTitle.textContent = title
  h1Title.textContent = title;
}

textarea.addEventListener('input', renderTanka);
titleInput.addEventListener('input', renderTanka);
window.addEventListener('DOMContentLoaded', renderTanka);
</script>
