---
title: "В чём разница между as, as? и as! в Swift?"
category: swift
order: 139
---

Все три оператора выполняют приведение типов, но в разных ситуациях:

- `as` — приведение, которое гарантированно проходит: upcast к суперклассу или протоколу, а также bridging (`String as NSString`) и литералы (`1 as Double`). Проверять результат не нужно.
- `as?` — условное понижающее приведение (downcast): возвращает опционал целевого типа и `nil`, если объект не того типа.
- `as!` — принудительный downcast: возвращает значение целевого типа, а при неудаче приложение падает.

```swift
let view: UIView = UILabel()
let label = view as? UILabel      // UILabel?
let button = view as! UIButton    // краш: это UILabel
```

Оператор `is` только проверяет тип: `view is UILabel` вернёт `Bool`. Безопасный вариант — `if let label = view as? UILabel`, а `as!` допустим, когда тип точно известен.
