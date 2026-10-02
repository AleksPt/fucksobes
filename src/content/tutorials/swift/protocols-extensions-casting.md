---
title: "Протоколы, extensions и приведение типов"
order: 7
---

> **Что узнаешь**
>
> - Что может требовать протокол и как дать ему реализацию по умолчанию
> - Композиция протоколов, class-only (`AnyObject`), `@objc optional`
> - Паттерн «Delegate» и почему `delegate` делают `weak`
> - Что можно и нельзя добавить в `extension`
> - `is`, `as`, `as?`, `as!`, `Any` и `AnyObject`
> - Ещё операторы: побитовые, операторы переполнения, свои операторы

> **Нужно знать заранее:** тутор 01 (struct, class), тутор 03 (инициализаторы, доступ).

## Аналогия: должностная инструкция

- **Протокол** — инструкция «что должен уметь сотрудник». Как именно делает — у каждого своё.
- **Extension** — допуск на новую должность: у человека появляется новый навык, но новых полей в трудовой нет.
- **Delegate** — ты оставил коллеге телефон «позвони, когда будет готово». Ты не знаешь, кто он, только что у него есть номер.
- **Type casting** — проверка бейджа: «это точно бухгалтер?»

## Шаг 1. Требования протокола

> **Протокол** — чертёж требований (свойства, методы, инициализаторы, subscripts, associated types). Структуры, классы и enum «принимают» протокол и реализуют требования.

```swift
protocol Drawable {
    var name: String { get }                 // только чтение
    var lineWidth: Double { get set }        // чтение и запись
    static var kind: String { get }          // требование к типу
    mutating func scale(by factor: Double)   // mutating — для структур
    func draw() -> String
    init(name: String)
}

struct Circle: Drawable {
    let name: String
    var lineWidth = 1.0
    static let kind = "circle"
    init(name: String) { self.name = name }
    mutating func scale(by factor: Double) { lineWidth *= factor }
    func draw() -> String { "○ \(name)" }
}
```

Правила:

- в параметрах методов протокола нельзя задавать значения по умолчанию (делают через `extension`);
- если протокол требует `init`, в классе его реализация — `required init` (если класс не `final`);
- протоколы могут наследоваться от других протоколов и компоноваться через `&`.

```swift
protocol Named { var name: String { get } }
protocol Aged { var age: Int { get } }
protocol Person: Named, Aged { }          // наследование протоколов

func greet(_ x: Named & Aged) {            // композиция
    print("\(x.name), \(x.age)")
}
```

## Шаг 2. Реализация по умолчанию через extension

```swift
protocol Greeter {
    var name: String { get }
    func greet() -> String          // требование протокола
}

extension Greeter {
    func greet() -> String { "Привет, \(name)" }   // реализация по умолчанию
    func shout() -> String { greet().uppercased() }   // НЕ требование, просто добавленный метод
}

struct Guest: Greeter { let name: String }
print(Guest(name: "Аня").greet())   // Привет, Аня
```

> **Ловушка.** Методы в `extension`, которых **нет в требованиях** протокола, вызываются по **статическому типу**. Если тип выражения — `Greeter`, вызовется реализация из extension, даже если конкретный тип объявил своё одноимённое. Подробно и с задачами — в туторе 09.

**Ограничения расширения протокола через `where`:**

```swift
extension Collection where Element: Equatable {
    func allEqual() -> Bool {
        guard let first = self.first else { return true }
        return allSatisfy { $0 == first }
    }
}
print([1, 1, 1].allEqual())   // true
```

## Шаг 3. Специальные классы протоколов

- **`AnyObject`** — протокол ограничения «только классы»: `protocol Observer: AnyObject { }`. Структура его принять не может. Нужен, чтобы утверждать `weak var delegate: Observer?`.
- **`@objc optional`** — необязательные требования, только для `@objc`-протоколов и классов: `@objc protocol P { @objc optional func f() }`. В чистом Swift «необязательность» делают через реализацию по умолчанию в `extension`.
- Протокол как тип: `let items: [Drawable]` — экзистенциальный тип (тутор 08).

## Шаг 4. Delegate — наиболее частое применение

