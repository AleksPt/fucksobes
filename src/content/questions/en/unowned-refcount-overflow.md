---
title: "What happens if you overflow the unowned reference count?"
category: memory
order: 69
---

A Swift object's header stores a counts field: strong and unowned references are tracked in a limited number of bits. If a count doesn't fit, the runtime moves the counts into a side table, where more room is allotted for them; it does the same when a `weak` reference appears.

If overflow happens there as well, the program terminates abnormally: the runtime halts execution with a message saying that the object was retained too many times. In practice, reaching that many references is unrealistic (you would need billions of `unowned` or strong references to a single object), so the question is more a check of whether you understand how the counts are laid out.

What is important to know: an object has three counts (strong, unowned, weak); when you access an `unowned` reference to an already deallocated object (strong = 0), the runtime checks the state and terminates the program (a trap), and the object's memory is freed only once the unowned references also drop to zero.
