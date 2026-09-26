---
title: "Что такое CADisplayLink? Для чего его используют?"
category: uikit
order: 91
---

`CADisplayLink` — таймер, синхронизированный с частотой обновления экрана. Он вызывает заданный селектор перед отрисовкой каждого кадра (60 или 120 раз в секунду на ProMotion), поэтому подходит для покадровой анимации, игр, кастомной отрисовки и плавных счётчиков.

```swift
let link = CADisplayLink(target: self, selector: #selector(step))
link.preferredFrameRateRange = CAFrameRateRange(minimum: 30, maximum: 60)
link.add(to: .main, forMode: .common)

@objc func step(_ link: CADisplayLink) {
    let dt = link.targetTimestamp - link.timestamp   // время до следующего кадра
}
```

Свойства `timestamp` и `targetTimestamp` показывают время текущего и следующего кадра, что позволяет анимировать по времени, а не по числу кадров. Чтобы не тратить заряд, частоту ограничивают (`preferredFrameRateRange`) и останавливают таймер через `invalidate()` или `isPaused`. Ссылка на `target` у `CADisplayLink` сильная, поэтому нужно вызывать `invalidate()` заранее или использовать прокси-объект, иначе возникнет retain cycle. От обычного `Timer` он отличается тем, что привязан к кадрам экрана, а не к произвольному интервалу времени.
