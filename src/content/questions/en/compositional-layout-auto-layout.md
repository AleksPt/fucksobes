---
title: "How does UICollectionView's Compositional Layout work together with Auto Layout?"
category: uikit
order: 115
---

`UICollectionViewCompositionalLayout` computes the frames of cells, sections and groups itself from a description: sizes are given through `NSCollectionLayoutSize` (fractions of the container with `fractionalWidth`/`fractionalHeight`, absolute values or an `estimated` guess), and items are assembled into groups and sections. Auto Layout does not take part in positioning cells inside the collection: the position and size of each cell are determined by the layout.

Inside a cell, Auto Layout works as usual: its content is laid out with constraints relative to `contentView`.

The two connect through **estimated** sizes: if the height (or width) is set as `.estimated(...)`, the layout first takes the estimate, and once the cell is created, it asks the cell for its real size via Auto Layout (`systemLayoutSizeFitting`/`preferredLayoutAttributesFitting`) and adjusts the layout. So cells with dynamic height must be pinned with constraints from top to bottom without ambiguity, and the estimate should be close to reality to avoid jumps while scrolling.
