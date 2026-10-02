---
title: "How do asynchronous tasks execute, and which one goes first?"
category: concurrency
order: 19
---

It depends on the queue. A serial queue runs one task at a time, strictly in the order they were added (FIFO). A concurrent queue starts tasks in the order they were added but does not wait for the ones already running to finish, so they run simultaneously and the order in which they complete is not known in advance.

Swift Concurrency follows the same rule: with concurrent code you cannot know in advance in what order it will run.
