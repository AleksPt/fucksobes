---
title: "Из каких частей состоит VIP (Clean Swift)? Чем отличается от VIPER?"
category: architecture
order: 55
---

VIP — архитектура Clean Swift (Раймонд Лоу): модуль (сцена) состоит из View (`UIViewController`), Interactor, Presenter, а также Router и Worker. Главная особенность — однонаправленный цикл:

**View → Interactor → Presenter → View**

- View принимает действия пользователя и отправляет `Request` в Interactor;
- Interactor выполняет бизнес-логику (через Worker: сеть, база) и передаёт `Response` в Presenter;
- Presenter форматирует данные в `ViewModel` и отдаёт в View для отображения;
- Router отвечает за навигацию и передачу данных между сценами.

Отличия от VIPER:

- в VIPER Presenter находится посередине и общается с View, Interactor и Router в обе стороны, а в VIP связи образуют замкнутый односторонний цикл и Interactor не зависит от Presenter напрямую;
- в VIP нет отдельного слоя Entity (модели передаются как `Request/Response/ViewModel` для каждого сценария), а логику работы с данными выносят в Workers;
- VIP строже разделяет данные между слоями, но требует ещё больше шаблонного кода.
