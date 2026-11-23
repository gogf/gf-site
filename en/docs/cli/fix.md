# Compatibility Fix

**Tip**

This command has been available since framework version `v2.3`.

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

> Page: https://goframe.org/en/docs/cli/fix
