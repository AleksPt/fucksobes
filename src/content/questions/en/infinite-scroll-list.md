---
title: "How would you implement a list with infinite scrolling?"
category: uikit
order: 150
---

**Pagination**: data is loaded page by page rather than all at once, and is fetched as the user scrolls.

The basic scheme with `UITableView`/`UICollectionView`:

1. Keep the pagination state: the current page number (or cursor), an `isLoading` flag and a `hasMorePages` flag.
2. Use `UIScrollViewDelegate.scrollViewDidScroll(_:)` or `willDisplay cell:` to check that N cells remain until the end of the list, and start loading the next page without waiting for the user to scroll all the way to the bottom.
3. While a page is loading, show an indicator in the footer (`UITableView.tableFooterView` with a `UIActivityIndicatorView`) and don't start another request until the previous one has finished (`isLoading`).
4. After receiving the data, append the new items to the data source array and insert the rows precisely (`insertRows(at:)`) rather than calling `reloadData()`, so you don't lose the scroll position or make the list flicker.
5. Stop when the server returns an empty page or an explicit end-of-list marker (`hasMorePages = false`).

```swift
func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
    let thresholdIndex = items.count - 5
    guard indexPath.row == thresholdIndex, !isLoading, hasMorePages else { return }
    loadNextPage()
}
```

Also worth considering:

- **Debouncing/cancelling** duplicate requests during fast scrolling;
- **Cursor-based** pagination instead of offset-based, if the data can change between requests (otherwise items will be duplicated or lost);
- **Diffable Data Source** (`UICollectionViewDiffableDataSource`) for neat, animated updates instead of inserting indexes by hand;
- handling network errors with the ability to retry loading a page.

In SwiftUI the same idea is implemented with `.onAppear` on the last item of a `List`, or with a `LazyVStack` comparing the index to the end of the array.
