---
title: "Замыкания и функции высшего порядка"
order: 6
---

> **Что узнаешь**
>
> - Что такое замыкание и чем оно отличается от функции
> - Сокращённый синтаксис: `$0`, trailing closure, оператор как замыкание
> - Захват значений и capture list: `[weak self]`, `[unowned self]`
> - `@escaping` и non-escaping: что это значит для компилятора
> - `@autoclosure`
> - `map`, `filter`, `reduce`, `compactMap`, `flatMap`, `sorted` и другие
> - Как написать свой `map`

> **Нужно знать заранее:** [тутор 01](../structs-classes-enums/) (ссылочные типы, `deinit`), [тутор 04](../optional/) (Optional).

## Аналогия: записка «что сделать» с собой

Ты оставляешь коллеге записку: «когда придёт клиент, покажи ему отчёт № 5 и скажи про скидку».

- **Замыкание** — сама записка: в ней есть инструкция и **указатели на вещи** (отчёт № 5, скидка), которые она «захватила».
- **Non-escaping** — коллега читает записку прямо сейчас и выбрасывает.
- **Escaping** — коллега кладёт записку в карман и читает позже; записка должна жить дольше, чем разговор.
- **Retain cycle** — записка лежит в столе, а стол держит записку в ящике, который нужен для этого стола: никто не выбросит ни стол, ни записку.

## Шаг 1. Что такое замыкание

> **Замыкание (closure)** — автономный блок кода, который можно передавать и вызывать, и который может **захватывать** и хранить ссылки на константы и переменные из окружающего контекста.

Все формы замыканий — ссылочные типы: если присвоить замыкание двум переменным, они будут ссылаться на одно и то же замыкание.

Три формы:

1. **Глобальные функции** — имеют имя, ничего не захватывают.
2. **Вложенные функции** — имеют имя, могут захватывать значения внешней функции.
3. **Выражения замыкания** — безымянные, могут захватывать.

```swift
func makeIncrementer(incrementAmount: Int) -> () -> Int {
    var total = 0
    func incrementer() -> Int {      // вложенная функция захватывает total и incrementAmount
        total += incrementAmount
        return total
    }
    return incrementer
}

let byTwo = makeIncrementer(incrementAmount: 2)
print(byTwo())   // 2
print(byTwo())   // 4 — total живёт даже после выхода из makeIncrementer
```

## Шаг 2. Синтаксис и сокращения

Один и тот же вызов `sorted(by:)` в пяти формах:

```swift
var presidents = ["Washington", "Truman", "Kennedy", "Reagan"]

let a = presidents.sorted(by: { (p1: String, p2: String) -> Bool in return p1 < p2 })
let b = presidents.sorted(by: { p1, p2 in return p1 < p2 })   // типы выводятся
let c = presidents.sorted(by: { p1, p2 in p1 < p2 })          // одно выражение — return можно опустить
let d = presidents.sorted { $0 < $1 }                         // $0, $1 + trailing closure
let e = presidents.sorted(by: <)                              // оператор как функция
```

- **Trailing closure** — замыкание, написанное за скобками вызова, если оно последний аргумент.
- `$0`, `$1` — анонимные имена параметров; `in` тогда не нужен.
- Параметры замыкания — константы. Для мутации создай локальную `var`: `var number = number`.

```swift
let shifted = [1, 2, 3].map { (number) -> Int in
    var number = number    // параметр неизменяем, делаем копию
    number += 10
    return number
}
print(shifted)   // [11, 12, 13]
```

## Шаг 3. Захват значений и capture list

Замыкание захватывает переменные **по ссылке**: оно видит их последние значения и может их менять, даже если область объявления уже закончилась. **Capture list** в квадратных скобках раньше `in` меняет это: захватывает **копию значения** в момент создания замыкания.

```swift
var counter = 1

let byReference = { print(counter) }           // захват по ссылке
let byValue = { [captured = counter] in print(captured) }   // копия в момент создания

counter += 1
byReference()   // 2
byValue()       // 1
```

## Шаг 4. @escaping и non-escaping

> **Non-escaping** (по умолчанию) — замыкание можно вызвать только до возврата из функции; сохранить его нельзя. **`@escaping`** — замыкание может «убежать» из функции: быть сохраненным и вызванным позже.

```swift
func runNow(_ work: () -> Void) {            // non-escaping
    work()
}

var stored: [() -> Void] = []
func runLater(_ work: @escaping () -> Void) {   // escaping: сохраняем
    stored.append(work)
}
```

Что это даёт компилятору:

