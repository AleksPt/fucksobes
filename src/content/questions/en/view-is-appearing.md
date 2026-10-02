---
title: "Why was the viewIsAppearing method added to the controller lifecycle?"
category: uikit
order: 26
---

For more flexible configuration and manipulation before `viewDidLayoutSubviews` (for example, scrolling a collection to a particular cell at the moment of navigating to the screen). It is the first place where the screen's frame is known. The method is called after `viewWillAppear`, once the view has been added to the hierarchy and the trait collection and geometry are up to date; it is available starting with iOS 13 (back-deployed).
