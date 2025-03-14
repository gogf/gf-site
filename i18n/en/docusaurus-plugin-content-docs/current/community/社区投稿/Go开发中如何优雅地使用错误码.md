---
slug: "/articles/use-error-code-gracefully-in-golang"
title: "How to Use Error Codes Gracefully in Go Development"
hide_title: true
keywords: ["goframe", "error code", "gerror", "error handling", "go", "best practices"]
description: "This article discusses the history of error codes, their use cases and best practices, along with practical guidance using the gerror component of the GoFrame framework"
---


## Evolution of Error Codes

The concept of error codes dates back to the early days of computer systems. At the operating system level, error codes typically exist as integers, such as return values and `errno` in `Unix` systems.

### From Operating System to Application Layer

In `Unix/Linux` systems, error codes exist in the form of `errno`, where each error code corresponds to a specific error condition, such as `ENOENT` (file does not exist) and `EPERM` (permission denied). This error code mechanism laid the foundation for later application development.

### HTTP Status Codes

With the development of the `Web`, the `HTTP` protocol introduced a status code mechanism, such as `200 OK`, `404 Not Found`, `500 Internal Server Error`, etc. These status codes have become the standard for error handling in `Web` applications.

### Microservice Error Codes

In microservice architecture, error codes have become more complex and structured. Modern systems typically adopt a multi-level error code structure, including service identifiers, module identifiers, and specific error codes.

## Why Use Error Codes

In modern software development, error codes have become an indispensable component. There are several important reasons for using error codes:

### 1. Standardized Error Handling

- **Systematic Error Identification**: Error codes allow systems to quickly identify and classify errors without parsing error message text.
  
    ```go
    // Using error codes for condition checking
    if err := doSomething(); err != nil {
        if code := gerror.Code(err); code == CodeUserNotFound {
            // Handle case where user is not found
        } else if code == CodePermissionDenied {
            // Handle case where permission is denied
        }
    }
    ```

- **Automated Processing**: Automated error handling and monitoring strategies can be implemented based on error codes.

  ```go
  // Error handling in middleware
  func ErrorHandlerMiddleware(r *ghttp.Request) {
      r.Middleware.Next()
      if err := r.GetError(); err != nil {
          code := gerror.Code(err)
          // Handle different categories based on error code
          switch code {
          case CodeUnauthorized:
              r.Response.WriteStatus(http.StatusUnauthorized)
          case CodeForbidden:
              r.Response.WriteStatus(http.StatusForbidden)
          default:
              r.Response.WriteStatus(http.StatusInternalServerError)
          }
          // Log error
          g.Log().Error(r.Context(), err)
      }
  }
  ```

### 2. Internationalization Support

- **Language Independence**: Error codes can be mapped to error messages in different languages, enabling internationalization.

  ```go
  // Implementation using gi18n middleware
  func ErrorI18nMiddleware(r *ghttp.Request) {
      r.Middleware.Next()
      // Get error
      if err := r.GetError(); err != nil {
          // Get error code
          code := gerror.Code(err)
          // Get request language
          lang := r.GetHeader("Accept-Language")
          if lang == "" {
              lang = "en-US" // Default language
          }
          ctx := gi18n.WithLanguage(r.Context(), lang)
          // Get localized error message using gi18n
          message := gi18n.Translate(ctx, code)
          // Return standard response
          r.Response.WriteJson(ghttp.DefaultHandlerResponse{
              Code:    code,
              Message: message,
          })
      }
  }
  ```

### 3. Interface Contract

- **Frontend-Backend Consistency**: Error codes serve as a standard protocol for frontend-backend interaction, ensuring interface consistency. The frontend can make different UI interactions based on the error codes returned by the backend. For example, in the following case, the frontend will guide the user to the login process based on the user not logged in error code.
  ```json
  // API response format
  {
      "code": 1001,
      "message": "User not logged in",
      "data": null
  }
  ```
  

- **Version Compatibility**: Error codes help maintain API version compatibility even when error messages change.

### 4. Security Considerations

- **Sensitive Information Hiding**: Error codes help hide sensitive information, preventing exposure of internal implementation details to users, such as database SQL execution error messages.

- **Information Leakage Prevention**: Directly returning exception stack information might leak system structure details like system architecture, file paths, and code line numbers, which can be avoided by using error codes.


## Integer vs String Error Codes

There are two common types of error codes: **Integer** and **String**. In Go development, choosing between integer or string error codes depends on specific scenarios and requirements. Here are some guidelines and best practices.

### 1. Integer Error Codes

