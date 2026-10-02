---
title: "What are the HTTP methods GET and POST used for? What other methods are there?"
category: networking
order: 16
---

An HTTP method tells the server which action the client wants to perform on a resource.

- **GET** — retrieve data. There is no request body; parameters go in the query string (`?page=1`). The request is safe (it does not change data) and idempotent, and the response can be cached.
- **POST** — send data to the server: create a resource, submit a form, trigger an action. The data goes in the request body. The method is not idempotent: repeating it may create a duplicate.
- **PUT** — fully replace a resource. Idempotent.
- **PATCH** — partially update a resource.
- **DELETE** — delete a resource. Idempotent.
- **HEAD** — like GET, but without a response body (headers only).
- **OPTIONS** — find out which methods and headers the server supports (used, for example, with CORS).

An **idempotent** method produces the same result on the server when called repeatedly, so such a request can be safely retried after a network failure.

```swift
var components = URLComponents(string: "https://api.example.com/users")!
components.queryItems = [URLQueryItem(name: "page", value: "1")]

var get = URLRequest(url: components.url!)   // GET by default

var post = URLRequest(url: URL(string: "https://api.example.com/users")!)
post.httpMethod = "POST"
post.setValue("application/json", forHTTPHeaderField: "Content-Type")
post.httpBody = try JSONEncoder().encode(newUser)
```
