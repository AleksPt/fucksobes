---
title: "Lists: UIScrollView, UITableView, UICollectionView"
order: 8
---

> **What you'll learn**
>
> - How `UIScrollView` works: `contentSize`, `contentOffset`, insets, layout guides, zoom
> - Why lists don't create a cell for every row: the reuse mechanism and `prepareForReuse`
> - `UITableView`: data source, delegate, cell heights, data updates and typical mistakes
> - `UICollectionView`: the layout as a separate object, flow layout and compositional layout
> - Diffable data source and snapshots: how lists are updated nowadays
> - When to pick table and when collection

> **Prerequisites:** tutorial [01](../uiview-window-coordinates/) — `bounds` and `frame`; tutorial [04](../autolayout-constraints/) — constraints and layout guides; tutorial [05](../autolayout-layout-pass/) — intrinsic size and self-sizing; tutorials [06](../touches-hittest/) and [07](../responder-chain-gestures/) — touches and gestures.

## Analogy: a window over a long ribbon

You look through a little window where only a part of a very long ribbon is visible, and you pull the ribbon with a finger.

- **`UIScrollView`** is the window and the ribbon: the window slides along the ribbon.
- **Table and collection** — the ribbon isn't printed in full. A dozen trays (cells) is enough for everything visible in the window. When a tray goes past the edge of the window, it is moved to the opposite end and a new dish is put on it.
- **Data source** is the cook: prepares the contents by position number. The main thing is that a tray being moved must be cleared of the previous dish.

## Step 1. UIScrollView

> **`UIScrollView`** is a view that allows the content views it contains to be scrolled and zoomed.

Per Apple's documentation, a scroll view is a view with an **origin that can be shifted across the content**. It clips the content to its frame, tracks finger movement and changes the origin. By itself it draws nothing except the scroll indicators. To know when to stop, it needs the size of the content. By default it "bounces" when scrolling goes past the content's edges.

The link with tutorial [01](../uiview-window-coordinates/): the "the window slides along the ribbon" concept is implemented through `bounds.origin` — which is exactly why `bounds` changes during scrolling while `frame` doesn't. This is a well-known UIKit mechanism, but Apple's documentation doesn't state it directly (it only talks about an "origin shifted across the content").

**Key properties:**

| Property | What it is |
| --- | --- |
| `contentSize` | The size of the content. For scrolling to make sense it must be larger than the scroll view itself |
| `contentOffset` | The point at which the content's origin is offset from the scroll view's origin. To change: `setContentOffset(_:animated:)` |
| `contentInset` | Your insets around the content |
| `adjustedContentInset` | The resulting insets: `contentInset` plus the safe area (if allowed), iOS 11+ |
| `contentInsetAdjustmentBehavior` | How to account for the safe area in `adjustedContentInset` |
| `isPagingEnabled` | Scrolling by pages (galleries, onboarding) |
| `bounces`, `alwaysBounceVertical` | Bounce at the content's edge |
| `isScrollEnabled`, `isDirectionalLockEnabled` | Whether scrolling is enabled; locking one direction |
| `showsVerticalScrollIndicator`, `showsHorizontalScrollIndicator` | Scroll indicators |
| `keyboardDismissMode` | How to dismiss the keyboard when dragging begins |
| `refreshControl` | Pull-to-refresh (`UIRefreshControl`) |

**How to set up the content size properly with Auto Layout.** A scroll view has two layout guides:

- `frameLayoutGuide` — based on the scroll view's untransformed frame (the "window");
- `contentLayoutGuide` — based on the unshifted content rectangle (the "ribbon").

