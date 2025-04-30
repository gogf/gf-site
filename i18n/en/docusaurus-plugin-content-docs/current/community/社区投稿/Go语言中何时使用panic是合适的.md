---
slug: "/articles/when-to-use-panic-in-go"
title: "When to Use Panic? Deep Dive into Go Error Handling Best Practices"
hide_title: true
unlisted: false
keywords: ["GoFrame", "panic", "recover", "error handling", "code defects", "expected errors", "Go best practices", "safety checks"]
description: "A deep dive into when to use panic instead of returning errors in Go, analyzing the differences between expected errors and code defects, and exploring best error handling strategies in safety checks, configuration loading, and other scenarios."
---



## Comparing panic and Error Returns

Let's start with a simple example. Suppose we want to create a `timeIn` function that takes a timezone name and returns the current time in that timezone.

In `Go`, when the `timeIn` function encounters an error, the standard practice is to return the error to the caller, allowing them to decide how to handle it. The code looks like this:

```go
package main

import (
    "fmt"
    "os"
    "time"
)

func timeIn(zone string) (time.Time, error) {
    loc, err := time.LoadLocation(zone)
    if err != nil {
        return time.Time{}, err  // Return any error produced by time.LoadLocation()
    }

    return time.Now().In(loc), nil
}

func main() {
    tz := "Asia/Shang"
    t, err := timeIn(tz)
    if err != nil {
        fmt.Println("Error:", err)
        os.Exit(1)
    }

    fmt.Println("Current time in", tz, "is", t)
}
```

```bash
$ go run main.go
Error: unknown time zone Asia/Shang
exit status 1
```

Of course, you could choose another approach: using `panic` to handle errors inside the `timeIn` function instead of returning the error to the caller. The code could be written like this:

```go
package main

import (
    "fmt"
    "time"
)

func timeIn(zone string) time.Time {
    loc, err := time.LoadLocation(zone)
    if err != nil {
        panic(err) // Call panic() with the error as an argument
    }

    return time.Now().In(loc)
}

func main() {
    tz := "Asia/Shang"
    t := timeIn(tz)
    fmt.Println("Current time in", tz, "is", t)
}
```

```bash
$ go run main.go
panic: unknown time zone Asia/Shang

goroutine 1 [running]:
main.timeIn({0x4c2c7e?, 0x7d40fe626108?})
    /tmp/main.go:11 +0xc5
main.main()
    /tmp/main.go:20 +0x2b
exit status 2
```

When using `panic` in `Go` code, the following four steps occur:

1. **Immediately stop the current function**: Code after the `panic` statement in the function will not be executed.
2. **Execute all `defer` functions**: All `defer` statements in the current goroutine are executed in "last in, first out" order.
3. **Print error information**: Output "panic:" followed by the error message passed to `panic`, and display the call stack of the current goroutine.
4. **Terminate the program**: End the program execution with exit code `2`.

However, there is a way to prevent program termination: use the `recover` function in a `defer` function to catch and handle the `panic`. This will only execute up to step `2`, and steps `3` and `4` will not occur.

## Why is panic Considered Bad?

`panic` itself is not a bad thing. In fact, it provides some useful features, such as executing all `defer` functions and printing detailed stack information.

But in most cases, returning errors is a better choice. The reason is:

When using `panic`, the program follows a fixed process (stop function, execute `defer`, print error, terminate program), but you cannot control this process.

When a function returns an error, the caller has complete freedom to decide how to handle the error. For example, the caller can:
- Log the error
- Display the error message to the user
- Retry calling the function
- Ignore the error
- Pass the error up to a higher-level caller

This flexibility allows the program to handle various error situations more elegantly.

Returning errors has other benefits:
- **Richer context information**: When passing errors up the call stack, you can choose to "wrap" them, providing additional context information at each step. This extra context can make errors more informative and useful, and potentially easier to debug than relying solely on the stack trace from a `panic`.
- **Easier to test**: It's easier to write unit tests for functions that return errors. While it's not impossible to verify that a function triggers a `panic` as expected during testing, it's more awkward and less clear than simply checking error return values.
- **Better library design**: If you're creating a package for others to import and use, returning errors instead of triggering `panic` is more elegant. Remember: `panic` terminates the running application (current goroutine), which may not be what users of your package expect. It's better to return an error and let the caller decide what to do next. If they wish, they can actively call `panic` based on the returned error.
- **Consistent with Go conventions**: Finally, this is the Go way. Errors are typically returned - this is how the `Go` standard library does it, and it's the standard practice expected by other `Go` developers. By adhering to this convention, your code becomes more predictable and easier for others to understand.

