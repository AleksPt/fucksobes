---
title: "Какие системные `reference-типы` есть в Swift кроме классов"
category: swift
order: 10
---

Замыкания (closures), функции, акторы. `indirect enum` к ним не относится: это value-тип, а `indirect` лишь добавляет уровень косвенности (payload кейсов хранится в куче).
