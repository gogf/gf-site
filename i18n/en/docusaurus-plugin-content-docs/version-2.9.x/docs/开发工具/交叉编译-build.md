---
slug: '/docs/cli/build'
title: 'Cross-Compiling'
sidebar_position: 4
hide_title: true
keywords: [Cross-Compile, GoFrame, Compile Variables, Compilation Configuration, Built-in Variables, Build Information, gf build, Compilation Options, Built-in Compilation, Project Ecosystem]
description: "Cross-compilation using the GoFrame framework. With the gf build command, you can quickly generate an executable file that includes information such as the current Go version, GoFrame version, Git Commit, and more. Supports specifying parameters from both the command line and configuration files, meeting the compilation needs for different operating systems and platforms, providing developers with a convenient build solution."
---

## Usage

For specific parameters, use `gf build -h` to view help.

Limited to cross-compiling projects using the `GoFrame` framework, supporting direct cross-compilation for most common systems.

## Built-in Compile Variables

The `build` command automatically embeds compilation variables, which users can customize and obtain at runtime through the `gbuild` component. Projects using `gf build` will have the following variables embedded by default (refer to `gf -v`):

- Current `Go` version
- Current `GoFrame` version
- Current `Git Commit` (if it exists)
- Current compile time

## Compilation Configuration File

The `build` supports specifying compilation parameters and options from both the command line and configuration file. All components and ecosystem projects of the `GoFrame` framework use the same configuration management component. For the default configuration file and usage, refer to the chapter [Configuration](../核心组件/配置管理/配置管理.md). Below is a simple configuration example for reference:

```yaml
gfcli:
  build:
    name:     "gf"
    arch:     "all"
    system:   "all"
    mod:      "none"
    packSrc:  "resource,manifest"
    version:  "v1.0.0"
    output:   "./bin"
    extra:    ""
```

The definitions of configuration options are the same as the command line options with the same name.

| Name | Default Value | Meaning | Example |
| --- | --- | --- | --- |
| `name` | Same as the program entry `go` file | The name of the generated executable file. If it's the `windows` platform, `.exe` is added by default | `gf` |
| `arch` | Current system architecture | Compile architecture, separated by `,`, `all` indicates compiling for all supported architectures | `386,amd64,arm` |
| `system` | `Current system platform` | Compilation platform, separated by `,`, `all` indicates compiling for all supported platforms | `linux,darwin,windows` |
| `path` | `./bin` | **Directory address** where the compiled executable file is stored | `./bin` |
| `mod` |  | Same as the `go build -mod` compilation option, not commonly used | `none` |
| `cgo` | `false` | Whether to enable `CGO`, disabled by default. If enabled, cross-compilation might have issues. |  |
| `packSrc` |  | Directories to package, separated by `,`, generated to `internal/packed/build_pack_data.go` | `public,template,manifest` |
| `packDst` | `internal/packed/build_pack_data.go` | Path for the generated `Go` file after packaging, generally specified relative to the project's directory |  |
| `version` |  | Program version, if specified, an additional directory with the version name is included in the generated path | `v1.0.0` |
| `output` |  | Path of the output executable file. When specified, `name` and `path` parameters are invalid, commonly used to compile a single executable file. | `./bin/gf.exe` |
| `extra` |  | Additional custom compile parameters, directly passed to the `go build` command |  |
| `varMap` |  | Custom built-in variable key-value pairs, can be obtained from the built binary through the `gbuild` package for compile information. | ```<br />gfcli:<br />  build:<br />    name:     "gf"<br />    arch:     "all"<br />    system:   "all"<br />    mod:      "none"<br />    cgo:      0<br />    varMap:<br />      k1: v1<br />      k2: v2<br />``` |
| `exitWhenError` | `false` | Immediately stop and exit the compilation process (using `os.Exit(1)`) on errors during compilation |  |
| `dumpEnv` | `false` | Prints the environment variable information of the current compilation environment in the terminal before each compilation |  |
:::tip
The built-in variables during compilation can be obtained at runtime through the `gbuild` package [Build Information](../组件列表/系统相关/构建信息-gbuild.md).
:::
## Usage Example

```text
$ gf build
2020-12-31 00:35:25.562 start building...
2020-12-31 00:35:25.562 go build -o ./bin/darwin_amd64/gf main.go
2020-12-31 00:35:28.381 go build -o ./bin/freebsd_386/gf main.go
2020-12-31 00:35:30.650 go build -o ./bin/freebsd_amd64/gf main.go
2020-12-31 00:35:32.957 go build -o ./bin/freebsd_arm/gf main.go
2020-12-31 00:35:35.824 go build -o ./bin/linux_386/gf main.go
2020-12-31 00:35:38.082 go build -o ./bin/linux_amd64/gf main.go
2020-12-31 00:35:41.076 go build -o ./bin/linux_arm/gf main.go
2020-12-31 00:35:44.369 go build -o ./bin/linux_arm64/gf main.go
2020-12-31 00:35:47.352 go build -o ./bin/linux_ppc64/gf main.go
2020-12-31 00:35:50.293 go build -o ./bin/linux_ppc64le/gf main.go
2020-12-31 00:35:53.166 go build -o ./bin/linux_mips/gf main.go
2020-12-31 00:35:55.840 go build -o ./bin/linux_mipsle/gf main.go
2020-12-31 00:35:58.423 go build -o ./bin/linux_mips64/gf main.go
2020-12-31 00:36:01.062 go build -o ./bin/linux_mips64le/gf main.go
2020-12-31 00:36:03.502 go build -o ./bin/netbsd_386/gf main.go
2020-12-31 00:36:06.280 go build -o ./bin/netbsd_amd64/gf main.go
2020-12-31 00:36:09.332 go build -o ./bin/netbsd_arm/gf main.go
2020-12-31 00:36:11.811 go build -o ./bin/openbsd_386/gf main.go
2020-12-31 00:36:14.140 go build -o ./bin/openbsd_amd64/gf main.go
2020-12-31 00:36:17.859 go build -o ./bin/openbsd_arm/gf main.go
2020-12-31 00:36:20.327 go build -o ./bin/windows_386/gf.exe main.go
2020-12-31 00:36:22.994 go build -o ./bin/windows_amd64/gf.exe main.go
2020-12-31 00:36:25.795 done!
```