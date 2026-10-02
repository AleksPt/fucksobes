---
title: "Where did we find out the screen's frame before viewIsAppearing existed?"
category: uikit
order: 27
---

In `viewDidLayoutSubviews`. `viewWillAppear` was used too, but there the geometry and trait collection are not up to date yet (the view has not been added to the hierarchy): this is exactly why `viewIsAppearing` appeared.
