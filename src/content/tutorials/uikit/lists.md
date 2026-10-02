---
title: "Списки: UIScrollView, UITableView, UICollectionView"
order: 8
---

> **Что узнаешь**
>
> - Как устроен `UIScrollView`: `contentSize`, `contentOffset`, inset’ы, layout guides, зум
> - Почему списки не создают по ячейке на каждую строку: механизм reuse и `prepareForReuse`
> - `UITableView`: data source, delegate, высоты ячеек, обновление данных и типичные ошибки
> - `UICollectionView`: layout как отдельный объект, flow layout и compositional layout
> - Diffable data source и snapshot’ы: как сейчас принято обновлять списки
> - Когда брать table, а когда collection

> **Нужно знать заранее:** тутор [01](../uiview-window-coordinates/) — `bounds` и `frame`; тутор [04](../autolayout-constraints/) — constraints и layout guides; тутор [05](../autolayout-layout-pass/) — intrinsic size и self-sizing; туторы [06](../touches-hittest/) и [07](../responder-chain-gestures/) — касания и жесты.

## Аналогия: окно над длинной лентой

Ты смотришь в окошко, где видна только часть очень длинной ленты, и тянешь ленту пальцем.

- **`UIScrollView`** — окошко и лента: окно сдвигается по ленте.
- **Таблица и коллекция** — ленту не печатают целиком. Десяток подносов (ячеек) хватает на всё, что видно в окне. Когда поднос уходит за край окна, его перекладывают на противоположный конец и кладут на нём новое блюдо.
- **Data source** — повар: по номеру позиции готовит содержимое. Главное, что перекладываемый поднос нужно очистить от прошлого блюда.

## Шаг 1. UIScrollView

> **`UIScrollView`** — view, которая позволяет прокручивать и масштабировать содержащиеся в ней view.

По документации Apple, scroll view — это view с **origin, который можно сдвигать по содержимому**. Она обрезает содержимое по своему frame, отслеживает движение пальцев и меняет origin. Сама она ничего не рисует, кроме индикаторов прокрутки. Для того чтобы знать, когда остановиться, ей нужен размер содержимого. По умолчанию она «отскакивает» (bounces), когда прокрутка выходит за границы содержимого.

Связь с тутором [01](../uiview-window-coordinates/): концепция «окно смещается по ленте» реализуется через `bounds.origin` — именно поэтому при прокрутке меняется `bounds`, а `frame` не меняется. Это известный механизм UIKit, но в документации Apple он прямо не формулируется (там говорится только про «origin, смещённый по содержимому»).

**Ключевые свойства:**

| Свойство | Что это |
| --- | --- |
| `contentSize` | Размер содержимого. Для того чтобы прокрутка имела смысл, он должен быть больше размера самой scroll view |
| `contentOffset` | Точка, в которой origin содержимого смещен относительно origin scroll view. Менять: `setContentOffset(_:animated:)` |
| `contentInset` | Твои отступы вокруг содержимого |
| `adjustedContentInset` | Итоговые отступы: `contentInset` плюс safe area (если это разрешено), iOS 11+ |
| `contentInsetAdjustmentBehavior` | Как учитывать safe area в `adjustedContentInset` |
| `isPagingEnabled` | Прокрутка по страницам (галереи, онбординг) |
| `bounces`, `alwaysBounceVertical` | Отскок у края содержимого |
| `isScrollEnabled`, `isDirectionalLockEnabled` | Включена ли прокрутка; блокировка одного направления |
| `showsVerticalScrollIndicator`, `showsHorizontalScrollIndicator` | Индикаторы прокрутки |
| `keyboardDismissMode` | Как скрывать клавиатуру при начале перетаскивания |
| `refreshControl` | Pull-to-refresh (`UIRefreshControl`) |

**Как правильно настроить размер содержимого через Auto Layout.** У scroll view есть два layout guide:

- `frameLayoutGuide` — основан на непреобразованном frame scroll view («окно»);
- `contentLayoutGuide` — основан на несдвинутом прямоугольнике содержимого («лента»).

Применяется так: контентный view привязывают краями к `contentLayoutGuide` (тогда `contentSize` вычисляется из constraints), а его ширину задают равной ширине `frameLayoutGuide` (для вертикальной прокрутки).

