---
title: "What is UITabBarController? What is it used for and how is it implemented?"
category: uikit
order: 83
---

`UITabBarController` is a container controller with a tab bar (`UITabBar`): each tab corresponds to its own view controller, and the user switches between them by tapping a bar item. It is used to organize the app's main independent sections (feed, search, profile).

In the classic API, controllers are set through the `viewControllers` property, and the tab's icon and title come from each controller's `tabBarItem`. Typically each tab is its own `UINavigationController`, meaning the sections have separate navigation stacks. A tab's controller is loaded lazily, on first opening, and the tab's state is preserved when switching.

The bar works well for 2 to 5 sections; with more, the extra tabs go into a "More" item. Starting with iOS 18 there is a new API based on `UITab` and `UITabGroup`, and on iPad the bar can be shown at the top and turn into a sidebar.
