---
title: "How does UIStackView differ from UITableView?"
category: uikit
order: 66
---

`UIStackView` is a container that uses Auto Layout to arrange its `arrangedSubviews` in a row or a column depending on `axis`, `distribution`, `alignment` and `spacing`. It is usually used to lay out a small number of elements, and more complex hierarchies are built by nesting stacks.

`UITableView` is a view that shows data in rows in a single column, optionally grouped into sections. Cells (`UITableViewCell`) are supplied by a data source, meaning the table is driven by data and is designed for structured or hierarchical lists.
