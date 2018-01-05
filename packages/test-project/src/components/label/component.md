---
title: Label
label: B1
schema:
  +episode(episode):
    episode: 
      type: Episode
      required: true

  +cta(title, url):
    title:
      type: String
      description: Button-Title
      required: true
    url:
      type: String
      description: URL the button leads to
      required: true
---
Test label
