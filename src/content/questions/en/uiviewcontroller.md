---
title: "What is UIViewController and what is it responsible for?"
category: uikit
order: 20
---

`UIViewController` is an object that manages a view hierarchy in a UIKit app. Its root view is stored in the `view` property and is loaded lazily, on the first access to `view`. You usually create a subclass and add your screen's logic to it.

What it is responsible for:

- managing views and loading them (from a storyboard, a nib or programmatically);
- reacting to changes in view visibility (`viewIsAppearing(_:)`, `viewWillDisappear(_:)` and other callbacks);
- reacting to changes in the view's size, including on rotation (`viewWillTransition(to:with:)`);
- acting as a container for child view controllers;
- reacting to low memory (`didReceiveMemoryWarning()`);
- saving and restoring state.

In addition, a view controller is a `UIResponder`, and it sits in the responder chain between the root view and that view's superview.
