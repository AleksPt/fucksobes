---
title: "What is Dispatch Barrier for, how do you set it, how do you reset it, and how does it work? At what moment should a barrier run, and when is it set?"
category: concurrency
order: 29
---

It synchronizes access to a resource in a **concurrent** queue. A barrier divides tasks into pre-barrier and post-barrier ones: until it finishes executing, subsequent tasks wait. The barrier's block of code runs on a single thread, blocking subsequent tasks until it completes.
