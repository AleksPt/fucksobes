---
title: "Suppose we have a ViewController with a viewDidLoad method, and there we put a task on DispatchQueue.global().async and capture self. In this case, should we weaken the reference to self or not?"
category: memory
order: 44
---

No, not necessarily: there will be no strong reference cycle here.

But if it is a custom queue that holds a strong reference to the object, then you should.
