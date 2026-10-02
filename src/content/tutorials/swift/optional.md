---
title: "Optional"
order: 4
---

> **Что узнаешь**
>
> - Что такое Optional под капотом и как он реализован
> - Все способы распаковки и когда какой выбрать
> - Optional chaining, `??`, `guard let`, `if let`-сокращение
> - Чем `map` отличается от `flatMap` у Optional
> - Как написать свой Optional (классическая задача с собеседований)
> - Что такое `ExpressibleByNilLiteral` и implicitly unwrapped optionals

> **Нужно знать заранее:** тутор 01 (enum, ассоциированные значения), основы дженериков (подробно в туторе 08).

## Аналогия: коробка с сюрпризом

Optional — это коробка, в которой **что-то есть** или **ничего нет**.

- **Распаковка** — открыть коробку. Принудительно (`!`) — вскрыть, не заглядывая: если пусто, будет скандал (краш).
- **Optional binding** — сначала заглянуть, а если что-то есть, переложить в безопасное место.
- **`??`** — если коробка пуста, взять запасной подарок.
- **Optional chaining** — цепочка коробок: если хоть одна пустая, вся цепочка даёт «пусто».

## Шаг 1. Optional — это enum

> **Optional** — обычный generic-enum стандартной библиотеки с двумя случаями: `.none` (значения нет, то же, что `nil`) и `.some(Wrapped)` (значение есть).

```swift
enum Optional<Wrapped> {
    case none
    case some(Wrapped)
}

let a: Int? = 42          // короткая запись
let b: Optional<Int> = .some(42)   // полная
let c: Int? = nil         // то же, что .none
```

Преимущества:

- отсутствие значения проверяется **на этапе компиляции**: нельзя забыть обработать `nil`;
- в рантайме Swift почти никогда не падает с «null pointer»: единственный путь — принудительная распаковка `nil`;
- переменная Optional без значения автоматически равна `nil`.

Процесс превращения `T?` в `T` называется **распаковкой (unwrapping)**, а не приведением — это подчёркивает, что Optional является контейнером.

## Шаг 2. Способы распаковки

```swift
let name: String? = "Swift"
```

| Способ | Пример | Когда |
| --- | --- | --- |
| Force unwrap | `name!` | только если `nil` — баг программиста; при `nil` краш |
| Optional binding | `if let n = name { }` | нужно действие только если значение есть |
| `guard let` | `guard let n = name else { return }` | ранний выход, значение нужно до конца области |
| Nil-coalescing | `name ?? "unknown"` | есть разумное значение по умолчанию |
| Optional chaining | `user?.address?.city` | цепочка обращений по свойствам и методам |
| `map` / `flatMap` | `name.map { $0.count }` | преобразовать значение внутри, не распаковывая |
| Implicitly unwrapped | `var x: String!` | значение гарантированно появится до первого использования |

```swift
if let n = name {
    print("Привет, \(n)")
}

func greet(_ name: String?) {
    guard let n = name else { return }   // дальше n — обычная String
    print("Привет, \(n)")
}

let count = name?.count ?? 0            // Int, а не Int?
```

**Сокращение `if let x` (Swift 5.7, SE-0345).** Если имя переменной совпадает, можно не повторять его:

```swift
let title: String? = "Заголовок"
if let title {            // то же, что if let title = title
    print(title)
}
guard let title else { return }
```

## Шаг 3. guard

> **`guard`** проверяет условие и, если оно ложно, **обязан выйти из текущей области** в ветке `else`. Переменные, объявленные в `guard let`, остаются доступными после него.

```swift
func process(_ data: [String: Any]) {
    guard let id = data["id"] as? Int,
          let name = data["name"] as? String else {
        print("некорректные данные")
        return
    }
    print(id, name)    // оба доступны здесь, без вложенности
}
```

`if let` удобнее, когда нужен блок `else` по существу или отсутствие значения не прерывает функцию. `guard` — когда значения нужны дальше, и ты хочешь избежать вложенных `if let`.

