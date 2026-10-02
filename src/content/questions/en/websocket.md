---
title: "What is WebSocket? What is it used for? How does it differ from regular HTTP requests?"
category: networking
order: 11
---

WebSocket is a protocol that provides a persistent, two-way channel between client and server over a single TCP connection. The connection is established with an HTTP request carrying an `Upgrade: websocket` header and then stays open, and both sides can send messages at any time.

How it differs from HTTP: in HTTP the client initiates every request-response exchange, and the server cannot push data on its own. To receive updates, you have to poll the server. With WebSocket the server sends data itself, without extra headers or repeated connections, so latency and overhead are lower.

It is used for chats, stock tickers, online games, collaborative editing and other real-time scenarios. In iOS there is `URLSessionWebSocketTask` (iOS 13+):

```swift
let task = URLSession.shared.webSocketTask(with: url)
task.resume()
try await task.send(.string("hello"))
let message = try await task.receive()
```
