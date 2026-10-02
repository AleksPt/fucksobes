---
title: "What is a run loop and what is it for?"
category: concurrency
order: 68
---

A loop that receives and processes events on a specific thread. Its job is to keep the thread busy when there is work and, when there is none, put the thread to sleep so as not to waste resources.

What a RunLoop does:

1. Waits for something to happen and processes input from sources such as mouse and keyboard events.
2. Dispatches the message to the receiver.