```swift
let scrollView = UIScrollView()
scrollView.translatesAutoresizingMaskIntoConstraints = false
view.addSubview(scrollView)

let contentView = UIView()
contentView.translatesAutoresizingMaskIntoConstraints = false
scrollView.addSubview(contentView)

NSLayoutConstraint.activate([
    scrollView.topAnchor.constraint(equalTo: view.topAnchor),
    scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
    scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
    scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),

    // лента: края — к contentLayoutGuide, отсюда берётся contentSize
    contentView.topAnchor.constraint(equalTo: scrollView.contentLayoutGuide.topAnchor),
    contentView.leadingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.leadingAnchor),
    contentView.trailingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.trailingAnchor),
    contentView.bottomAnchor.constraint(equalTo: scrollView.contentLayoutGuide.bottomAnchor),

    // ширина ленты = ширина окна: прокрутка только вертикальная
    contentView.widthAnchor.constraint(equalTo: scrollView.frameLayoutGuide.widthAnchor),
    contentView.heightAnchor.constraint(equalToConstant: 1000)       // или высота из содержимого contentView
])
```

**Зум.** По документации Apple, чтобы зум и panning работали, делегат должен реализовать `viewForZooming(in:)` (какую view масштабировать) и `scrollViewDidEndZooming(_:with:atScale:)`, а `minimumZoomScale` и `maximumZoomScale` — быть разными. Пока жест pinch идёт, scroll view не шлёт подвью tracking-события.

```swift
scrollView.minimumZoomScale = 1
scrollView.maximumZoomScale = 4
scrollView.delegate = self

func viewForZooming(in scrollView: UIScrollView) -> UIView? { imageView }
```

**UIScrollViewDelegate — наиболее частые методы:** `scrollViewDidScroll(_:)` (каждое изменение смещения, вызывается очень часто — без тяжёлой работы), `scrollViewWillBeginDragging(_:)`, `scrollViewDidEndDragging(_:willDecelerate:)`, `scrollViewDidEndDecelerating(_:)`, `scrollViewWillEndDragging(_:withVelocity:targetContentOffset:)`.

Подгрузка следующей страницы (бесконечный список) через `contentOffset`:

```swift
func scrollViewDidScroll(_ scrollView: UIScrollView) {
    let maxOffset = scrollView.contentSize.height - scrollView.bounds.height
    if scrollView.contentOffset.y > maxOffset - 200 {     // до конца меньше 200 pt
        loadNextPageIfNeeded()                            // внутри — защита от повторных запросов
    }
}
```

**Касания внутри scroll view (связь с туторами [06](../touches-hittest/) и [07](../responder-chain-gestures/)).** Apple описывает так: scroll view временно перехватывает touch-down и запускает таймер. Если палец до срабатывания таймера сильно сдвинулся, scroll view отменяет tracking у subview и прокручивает сама. Если не сдвинулся, касания уходят к нажатой subview. Тонкую настройку дают `delaysContentTouches` и `canCancelContentTouches`, а сам прокруточный жест — `panGestureRecognizer` (это обычный `UIPanGestureRecognizer`, его можно использовать для настройки конфликтов жестов).

> `UITableView`, `UICollectionView` и `UITextView` — подклассы `UIScrollView` (по документации Apple). Всё вышеперечисленное — `contentOffset`, inset’ы, делегат прокрутки, pull-to-refresh — работает и у них.

## Шаг 2. Повторное использование ячеек (reuse)

Проблема: в списке может быть 100 000 строк, создать столько view нельзя (память и время). Решение: строить ячейки только для видимых строк и переиспользовать ушедшие за край экрана. Таблица поддерживает очередь готовых к повторному использованию ячеек.

![Ячейка, ушедшая за край экрана, попадает в очередь для reuse. Когда нужна ячейка для новой строки, проверяется, есть ли в очереди ячейка нужного типа: если да, её берут и вызывают prepareForReuse, если нет, создают новую. Затем содержимое настраивается в cellForRowAt.](../../../assets/tutorials/uikit/08-reuse-flow.svg)

- Через **reuse identifier** сообщается «тип» ячейки. Сначала класс или nib регистрируют с этим идентификатором, потом извлекают (dequeue) по нему же.
- У collection view Apple прямо пишет: вместо того чтобы создавать view самому, всегда извлекай её из очереди.
- Тем же образом Apple описывает и саму scroll view: тот, кто управляет отрисовкой содержимого, должен добавлять и удалять subview’ы по мере прокрутки, чтобы их было не слишком много.

