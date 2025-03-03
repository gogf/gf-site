---
slug: '/quick/scaffold-api-run-and-test'
title: 'Step7 - Run and Test'
hide_title: true
sidebar_position: 6
keywords: [GoFrame, start service, API documentation, API testing, RESTful API, CRUD, API validation, data query, data modification, data deletion]
description: "Start the service through the command line and generate API documentation using Swagger. Supports RESTful API APIs for creating users, querying user information, modifying user data, and deleting users. Also supports API testing using the curl command, providing detailed validation rules and error codes to ensure data accuracy and reliability."
---

## Start the Service

We can use the command line or the `IDE`'s built-in start tool to start the service. To simplify the example, we directly use `go run main.go` in the command line to start our service:

```text
$ go run main.go
2024-11-16 16:40:07.394 [INFO] pid[39511]: http server started listening on [:8000]
2024-11-16 16:40:07.394 [INFO] {18594fad2e66081870e88c6e1440060b} swagger ui is serving at address: http://127.0.0.1:8000/swagger/
2024-11-16 16:40:07.394 [INFO] {18594fad2e66081870e88c6e1440060b} openapi specification is serving at address: http://127.0.0.1:8000/api.json

  ADDRESS | METHOD |   ROUTE    |                        HANDLER                        |           MIDDLEWARE             
----------|--------|------------|-------------------------------------------------------|----------------------------------
  :8000   | ALL    | /api.json  | github.com/gogf/gf/v2/net/ghttp.(*Server).openapiSpec |                                  
----------|--------|------------|-------------------------------------------------------|----------------------------------
  :8000   | GET    | /hello     | demo/internal/controller/hello.(*ControllerV1).Hello  | ghttp.MiddlewareHandlerResponse  
----------|--------|------------|-------------------------------------------------------|----------------------------------
  :8000   | ALL    | /swagger/* | github.com/gogf/gf/v2/net/ghttp.(*Server).swaggerUI   | HOOK_BEFORE_SERVE                
----------|--------|------------|-------------------------------------------------------|----------------------------------
  :8000   | GET    | /user      | demo/internal/controller/user.(*ControllerV1).GetList | ghttp.MiddlewareHandlerResponse  
----------|--------|------------|-------------------------------------------------------|----------------------------------
  :8000   | POST   | /user      | demo/internal/controller/user.(*ControllerV1).Create  | ghttp.MiddlewareHandlerResponse  
----------|--------|------------|-------------------------------------------------------|----------------------------------
  :8000   | DELETE | /user/{id} | demo/internal/controller/user.(*ControllerV1).Delete  | ghttp.MiddlewareHandlerResponse  
----------|--------|------------|-------------------------------------------------------|----------------------------------
  :8000   | GET    | /user/{id} | demo/internal/controller/user.(*ControllerV1).GetOne  | ghttp.MiddlewareHandlerResponse  
----------|--------|------------|-------------------------------------------------------|----------------------------------
  :8000   | PUT    | /user/{id} | demo/internal/controller/user.(*ControllerV1).Update  | ghttp.MiddlewareHandlerResponse  
----------|--------|------------|-------------------------------------------------------|----------------------------------
```

As we can see, the `CRUD` APIs we developed have been successfully registered on the `Web Server` and displayed correctly on the terminal. Meanwhile, we have enabled the API documentation feature, so let's look at the auto-generated API documentation.

## API Documentation

According to the address printed in the terminal, we visit: http://127.0.0.1:8000/swagger/

![goframe api swagger](QQ_1731747246720.png)

:::tip
Automated API documentation generation is one of the very powerful features provided by the `GoFrame` framework. We won't go into detail here, but those interested can refer to the section: [API Document](../../../docs/WEB服务开发/接口文档/接口文档.md)
:::

## API Testing

To simplify testing operations, we use the `curl` command for testing and submit and receive return parameters in `json` format.

:::tip
The `$` symbol at the front of the execution commands below represents the terminal command line tool's prompt and is not a part of the command we enter. Different terminal command lines have different prompt symbols.
:::

### `Create`

A creation request needs to be submitted using the `POST` method.

```bash
$ curl -X POST 'http://127.0.0.1:8000/user' -d '{"name":"john","age":20}'
{"code":0,"message":"","data":{"id":1}}

$ curl -X POST 'http://127.0.0.1:8000/user' -d '{"name":"alice","age":18}'
{"code":0,"message":"","data":{"id":2}}
```
The returned `code` of `0` indicates that the execution was successful.

Let's construct requests that do not meet the validation rules and see the effect:

```bash
$ curl -X POST 'http://127.0.0.1:8000/user' -d '{"name":"smith","age":16}'
{"code":51,"message":"The Age value `16` must be between 18 and 200","data":null}

$ curl -X POST 'http://127.0.0.1:8000/user' -d '{"name":"sm","age":18}'
{"code":51,"message":"The Name value `sm` length must be between 3 and 10","data":null}
```

As we can see, the validation rules have taken effect and returned specific validation error messages. The error code `51` is a built-in error code in the framework, indicating a validation error. Developers can also customize error codes. For more information on error codes, please refer to the relevant sections of the developer's manual.


### `GetOne`
```bash
$ curl -X GET 'http://127.0.0.1:8000/user/1'
{"code":0,"message":"","data":{"id":1,"name":"john","status":0,"age":20}}

$ curl -X GET 'http://127.0.0.1:8000/user/2'
{"code":0,"message":"","data":{"id":2,"name":"alice","status":0,"age":18}}
```

### `GetList`

```bash
$ curl -X GET 'http://127.0.0.1:8000/user'
{"code":0,"message":"","data":{"list":[{"id":1,"name":"john","status":0,"age":20},{"id":2,"name":"alice","status":0,"age":18}]}}

$ curl -X GET 'http://127.0.0.1:8000/user?age=18'
{"code":0,"message":"","data":{"list":[{"id":2,"name":"alice","status":0,"age":18}]}}
```

### `Update`

An update request needs to be submitted using the `PUT` method.

```bash
$ curl -X PUT 'http://127.0.0.1:8000/user/1' -d '{"age":26}'
{"code":0,"message":"","data":null}
```

After a successful execution, we query the corresponding data to see if it has been successfully modified:

```bash
$ curl -X GET 'http://127.0.0.1:8000/user/1'
{"code":0,"message":"","data":{"id":1,"name":"john","status":0,"age":26}}
```

### `Delete`

A deletion request needs to be submitted using the `DELETE` method.

```bash
$ curl -X DELETE 'http://127.0.0.1:8000/user/1'
{"code":0,"message":"","data":null}
```

After a successful execution, we query all the data lists to see if it has been deleted:

```bash
$ curl -X GET 'http://127.0.0.1:8000/user'
{"code":0,"message":"","data":{"list":[{"id":2,"name":"alice","status":0,"age":18}]}}
```

As we can see, the data has been successfully deleted.

## Learning Summary

As we can see, using the scaffold tool of the `GoFrame` framework, we can efficiently and quickly complete API development work with the project template generated, and it can automatically generate API documentation for convenient frontend-backend collaboration.

With this, a `CRUD` API project using the `GoFrame` framework has been quickly completed. However, the excellence of the `GoFrame` framework is far more than this; more features await your further exploration.