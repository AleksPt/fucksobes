---
title: "Производительность UI"
order: 10
---

> **Что узнаешь**
>
> - Что такое hitch и hang, сколько времени даётся на кадр и кто в нём участвует
> - Почему нельзя блокировать главный поток: watchdog, Main Thread Checker
> - Offscreen rendering, color blending, `shouldRasterize`, `shadowPath`: что это и как найти и исправить
> - Как работать с картинками: декодирование, thumbnails, слои кэша
> - Плавные списки: cell prefetching, data prefetching, `reconfigureItems`
> - Чем измерять: Instruments, отладочные опции симулятора, `CADisplayLink`

> **Нужно знать заранее:** тутор [02](../calayer-drawing/) — `CALayer`, `draw(_:)`; тутор [08](../lists/) — reuse, таблицы и коллекции; тема «Многопоточность» — главный поток и очереди.

## Аналогия: кухня с конвейером кадров

Каждые 16,7 мс (на 120 Гц — каждые 8,3 мс) на раздачу должно попасть готовое блюдо.

- **Главный поток** — единственный повар, который готовит заказ и отвечает на вопросы клиентов.
- **Render server** — официант, который сервирует блюдо на стол.
- **Hitch** — блюдо не успели приготовить: клиент смотрит на прежнее повторно.
- **Hang** — повар затыкается на долгой задаче, и на вопросы никто не отвечает. Если повар завис совсем надолго, хозяин (watchdog) его увольняет.

## Шаг 1. Бюджет кадра

> **Hitch** — кратковременное «залипание» плавного движения на экране (при скроллинге, перетаскивании, анимации), когда кадр не готов к нужному моменту. Даже несколько миллисекунд заметны (Apple).

**Сколько времени на кадр (Apple):**

- 60 Гц — каждые 16,7 мс (1 с / 60); 120 Гц — каждые 8,3 мс (1 с / 120).
- Во время взаимодействия экран обновляется с максимальной частотой, которую поддерживает устройство; когда нечего обновлять, частота может снижаться.
- Приложение должно уместиться в один интервал vsync на обработку события, обновление UI и Core Animation commit. Дальше ещё один интервал у render server.

![Главный поток обрабатывает событие и обновляет UI, затем идёт Core Animation commit, потом render server: CPU готовит работу, GPU рисует кадр, и кадр попадает на экран на следующем vsync.](../../../../assets/tutorials/uikit/10-frame-pipeline.svg)

**Два вида hitch (Apple):**

| Вид | Причина | Где искать |
| --- | --- | --- |
| **Commit hitch** | Приложение не успело закончить commit до commit deadline, чаще всего из-за задержки в главном потоке | Тяжёлый код на главном потоке: layout, настройка ячеек, декодирование |
| **Render hitch** | Приложение уложилось, но render server не успел отрисовать: слишком сложная сцена | Тяжёлые эффекты: offscreen rendering, blending, блюры, много слоёв |

По документации Apple, render hitch обычно тоже вина приложения: слишком сложное обновление UI. Для поиска hitch нужно смотреть и главный поток, и render server.

**Hitch rate** — метрика Xcode Organizer: миллисекунды паузы в секунду (ms/s). По Apple: до 10 ms/s — хорошо, до 25 — предупреждение, до 50 — критично, больше 50 — требует немедленного внимания.

**Hitch и hang — не одно и то же.** Hang — долгая неотзывчивость главного потока на дискретное действие (нажатие): задержка от около 100 мс уже заметна. Hitch — пропуск дедлайна кадра во время непрерывного движения, тут заметны и задержки в пару миллисекунд. Но причина часто одна: тяжёлая работа на главном потоке; если убрать hang’и, многие hitch’и исчезнут.

## Шаг 2. Главный поток

На главном потоке должна оставаться только работа с интерфейсом. События обрабатываются по одному, поэтому долгая задача задерживает всё, что стоит позади неё, включая прокрутку и нажатия.

**Что типично блокирует главный поток (по документации Apple):**

- синхронная работа с сетью;
- обработка больших объёмов данных (большие JSON, 3D-модели);
- синхронная лёгкая миграция большого хранилища Core Data;
- запросы анализа Vision.