```swift
protocol ButtonDelegate: AnyObject {      // AnyObject нужен для weak
    func didTapButton()
}

final class Button {
    weak var delegate: ButtonDelegate?     // weak: нет цикла удержания
    func tap() { delegate?.didTapButton() }
}

final class ViewController: ButtonDelegate {
    let button = Button()
    init() { button.delegate = self }      // экран держит кнопку, кнопка слабо держит экран
    func didTapButton() { print("Button was tapped") }
}

let vc = ViewController()
vc.button.tap()   // Button was tapped
```

Протоколы также облегчают тестирование: вместо конкретного сервиса подставляется заглушка (mock).

## Шаг 5. Extension

> **Extension** добавляет новое поведение существующему типу без наследования и доступа к исходникам.

**Можно:**

- вычисляемые свойства (экземпляра и типа);
- методы (экземпляра и типа);
- новые инициализаторы (у классов — только `convenience`);
- subscripts, вложенные типы;
- соответствие протоколу.

**Нельзя:**

- **хранимые свойства** экземпляра (менялся бы размер типа);
- **переопределить** существующую реализацию метода того же типа (расширение только добавляет);
- добавить designated-инициализатор или `deinit` классу.

```swift
extension Int {
    var isEven: Bool { self % 2 == 0 }
    func squared() -> Int { self * self }
}
print(4.isEven, 5.squared())   // true 25

extension Array {
    subscript(safe index: Index) -> Element? {      // безопасный индекс (тутор 10)
        indices.contains(index) ? self[index] : nil
    }
}
```

Конвенции:

- расширения своего типа пишут под основным объявлением в том же файле (одно расширение на протокол);
- расширения чужих типов — в отдельных файлах вида `UIColor+Extensions.swift`.

**Conditional conformance.** Тип может соответствовать протоколу только при условии — поэтому `[Int]` сравним через `==`, а массив несравнимых элементов — нет:

```swift
protocol Describable { func describe() -> String }

extension Int: Describable {
    func describe() -> String { "int \(self)" }
}

// массив — Describable, только если Describable его элементы
extension Array: Describable where Element: Describable {
    func describe() -> String { map { $0.describe() }.joined(separator: ", ") }
}

print([1, 2].describe())   // int 1, int 2
```

**Retroactive conformance.** Если ты делаешь чужой тип соответствующим чужому протоколу, начиная с Swift 5.10 компилятор предлагает пометить это `@retroactive` — иначе компилятор предупредит: если владелец типа или протокола позже добавит то же соответствие, возникнет конфликт (SE-0364).

## Шаг 6. Приведение типов

> **Type casting** — проверка типа экземпляра во время выполнения и переход к другому типу из той же иерархии или к протоколу.

| Оператор | Назначение | При неудаче |
| --- | --- | --- |
| `is` | проверяет тип, возвращает `Bool` | `false` |
| `as` | безопасное приведение (upcast, bridging, литералы) | ошибка компиляции |
| `as?` | попытка приведения вниз (downcast) | `nil` |
| `as!` | принудительный downcast | краш |

```swift
class Animal { }
class Dog: Animal { func bark() { print("woof") } }
class Cat: Animal { }

let pets: [Animal] = [Dog(), Cat(), Dog()]

for pet in pets {
    if let dog = pet as? Dog {     // optional binding + downcast
        dog.bark()
    }
}
print(pets[1] is Cat)              // true
let animal = Dog() as Animal       // upcast всегда безопасен

let mixed: [Any] = [1, "hi", true, 3.5]
for item in mixed {
    switch item {
    case let n as Int: print("Int \(n)")
    case let s as String: print("String \(s)")
    default: print("other")
    }
}
```

- **`Any`** — тип, который может хранить значение любого типа, включая функции; **`AnyObject`** — экземпляр любого класса. Их лучше избегать: они теряют статическую типизацию (тутор 08).
- `as?` чаще всего встречается вместе с optional binding. Ещё пример — обработка JSON-словаря `[String: Any]` (тутор 04).

## Шаг 7. Продвинутые операторы

**Побитовые:** `~` (НЕ), `&` (И), `|` (ИЛИ), `^` (XOR), `<<` и `>>` (сдвиги).

```swift
let a: UInt8 = 0b1100
let b: UInt8 = 0b1010
print(a & b)    // 8  (0b1000)
print(a | b)    // 14 (0b1110)
print(a ^ b)    // 6  (0b0110)
print(~a)       // 243 (все 8 бит инвертированы)
print(a << 1)   // 24
```

