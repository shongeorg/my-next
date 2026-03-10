# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - button [ref=e4] [cursor=pointer]:
      - img [ref=e5]
    - generic [ref=e7]:
      - generic [ref=e8]:
        - heading "Увійти" [level=1] [ref=e9]
        - paragraph [ref=e10]: Введіть email та пароль для входу
      - generic [ref=e11]:
        - paragraph [ref=e13]: Internal server error
        - generic [ref=e14]:
          - text: Email
          - textbox "Email" [ref=e15]:
            - /placeholder: name@example.com
            - text: nonexistent@test.com
        - generic [ref=e16]:
          - text: Пароль
          - textbox "Пароль" [ref=e17]: wrongpassword
        - button "Увійти" [ref=e18] [cursor=pointer]
      - generic [ref=e19]:
        - text: Немає акаунту?
        - link "Зареєструватися" [ref=e20] [cursor=pointer]:
          - /url: /auth/register
  - button "Open Next.js Dev Tools" [ref=e26] [cursor=pointer]:
    - img [ref=e27]
  - alert [ref=e30]
```