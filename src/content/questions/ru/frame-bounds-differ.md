---
title: "В каком случае bounds будет отличаться от frame"
category: uikit
order: 11
---

- Если к view применён **`transform`** (поворот, масштаб, например через `CGAffineTransform`): `bounds` остаётся прежним, а значение `frame` по документации становится неопределённым, и его не следует использовать.
- Если изменить **`bounds.origin`**: `frame` остаётся прежним, а содержимое сдвигается внутри view. Так работает скроллинг: `UIScrollView` меняет origin своих bounds (`contentOffset`).
