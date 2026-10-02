---
title: "Ошибки, defer и поток управления"
order: 5
---

> **Что узнаешь**
>
> - Как устроена обработка ошибок: `Error`, `throw`, `throws`, `do-catch`
> - Чем `try`, `try?` и `try!` отличаются друг от друга
> - Что такое `rethrows`, `Result` и typed throws (Swift 6)
> - Как работает `defer` и в каком порядке он выполняется
> - Операторы передачи управления: `break`, `continue`, `fallthrough`, `return`, `throw`

> **Нужно знать заранее:** тутор 01 (enum), тутор 04 (Optional, `guard`).

## Аналогия: почта с «не доставлено»

- **`throw`** — курьер вернул посылку с причиной отказа.
- **`do-catch`** — ты на выдаче: если пришло уведомление «не доставлено», разбираешь причину и решаешь, что делать.
- **`try?`** — «если не пришло, считаем, что посылки нет».
- **`try!`** — «уверен на 100%, что придёт». Если не пришло — программа упадёт.
- **`defer`** — записка «убрать со стола перед уходом»: выполнится как бы ты ни ушёл.

## Шаг 1. Error и throw

> **`Error`** — пустой протокол-маркер. Любой тип, который ему соответствует, можно бросить как ошибку. Обычно это `enum`.

```swift
import Foundation

enum NetworkError: Error {
    case badURL
    case requestFailed(statusCode: Int)
    case unknown
}

func fetchData(from urlString: String) throws -> String {
    guard URL(string: urlString) != nil else {
        throw NetworkError.badURL
    }
    let statusCode = 503                    // имитация ответа сервера
    guard statusCode == 200 else {
        throw NetworkError.requestFailed(statusCode: statusCode)
    }
    return "data"
}
```

- `throws` в сигнатуре говорит, что функция может бросить ошибку; `throw` — бросает.
- Вызов такой функции обязан быть помечен `try`: компилятор заставляет показать все точки, где возможен выход по ошибке.
- Бросить можно любой тип, конформящий `Error`; тип ошибки в обычном `throws` стирается до `any Error`.

## Шаг 2. do-catch

```swift
do {
    let text = try fetchData(from: "https://example.com")
    print(text)
} catch NetworkError.badURL {
    print("Неверный URL")
} catch NetworkError.requestFailed(let code) where code >= 500 {
    print("Ошибка сервера: \(code)")    // выведется это
} catch {
    print("Другая ошибка: \(error)")   // неявная переменная error
}
```

- Ветки `catch` проверяются по порядку; в каждой можно использовать паттерны: `catch NetworkError.badURL`, `catch let e as NetworkError`, `catch is NetworkError`, условие `where`.
- Если вызывающая функция сама `throws`, необработанная ошибка просто пробрасывается выше без `do-catch`.
- Для понятных текстов для пользователя ошибку обычно дополняют `LocalizedError`:

```swift
extension NetworkError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .badURL: return "Неверный адрес"
        case .requestFailed(let code): return "Сервер ответил кодом \(code)"
        case .unknown: return "Неизвестная ошибка"
        }
    }
}
```

## Шаг 3. try, try? и try!

```swift
let a = try? fetchData(from: "https://example.com")   // String? — ошибка превратилась в nil
if a == nil { print("не удалось") }

// let b = try! fetchData(from: "https://example.com")  // краш в рантайме при ошибке
```

| Вариант | Результат | При ошибке |
| --- | --- | --- |
| `try` • `do-catch` | `T` | переход в `catch` |
| `try?` | `T?` | `nil`, причина теряется |
| `try!` | `T` | краш приложения |

С Swift 5 (SE-0230) `try?` **не делает двойной Optional**: если функция возвращает `Int?` и `throws`, то `try? f()` имеет тип `Int?`, а не `Int??`.

> `try!` — только если ошибка невозможна по конструкции (например, загрузка ресурса из самого bundle, если его отсутствие — баг сборки). Для проверок правильнее `guard let ... try?` или нормальный `do-catch`.

## Шаг 4. rethrows

> **`rethrows`** — функция бросает ошибку только если бросает переданное ей замыкание. Для небросающего замыкания это обычный вызов без `try`.

```swift
func performTwice(_ operation: () throws -> Void) rethrows {
    try operation()
    try operation()
}

performTwice { print("hi") }                 // try не нужен, замыкание не бросает

do {
    try performTwice { throw NetworkError.unknown }   // здесь try обязателен
} catch {
    print("поймали: \(error)")
}
```

Так устроены `map`, `filter`, `sorted(by:)` и другие: если замыкание не бросает, `try` не нужен.

## Шаг 5. defer

> **`defer`** выполняет блок кода **при выходе из текущей области** — независимо от того, как именно выходим: `return`, `throw`, `break` или просто конец блока. Несколько `defer` в одной области выполняются в **обратном порядке** (LIFO).

```swift
func funWithDefers(_ flag: Bool) {
    defer { print("defer 1") }
    if flag {
        defer { print("defer 2") }
        defer { print("defer 3") }
        print("внутри if")
    }
    print("после if")
}

funWithDefers(true)
// внутри if
// defer 3
// defer 2
// после if
// defer 1
```

**Для чего нужен defer:** парные операции — открыть/закрыть файл, `lock`/`unlock`, `enter`/`leave`, начать/закончить транзакцию. Очистка не забудется при раннем `return` или ошибке.

```swift
func processFile(at path: String) throws {
    let handle = openFile(path)       // условный API
    defer { closeFile(handle) }       // выполнится в любом случае

    guard isValid(handle) else { throw NetworkError.unknown }
    try read(handle)
}
```

