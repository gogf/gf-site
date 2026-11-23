# HTTPClient - ContentType

## Example 1, Submit `Json` Request

```go
g.Client().ContentJson().PostContent(ctx, "http://order.svc/v1/order", g.Map{
    "uid"         : 1,
    "sku_id"      : 10000,
    "amount"      : 19.99,
    "create_time" : "2020-03-26 12:00:00",
})
```

By calling the `ContentJson` chain operation method, this request will set the `Content-Type` to `application/json` and automatically encode the submission parameters to `Json`:

```
{"uid":1,"sku_id":10000,"amount":19.99,"create_time":"2020-03-26 12:00:00"}
```

## Example 2, Submit `Xml` Request

```go
g.Client().ContentXml().PostContent(ctx, "http://order.svc/v1/order", g.Map{
    "uid"         : 1,
    "sku_id"      : 10000,
    "amount"      : 19.99,
    "create_time" : "2020-03-26 12:00:00",
})
```

By calling the `ContentXml` chain operation method, this request will set the `Content-Type` to `application/xml` and automatically encode the submission parameters to `Xml`:

```
<doc><amount>19.99</amount><create_time>2020-03-26 12:00:00</create_time><sku_id>10000</sku_id><uid>1</uid></doc>
```

## Example 3, Custom `ContentType`

We can customize the client's request `ContentType` through the `ContentType` method. If the given parameter is `string/[]byte`, the client will directly submit the parameter to the server; if it is another data type, the client will automatically perform `url encode` on the parameter before submitting it to the server.

Example 1:

```go
g.Client().ContentType("application/json").PostContent(
  ctx,
  "http://order.svc/v1/order",
  `{"uid":1,"sku_id":10000,"amount":19.99,"create_time":"2020-03-26 12:00:00"}`,
)
```

or

```go
g.Client().ContentType("application/json; charset=utf-8").PostContent(
  ctx,
  "http://order.svc/v1/order",
  `{"uid":1,"sku_id":10000,"amount":19.99,"create_time":"2020-03-26 12:00:00"}`,
)
```

Submitted parameters are as follows:

```
{"uid":1,"sku_id":10000,"amount":19.99,"create_time":"2020-03-26 12:00:00"}
```

Example 2:

```go
g.Client().ContentType("application/x-www-form-urlencoded; charset=utf-8").GetContent(
  ctx,
  "http://order.svc/v1/order",
  g.Map{
    "category" : 1,
    "sku_id"   : 10000,
  },
)
```

Submitted parameters are as follows:

```
category=1&sku_id=10000
```

> Page: https://goframe.org/en/docs/web/http-client-content-type
