---
title: "TableView and CollectionView"
category: uikit
order: 65
---

`UITableView` shows data in rows in a single vertically scrolling column, with plain or grouped sections. The table's appearance is set by the table itself, while the content is provided by `UITableViewCell` cells created by the data source.

`UICollectionView` manages an ordered collection of items and displays them using customizable layout objects (a subclass of `UICollectionViewLayout`). The layout determines the placement of cells and supplementary views (for example, headers and footers), and the collection itself applies this data to the views. That is why the arrangement can be changed dynamically, including with animation through `setCollectionViewLayout(_:animated:completion:)`. Data is supplied by a data source, including `UICollectionViewDiffableDataSource`; cells are obtained via dequeue after registering a class or nib. In addition, the collection has prefetching and interactive item reordering.
