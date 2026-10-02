---
title: "What is client-server architecture? What role does an iOS app usually play?"
category: architecture
order: 36
---

Client-server architecture divides a system into two sides: the client, which sends requests and shows the result to the user, and the server, which stores the data and business logic, processes requests, and responds to them. Communication goes over the network, usually via HTTP (REST, GraphQL) or WebSocket, with data transferred in JSON and other formats.

An iOS app usually acts as the client: it requests data from the server, displays it, sends the user's actions, and caches some of the data locally so it can work without a network. Pros of this approach: the logic and data are centralized, one server can serve clients on different platforms, and the server side can be updated without releasing a new version of the app. Cons: dependence on the network and latency, and the need for error handling and an offline mode.