**Прячущаяся синхронная сеть.** Инициализаторы, которые берут URL (например `String(contentsOf:)` или `Data(contentsOf:)` с `https`), неявно делают синхронный сетевой запрос. Также опасны: reachability через `SCNetworkReachability` (по умолчанию синхронный), BSD DNS-функции. В офисной сети это не видно, у пользователей в слабой сети — случается.

> **Watchdog.** Операционная система следит за временем запуска и отзывчивостью приложения и **завершает** приложение, которое долго блокирует главный поток. В crash report причина такого завершения — код `0x8badf00d` («ate bad food»). Маркеры `scene-create` и `scene-update` в описании означают, что приложение не отрисовало первый кадр или не обновило UI вовремя. Не страдает привычный тест «на симуляторе с хорошим Wi-Fi»: настоящая проблема становится видна в плохой сети (Xcode умеет её имитировать).

**Решение: тяжёлую работу — вне главного потока**, а на главный возвращаться только за обновлением UI. Для сети Apple рекомендует `URLSession` (асинхронно), для изменений сети — `NWPathMonitor` вместо синхронного reachability.

```swift
@MainActor
final class FeedViewController: UIViewController {
    func reload() {
        Task {
            // сеть не блокирует главный поток: await отпускает его
            let (data, _) = try await URLSession.shared.data(from: feedURL)

            // тяжёлый разбор — на фоновой задаче
            let items = try await Task.detached(priority: .userInitiated) {
                try JSONDecoder().decode([Item].self, from: data)
            }.value

            apply(items)          // здесь уже главный поток (@MainActor): обновление UI
        }
    }
}
```

**Main Thread Checker — это не «альтернатива» watchdog.** Они делают противоположные вещи:

| Инструмент | Что делает |
| --- | --- |
| Main Thread Checker (Xcode) | Проверяет, что системные API, которые должны вызываться на главном потоке (обычно UI), действительно вызваны именно там. Диагностика во время разработки |
| Watchdog (операционная система) | Убивает приложение, которое долго блокирует главный поток |
| Свой «watchdog» в коде | Наблюдатель за run loop главного потока: логирует «поток завис на N секунд», чтобы найти место затыкания до того, как системный watchdog убьёт приложение |

У Main Thread Checker (по Apple) минимальный overhead: около 1–2 % CPU и не более 100 мс к времени запуска, поэтому Xcode включает его по умолчанию в схемах разработки. Он подменяет только системные API с известными требованиями к потоку, не все.

**Таймер замирает при прокрутке.** Таймеры обслуживает run loop, а во время прокрутки UIKit переводит его в режим отслеживания (`UITrackingRunLoopMode`), отдавая приоритет отрисовке. Таймер, созданный в режиме по умолчанию, перестаёт срабатывать, пока пользователь крутит список (так описывает статья «Устройство UI в iOS»). Решение — добавить таймер в run loop в режиме `.common`. Подробнее о run loop — в теме «Многопоточность».

```swift
let timer = Timer(timeInterval: 1.0, repeats: true) { _ in tick() }
RunLoop.main.add(timer, forMode: .common)      // работает и при скролле
```

## Шаг 3. Layout и работа в цикле отрисовки

Расчёт layout и настройка ячеек — работа главного потока:

- Auto Layout работает только в главном потоке и на очень сложных иерархиях может быть медленным; для простых иерархий он достаточно быстр;
- в сложных лентах размеры вычисляют вручную (`layoutSubviews` и `sizeThatFits`), а тяжёлые вычисления размеров переносят в фон до появления ячейки; сама расстановка view на экране остаётся на главном потоке.

**Практические правила:**

- упрощай иерархию view в ячейках (меньше view — меньше слоёв и вычислений layout);
- не считай в `cellForRowAt`, `layoutSubviews` и `willDisplay` ничего тяжёлого: подготовь данные (текст, размеры, картинки) заранее, в модели строки;
- не вызывай `layoutSubviews`/`layoutIfNeeded` наверняка (тутор [05](../autolayout-layout-pass/)): лишние обходы дороги;
- не забивай очередь главного потока мелкими блоками без нужды: run loop не перейдёт к отрисовке, пока не обработает блоки из main queue.

## Шаг 4. Рисование на CPU: draw(_:) и isOpaque

`draw(_:)` и `CGContext` рисуют содержимое view на CPU и на главном потоке (тутор [02](../calayer-drawing/)). В сложных экранах это прямая дорога к commit hitch. Как снизить стоимость:

