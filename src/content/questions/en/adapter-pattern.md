---
title: "Tell me more about the Adapter pattern"
category: architecture
order: 68
---

**Adapter** is a structural pattern that converts the interface of one class into the interface the client expects, allowing classes with incompatible interfaces to work together.

Structure:

- **Client**: the application code with the existing business logic.
- **Client interface**: the protocol through which the client expects to work with objects.
- **Service**: a useful class (often third-party) whose interface does not match the client interface.
- **Adapter**: implements the client interface and holds a reference to the service; it accepts calls from the client and translates them into calls the service understands.

```swift
protocol JSONExporting {
    func export() -> Data
}

// A third-party library with an incompatible interface: we can't change it
final class LegacyXMLLibrary {
    func generateXML() -> String { "<data>...</data>" }
}

// The adapter makes LegacyXMLLibrary match the interface the client expects
final class XMLToJSONAdapter: JSONExporting {
    private let legacy = LegacyXMLLibrary()

    func export() -> Data {
        let xml = legacy.generateXML()
        return convertXMLToJSON(xml)
    }
}

func save(_ exporter: JSONExporting) { /* works only with JSONExporting */ }
save(XMLToJSONAdapter())
```

When it is used:

- you need to use a third-party or existing class whose interface does not fit the rest of the application code;
- you need to unify several similar classes under a common interface, but their code cannot be changed (a third-party library) or should not be (you would have to duplicate code across subclasses).

The client works with the adapter only through the client interface, so it is not tied to a specific implementation. Adapters can be replaced or added independently of the rest of the code, for example when a new version of a third-party library is released.

Pros: it separates the interface-conversion details from the client and hides them.

Cons: it complicates the code by adding one more intermediate class.
