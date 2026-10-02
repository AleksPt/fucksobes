---
title: "Can a function parameter have a default value?"
category: swift
order: 121
---

Yes: the value is specified in the parameter declaration after the `=` sign. When calling the function, that argument can be omitted.

```swift
func eat(food: String = "spaghetti") {
    print("Yum! I ate some good \(food).")
}

eat()                  // spaghetti
eat(food: "pizza")     // pizza
```

Parameters with default values are conventionally placed at the end of the list: the call stays readable, and the arguments that must be passed come first. Thanks to argument labels, you can skip any of the optional parameters. Default values replace a set of overloads with different numbers of parameters. They are evaluated on every call, not once at declaration.
