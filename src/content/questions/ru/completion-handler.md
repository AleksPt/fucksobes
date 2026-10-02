---
title: "Зачем нужен completion handler в Swift?"
category: swift
order: 124
---

Completion handler — замыкание, которое передают в функцию и которое она вызывает, когда закончит работу. Оно нужно для асинхронных операций (сетевой запрос, загрузка файла, анимация), результат которых нельзя вернуть из функции сразу: вызывающий код не блокируется, а продолжение получает результат позже.

```swift
func fetchUser(id: Int, completion: @escaping (Result<User, Error>) -> Void) {
    URLSession.shared.dataTask(with: url(id)) { data, _, error in
        // разбираем ответ...
        completion(.success(user))
    }.resume()
}

fetchUser(id: 1) { result in
    // выполнится, когда загрузка завершится
}
```

Замыкание помечают `@escaping`, потому что оно вызывается после возврата из функции. Важно вызывать его ровно один раз на каждом пути выполнения и учитывать, в каком потоке оно будет вызвано (обновление UI выполняют на главном). Сегодня многие задачи решают через `async/await`, а completion handler остаётся во многих API Apple и старом коде и превращается в `async` через `withCheckedContinuation`.
