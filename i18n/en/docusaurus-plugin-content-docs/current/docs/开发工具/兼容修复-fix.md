---
slug: '/docs/cli/fix'
title: 'Compatibility Fix - Fix'
sidebar_position: 9
hide_title: true
---
:::tip
This command has been provided since the framework's `v2.3` version.
:::
## Tip

This command has been available since framework version `v2.3`.

## Usage Scenarios

When the official framework version is upgraded, every effort is made to ensure backward compatibility. However, in scenarios where it is very difficult to guarantee complete backward compatibility, and the compatibility issues are minor, considering the high cost of introducing a new major version, the official command will provide automatic fixes for compatibility issues. The official command ensures that this instruction can be executed repeatedly without side effects.

## Usage

```bash
$ gf fix -h
USAGE
    gf fix

OPTION
    -/--path     directory path, it uses the current working directory by default
    -h, --help   more information about this command
```

Used to automatically update local code incompatible changes when upgrading from a lower version (the `GoFrame` version in the current `go.mod`) to a higher version (the `GoFrame` version used by the current `CLI`).

## Notes

Before executing the command, please commit local modifications with `git` or perform directory backup.