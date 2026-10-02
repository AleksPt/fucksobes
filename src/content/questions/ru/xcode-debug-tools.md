---
title: "Какие инструменты отладки в Xcode вы знаете? Какими пользовались?"
category: tooling
order: 19
---

- **Отладчик LLDB**: точки останова (условные, с действиями, символьные, исключений), пошаговое выполнение, просмотр переменных и консоль (`po`, `p`, `bt`, `expression`).
- **Логирование**: `print`, `os.Logger` (унифицированное логирование с уровнями) и консоль Xcode.
- **View Hierarchy Debugger** и **Memory Graph Debugger** — визуальные отладчики интерфейса и памяти.
- **Санитайзеры**: Address Sanitizer, Thread Sanitizer, Undefined Behavior Sanitizer, а также Main Thread Checker для обращений к UI не из главного потока.
- **Instruments**: Time Profiler, Allocations, Leaks, Network, Core Animation и другие для производительности.
- **Zombie Objects**, диагностика сбоев и Organizer с отчётами о падениях.
- **Network Link Conditioner** и проксирование (Charles, Proxyman) для отладки сетевого слоя.

Обязательный минимум — отладчик и логирование; остальное подбирают под тип проблемы: производительность, память, потоки, интерфейс.
