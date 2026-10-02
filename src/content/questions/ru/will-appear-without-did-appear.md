---
title: "Когда вызовется viewWillAppear, но не вызовется viewDidAppear?"
category: uikit
order: 92
---

`viewWillAppear` сообщает, что переход к экрану начался, а `viewDidAppear` — что он завершился. Если переход не дошёл до конца, второй метод не вызывается. Типичные случаи:

- **отменённый интерактивный переход**: пользователь начал смахивать экран жестом «назад» у `UINavigationController`, но передумал и вернул его; предыдущему экрану пришёл `viewWillAppear`, а затем сразу `viewWillDisappear` и `viewDidDisappear`, но без `viewDidAppear`;
- **прерванный показ**: пока идёт анимация, экран закрывают, а вместо него показывают другой (например, `present` в `viewWillAppear`);
- **свёрнутое приложение** или системное прерывание в момент перехода;
- **ошибки в собственных контейнерах**: неправильно вызванные `beginAppearanceTransition` и `endAppearanceTransition` у дочерних контроллеров.

Поэтому парой `willAppear/didAppear` нельзя считать гарантированной последовательностью: подписки, запущенные в `viewWillAppear`, отменяют и в `viewWillDisappear`, а не только в `viewDidDisappear`.
