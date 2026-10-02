---
title: "We have two protocols with a method that is completely identical in signature, input and output types, parameters, and naming. We make a class conform to both protocols and implement their methods. What will the compiler say?"
category: swift
order: 56
---

The compiler will not report an error. But the class must provide **a single implementation of the method**, which will count as the implementation for both protocols.
