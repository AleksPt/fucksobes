---
title: "What debugging tools in Xcode do you know? Which have you used?"
category: tooling
order: 19
---

- **The LLDB debugger**: breakpoints (conditional, with actions, symbolic, exception), stepping through code, inspecting variables and the console (`po`, `p`, `bt`, `expression`).
- **Logging**: `print`, `os.Logger` (unified logging with levels) and the Xcode console.
- **View Hierarchy Debugger** and **Memory Graph Debugger**: visual debuggers for the interface and for memory.
- **Sanitizers**: Address Sanitizer, Thread Sanitizer, Undefined Behavior Sanitizer, as well as the Main Thread Checker for UI access from a non-main thread.
- **Instruments**: Time Profiler, Allocations, Leaks, Network, Core Animation and others for performance.
- **Zombie Objects**, crash diagnostics and the Organizer with crash reports.
- **Network Link Conditioner** and proxying (Charles, Proxyman) for debugging the network layer.

The essential minimum is the debugger and logging; the rest is chosen to fit the type of problem: performance, memory, threads, interface.
