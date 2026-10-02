---
title: "What debugger commands do you know?"
category: tooling
order: 14
---

LLDB debugger commands are entered in the Xcode console while execution is paused (at a breakpoint):

- `po <expression>` evaluates the expression and prints an object's description as defined by the type's author; `p <expression>` prints the value together with its type. Both commands are abbreviations of `dwim-print`.
- `expression` (`e`) evaluates an expression in the context of the current frame and can also change state: `expression counter = 5`.
- `frame variable` (`v`) shows the arguments and local variables of the current frame without executing code.
- `bt` prints the call stack of the current thread (`bt all` for all threads).
- `continue` (`c`) resumes execution; `next` (`n`) steps to the next line without entering calls; `step` (`s`) steps into a call; `finish` runs the current function until it returns.
- `breakpoint set` (`b`) sets a breakpoint from the console.
