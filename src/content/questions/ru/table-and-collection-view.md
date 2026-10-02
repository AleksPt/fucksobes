---
title: "TableView и CollectionView"
category: uikit
order: 65
---

`UITableView` показывает данные строками в одном вертикально прокручиваемом столбце, с секциями в стиле plain или grouped. Внешний вид таблицы задаёт сама таблица, а содержимое — ячейки `UITableViewCell`, которые создаёт data source.

`UICollectionView` управляет упорядоченной коллекцией элементов и показывает их с помощью настраиваемых layout-объектов (подкласс `UICollectionViewLayout`). Layout определяет расположение ячеек и supplementary views (например, заголовков и футеров), а сама коллекция применяет эти данные к view. Поэтому расположение можно менять динамически, в том числе с анимацией через `setCollectionViewLayout(_:animated:completion:)`. Данные поставляет data source, в том числе `UICollectionViewDiffableDataSource`; ячейки берутся через dequeue после регистрации класса или nib. Кроме того, у коллекции есть prefetching и интерактивное перемещение элементов.
