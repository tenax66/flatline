---
layout: page
title: ARCHIVE
permalink: /archive/
image: /assets/images/ogp_default.png
---

<div class="archive-page-container">
  {% assign postsByYear = site.posts | group_by_exp:"post", "post.date | date: '%Y'" %}
  {% for year in postsByYear %}
    <h2>{{ year.name }}</h2>
    {% assign postsByMonth = year.items | group_by_exp:"post", "post.date | date: '%m'" %}
    {% for month in postsByMonth %}
      <h3>{{ month.name }}月</h3>
      <ul class="archive-page-list">
        {% for post in month.items %}
          <li>
            <span class="archive-page-date">{{ post.date | date: "%Y-%m-%d" }}</span>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </li>
        {% endfor %}
      </ul>
    {% endfor %}
  {% endfor %}
</div>
