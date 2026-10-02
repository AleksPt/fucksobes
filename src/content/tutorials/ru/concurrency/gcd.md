---
title: "Grand Central Dispatch"
order: 2
---

> **Что узнаешь**
>
> - Что такое GCD и почему мы работаем с очередями, а не с потоками
> - Serial и concurrent очереди, main и global
> - sync и async — кто кого ждёт
> - Приоритеты Quality of Service (QoS)
> - DispatchWorkItem, DispatchGroup, asyncAfter, concurrentPerform, DispatchSource
> - Когда GCD, а когда OperationQueue

> **Нужно знать заранее:** [тутор 01](../concurrency-basics/) — процесс, поток, главный поток, context switch.

## Аналогия: лента заказов на кухне

Ты больше не нанимаешь поваров сам. Ты просто кладёшь **заказы** (задачи-замыкания) на **ленту** (очередь). Шеф-менеджер кухни (GCD) сам решает, какому повару (потоку из пула) и когда отдать заказ.

- **Serial-лента** — заказы готовятся строго по одному: следующий начинают, только когда закончен предыдущий.
- **Concurrent-лента** — заказы берут по порядку, но несколько поваров готовят их одновременно, и готовы они могут быть в любом порядке.
- **Главная лента (main)** — одна особая лента, её обслуживает только шеф на раздаче (главный поток): только он выдаёт блюда гостям (обновляет UI).

## Шаг 1. Что такое GCD

> **Grand Central Dispatch (Dispatch)** — фреймворк Apple для асинхронного выполнения задач. Он берёт на себя создание потоков и управление ими и планирует выполнение задач в зависимости от загруженности системы.

- GCD работает **на системном уровне**, поэтому учитывает потребности всех приложений на устройстве и эффективно распределяет ресурсы.
- Написан на C (низкоуровневый), но начиная со Swift 3 у него удобный Swift API.
- Доступен в iOS, macOS, watchOS, tvOS.
- GCD **не использует прямые команды Thread**. Управление потоками (включая их создание) происходит через **очереди**. Очереди — основа GCD.
- Пулом потоков проще управлять, проверять и контролировать, чем набором отдельных несвязанных потоков.

![Три колонки слева направо: ваш код (задачи 1, 2, 3), очереди DispatchQueue (main serial, global concurrent, custom serial или concurrent) и пул потоков под управлением системы (Main thread и три Thread). Задача 1 идёт в main, задача 2 в global, задача 3 в custom. Main отдаёт работу Main thread, global двум потокам, custom одному потоку.](../../../../assets/tutorials/concurrency/02-gcd-architecture.svg)

**Основные понятия GCD:**

| Понятие | Тип в Swift | Смысл |
| --- | --- | --- |
| Задача | замыкание или `DispatchWorkItem` | Работа, которую нужно выполнить |
| Очередь | `DispatchQueue` | Объект, который управляет выполнением задач на главном или фоновом потоке. Работает по FIFO |
| Способ отправки | `sync` / `async` | Ждём ли мы завершения задачи в текущем месте кода |

## Шаг 2. Очередь — это FIFO

**Очередь (queue)** — сущность, которая выполняет поступающие задачи на одном или нескольких потоках. Как очередь в кинотеатр, только в ней стоят замыкания: кто первым встал, того первым и отправят на выполнение (**First In, First Out**).

> FIFO гарантирует **порядок старта**, а не порядок завершения. Порядок завершения зависит от длительности задач и типа очереди.

**Чем очередь отличается от потока?** Поток — «работник», который последовательно выполняет инструкции. Задача в очереди — кусок работы, который нужно выполнить *на каком-то* потоке. Когда именно и на каком потоке — решает система в зависимости от загрузки и свойств очереди. Очередь избавляет от деталей: не нужно думать о создании потоков, их количестве и распределении нагрузки.

## Шаг 3. Serial и Concurrent очереди

```swift
// Последовательная (serial) — по умолчанию
let serialQueue = DispatchQueue(label: "com.example.serial")

// Параллельная (concurrent)
let concurrentQueue = DispatchQueue(label: "com.example.concurrent", attributes: .concurrent)
```

> В `label` принято писать обратное доменное имя (`com.company.app.purpose`) — так очередь легко найти в стеке вызовов и в отладчике.

**Serial (последовательная)** — система «вытягивает» задачу с вершины очереди и выполняет её до конца, только потом берёт следующую.

