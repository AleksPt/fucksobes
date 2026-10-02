---
title: "Какие паттерны проектирования чаще всего используют в iOS? Какие из GoF знаете?"
category: architecture
order: 71
---

В iOS-разработке чаще всего встречаются:

- **Delegate** — объект делегирует часть своей работы другому объекту через протокол (`UITableViewDelegate`, `URLSessionDelegate`).
- **Observer** — подписка на изменения (`NotificationCenter`, KVO, Combine `Publisher`/`Subscriber`).
- **Singleton** — единственный экземпляр на всё приложение (`UIApplication.shared`, `URLSession.shared`).
- **Factory / Abstract Factory** — создание объектов без указания конкретного класса, часто через протокол.
- **Builder** — пошаговое конструирование сложного объекта.
- **Strategy** — инкапсуляция взаимозаменяемых алгоритмов за общим протоколом.
- **Decorator** — добавление поведения объекту без изменения его класса (модификаторы SwiftUI по сути декораторы).
- **Adapter** — приведение интерфейса одного объекта к интерфейсу, ожидаемому клиентом.
- **Facade** — упрощённый интерфейс над сложной подсистемой (например, сервис-обёртка над сетевым слоем).
- **Command** — инкапсуляция действия в объект (замыкания в Swift часто заменяют этот паттерн).

Классические **паттерны GoF** («банда четырёх», Gang of Four) делятся на три группы:

- **Порождающие (Creational):** Singleton, Factory Method, Abstract Factory, Builder, Prototype.
- **Структурные (Structural):** Adapter, Decorator, Facade, Composite, Proxy, Bridge, Flyweight.
- **Поведенческие (Behavioral):** Observer, Strategy, Command, State, Template Method, Chain of Responsibility, Mediator, Memento, Visitor, Iterator, Interpreter.

В iOS многие из них скрыты за архитектурными подходами: MVC/MVVM используют Observer и Delegate, DI-контейнеры — Factory, а Coordinator берёт на себя навигацию между экранами (по духу близок к Mediator, но это не отдельный паттерн GoF).