## Шаг 3. UITableView

> **`UITableView`** — view, которая показывает данные строками в **одной колонке** с вертикальной прокруткой. Строки можно группировать в секции (plain или grouped стиль).

**Что есть в таблице:**

- **Ячейки** (`UITableViewCell`) — строки. Таблица управляет базовым видом, а ячейки с содержимым поставляет твоё приложение.
- **Секции** с заголовками и подвалами (header/footer, их тоже можно переиспользовать: `dequeueReusableHeaderFooterView`).
- **`dataSource`** (`UITableViewDataSource`) — сколько секций и строк, какие ячейки. Два обязательных метода: `tableView(_:numberOfRowsInSection:)` и `tableView(_:cellForRowAt:)`.
- **`delegate`** (`UITableViewDelegate`) — выбор строк, высоты, заголовки секций, удаление и переупорядочивание.

```swift
final class ListViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    private let tableView = UITableView(frame: .zero, style: .plain)
    private var items: [String] = (0..<20).map { "Row \($0)" }

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(tableView)
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")   // ДО dequeue
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        items.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        var content = cell.defaultContentConfiguration()        // iOS 14+
        content.text = items[indexPath.row]
        cell.contentConfiguration = content                     // вместо cell.textLabel
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        print("Selected:", items[indexPath.row])
    }
}
```

**Правила работы с reuse (по документации Apple):**

- `dequeueReusableCell(withIdentifier:for:)` всегда возвращает валидную ячейку (не `nil`), но идентификатор должен быть **заранее зарегистрирован** (`register` или прототип-ячейка в storyboard).
- Вызывать его нужно **только из `tableView(_:cellForRowAt:)`** и с тем `indexPath`, который пришёл от data source. Для других мест — вариант без `indexPath`.
- Если ячейка была переиспользована, перед возвратом вызывается `prepareForReuse()`; если создаётся новая — `init(style:reuseIdentifier:)` (из класса) или `init(coder:)` (из storyboard или nib).
- **`prepareForReuse()`**: сбрасывай только атрибуты, не связанные с содержимым (alpha, режим редактирования, выделение), чтобы не словить проблем с производительностью. **Содержимое нужно полностью перезаписывать в `cellForRowAt`.** При переопределении обязательно вызывать `super`. Метод не вызывается для `reconfigureRows(at:)`.

**Классическая ошибка reuse — «чужая картинка».** Ячейка запускает асинхронную загрузку картинки, пользователь прокручивает дальше, ячейку переиспользуют для другой строки, и старый запрос позже приносит картинку уже не ей. Решение: отменять задачу в `prepareForReuse` (это не контент) и ставить плейсхолдер в `configure`:

```swift
final class PhotoCell: UITableViewCell {
    private let photoView = UIImageView()
    private var loadTask: Task<Void, Never>?

    override func prepareForReuse() {
        super.prepareForReuse()                  // обязательно
        loadTask?.cancel()                       // старый запрос больше не нужен
        loadTask = nil
    }

    func configure(with item: Item) {
        photoView.image = UIImage(named: "placeholder")   // содержимое всегда перезаписываем здесь
        loadTask = Task { [weak self] in
            let image = await ImageLoader.shared.image(for: item.url)
            guard !Task.isCancelled else { return }
            self?.photoView.image = image
        }
    }
}
```

**Высоты ячеек.** У `rowHeight` по умолчанию значение `UITableView.automaticDimension`: таблица сама выбирает высоту по содержимому ячейки (self-sizing, тутор [05](../autolayout-layout-pass/)). Для саморазмеряющихся ячеек содержимое нужно зафиксировать constraints от верха до низа `contentView`; `estimatedRowHeight` даёт приблизительную высоту, чтобы не считать все ячейки заранее.

**Обновление данных:**

| Метод | Что делает |
| --- | --- |
| `reloadData()` | Перезагружает всё: просто, но без анимации и полная работа для видимых ячеек |
| `insertRows`, `deleteRows`, `moveRow`, `insertSections`... | Точечные изменения с анимацией. Работают только при согласованном data source |
| `performBatchUpdates(_:completion:)` | Применяет несколько insert, delete, reload, move как группу (старый вариант — `beginUpdates` и `endUpdates`) |
| `reloadRows(at:with:)` | Перезагружает строки с анимацией |
| `reconfigureRows(at:)` | Обновляет данные строк, **сохраняя текущие ячейки** (не пересоздаёт, `prepareForReuse` не вызывается) |

