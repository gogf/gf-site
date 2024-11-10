---
slug: '/docs/cli/build'
title: 'Cross Compilation - Build'
sidebar_position: 4
hide_title: true
---

# Cross Compilation - Build

## Usage

For specific parameters, use `gf build -h` to view help.

This command is limited to cross-compiling projects that use the `GoFrame` framework and supports direct cross-compilation for most common systems.

## Built-in Compilation Variables

The `build` command automatically embeds compilation variables, which can be customized by users and retrieved at runtime through the `gbuild` component. Projects using `gf build` will have the following variables embedded by default (refer to `gf -v`):

- Current `Go` version
- Current `GoFrame` version
- Current `Git Commit` (if it exists)
- Current compilation time

## Compilation Configuration File

`build` supports specifying compilation parameters and options from both the command line and configuration files. All components and all ecosystem projects of the `GoFrame` framework use the same configuration management component. The default configuration file and usage are detailed in the section [Configuration Management](/docs/core/gcfg). Below is a simple configuration example for reference:

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

The meanings of the configuration options are the same as their command-line counterparts.

| Name | Default Value | Meaning | Example |
| --- | --- | --- | --- |
| `name` | Same as the program entry `go` file | The name of the generated executable file. If it's the `windows` platform, it will default to adding the `.exe` suffix | `gf` |
| `arch` | Current system architecture | Compilation architecture, multiple separated by `,`, if `all` indicates compilation for all supported architectures | `386,amd64,arm` |
| `system` | `Current system platform` | Compilation platform, multiple separated by `,`, if `all` indicates compilation for all supported platforms | `linux,darwin,windows` |
| `path` | `./bin` | Directory address where the compiled executable file is stored | `./bin` |
| `mod` |  | Same as `go build -mod` compilation option, not commonly used | `none` |
| `cgo` | `false` | Whether to enable `CGO`, it is closed by default. If enabled, cross-compilation may have issues |  |
| `packSrc` |  | Directories to be packaged, multiple separated by `,`, generated into `internal/packed/build_pack_data.go` | `public,template,manifest` |
| `packDst` | `internal/packed/build_pack_data.go` | The path of the generated `Go` file after packaging, usually specified with a relative path to the project directory |  |
| `version` |  | Program version, if a version is specified, an additional directory named after the version will be created in the program's path | `v1.0.0` |
| `output` |  | The path of the output executable file, when this parameter is specified, the `name` and `path` parameters become invalid, commonly used for compiling a single executable file. | `./bin/gf.exe` |
| `extra` |  | Additional custom compilation parameters, directly passed to the `go build` command |  |
| `varMap` |  | Custom built-in variable key-value pairs, the binary can retrieve compilation information through the `gbuild` package. | ```<br />gfcli:<br />  build:<br />    name:     "gf"<br />    arch:     "all"<br />    system:   "all"<br />    mod:      "none"<br />    cgo:      0<br />    varMap:<br />      k1: v1<br />      k2: v2<br />``` |
| `exitWhenError` | `false` | When a compilation error occurs, immediately stop subsequent execution and exit the compilation process (using `os.Exit(1)`) |  |
| `dumpEnv` | `false` | Print the current compilation environment's environment variable information in the terminal before each compilation |  |

:::tip
Built-in variables during compilation can be retrieved at runtime through the `gbuild` package [Build Information - gbuild](/docs/components/os-gbuild).
:::

## Usage Example

```bash
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