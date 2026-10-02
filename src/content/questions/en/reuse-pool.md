---
title: "What is a reuse pool and how does cell reuse work under the hood?"
category: uikit
order: 157
---

The **reuse pool** is an internal pool of `UITableView`/`UICollectionView` cells that have already been created but are not currently visible on screen, and that can be reused instead of creating new ones.

Without reuse, scrolling a list of thousands of rows would require allocating thousands of `UITableViewCell`s, which is expensive in memory and in layout time. Instead, when scrolling:

1. A cell that has moved out of the visible area is not destroyed but placed into the reuse pool (stored by `reuseIdentifier`).
2. When a new row appears at the bottom/top, `dequeueReusableCell(withIdentifier:for:)` takes a ready-made cell from the pool instead of calling `init`.
3. For that cell, the content setup (`cellForRowAt`) is called again, and the old data of the previous row is overwritten.

```swift
let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
cell.textLabel?.text = items[indexPath.row]
return cell
```

**Important consequences:**

- if you don't reset the cell's state (for example, an image or the selection), it will "leak" into the new row with different data;
- asynchronous data loading for a cell (images over the network) requires checking that the cell has not been reused for another row by the time the load completes;
- `UICollectionView` and `UITableView` use the same mechanism, but `UICollectionView` also has a reuse pool for supplementary views (headers/footers).
