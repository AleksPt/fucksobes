---
title: "Что такое Spy?"
category: testing
order: 15
---

Spy (шпион) — тестовый дублёр, который вызывается вместо реальной зависимости, при этом записывает, как его использовали: какие методы вызывали, сколько раз и с какими аргументами. Тест после выполнения смотрит на записанные данные и делает проверки сам.

```swift
protocol Analytics { func track(_ event: String) }

final class AnalyticsSpy: Analytics {
    private(set) var events: [String] = []
    func track(_ event: String) { events.append(event) }
}

func testLoginTracksEvent() {
    let spy = AnalyticsSpy()
    let sut = LoginViewModel(analytics: spy)
    sut.login()
    XCTAssertEqual(spy.events, ["login"])
}
```

Отличие от Mock: у Mock ожидания заданы заранее и он сам проверяет, что взаимодействие было корректным, а Spy только собирает информацию, и проверки находятся в тесте. Отличие от Stub: Stub возвращает заготовленные ответы и ничего не запоминает. Spy используют, чтобы убедиться, что побочный эффект произошёл (аналитика, логирование, вызов сервиса).
