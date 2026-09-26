---
title: "Что такое View State?"
category: swiftui
order: 34
---

View State — состояние экрана, которое обычно описывают перечислением: так view всегда находится ровно в одном из явно заданных состояний.

```swift
enum ViewState {
    case loading
    case empty
    case loaded
    case error(String)
}

var viewState: ViewState {
    if filteredTodos == nil {
        return .loading
    } else if let error = errorMessage {
        return .error(error)
    } else if let todos = filteredTodos, !todos.isEmpty {
        return .loaded
    } else {
        return .empty
    }
}
```

В `body` по этому значению делают `switch` и показывают индикатор загрузки, пустой экран, список или ошибку.