Integer error codes are the most common choice, particularly in traditional communication services where they help reduce network bandwidth usage. They have the following characteristics:

- **Performance Advantage**: Integer comparisons are faster than string comparisons, improving performance in scenarios with frequent error code checks
- **Storage Efficiency**: Integers use less memory, more suitable for scenarios requiring storage of many error codes
- **Compatibility**: Integer error codes are easier to integrate and interoperate with other systems
- **Sortability**: Integer error codes can be easily sorted and range-checked

```go
// Integer error code example
// Using gcode for effective integer-string conversion mapping maintenance
var (
    CodeSuccess       = gcode.New(0, "success", nil)
    CodeUserNotLogin  = gcode.New(10001, "user not login", nil)
    CodeUserNotFound  = gcode.New(10002, "user not found", nil)
)

func HandleError(err error) {
    if code := gerror.Code(err); code == CodeUserNotLogin {
        // Handle invalid input
    }
}
```

**Suitable Scenarios**:
- High-performance systems
- Scenarios requiring integration with other systems
- Scenarios requiring storage of many error codes

### 2. String Error Codes

String error codes have their advantages in certain specific scenarios:

- **Readability**: String error codes are more descriptive, making it easier for developers to understand and debug
- **Flexibility**: Can contain more information, such as module names and error types
- **Extensibility**: No need to predefine all error codes, suitable for rapid iteration

```go
// String error code example
// Ignore integer error code parameter when using gcode
// Use string description field as error code, with optional detailed description field
var (
    ErrInvalidEmail = gcode.New(0, "user.invalid_email", nil)
    ErrUserBlocked  = gcode.New(0, "user.blocked", nil)
)

func ValidateUser(user User) error {
    if !isValidEmail(user.Email) {
        return gerror.NewCode(ErrInvalidEmail)
    }
    return nil
}
```

**Suitable Scenarios**:
- Scenarios requiring high readability and descriptiveness
- Rapid prototype development
- Scenarios requiring flexible error code expansion

### 3. Selection Guidelines

When choosing error code types, consider the following decision tree:

1. Need to integrate with other systems?
   - Yes → Prefer integer error codes
   - No → Proceed to next step
2. Have high performance requirements?
   - Yes → Prefer integer error codes
   - No → Proceed to next step
3. Need rapid iteration and flexible expansion?
   - Yes → Prefer string error codes
   - No → Proceed to next step
4. Need better readability?
   - Yes → Prefer string error codes
   - No → Choose integer error codes

### 4. Best Practices

- **Consistency**: Maintain consistency in error code types within the same project
- **Documentation**: Provide comprehensive documentation regardless of the type chosen
- **Conversion Mechanism**: Provide type conversion methods when both types need to be supported
- **Performance Testing**: Conduct benchmark tests to validate choices in performance-sensitive scenarios


## Comparison of Go Error Handling Patterns

### 1. Predefined Error Management

A pattern that uses predefined error variables to represent specific error conditions. This pattern is simple and clear, suitable for simple errors in basic libraries.

```go
// Define sentinel error
var ErrNotFound = errors.New("not found")

// Usage example
func FindUser(id int) (*User, error) {
    user, exists := users[id]
    if !exists {
        return nil, ErrNotFound
    }
    return user, nil
}
```

**Advantages**:
- Simple to use
- Direct error checking (`err == ErrNotFound`)

**Disadvantages**:
- Lacks context information
- Difficult to extend and combine

**Suitable Scenarios**: Basic libraries, simple error scenarios

### 2. Custom Error Types

Carrying richer error information by defining specific error types. This pattern is suitable for complex business errors that need to convey additional context.

```go
// Define error type
type NotFoundError struct {
    Resource string
    ID       int
}

func (e *NotFoundError) Error() string {
    return fmt.Sprintf("%s with ID %d not found", e.Resource, e.ID)
}

// Usage example
func FindOrder(id int) (*Order, error) {
    order, exists := orders[id]
    if !exists {
        return nil, &NotFoundError{Resource: "order", ID: id}
    }
    return order, nil
}
```

**Advantages**:
- Carries rich context information
- Supports type assertion and error classification

**Disadvantages**:
- Type assertion and type checking are cumbersome
- Requires defining many types

**Suitable Scenarios**: Complex business errors, scenarios requiring context transmission

### 3. `pkg/errors` Wrapping

Implementing error wrapping and stack tracing through the third-party library `pkg/errors`, suitable for scenarios requiring error tracking.

