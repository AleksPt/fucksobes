---
title: "Как бы вы реализовали список с бесконечной прокруткой?"
category: uikit
order: 150
---

**Пагинация** — данные загружаются постранично, а не целиком, и подгружаются по мере прокрутки.

Базовая схема на `UITableView`/`UICollectionView`:

1. Хранить состояние пагинации: номер текущей страницы (или курсор), флаг `isLoading`, флаг `hasMorePages`.
2. Использовать `UIScrollViewDelegate.scrollViewDidScroll(_:)` или `willDisplay cell:` — проверять, что до конца списка осталось N ячеек, и запускать подгрузку следующей страницы, не дожидаясь, пока пользователь долистает до самого низа.
3. Пока грузится страница, показывать индикатор в футере (`UITableView.tableFooterView` с `UIActivityIndicatorView`) и не запускать повторный запрос, пока предыдущий не завершился (`isLoading`).
4. После получения данных — добавить новые элементы в массив источника данных и вставить строки точечно (`insertRows(at:)`), а не делать `reloadData()`, чтобы не терять позицию скролла и не мигать список.
5. Остановиться, когда сервер вернул пустую страницу или явный признак конца списка (`hasMorePages = false`).

```swift
func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
    let thresholdIndex = items.count - 5
    guard indexPath.row == thresholdIndex, !isLoading, hasMorePages else { return }
    loadNextPage()
}
```

Дополнительно стоит учитывать:

- **Дебаунс/отмену** дублирующихся запросов при быстром скролле;
- **Cursor-based** пагинацию вместо offset-based, если данные могут меняться между запросами (иначе элементы будут дублироваться или теряться);
- **Diffable Data Source** (`UICollectionViewDiffableDataSource`) для аккуратного и анимированного обновления вместо ручной вставки индексов;
- обработку ошибок сети с возможностью повторить загрузку страницы (retry).

В SwiftUI похожая идея реализуется через `.onAppear` на последнем элементе `List` или через `LazyVStack` со сравнением индекса с концом массива.
