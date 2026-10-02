---
title: "Свойства и property wrappers"
order: 2
---

> **Что узнаешь**
>
> - Какие бывают свойства: хранимые, вычисляемые, ленивые, типа (`static`/`class`)
> - Как работают `willSet`/`didSet` и когда они не вызываются
> - Чем `static` отличается от `class`
> - Что на самом деле потокобезопасно у `static` и `lazy`
> - Как устроены property wrappers: `wrappedValue`, `projectedValue`, `$`-синтаксис

> **Нужно знать заранее:** тутор 01 — struct, class, `mutating`.

## Аналогия: бытовая техника

- **Хранимое свойство** — полка в шкафу: вещь просто лежит.
- **Вычисляемое** — табло на микроволновке: самого времени там нет, оно считается из состояния.
- **Lazy** — чайник, который ставят на плиту только когда захотели чаю.
- **Observer** — датчик на двери: срабатывает каждый раз, когда её открывают.
- **Property wrapper** — чехол на вещь: любая вещь, надетая в чехол, получает правила чехла (например, «не выше 20»).

## Шаг 1. Хранимые и вычисляемые свойства

> **Хранимое свойство (stored)** — переменная или константа, лежащая внутри экземпляра. **Вычисляемое (computed)** — не хранит значение, а считает его в `get` и, при желании, обновляет состояние в `set`.

```swift
struct Rectangle {
    var width: Double
    var height: Double

    var area: Double {                 // вычисляемое
        get { width * height }
        set { height = newValue / width }
    }
    var perimeter: Double { 2 * (width + height) }   // только чтение, get можно опустить
}

var r = Rectangle(width: 10, height: 5)
print(r.area)        // 50.0
r.area = 100
print(r.height)      // 10.0
```

- У вычисляемого свойства обязательно явный тип и ключевое слово `var`.
- Вычисляемые свойства допустимы в struct, class и enum. Хранимых полей экземпляра у enum нет (тутор 01).

## Шаг 2. Наблюдатели свойств

> **`willSet`** вызывается перед записью (получает `newValue`), **`didSet`** — после (получает `oldValue`).

```swift
class StepCounter {
    var totalSteps = 0 {
        willSet { print("будет \(newValue)") }
        didSet  { print("добавлено \(totalSteps - oldValue)") }
    }
}
let counter = StepCounter()
counter.totalSteps = 200
// будет 200
// добавлено 200
```

Правила:

- observers **не вызываются** при установке начального значения и внутри собственного `init` класса;
- для унаследованного свойства они вызываются и из `init` подкласса — после вызова `super.init`;
- observers можно навесить на любое хранимое свойство (кроме `lazy`) или на унаследованное свойство в подклассе; на `let` — нельзя: у него нет записи.

## Шаг 3. Lazy-свойства

> **`lazy var`** — хранимое свойство, начальное значение которого вычисляется при **первом обращении**, а не при инициализации.

```swift
class DataImporter { var filename = "data.txt"; init() { print("тяжёлая инициализация") } }

class DataManager {
    lazy var importer = DataImporter()
    var data: [String] = []
}

let manager = DataManager()          // importer ещё не создан
print(manager.importer.filename)     // тяжёлая инициализация → data.txt
```

- Всегда `var`, не `let`: значение появляется после завершения `init`.
- Полезен, когда значение дорогое или зависит от состояния, неизвестного во время инициализации. Внутри замыкания-инициализатора можно обращаться к `self`.
- **Не всегда экономит память:** после создания значение остаётся жить, а проверка «создано ли» делается при каждом обращении.

> `lazy` **не потокобезопасен**: если к ещё не инициализированному свойству одновременно обратятся несколько потоков, нет гарантии, что инициализация выполнится один раз. Нужна синхронизация (тутор «Потокобезопасность» по многопоточности).

## Шаг 4. Свойства типа: static и class

Свойство типа принадлежит самому типу, а не экземпляру. Объявляется `static`, а в классах ещё и `class` (только вычисляемое).

```swift
class Shape {
    static let sides = 0                     // нельзя переопределить
    class var name: String { "shape" }       // можно переопределить в потомке
    class func make() -> Shape { Shape() }
}
class Circle: Shape {
    override class var name: String { "circle" }
}
print(Circle.name)   // circle
```

- `static` — это `class final`: переопределять нельзя.
- `class` допустим только для вычисляемых свойств и методов. Хранимое свойство типа — только `static`.
- Хранимые свойства типа ленивы: инициализируются при первом обращении.

**(дополнено)** **Swift 6.** В языковом режиме Swift 6 изменяемая глобальная или `static var` переменная без изоляции — ошибка компиляции (strict concurrency, SE-0412). Способы исправить: сделать `let`, изолировать `@MainActor`, обернуть в актор, либо явно пометить `nonisolated(unsafe)`, если синхронизацию обеспечиваешь сам.

```swift
struct AppConfig {
    static let apiURL = "https://api.example.com"   // ок: неизменяемое, инициализация один раз

    @MainActor static var isDebug = false           // ок: доступ только с главного актора
}
```

Почему синглтон часто делают так: `static let shared = Service()` — один экземпляр, создаётся лениво и один раз.

## Шаг 5. Property wrappers

> **Property wrapper** — тип, помеченный `@propertyWrapper`, который инкапсулирует логику чтения и записи свойства и позволяет переиспользовать её атрибутом (`@Wrapper var x`).

Обязательное требование — свойство **`wrappedValue`**. Компилятор превращает `@Capitalized var name: String` в скрытое хранимое свойство `_name` типа `Capitalized` и вычисляемое `name`, которое ходит через `wrappedValue`.

