---
layout: page
title: 短歌縦書きテスト
description: 投稿前に短歌の縦書き表示をテストできます。
permalink: /tanka-test/
---
<p>タイトルと短歌を入力すると、縦書きのプレビューが表示されます。</p>
<label for="tanka-title"><b>タイトル</b></label><br>
<input id="tanka-title" type="text" style="width:100%;max-width:500px;font-size:1.1em;margin-bottom:1em;"
  placeholder="タイトルを入力" />
<br>
<label for="tanka-input"><b>短歌</b></label><br>
<textarea id="tanka-input" rows="8" style="width:100%;max-width:500px;font-size:1.2em;"
  placeholder="短歌を1行ずつ入力"></textarea>

#### プレビュー

<div class="tanka-area" style="margin-bottom:1em;">
  <div class="tanka" id="tanka-preview" style="min-height:7em;"></div>
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

  function escapeHtml(str) {
    return str.replace(/[&<>"]/g, function (tag) {
      const chars = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
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
    detailsTitle.textContent = titleInput.value.trim() ? titleInput.value : 'タイトル';
  }

  textarea.addEventListener('input', renderTanka);
  titleInput.addEventListener('input', renderTanka);
  window.addEventListener('DOMContentLoaded', renderTanka);
</script>