## When is panic Appropriate?

To answer this question, we need to distinguish between two different types of errors: "expected errors" and "code defects".

### Expected Errors

**Expected errors** are those that may occur during normal operation. For example:
- Database connection failures
- Network resources being unavailable
- Insufficient file permissions
- Operation timeouts
- User input not meeting requirements

These errors don't indicate that there's a problem with your program; they're caused by external factors. Since these errors are foreseeable, they should be handled by returning errors, not by using `panic`.

### Code Defects

**Code defects** refer to errors that "should not happen". These errors are typically caused by:
- Developers writing incorrect code
- Flaws in program logic
- Using a function or feature incorrectly

These types of errors should be discovered and resolved during development or testing, not in production.

When encountering code defects, it means the program is already in an unexpected, unpredictable state. In such cases, using `panic` might be an appropriate choice.

Despite the various benefits of returning errors mentioned earlier, there are specific situations where using `panic` might be a better choice.

Two main scenarios where using `panic` might be appropriate:

1. **When errors are unrecoverable**: When the encountered error makes it impossible for the program to continue running safely, and there's no reasonable way to handle such a situation.

2. **When error handling would make the code overly complex**: If handling certain rare error situations would require adding a large amount of error handling code throughout the codebase, it might make the code very complex and difficult to maintain. Especially when these errors shouldn't occur under normal circumstances.

There are many examples in the `Go` standard library that use `panic`, which well illustrate when using `panic` is appropriate:

### Examples of panic in the Go Standard Library

- When dividing a number by `0`
- When accessing an out-of-bounds element in an array or slice
- When attempting to use a `nil` pointer
- When attempting to write data to a `nil` map
- When unlocking an unlocked mutex
- When sending data to a closed channel
- When defining two flags with the same name in the same `flag.FlagSet`
- When passing an invalid HTTP status code (less than `100` or greater than `999`) to `http.ResponseWriter.WriteHeader()`
- When the counter of a `sync.WaitGroup` becomes negative

### Common Traits in These Examples

Looking carefully at these examples, we can identify two important common traits:

1. **They are all code defects**: These situations all indicate logical errors or improper usage in the code. In a normal program, these situations should be discovered and resolved during development or testing.

2. **Using error returns would make the code overly complex**: Imagine how complex and bloated the code would become if you had to check for errors every time you perform a division operation, access an array element, or use a `map`.

Therefore, using `panic` in these situations is a reasonable choice, as they are either unrecoverable errors or situations where using error returns would make the code overly complex.

Of course, determining what level of error handling complexity is "difficult to accept" varies from person to person and depends on the specific characteristics of the project. There is no absolute standard answer.

In addition to the situations mentioned above, there are two other common scenarios where using `panic` is appropriate:

1. **As a last line of defense**: Sometimes we add safety checks in the code to prevent situations that "absolutely should not happen". If these checks fail and trigger a `panic`, it usually indicates that there's a serious `bug` or logical error in the program.

2. **When the program cannot continue**: In some cases, an error might put the program in a state where it cannot continue running, and there's no other suitable way to handle the error. In such cases, using `panic` might be the only option.

## Practical Case Analysis

So far, we've discussed the theoretical principles of using `panic`. Now, let's look at how these principles apply through some practical code examples.

It's important to emphasize that `panic` should be used cautiously, only in truly appropriate situations. In my practical work experience, about half of the projects don't use `panic` at all, and even when they do, it's only in a few critical locations.

Below are several cases of using `panic` that I've encountered in real projects, which can help us better understand when using `panic` is appropriate.

### Example 1: Context Check in Web Applications

This example comes from a web application where we need to get user information from the request context:

```go
type contextKey string

const userContextKey = contextKey("user")

func contextGetUser(r *http.Request) user.User {
    user, ok := r.Context().Value(userContextKey).(user.User)
    if !ok {
        panic("missing user value in request context")
    }

    return user
}
```

The design of this function is based on an important premise: **we only call this function when we are certain that user information exists in the context**. So, if the user information doesn't exist, it means there's a serious logical error in our code.