Правила: `defer` нельзя прервать `return`, `break` или `throw` изнутри; он выполняется после вычисления возвращаемого значения, но до того как управление вернётся вызывающему.

## Шаг 6. Операторы передачи управления

| Оператор | Что делает |
| --- | --- |
| `break` | немедленно завершает цикл или `switch` |
| `continue` | прекращает текущую итерацию и начинает следующую |
| `return` | возвращает значение и завершает функцию |
| `throw` | бросает ошибку и завершает текущую функцию |
| `fallthrough` | в `switch` переходит в тело следующего `case`, не проверяя его условие |

```swift
let n = 3
switch n {
case 3:
    print("three")
    fallthrough
case 4:
    print("four")       // выполнится, хотя n != 4
default:
    print("other")
}
// three
// four
```

**Метки циклов** позволяют управлять внешним циклом из внутреннего:

```swift
outer: for i in 1...3 {
    for j in 1...3 {
        if j == 2 { continue outer }
        if i == 3 { break outer }
        print(i, j)
    }
}
// 1 1
// 2 1
```

## Шаг 7. Result и typed throws

**`Result<Success, Failure>`** — enum с `.success` и `.failure`: ошибка как значение. Удобен для колбэков и хранения результата.

```swift
let result = Result { try fetchData(from: "https://example.com") }   // Result<String, any Error>
switch result {
case .success(let s): print(s)
case .failure(let e): print(e)
}
let value = try result.get()   // снова throws
```

**Typed throws (Swift 6.0, SE-0413).** Функция может указать конкретный тип ошибки. `throws(any Error)` эквивалентно обычному `throws`, а `throws(Never)` — небросающей функции.

```swift
enum ParseError: Error { case empty, notNumber(String) }

func parse(_ s: String) throws(ParseError) -> Int {
    guard !s.isEmpty else { throw .empty }          // контекст выводится из типа ошибки
    guard let n = Int(s) else { throw .notNumber(s) }
    return n
}

do {
    _ = try parse("abc")
} catch {
    print(error)   // error — конкретно ParseError: notNumber("abc")
}
```

> Для публичных API обычный `throws` остаётся лучшей опцией по умолчанию: жёстко зафиксированный тип ошибки мешает эволюции API. Typed throws осмысленны внутри модуля, в generic-коде, пробрасывающем ошибки замыканий, и в Embedded Swift.

## Типичные ошибки

- `try!` в месте, где ошибка возможна → краш приложения.
- `catch {}` без лога и обработки — ошибка пропадает без следа.
- `try?` там, где нужна причина ошибки: она теряется.
- Надеяться, что `defer` выполнится после кода внешней области, а не своей.
- Добавлять `defer` после того как ранний `return` уже может сработать — он не будет зарегистрирован.
- Ждать от `fallthrough` проверки условия следующего `case`.
- Бросать `fatalError` вместо обработываемой ошибки для нормального сценария.

<details>
<summary>Каверзный вопрос: когда выполнится defer по отношению к return?</summary>

Выражение в `return` сначала вычисляется, затем выполняются `defer`-блоки в обратном порядке, и только после этого управление возвращается вызывающему. Изменение возвращаемой переменной внутри `defer` не влияет на уже вычисленное значение.

</details>

## Шпаргалка

```swift
enum E: Error { case bad }
func f() throws -> Int { throw E.bad }

do { try f() } catch E.bad { } catch { /* error */ }
let a = try? f()          // Int?
let b = try! f()          // краш при ошибке

func g(_ c: () throws -> Void) rethrows { try c() }

defer { cleanup() }       // LIFO, при выходе из ближайшей области

func h() throws(E) { throw .bad }   // typed throws, Swift 6
Result { try f() }        // Result<Int, any Error>

switch x { case 1: fallthrough; case 2: break; default: break }
outer: for ... { for ... { continue outer } }
```

## Вопросы для самопроверки

<details>
<summary>1. Чем отличаются try, try? и try!?</summary>

`try` — вызов внутри `do-catch` или в `throws`-функции; `try?` превращает ошибку в `nil`; `try!` роняет приложение при ошибке.

</details>

<details>
<summary>2. Для чего нужен rethrows?</summary>

Для функций высшего порядка, которые бросают ошибку только при том, что бросает переданное замыкание; без бросающего замыкания `try` не нужен.

</details>

<details>
<summary>3. Какой порядок у нескольких defer?</summary>

Обратный (LIFO): последний объявленный выполняется первым; каждый — при выходе из своей ближайшей области.

</details>

<details>
<summary>4. Что делает fallthrough?</summary>

Переходит в тело следующего `case`, не проверяя его условие. По умолчанию `switch` в Swift не «проваливается» как в C.

</details>

<details>
<summary>5. Что такое typed throws и когда его использовать?</summary>

`throws(MyError)` — функция бросает только указанный тип. Внутри модуля, в generic-коде и для Embedded; для публичных API — обычный `throws`.

</details>

<details>
<summary>6. Чем Result отличается от throws?</summary>

Result — значение, которое можно хранить и передавать (колбэки), `throws` — встроенный механизм с `try`/`catch`. Между ними легко преобразоваться: `Result { try ... }` и `try result.get()`.

</details>

## Источники

- [Error Handling — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
- [Control Flow — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/)
- [SE-0413: Typed throws](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0413-typed-throws.md)
- [SE-0230: Flatten nested optionals resulting from try?](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0230-flatten-optional-try.md)
