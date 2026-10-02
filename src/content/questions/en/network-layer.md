---
title: "What is an app's network layer and how can it be implemented?"
category: networking
order: 15
---

The network layer is the part of the app responsible for talking to the server: it builds requests, sends them, handles responses and errors, and hands ready-made models to the rest of the code. Other layers (interactor, repository, view model) should know nothing about `URLSession`, headers or JSON.

What it usually consists of:

- **Request description**: path, method, parameters, headers, body (a struct or an `enum Endpoint`).
- **Client**: sends the request through `URLSession` (or Alamofire, Moya) and returns the data.
- **Decoding**: `JSONDecoder` turns the data into `Decodable` models (DTOs).
- **Errors**: a single type (`NetworkError`) covering no connectivity, response status codes and decoding errors.
- **Extras**: authorization and token refresh, request retry, logging, caching — usually implemented through adapters/interceptors.

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

Ways to implement it: a thin wrapper over `URLSession` behind a protocol (the easiest to mock in tests), an off-the-shelf library, or a client generated from OpenAPI. It is important to hide the implementation behind a protocol and inject it through DI.
