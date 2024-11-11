---
slug: '/docs/cli/gen'
title: 'Code Generation - Gen 🔥'
sidebar_position: 5
hide_title: true
---
:::info
Starting from version `v2`, the latest features of the `CLI` tool are compiled with the latest version of the `GoFrame` framework. If there is a compatibility issue between the locally automated `CLI` tool-generated code and the project's `GoFrame` framework version, it is recommended to upgrade the project framework version or install an older version of the `CLI` tool. For instructions on installing older versions of the `CLI` tool, please refer to the repository's homepage: [https://github.com/gogf/gf-cli](https://github.com/gogf/gf-cli).
:::


## Important Information 🔥

- The code generation feature provided by the `CLI` tool aims to **standardize project code writing**, **simplify project development complexity**, and allow developers to **focus on business logic**.
- There will be a learning curve associated with the `CLI` tool (understanding why it's necessary), but once proficient, it will greatly increase development efficiency.
- The code generation feature of the `CLI` tool is particularly beneficial for enterprise-level projects and multi-member team projects. However, for individual small projects, developers can choose whether to use it based on personal preference. The `GoFrame` framework itself provides basic components with a flexible design and does not impose strict requirements on project code; but the `CLI` tool has certain restrictions to ensure consistency in pace and style among team members, preventing overly casual code writing.

## Usage

```bash
$ gf gen -h
USAGE
    gf gen COMMAND [OPTION]

COMMAND
    ctrl        parse api definitions to generate controller/sdk go files
    dao         automatically generate go files for dao/do/entity
    enums       parse go files in the current project and generate enums go file
    pb          parse proto files and generate protobuf go files
    pbentity    generate entity message files in protobuf3 format
    service     parse struct and associated functions from packages to generate service go file

DESCRIPTION
    The "gen" command is designed for multiple generating purposes.
    It currently supports generating go files for ORM models, protobuf, and protobuf entity files.
    Please use "gf gen dao -h" for help with a specific type.
```

    