Типичный крэш при пошаговых обновлениях: после `insertRows`/`deleteRows` число строк в data source не совпало с ожидаемым («число строк после обновления не совпадает»). Модель нужно менять **до** вызова метода обновления. Diffable data source (шаг 5) убирает этот класс ошибок.

**Другое полезное:** `tableView.prefetchDataSource` (`UITableViewDataSourcePrefetching`) — предупреждение о том, какие данные скоро понадобятся, чтобы запустить долгую работу заранее; `tableHeaderView`/`tableFooterView`; режим редактирования `setEditing(_:animated:)`; `scrollToRow(at:at:animated:)`.

## Шаг 4. UICollectionView

> **`UICollectionView`** — объект, который управляет упорядоченной коллекцией элементов данных и показывает их с помощью настраиваемых раскладок (сетка, список, что угодно). Появился в iOS 6.

**Главное отличие от таблицы:** расположение элементов вынесено в отдельный **layout-объект** (подкласс `UICollectionViewLayout`). По документации Apple, layout определяет организацию и положение всех ячеек и supplementary views, но сам не применяет её к view: это делает коллекция. Layout — «ещё один data source, только визуальный». Его можно менять на лету (`setCollectionViewLayout(_:animated:)`).

- Ячейки (`UICollectionViewCell`) и **supplementary views** (заголовки и подвалы секций, `UICollectionReusableView`): их поддержка задаётся layout’ом.
- Данные: `dataSource` (`UICollectionViewDataSource`) или `UICollectionViewDiffableDataSource`.
- Reuse: `register(_:forCellWithReuseIdentifier:)` и `dequeueReusableCell(withReuseIdentifier:for:)`.
- **Prefetching.** По документации Apple, есть два вида: *cell prefetching* (ячейки готовятся заранее, включён по умолчанию) и *data prefetching* (уведомления о близкой потребности в данных через `prefetchDataSource`; полезно для сетевых запросов).

**Flow layout.** `UICollectionViewFlowLayout` — встроенная раскладка-сетка: `scrollDirection`, `minimumLineSpacing`, `minimumInteritemSpacing`, `sectionInset`, `itemSize`/`estimatedItemSize`; размер ячейки можно задать в `collectionView(_:layout:sizeForItemAt:)` (`UICollectionViewDelegateFlowLayout`).

```swift
final class GridViewController: UIViewController, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {
    private let layout = UICollectionViewFlowLayout()
    private lazy var collectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)

    override func viewDidLoad() {
        super.viewDidLoad()
        layout.scrollDirection = .vertical
        layout.minimumLineSpacing = 10
        layout.minimumInteritemSpacing = 10
        layout.sectionInset = UIEdgeInsets(top: 10, left: 10, bottom: 10, right: 10)

        collectionView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(collectionView)
        NSLayoutConstraint.activate([
            collectionView.topAnchor.constraint(equalTo: view.topAnchor),
            collectionView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            collectionView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            collectionView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        collectionView.register(UICollectionViewCell.self, forCellWithReuseIdentifier: "cell")
        collectionView.dataSource = self
        collectionView.delegate = self
    }

    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int { 20 }

    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "cell", for: indexPath)
        cell.backgroundColor = .systemBlue
        return cell
    }

    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout,
                        sizeForItemAt indexPath: IndexPath) -> CGSize {
        // две колонки: вычитаем реальные отступы и промежуток между ячейками
        let insets = layout.sectionInset
        let spacing = layout.minimumInteritemSpacing
        let available = collectionView.bounds.width - insets.left - insets.right - spacing
        let side = floor(available / 2)                   // floor: без дробных размеров
        return CGSize(width: side, height: side)
    }
}
```

**Compositional layout (iOS 13+).** По документации Apple, это layout, который собирается из малых блоков: **item → group → section → layout**. Item — самая маленькая единица данных, group раскладывает items в ряд, колонку или свою схему, section состоит из groups. Размеры задаются не числами, а «измерениями»: `fractionalWidth`, `fractionalHeight`, `absolute`, `estimated`. Две колонки без никакого `sizeForItemAt`:

