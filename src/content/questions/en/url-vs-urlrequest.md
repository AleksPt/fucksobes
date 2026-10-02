---
title: "What are URL and URLRequest? How do they differ?"
category: networking
order: 9
---

`URL` is a value that describes the address of a resource, either remote (`https://...`) or local (`file://...`). It stores only the address and lets you break it into components.

`URLRequest` is a request to that address: besides the `URL`, it contains the HTTP method (`httpMethod`), headers (`allHTTPHeaderFields`), body (`httpBody`), cache policy and timeout.

```swift
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")
request.httpBody = body
```

For a simple `GET` with no extra parameters, you can pass the `URL` itself to `URLSession`; you need a `URLRequest` when you have to change the method, headers, body or other request settings.