## Шаг 4. Optional chaining

> **Optional chaining** — цепочка обращений к свойствам, методам и индексам, где каждое звено может быть `nil`. Выполнение идёт **слева направо** и останавливается на первом `nil`; результат всей цепочки — Optional.

```swift
class Person { var residence: Residence? }
class Residence { var numberOfRooms = 1 }

let john = Person()
// let n = john.residence!.numberOfRooms   // краш в рантайме
if let rooms = john.residence?.numberOfRooms {
    print("комнат: \(rooms)")
} else {
    print("не удалось получить")           // выведется это
}
```

Отличие от вложенных опционалов: `Int??` — два уровня, их видно по числу знаков вопроса.

```swift
let single: Int? = 5
let double: Int?? = .some(nil)   // внешний есть, внутри nil
print(double == nil)             // false: внешний Optional не пуст
```

## Шаг 5. Nil-coalescing `??`

```swift
let text: String? = nil
let shown = text ?? "текст отсутствует"
```

Сигнатура (упрощённо): `func ?? <T>(optional: T?, defaultValue: @autoclosure () throws -> T) rethrows -> T`. Правое значение вычисляется **лениво**, только если слева `nil`. Справа тоже может быть Optional: тогда результат Optional (`T?`).

## Шаг 6. map и flatMap у Optional

> **`map`** применяет замыкание к значению внутри, если оно есть, и заворачивает результат обратно в Optional. **`flatMap`** нужен, когда замыкание **само возвращает Optional**: он убирает лишний уровень.

```swift
let s: String? = "42"

let viaMap: Int?? = s.map { Int($0) }        // Optional(Optional(42))
let viaFlatMap: Int? = s.flatMap { Int($0) } // Optional(42)

let squared = Int("7").map { $0 * $0 }       // Optional(49)
```

```swift
let name: String? = "twostraws"
print(name.map { "@\($0)" } as Any)   // Optional("@twostraws")
```

<details>
<summary>Почему так?</summary>

`Int($0)` возвращает `Int?`. `map` упакует его ещё раз: получится `Int??`. `flatMap` «расплющит» один уровень. То же правило у `Sequence.flatMap` (расплющивает вложенные последовательности), а для удаления `nil` из последовательности есть `compactMap` (тутор 06).

</details>

## Шаг 7. Implicitly unwrapped optional

```swift
let label: String! = "текст"
let copy: String = label     // распаковывается автоматически
let maybe = label            // тип String? — остаётся Optional
```

Тип `T!` — это обычный Optional с признаком «распаковывать автоматически, когда нужен не-Optional». Если там окажется `nil` при таком использовании, будет краш. Оправданный пример — `@IBOutlet` в UIKit: контекст гарантирует, что значение появится до первого использования. В остальном лучше обычный Optional или `lazy`.

## Шаг 8. Свой Optional (задача с собеседования)

Проверяет, понимаешь ли ты, что Optional — просто enum и как работают его операции. Минимум — два случая, нормальный ответ — с `map`, `flatMap`, `??` и принудительной распаковкой.

```swift
enum Maybe<Wrapped> {
    case none
    case some(Wrapped)

    func map<U>(_ transform: (Wrapped) throws -> U) rethrows -> Maybe<U> {
        switch self {
        case .some(let v): return .some(try transform(v))
        case .none:        return .none
        }
    }

    func flatMap<U>(_ transform: (Wrapped) throws -> Maybe<U>) rethrows -> Maybe<U> {
        switch self {
        case .some(let v): return try transform(v)   // без лишней обёртки
        case .none:        return .none
        }
    }

    // аналог ??
    func or(_ defaultValue: @autoclosure () throws -> Wrapped) rethrows -> Wrapped {
        switch self {
        case .some(let v): return v
        case .none:        return try defaultValue()
        }
    }

    // аналог !
    func unwrapOrCrash() -> Wrapped {
        switch self {
        case .some(let v): return v
        case .none:        fatalError("Unexpectedly found nil")
        }
    }
}

// сравнение: достаточно условного соответствия
extension Maybe: Equatable where Wrapped: Equatable {}

let value = Maybe.some(2)
print(value.map { $0 * $0 }.or(0))      // 4
print(Maybe<Int>.none.or(10))           // 10
print(Maybe.some(1) == Maybe.some(1))   // true
print(Maybe<Int>.none == Maybe<Int>.none)   // true
```

