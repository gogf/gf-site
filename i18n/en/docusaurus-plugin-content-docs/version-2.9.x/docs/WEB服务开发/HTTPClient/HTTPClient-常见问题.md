---
slug: '/docs/web/http-client-faq'
title: 'HTTPClient - FAQ'
sidebar_position: 9
hide_title: true
keywords: [HTTPClient,GoFrame,GoFrame Framework,gclient.Client,connection pool,efficient,resource usage,short connection request,form request,ContentType]
description: "Explain how to effectively use the gclient.Client object in the GoFrame framework to improve efficiency and reduce resource usage. Includes suggestions for reusing the gclient.Client object and how to handle illegal character issues, demonstrated with examples on setting the correct ContentType."
---

## Should I preserve and reuse the created `gclient.Client` object?

Whether you create a `gclient.Client` object through `g.Client` or the `gclient.New` method, this object should be preserved and reused instead of creating a new `Client` object each time. This approach can improve efficiency, reduce resource usage, and be friendly to `GC`. The object has a built-in connection pool design that can effectively manage a large number of short connection requests. Due to the fact that the `Client` object does not consume a lot of resources, many people might not pay much attention to this point.

In what situations should I create a new `gclient.Client` object instead of reusing it? You can follow the decoupling design of business modules, where each business module manages its own `gclient.Client` object. Alternatively, when different scenarios require different configurations of the `Client`, you can create different `Client` objects to use.

## `invalid semicolon separator in query`

**Cause of the problem**: By default, **form requests** containing the `;` character are illegal (need `urlencode`). For details, please refer to the discussion: [https://github.com/golang/go/issues/25192](https://github.com/golang/go/issues/25192)

**Error Example**:

```bash
curl localhost:8000/Execute -d '{
    "Component": "mysql",
    "ResourceId": "cdb-gy6hm0ee",
    "Port": 6379,
    "SQL": "show databases;",
    "UserName": "root",
    "Password": ""
}'
```

**Corrected Example**:

When submitting the request, you need to specify the `ContentType`; for example, here it should indicate a `JSON` request.

```bash
curl -X POST -H "Content-Type: application/json" localhost:8000/Execute -d '{
    "Component": "mysql",
    "ResourceId": "cdb-gy6hm0ee",
    "Port": 6379,
    "SQL": "show databases;",
    "UserName": "root",
    "Password": ""
}'
```