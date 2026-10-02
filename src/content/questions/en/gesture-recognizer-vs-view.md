---
title: "What if we attach a gesture recognizer on top of a view? Which of them do you think receives the event first?"
category: uikit
order: 63
---

The gesture recognizer receives the event first. The window delivers touches to a gesture recognizer before the view it is attached to (the hit-tested view). If the recognizer has not recognized the gesture, the view receives the whole sequence of touches. If it has, the remaining touches for the view are cancelled (by default, `cancelsTouchesInView`).

In addition, a gesture recognizer is not part of the view's responder chain.
