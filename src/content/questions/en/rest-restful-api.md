---
title: "What is REST? What is a RESTful API?"
category: networking
order: 5
---

REST (Representational State Transfer) is an architectural style for client-server applications in which the server exposes resources and the client works with them through a uniform interface, most often over HTTP. Each resource has its own address (URL), and actions are expressed by HTTP methods: `GET` reads, `POST` creates, `PUT` and `PATCH` update, and `DELETE` removes.

Key REST constraints:

- the client and server are independent of each other;
- the server does not store client state between requests (stateless): each request contains everything needed;
- responses can be cached;
- the interface is uniform: resources, their representations (usually JSON), and standard methods and status codes.

A RESTful API is an API that follows these principles: for example, `GET /users/42` returns a user, and `DELETE /users/42` deletes them.
