---
title: "Strings and Unicode"
order: 11
---

> **What you'll learn**
>
> - How `String` is built: Unicode, `Character`, grapheme clusters
> - Why you can't access a character by an `Int` index and what `String.Index` is
> - `startIndex`, `endIndex`, `index(after:)`, `index(_:offsetBy:)`
> - `Substring` and prefixes/suffixes
> - The `unicodeScalars`, `utf8`, `utf16` views
> - Typical interview tasks on strings

> **Prerequisites:** [tutorial 10](../collections-hashable-complexity/) (Collection, Sequence, complexity), [tutorial 01](../structs-classes-enums/) (struct, COW).

## Analogy: a sentence made of letters and accent stickers

You build a word out of cards. One card has the letter "e", another has an "accent" sticker that is put on top of a letter. To a person this is **one** character, "é", but in the deck there are two cards.

- **A card** — a Unicode scalar (a code point).
- **A visible character** — `Character` (a grapheme cluster): a letter together with its stickers.
- **Bytes** — what lies in memory (UTF-8).

## Step 1. String is a struct

> **`String`** — a `@frozen` struct, a value type with copy-on-write. It is Unicode-correct and locale-independent, which is why it is suitable as a dictionary key. Inside is a UTF-8 buffer (since Swift 5).

A string is a `Collection` of characters (`Character`):

```swift
let message = "Hello, world!"
let name = "Lev"
let age = 30
let greeting = "Hello, my name is \(name) and I am \(age) years old."
print(greeting)   // Hello, my name is Lev and I am 30 years old.
```

**Small string optimization.** Short strings (up to 15 bytes of UTF-8 on 64-bit platforms) are stored right inside the struct without a heap allocation. Long ones live in a separate heap buffer with COW.

## Step 2. Character, scalars and bytes

> **`Character`** — one "visible character", technically an **extended grapheme cluster**: one or more Unicode scalars that a person perceives as a single character.

```swift
let cafe = "cafe\u{301}"             // "café": e + the combining accent U+0301
print(cafe.count)                    // 4  — Characters
print(cafe.unicodeScalars.count)     // 5  — Unicode scalars
print(cafe.utf8.count)               // 6  — UTF-8 bytes

let flag = "🇷🇺"
print(flag.count)                    // 1  — two regional indicator scalars form one Character
print(flag.unicodeScalars.count)     // 2
```

The string views: `unicodeScalars`, `utf8`, `utf16`. You pick the level of abstraction for the task: `Character` for user-facing text, `utf8` for protocols/bytes.

**The difference from `NSString`.** `NSString.length` counts UTF-16 units, so for a single flag `🇷🇺` it is 4, while `String.count` is 1. When working with APIs such as `NSRange`, take this difference into account.

## Step 3. Why you can't write `string[3]`

You can't fetch a character by an integer index: `String` is not a `RandomAccessCollection`. Characters have a **variable length** in bytes (from 1 to many), and the n-th `Character` can only be found by walking the string from the start. That is why `String.Index` is used instead of `Int`, and `count` costs **O(n)**.

> **`String.Index`** — the position of a character in a string. You have to obtain it from the string itself.

```swift
let message = "Hello World!"

print(message[message.startIndex])                        // H
// print(message[message.endIndex])                       // crash: endIndex is the position AFTER the last character
print(message[message.index(before: message.endIndex)])   // !  — the last character
print(message[message.index(after: message.startIndex)])  // e

let fifth = message.index(message.startIndex, offsetBy: 4)
print(message[fifth])                                     // o
let thirdFromEnd = message.index(message.endIndex, offsetBy: -3)
print(message[thirdFromEnd])                              // l

// the safe variant — with a limit
let far = message.index(message.startIndex, offsetBy: 100, limitedBy: message.endIndex)   // nil
```

> `endIndex` is the position "past the end", and accessing `string[string.endIndex]` is always a crash. Likewise, `index(before: startIndex)` crashes.

## Step 4. Substring

Slicing a string gives a **`Substring`** — a "window" into the original string's buffer, with no copying.

```swift
let s = "Hello, World"
let comma = s.firstIndex(of: ",")!
let hello = s[..<comma]             // Substring "Hello"
let world = s.suffix(5)             // Substring "World"
let owned = String(hello)           // a new string, independent of the original
```

- `Substring` is useful for short-term work; for long-term storage convert it to a `String`: otherwise the whole original string stays alive in memory.
- `hasPrefix`, `hasSuffix`, `contains`, `split`, `components(separatedBy:)` (Foundation) are the basic operations.
- `isEmpty` is cheaper than `count == 0`: `count` walks the whole string.

**Multiline and raw strings:**

```swift
let poem = """
    Line 1
    Line 2
    """                                // the indentation of the closing quotes is trimmed
let regex = #"\d+\.\d+"#            // raw: backslashes are not escaped
```