```go
// Error wrapping example
func ProcessOrder(orderID int) error {
    order, err := FindOrder(orderID)
    if err != nil {
        return errors.Wrap(err, "failed to process order")
    }
    // ...
}

// Usage example
func main() {
    err := ProcessOrder(123)
    if err != nil {
        fmt.Printf("%+v\n", err)  // Print complete stack information
    }
}
```

**Advantages**:
- Preserves complete error stack
- Supports error chain tracking

**Disadvantages**:
- Requires third-party library dependency
- Adds additional memory overhead

**Suitable Scenarios**: Scenarios requiring error tracking and debugging

### 4. `gerror` Error Code System

The `gerror` error code system is a structured error handling mechanism provided by the `GoFrame` framework, offering flexible and rich error handling capabilities suitable for enterprise application development.

```go
// Error code definition
var (
    CodeOrderNotFound = gcode.New(2001, "order not found", nil)
)

// Usage example
func GetOrder(orderID int) (*Order, error) {
    order, exists := orders[orderID]
    if !exists {
        return nil, gerror.NewCode(CodeOrderNotFound)
    }
    return order, nil
}

// Error handling
func HandleError(err error) {
    if code := gerror.Code(err); code == CodeOrderNotFound {
        // Handle case where order doesn't exist
    }
}
```

**Advantages**:
- Structured error handling
- Supports error code classification and management
- Preserves complete error stack
- Supports error chain tracking

**Disadvantages**:
- Requires framework integration
- Adds additional memory overhead

**Suitable Scenarios**: Scenarios requiring error tracking and debugging, enterprise application development, unified error management


## Error Code Engineering Management

Taking the project structure recommended by the `GoFrame` framework as an example:
- Error codes specific to business modules should be maintained independently within their respective modules. For example:
    - **User**-related error codes are maintained in `logic/user/user_errcode.go`
    - **Order**-related error codes are maintained in `logic/order/order_errcode.go`
- **Common** error codes are maintained in `logic/errcode/errcode.go` for reuse across business modules





### 1. Monolithic Project

```text
project
├── api             # Interface definitions
├── internal        # Internal implementation
│   ├── logic       # Business logic
│   │   ├── errcode # Common error code definitions
│   │   ├── user
│   │   └── order
...
```

### 2. Monorepo Project

```text
monorepo
├── app         # Services directory
│   ├── app1    # Service 1
│   ├── app2    # Service 2
├── utility     # Utility packages
│   ├── errcode # Common error code definitions
│   ├── utils   # Common utility functions
...
```
Note that in `GoFrame`'s monorepo design, the `utility` directory does not strictly differentiate between business and non-business code.
We recommend an evolutionary approach to project architecture design, where business project maintainers can make their own distinctions as needed.







## Error Code Best Practices

Designing a good error code system is crucial for project maintainability and extensibility. Here are some practical best practices.

### 1. Error Code Design Principles

- **Uniqueness**: Each error code should be unique to avoid conflicts and confusion.
  
- **Readability**: Error codes should have semantic meaning for easy developer understanding and memorization.
  
- **Layered Structure**: Adopt a layered structure for error code design, such as "service-module-error" format. For example:
  ```go
  Error code format: AABBBCCC
  AA: Service identifier, e.g., 10 for user service
  BBB: Module identifier, e.g., 001 for authentication module
  CCC: Specific error code, e.g., 001 for user not logged in
  Example: 10001001 represents user not logged in error in the authentication module of the user service
  ```

- **Extensibility**: The error code system should support future expansion, reserving sufficient space for future use.

### 2. Error Code Classification and Definition

In `GoFrame` projects, we can categorize error codes into different levels, maintained through different classification code files.
We only need to define and maintain error codes, **it's not recommended to define specific error objects** for the following reasons:
- Error codes have a one-to-many relationship with error objects, different error objects can carry different error messages, for example: ```gerror.NewCodef(1001, `user "%s" not found`, userName)```.
- Error objects should be created dynamically at runtime, containing complete error stack traces for current error locations, facilitating code chain tracking and debugging.
- Error codes are suitable for natural transmission between different services and levels, while error objects are only applicable within processes.
- Of course, for error objects generated by basic libraries without error codes, using error object checks still makes sense, for example: `errors.Is(err, sql.ErrNoRows)`. Developers should choose solutions based on their scenarios.

