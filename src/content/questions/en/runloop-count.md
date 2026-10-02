---
title: "What is a RunLoop? How many run loops are running in an app by default?"
category: concurrency
order: 69
---

A run loop is an event-processing loop that keeps a thread busy while there is work and puts it to sleep when there is none. `RunLoop` handles events from input sources (`Port`, window system events) and timers.

Every thread, including the main one, has an associated run loop object: the system creates it as needed. Only the main thread's run loop is started automatically (when the app launches), so one run loop is running by default. Secondary threads must start their own run loop explicitly.