- В каждый момент выполняется **одна** задача.
- Может служить средством синхронизации (об этом в [туторе 04](../thread-safety-synchronization/)).
- Примеры: приватные очереди по умолчанию, `DispatchQueue.main`.

**Concurrent (параллельная)** — система берёт задачу с вершины и запускает её на потоке; если ресурсы ещё есть, сразу берёт следующую и запускает на другом потоке, пока первая ещё работает.

- Задачи **стартуют** в порядке очереди, но **завершаются** в любом порядке.
- Нет гарантии, что система даст больше одного потока, — только возможность.
- Примеры: приватные `.concurrent` очереди, глобальные очереди `DispatchQueue.global(...)`.

![Две шкалы времени от 0 до 11. Serial: Task 0 с 0 до 3, Task 1 с 3 до 5, Task 2 с 5 до 9, Task 3 с 9 до 11, строго друг за другом. Concurrent: Task 0 с 0 до 6, Task 1 с 1 до 4, Task 2 с 2 до 9, Task 3 с 3 до 5, задачи перекрываются; стартуют по порядку, завершаются в любом порядке.](../../../../assets/tutorials/concurrency/02-serial-concurrent.svg)

## Шаг 4. Главная и глобальные очереди

GCD даёт готовые системные очереди:

```swift
let mainQueue = DispatchQueue.main        // главная, serial, связана с главным потоком
let globalDefault = DispatchQueue.global() // глобальная concurrent, QoS .default
let userInteractive = DispatchQueue.global(qos: .userInteractive)
let userInitiated = DispatchQueue.global(qos: .userInitiated)
let utility = DispatchQueue.global(qos: .utility)
let background = DispatchQueue.global(qos: .background)
```

**Главная очередь** обрабатывает главный цикл событий (RunLoop): реагирует на события и обновляет UI. Каждое изменение UI должно выполняться здесь, а каждая долгая операция в ней делает интерфейс менее отзывчивым.

**Глобальные очереди** — предопределённые concurrent-очереди с разными приоритетами (QoS). Для фоновых задач: загрузка большого изображения, вызов API, парсинг.

## Шаг 5. sync и async

Когда задача поставлена в очередь, разница только в одном: **ждёт ли текущий код её завершения**.

- `queue.sync { }` — помещаем задачу в очередь и **ждём** её выполнения. Текущий поток заблокирован, пока задача не закончится.
- `queue.async { }` — помещаем задачу в очередь и **сразу идём дальше**. Текущий поток не блокируется.

```swift
let queue = DispatchQueue(label: "queue")

// sync: управление вернётся только после завершения задачи
queue.sync { print("Сначала выполнится это") }
print("Потом это")

// async: управление вернётся сразу
queue.async { print("Потом это") }
print("Сначала выполнится это")
```

![Диаграмма последовательности для queue1 (текущая) и queue2. Queue1 выполняет задачи 1 и 2. Блок sync: queue1 вызывает queue2.sync с задачей 3, заблокирована и ждёт, queue2 отвечает, что задача 3 выполнена. Затем задача 4 в queue1. Блок async: queue1 вызывает queue2.async с задачей 3 и сразу выполняет задачу 4, а задача 3 идёт в queue2 параллельно.](../../../../assets/tutorials/concurrency/02-sync-async.svg)

> `sync` / `async` — это про **текущий** поток (ждём или нет). `serial` / `concurrent` — это про **очередь-получатель** (сколько задач она выполняет одновременно). Это две независимые оси: бывает async в serial, sync в concurrent и т.д.

## Шаг 6. Главный паттерн: фон → main

```swift
DispatchQueue.global(qos: .userInitiated).async {
    let result = performHeavyTask()          // тяжёлое — в фоне
    DispatchQueue.main.async {
        updateUIWithResult(result)           // UI — только на main
    }
}
```

Например, запрос списка фильмов выполняется в фоне; когда ответ пришёл и распарсен — переключаемся на главную очередь и обновляем таблицу.

## Шаг 7. Quality of Service (QoS)

QoS — это приоритет задачи. Он влияет на то, сколько процессорного времени, I/O и энергии система выделит задаче.