- non-escaping замыкание не нужно удерживать на куче и считать ссылки — оно не переживёт вызов функции (оптимизация);
- в non-escaping замыкании можно обращаться к `self` без слова `self.`;
- в `@escaping`-замыкании для класса `self` нужно писать явно (или включать в capture list), чтобы ты осознавал захват;
- `@escaping`-замыкание **не может захватить `inout`-параметр или `mutating self`** структуры.

```swift
func doNow(_ closure: () -> Void) { closure() }
func doLater(_ closure: @escaping () -> Void) { closure() }

struct Box {
    var first = 0
    var second = ""
    mutating func update() {
        doNow { first = 10 }              // ок
        // doLater { self.second = "Hi" } // ошибка: escaping closure captures mutating 'self' parameter
    }
}

class Holder {
    var first = 0
    var second = ""
    func update() {
        doNow { first = 11 }
        doLater { self.second = "Hello" }   // для класса работает, self явно
    }
}
```

## Шаг 5. Циклы удержания и [weak self]

Класс хранит `@escaping`-замыкание, а замыкание захватывает сильную ссылку на этот класс — цикл `self → замыкание → self`. `deinit` не вызовется.

```swift
final class ViewModel {
    var title = "A"
    var onUpdate: (() -> Void)?

    func bindLeaky() {
        onUpdate = { print(self.title) }          // цикл → утечка
    }

    func bindSafe() {
        onUpdate = { [weak self] in
            guard let self else { return }       // self может быть nil
            print(self.title)
        }
    }
    deinit { print("deinit") }
}

var vm: ViewModel? = ViewModel()
vm?.bindSafe()
vm = nil                  // deinit сработает
```

| Захват | Что делает | Когда |
| --- | --- | --- |
| сильный (по умолчанию) | удерживает объект | время жизни замыкания короче объекта или не хранится в этом объекте |
| `[weak self]` | слабая ссылка, становится `nil` после освобождения | объект может исчезнуть раньше замыкания |
| `[unowned self]` | без подсчёта ссылок, не Optional; при обращении к освобождённому — краш | объект гарантированно живёт не меньше замыкания |

С Swift 5.3 (SE-0269) в `@escaping`-замыкании можно не писать `self.`, если `self` указан в capture list (`[self]`) или если `self` — значимый тип. С Swift 5.8 (SE-0365) это работает и после `[weak self]` + `guard let self`.

> Замыкания GCD (`DispatchQueue.async`) цикла удержания не создают: очередь держит замыкание только до выполнения, а объект очередь-замыкание не хранит. `[weak self]` там нужен, только если не хочешь продлевать жизнь объекта (тутор «GCD» темы «Многопоточность»).

## Шаг 6. @autoclosure

> **`@autoclosure`** автоматически оборачивает переданное выражение в замыкание без параметров. Выражение вычисляется **лениво**, только когда замыкание вызвали.

```swift
func logIfDebug(_ isDebug: Bool, _ message: @autoclosure () -> String) {
    if isDebug { print(message()) }
}

func expensiveDescription() -> String {
    print("вычисляем")
    return "отладка"
}

logIfDebug(false, expensiveDescription())   // ничего не выведет: выражение не вычислялось
logIfDebug(true, expensiveDescription())    // вычисляем → отладка
```

Так устроены `&&`, `||`, `??`, `assert`. Вещь комбинируется с `@escaping`: `@autoclosure @escaping () -> T`.

## Шаг 7. Функции высшего порядка

> **Функция высшего порядка** — функция, которая принимает другие функции (замыкания) или возвращает их.

```swift
let nums = [1, 2, 3, 4, 5, 6]

let doubled = nums.map { $0 * 2 }                  // [2, 4, 6, 8, 10, 12]
let evens = nums.filter { $0 % 2 == 0 }            // [2, 4, 6]
let sum = nums.reduce(0, +)                         // 21
let product = nums.reduce(1) { $0 * $1 }            // 720

let strings = ["1", "x", "3"]
let ints = strings.compactMap { Int($0) }           // [1, 3] — nil отбрасываются

let names = ["Tim", "Ann"]
let letters = names.flatMap { $0 }                  // ["T", "i", "m", "A", "n", "n"] — расплющивает на один уровень

let allEven = nums.allSatisfy { $0 % 2 == 0 }       // false
let hasBig = nums.contains { $0 > 5 }               // true
let firstBig = nums.first { $0 > 3 }                // Optional(4)
```

