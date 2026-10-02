---
title: "What does DispatchGroup do?"
category: concurrency
order: 25
---

`DispatchGroup` manages a group of tasks running in parallel: it groups them and synchronizes their execution using `notify` or `wait`. You can add various asynchronous tasks to a group and set a notification that fires **after all the group's tasks have completed**.

This is convenient when you need to run several independent tasks in parallel and do something else only after all of them finish, for example update the UI or compute results.