| QoS | Для чего | Пример | Длительность |
| --- | --- | --- | --- |
| `.userInteractive` | Пользователь взаимодействует прямо сейчас, нужен мгновенный результат | Анимации, расчёт интерфейса, обработка жестов | Мгновенно |
| `.userInitiated` | Пользователь запустил задачу из UI и ждёт результата | Открытие документа, чтение из БД по нажатию | Мгновение — пара секунд |
| `.default` | Промежуточный между userInitiated и utility; «нет информации о QoS». Напрямую обычно не выбирают | `DispatchQueue.global()` без параметра | — |
| `.utility` | Долгие задачи, прогресс которых пользователь может видеть; баланс отзывчивости и энергии | Сеть, импорт, загрузка карт с индикатором | Секунды — минуты |
| `.background` | Пользователь не видит и не ждёт | Бэкап, индексация, предзагрузка, синхронизация | Минуты — часы |
| `.unspecified` | Отсутствие QoS; для поддержки легаси API | Не используется | — |

**Повышение приоритета (priority escalation).** Если высокоприоритетная задача ждёт результата низкоприоритетной (например, делает `sync` на её очередь), система может временно поднять QoS ожидаемой задачи — это частично защищает от инверсии приоритетов (см. [тутор 03](../concurrency-problems/)).

## Шаг 8. DispatchWorkItem — задача как объект

`DispatchWorkItem` — более объектно-ориентированная альтернатива обычному замыканию. В отличие от замыкания, он умеет:

- указать **QoS** и **флаги** (`DispatchWorkItemFlags`, например `.barrier`);
- **уведомить** другую очередь о завершении — `notify(queue:)`;
- **отмениться**, пока его ещё не взяли в работу — `cancel()`.

```swift
let queue = DispatchQueue(label: "queue")
let workItem = DispatchWorkItem { print("Task") }

workItem.notify(queue: .main) { print("Task completed") }
queue.async(execute: workItem)
// Task
// Task completed
```

Задача посложнее. Что напечатается?

```swift
func run() {
    let queue = DispatchQueue(label: "SwiftBook.Example.Queue")   // serial
    let item1 = DispatchWorkItem { print("Task1") }
    let item2 = DispatchWorkItem(qos: .background) { print("Task2") }

    item1.notify(queue: queue) { print("finish1") }
    item2.notify(queue: queue) { print("finish2") }

    queue.async { sleep(1) }             // очередь занята на 1 секунду
    queue.async(execute: item1)
    queue.async(execute: item2)
    item1.cancel()                       // item1 ещё не начался — отменяем
}
// Task2
// finish1
// finish2
```

<details>
<summary>Почему так?</summary>

`item1` отменён до старта, поэтому его тело (`print("Task1")`) не выполнится. Но отмена не отменяет `notify`: когда очередь дойдёт до `item1`, он мгновенно «завершится», и `finish1` встанет в конец очереди — уже **после** `item2`. Дальше выполняется `item2` → `Task2`, затем `finish1`, затем `finish2`. Отменить можно только задачу, которая ещё не начала выполняться; уже бегущую `cancel()` не остановит — внутри нужно проверять `isCancelled`.

</details>

**Отложенный запуск** — `asyncAfter`:

```swift
let item = DispatchWorkItem { print("Поиск по запросу") }
DispatchQueue.main.asyncAfter(deadline: .now() + 0.5, execute: item)
// если пользователь продолжил печатать — отменяем и планируем заново (debounce)
item.cancel()
```

## Шаг 9. DispatchGroup — дождаться набора задач

`DispatchGroup` объединяет несколько задач (даже в **разных** очередях) в группу и позволяет узнать, когда **все** они завершились.

**Способ 1 — `async(group:)`**, когда задача сама по себе синхронна:

```swift
let group = DispatchGroup()
let globalDefault = DispatchQueue.global()

for i in 0..<5 {
    globalDefault.async(group: group) {
        sleep(UInt32(i))
        print("Group async on globalDefault: \(i)")
    }
}

group.notify(queue: .main) {
    print("Все задачи завершены")      // не блокирует
}
```

**Способ 2 — `enter()` / `leave()`**, когда внутри задачи есть своя асинхронность (сеть, колбэки). `async(group:)` не умеет отследить окончание колбэка, поэтому используем счётчик вручную:

```swift
let group = DispatchGroup()

group.enter()
service.loadPhotos { _ in
    group.leave()
}

group.enter()
service.loadMessages { _ in
    group.leave()
}

group.notify(queue: .main) {
    print("All data loaded")
}
```

