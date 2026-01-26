---
slug: '/docs/cli/gen-pb'
title: 'Protobuf Compilation'
sidebar_position: 4
hide_title: true
keywords: [GoFrame, GoFrame Framework, Protocol Compilation, protobuf, GoFrame gen pb, Protocol File, Controller File, Command Line Tool, Generate Go File, CLI Tool]
description: "Use the command line tool in the GoFrame framework to compile proto files, generating the corresponding protobuf Go files and controller files. With the gf gen pb command, users can set different paths to store the generated interface and controller files, meeting the needs of project engineering. Additionally, this article lists the usage guide and precautions for this command, allowing developers to better use this feature."
---
:::tip
This feature is available starting from version `v2.4`.
:::
## Introduction

This command is used to compile `proto` files, generating the corresponding `protobuf go` files and corresponding controller files.

## Command Usage

```text
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
    gf gen pb -p . -a . -p .
```
:::tip
If you are using the framework's recommended project scaffold and have the `make` tool installed, you can also use the `make pb` shortcut command.
:::
Parameter Description:

| Name | Required | Default Value | Meaning |
| --- | --- | --- | --- |
| `path` | No | `manifest/protobuf` | Points to the `proto` protocol definition file |
| `api` | No | `api` | Points to the directory where the generated interface files are stored |
| `ctrl` | No | `internal/controller` | Points to the directory where the generated controller files are stored |

## Precautions

- When generating controller files, it will automatically detect whether there is already a corresponding interface implementation method. If it already exists, the corresponding interface method will not be regenerated to prevent overwriting.
- If this command is executed in the `proto` directory and the specified `path` directory does not exist, the local `proto` files will be automatically compiled, and the compiled files will be generated in the current directory with the controller file generation feature automatically disabled.