---
slug: '/docs/cli/up'
title: 'Version Upgrade'
sidebar_position: 2
hide_title: true
keywords: [GoFrame, GoFrame Framework, CLI Tools, Version Update, Auto Fix, Incompatible Changes, Main Framework, Community Components, Command Line Options, Code Upgrade]
description: "Use the GoFrame framework's gf up command for version upgrades. The gf up command can update both the main framework and the CLI tool versions and automatically fix incompatible code changes during the upgrade process. This article provides detailed usage, command options, and examples to help users complete the upgrade process safely and efficiently."
---
:::tip
This command is available starting from framework version `v2.3`.
:::
## Usage

```text
$ gf up -h
USAGE
    gf up [OPTION]

OPTION
    -a, --all    upgrade both version and cli, auto fix codes
    -c, --cli    also upgrade CLI tool
    -f, --fix    auto fix codes(it only make sense if cli is to be upgraded)
    -h, --help   more information about this command

EXAMPLE
    gf up
    gf up -a
    gf up -c
    gf up -cf
```

It is used to achieve version updates, simultaneously updating the main framework version and community components to the latest version.

Option explanation:

| Name | Meaning |
| --- | --- |
| `all` | Simultaneously update the `cli` tool version and automatically fix local code incompatibility changes during the upgrade |
| `fix` | Automatically fix local code incompatibility changes during the upgrade |
| `cli` | Also update the `cli` tool version during the upgrade |

## Usage Example

```text
$ gf up -a
start upgrading version...
upgrading "github.com/gogf/gf/contrib/drivers/mysql/v2" from "v2.2.4" to "latest"
go: upgraded github.com/BurntSushi/toml v1.1.0 => v1.2.1
go: upgraded github.com/cespare/xxhash/v2 v2.1.2 => v2.2.0
go: upgraded github.com/clbanning/mxj/v2 v2.5.6 => v2.5.7
go: upgraded github.com/fsnotify/fsnotify v1.5.4 => v1.6.0
go: upgraded github.com/go-sql-driver/mysql v1.6.0 => v1.7.0
go: upgraded github.com/gogf/gf/contrib/drivers/mysql/v2 v2.2.4 => v2.2.6
go: upgraded github.com/gogf/gf/v2 v2.2.4 => v2.2.6
go: upgraded github.com/magiconair/properties v1.8.6 => v1.8.7
go: upgraded github.com/mattn/go-colorable v0.1.12 => v0.1.13
go: upgraded github.com/mattn/go-isatty v0.0.14 => v0.0.17
go: upgraded github.com/mattn/go-runewidth v0.0.13 => v0.0.14
go: upgraded github.com/rivo/uniseg v0.2.0 => v0.4.3
go: upgraded go.opentelemetry.io/otel v1.7.0 => v1.11.2
go: upgraded go.opentelemetry.io/otel/sdk v1.7.0 => v1.11.2
go: upgraded golang.org/x/net v0.0.0-20220621193019-9d032be2e588 => v0.5.0
go: upgraded golang.org/x/sys v0.0.0-20220615213510-4f61da869c0c => v0.4.0
go: upgraded golang.org/x/text v0.3.8-0.20220509174342-b4bca84b0361 => v0.6.0
go: upgraded golang.org/x/tools v0.1.11-0.20220504162446-54c7ba520b92 => v0.1.12

upgrading "github.com/gogf/gf/v2" from "v2.2.4" to "latest"

auto fixing path "/Users/john/Workspace/Go/GOPATH/src/github.com/Khaos/eros"...
done!
```

## Precautions

Please commit local modifications or back up the directory with `git` before running the command.