Below are examples of error code file organization and error code definitions.
We use `gcode` to create error codes and maintain mappings between integer values and string descriptions.
```go
// internal/logic/errors/errors_code.go

// System level error codes
var (
    CodeSuccess       = gcode.New(0, "success", nil)          // Success
    CodeUnknownError  = gcode.New(1, "unkhown", nil)          // Unknown error
    CodeNotAuthorized = gcode.New(401, "not authorized", nil) // Not authorized
    CodeForbidden     = gcode.New(403, "forbidden", nil)      // Access forbidden
    CodeNotFound      = gcode.New(404, "not found", nil)      // Resource not found
    CodeServerError   = gcode.New(500, "internal error", nil) // Server error
    // ...
)
```

```go
// internal/logic/errors/errors_code_user.go

// User module error codes (10xx)
var (
    CodeUserNotFound    = gcode.New(1001, "user not found", nil)   // User not found
    CodePasswordInvalid = gcode.New(1002, "invalid password", nil) // Invalid password
    CodeTokenExpired    = gcode.New(1003, "token expired", nil)    // Token expired
    CodeUserDisabled    = gcode.New(1004, "user disabled", nil)    // User disabled
    CodeUserExists      = gcode.New(1005, "user exists", nil)      // User already exists
    // ...
)
```

```go
// internal/logic/errors/errors_code_order.go

// Order module error codes (20xx)
var (
    CodeOrderNotFound  = gcode.New(2001, "order not found", nil) // Order not found
    CodeOrderPaid      = gcode.New(2002, "order paid", nil)      // Order already paid
    CodeOrderCancelled = gcode.New(2003, "order cancelled", nil) // Order cancelled
    CodePaymentFailed  = gcode.New(2004, "payment failed", nil)  // Payment failed
    // ...
)
```

### 3. Practical Usage Example

Creating and handling errors in business logic:

```go
// internal/logic/user/user.go

// Login user login
func (l *User) Login(ctx context.Context, username, password string) (string, error) {
    // Check if user exists
    user, err := l.GetUserByUsername(ctx, username)
    if err != nil {
        return "", err
    }
    if user == nil {
        return "", gerror.NewCode(errors.CodeUserNotFound)
    }
    // Validate password
    if !l.validatePassword(password, user.Password) {
        return "", gerror.NewCode(errors.CodePasswordInvalid)
    }
    // Generate token
    token, err := l.generateToken(user.Id)
    if err != nil {
        return "", gerror.Wrap(err, "generate token failed")
    }
    return token, nil
}
```

### 4. Unified Error Handling at `API` Layer

Implementing interface handling in controllers and directly returning errors:

```go
// api/user/v1/user.go

// LoginReq login request
type LoginReq struct {
    g.Meta `path:"/user/login" method:"post" tags:"user" summary:"User Login"`
    Username string `v:"required#Username cannot be empty"`
    Password string `v:"required#Password cannot be empty"`
}

// LoginRes login response
type LoginRes struct {
    Token string `json:"token"`
}
```

```go
// internal/controller/user/user.go

// Login user login interface
func (c *Controller) Login(ctx context.Context, req *v1.LoginReq) (*v1.LoginRes, error) {
    token, err := c.user.Login(ctx, req.Username, req.Password)
    if err != nil {
        return nil, err
    }
    return &v1.LoginRes{Token: token}, nil
}
```

Intercepting errors in middleware and implementing unified error wrapping and response:
```go
// internal/logic/middleware/middleware_response.go

// Unified interception handling in middleware
func (l *Logic) Response(r *ghttp.Request) {
    r.Middleware.Next()
    var (
        err  = r.GetError()
        res  = r.GetHandlerResponse()
        msg  = err.Error()
        code = gerror.Code(err)
    )
    r.Response.WriteJson(ghttp.DefaultHandlerResponse{
        Code:    code.Code(),
        Message: msg,
        Data:    res,
    })
}
```

## Error Code Practices in Distributed Systems

### 1. Cross-Service Error Propagation

Error codes need to traverse service boundaries in microservice architecture:

```go
// Error code propagation example
type RpcError struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Service string `json:"service"`
}

func WrapRpcError(code int, service string) error {
    return gerror.NewCode(code, gerror.Map{
        "service": service,
    })
}

// Gateway layer error handling
func HandleUpstreamError(err error) {
    if gerror.HasCode(err, CodeServiceUnavailable) {
        // Trigger circuit breaker
        circuitBreaker.Trip()
    }
}
```

### 2. Error Codes and Retry Strategies

Designing intelligent retry strategies based on error codes:

| Error Code Range | Retry Strategy | Wait Time |
|-----------------|----------------|------------|
| `500-599` | Exponential backoff retry `3` times | `100ms, 1s, 10s` |
| `400-499` | No retry | - |
| `100-199` | Immediate retry up to `5` times | `50ms` |

