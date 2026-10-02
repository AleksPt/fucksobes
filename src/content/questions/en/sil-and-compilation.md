---
title: "What is SIL, and what stages does Swift code go through during compilation?"
category: swift
order: 140
---

Swift Intermediate Language (SIL) is an intermediate representation specific to Swift. It sits between the abstract syntax tree (AST) and LLVM IR: it contains enough information about types, ARC, and protocols to perform Swift-specific checks and optimizations. It is written in SSA form (each variable is assigned once) and consists of functions, basic blocks, and instructions.

Compilation stages:

1. Parsing the code into an AST and semantic analysis: type inference, type checking.
2. Generation of "raw" SIL (SILGen).
3. Mandatory passes: checking that variables are initialized, code reachability, error diagnostics. Then SIL optimizations: eliminating redundant retain/release, devirtualizing calls, specializing generics, inlining.
4. Generation of LLVM IR (IRGen): this is where virtual method tables (vtables) and witness tables appear, and symbol names go through mangling.
5. LLVM optimizations and machine code generation.

You can inspect the result at different stages with the `swiftc -emit-sil`, `-emit-ir`, and `-emit-assembly` options.
