---
slug: '/docs/web/senior-server-metrics'
title: 'HTTPServer - Metrics'
sidebar_position: 11
hide_title: true
keywords: [GoFrame, GoFrame Framework, HTTP Server, Monitoring Metrics, Performance Optimization, Request Execution Time, Total Requests, Active Requests, Byte Size, Server Port]
description: "This document introduces how to enable the monitoring metrics feature of the HTTP Server in the GoFrame framework, providing a detailed list of metrics and attributes to help users monitor and optimize HTTP server performance. By enabling the metric feature, you can track key performance indicators such as request execution time, total requests, and byte size transmitted."
---

The `HTTP Server` supports monitoring metrics capabilities. By default, these are disabled to avoid affecting performance. They are only enabled globally when the `metric` feature is turned on, which will activate the calculation and generation of monitoring metrics.

## Metric List

| **Metric Name** | **Metric Type** | **Metric Unit** | **Metric Description** |
| --- | --- | --- | --- |
| `http.server.request.duration` | `Histogram` | `ms` | Categorizes the time cost of request execution on the `Server` side. |
| `http.server.request.duration_total` | `Counter` | `ms` | Total execution time cost for each request. |
| `http.server.request.total` | `Counter` |  | Total number of requests completed, excluding those currently being executed. |
| `http.server.request.active` | `Gauge` |  | Number of requests currently being processed. |
| `http.server.request.body_size` | `Counter` | `bytes` | Total byte size of requests. |
| `http.server.response.body_size` | `Counter` | `bytes` | Total byte size of responses. |

## Attribute List

| **Label Name** | **Label Description** | **Label Example** |
| --- | --- | --- |
| `server.address` | The address receiving the request. Derived from `Request.Host`, it may be a domain name or an IP address. | `goframe.org`<br />`10.0.1.132` |
| `server.port` | The server port receiving the request. A service may have multiple port addresses; the current connection's port is recorded. | `8000` |
| `http.route` | The routing rule of the request. | `/api/v1/user/:id` |
| `url.schema` | The protocol name of the request. | `http`; `https` |
| `network.protocol.version` | The version of the request protocol. | `1.0`; `1.1` |
| `http.request.method` | The method name of the request. | `GET`; `POST`; `DELETE` |
| `error.code` | The custom business error code returned by the request, as a string for compatibility. | `-1`; `0`; `51` |
| `http.response.status_code` | The `HTTP` status code of the response. | `200` |