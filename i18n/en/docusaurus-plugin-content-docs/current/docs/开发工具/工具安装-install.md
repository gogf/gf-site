---
slug: '/docs/cli/install'
title: 'Installation'
sidebar_position: 0
hide_title: true
keywords: [Tool Installation,GoFrame,GoFrame Framework,gf Tool,Command Line Tool,Precompiled Binary,System Environment Variable,MacOS,Windows Installation,go install]
description: "Install GoFrame tools on different operating systems, including installation methods for MacOS and Windows. Provides download links for precompiled binary files and methods for installation via the go install command, ensuring the gf tool is correctly installed and used in system environment variables."
---

This command is only for downloading and installing precompiled binaries. If the tools are installed via the `go install` command, there is no need to manually use the `install` command to install the `gf` tool.

## Download and Install

### Download the Latest Version

#### `Mac`&`Linux` Quick Download Command

```bash
wget -O gf https://github.com/gogf/gf/releases/latest/download/gf_$(go env GOOS)_$(go env GOARCH) && chmod +x gf && ./gf install -y && rm ./gf
```

#### Windows Requires Manual Download

Determine the current project's `goframe` dependency version, check your system information:

```bash
go env GOOS
go env GOARCH
```

Download link: [releases](https://github.com/gogf/gf/releases)

### Install via `go install`

Note: Add `GOPATH/bin` to the system environment variables, check with `go env GOPATH`.

#### Latest version

```bash
go install github.com/gogf/gf/cmd/gf/v2@latest
```

#### Specify version (version needs to be >= v2.5.5)

```bash
go install github.com/gogf/gf/cmd/gf/v2@v2.5.5
```

### Download Other Versions

#### v2 Version

Precompiled binary download: [releases](https://github.com/gogf/gf/releases)

Source code: [gf/cmd/gf](https://github.com/gogf/gf/tree/master/cmd/gf)

#### v1 Version

Precompiled binary download: [releases](https://github.com/gogf/gf-cli/releases)

Source code: [gogf/gf-cli](https://github.com/gogf/gf-cli)

## Usage

Project address: [https://github.com/gogf/gf/tree/master/cmd/gf](https://github.com/gogf/gf/tree/master/cmd/gf)

Usage: `./gf install`

This command is usually executed after the `gf` command line tool is downloaded locally (note execution permissions), to install the `gf` command into directories supported by the default system environment variables, so that the `gf` tool can be used anywhere in the system.

:::note
Some systems require administrator permissions.

If users under `MacOS` using `zsh` encounter alias conflicts, it can be resolved by `alias gf=gf`. After running once, the `gf` tool will automatically modify the alias settings in the profile, and users can just re-login (or reopen the terminal).
:::

## Usage Example

```bash
$ ./gf_darwin_amd64 install
I found some installable paths for you(from $PATH):
  Id | Writable | Installed | Path
   0 |     true |      true | /usr/local/bin
   1 |     true |     false | /Users/john/Workspace/Go/GOPATH/bin
   2 |     true |     false | /Users/john/.gvm/bin
   4 |     true |     false | /Users/john/.ft
please choose one installation destination [default 0]:
gf binary is successfully installed to: /usr/local/bin
```