Of course, we could also make the `contextGetUser` function return an error instead of using `panic`. This way, the caller can handle the error, for example, by logging it and returning a 500 error to the user.

However, considering that this function is frequently called in the program, if we had to handle this error that shouldn't occur under normal circumstances every time we call it, it would lead to a lot of error handling logic in the code. Therefore, using `panic` in this case is an appropriate choice.

### Example 2: Environment Variable Configuration Loading

This example demonstrates handling configuration during program startup:

```go
func getEnvInt(key string, defaultValue int) int {
    value, exists := os.LookupEnv(key)
    if !exists {
        return defaultValue
    }

    intValue, err := strconv.Atoi(value)
    if err != nil {
        panic(err)
    }

    return intValue
}
```

The purpose of this `getEnvInt` function is to read values from environment variables and convert them to integers. If the environment variable doesn't exist, it returns the default value; but if the environment variable exists but cannot be converted to an integer, it triggers a `panic`.

At first glance, this might not seem to align with the principles of using `panic`. After all, an environment variable value that cannot be converted to an integer is a completely possible situation and should be classified as an "expected error".

But the usage scenario of this function is special: it's only used to load basic configurations when the program starts, such as:

```go
httpPort := getEnvInt("HTTP_PORT", 3939)
```

At this stage, other parts of the program (including the logging system) haven't been fully initialized. If configuration loading fails, the program cannot run normally, and there's no suitable way to handle this error (like logging).

In this case, using `panic` is reasonable because:

1. The program cannot continue running without the correct configuration
2. There's no better error handling mechanism at this early stage

Of course, we could also make the `getEnvInt` function return an error, and then let the caller decide whether to trigger a `panic`. But this would add extra error handling code, and the end result might still be the same. Therefore, directly triggering a `panic` inside the `getEnvInt` function is a more concise approach.

### Example 3: SQL Injection Protection

This example shows how to use `panic` as a security protection mechanism:

```go
var safeChars = regexp.MustCompile("^[a-z0-9_]+$")

type SortValues struct {
    Column    string
    Ascending bool
}

func (sv *SortValues) OrderBySQL() string {
    if !safeChars.MatchString(sv.Column) {
        panic("unsafe sort column: " + sv.Column)
    }

    if sv.Ascending {
        return fmt.Sprintf("ORDER BY %s ASC", sv.Column)
    }

    return fmt.Sprintf("ORDER BY %s DESC", sv.Column)
}
```

The background of this code is: we need to generate `SQL` query statements based on user input, which includes a dynamic `ORDER BY` part.

There's a security issue here: `SQL` doesn't support using parameter placeholders (like `?` or `:param`) in the `ORDER BY` clause, so we must directly insert the column name into the `SQL` string. This brings the risk of `SQL` injection.

Under normal circumstances, before calling the `OrderBySQL` method, other code should have already verified whether the value of the `Column` field is in the allowed column name whitelist. But if this verification step is missed due to a `bug` in the program or developer oversight, it could lead to `SQL` injection attacks.

Therefore, we added an extra safety check in the `OrderBySQL` method to ensure that the `Column` field only contains safe characters (lowercase letters, numbers, and underscores). If unsafe characters are detected, a `panic` is triggered.

The reason for using `panic` instead of returning an error in this case is:

1. This check is a "last line of defense" and shouldn't fail under normal circumstances
2. If this check fails, it means there's a serious security vulnerability in the program
3. In this situation, stopping the program immediately is safer than continuing to run and potentially causing database damage

## Summary

Through the above discussion and examples, we can draw the following conclusions:

In `Go` programming, in most cases, you should choose to return errors rather than use `panic`. This aligns with `Go`'s design philosophy and best practices.

However, in the following specific situations, using `panic` might be an appropriate choice:

1. **When errors are unrecoverable**: When the program encounters an error that makes it impossible to continue running safely.

2. **When error handling would make the code overly complex**: When a large amount of additional error handling code would need to be added to handle very rare error situations.

3. **As a security protection mechanism**: Adding safety checks in the code to prevent situations that absolutely should not happen.

4. **When there's no better way to handle errors**: Such as configuration loading errors during program startup.

Most importantly, remember that `panic` causes the program to terminate (unless caught by `recover`), so it should be used cautiously, only in truly appropriate situations.
