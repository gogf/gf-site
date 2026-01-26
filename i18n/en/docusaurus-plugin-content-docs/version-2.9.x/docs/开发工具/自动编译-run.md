---
slug: '/docs/cli/run'
title: 'Auto Compiling'
sidebar_position: 6
hide_title: true
keywords: [GoFrame, auto compile, hot compile feature, go file auto monitor, command line arguments, compile run, binary files, file path monitoring, GoFrame framework, gf run command]
description: "When building a project with the GoFrame framework, learn how to achieve automatic compilation through the gf run command. Although Go language does not inherently support hot compilation features, the gf run command can automatically compile and run a new version of the program when go files in the project change, aiming to improve development efficiency."
---

## Precautions

Since `Go` does not support hot compilation features, every code change requires manually stopping, compiling, and running the code files. The `run` command does not implement hot compilation but provides an automatic compilation feature. When developers modify the `go` files in the project, this command will automatically compile the current program, stop the existing one, and run the new version.
:::tip
The `run` command will recursively monitor all `go` file changes in the **current working directory** to implement automatic compilation.
:::
## Usage Help

```text
$ gf run -h
USAGE
    gf run FILE [OPTION]

ARGUMENT
    FILE    building file path.

OPTION
    -p, --path         output directory path for built binary file. it's "./" in default
    -e, --extra        the same options as "go run"/"go build" except some options as follows defined
    -a, --args         custom arguments for your process
    -w, --watchPaths   watch additional paths for live reload, separated by ",". i.e. "manifest/config/*.yaml"
    -h, --help         more information about this command

EXAMPLE
    gf run main.go
    gf run main.go --args "server -p 8080"
    gf run main.go -mod=vendor
    gf run main.go -w "manifest/config/*.yaml"

DESCRIPTION
    The "run" command is used for running go codes with hot-compiled-like feature,
    which compiles and runs the go codes asynchronously when codes change.

```

Example of configuration file format:

```yaml
gfcli:
  run:
    path:  "./bin"
    extra: ""
    args:  "all"
    watchPaths:
    - api/*.go
    - internal/controller/*.go
```

Parameter introduction:

| Name | Default | Meaning | Example |
| --- | --- | --- | --- |
| `path` | `./` | Specifies the directory to store the compiled binary files. |  |
| `extra` |  | Specifies the command arguments for underlying `go build` |  |
| `args` |  | Specifies the command line arguments for running the binary files |  |
| `watchPath` |  | Specifies the file path format for local project file monitoring. Multiple paths can be separated by `,`. This parameter's format is the same as the `filepath.Match` method parameter in the standard library | `internal/*.go` |

## Usage Example

Generally, `gf run main.go` is sufficient

```text
$ gf run main.go --swagger
2020-12-31 00:40:16.948 build: main.go
2020-12-31 00:40:16.994 producing swagger files...
2020-12-31 00:40:17.145 done!
2020-12-31 00:40:17.216 gf pack swagger packed/swagger.go -n packed -y
2020-12-31 00:40:17.279 done!
2020-12-31 00:40:17.282 go build -o bin/main  main.go
2020-12-31 00:40:18.696 go file changes: "/Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf-demos/packed/swagger.go": WRITE
2020-12-31 00:40:18.696 build: main.go
2020-12-31 00:40:18.775 producing swagger files...
2020-12-31 00:40:18.911 done!
2020-12-31 00:40:19.045 gf pack swagger packed/swagger.go -n packed -y
2020-12-31 00:40:19.136 done!
2020-12-31 00:40:19.144 go build -o bin/main  main.go
2020-12-31 00:40:21.367 bin/main
2020-12-31 00:40:21.372 build running pid: 40954
2020-12-31 00:40:21.437 [DEBU] [ghttp] SetServerRoot path: /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf-demos/public
2020-12-31 00:40:21.440 40954: http server started listening on [:8199]
...
```

## Common Issues

[too many open files on macOS](https://github.com/fsnotify/fsnotify/issues/129)