It is used like this: the content view is pinned by its edges to `contentLayoutGuide` (then `contentSize` is computed from the constraints), and its width is set equal to the width of `frameLayoutGuide` (for vertical scrolling).

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

    // the ribbon: edges to contentLayoutGuide, contentSize is taken from here
    contentView.topAnchor.constraint(equalTo: scrollView.contentLayoutGuide.topAnchor),
    contentView.leadingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.leadingAnchor),
    contentView.trailingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.trailingAnchor),
    contentView.bottomAnchor.constraint(equalTo: scrollView.contentLayoutGuide.bottomAnchor),

    // ribbon width = window width: only vertical scrolling
    contentView.widthAnchor.constraint(equalTo: scrollView.frameLayoutGuide.widthAnchor),
    contentView.heightAnchor.constraint(equalToConstant: 1000)       // or the height from contentView's content
])
```

**Zoom.** Per Apple's documentation, for zooming and panning to work, the delegate must implement `viewForZooming(in:)` (which view to scale) and `scrollViewDidEndZooming(_:with:atScale:)`, and `minimumZoomScale` and `maximumZoomScale` must be different. While a pinch gesture is in progress, the scroll view doesn't send tracking events to the subview.

```swift
scrollView.minimumZoomScale = 1
scrollView.maximumZoomScale = 4
scrollView.delegate = self

func viewForZooming(in scrollView: UIScrollView) -> UIView? { imageView }
```

**UIScrollViewDelegate — the most common methods:** `scrollViewDidScroll(_:)` (every offset change, called very often — no heavy work), `scrollViewWillBeginDragging(_:)`, `scrollViewDidEndDragging(_:willDecelerate:)`, `scrollViewDidEndDecelerating(_:)`, `scrollViewWillEndDragging(_:withVelocity:targetContentOffset:)`.

Loading the next page (an infinite list) via `contentOffset`:

```swift
func scrollViewDidScroll(_ scrollView: UIScrollView) {
    let maxOffset = scrollView.contentSize.height - scrollView.bounds.height
    if scrollView.contentOffset.y > maxOffset - 200 {     // less than 200 pt to the end
        loadNextPageIfNeeded()                            // inside — protection against repeated requests
    }
}
```

**Touches inside a scroll view (the link with tutorials [06](../touches-hittest/) and [07](../responder-chain-gestures/)).** Apple describes it like this: the scroll view temporarily intercepts touch-down and starts a timer. If the finger moved significantly before the timer fired, the scroll view cancels tracking in the subview and scrolls by itself. If it didn't move, the touches go to the pressed subview. Fine-tuning is provided by `delaysContentTouches` and `canCancelContentTouches`, and the scrolling gesture itself is `panGestureRecognizer` (an ordinary `UIPanGestureRecognizer`; it can be used to configure gesture conflicts).

> `UITableView`, `UICollectionView` and `UITextView` are subclasses of `UIScrollView` (per Apple's documentation). Everything listed above — `contentOffset`, insets, the scroll delegate, pull-to-refresh — works for them too.

## Step 2. Cell reuse

The problem: a list can have 100,000 rows, and you can't create that many views (memory and time). The solution: build cells only for visible rows and reuse those that have gone off the edge of the screen. The table maintains a queue of cells ready for reuse.

![A cell that went off the screen edge goes into the reuse queue. When a cell is needed for a new row, it checks whether the queue has a cell of the needed type: if so, it is taken and prepareForReuse is called, if not, a new one is created. Then the content is configured in cellForRowAt.](../../../../assets/tutorials/en/uikit/08-reuse-flow.svg)

- The cell's "type" is communicated through the **reuse identifier**. First the class or nib is registered with this identifier, then cells are dequeued by the same identifier.
- For a collection view Apple writes directly: instead of creating a view yourself, always dequeue it.
- Apple describes the scroll view itself in the same way: whoever manages the drawing of the content should add and remove subviews as scrolling goes on, so that there aren't too many of them.

## Step 3. UITableView

> **`UITableView`** is a view that displays data in rows in a **single column** with vertical scrolling. Rows can be grouped into sections (plain or grouped style).

**What a table has:**

- **Cells** (`UITableViewCell`) — the rows. The table manages the basic look, while your app supplies the cells with content.
- **Sections** with headers and footers (they can also be reused: `dequeueReusableHeaderFooterView`).
- **`dataSource`** (`UITableViewDataSource`) — how many sections and rows, which cells. Two required methods: `tableView(_:numberOfRowsInSection:)` and `tableView(_:cellForRowAt:)`.
- **`delegate`** (`UITableViewDelegate`) — row selection, heights, section headers, deletion and reordering.

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
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")   // BEFORE dequeue
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        items.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        var content = cell.defaultContentConfiguration()        // iOS 14+
        content.text = items[indexPath.row]
        cell.contentConfiguration = content                     // instead of cell.textLabel
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        print("Selected:", items[indexPath.row])
    }
}
```

