---
slug: '/docs/cli/install'
title: 'Tool Installation - Install'
sidebar_position: 0
hide_title: true
---


This command is specifically for installing pre-compiled binary downloads. If you install the tool via `go install`, you do not need to manually use the `install` command to install the `gf` tool.

## Download and Installation

### Latest Version Download

#### Quick Download Command for `Mac` & `Linux`

```bash
wget -O gf https://github.com/gogf/gf/releases/latest/download/gf_$(go env GOOS)_$(go env GOARCH) && chmod +x gf && ./gf install -y && rm ./gf
```

#### Windows Requires Manual Download

Determine the current project's `goframe` dependency version and check your system information:

```bash
go env GOOS
go env GOARCH
```

Download link: [releases](https://github.com/gogf/gf/releases)

### Installation via `go install`

```bash
go install github.com/gogf/gf/cmd/gf/v2@latest # For the latest version
go install github.com/gogf/gf/cmd/gf/v2@v2.5.5 # For a specific version (version must be >= v2.5.5)
```

### Other Version Downloads

#### Version v2

Pre-compiled binary download: [releases](https://github.com/gogf/gf/releases)

Source code: [gf/cmd/gf](https://github.com/gogf/gf/tree/master/cmd/gf)

#### Version v1

Pre-compiled binary download: [releases](https://github.com/gogf/gf-cli/releases)

Source code: [gogf/gf-cli](https://github.com/gogf/gf-cli)

## Usage

Project address: [https://github.com/gogf/gf/tree/master/cmd/gf](https://github.com/gogf/gf/tree/master/cmd/gf)

Usage: `./gf install`

This command is typically executed after the `gf` command-line tool is downloaded to the local machine (note the execution permission), and it is used to install the `gf` command into the directory path supported by the system environment variables, making it easy to use the `gf` tool directly from anywhere in the system.

:::note
Some systems may require administrator privileges.

If you are using `zsh` on `MacOS`, you might encounter alias conflicts, which can be resolved by running `alias gf=gf`. After running once, the `gf` tool will automatically modify the alias settings in the `profile`, and users will need to log in again (or reopen the terminal).
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