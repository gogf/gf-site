---
slug: '/docs/cli/gen-pb'
title: 'Protocol Compilation - Gen Pb'
sidebar_position: 4
hide_title: true
---
:::tip
This feature is available starting from version `v2.4`.
:::
## Basic Introduction

This command is used to compile `proto` files and generate corresponding `protobuf go` files as well as controller files.

## Command Usage

```bash
$ gf gen pb -h
USAGE
    gf gen pb [OPTION]

OPTION
    -p, --path   protobuf file folder path
    -a, --api    output folder path storing generated go files of api
    -c, --ctrl   output folder path storing generated go files of controller
    -h, --help   more information about this command

EXAMPLE
    gf gen pb
    gf gen pb -p . -a . -c .
```

### Tip

If you are using the project engineering scaffold recommended by the framework and have the `make` tool installed on your system, you can also use the `make pb` shortcut command.

Parameter Description:

| Name | Required | Default Value | Meaning |
| --- | --- | --- | --- |
| `path` | No | `manifest/protobuf` | Points to the `proto` protocol definition file |
| `api` | No | `api` | Points to the directory where the generated interface files are stored |
| `ctrl` | No | `internal/controller` | Points to the directory where the generated controller files are stored |

## Notes

- When generating controller files, it will automatically recognize whether there are corresponding interface implementation methods already existing. If they exist, it will not regenerate the corresponding interface methods to prevent overwrites.
- If you execute this command in the `proto` directory and the specified `path` directory does not exist, then it will automatically compile the local `proto` files, generate the compiled files into the current directory, and automatically disable the generation of controller files.