**Rules for working with reuse (per Apple's documentation):**

- `dequeueReusableCell(withIdentifier:for:)` always returns a valid cell (not `nil`), but the identifier must be **registered in advance** (`register` or a prototype cell in the storyboard).
- It must be called **only from `tableView(_:cellForRowAt:)`** and with the `indexPath` that came from the data source. For other places there is a variant without `indexPath`.
- If a cell was reused, `prepareForReuse()` is called before it is returned; if a new one is created — `init(style:reuseIdentifier:)` (from a class) or `init(coder:)` (from a storyboard or nib).
- **`prepareForReuse()`**: reset only attributes unrelated to the content (alpha, editing mode, selection), so as not to run into performance problems. **The content must be fully overwritten in `cellForRowAt`.** When overriding, be sure to call `super`. The method is not called for `reconfigureRows(at:)`.

**The classic reuse mistake — "someone else's picture".** A cell starts an asynchronous image load, the user scrolls further, the cell is reused for another row, and the old request later brings the image to a cell that no longer owns it. The solution: cancel the task in `prepareForReuse` (it isn't content) and set a placeholder in `configure`:

```swift
final class PhotoCell: UITableViewCell {
    private let photoView = UIImageView()
    private var loadTask: Task<Void, Never>?

    override func prepareForReuse() {
        super.prepareForReuse()                  // required
        loadTask?.cancel()                       // the old request is no longer needed
        loadTask = nil
    }

    func configure(with item: Item) {
        photoView.image = UIImage(named: "placeholder")   // we always overwrite the content here
        loadTask = Task { [weak self] in
            let image = await ImageLoader.shared.image(for: item.url)
            guard !Task.isCancelled else { return }
            self?.photoView.image = image
        }
    }
}
```

**Cell heights.** `rowHeight` defaults to `UITableView.automaticDimension`: the table picks the height from the cell's content by itself (self-sizing, tutorial [05](../autolayout-layout-pass/)). For self-sizing cells the content must be pinned with constraints from the top to the bottom of `contentView`; `estimatedRowHeight` gives an approximate height so that not all cells have to be computed in advance.

**Updating data:**

| Method | What it does |
| --- | --- |
| `reloadData()` | Reloads everything: simple, but without animation and with full work for visible cells |
| `insertRows`, `deleteRows`, `moveRow`, `insertSections`... | Targeted changes with animation. They work only with a consistent data source |
| `performBatchUpdates(_:completion:)` | Applies several inserts, deletes, reloads, moves as a group (the old variant is `beginUpdates` and `endUpdates`) |
| `reloadRows(at:with:)` | Reloads rows with animation |
| `reconfigureRows(at:)` | Updates the rows' data, **keeping the current cells** (doesn't recreate them, `prepareForReuse` isn't called) |

A typical crash with step-by-step updates: after `insertRows`/`deleteRows` the number of rows in the data source didn't match the expected one ("the number of rows after the update doesn't match"). The model must be changed **before** calling the update method. A diffable data source (step 5) removes this class of errors.

**Other useful things:** `tableView.prefetchDataSource` (`UITableViewDataSourcePrefetching`) — a heads-up about which data will be needed soon so that long work can be started ahead of time; `tableHeaderView`/`tableFooterView`; editing mode `setEditing(_:animated:)`; `scrollToRow(at:at:animated:)`.

## Step 4. UICollectionView

> **`UICollectionView`** is an object that manages an ordered collection of data items and presents them using customizable layouts (a grid, a list, anything). It appeared in iOS 6.

**The main difference from the table:** the placement of items is moved into a separate **layout object** (a subclass of `UICollectionViewLayout`). Per Apple's documentation, the layout defines the organization and position of all cells and supplementary views, but doesn't apply it to the views itself: the collection does that. A layout is "another data source, only a visual one". It can be changed on the fly (`setCollectionViewLayout(_:animated:)`).

- Cells (`UICollectionViewCell`) and **supplementary views** (section headers and footers, `UICollectionReusableView`): their support is defined by the layout.
- Data: `dataSource` (`UICollectionViewDataSource`) or `UICollectionViewDiffableDataSource`.
- Reuse: `register(_:forCellWithReuseIdentifier:)` and `dequeueReusableCell(withReuseIdentifier:for:)`.
- **Prefetching.** Per Apple's documentation, there are two kinds: *cell prefetching* (cells are prepared ahead of time, on by default) and *data prefetching* (notifications that data is needed soon, via `prefetchDataSource`; useful for network requests).

**Flow layout.** `UICollectionViewFlowLayout` is the built-in grid layout: `scrollDirection`, `minimumLineSpacing`, `minimumInteritemSpacing`, `sectionInset`, `itemSize`/`estimatedItemSize`; a cell's size can be set in `collectionView(_:layout:sizeForItemAt:)` (`UICollectionViewDelegateFlowLayout`).

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
        // two columns: subtract the real insets and the gap between cells
        let insets = layout.sectionInset
        let spacing = layout.minimumInteritemSpacing
        let available = collectionView.bounds.width - insets.left - insets.right - spacing
        let side = floor(available / 2)                   // floor: no fractional sizes
        return CGSize(width: side, height: side)
    }
}
```

**Compositional layout (iOS 13+).** Per Apple's documentation, this is a layout assembled from small building blocks: **item → group → section → layout**. An item is the smallest unit of data, a group arranges items into a row, a column or its own scheme, a section consists of groups. Sizes are set not with numbers but with "dimensions": `fractionalWidth`, `fractionalHeight`, `absolute`, `estimated`. Two columns without any `sizeForItemAt`:

```swift
func makeGridLayout() -> UICollectionViewLayout {
    let itemSize = NSCollectionLayoutSize(widthDimension: .fractionalWidth(0.5),
                                          heightDimension: .fractionalHeight(1.0))
    let item = NSCollectionLayoutItem(layoutSize: itemSize)
    item.contentInsets = NSDirectionalEdgeInsets(top: 5, leading: 5, bottom: 5, trailing: 5)

    let groupSize = NSCollectionLayoutSize(widthDimension: .fractionalWidth(1.0),
                                           heightDimension: .fractionalWidth(0.5))   // the group's height = half the width → square cells
    let group = NSCollectionLayoutGroup.horizontal(layoutSize: groupSize, subitems: [item])

    let section = NSCollectionLayoutSection(group: group)
    return UICollectionViewCompositionalLayout(section: section)
}
```

Since iOS 14 there is a ready-made **list layout**: `UICollectionViewCompositionalLayout.list(using:)` with `UICollectionLayoutListConfiguration`. This makes it possible to build table-like interfaces on a collection view.

```swift
var config = UICollectionLayoutListConfiguration(appearance: .insetGrouped)
let listLayout = UICollectionViewCompositionalLayout.list(using: config)
```

**Cell registration (iOS 14+).** Instead of string reuse identifiers — the type-safe `UICollectionView.CellRegistration`: all the configuration of a cell type in one place, without `register` and without type casts (per the documentation — `dequeueConfiguredReusableCell(using:for:item:)`).

## Step 5. Diffable data source

The classic approach (`numberOfRows` + `insertRows`) requires synchronizing the model and the table by hand, hence the crashes. **Diffable data source** (iOS 13+) removes the problem: you say what the state should be, and it computes the difference itself and animates the changes.

- **Snapshot** (`NSDiffableDataSourceSnapshot`) is a snapshot of the state: a list of sections and the items in them, given by **identifiers**.
- Section and item identifiers must be **unique and `Hashable`** (Apple).
- `apply(_:animatingDifferences:)` applies a snapshot. Computing the difference is an O(n) operation in the number of items in the snapshot (Apple). Before iOS 15, `animatingDifferences: false` was effectively `reloadData`; since iOS 15 a snapshot is always applied as a diff (WWDC21).
- **Store item identifiers in the data source, not the models themselves** (a WWDC21 recommendation). If the whole `Hashable` struct becomes the identifier, changing any field makes it "different": the old item is deleted and a new one added. A stable `id` is more useful, with the content taken from the model by that `id`.
- After setting up with a diffable data source, don't change `tableView.dataSource` (a warning in the `UITableViewDiffableDataSource` documentation).

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
        // ... add the tableView and pin its constraints, register the "cell" cell

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
        dataSource.apply(snapshot, animatingDifferences: true)       // the diff is computed automatically
    }

    // the item's title changed, the id is the same: update the current cell without recreating it
    func update(_ item: Item) {
        itemsByID[item.id] = item
        var snapshot = dataSource.snapshot()
        snapshot.reconfigureItems([item.id])                         // iOS 15+
        dataSource.apply(snapshot, animatingDifferences: false)
    }
}
```

