---
layout: default
title: archive
---

<section id="archive">
  <h1>archive</h1>
  <ul class="posts">
    {% for post in site.posts %}
    <li><time datetime="{{post.date}}">{{ post.date | date_to_string }}</time>
    <a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
</section>
