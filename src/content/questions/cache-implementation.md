---
title: "Как реализовать кеш?"
category: memory
order: 78
---

Для кеша в памяти в Foundation есть готовый инструмент — **`NSCache`**. Он ведёт себя как изменяемый словарь «ключ → значение», но с важным отличием: при нехватке памяти на устройстве система **автоматически удаляет** часть объектов из кеша сама, без явного участия кода и без обычного `didReceiveMemoryWarning`.

```swift
let cache = NSCache<NSString, UIImage>()

func image(for key: String) -> UIImage? {
    if let cached = cache.object(forKey: key as NSString) {
        return cached // уже в кеше — отдаём сразу
    }

    guard let loaded = loadExpensiveImage(for: key) else { return nil }
    cache.setObject(loaded, forKey: key as NSString)
    return loaded
}
```

Полезные настройки:

- `countLimit` — максимальное число элементов;
- `totalCostLimit` — ограничение по «стоимости» (например, суммарному размеру данных в байтах), которую задают при вставке (`setObject(_:forKey:cost:)`);
- `NSCache` потокобезопасен «из коробки», в отличие от обычного `Dictionary`;
- ключи и значения должны быть классами (`NSString`, `NSObject`-совместимые), поэтому value-типы вроде `String` заворачивают в `NSString`, а для собственных структур подходит враппер-класс.

Если нужен кеш с более специфичным поведением (LRU с фиксированным лимитом и предсказуемым вытеснением, персистентность на диск, TTL записи), поверх `NSCache` или вместо него пишут собственный слой: например, словарь + связный список для LRU, либо комбинацию `NSCache` (быстрый in-memory слой) и записи на диск (`FileManager`, Core Data, SQLite) как источника второго уровня.

Важно не путать `NSCache` с `URLCache` — тот кеширует HTTP-ответы `URLSession` и настраивается отдельно (`URLSessionConfiguration.requestCachePolicy`, `URLCache.shared`).