For `UICollectionView` the same works with `UICollectionViewDiffableDataSource` and cell registration:

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

## Step 6. What to choose

| Task | Tool |
| --- | --- |
| One long scrollable form made of several blocks | `UIScrollView` plus `contentLayoutGuide` (or a `UIStackView` inside) |
| A simple vertical list, settings, sections | `UITableView` (or a list layout in a collection view) |
| A grid, horizontal carousels, different sections with different layouts | `UICollectionView` plus compositional layout |
| A non-standard layout | Your own `UICollectionViewLayout` subclass |
| Frequent data updates without crashes | Diffable data source + snapshot |
| Heavy data from the network, images | Prefetching (tutorial [10](../ui-performance/)) |

## Common mistakes

- Not registering a cell before `dequeueReusableCell`: a crash.
- Creating a cell manually in `cellForRowAt` instead of dequeuing: reuse is lost, and with it memory and smoothness.
- Not overwriting the whole cell content in `cellForRowAt`: someone else's text, image, color, checkbox stays.
- Doing heavy work in `prepareForReuse` and resetting content in it (Apple: only attributes unrelated to content), or forgetting `super.prepareForReuse()`.
- Not cancelling an asynchronous image load on reuse: the image lands in the wrong cell.
- Calling `tableView.cellForRow(at:)` and hoping the cell exists: for an invisible row it returns `nil`. Keep state in the model, not in the cell.
- Implementing `heightForRowAt` without need: the table will ask for the height of every row.
- Changing the model after `insertRows`/`deleteRows` or not reconciling the row count: a crash.
- Doing heavy work in `scrollViewDidScroll`: it is called on every offset change.
- Duplicating the safe area in `contentInset` by hand: it is already part of `adjustedContentInset`.
- Computing a cell size with magic numbers without accounting for `sectionInset` and gaps and without `floor`.
- Making the whole model an identifier in a diffable data source when its content changes: instead of an update you get a deletion and an insertion.
- Non-unique identifiers in a snapshot: violates Apple's requirement.

