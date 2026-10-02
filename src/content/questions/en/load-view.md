---
title: "When is a ViewController's loadView() called? What is it for?"
category: uikit
order: 29
---

It is called on the first access to `view` (it is a lazy var). It exists so that you can supply your own custom view.