- не перерисовывать на каждый кадр (`setNeedsDisplay` только когда реально изменилось содержимое);
- простые фигуры и градиенты делать готовыми слоями (`CAShapeLayer`, `CAGradientLayer`, тутор [02](../calayer-drawing/)), а не в `draw(_:)`;
- тяжёлую отрисовку (тени, скругления картинок, эффекты) подготавливать заранее в фоне и кэшировать готовое изображение (так делает лента ВКонтакте).

**`isOpaque`.** По документации Apple, это подсказка системе рисования: если view помечена непрозрачной, система может оптимизировать часть операций рисования. Непрозрачная view должна заполнять все свои `bounds` полностью непрозрачным содержимым; иначе результат непредсказуем. Значение по умолчанию — `true`.

```swift
final class ChartView: UIView {
    override init(frame: CGRect) {
        super.init(frame: frame)
        isOpaque = true                    // рисуем сами в draw(_:) и заливаем весь bounds непрозрачным
        backgroundColor = .white
    }
    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    override func draw(_ rect: CGRect) {
        // ... рисуем содержимое на белом фоне
    }
}
```

## Шаг 5. Offscreen rendering

> **Offscreen rendering** — когда слой нельзя нарисовать напрямую в итоговое изображение кадра, и render server сначала рисует его во временный буфер, а потом накладывает результат. Получается дополнительный проход отрисовки и лишняя память.

**Что может вызвать offscreen rendering**

| Свойство слоя | Почему | Что делать |
| --- | --- | --- |
| `cornerRadius` с `masksToBounds` | Слой рисуется во временный буфер, края обрезаются | Скруглённый фон без обрезки содержимого; картинку скруглить заранее (ниже) |
| Shadow (`shadowRadius` без `shadowPath`) | Система считает тень по альфа-каналу содержимого слоя | Задать `shadowPath` |
| `mask` | Промежуточное рисование слоя и применение маски | Готовое изображение или простой слой вместо маски |
| `shouldRasterize = true` | Слой рендерится в bitmap и потом композитится (Apple) | Только для статичного дорогого содержимого, с измерением |
| `UIVisualEffectView` (блюр, vibrancy) | Строится в несколько проходов | Не ставь на каждую ячейку списка |

**Что пишет Apple:**

- `cornerRadius` по умолчанию применяется только к фону и рамке слоя; чтобы обрезать содержимое (`contents`) по скруглённым углам, нужен `masksToBounds = true`.
- Явный `shadowPath` «обычно улучшает производительность рендеринга»; без него тень строится по альфа-каналу слоя.
- `shouldRasterize`: слой рендерится как bitmap в своём пространстве координат и затем композитится; тени и фильтры входят в bitmap, но текущая `opacity` слоя — нет. По умолчанию `false`.

**Тень: `shadowPath`.** Если форма тени известна заранее, укажи её явно. Так системе не нужно вычислять форму из содержимого. Путь зависит от размера слоя, поэтому его задают после получения размеров, в `layoutSubviews`:

```swift
final class CardView: UIView {
    override init(frame: CGRect) {
        super.init(frame: frame)
        layer.cornerRadius = 12
        layer.shadowColor = UIColor.black.cgColor
        layer.shadowOpacity = 0.2
        layer.shadowRadius = 8
        layer.shadowOffset = CGSize(width: 0, height: 4)
        // masksToBounds не ставим: он обрезал бы и саму тень
    }
    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    override func layoutSubviews() {
        super.layoutSubviews()
        layer.shadowPath = UIBezierPath(roundedRect: bounds, cornerRadius: layer.cornerRadius).cgPath
    }
}
```

**Аватар со скруглёнными углами: скруглить само изображение.** Вместо `cornerRadius` и `masksToBounds` на `UIImageView` нарисовать картинку со скруглёнными углами заранее, так что скругление станет частью bitmap.

```swift
func roundedImage(_ image: UIImage, size: CGSize, radius: CGFloat) -> UIImage {
    let renderer = UIGraphicsImageRenderer(size: size)
    return renderer.image { _ in
        let rect = CGRect(origin: .zero, size: size)
        UIBezierPath(roundedRect: rect, cornerRadius: radius).addClip()
        image.draw(in: rect)
    }
}
```

## Шаг 6. Color blending