<details>
<summary>What is reconfigureRows (reconfigureItems) for if there is reloadRows?</summary>

`reloadRows` replaces the cell: it usually takes another one from the queue (with `prepareForReuse`). `reconfigureRows` keeps the existing cell and just updates its data: cheaper, and the cell's state (for example, focus, an animation) isn't reset. Per Apple's documentation, `prepareForReuse` isn't called for it.

</details>

## Cheat sheet

```swift
// UIScrollView
scrollView.contentSize / contentOffset / setContentOffset(_:animated:)
scrollView.contentInset                         // your insets
scrollView.adjustedContentInset                 // contentInset + safe area (iOS 11+)
contentView.top/leading/trailing/bottom == scrollView.contentLayoutGuide...
contentView.width == scrollView.frameLayoutGuide.width     // vertical scrolling
// zoom: viewForZooming + min != max

// UITableView
tableView.register(Cell.self, forCellReuseIdentifier: id)   // BEFORE dequeue
tableView.dequeueReusableCell(withIdentifier: id, for: indexPath)   // only in cellForRowAt
cell.prepareForReuse()        // reset non-content; super required; content — in cellForRowAt
tableView.rowHeight = UITableView.automaticDimension      // the default; heightForRowAt turns this off
reloadData / reloadRows / reconfigureRows / performBatchUpdates

// UICollectionView
layout = FlowLayout | CompositionalLayout | custom
register / dequeueReusableCell(withReuseIdentifier:for:)   // or CellRegistration (iOS 14)
item -> group -> section -> layout; fractionalWidth / absolute / estimated
UICollectionViewCompositionalLayout.list(using:)

// Diffable
NSDiffableDataSourceSnapshot<Section, ID>   // unique Hashable ids, not models
dataSource.apply(snapshot, animatingDifferences: true)
snapshot.reconfigureItems([id])             // iOS 15
```

