---
title: "Строки и Unicode"
order: 11
---

> **Что узнаешь**
>
> - Как устроен `String`: Unicode, `Character`, grapheme clusters
> - Почему нельзя доступиться к символу по `Int`-индексу и что такое `String.Index`
> - `startIndex`, `endIndex`, `index(after:)`, `index(_:offsetBy:)`
> - `Substring` и префиксы/суффиксы
> - Вьюхи `unicodeScalars`, `utf8`, `utf16`
> - Типовые задачи с собеседований на строки

> **Нужно знать заранее:** [тутор 10](../collections-hashable-complexity/) (Collection, Sequence, сложность), [тутор 01](../structs-classes-enums/) (struct, COW).

## Аналогия: предложение из букв и акцентных наклеек

Ты складываешь слово из карточек. На одной буква «е», на другой — наклейка «ударение», которую клеят над буквой. Для человека это **один** символ «é», но в колоде — две карточки.

- **Карточка** — Unicode scalar (код-поинт).
- **Видимый символ** — `Character` (графемный кластер): буква вместе со своими наклейками.
- **Байты** — то, что лежит в памяти (UTF-8).

## Шаг 1. String — это структура

> **`String`** — `@frozen`-структура, значимый тип с copy-on-write. Корректна по Unicode и не зависит от локали, поэтому подходит как ключ словаря. Внутри — буфер UTF-8 (с Swift 5).

Строка — это `Collection` символов (`Character`):

```swift
let message = "Привет, мир!"
let name = "Lev"
let age = 30
let greeting = "Hello, my name is \(name) and I am \(age) years old."
print(greeting)   // Hello, my name is Lev and I am 30 years old.
```

**Small string optimization.** Короткие строки (до 15 байт UTF-8 на 64-битных платформах) хранятся прямо внутри структуры без выделения на куче. Длинные — в отдельном буфере на куче с COW.

## Шаг 2. Character, scalars и байты

> **`Character`** — один «видимый символ», технически — **extended grapheme cluster**: один или несколько Unicode scalar’ов, которые человек воспринимает как один символ.

```swift
let cafe = "cafe\u{301}"             // «café»: e + комбинирующий акцент U+0301
print(cafe.count)                    // 4  — Character
print(cafe.unicodeScalars.count)     // 5  — Unicode scalars
print(cafe.utf8.count)               // 6  — байты UTF-8

let flag = "🇷🇺"
print(flag.count)                    // 1  — два regional indicator скаляра образуют один Character
print(flag.unicodeScalars.count)     // 2
```

Вьюхи строки: `unicodeScalars`, `utf8`, `utf16`. Выбираешь уровень абстракции под задачу: для пользовательского текста — `Character`, для протоколов/байтов — `utf8`.

**Разница с `NSString`.** `NSString.length` считает единицы UTF-16, поэтому для одного флага `🇷🇺` оно равно 4, а `String.count` — 1. При работе с API типа `NSRange` учитывай эту разницу.

## Шаг 3. Почему нельзя `string[3]`

Нельзя достать символ по целому индексу: `String` не является `RandomAccessCollection`. Символы имеют **переменную длину** в байтах (от 1 до многих), и найти n-й `Character` можно, только пройдя строку с начала. Поэтому вместо `Int` используется `String.Index`, а `count` стоит **O(n)**.

> **`String.Index`** — позиция символа в строке. Его нужно получать у самой строки.

```swift
let message = "Hello World!"

print(message[message.startIndex])                        // H
// print(message[message.endIndex])                       // краш: endIndex — позиция ПОСЛЕ последнего символа
print(message[message.index(before: message.endIndex)])   // !  — последний символ
print(message[message.index(after: message.startIndex)])  // e

let fifth = message.index(message.startIndex, offsetBy: 4)
print(message[fifth])                                     // o
let thirdFromEnd = message.index(message.endIndex, offsetBy: -3)
print(message[thirdFromEnd])                              // l

// безопасный вариант — с ограничением
let far = message.index(message.startIndex, offsetBy: 100, limitedBy: message.endIndex)   // nil
```

> `endIndex` — это позиция «за концом», обращение `string[string.endIndex]` всегда краш. Точно так же краш на `index(before: startIndex)`.

## Шаг 4. Substring

При срезе строки получается **`Substring`** — «окно» в буфер исходной строки, без копирования.

```swift
let s = "Hello, World"
let comma = s.firstIndex(of: ",")!
let hello = s[..<comma]             // Substring "Hello"
let world = s.suffix(5)             // Substring "World"
let owned = String(hello)           // новая строка, не зависит от исходной
```

- `Substring` полезен для кратковременной работы; для долгого хранения преврати в `String`: иначе вся исходная строка останется жить в памяти.
- `hasPrefix`, `hasSuffix`, `contains`, `split`, `components(separatedBy:)` (Foundation) — базовые операции.
- `isEmpty` дешевле `count == 0`: `count` идёт по всей строке.

**Многострочные и raw-строки:**

```swift
let poem = """
    Строка 1
    Строка 2
    """                                // отступ закрывающих кавычек обрезается
let regex = #"\d+\.\d+"#            // raw: обратные слэши не экранируются
```

## Шаг 5. Типовые задачи

**Задача: подпоследовательность** (LeetCode 392). Проверить, что `s` входит в `t` как подпоследовательность (с удалением некоторых символов без перестановки). Два указателя, O(n), без копирования в массив:

