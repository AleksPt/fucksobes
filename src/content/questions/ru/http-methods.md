---
title: "Для чего нужны HTTP-методы GET и POST? Какие ещё бывают методы?"
category: networking
order: 16
---

HTTP-метод сообщает серверу, какое действие клиент хочет выполнить с ресурсом.

- **GET** — получить данные. Тела запроса нет, параметры передаются в строке запроса (`?page=1`). Запрос безопасный (не меняет данные) и идемпотентный, ответ можно кэшировать.
- **POST** — отправить данные на сервер: создать ресурс, отправить форму, запустить действие. Данные идут в теле запроса. Метод не идемпотентен: повтор может создать дубликат.
- **PUT** — полностью заменить ресурс. Идемпотентен.
- **PATCH** — частично изменить ресурс.
- **DELETE** — удалить ресурс. Идемпотентен.
- **HEAD** — как GET, но без тела ответа (только заголовки).
- **OPTIONS** — узнать, какие методы и заголовки поддерживает сервер (используется, например, при CORS).

**Идемпотентный** метод при повторном вызове даёт тот же результат на сервере, поэтому такой запрос безопасно повторить при сбое сети.

```swift
var components = URLComponents(string: "https://api.example.com/users")!
components.queryItems = [URLQueryItem(name: "page", value: "1")]

var get = URLRequest(url: components.url!)   // GET по умолчанию

var post = URLRequest(url: URL(string: "https://api.example.com/users")!)
post.httpMethod = "POST"
post.setValue("application/json", forHTTPHeaderField: "Content-Type")
post.httpBody = try JSONEncoder().encode(newUser)
```