> **Blending** — этап, на котором вычисляется итоговый цвет пикселя. Если слои полупрозрачные, GPU должен посчитать цвет сквозь все перекрывающиеся слои.

- Найти: **Color Blended Layers** в Debug-меню симулятора (или Xcode); красным показаны слои с blending, зелёным — без.
- Как убрать: если слой всегда лежит на однотонном фоне, задай ему непрозрачный `backgroundColor` того же цвета: внешне то же, но blending не нужен (из заметок).
- У непрозрачных картинок не держать альфа-канал без нужды, не ставить `alpha < 1` там, где можно задать готовый цвет.
- Блюры и vibrancy (`UIVisualEffectView`) строятся в несколько проходов, повторные проходы дороги: убирай лишние эффекты.

```swift
let label = UILabel()
label.backgroundColor = .white            // тот же цвет, что у фона под ним: не .clear
label.isOpaque = true                     // для UILabel не влияет (Apple); важен сам непрозрачный backgroundColor
```

## Шаг 7. Картинки

Рендерер может показать только bitmap — сырые пиксели. PNG, JPEG, HEIC сжаты, их нужно **декодировать**. Если ничего не делать, `UIImageView` декодирует картинку на **главном потоке** при commit (по WWDC21): большая картинка не успевает и получается commit hitch.

**Что делать (iOS 15+, Apple):**

- **Подготавливать картинку заранее**, вне главного потока. Для этого есть API подготовки изображения к показу (синхронный вариант можно запускать на любом потоке, асинхронные — на внутренней последовательной очереди UIKit). Результат — новый `UIImage` только с пиксельными данными, которые нужны рендереру.
- **Делать thumbnail под размер view**: `preparingThumbnail(of:)`. Если исходная картинка намного больше view, декодировать её в полный размер — лишние накладные расходы памяти (Apple). Метод возвращает `nil`, если изображение не связано с `CGImage` или данные повреждены.
- **Пока картинка грузится — держать placeholder**, который дёшево показать синхронно.
- **Подготовленные картинки кэшировать экономно** (WWDC21): в них сырые пиксели, то есть много памяти. На диск сохраняй оригинал, а не подготовленный вариант.

```swift
final class PhotoCell: UICollectionViewCell {
    private let imageView = UIImageView()
    private var loadTask: Task<Void, Never>?

    override func prepareForReuse() {
        super.prepareForReuse()
        loadTask?.cancel()                  // отменить задачу прошлой строки (тутор 08)
    }

    func configure(with item: Item, targetSize: CGSize) {
        imageView.image = UIImage(named: "placeholder")      // дёшево, синхронно
        loadTask = Task { [weak self] in
            guard let original = await ImageStore.shared.image(for: item.url) else { return }
            // декодирование и уменьшение — на фоновой задаче, не на главном потоке
            let thumbnail = await Task.detached(priority: .userInitiated) {
                original.preparingThumbnail(of: targetSize)
            }.value
            guard !Task.isCancelled else { return }
            self?.imageView.image = thumbnail
        }
    }
}
```

## Шаг 8. Плавные списки: prefetching и жизнь ячейки

Техники ниже — из доклада WWDC21 «Make blazing fast lists and collection views» и документации Apple.

**Жизнь ячейки** — две фазы: **подготовка** (взять ячейку из очереди или создать, настроить данные, посчитать размер) и **показ** (`willDisplay`, ячейка видна, потом `didEndDisplaying`).

**Cell prefetching (iOS 15+).** Когда коммит кадра быстрый и осталось время, система готовит следующую ячейку заранее. Тогда на ячейку доступно до вдвое больше времени без hitch. Для `UICollectionView` это расширение того, что появилось в iOS 10; в iOS 15 оно работает для списков, всех compositional layout и для `UITableView`. Для получения этого достаточно собрать приложение с iOS 15 SDK. Плюс энергоэффективность: быстрая подготовка ячеек позволяет системе работать в менее затратном режиме.

**Что требует от тебя:**

- Ячейка должна быть полностью настроена **в фазе подготовки**. Не жди момента, когда ячейка станет видимой, для тяжёлой работы.
- Подготовленная ячейка может **так и не отобразиться** (пользователь резко развернул прокрутку).
- Одна и та же ячейка может показываться **больше одного раза** для одного `indexPath`: ячейка уже не сразу попадает в reuse pool после `didEndDisplaying`.