```swift
func makeGridLayout() -> UICollectionViewLayout {
    let itemSize = NSCollectionLayoutSize(widthDimension: .fractionalWidth(0.5),
                                          heightDimension: .fractionalHeight(1.0))
    let item = NSCollectionLayoutItem(layoutSize: itemSize)
    item.contentInsets = NSDirectionalEdgeInsets(top: 5, leading: 5, bottom: 5, trailing: 5)

    let groupSize = NSCollectionLayoutSize(widthDimension: .fractionalWidth(1.0),
                                           heightDimension: .fractionalWidth(0.5))   // высота группы = половина ширины → квадратные ячейки
    let group = NSCollectionLayoutGroup.horizontal(layoutSize: groupSize, subitems: [item])

    let section = NSCollectionLayoutSection(group: group)
    return UICollectionViewCompositionalLayout(section: section)
}
```

С iOS 14 есть готовый **list layout**: `UICollectionViewCompositionalLayout.list(using:)` с `UICollectionLayoutListConfiguration`. Это позволяет делать табличные интерфейсы на collection view.

```swift
var config = UICollectionLayoutListConfiguration(appearance: .insetGrouped)
let listLayout = UICollectionViewCompositionalLayout.list(using: config)
```

**Cell registration (iOS 14+).** Вместо строковых reuse identifiers — типобезопасная `UICollectionView.CellRegistration`: вся настройка типа ячейки в одном месте, без `register` и без приведения типов (по документации — `dequeueConfiguredReusableCell(using:for:item:)`).

## Шаг 5. Diffable data source

Классический подход (`numberOfRows` + `insertRows`) требует вручную синхронизировать модель и таблицу, отсюда крэши. **Diffable data source** (iOS 13+) убирает проблему: ты говоришь, каким должно быть состояние, а он сам вычисляет разницу и анимирует изменения.

- **Snapshot** (`NSDiffableDataSourceSnapshot`) — снимок состояния: список секций и элементов в них, заданные **идентификаторами**.
- Идентификаторы секций и элементов должны быть **уникальными и `Hashable`** (Apple).
- `apply(_:animatingDifferences:)` применяет снимок. Вычисление разницы — операция O(n) по числу элементов в снимке (Apple). До iOS 15 `animatingDifferences: false` фактически было `reloadData`, с iOS 15 снапшот всегда применяется как разница (WWDC21).
- **Храни в data source идентификаторы элементов, а не сами модели** (рекомендация WWDC21). Если идентификатором станет вся структура `Hashable`, изменение любого поля делает её «другой»: старый элемент удаляется, новый добавляется. Полезнее стабильный `id`, а содержимое брать из модели по этому `id`.
- После настройки с diffable data source не меняй `tableView.dataSource` (предупреждение в документации к `UITableViewDiffableDataSource`).

```swift
enum Section { case main }

struct Item: Identifiable {
    let id: UUID
    var title: String
}

final class DiffableListViewController: UIViewController {
    private var itemsByID: [Item.ID: Item] = [:]
    private var dataSource: UITableViewDiffableDataSource<Section, Item.ID>!
    private let tableView = UITableView(frame: .zero, style: .plain)

    override func viewDidLoad() {
        super.viewDidLoad()
        // ... добавить tableView и закрепить constraints, зарегистрировать ячейку "cell"

        dataSource = UITableViewDiffableDataSource<Section, Item.ID>(tableView: tableView) {
            [weak self] tableView, indexPath, id in
            let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
            var content = cell.defaultContentConfiguration()
            content.text = self?.itemsByID[id]?.title
            cell.contentConfiguration = content
            return cell
        }
    }

    func show(_ items: [Item]) {
        itemsByID = Dictionary(uniqueKeysWithValues: items.map { ($0.id, $0) })

        var snapshot = NSDiffableDataSourceSnapshot<Section, Item.ID>()
        snapshot.appendSections([.main])
        snapshot.appendItems(items.map(\.id))
        dataSource.apply(snapshot, animatingDifferences: true)       // дифф считается сам
    }

    // заголовок элемента изменился, id тот же: обновляем текущую ячейку без пересоздания
    func update(_ item: Item) {
        itemsByID[item.id] = item
        var snapshot = dataSource.snapshot()
        snapshot.reconfigureItems([item.id])                         // iOS 15+
        dataSource.apply(snapshot, animatingDifferences: false)
    }
}
```

Для `UICollectionView` работает то же самое с `UICollectionViewDiffableDataSource` и cell registration:

