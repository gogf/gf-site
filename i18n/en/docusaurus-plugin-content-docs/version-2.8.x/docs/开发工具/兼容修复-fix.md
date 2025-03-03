---
slug: '/docs/cli/fix'
title: 'Compatibility Fix'
sidebar_position: 9
hide_title: true
keywords: [GoFrame, GoFrame framework, compatibility fix, CLI usage, code update, version upgrade, backward compatibility, gf fix, command line tool, automatic correction]
description: "The compatibility fix command gf fix provided by the GoFrame framework helps solve backward compatibility issues during framework upgrades. This command has been available since version v2.3, and automatically updates local code to handle minor compatibility issues. It can be executed repeatedly to ensure no side effects."
---
:::tip
This command has been available since framework version `v2.3`.
:::
## Usage Scenarios

During the upgrade of official framework versions, every effort is made to ensure backward compatibility. However, in exceptionally difficult scenarios where complete backward compatibility cannot be ensured and the issues are minor, considering the high cost of adding a major version number, the official team will provide this command to automatically fix compatibility issues. The official team also guarantees that this command can be executed repeatedly without side effects.

## Usage

```text
$ gf fix -h
USAGE
    gf fix

OPTION
    -/--path     directory path, it uses current working directory in default
    -h, --help   more information about this command
```

Used to automatically update local code incompatible changes when upgrading from a lower version (the current `GoFrame` version in `go.mod`) to a higher version (the current `GoFrame` version used by `CLI`).

## Precautions

Please use `git` to commit local changes or back up the directory before executing the command.