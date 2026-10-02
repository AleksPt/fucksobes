---
title: "Какие улучшения можно предложить в методе с цепочкой if-else, сравнивающей строки направления?"
category: swift
order: 117
---

```swift
func turnTo(direction: String) {
    if direction == "North" { northAction() }
    else if direction == "East" { eastAction() }
    else if direction == "South" { southAction() }
    else if direction == "West" { westAction() }
    else { print("No valid direction specified") }
}
```

Проблемы: значения направления — «магические строки», опечатка не отловится компилятором, а недопустимое значение обрабатывается только в рантайме. Улучшение — заменить строку перечислением и цепочку `if-else` на `switch`:

```swift
enum Direction { case north, east, south, west }

func turn(to direction: Direction) {
    switch direction {
    case .north: northAction()
    case .east:  eastAction()
    case .south: southAction()
    case .west:  westAction()
    }
}
```

Теперь допустимы только четыре значения, ветка «невалидное значение» не нужна, а компилятор проверяет полноту `switch`: при добавлении нового случая он потребует его обработать. Если строка приходит извне, перечисление с `String` в качестве raw value превращает её через `Direction(rawValue:)` и возвращает `nil` для неизвестных значений. Названия случаев в Swift пишут в lowerCamelCase.
