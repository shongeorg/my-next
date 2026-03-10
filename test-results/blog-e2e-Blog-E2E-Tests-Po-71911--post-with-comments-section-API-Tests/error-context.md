# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]: Post for comments | Blog
  - main [ref=e12]:
    - article [ref=e13]:
      - generic [ref=e14]:
        - link "← Back to all posts" [ref=e15] [cursor=pointer]:
          - /url: /
          - button "← Back to all posts" [ref=e16]
        - button [ref=e18] [cursor=pointer]:
          - img [ref=e19]
      - generic [ref=e21]:
        - heading "Post for comments" [level=1] [ref=e22]
        - generic [ref=e23]:
          - generic [ref=e24]: Test User
          - generic [ref=e25]: •
          - time [ref=e26]: 1 хвилину тому
      - paragraph [ref=e28]: Content
      - generic [ref=e29]:
        - heading "Коментарі (0)" [level=2] [ref=e30]
        - paragraph [ref=e32]:
          - link "Увійдіть" [ref=e33] [cursor=pointer]:
            - /url: /auth/login
          - text: щоб додати коментар
        - paragraph [ref=e34]: Коментарів ще немає. Будьте першими!
```