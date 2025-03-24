---
slug: '/docs/cli/gen'
title: 'Code Generating'
sidebar_position: 5
hide_title: true
keywords: [Code Generation, GoFrame, CLI Tool, Project Development, Enterprise-Level Project, Code Standards, Team Collaboration, Development Efficiency, ORM Models, Protobuf Files]
description: "Starting from version v2, the CLI tool is integrated with the latest version of the GoFrame framework, providing developers with code generation features to standardize project code writing and simplify development complexity. Especially in enterprise-level and team projects, the CLI tool can significantly enhance development efficiency, allowing developers to focus on business logic."
---
:::info
Starting from version `v2`, the latest version of the `CLI` tool features will be compiled with the latest version of the `GoFrame` framework. If there is a compatibility issue between the auto-generated code of the local `CLI` tool and the project's `GoFrame` framework version, it is recommended to upgrade the project framework version or customize the installation of an older version of the `CLI` tool. For the installation method of the old version of the CLI tool, refer to the repository homepage introduction: [https://github.com/gogf/gf-cli](https://github.com/gogf/gf-cli)
:::
## Important Note🔥

- The code generation function provided by the `CLI` tool aims to **standardize project code writing**, **simplify project development complexity**, and **allow developers to focus on business logic itself**.
- The `CLI` tool itself requires a certain degree of prior learning and understanding cost (try to understand why), but once proficient, everyone's development work will be twice as effective with half the effort.
- The code generation function of the `CLI` tool will be highly beneficial for enterprise-level projects and multi-member team projects. However, for small single-person projects, developers can evaluate whether to use it based on personal preference. The `GoFrame` framework itself only provides basic components and adopts a modular and flexible design without strict requirements on project code; however, the `CLI` tool will have some restrictions to ensure that each member of the team maintains consistent pace and style, preventing developers from writing code too freely.

## Usage

```text
$ gf gen -h
USAGE
    gf gen COMMAND [OPTION]

COMMAND
    ctrl        parse api definitions to generate controller/sdk go files
    dao         automatically generate go files for dao/do/entity
    enums       parse go files in current project and generate enums go file
    pb          parse proto files and generate protobuf go files
    pbentity    generate entity message files in protobuf3 format
    service     parse struct and associated functions from packages to generate service go file

DESCRIPTION
    The "gen" command is designed for multiple generating purposes.
    It's currently supporting generating go files for ORM models, protobuf and protobuf entity files.
    Please use "gf gen dao -h" for specified type help.
```

## Documentation

import DocCardList from '@theme/DocCardList';

<DocCardList />