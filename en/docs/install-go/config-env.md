# Configuration

## Go Environment Variables

For convenience in development, three environment variables often need to be set in the development environment:

1. `$GOROOT`: The installation directory of `go`, which remains unchanged after configuration;
2. `$GOPATH`: The project root path of the `go` project in the local development environment (for project compilation, `go build`, `go install`), this environment variable can differ for different projects during compilation;
3. `$PATH` (important): The `bin` directory of `go` needs to be added to the system `$PATH` to conveniently use related go commands, and it also remains unchanged after configuration;

There is also a detailed explanation of Go's environment variables in the official documentation, please refer to the link: [https://golang.google.cn/doc/install/source](https://golang.google.cn/doc/install/source)

> The `$GOOS` and `$GOARCH` environment variables are two very practical variables that can be used in cross-compilation for different platforms. You only need to set these two variables before `go build`, which is one of the advantages of the go language: it can compile and generate executable files that run across platforms. It feels more efficient and lightweight compared to QT, although the generated executable files are a bit larger, they are still within an acceptable range. For example, to compile an executable file for `Windows x86` under the `Linux amd64` architecture, you can use the following command:
>
> ```
> CGO_ENABLED=0 GOOS=windows GOARCH=386 go build hello.go
> ```
>
> Unfortunately, cross-compilation temporarily does not support the `cgo` method, so you need to set the environment variable `$CGO_ENABLED` to 0. This will generate a `hello.exe` executable file for the `windows x86` architecture in the current directory after execution.

### Environment Variable Settings

Other than the `$PATH` environment, other environment variables are optional.

Why is this step optional? Because future versions of `Go` are gradually beginning to remove support for `$GOPATH`/`$GOROOT`. In addition, there is a `Terminal` function integrated into the `Goland` IDE where the environment variables are already set.

### Setting Environment Variables on `*nix`

On `*nix` systems (such as `Linux/Unix/MacOS/*BSD`, etc.), you need to add the following environment variable settings to `/etc/profile` and then execute the command `#source /etc/profile` to reload the profile configuration file (or log in again) to add the following variables to the user's environment variables:

```bash
export GOROOT=/usr/local/go
export GOPATH=/Users/john/Workspace/Go/GOPATH
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
```

### Setting Environment Variables on `Windows`

For how to modify system environment variables and modify the `PATH` environment variable on Windows, please refer to online tutorials ([Baidu](https://www.baidu.com/s?wd=Windows%20%E4%BF%AE%E6%94%B9%E7%B3%BB%E7%BB%9F%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%20PATH) or [Google](https://www.google.com/search?q=Windows+修改系统环境变量+PATH)).

## IDE Tool Configuration

This article uses the `Goland` development tool as a base to introduce the configuration of common tools in this IDE.

Commonly used tools include:

1. `go fmt`: A unified code formatting tool (mandatory).
2. `golangci-lint`: A static code quality inspection tool used for package quality analysis (recommended).
3. `goimports`: An automatic `import` dependency package tool (optional).
4. `golint`: A code convention inspection tool, which also detects the quality of single-file code and is used by the well-known Go quality assessment site [Go Report](https://goreportcard.com) (optional).

### `go fmt`, `goimports`, `golangci-lint`

Since these three tools are built into `Goland`, the configuration is relatively simple. Refer to the following pictorial operation example:

1. In the `Goland` settings, select `Tools` - `File Watchers`, then choose to add

2. Add these 3 tools in turn by clicking, and use the default configuration

3. Subsequently, while writing code, these 3 tools will be automatically triggered for detection when you save the code files.

### Installing and Configuring `golint` Tool (Optional)

#### Installing `golint`

Since `Goland` does not come with the `golint` tool, you need to download and install it yourself first.

**If you have configured goproxy**, you can directly use `go install golang.org/x/lint/golint@latest` to install, without needing the command below.

Use the following commands to install:

```bash
mkdir -p $GOPATH/src/golang.org/x/
cd $GOPATH/src/golang.org/x/
git clone https://github.com/golang/lint.git
git clone https://github.com/golang/tools.git
cd $GOPATH/src/golang.org/x/lint/golint
go install
```

After a successful installation, you will see the automatically generated `golint` binary tool file in the `$GOPATH/bin` directory.

#### Configuring `golint`

1. Then in the `Tools` - `File Watchers` configuration of `Goland`, by copying the configuration of `go fmt`

2. Modify the three settings `Name`, `Program`, and `Arguments`, where `Arguments` needs to add the `-set_exit_status` parameter, as shown in the figure:

3. Save, and the `golint` tool will be automatically triggered for detection when saving the code during writing.

### Configuring `golangci-lint` (Optional)

1.  Then in the `Tools` - `File Watchers` configuration of `Goland`, by copying the `go fmt` configuration
2. Modify the `Name`, `Program`, and `Arguments` settings, where `Arguments` needs to add the `run $FileDir$` parameter. Note: The options in `\`Advanced Options\`` can be deselected if the machine is relatively slow, as shown in the figure:
3. Save, and the `golangci-lint` tool will be automatically triggered for detection when saving the code during writing.
4. Manage the configuration of `golangci-lint` tools through the `go Linter` plugin. Below is the installation and configuration of `go Linter`.

## IDE Code Style Configuration

> Page: https://goframe.org/en/docs/install-go/config-env