**Другие правила (WWDC21):**

- **Регистрацию ячейки (`CellRegistration`) создавай один раз снаружи cell provider.** Если создать её внутри provider, collection view никогда не переиспользует ячейки (очередь reuse ведётся по экземпляру регистрации).
- **Если данные пришли позже (картинка из сети), не обновляй захваченную ячейку напрямую**: к моменту ответа она может быть уже настроена на другой элемент. Вместо этого сообщи data source, что элемент нужно перенастроить: `reconfigureItems` (тутор [08](../lists/)). Всё, что обновляет ячейку, остаётся в одном месте — в handler регистрации. `reconfigureItems` предпочтительнее `reloadItems`: он переиспользует существующую ячейку, а не берёт новую.
- **Data prefetching** — место, где стартуют сетевые загрузки заранее: так пользователь реже видит placeholder.

```swift
extension FeedViewController: UICollectionViewDataSourcePrefetching {
    func collectionView(_ collectionView: UICollectionView, prefetchItemsAt indexPaths: [IndexPath]) {
        for indexPath in indexPaths {
            ImageStore.shared.startLoading(items[indexPath.item].url)       // начать загрузку заранее
        }
    }

    func collectionView(_ collectionView: UICollectionView, cancelPrefetchingForItemsAt indexPaths: [IndexPath]) {
        for indexPath in indexPaths {
            ImageStore.shared.cancelLoading(items[indexPath.item].url)      // пользователь ушёл в другую сторону
        }
    }
}
// collectionView.prefetchDataSource = self
```

## Шаг 9. Измерения: сначала поиск, потом оптимизация

«сначала измерения, потом оптимизация», исследовать только на **реальных устройствах** и в **релизных сборках** (без отладчика, с включёнными оптимизациями). Симулятор не даёт полной картины по железу.

| Инструмент | Для чего |
| --- | --- |
| Instruments | Time Profiler (где тратится время), шаблоны для hitch/hang, в том числе Hitches instrument (Apple; нет на visionOS) |
| Xcode Organizer | Метрика Hitches: hitch rate по всем пользователям в миллисекундах паузы в секунду |
| Color Blended Layers (Debug-меню симулятора или Xcode) | Слои с blending |
| Color Offscreen-Rendered Yellow (Debug-меню симулятора) | Слои с offscreen pass |
| Main Thread Checker | UI-вызовы из фона |
| `CADisplayLink` в коде | Своя метрика «залипаний» для регресс-тестов |

**Своя метрика через `CADisplayLink`.** Таймер срабатывает по частоте обновления экрана. Если между двумя срабатываниями прошло значительно больше времени, чем ожидаемый интервал кадра, главный поток был занят. Но этот метод ловит только проблемы в приложении: **render hitch** (render server не успел) таким способом не виден.

```swift
final class HitchMonitor {
    private var link: CADisplayLink?
    private var lastTimestamp: CFTimeInterval = 0

    func start() {
        link = CADisplayLink(target: self, selector: #selector(tick(_:)))
        link?.add(to: .main, forMode: .common)
    }

    func stop() {
        link?.invalidate()                       // CADisplayLink держит target сильно: без stop() утечка
        link = nil
    }

    @objc private func tick(_ link: CADisplayLink) {
        defer { lastTimestamp = link.timestamp }
        guard lastTimestamp != 0 else { return }

        let actual = link.timestamp - lastTimestamp          // сколько прошло
        let expected = link.duration                         // сколько должно было (1 / частота)
        if actual > expected * 1.5 {
            print("Возможный hitch: \(Int((actual - expected) * 1000)) ms")
        }
    }
}
```

## Шаг 10. Чек-лист: симптом → причина → что делать

| Симптом | Вероятная причина | Что делать |
| --- | --- | --- |
| Приложение «замирает» на пару секунд, затем реагирует | Hang: долгая работа на главном потоке (сеть, парсинг, база) | Вынести работу вне главного потока; проверить crash report на `0x8badf00d` |
| Рывки, когда появляется новая ячейка | Commit hitch: тяжёлая настройка ячейки или layout | Упростить ячейку; подготовить данные заранее; проверить prefetching |
| Рывки в момент появления картинки | Декодирование большого изображения на главном потоке | Подготовка в фоне, thumbnail под размер view |
| Плавно на простом экране, рывки на экране с тенями и блюром | Render hitch: offscreen pass, blending, много слоёв | `shadowPath`; без `mask`; непрозрачные фоны; убрать лишние эффекты |
| Таймер не тикает при прокрутке | Таймер в режиме по умолчанию | Добавить в run loop в режиме `.common` |

