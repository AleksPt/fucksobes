---
title: "In which ViewController lifecycle method are the view's exact dimensions known?"
category: uikit
order: 34
---

`viewDidLayoutSubviews()`: this is where the final frames of the subviews are known. The size of the view itself is correct earlier, in `viewIsAppearing(_:)`.
