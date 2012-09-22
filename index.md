---
layout: default
title: ☁
---

<div id="home">

  <blockquote> It would be a life-long time to paint a beautiful life,
have faith and be brave.  </blockquote>

  <ul class="posts"> Recent Posts
    {% for post in site.posts %}
    <li>
    <span class="timestamp">{{ post.date | date_to_string }}</span>
    <a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
  
</div>
  
