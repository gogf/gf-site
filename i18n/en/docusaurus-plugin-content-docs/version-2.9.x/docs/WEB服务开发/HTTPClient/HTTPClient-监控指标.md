---
slug: '/docs/web/http-client-metrics'
title: 'HTTPClient - Metrics'
sidebar_position: 10
hide_title: true
keywords: [HTTP Client, Monitoring Metrics, Performance Optimization, Request Time, GoFrame, Connection Time, Total Requests, Request Size, GoFrame Framework, Response Size]
description: "The monitoring metrics feature of the HTTP client is disabled by default to avoid performance impact. It provides a variety of metrics for users to reference, such as the time cost of request execution, connection creation time, and the total size of request bytes, among others. These metrics are enabled only when the metric feature is globally enabled, helping users perform better performance analysis."
---

The `HTTP` client supports monitoring capabilities, which are off by default to avoid performance impact. The monitoring and metrics calculation features are enabled by default only when the global `metric` feature is activated.

## Metrics List

| **Metric Name** | **Metric Type** | **Metric Unit** | **Metric Description** |
| --- | --- | --- | --- |
| `http.client.request.duration` | `Histogram` | `ms` | Time cost of client request execution. |
| `http.client.request.duration_total` | `Counter` | `ms` | Total time cost used by each request. |
| `http.client.connection.duration` | `Histogram` | `ms` | Time cost used for creating a connection. |
| `http.client.request.total` | `Counter` |  | Total number of requests completed. |
| `http.client.request.active` | `Gauge` |  | Number of requests currently being processed. |
| `http.client.request.body_size` | `Counter` | `bytes` | Total size of request bytes. |
| `http.client.response.body_size` | `Counter` | `bytes` | Total size of returned bytes. |

## Attributes List

| **Label Name** | **Label Description** | **Label Example** |
| --- | --- | --- |
| `server.address` | Target service address of the request. It could be a domain name or IP address. | `goframe.org`<br />`10.0.1.132` |
| `server.port` | Target service port of the request. | `8000` |
| `http.request.method` | Request method name. | `GET`; `POST`; `DELETE` |
| `http.response.status_code` | `HTTP` status code of the response. | `200` |
| `url.schema` | Protocol used for the request. | `http`<br />`https` |
| `network.protocol.version` | Version of the request protocol. | `1.0`<br />`1.1` |