**Операторы переполнения** `&+`, `&-`, `&*` — без краша, с «заворачиванием». Обычный `+` при переполнении вызывает краш в рантайме:

```swift
let big = UInt8.max
// let boom = big + 1          // краш: arithmetic overflow
let wrapped = big &+ 1         // 0
let (value, overflow) = big.addingReportingOverflow(1)   // (0, true)
```

**Операторы тождественности** `===` и `!==` — проверяют, указывают ли две ссылки на один объект (только классы, тутор 01).

**Свои операторы** с приоритетом и ассоциативностью:

```swift
precedencegroup ExponentiationPrecedence {
    higherThan: MultiplicationPrecedence
    associativity: right
}
infix operator ** : ExponentiationPrecedence

func ** (base: Int, power: Int) -> Int {
    (0..<power).reduce(1) { acc, _ in acc * base }
}

print(2 ** 3 ** 2)   // 512: правая ассоциативность → 2 ** (3 ** 2) = 2 ** 9
```

Составные операторы присваивания (`+=`, `-=`, `*=` и т.д.) объединяют операцию и присваивание; для своих операторов их нужно объявлять отдельно, с `inout` левым аргументом.

## Типичные ошибки

- Делегат без `weak` → цикл удержания; без `AnyObject` в протоколе — ошибка компиляции.
- Добавить метод в `extension` протокола, не внеся его в требования, и ждать полиморфизма.
- Пытаться добавить хранимое свойство в `extension`.
- Думать, что протокол требует вычисляемого свойства — он требует доступа.
- `as!` вместо `as?` без уверенности → краш.
- Хранить данные в `[Any]`, вместо enum с ассоциированными значениями.
- Делать `%` для дробных чисел — не скомпилируется.

<details>
<summary>Каверзный вопрос: что выведет код?</summary>

```swift
protocol P { }
extension P { func method() { print("from protocol") } }
struct C: P { func method() { print("from struct") } }

let first = C()
first.method()
let second: P = C()
second.method()
```

Ответ: `from struct` и `from protocol`. `method` не входит в требования `P`, поэтому выбор реализации делается по статическому типу переменной: `C` в первом случае, `P` во втором. Если добавить `func method()` в сам протокол, второй вывод станет `from struct`.

</details>

## Шпаргалка

```swift
protocol P: AnyObject, Q { var x: Int { get set }; func f(); static func g(); init() }
extension P { func f() { } }                    // реализация по умолчанию
extension Collection where Element: Equatable { }
func h(_ v: P & Q) { }                          // композиция
weak var delegate: P?                            // только для AnyObject-протоколов

x is T;  x as T;  x as? T;  x as! T

&+ &- &*;  ~ & | ^ << >>
infix operator ** : ExponentiationPrecedence
```

## Вопросы для самопроверки

<details>
<summary>1. Что может требовать протокол?</summary>

Свойства (с указанием доступа `get`/`get set`), методы (включая `mutating` и `static`), инициализаторы, subscripts, associated types.

</details>

<details>
<summary>2. Почему delegate делают weak и что для этого нужно в протоколе?</summary>

Чтобы избежать цикла удержания: владелец держит объект, а объект держит делегата. Протокол должен быть помечен `: AnyObject`.

</details>

<details>
<summary>3. Что нельзя делать в extension?</summary>

Добавлять хранимые свойства, переопределять уже существующую реализацию того же типа, добавлять designated-инициализатор или `deinit` классу.

</details>

<details>
<summary>4. Чем as? отличается от as!?</summary>

`as?` возвращает Optional и `nil` при неудаче, `as!` при неудаче роняет приложение.

</details>

<details>
<summary>5. Чем операторы переполнения отличаются от обычных?</summary>

`&+` и другие «заворачивают» результат при переполнении, обычные `+`, `-`, `*` при переполнении вызывают краш.

</details>

<details>
<summary>6. Как задать свой оператор?</summary>

Объявить `infix operator ** : SomePrecedenceGroup` и реализовать функцию с этим именем. Приоритет и ассоциативность задаются в `precedencegroup`.

</details>

## Источники

- [Protocols — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [Extensions — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/extensions/)
- [Type Casting — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/typecasting/)
- [Advanced Operators — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators/)
- [SE-0364: Warning for Retroactive Conformances of External Types](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0364-retroactive-conformance-warning.md)