## Self-check questions

<details>
<summary>1. How does scrolling work in UIScrollView? What are contentSize and contentOffset?</summary>

A scroll view is a "window" whose origin is shifted across the content (in practice — through `bounds.origin`). `contentSize` is the size of the content, `contentOffset` is the offset of the content's origin relative to the scroll view's origin.

</details>

<details>
<summary>2. How does contentInset differ from adjustedContentInset?</summary>

`contentInset` is your insets. `adjustedContentInset` is the resulting ones: `contentInset` plus the safe area (if allowed by `contentInsetAdjustmentBehavior`), iOS 11+.

</details>

<details>
<summary>3. Why is cell reuse needed in tables and collections? How does it work?</summary>

Creating a view for every row is expensive. Cells that went off the screen edge are put in a queue by reuse identifier; for a new row `dequeue` takes a cell from there (with `prepareForReuse`) or creates a new one. The content is fully overwritten in `cellForRowAt`.

</details>

<details>
<summary>4. What can and can't be done in prepareForReuse?</summary>

Reset attributes unrelated to the content (alpha, editing mode, selection) and cancel unneeded tasks (an image load). Overwrite the content in `cellForRowAt`, call `super`.

</details>

<details>
<summary>5. How do UITableView and UICollectionView differ? When to use which?</summary>

A table is one column of rows, a simple list. In a collection the layout is moved into a layout object, so grids, carousels and different sections are possible; since iOS 14 lists too (list layout). Both are subclasses of `UIScrollView`.

</details>

<details>
<summary>6. How does compositional layout work?</summary>

Item → group → section → layout. Sizes are given through dimensions: `fractionalWidth`, `fractionalHeight`, `absolute`, `estimated`. A group arranges items horizontally, vertically or in its own way.

</details>

<details>
<summary>7. What is a diffable data source and why are identifiers stored in it?</summary>

You pass a snapshot of the desired state, and the data source computes the difference itself (O(n)) and animates. Identifiers must be unique and `Hashable`. They are stored instead of models so that changing a model's field doesn't turn into "delete the old one and insert a new one"; to update the content, use `reconfigureItems` (iOS 15).

</details>

## Sources

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
- [A guide to UICollectionView and UITableView — Mad Brains Techno, YouTube (in Russian)](https://www.youtube.com/watch?v=dPYi4c2bPpw&list=PLw6SJ6q6-1YowmlGVks5a088XrSbihJu-&index=16)
- [NSDiffableDataSource vs RxDataSources — Mad Brains Techno, YouTube (in Russian)](https://www.youtube.com/watch?v=vquSNnKFkUE&list=PLw6SJ6q6-1YowmlGVks5a088XrSbihJu-&index=24)
- [Complex collection layouts in iOS, using the VK feed as an example — Habr (in Russian)](https://habr.com/ru/companies/vk/articles/481626/)
