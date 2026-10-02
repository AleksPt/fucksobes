---
title: "How do you test code that decodes a response after a network request?"
category: testing
order: 23
---

The networking layer isn't tied to a real request; instead, the **decoding** step is tested separately, isolated from the network.

**Approach:**

1. Keep a JSON fixture in the test target (a `Response.json` file in the test bundle) or a string with the expected server response.
2. Load it into `Data` and run it through the same `JSONDecoder` that the production code uses.
3. Check that the result is mapped to the expected model.

```swift
func testDecodingUserResponse() throws {
    let data = try loadFixture(named: "user_response") // helper that reads a file from the test bundle
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = .convertFromSnakeCase

    let user = try decoder.decode(User.self, from: data)

    XCTAssertEqual(user.id, 42)
    XCTAssertEqual(user.name, "Alex")
}
```

**What deserves separate tests:**

- a successful response with the full set of fields;
- a response with missing optional fields: it must not fail;
- broken or unexpected JSON: decoding should throw an error rather than crash the app;
- non-standard formats (dates, snake_case keys): that the `JSONDecoder` strategies are configured correctly.

If decoding is built into a network service as a whole (request + parsing), the network is mocked through a protocol wrapper over `URLSession` (a `URLProtocol` stub or your own `NetworkClient` protocol), and the parsing itself is tested the same way: separately, on fixtures, without a real request.