```swift
let registration = UICollectionView.CellRegistration<UICollectionViewListCell, Item.ID> { [weak self] cell, indexPath, id in
    var content = cell.defaultContentConfiguration()
    content.text = self?.itemsByID[id]?.title
    cell.contentConfiguration = content
}

dataSource = UICollectionViewDiffableDataSource<Section, Item.ID>(collectionView: collectionView) {
    collectionView, indexPath, id in
    collectionView.dequeueConfiguredReusableCell(using: registration, for: indexPath, item: id)
}
```

## Шаг 6. Что выбрать

| Задача | Инструмент |
| --- | --- |
| Одна длинная прокручиваемая форма из нескольких блоков | `UIScrollView` плюс `contentLayoutGuide` (или `UIStackView` внутри) |
| Простой вертикальный список, настройки, секции | `UITableView` (или list layout в collection view) |
| Сетка, горизонтальные карусели, разные секции с разной раскладкой | `UICollectionView` плюс compositional layout |
| Нестандартная раскладка | Свой подкласс `UICollectionViewLayout` |
| Частые обновления данных без крэшей | Diffable data source + snapshot |
| Тяжёлые данные с сети, картинки | Prefetching (тутор [10](../ui-performance/)) |

## Типичные ошибки

- Не зарегистрировать ячейку перед `dequeueReusableCell`: крэш.
- Создавать ячейку вручную в `cellForRowAt` вместо dequeue: теряется reuse, память и плавность.
- Не перезаписывать весь контент ячейки в `cellForRowAt`: остаётся чужой текст, картинка, цвет, чекбокс.
- Делать тяжёлую работу в `prepareForReuse` и сбрасывать в нём содержимое (Apple: только не связанные с контентом атрибуты), или забыть `super.prepareForReuse()`.
- Не отменять асинхронную загрузку картинки при reuse: картинка попадёт не в ту ячейку.
- Дёргать `tableView.cellForRow(at:)` и надеяться, что ячейка есть: для невидимой строки вернётся `nil`. Храни состояние в модели, а не в ячейке.
- Реализовать `heightForRowAt` без нужды: таблица будет спрашивать высоту у каждой строки.
- Менять модель после `insertRows`/`deleteRows` или не согласовать количество строк: крэш.
- Делать тяжёлую работу в `scrollViewDidScroll`: он вызывается при каждом смещении.
- Дублировать safe area в `contentInset` вручную: она уже входит в `adjustedContentInset`.
- Формировать размер ячейки с магическими числами без учёта `sectionInset` и промежутков и без `floor`.
- Делать идентификатором в diffable data source всю модель, содержимое которой меняется: вместо обновления будет удаление и вставка.
- Неуникальные идентификаторы в snapshot: нарушение требования Apple.

<details>
<summary>Для чего нужен reconfigureRows (reconfigureItems), если есть reloadRows?</summary>

`reloadRows` заменяет ячейку: обычно берёт другую из очереди (с `prepareForReuse`). `reconfigureRows` оставляет существующую ячейку и просто обновляет её данные: дешевле, и состояние ячейки (например, фокус, анимация) не сбрасывается. По документации Apple, `prepareForReuse` для неё не вызывается.

</details>

## Шпаргалка

```swift
// UIScrollView
scrollView.contentSize / contentOffset / setContentOffset(_:animated:)
scrollView.contentInset                         // твои отступы
scrollView.adjustedContentInset                 // contentInset + safe area (iOS 11+)
contentView.top/leading/trailing/bottom == scrollView.contentLayoutGuide...
contentView.width == scrollView.frameLayoutGuide.width     // вертикальная прокрутка
// зум: viewForZooming + min != max

// UITableView
tableView.register(Cell.self, forCellReuseIdentifier: id)   // ДО dequeue
tableView.dequeueReusableCell(withIdentifier: id, for: indexPath)   // только в cellForRowAt
cell.prepareForReuse()        // сброс не контента; super обязательно; контент — в cellForRowAt
tableView.rowHeight = UITableView.automaticDimension      // по умолчанию; heightForRowAt отключает это
reloadData / reloadRows / reconfigureRows / performBatchUpdates

// UICollectionView
layout = FlowLayout | CompositionalLayout | custom
register / dequeueReusableCell(withReuseIdentifier:for:)   // или CellRegistration (iOS 14)
item -> group -> section -> layout; fractionalWidth / absolute / estimated
UICollectionViewCompositionalLayout.list(using:)

// Diffable
NSDiffableDataSourceSnapshot<Section, ID>   // уникальные Hashable id, а не модели
dataSource.apply(snapshot, animatingDifferences: true)
snapshot.reconfigureItems([id])             // iOS 15
```

