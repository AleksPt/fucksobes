---
title: "Что такое URL и URLRequest? В чём их отличие?"
category: networking
order: 9
---

`URL` — значение, описывающее адрес ресурса: удалённого (`https://...`) или локального (`file://...`). Он хранит только путь и позволяет разбирать его на компоненты.

`URLRequest` — запрос к этому адресу: помимо `URL` он содержит HTTP-метод (`httpMethod`), заголовки (`allHTTPHeaderFields`), тело (`httpBody`), политику кэширования и таймаут.

```swift
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")
request.httpBody = body
```

Если нужен простой `GET` без дополнительных параметров, в `URLSession` можно передать сам `URL`, а `URLRequest` понадобится, когда требуется изменить метод, заголовки, тело или другие настройки запроса.