## Step 5. Typical tasks

**Task: a subsequence** (LeetCode 392). Check that `s` is contained in `t` as a subsequence (by deleting some characters without reordering). Two pointers, O(n), without copying into an array:

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

**A palindrome:**

```swift
func isPalindrome(_ s: String) -> Bool {
    let chars = s.lowercased().filter { $0.isLetter || $0.isNumber }
    return chars == String(chars.reversed())
}
print(isPalindrome("A man, a plan, a canal: Panama"))   // true
```

**Anagrams** — through a dictionary of counters, O(n):

```swift
func isAnagram(_ a: String, _ b: String) -> Bool {
    var counts: [Character: Int] = [:]
    for ch in a { counts[ch, default: 0] += 1 }
    for ch in b { counts[ch, default: 0] -= 1 }
    return counts.values.allSatisfy { $0 == 0 }
}
print(isAnagram("listen", "silent"))   // true
```

**The first non-repeating character:**

```swift
func firstUnique(_ s: String) -> Character? {
    var counts: [Character: Int] = [:]
    for ch in s { counts[ch, default: 0] += 1 }
    return s.first { counts[$0] == 1 }
}
print(firstUnique("swiftsw") as Any)   // Optional("i")
```

> **`Array(string)` is convenient but expensive.** Converting to `[Character]` gives O(1) access by `Int`, but costs O(n) time and memory and copies the string. For one or two accesses, `String.Index` is better; for algorithms with many jumps around indices the conversion is justified. In an interview, talk through this trade-off.

## Common mistakes

- `string[string.endIndex]` or `index(before: startIndex)` → a crash.
- `s.count == 0` instead of `s.isEmpty` → an extra pass over the string.
- Tying an `Int` index to a character and thinking it will "survive" a mutation of the string: indices can become invalid.
- Holding a `Substring` of a large string for a long time.
- Treating `count` as the number of bytes or UTF-16 units — it is the number of `Character`s.
- Working with `NSRange` and `String` without accounting for the difference between UTF-16 and grapheme clusters.
- Reversing a string by bytes and breaking composite emoji.

<details>
<summary>A tricky question: why is "👨‍👩‍👧".count == 1, while utf8.count is larger?</summary>

A family emoji is a sequence of three person emoji joined by the zero-width joiner (ZWJ). It is one grapheme cluster (one `Character`), but in UTF-8 it takes about 18 bytes.

</details>

## Cheat sheet

```swift
s.startIndex / s.endIndex            // endIndex is past the last one, don't dereference it
s.index(after: i)  s.index(before: i)
s.index(i, offsetBy: n)               // n can be negative
s.index(i, offsetBy: n, limitedBy: s.endIndex)   // safe, returns nil
s[..<i]  s.prefix(3)  s.suffix(3)    // Substring
String(sub)                           // to a String for long-term storage
s.count  — O(n),  s.isEmpty — O(1)
s.unicodeScalars / s.utf8 / s.utf16
```

## Self-check questions

<details>
<summary>1. Why doesn't String have access by an Int index?</summary>

Characters have a variable length in bytes, so `String` is not a `RandomAccessCollection`: the n-th character is found by walking from the start. `String.Index` is used instead.

</details>

<details>
<summary>2. What is a Character and how does it differ from a Unicode scalar?</summary>

`Character` is an extended grapheme cluster, one or more scalars perceived as a single visible character.

</details>

<details>
<summary>3. What is endIndex and why can't you access an element through it?</summary>

It is the position right after the last character; there is no element there, and accessing it crashes. The last character is reached through `index(before: endIndex)`.

</details>

<details>
<summary>4. How does Substring differ from String and when should you convert?</summary>

Substring shares the original string's buffer and is cheap to create. For long-term storage you need `String(substring)`, otherwise the whole original string is kept alive.

</details>

<details>
<summary>5. What is the complexity of count and isEmpty?</summary>

`count` is O(n), `isEmpty` is O(1).

</details>

<details>
<summary>6. What is the difference between String.count and NSString.length?</summary>

`count` counts `Character`s, `length` counts UTF-16 units. For emoji and flags the numbers differ.

</details>

<details>
<summary>7. How do you check whether two strings are anagrams?</summary>

Count the characters of the first string into a `[Character: Int]` and subtract for the second; all values must be zero. O(n) instead of the O(n log n) of sorting.

</details>

## Sources

- [Strings and Characters — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters/)
- [String — Apple Developer Documentation](https://developer.apple.com/documentation/swift/string)
- [Character — Apple Developer Documentation](https://developer.apple.com/documentation/swift/character)
- [Substring — Apple Developer Documentation](https://developer.apple.com/documentation/swift/substring)
- [Swift 5 String: UTF-8 — swift.org](https://www.swift.org/blog/utf8-string/)
