---
title: "Is it true that when laying out for iPad the Safe Area constraints are applied automatically, while on iPhone you have to set them manually?"
category: uikit
order: 46
---

There is no such distinction in the UIKit documentation or in WWDC materials: the safe area exists on both iPad and iPhone. It protects the interface from the screen's rounded corners, the Home indicator and the Dynamic Island on iPhone, as well as from navigation bars, tab bars and toolbars.

Every view has a `safeAreaLayoutGuide` for constraints and `safeAreaInsets` for manual layout without Auto Layout. For content to end up inside the safe area, you need to pin it to this guide or take these insets into account. For a controller's root view, the insets also account for `additionalSafeAreaInsets`.
