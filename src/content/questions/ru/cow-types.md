---
title: "Какие типы поддерживают copy on write?"
category: memory
order: 55
---

Коллекции (`Array`, `Set`, `Dictionary`) и `String`. Простые типы вроде `Int` не поддерживают COW: у них нет разделяемого буфера.
