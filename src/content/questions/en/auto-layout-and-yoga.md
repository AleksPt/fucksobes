---
title: "Can Auto Layout and Yoga (Flexbox) be mixed?"
category: uikit
order: 116
---

Yoga is a cross-platform layout engine based on the Flexbox model (it is used in React Native, and there are UIKit wrappers such as YogaKit). It can be mixed with Auto Layout, but with caveats.

Both mechanisms want to control a view's position and size, so if the same view is laid out by both Yoga and Auto Layout, they conflict: Yoga sets the `frame`, while Auto Layout recalculates it from the constraints. That is why the approaches are separated by subtree: for example, the root container and the screen are laid out by Auto Layout, while inside a particular view (a feed, a card) Yoga computes the layout and sets the frames of its descendants (for them `translatesAutoresizingMaskIntoConstraints` stays enabled). The boundary between the two is a view whose size is determined by Auto Layout, and Yoga receives that size as the available width.

Yoga's advantages are fast layout of a large number of elements without a solver and the familiar Flexbox model; the drawbacks are an extra dependency and two layout systems in the project.
