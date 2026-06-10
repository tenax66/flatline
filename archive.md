---
layout: page
title: ARCHIVE
permalink: /archive/
image: /assets/images/ogp_default.png
---

<div class="archive-page-container">
  {% assign postsByMonth = site.posts | group_by_exp:"post", "post.date | date: '%Y-%m'" %}
  {% for month in postsByMonth %}
    <h2>{{ month.name }}</h2>
    <ul class="archive-page-list">
      {% for post in month.items %}
        <li>
          <span class="archive-page-date">{{ post.date | date: "%Y-%m-%d" }}</span>
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </li>
      {% endfor %}
    </ul>
  {% endfor %}
</div>
