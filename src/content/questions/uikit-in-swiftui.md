---
title: "Можно ли в SwiftUI использовать UIKit (UIView и UIViewController)"
category: swiftui
order: 19
---

Да. UIKit-view встраивают через протокол `UIViewRepresentable`, а UIKit view controller — через `UIViewControllerRepresentable`. В типе, принимающем протокол, реализуют методы создания, обновления и удаления UIKit-объекта, а затем добавляют его в иерархию SwiftUI как обычную view.

Изменения внутри UIKit-объекта система сама в SwiftUI не передаёт. Для взаимодействия (например, target-action и делегаты) нужен экземпляр `Coordinator`.
