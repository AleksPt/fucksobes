---
title: "Когда имеет смысл комбинировать async/await с Combine или RxSwift и какие есть подводные камни?"
category: concurrency
order: 117
---

Комбинировать имеет смысл не «на постоянной основе», а как временный или пограничный мост между двумя моделями:

- **при поэтапной миграции** — старый код или библиотека ещё используют `Combine`/`RxSwift`, а новые API уже пишутся на `async/await`, и полностью переписать всё сразу нельзя;
- когда нужен **реактивный поток значений** (`Publisher`), но сами значения приходят асинхронно, из `async`-функций;
- в UI-сценариях, где `@Published`, `ObservableObject`, `Binding` всё ещё на Combine, а бизнес-логика уже переходит на `async/await`.

**Из `Publisher` в `AsyncSequence`:**

```swift
let publisher: AnyPublisher<Int, Never> = ...

for await value in publisher.values {
    print("Received \(value)")
}
```

Swift предоставляет `.values` — готовый адаптер Combine → `AsyncSequence`.

**Из `async` в `Publisher`:**

```swift
func load() async -> Int { 42 }

func loadPublisher() -> AnyPublisher<Int, Never> {
    Future { promise in
        Task {
            let result = await load()
            promise(.success(result))
        }
    }.eraseToAnyPublisher()
}
```

Подводные камни:

- **Лишняя обёртка.** Цепочка `Future → Task → await → Future` может оказаться избыточной, если можно просто переписать вызывающий код на `async/await` целиком.
- **Ошибки и отмена обрабатываются по-разному.** `Combine` может завершить поток через `.cancel()` подписки, а `Task.cancel()` — другая логика, требующая отдельной обработки отмены внутри `Future`.
- **Retain cycles.** Если внутри `Combine`/`Task` используется `self`, легко забыть `weak self` и получить утечку.
- **Несовпадение моделей потребления.** `Combine` — push-модель: издатель отправляет значения, а подписчик через `Subscribers.Demand` ограничивает их число (backpressure; `sink` и `assign` запрашивают неограниченный demand). `AsyncSequence` — pull-модель: потребитель сам запрашивает следующее значение через `next()`. Переход между ними требует внимательности к моменту, когда именно начинается вычисление.

Best practices:

- для новой логики использовать `async/await` напрямую, без обёрток в `Combine`;
- изолировать взаимодействие двух миров в отдельных адаптерах (например, `PublisherToAsyncSequenceAdapter`, `AsyncToPublisherBridge`), а не размазывать конверсии по всему коду;
- не делать двусторонние конверсии «на лету» в середине бизнес-логики — это запутывает отладку и следы стека вызовов.
