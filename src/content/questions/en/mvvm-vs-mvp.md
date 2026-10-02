---
title: "Differences between MVVM and MVP"
category: architecture
order: 27
---

**MVVM**

- **Model**: data and business logic (for example, working with the database and the network).
- **View**: UI components such as `UIViewController` or `UIView`. It reacts to changes in the data exposed through the ViewModel.
- **ViewModel**: an intermediate layer between the View and the Model. It contains presentation logic and connects the model's data to the interface.
- It uses data binding (for example, Combine, RxSwift), which simplifies binding data.
- **Weak coupling with the View:** the View "observes" changes in the ViewModel.

**MVP**

- **Model**: the same as in MVVM: data and business logic.
- **View**: displays the interface. It depends on the Presenter for getting data and for reacting to user actions.
- **Presenter**: an intermediate layer between the View and the Model. It contains presentation logic, manages state, and updates the View. The View actively forwards calls to the Presenter (delegation).
- **Strong coupling with the View:** the Presenter updates the View directly by calling its methods.
