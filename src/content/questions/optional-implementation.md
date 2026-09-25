---
title: "С помощью какого типа реализован Optional в Swift (структура, класс, перечисление или что-то ещё)"
category: swift
order: 16
---

**enum**

Optional в Swift реализован как перечисление с двумя случаями: .none и .some(Wrapped).

---

enum, содержащий кейсы .none и .some(Value) (есть значение и nil/ничего)