| Метод | Что делает |
| --- | --- |
| `map` | преобразует каждый элемент, возвращает массив той же длины |
| `compactMap` | преобразует и отбрасывает `nil` |
| `flatMap` | преобразует в последовательность и расплющивает на один уровень |
| `filter` | оставляет элементы, подходящие под условие |
| `reduce` | сворачивает последовательность в одно значение |
| `sorted(by:)` | возвращает новый отсортированный массив (`sort(by:)` сортирует на месте) |
| `forEach` | выполняет действие для каждого; `break`/`continue` внутри не работают |

```swift
var a = ["🔥", "💧", "☀️", "❄️", "🔥"]

a.swapAt(0, 3)
print(a)                       // ["❄️", "💧", "☀️", "🔥", "🔥"]

let slice = a.dropFirst(2)     // ArraySlice: ["☀️", "🔥", "🔥"]
let last2 = a.suffix(2)        // ["🔥", "🔥"]
let first = a.removeFirst()    // "❄️", массив теперь ["💧", "☀️", "🔥", "🔥"]
```

**Напиши свой `map`** — частая задача на собеседовании:

```swift
extension Sequence {
    func myMap<T>(_ transform: (Element) throws -> T) rethrows -> [T] {
        var result: [T] = []
        for item in self {
            result.append(try transform(item))
        }
        return result
    }
}

print([1, 2, 3].myMap { $0 * $0 })   // [1, 4, 9]
```

**`@Sendable`.** Замыкание, которое передаётся между потоками/акторами (`Task`, `DispatchQueue`), помечается `@Sendable`: компилятор запрещает захватывать изменяемые общие данные без защиты (тутор «Swift Concurrency» темы «Многопоточность»).

## Типичные ошибки

- Сильный захват `self` в `@escaping`-замыкании, которое хранится в самом `self` → цикл удержания.
- `[unowned self]`, когда объект может пережить вызов → краш.
- Пытаться захватить `mutating self` в `@escaping` замыкании.
- Ожидать копию значения без capture list: будет захват по ссылке.
- Надеяться, что `forEach` поддерживает `break`/`continue`/`return` из внешней функции.
- Путать `map` и `flatMap`/`compactMap` для массива опционалов.

<details>
<summary>Каверзный вопрос: что выведет код?</summary>

```swift
var x = 10
let f = { [x] in print(x) }
x = 20
f()
```

Ответ: `10`. Capture list `[x]` захватил копию значения в момент создания замыкания. Без `[x]` было бы `20`.

</details>

## Шпаргалка

```swift
{ (a: Int, b: Int) -> Int in a + b }     // полная форма
{ $0 + $1 }                              // сокращённая
items.sorted(by: <)                      // оператор как замыкание

{ [weak self] in guard let self else { return }; ... }
{ [captured = value] in ... }            // копия в момент создания

func f(_ c: () -> Void) { }              // non-escaping (по умолчанию)
func g(_ c: @escaping () -> Void) { }    // хранится/вызывается позже
func h(_ v: @autoclosure () -> Int) { }  // ленивое выражение

map / compactMap / flatMap / filter / reduce / sorted / allSatisfy / contains(where:)
```

## Вопросы для самопроверки

<details>
<summary>1. Что такое замыкание и почему это ссылочный тип?</summary>

Блок кода с захваченными значениями. Его контекст живёт на куче и делится между копиями ссылки, поэтому присваивание замыкания — копия ссылки.

</details>

<details>
<summary>2. Чем escaping отличается от non-escaping?</summary>

Non-escaping вызывается только до возврата из функции и не сохраняется; escaping может быть сохранён и вызван позже, поэтому требует явного `self` и продуманного захвата.

</details>

<details>
<summary>3. Как возникает retain cycle в замыканиях и как его избежать?</summary>

Объект держит замыкание, замыкание держит объект. Разорвать через `[weak self]` (или `[unowned self]`, если время жизни гарантировано).

</details>

<details>
<summary>4. Что такое @autoclosure?</summary>

Атрибут параметра, который оборачивает переданное выражение в замыкание; вычисляется лениво (`&&`, `??`, `assert`).

</details>

<details>
<summary>5. Чем map, flatMap и compactMap отличаются?</summary>

`map` — преобразование 1→1; `compactMap` — преобразование и отброс `nil`; `flatMap` — преобразование в последовательность и расплющивание.

</details>

<details>
<summary>6. Что такое функция высшего порядка?</summary>

Функция, которая принимает функцию или возвращает функцию.

</details>

## Источники

- [Closures — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/)
- [Automatic Reference Counting — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
- [SE-0269: Implicit self in escaping closures](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0269-implicit-self-weak-capture.md)
- [SE-0365: Allow implicit self for weak self captures after self is unwrapped](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0365-implicit-self-weak-capture.md)
- [Sequence — Apple Developer Documentation](https://developer.apple.com/documentation/swift/sequence)