## Типичные ошибки

- Синхронная сеть на главном потоке, в том числе скрытая (`Data(contentsOf:)` с `https`, `SCNetworkReachability`): watchdog убьёт приложение.
- Считать Main Thread Checker и watchdog альтернативами: это разные вещи.
- Доверять только тесту «на симуляторе с хорошей сетью»: реальные проблемы видны на устройстве и в плохой сети.
- Путать hitch (пропуск кадра) и hang (долгая неотзывчивость).
- Тяжёлая работа в `cellForRowAt`, `layoutSubviews`, `willDisplay`.
- Рисовать в `draw(_:)` то, что можно сделать готовым слоем, и перерисовывать на каждый кадр.
- Думать, что `isOpaque = true` ускорит `UILabel` или `UIButton`: у системных классов свойство не влияет.
- Тень без `shadowPath`.
- Ставить `masksToBounds` на верхнем слое с тенью: обрежет саму тень.
- Включать `shouldRasterize` для анимируемого или часто меняющегося слоя без измерений.
- Декодировать огромные картинки в полный размер для маленького `UIImageView`, не делать thumbnail.
- Кэшировать подготовленные (распакованные) картинки без ограничения или сохранять их на диск.
- Создавать cell registration внутри cell provider: ячейки не переиспользуются.
- Обновлять ячейку из асинхронного ответа напрямую (она уже другой элемент): нужен `reconfigureItems`.
- Делать тяжёлую работу только когда ячейка стала видимой: при prefetching эта работа должна быть уже выполнена.
- Не вызывать `invalidate()` у `CADisplayLink`: утечка (сильная ссылка на target).
- Оптимизировать на ощущениях, без Instruments, на симуляторе или в debug-сборке.

<details>
<summary>В чём разница между commit hitch и render hitch? По чему отличить?</summary>

Commit hitch: приложение не успело закончить Core Animation commit до commit deadline: искать надо в работе главного потока. Render hitch: приложение уложилось, но render server не успел отрисовать сложную сцену. Различают по трассе в Instruments (время на главном потоке против время на render server).

</details>

## Шпаргалка

```swift
// Бюджет: 60 Гц = 16.7 ms, 120 Гц = 8.3 ms. Главный поток → commit → render server (CPU, GPU) → экран
// hitch: пропуск кадра (commit hitch: главный поток; render hitch: render server)
// hang: неотзывчивость больше ~100 ms; watchdog убивает приложение (0x8badf00d)

// Главный поток
let (data, _) = try await URLSession.shared.data(from: url)          // сеть асинхронно
let items = await Task.detached { try decode(data) }.value          // тяжёлое — на фон
RunLoop.main.add(timer, forMode: .common)                           // таймер не замирает при скролле

// Слои
layer.shadowPath = UIBezierPath(roundedRect: bounds, cornerRadius: r).cgPath   // в layoutSubviews
// cornerRadius без masksToBounds — только фон и рамка; masksToBounds обрезает содержимое
// isOpaque — только для подклассов с draw(_:); у системных классов не влияет
// Непрозрачный backgroundColor — меньше blending

// Картинки
image.preparingThumbnail(of: viewSize)      // iOS 15, вне главного потока; placeholder пока грузится

// Списки
// собрать с iOS 15 SDK → cell prefetching; prefetchDataSource — для сети
// registration создать один раз снаружи provider; обновление своего элемента — reconfigureItems

// Измерения: реальное устройство, release; Instruments, Organizer (hitch rate), Color Blended Layers, Color Offscreen-Rendered
```

## Вопросы для самопроверки

<details>
<summary>1. Сколько времени даётся на кадр и что такое hitch?</summary>

16,7 мс на 60 Гц и 8,3 мс на 120 Гц. Hitch — пропуск дедлайна, когда новый кадр не готов вовремя, и прежний остаётся на экране дольше, что заметно в непрерывном движении.

</details>

<details>
<summary>2. В чём разница между hitch и hang? Что делает watchdog?</summary>

