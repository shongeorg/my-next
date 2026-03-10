# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - heading "Редагувати пост" [level=1] [ref=e5]
        - generic [ref=e6]:
          - button [ref=e7] [cursor=pointer]:
            - img [ref=e8]
          - link "← Назад до поста" [ref=e10] [cursor=pointer]:
            - /url: /posts/c3e41ccd-2159-4a1d-a88f-8608c4470e06
            - button "← Назад до поста" [ref=e11]
      - generic [ref=e13]:
        - generic [ref=e14]:
          - text: Заголовок
          - textbox "Заголовок" [ref=e15]:
            - /placeholder: Введіть заголовок
        - generic [ref=e16]:
          - text: Контент
          - textbox "Контент" [ref=e17]:
            - /placeholder: Введіть контент
        - button "Зберегти зміни" [ref=e18] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e24] [cursor=pointer]:
    - img [ref=e25]
  - alert [ref=e28]
```