Пример с собеседования «Зачем нужна DispatchGroup?»:

```swift
let group = DispatchGroup()

func downloadImages() {
    for i in 0..<5 {
        group.enter()
        print("Image download start - \(i)")
        DispatchQueue.global().async {
            sleep(1)
            print("Image downloaded - \(i)")
            group.leave()
        }
    }
    group.notify(queue: DispatchQueue.global()) {
        print("All images are downloaded.")
    }
}
// Image download start - 0 … 4   (сразу, по порядку)
// Image downloaded - …           (через ~1 с, в произвольном порядке)
// All images are downloaded.     (последним)
```

![Диаграмма последовательности: Код, DispatchGroup, Фоновые задачи. Код вызывает enter() пять раз, счётчик 5; запускает 5 загрузок; подписывается через notify(queue:). Фоновые задачи пять раз вызывают leave(), счётчик убывает 4, 3, 2, 1, 0. Затем DispatchGroup вызывает блок notify в коде.](../../../../assets/tutorials/concurrency/02-dispatch-group.svg)

**notify vs wait:**

- `group.notify(queue:)` — **не блокирует**, выполнит блок на указанной очереди, когда счётчик станет 0.
- `group.wait()` — **блокирует текущий поток**, пока задачи не закончатся. Можно с таймаутом: `group.wait(timeout: .now() + 5)`.

> Вызовов `leave()` должно быть **ровно столько же**, сколько `enter()`. Лишний `leave()` → краш. Недостающий → `notify` не вызовется никогда. Никогда не вызывайте `group.wait()` на главном потоке.

## Шаг 10. Другие инструменты GCD

| Инструмент | Что делает | Подробно |
| --- | --- | --- |
| `DispatchSemaphore` | Ограничивает количество потоков, которые одновременно обращаются к ресурсу | [тутор 04](../thread-safety-synchronization/) |
| Dispatch Barrier (`flags: .barrier`) | На время выполнения задачи превращает concurrent-очередь в serial | [тутор 04](../thread-safety-synchronization/) |
| `concurrentPerform(iterations:execute:)` | Параллельный цикл: раскидывает итерации по ядрам и ждёт их завершения | ниже |
| `DispatchSource` | Слушает системные события: таймеры, файловую систему, сигналы | ниже |

Параллельный цикл:

```swift
let images: [UIImage] = loadAll()
var thumbnails = [UIImage?](repeating: nil, count: images.count)
let lock = NSLock()

DispatchQueue.concurrentPerform(iterations: images.count) { index in
    let thumb = makeThumbnail(images[index])   // тяжёлая работа — параллельно
    lock.lock(); thumbnails[index] = thumb; lock.unlock()
}
// сюда попадём, когда все итерации закончатся (вызов синхронный)
```

Таймер на DispatchSource (не зависит от RunLoop, в отличие от Timer — см. [тутор 07](../runloop/)):

```swift
let timer = DispatchSource.makeTimerSource(queue: .global(qos: .utility))
timer.schedule(deadline: .now(), repeating: .seconds(1))
timer.setEventHandler { print("tick") }
timer.resume()
// timer.cancel() — остановить
```

## Шаг 11. Правила безопасной работы с GCD

Очереди сами по себе потокобезопасны, но важно помнить:

1. **Избегайте `sync`** на очередях — это главный источник дедлоков. Никогда не вызывайте `DispatchQueue.main.sync` с главного потока.
2. **Избегайте захвата блокировок** внутри DispatchWorkItem — блокирующие задачи заставляют GCD создавать новые потоки (thread explosion).
3. **Race condition всё ещё с нами** — GCD не защищает ваши данные автоматически.

## Шаг 12. GCD или OperationQueue?

| Возможность | GCD | OperationQueue |
| --- | --- | --- |
| Дождаться завершения всех задач | да — DispatchGroup | да — `waitUntilAllOperationsAreFinished`, но не блокируйте main queue! |
| Зависимости между задачами | Только цепочки на одной serial-очереди или вложенные колбэки | да — `addDependency` |
| Барьер | да — `.barrier` | Возможно (`addBarrierBlock`), но запутаннее |
| Отменить все задачи | Только по одному DispatchWorkItem | да — `cancelAllOperations()` |
| Ограничить число одновременных задач | Через семафор | да — `maxConcurrentOperationCount` |

## Типичные ошибки

