# Standard Router - FAQ

## How to support multiple `HTTP Method` submissions for the same API under strict routing

First, an API should only perform one function. `HTTP Method` is meaningful (for example, in `RESTful` API design). An API supporting multiple `HTTP Method` types is usually a sign of poor API design, and it's recommended to review the API design.

Generally, there is no scenario where an `API` needs to be associated with multiple `HTTP Methods`. For example, for user APIs, a `CRUD` API in RESTful implementation should have `4-5` API definitions, each implementing different business logic. Therefore, there might be the following API definitions for a `RESTful` API:

```
API Name    Method    Path
Create User       PUT       /user
User List         GET       /user
User Details      GET       /user/{uid}
Modify User       POST      /user/{uid}
Delete User       DELETE    /user/{uid}
```

If indeed there is a scenario where an API needs to support multiple `HTTP Methods`, it can be done by using a comma `,` to separate each `HTTP Method` in the `method` attribute of the `Meta` tag, for example:

```go
type SaveReq struct {
    g.Meta `path:"/user/{uid}" method:"put,post" summary:"Save User" tags:"User Management"`
    Uid    int64  `dc:"User ID"`
    Name   string `dc:"Username"`
    // ...
}
```

## How to make the `Data` field return only as an array without a named key-value pair using the default provided `Response` structure

This can be achieved by using type aliasing.

Source Code: [gf/example/httpserver/response-with-json-array](https://github.com/gogf/gf/tree/master/example/httpserver/response-with-json-array)

Result Example:

> Page: https://goframe.org/en/docs/web/router-registering-strict-router-faq
