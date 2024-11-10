---
slug: '/docs/cli/run'
title: 'Automatic Compilation - Run'
sidebar_position: 6
hide_title: true
---


## Notes

Since `Go` does not support hot compilation features, you have to manually stop, compile, and run the code files after every change. The `run` command does not implement hot compilation but provides an automatic compilation feature. When developers modify `go` files in the project, this command will automatically compile the current program, stop the existing program, and run the new version of the program.
:::tip
The `run` command recursively monitors all `go` file changes in the **current running directory** to achieve automatic compilation.
:::

## Usage Help

```bash
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

Configuration file format example:

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

| Name | Default Value | Meaning | Example |
| --- | --- | --- | --- |
| `path` | `./` | Specifies the directory where the compiled binary file is stored. |  |
| `extra` |  | Specifies the command parameters for the underlying `go build` |  |
| `args` |  | Specifies the command-line arguments for running the binary file |  |
| `watchPath` |  | Specifies the file path format for local project file listening, supports multiple paths separated by `,`. The format of this parameter is the same as the argument for the standard library's `filepath.Match` method | `internal/*.go` |

## Usage Example

Generally, `gf run main.go` is sufficient.

```bash
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