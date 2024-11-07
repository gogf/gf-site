---
slug: '/docs/design/context-variable'
title: 'Context: Sharing Variables in Business Processes'
sidebar_position: 0
hide_title: true
---

## Introduction

`Context` refers to the `context.Context` interface object from the standard library, commonly used for **asynchronous IO control** and **passing variables through the context flow**. This article will introduce how to use `Context` to pass shared variables between processes.

In the execution flow of `Go`, especially in `HTTP/RPC` execution flows, there is no way to obtain request parameters through "global variables". Instead, the context `Context` variable must be passed to subsequent processes, and the `Context` context variable includes all the shared variables that need to be passed. These shared variables in the `Context` should be pre-agreed upon and often stored as object pointers.

Sharing variables through the `Context` context is very simple. Below, we will demonstrate how to pass and use common shared variables in a practical project through an example.

## I. Structure Definition

Context objects often store variables that need to be shared. These variables are typically stored using structured objects for easy maintenance. For example, we define shared variables in the context in `model`:

```go
const (
    // Key name for storing context variables, shared by front-end and back-end systems
    ContextKey = "ContextKey"
)

// Request context structure
type Context struct {
    Session *ghttp.Session // Current Session management object
    User    *ContextUser   // Context user information
    Data    g.Map          // Custom KV variables, set by business modules as needed, not fixed
}

// User information in the request context
type ContextUser struct {
    Id       uint   // User ID
    Passport string // User account
    Nickname string // User name
    Avatar   string // User avatar
}
```

Details:

1. `model.ContextKey` constant represents the key name stored in the `context.Context` context variable, which is used to store/retrieve business custom shared variables from the passed `context.Context` variable.
2. `Session` in `model.Context` structure represents the current request's `Session` object. In the `GoFrame` framework, each `HTTP` request object will have an empty `Session` object, which is designed with lazy initialization and is only initialized when actual read/write operations are performed.
3. `User` in `model.Context` structure represents the basic information of the currently logged-in user, which is only available after the user logs in, otherwise it is `nil`.
4. `Data` property in `model.Context` structure is used to store custom `KV` variables. Therefore, developers generally do not need to add custom key-value pairs to the `context.Context` context variable, but can directly use the `Data` property of the `model.Context` object. See further introduction for details.

## II. Logic Encapsulation

Since the context object is also related to business logic, we need to encapsulate the context variables through the `service` object for easy use by other modules.

```go
// Context management service
var Context = new(contextService)

type contextService struct{}

// Initialize the context object pointer into the context object for modification in subsequent request processes.
func (s *contextService) Init(r *ghttp.Request, customCtx *model.Context) {
    r.SetCtxVar(model.ContextKey, customCtx)
}

// Get context variable, if not set, then return nil
func (s *contextService) Get(ctx context.Context) *model.Context {
    value := ctx.Value(model.ContextKey)
    if value == nil {
        return nil
    }
    if localCtx, ok := value.(*model.Context); ok {
        return localCtx
    }
    return nil
}

// Set context information into the context request, note that it is a complete override
func (s *contextService) SetUser(ctx context.Context, ctxUser *model.ContextUser) {
    s.Get(ctx).User = ctxUser
}
```

## III. Context Variable Injection

Context variables must be injected into the request process at the beginning of the request to facilitate calls by other methods. In `HTTP` requests, we can use `GoFrame` middleware to achieve this. In `GRPC` requests, we can also use interceptors to achieve this. In the `service` layer's `middleware` management object, we can define it as follows:

```go
// Custom context object
func (s *middlewareService) Ctx(r *ghttp.Request) {
    // Initialization, must be executed first
    customCtx := &model.Context{
        Session: r.Session,
        Data:    make(g.Map),
    }
    service.Context.Init(r, customCtx)
    if userEntity := Session.GetUser(r.Context()); userEntity != nil {
        customCtx.User = &model.ContextUser{
            Id:       userEntity.Id,
            Passport: userEntity.Passport,
            Nickname: userEntity.Nickname,
            Avatar:   userEntity.Avatar,
        }
    }
    // Pass the custom context object to the template variables for use
    r.Assigns(g.Map{
        "Context": customCtx,
    })
    // Execute the next request logic
    r.Middleware.Next()
}
```

This middleware initializes the shared object of the user execution process and stores the object in the `context.Context` variable as a pointer type `*model.Context`. This way, any place that obtains this pointer can both retrieve the data inside and directly modify the data inside.

If there is user login storage information in the `Session`, the necessary shared user basic information will also be written into the `*model.Context`.

## IV. Context Variable Usage

### Method Definition

By convention, the first input parameter of method definitions is often reserved for `context.Context` type parameters to accept context variables, especially in `service` layer methods. For example:

```go
// Perform user login
func (s *userService) Login(ctx context.Context, loginReq *define.UserServiceLoginReq) error {
    ...
}

// Query content list
func (s *contentService) GetList(ctx context.Context, r *define.ContentServiceGetListReq) (*define.ContentServiceGetListRes, error) {
    ...
}

// Create reply content
func (s *replyService) Create(ctx context.Context, r *define.ReplyServiceCreateReq) error {
    ...
}
```

Additionally, by convention, the last return parameter of a method is often of the `error` type. If you are sure that this method will never produce an `error` internally, it can be ignored.

### `Context` Object Retrieval

Pass the `context.Context` context variable into the following encapsulated methods in `service`. The `context.Context` context variable can be obtained through the `r.Context()` method in `GoFrame` framework's `HTTP` requests, and in `GRPC` requests, the first parameter of the compiled `pb` file's execution method is fixed as `context.Context`.

```go
service.Context.Get(ctx)
```

### Custom `Key-Value`

Set/retrieve custom `key-value` pairs in the following manner.

```go
// Set custom key-value pairs
service.Context.Get(ctx).Data[key] = value

...

// Retrieve custom key-value pairs
service.Context.Get(ctx).Data[key]
```

## V. Precautions

1. Context variables should only pass necessary link parameter data and should not be stuffed with any parameter. Especially for data passed as method parameters, do not stuff them into the context, but should be explicitly passed as method parameters.
2. Context variables are only for temporary use at runtime and should not be stored for long-term use. For example, serializing `ctx` and storing it in the database, and then deserializing it for use in the next request is the wrong approach.
