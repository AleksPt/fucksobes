---
title: "What is Thread Sanitizer?"
category: tooling
order: 22
---

Thread Sanitizer (TSan) is a runtime tool in Xcode that looks for data races and other synchronization errors. A race occurs when two threads access the same memory at the same time, at least one of them writes, and there is no synchronization.

It instruments the code at compile time and tracks every memory access and the synchronization order between threads; when it finds a violation, it stops execution and reports in the Issue Navigator which two accesses conflict and where they happened. It is enabled in the run scheme: **Edit Scheme → Run → Diagnostics → Thread Sanitizer** (for tests, the same in the Test scheme).

Limitations: it slows the program down several times over and increases memory consumption, works in the simulator but not on a real device, and cannot run together with Address Sanitizer. It detects races only in places that were actually executed during the run. Problems with accessing the UI from a non-main thread are caught by a different tool, the Main Thread Checker.
