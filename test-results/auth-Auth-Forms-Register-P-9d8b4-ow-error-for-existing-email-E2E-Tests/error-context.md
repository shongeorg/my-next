# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - button [ref=e4] [cursor=pointer]:
      - img [ref=e5]
    - generic [ref=e7]:
      - generic [ref=e8]:
        - heading "Зареєструватися" [level=1] [ref=e9]
        - paragraph [ref=e10]: Створіть акаунт для публікації постів
      - generic [ref=e11]:
        - paragraph [ref=e13]: Internal server error
        - generic [ref=e14]:
          - text: Ім'я
          - textbox "Ім'я" [ref=e15]:
            - /placeholder: John Doe
            - text: Another User
        - generic [ref=e16]:
          - text: Email
          - textbox "Email" [ref=e17]:
            - /placeholder: name@example.com
            - text: test_1773110903313@test.com
        - generic [ref=e18]:
          - text: Пароль
          - textbox "Пароль" [ref=e19]: password123
        - button "Зареєструватися" [ref=e20] [cursor=pointer]
      - generic [ref=e21]:
        - text: Вже є акаунт?
        - link "Увійти" [ref=e22] [cursor=pointer]:
          - /url: /auth/login
  - button "Open Next.js Dev Tools" [ref=e28] [cursor=pointer]:
    - img [ref=e29]
  - alert [ref=e32]
```