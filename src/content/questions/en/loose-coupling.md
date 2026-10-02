---
title: "What is loosely coupled code? What is its advantage over tightly coupled code?"
category: architecture
order: 33
---

Coupling shows how much one module depends on the details of another. In tightly coupled code, components call each other directly and know the concrete types and internal structure of their neighbors, so a change in one place breaks others. In loosely coupled code, components communicate through abstractions (protocols), and concrete dependencies are passed in from outside (Dependency Injection).

```swift
protocol PaymentService { func pay(_ amount: Decimal) async throws }

final class Checkout {
    private let service: PaymentService
    init(service: PaymentService) { self.service = service }
}
```

`Checkout` does not know which service it will be given: a real one or a test one.

Advantages: the implementation can be replaced without edits to the rest of the code, components are easier to test (by substituting mocks), they can be reused and evolved independently, and modules are built and compiled separately. The price is extra abstractions and code, so coupling is reduced where it is justified.