```swift
func isSubsequence(_ s: String, _ t: String) -> Bool {
    var (left, right) = (s.startIndex, t.startIndex)

    while left != s.endIndex, right != t.endIndex {
        if s[left] == t[right] {
            left = s.index(after: left)
        }
        right = t.index(after: right)
    }
    return left == s.endIndex
}

print(isSubsequence("ace", "abcde"))   // true
print(isSubsequence("aec", "abcde"))   // false
```

**Палиндром:**

```swift
func isPalindrome(_ s: String) -> Bool {
    let chars = s.lowercased().filter { $0.isLetter || $0.isNumber }
    return chars == String(chars.reversed())
}
print(isPalindrome("A man, a plan, a canal: Panama"))   // true
```

**Анаграммы** — через словарь счётчиков, O(n):

```swift
func isAnagram(_ a: String, _ b: String) -> Bool {
    var counts: [Character: Int] = [:]
    for ch in a { counts[ch, default: 0] += 1 }
    for ch in b { counts[ch, default: 0] -= 1 }
    return counts.values.allSatisfy { $0 == 0 }
}
print(isAnagram("listen", "silent"))   // true
```

**Первый неповторяющийся символ:**

```swift
func firstUnique(_ s: String) -> Character? {
    var counts: [Character: Int] = [:]
    for ch in s { counts[ch, default: 0] += 1 }
    return s.first { counts[$0] == 1 }
}
print(firstUnique("swiftsw") as Any)   // Optional("i")
```

> **`Array(string)` — удобно, но дорого.** Превращение в `[Character]` даёт доступ по `Int` за O(1), но стоит O(n) времени и памяти и копирует строку. Для одного-двух обращений лучше `String.Index`; для алгоритмов с множеством прыжков по индексам превращение оправдано. На собеседовании проговаривай этот компромисс.

## Типичные ошибки

- `string[string.endIndex]` или `index(before: startIndex)` → краш.
- `s.count == 0` вместо `s.isEmpty` → лишний проход по строке.
- Привязывать `Int`-индекс к символу и думать, что он «переживёт» мутацию строки: индексы могут стать невалидными.
- Долго держать `Substring` из большой строки.
- Считать `count` числом байтов или UTF-16-единиц — это число `Character`.
- Работать с `NSRange` и `String` без учёта разницы UTF-16 и grapheme clusters.
- Разворачивать строку по байтам и ломать составные эмодзи.

<details>
<summary>Каверзный вопрос: почему "👨‍👩‍👧".count == 1, а utf8.count больше?</summary>

Семейный эмодзи — последовательность из трёх эмодзи людей, склеенных символом нулевой ширины (ZWJ). Это один grapheme cluster (один `Character`), но в UTF-8 занимает около 18 байт.

</details>

## Шпаргалка

```swift
s.startIndex / s.endIndex            // endIndex — после последнего, не разыменовывать
s.index(after: i)  s.index(before: i)
s.index(i, offsetBy: n)               // n может быть отрицательным
s.index(i, offsetBy: n, limitedBy: s.endIndex)   // безопасно, вернёт nil
s[..<i]  s.prefix(3)  s.suffix(3)    // Substring
String(sub)                           // в строку для долгого хранения
s.count  — O(n),  s.isEmpty — O(1)
s.unicodeScalars / s.utf8 / s.utf16
```

## Вопросы для самопроверки

<details>
<summary>1. Почему у String нет доступа по Int-индексу?</summary>

Символы имеют переменную длину в байтах, поэтому `String` не является `RandomAccessCollection`: n-й символ находят проходом с начала. Используется `String.Index`.

</details>

<details>
<summary>2. Что такое Character и чем он отличается от Unicode scalar?</summary>

`Character` — extended grapheme cluster, один или несколько scalar’ов, воспринимаемых как один видимый символ.

</details>

<details>
<summary>3. Что такое endIndex и почему по нему нельзя обратиться к элементу?</summary>

Это позиция сразу после последнего символа; там нет элемента, обращение вызывает краш. Последний символ — через `index(before: endIndex)`.

</details>

<details>
<summary>4. Чем Substring отличается от String и когда нужно превращать?</summary>

Substring делит буфер исходной строки и создаётся дёшево. Для долгого хранения нужно `String(substring)`, иначе держится вся исходная строка.

</details>

<details>
<summary>5. Какая сложность у count и isEmpty?</summary>

`count` — O(n), `isEmpty` — O(1).

</details>

<details>
<summary>6. В чём разница между String.count и NSString.length?</summary>

`count` считает `Character`, `length` — единицы UTF-16. Для эмодзи и флагов числа разные.

</details>

<details>
<summary>7. Как проверить, что две строки — анаграммы?</summary>

Посчитать символы в `[Character: Int]` для первой строки и вычесть для второй; все значения должны быть нулём. O(n) вместо O(n log n) у сортировки.

</details>

## Источники

- [Strings and Characters — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters/)
- [String — Apple Developer Documentation](https://developer.apple.com/documentation/swift/string)
- [Character — Apple Developer Documentation](https://developer.apple.com/documentation/swift/character)
- [Substring — Apple Developer Documentation](https://developer.apple.com/documentation/swift/substring)
- [Swift 5 String: UTF-8 — swift.org](https://www.swift.org/blog/utf8-string/)
