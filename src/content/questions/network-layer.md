---
title: "Что такое сетевой слой приложения и как его можно реализовать?"
category: networking
order: 15
---

Сетевой слой — часть приложения, которая отвечает за общение с сервером: формирует запросы, отправляет их, обрабатывает ответы и ошибки и отдаёт остальному коду уже готовые модели. Остальные слои (интерактор, репозиторий, view model) не должны знать про `URLSession`, заголовки и JSON.

Из чего он обычно состоит:

- **Описание запроса**: путь, метод, параметры, заголовки, тело (структура или `enum Endpoint`).
- **Клиент**: отправляет запрос через `URLSession` (или Alamofire, Moya) и возвращает данные.
- **Декодирование**: `JSONDecoder` превращает данные в `Decodable`-модели (DTO).
- **Ошибки**: единый тип (`NetworkError`) для отсутствия сети, кодов ответа, ошибок декодирования.
- **Дополнительное**: авторизация и обновление токена, повтор запроса, логирование, кеш — обычно через адаптеры/интерсепторы.

```swift
protocol NetworkClient {
    func send<T: Decodable>(_ endpoint: Endpoint) async throws -> T
}

final class URLSessionClient: NetworkClient {
    private let session: URLSession
    private let decoder = JSONDecoder()
    init(session: URLSession = .shared) { self.session = session }

    func send<T: Decodable>(_ endpoint: Endpoint) async throws -> T {
        let (data, response) = try await session.data(for: endpoint.urlRequest)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw NetworkError.badStatus
        }
        return try decoder.decode(T.self, from: data)
    }
}
```

Способы реализации: тонкая обёртка над `URLSession` с протоколом (проще всего мокать в тестах), готовая библиотека, либо генерация клиента из OpenAPI. Важно скрывать реализацию за протоколом и подавать её через DI.
