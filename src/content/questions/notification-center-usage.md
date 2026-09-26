---
title: "Как использовать NotificationCenter для передачи данных между объектами?"
category: architecture
order: 47
---

`NotificationCenter` — центральная «шина» уведомлений (реализация паттерна Observer): один объект публикует событие по имени, а любое число других на него подписаны. Отправитель и получатели не знают друг о друге.

```swift
extension Notification.Name {
    static let userDidLogin = Notification.Name("userDidLogin")
}

// подписка
let token = NotificationCenter.default.addObserver(
    forName: .userDidLogin, object: nil, queue: .main
) { note in
    let user = note.userInfo?["user"] as? User
}

// публикация
NotificationCenter.default.post(name: .userDidLogin, object: self, userInfo: ["user": user])
```

Данные передают в `userInfo` (словарь) или в `object`. Подписку через блок нужно снять: `NotificationCenter.default.removeObserver(token)`, иначе она живёт, а замыкание может создать retain cycle (используют `[weak self]`). Для подписки через селектор с iOS 9 отписка при освобождении объекта не обязательна. Есть и современные способы: `NotificationCenter.default.publisher(for:)` в Combine и `notifications(named:)` как `AsyncSequence`.

Плюсы: слабая связность, много получателей. Минусы: связи неявные, нет проверки типов (ключи `userInfo` строковые), сложнее отслеживать поток данных и отлаживать. Поэтому уведомления используют для широковещательных событий (клавиатура, смена темы, вход или выход пользователя), а для связи двух конкретных объектов — делегаты и замыкания.
