---
title: "Чем отличаются протоколы Sequence, Collection, BidirectionalCollection и RandomAccessCollection?"
category: algorithms
order: 31
---

Это иерархия протоколов стандартной библиотеки, каждый следующий уровень добавляет гарантии.

- **`Sequence`** — последовательность, которую можно обойти (`makeIterator()`, `for-in`, `map`, `filter`). Не гарантирует, что обход можно повторить: последовательность может быть одноразовой (поток данных).
- **`Collection`** — `Sequence`, которую можно обходить многократно, с индексами (`startIndex`, `endIndex`, `subscript`), `count` и срезами. Пример: `Set`, `Dictionary`.
- **`BidirectionalCollection`** — коллекция, по которой можно идти в обе стороны (`index(before:)`): доступны `last`, `reversed()` за `O(1)`. Пример: `String` (по символам).
- **`RandomAccessCollection`** — двунаправленная коллекция, где сдвиг индекса на произвольное число позиций выполняется за `O(1)` (`index(_:offsetBy:)`), поэтому `count` и доступ по индексу быстрые. Пример: `Array`, `ArraySlice`, `ContiguousArray`, `Range<Int>`.

Есть ещё `MutableCollection` (можно изменять элементы по индексу) и `RangeReplaceableCollection` (вставка и удаление). Алгоритмы пишут для самого слабого подходящего протокола, а сложность зависит от уровня: например, `count` у `Collection` может быть `O(n)`, а у `RandomAccessCollection` — `O(1)`.