- `DispatchQueue.main.sync { }` с главного потока → **deadlock** (подробно в [туторе 03](../concurrency-problems/)).
- `serialQueue.sync { }` изнутри задачи этой же `serialQueue` → deadlock.
- Обновление UI внутри `DispatchQueue.global().async` без перехода на main.
- Несбалансированные `enter()` / `leave()` в группе.
- `group.wait()` или `semaphore.wait()` на главном потоке → фриз.
- Ожидание, что задачи в concurrent-очереди **завершатся** в порядке добавления.
- Сотни блокирующих задач в global-очереди → thread explosion.

<details>
<summary>Нужно ли писать [weak self] в замыканиях GCD?</summary>

Цикла удержания (retain cycle) не будет: очередь держит замыкание только до его выполнения, а `self` не хранит очередь-замыкание. Поэтому `[weak self]` не обязателен для отсутствия утечки. Но он полезен, если не нужно продлевать жизнь объекта: например, экран закрыли, и результат фоновой задачи ему уже не нужен.

</details>

## Шпаргалка

```swift
// Очереди
DispatchQueue.main                                    // serial, UI
DispatchQueue.global(qos: .utility)                   // concurrent, системная
DispatchQueue(label: "com.app.serial")                // своя serial
DispatchQueue(label: "com.app.conc", attributes: .concurrent)

// Отправка
queue.async { }                  // не ждём
queue.sync { }                   // ждём (осторожно!)
queue.asyncAfter(deadline: .now() + 1) { }

// Фон → UI
DispatchQueue.global().async { let r = work(); DispatchQueue.main.async { show(r) } }

// WorkItem
let item = DispatchWorkItem(qos: .userInitiated, flags: []) { }
item.notify(queue: .main) { }; item.cancel()

// Group
group.enter(); ...; group.leave()
group.notify(queue: .main) { }   // не блокирует
group.wait()                      // блокирует

// QoS ↓ по убыванию
// userInteractive > userInitiated > default > utility > background (> unspecified)
```

## Вопросы для самопроверки

<details>
<summary>1. Чем serial-очередь отличается от concurrent?</summary>

Serial выполняет одну задачу за раз, строго по порядку. Concurrent стартует задачи по порядку, но может выполнять несколько одновременно на разных потоках, и завершаются они в произвольном порядке.

</details>

<details>
<summary>2. Чем sync отличается от async?</summary>

`sync` блокирует текущий поток до завершения задачи. `async` ставит задачу в очередь и сразу возвращает управление.

</details>

<details>
<summary>3. Что произойдёт при вызове DispatchQueue.main.sync {} в viewDidLoad?</summary>

Deadlock. Главный поток блокируется в ожидании задачи, а задача ждёт, пока главная serial-очередь освободится, — т.е. пока закончится текущая задача на главном потоке. Круг замкнулся.

</details>

<details>
<summary>4. Какие уровни QoS существуют и какой выбрать для загрузки файла с прогресс-баром?</summary>

userInteractive, userInitiated, default, utility, background, unspecified. Для загрузки с прогрессом — `.utility`.

</details>

<details>
<summary>5. Что умеет DispatchWorkItem, чего не умеет обычное замыкание?</summary>

Задать QoS и флаги, уведомить очередь о завершении через `notify`, отменить задачу до начала выполнения через `cancel`, дождаться выполнения через `wait`.

</details>

<details>
<summary>6. Когда использовать enter/leave, а когда async(group:)?</summary>

`async(group:)` — когда задача синхронна внутри замыкания. `enter`/`leave` — когда внутри есть собственная асинхронность (колбэк сети): иначе группа посчитает задачу завершённой раньше времени.

</details>

<details>
<summary>7. Чем group.notify отличается от group.wait?</summary>

`notify` асинхронно вызовет блок на указанной очереди и не блокирует поток; `wait` блокирует текущий поток до завершения всех задач.

</details>

## Источники

- [Grand Central Dispatch, Once and for All — HackerNoon](https://hackernoon.com/grand-central-dispatch-once-and-for-all)
- [Нужно ли писать weak self в Grand Central Dispatch?](https://temofeev.ru/info/articles/nuzhno-li-pisat-weak-self-v-grand-central-dispatch/)
- [Основы многопоточности в iOS — Mad Brains Техно](https://youtu.be/JgUBBoRydoE?list=PLw6SJ6q6-1YowmlGVks5a088XrSbihJu-&t=1496)
