# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - button [ref=e4] [cursor=pointer]:
      - img [ref=e5]
    - generic [ref=e7]:
      - generic [ref=e8]:
        - heading "Зареєструватися" [level=1] [ref=e9]
        - paragraph [ref=e10]: Створіть акаунт для публікації постів
      - generic [ref=e11]:
        - generic [ref=e12]:
          - text: Ім'я
          - textbox "Ім'я" [ref=e13]:
            - /placeholder: John Doe
            - text: Test User
        - generic [ref=e14]:
          - text: Email
          - textbox "Email" [active] [ref=e15]:
            - /placeholder: name@example.com
            - text: invalid
        - generic [ref=e16]:
          - text: Пароль
          - textbox "Пароль" [ref=e17]: password123
        - button "Зареєструватися" [ref=e18] [cursor=pointer]
      - generic [ref=e19]:
        - text: Вже є акаунт?
        - link "Увійти" [ref=e20] [cursor=pointer]:
          - /url: /auth/login
  - button "Open Next.js Dev Tools" [ref=e26] [cursor=pointer]:
    - img [ref=e27]
  - alert [ref=e30]
```