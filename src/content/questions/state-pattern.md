---
title: "Что такое паттерн «Состояние» (State)? Чем он отличается от «Стратегии»?"
category: architecture
order: 51
---

State — поведенческий паттерн: поведение объекта зависит от его внутреннего состояния, и каждое состояние выделяется в отдельный тип. Объект-контекст хранит текущее состояние и делегирует ему вызовы, а состояния сами решают, в какое состояние перейти дальше. Так вместо больших `switch` по состоянию получается набор небольших типов.

```swift
protocol PlayerState { func tapButton(_ player: Player) }

struct Stopped: PlayerState { func tapButton(_ p: Player) { p.state = Playing() } }
struct Playing: PlayerState { func tapButton(_ p: Player) { p.state = Paused() } }
struct Paused: PlayerState { func tapButton(_ p: Player) { p.state = Playing() } }

final class Player {
    var state: PlayerState = Stopped()
    func tapButton() { state.tapButton(self) }
}
```

Отличие от Strategy: структура похожа (контекст и взаимозаменяемые объекты с общим интерфейсом), но цель разная. В Strategy алгоритм выбирает клиент, и стратегии не знают друг о друге. В State состояния знают друг о друге и сами переключают контекст при событиях. Часто состояния описывают и проще, через `enum` с `switch` или конечный автомат.
