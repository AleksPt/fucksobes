---
title: "What is View State?"
category: swiftui
order: 34
---

View State is the state of a screen, usually described with an enum: this way the view is always in exactly one of the explicitly defined states.

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

In `body`, you `switch` over this value and show a loading indicator, an empty screen, a list, or an error.