```swift
import Foundation

@propertyWrapper
struct Capitalized {
    private var value = ""
    var wrappedValue: String {
        get { value }
        set { value = newValue.capitalized }
    }
}

struct Person {
    @Capitalized var name: String
}

var p = Person()
p.name = "john doe"
print(p.name)   // John Doe
```

**Пример с ограничением (до и после).** Нужен прямоугольник, высота которого не больше 20:

```swift
// до: логика зашита в одну структуру
struct SmallRectangle {
    private var _height = 0
    var height: Int {
        get { _height }
        set { _height = min(newValue, 20) }
    }
}

// после: логика переиспользуется
@propertyWrapper
struct TwentyOrLess {
    private var number = 0
    var wrappedValue: Int {
        get { number }
        set { number = min(newValue, 20) }
    }
}

struct Rect2 {
    @TwentyOrLess var height: Int
    @TwentyOrLess var width: Int
}
```

```swift
import Foundation

@propertyWrapper
struct UserDefault<Value> {
    let key: String
    let defaultValue: Value
    var storage: UserDefaults = .standard

    var wrappedValue: Value {
        get { storage.object(forKey: key) as? Value ?? defaultValue }
        nonmutating set { storage.set(newValue, forKey: key) }
    }
}

struct Settings {
    @UserDefault(key: "mark-as-read", defaultValue: false)
    var autoMarkAsRead: Bool
}

let settings = Settings()
settings.autoMarkAsRead = true
print(settings.autoMarkAsRead)   // true
```

**`projectedValue` и `$`.** Обёртка может открыть дополнительный интерфейс через `projectedValue`; он доступен с префиксом `$`:

```swift
@propertyWrapper
struct Clamped {
    private var value: Int
    let range: ClosedRange<Int>
    private(set) var projectedValue = false      // «значение пришлось обрезать?»

    init(wrappedValue: Int, _ range: ClosedRange<Int>) {
        self.range = range
        self.value = min(max(wrappedValue, range.lowerBound), range.upperBound)
        self.projectedValue = self.value != wrappedValue
    }

    var wrappedValue: Int {
        get { value }
        set {
            value = min(max(newValue, range.lowerBound), range.upperBound)
            projectedValue = value != newValue
        }
    }
}

struct Volume { @Clamped(0...100) var level: Int = 50 }

var v = Volume()
v.level = 150
print(v.level, v.$level)   // 100 true
```

<details>
<summary>Почему так?</summary>

`v.level` ходит через `wrappedValue`, а `v.$level` — это `projectedValue` обёртки. SwiftUI построен на том же механизме: `@State var count` даёт значение, а `$count` — `Binding`.

</details>

> Список встроенных обёрток SwiftUI (`@State`, `@Binding`, `@Environment` и т.д.) разбирается в теме «SwiftUI».

## Типичные ошибки

- Ждать, что `willSet`/`didSet` сработают в собственном `init` или при установке значения по умолчанию.
- Объявить `lazy let` — не скомпилируется, нужен `var`.
- Считать `lazy` потокобезопасным или всегда экономящим память.
- Использовать `static var` как «потокобезопасный» глобальный счётчик.
- Пытаться объявить хранимое `class var` — допустимо только вычисляемое.
- Забыть, что wrapper хранится как скрытое поле `_name` (оно увеличивает размер структуры).

<details>
<summary>Каверзный вопрос: почему синглтон делают через static?</summary>

Ленивая инициализация хранимого `static`-свойства гарантированно происходит один раз даже при гонке потоков. Но если у синглтона есть изменяемое состояние, его всё равно нужно защищать отдельно.

</details>

## Шпаргалка

```swift
var a: Int { get { 1 } set { /* newValue */ } }   // вычисляемое
var b = 0 { willSet { } didSet { /* oldValue */ } }
lazy var c = HeavyThing()          // только var, не потокобезопасно
static let shared = Service()      // ленивая однократная инициализация
class var overridable: String { "x" }   // class — только вычисляемое

@propertyWrapper struct W {
    var wrappedValue: Int           // обязательно
    var projectedValue: Bool { true }   // по желанию, доступно как $x
}
```

## Вопросы для самопроверки

<details>
<summary>1. Чем static отличается от class?</summary>

`static` нельзя переопределить в потомках (это `class final`); `class` можно, но только для методов и вычисляемых свойств.

</details>

<details>
<summary>2. Когда не вызываются willSet и didSet?</summary>

При установке начального значения и внутри `init` собственного класса. Для унаследованных свойств — вызываются из `init` потомка после `super.init`.

</details>

<details>
<summary>3. Что такое lazy-свойство и всегда ли оно экономит память?</summary>

Свойство, значение которого вычисляется при первом обращении. Не всегда: после вычисления значение остаётся, а проверка выполняется при каждом обращении.

</details>

<details>
<summary>4. Потокобезопасны ли lazy и static?</summary>

`lazy var` — нет. Хранимое `static`-свойство потокобезопасно только по части однократной инициализации, но не по изменению значения.

</details>

<details>
<summary>5. Как устроен property wrapper под капотом?</summary>

Компилятор создаёт скрытое поле `_name` типа обёртки и вычисляемое `name`, обращающееся к `wrappedValue`. `projectedValue` доступен как `$name`.

</details>

<details>
<summary>6. Чем вычисляемое свойство отличается от метода?</summary>

Синтаксически — отсутствием скобок вызова; семантически — это «значение, а не действие». Для дорогих или побочных операций лучше метод.

</details>

## Источники

- [Properties — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/)
- [Attributes (propertyWrapper) — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/attributes/)
- [SE-0258: Property Wrappers](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0258-property-wrappers.md)
- [SE-0412: Strict concurrency for global variables](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0412-strict-concurrency-for-global-variables.md)
