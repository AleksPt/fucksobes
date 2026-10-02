---
title: "We need to show an animation when a screen opens. In which VC lifecycle method will we do it, and why in that one?"
category: uikit
order: 36
---

In `viewDidAppear`: in this method the screen is already fully displayed, and the animation will be visible to the user.
