# Command - Interaction

## Introduction

The `gcmd` component supports reading user input data from the terminal, commonly used in terminal interaction scenarios.

Related methods:

```go
func Scan(info ...interface{}) string
func Scanf(format string, info ...interface{}) string
```

Both methods display the given information to the terminal and automatically read user input from the terminal, returning it upon pressing the Enter key.

## `Scan` Usage

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/os/gcmd"
)

func main() {
    name := gcmd.Scan("What's your name?\n")
    fmt.Println("Your name is:", name)
}
```

After execution, interaction example:

```
> What's your name?
john
> Your name is: john
```

## `Scanf` Usage

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/os/gcmd"
)

func main() {
    name := gcmd.Scan("> What's your name?\n")
    age := gcmd.Scanf("> Hello %s, how old are you?\n", name)
    fmt.Printf("> %s's age is: %s", name, age)
}
```

After execution, interaction example:

```
> What's your name?
john
> Hello john, how old are you?
18
> john's age is: 18
```

> Page: https://goframe.org/en/docs/core/gcmd-scan
