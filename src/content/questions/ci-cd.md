---
title: "Расскажи про CI/CD (зачем нужен, какие инструменты есть)"
category: tooling
order: 13
---

**CI** (continuous integration) — автоматическая сборка и прогон тестов при каждом изменении кода. **CD** (continuous delivery) — автоматизация доставки готовой сборки тестировщикам и пользователям. Это стандартная практика разработки: ошибки находятся сразу после коммита, а выпуск сборок не зависит от ручных действий на чьей-то машине.

Инструменты: Xcode Cloud (CI/CD от Apple, интегрирован с Xcode и TestFlight), GitHub Actions (workflow в YAML в `.github/workflows/`, выполняются на runner'ах, в том числе macOS), а также сторонние сервисы вроде Jenkins, Bitrise и GitLab CI.