Hang — долгая неотзывчивость главного потока на дискретное действие (около 100 мс уже заметно). Hitch — пропуск кадра в непрерывном движении. Watchdog убивает приложение, которое долго блокирует главный поток; в crash report это `0x8badf00d`.

</details>

<details>
<summary>3. Чем Main Thread Checker отличается от watchdog?</summary>

Main Thread Checker — отладочный инструмент Xcode: ловит вызовы UI-API не с главного потока. Watchdog — механизм операционной системы, который завершает неотвечающее приложение.

</details>

<details>
<summary>4. Что такое offscreen rendering и что может его вызвать? Как найти и исправить?</summary>

Render server рисует слой во временный буфер и только потом накладывает. Вызывают: обрезка содержимого скруглением (`masksToBounds`), тень без `shadowPath`, `mask`, визуальные эффекты. Находят в Debug-меню симулятора («Color Offscreen-Rendered Yellow») и Instruments. Исправляют: `shadowPath`, заранее скруглённая картинка, простые слои вместо маски.

</details>

<details>
<summary>5. Что такое color blending и как с ним бороться? Когда полезен isOpaque?</summary>

Blending — вычисление итогового цвета пикселя сквозь полупрозрачные слои. Находят «Color Blended Layers». Исправляют непрозрачными фонами. `isOpaque` — подсказка системе для подклассов с собственным `draw(_:)`; у системных классов не влияет.

</details>

<details>
<summary>6. Как работать с большими картинками в списке, чтобы не было рывков?</summary>

Декодирование не должно идти на главном потоке: делать thumbnail под размер view в фоне (`preparingThumbnail(of:)`, iOS 15), показывать placeholder, запускать загрузку в prefetching, а при позднем ответе обновлять ячейку через `reconfigureItems`. Подготовленные картинки занимают много памяти: кэшировать экономно.

</details>

<details>
<summary>7. Как работает cell prefetching и какие у него последствия для кода ячейки?</summary>

Система готовит следующую ячейку в свободное время после быстрого commit. Ячейка должна быть полностью настроена в фазе подготовки; подготовленная ячейка может не показаться или показаться несколько раз для одного `indexPath`. Registration создаётся один раз снаружи cell provider.

</details>

## Источники

- [Understanding hitches in your app — Apple Developer Documentation](https://developer.apple.com/documentation/xcode/understanding-hitches-in-your-app)
- [Understanding hangs in your app — Apple Developer Documentation](https://developer.apple.com/documentation/xcode/understanding-hangs-in-your-app)
- [Improving app responsiveness — Apple Developer Documentation](https://developer.apple.com/documentation/xcode/improving-app-responsiveness)
- [Addressing watchdog terminations — Apple Developer Documentation](https://developer.apple.com/documentation/xcode/addressing-watchdog-terminations)
- [Diagnosing memory, thread, and crash issues early — Apple Developer Documentation](https://developer.apple.com/documentation/xcode/diagnosing-memory-thread-and-crash-issues-early)
- [cornerRadius — Apple Developer Documentation](https://developer.apple.com/documentation/quartzcore/calayer/cornerradius)
- [shouldRasterize — Apple Developer Documentation](https://developer.apple.com/documentation/quartzcore/calayer/shouldrasterize)
- [shadowPath — Apple Developer Documentation](https://developer.apple.com/documentation/quartzcore/calayer/shadowpath)
- [isOpaque — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uiview/isopaque)
- [preparingThumbnail — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uiimage/preparingthumbnail(of:))
- [Make blazing fast lists and collection views — WWDC21 (Apple)](https://developer.apple.com/videos/play/wwdc2021/10252/)
- [Сложные отображения коллекций в iOS на примере ленты ВКонтакте — Habr](https://habr.com/ru/companies/vk/articles/481626/)
- [Устройство UI в iOS — sidorov.tech](https://sidorov.tech/all/ustroystvo-ui-v-ios/)
- [Оптимизация рендера в iOS — Habr](https://habr.com/ru/articles/647177/)
- [Implementing a main thread watchdog on iOS — Jesse Squires](https://www.jessesquires.com/blog/2022/08/11/implementing-a-main-thread-watchdog-on-ios/)
- [Offscreen Rendering in iOS — Stackademic](https://blog.stackademic.com/offscreen-rendering-in-ios-faf9cbe488ea)