## Вопросы для самопроверки

<details>
<summary>1. Как устроена прокрутка в UIScrollView? Что такое contentSize и contentOffset?</summary>

Scroll view — это «окно», origin которого сдвигается по содержимому (на практике — через `bounds.origin`). `contentSize` — размер содержимого, `contentOffset` — смещение origin содержимого относительно origin scroll view.

</details>

<details>
<summary>2. Чем contentInset отличается от adjustedContentInset?</summary>

`contentInset` — твои отступы. `adjustedContentInset` — итоговые: `contentInset` плюс safe area (если разрешено `contentInsetAdjustmentBehavior`), iOS 11+.

</details>

<details>
<summary>3. Зачем в таблицах и коллекциях нужен reuse ячеек? Как он работает?</summary>

Создавать view на каждую строку дорого. Ячейки, ушедшие за край экрана, кладутся в очередь по reuse identifier; для новой строки `dequeue` берёт оттуда ячейку (с `prepareForReuse`) или создаёт новую. Содержимое полностью перезаписывается в `cellForRowAt`.

</details>

<details>
<summary>4. Что можно и нельзя делать в prepareForReuse?</summary>

Сбрасывать атрибуты, не связанные с содержимым (alpha, режим редактирования, выделение) и отменять ненужные задачи (загрузку картинки). Содержимое перезаписывать в `cellForRowAt`, вызвать `super`.

</details>

<details>
<summary>5. Чем отличаются UITableView и UICollectionView? Когда что брать?</summary>

Table — одна колонка строк, простой список. Collection — раскладка вынесена в layout-объект, поэтому можно сетки, карусели, разные секции; с iOS 14 списки тоже (list layout). Оба — подклассы `UIScrollView`.

</details>

<details>
<summary>6. Как устроен compositional layout?</summary>

Item → group → section → layout. Размеры — через измерения: `fractionalWidth`, `fractionalHeight`, `absolute`, `estimated`. Группа раскладывает items горизонтально, вертикально или по-своему.

</details>

<details>
<summary>7. Что такое diffable data source и почему в нём хранят идентификаторы?</summary>

Ты передаёшь snapshot желаемого состояния, data source сам вычисляет разницу (O(n)) и анимирует. Идентификаторы должны быть уникальными и `Hashable`. Хранят их, а не модели, чтобы изменение поля модели не превращалось в «удалить старый и вставить новый»; для обновления содержимого — `reconfigureItems` (iOS 15).

</details>

## Источники

- [UIScrollView — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uiscrollview)
- [adjustedContentInset — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uiscrollview/adjustedcontentinset)
- [UITableView — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uitableview)
- [dequeueReusableCell — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uitableview/dequeuereusablecell(withidentifier:for:))
- [prepareForReuse — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uitableviewcell/prepareforreuse())
- [rowHeight — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uitableview/rowheight)
- [textLabel — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uitableviewcell/textlabel)
- [UICollectionView — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uicollectionview)
- [UICollectionViewCompositionalLayout — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uicollectionviewcompositionallayout)
- [UITableViewDiffableDataSource — Apple Developer Documentation](https://developer.apple.com/documentation/uikit/uitableviewdiffabledatasource-2euir)
- [Make blazing fast lists and collection views — WWDC21 (Apple)](https://developer.apple.com/videos/play/wwdc2021/10252/)
- [Diffable data source behavior changes and reconfiguring cells in iOS 15 — Jesse Squires](https://www.jessesquires.com/blog/2021/07/08/diffable-data-source-behavior-changes-and-reconfiguring-cells-in-ios-15/)
- [Гайд по UICollectionView и UITableView — Mad Brains Техно, YouTube](https://www.youtube.com/watch?v=dPYi4c2bPpw&list=PLw6SJ6q6-1YowmlGVks5a088XrSbihJu-&index=16)
- [NSDiffableDataSource vs RxDataSources — Mad Brains Техно, YouTube](https://www.youtube.com/watch?v=vquSNnKFkUE&list=PLw6SJ6q6-1YowmlGVks5a088XrSbihJu-&index=24)
- [Сложные отображения коллекций в iOS на примере ленты ВКонтакте — Habr](https://habr.com/ru/companies/vk/articles/481626/)
