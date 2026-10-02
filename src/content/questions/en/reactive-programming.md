---
title: "What is reactive programming? Do you have experience writing reactive programs?"
category: architecture
order: 32
---

Reactive programming is a paradigm in which a program is built around data streams and the propagation of change: instead of requesting values manually, components subscribe to a source and react automatically when new values arrive. Streams can be transformed by a chain of operators (`map`, `filter`, `combineLatest`, `debounce`), merged, and have their errors handled.

In iOS this means Combine (`Publisher`, `Subscriber`, `AnyCancellable`) from Apple, RxSwift/RxCocoa, and `AsyncSequence`/`AsyncStream` from Swift Concurrency. Typical uses: reacting to input in a search field with `debounce`, binding a ViewModel to a View, and combining the results of several requests.

Pros: declarative code and convenient composition of asynchronous events. Cons: debugging the call stack is hard, there is a risk of subscription leaks, and the learning curve is steep. In an interview, it is worth naming the specific framework you worked with, because the terminology and operators differ between Combine and RxSwift.
