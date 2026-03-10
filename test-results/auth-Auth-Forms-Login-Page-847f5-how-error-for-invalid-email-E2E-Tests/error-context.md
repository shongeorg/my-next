# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - button [ref=e4] [cursor=pointer]:
      - img [ref=e5]
    - generic [ref=e7]:
      - generic [ref=e8]:
        - heading "Увійти" [level=1] [ref=e9]
        - paragraph [ref=e10]: Введіть email та пароль для входу
      - generic [ref=e11]:
        - generic [ref=e12]:
          - text: Email
          - textbox "Email" [active] [ref=e13]:
            - /placeholder: name@example.com
            - text: invalid-email
        - generic [ref=e14]:
          - text: Пароль
          - textbox "Пароль" [ref=e15]: password123
        - button "Увійти" [ref=e16] [cursor=pointer]
      - generic [ref=e17]:
        - text: Немає акаунту?
        - link "Зареєструватися" [ref=e18] [cursor=pointer]:
          - /url: /auth/register
  - button "Open Next.js Dev Tools" [ref=e24] [cursor=pointer]:
    - img [ref=e25]
  - alert [ref=e28]
```