**`ExpressibleByNilLiteral`** — протокол с единственным требованием `init(nilLiteral: ())`. Благодаря нему `Optional` создаётся из литерала `nil`. Реализовывать его для своих типов не рекомендуется: он нужен именно для Optional.

**Как сравниваются Optional.** `Optional<Wrapped>` соответствует `Equatable` и `Hashable`, когда им соответствует `Wrapped`. Поэтому `Int? == Int?` работает, а `nil == nil` — `true`.

## Типичные ошибки

- Принудительная распаковка `!` «на всякий случай» — главный источник крашей.
- `try!`, `as!`, `!` вместо `guard let` / `??`.
- Путать `T??` и `T?` из-за `map` вместо `flatMap`.
- Использовать `T!` для обычных свойств вместо Optional или значения по умолчанию.
- Считать, что цепочка `a?.b?.c` читается справа налево.
- Писать `if x != nil { x! }` вместо `if let`.
- Забыть, что `guard` обязан выходить из области.

<details>
<summary>Каверзный вопрос: что выведет код?</summary>

```swift
let x: Int?? = nil
let y: Int?? = .some(nil)
print(x == nil, y == nil)
```

Ответ: `true false`. У `x` пуст внешний Optional, у `y` внешний содержит внутренний `nil`.

</details>

## Шпаргалка

```swift
let x: Int? = 5
x!                    // краш при nil
if let v = x { }      // optional binding;  if let x { } — сокращение
guard let v = x else { return }
x ?? 0                // значение по умолчанию
user?.address?.city   // chaining, слева направо
x.map { $0 + 1 }      // Int?
x.flatMap { Int("\($0)") }   // убирает лишний уровень
var z: Int! = 1       // implicitly unwrapped (IBOutlet)
```

## Вопросы для самопроверки

<details>
<summary>1. Как устроен Optional под капотом?</summary>

Обычный generic-enum `Optional<Wrapped>` с случаями `.none` и `.some(Wrapped)`. Литерал `nil` создаётся через `ExpressibleByNilLiteral`.

</details>

<details>
<summary>2. Какие способы распаковки ты знаешь?</summary>

`!`, `if let`, `guard let`, `??`, optional chaining, `map`/`flatMap`, implicitly unwrapped optional.

</details>

<details>
<summary>3. Когда уместен force unwrap?</summary>

Когда `nil` — программная ошибка, которую надо обнаружить как можно раньше (например, константа из bundle). Во всех остальных случаях — безопасные способы.

</details>

<details>
<summary>4. Чем map отличается от flatMap у Optional?</summary>

`map` оборачивает результат замыкания в Optional ещё раз, `flatMap` убирает один уровень, если замыкание возвращает Optional.

</details>

<details>
<summary>5. Что такое optional chaining?</summary>

Цепочка обращений слева направо, которая прерывается на первом `nil`. Результат — Optional.

</details>

<details>
<summary>6. Чем guard отличается от if let?</summary>

`guard` требует выхода из области в `else`, а распакованное значение доступно до конца области. `if let` ограничивает область внутри блока.

</details>

<details>
<summary>7. Как реализовать свой Optional и сравнение?</summary>

Enum с `.none` / `.some`, методы `map`, `flatMap`, аналоги `??` и `!`; сравнение — через условное соответствие `Equatable`, пустые значения равны.

</details>

## Источники

- [Optional Chaining — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/optionalchaining/)
- [The Basics (Optionals) — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/)
- [Optional — Apple Developer Documentation](https://developer.apple.com/documentation/swift/optional)
- [SE-0345: if let shorthand](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0345-if-let-shorthand.md)
