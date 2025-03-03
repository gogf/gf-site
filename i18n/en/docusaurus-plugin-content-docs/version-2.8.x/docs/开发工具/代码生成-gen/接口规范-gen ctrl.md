---
slug: '/docs/cli/gen-ctrl'
title: 'Controller Generating'
sidebar_position: 0
hide_title: true
keywords: [GoFrame,API interface,HTTP development,GRPC,controller generation,SDK automation,code specification,collaborative development,code generation,project management]
description: "Generate API interface controllers and SDK code using GoFrame to help developers reduce repetitive code work, standardize API and controller code structure, and improve collaborative development efficiency. Additionally, it offers the functionality to generate HTTP SDK code for easy internal and external service calls. Code generation can be performed using command-line mode and automatic generation mode, and detailed command parameter instructions and usage examples are provided."
---
:::tip
This feature is available from version `v2.5`. Currently, this command only supports `HTTP` interface development; for `GRPC` parts, please refer to the `gen pb` command. In the future, `HTTP` and `GRPC` may be unified to use this command to generate controller and `SDK` source code.
:::
## Introduction

### Pain Points Solved

When developing a project, it often starts with designing the `API` interface based on business requirements and scenarios, using `proto` or `golang struct` to design the `API` input and output. Then, a corresponding controller implementation is created, and an `SDK` (under the condition of the Golang language) may also be provided for internal/external service calls. The following pain points may arise during development:

- **Repetitive code work is cumbersome**. After creating input and output definition files in the `API`, corresponding files need to be created in the controller directory, along with controller initialization code. The operation of repeatedly copying input and output structure names from the `API` code is cumbersome.
- **No reliable normative constraints between the API and controller**. Apart from certain naming constraints for the `API`, there are no constraints for controller creation and method naming. The high flexibility makes it difficult to enforce consistency between API structure names and controller method names, leading to potential maintenance costs as interfaces increase.
- **High probability of code file conflicts in team development collaboration**. When multiple people execute changes to a file, the probability of file conflicts increases, leading to unnecessary energy expenditure in resolving these conflicts.
- **Lack of automated API HTTP SDK generation tool**. After developing the `API`, immediately providing it for internal or external calls often requires manually maintaining the `SDK` code, which can be time-consuming and costly.

### Command Features

- Standardizes API definition and controller file naming, as well as controller implementation method naming.
- Establishes the association between API definitions and controller code, facilitating quick location of API implementations.
- Automatically generates controller interface, controller initialization files and code, and interface initialization code based on API definitions.
- Automatically generates easy-to-use HTTP SDK code according to API definitions. This feature is configurable and turned off by default.
- Supports `File Watch` automation mode: automatically incrementally updates corresponding controller and `SDK` code when an API structure definition file changes.

## Pre-conditions

### Important Norms 🔥

One of the purposes of this command is to standardize `api` code writing, which requires some important norms to be understood (otherwise the code cannot be generated):

- `api` layer's API definition file path needs to satisfy `/api/module/version/definition_file.go`, for example: `/api/user/v1/user.go`, `/api/user/v1/user_delete.go`, etc.
  - **Module** refers to the division of `API` modules, which can be split according to different **business attributes** for easier aggregation and maintenance. Modules can also be considered as specific business resources.
  - **Version** is usually defined as `v1`/`v2`, etc., for compatibility version control of `API`. Different versions are marked by different version numbers when compatibility updates occur. The first version is managed with `v1` by default.
  - **Definition file** refers to the `API` input and output definition files, where each `API` is usually maintained independently in a separate `go` file. Of course, it also supports putting multiple `APIs` in one `go` file for unified maintenance.
- Structure names in `api` definition should conform to the naming convention of `Operation+Req` and `Operation+Res`, e.g., `GetOneReq/GetOneRes`, `GetListReq/GetListRes`, `DeleteReq/DeleteRes`, etc.
  - The operation refers to the current `API` module's operation name, typically corresponding to `CRUD` as: `Create`, `Read`, `Update`, `Delete`.

Below is a `Hello` interface example in the project template:

![](/markdown/71be1e0ac8d8eaa7794a476086c110c2.png)

### Suggested Naming

We provide some suggested naming conventions for common API definitions for your reference:

| Operation Name | Suggested Naming | Notes |
| --- | --- | --- |
| **Query List** | `GetListReq/Res` | Usually to fetch paginated query data records from the database |
| **Query Details** | `GetOneReq/Res` | Usually requires passing the primary key condition to query record details from the database |
| **Create Resource** | `CreateReq/Res` | Typically used to insert one or more data records into a table |
| **Modify Resource** | `UpdateReq/Res` | Typically used to modify one or more data records in a table according to certain conditions |
| **Delete Resource** | `DeleteReq/Res` | Typically used to delete one or more data records in a table according to certain conditions |

## Command Usage

This command analyzes the code within the specified `api` API definition directory and automatically generates the corresponding controller/`SDK Go` code files.

### Manual Mode

To manually execute the command line, run `gf gen ctrl` in the project's root directory. It will completely scan the `api` API definition directory and generate corresponding code.

```text
$ gf gen ctrl -h
USAGE
    gf gen ctrl [OPTION]

OPTION
    -s, --srcFolder       source folder path to be parsed. default: api
    -d, --dstFolder       destination folder path storing automatically generated go files. default: internal/controller
    -w, --watchFile       used in file watcher, it re-generates go files only if given file is under srcFolder
    -k, --sdkPath         also generate SDK go files for api definitions to specified directory
    -v, --sdkStdVersion   use standard version prefix for generated sdk request path
    -n, --sdkNoV1         do not add version suffix for interface module name if version is v1
    -c, --clear           auto delete generated and unimplemented controller go files if api definitions are missing
    -m, --merge           generate all controller files into one go file by name of api definition source go file
    -h, --help            more information about this command

EXAMPLE
    gf gen ctrl

```
:::tip
If using the project's recommended framework scaffolding and `make` tool is installed, `make ctrl` shortcut can also be used.
:::
Parameter explanation:

| Name | Required | Default Value | Meaning |
| --- | --- | --- | --- |
| `srcFolder` | No | `api` | Points to the directory address of `api` API definition files |
| `dstFolder` | No | `internal/controller` | Points to the directory where the generated controller files are stored |
| `watchFile` | No |  | Used in IDE file monitoring, for automatic generation when files change |
| `sdkPath` | No |  | If `HTTP SDK` needs to be generated, this parameter specifies the directory path for storing generated SDK code |
| `sdkStdVersion` | No | `false` | Whether the generated `HTTP SDK` uses standard version management. It will automatically add a version routing prefix according to the `API` version. For example, `v1` version API will have a `/api/v1` request routing prefix added automatically. |
| `sdkNoV1` | No | `false` | In the generated `HTTP SDK`, whether the interface module name should not have the `V1` suffix when the interface is version `v1`. |
| `clear` | No | `false` | Whether to delete generated controller interface files in `internal/controller` when corresponding `api` layer definitions don't exist. |
| `merge` | No | `false` | Controls whether to generate `ctrl` controller code files according to API layer files rather than splitting API interfaces into different implementation files by default. |

### Automatic Mode (Recommended)

If using `GolandIDE`, the provided configuration file, [watchers.xml](gen-ctrl-watchers.xml), can be used for automatically generating interface files when code file modifications are detected. The usage is shown in the image below:

![](/markdown/7d15b228b1ee57f8f34254a0413f4fc0.png)

## Usage Example

### Automatically generated API definition files

![](/markdown/636aedc34da9bad1f84545dcfbeb38e6.png)

### Automatically generated controller code files

![](/markdown/cff8e2509fc89f6f4c4c0c82bb753334.png)

![](/markdown/e2219959e53c38a80d37254cd3e9e9de.png)

### Automatically generated `HTTP SDK` code files

![](/markdown/f2f5c6793e4aef5ea3c2004ce67edf7b.png)

![](/markdown/dd2dac2338ebf838ba317f64b32f5a5f.png)

## FAQ

### Why does each `api` interface generate a `controller` file instead of merging into one `controller` file?

![](image2023-6-15_16-29-12.png)

For small or personal simple projects, or projects with only a few interfaces in an `api` module, this management style might not be an issue, and code files can be maintained according to personal preference. Here, we describe the scenario for more complex business projects or enterprise-level projects where an `api` module has many interfaces.

- First, when developing `api` interfaces, locating `api` interface implementation is clearer and not about searching through a thousand lines of code in a file.
- Moreover, in a collaborative project, if multiple people modify the same `controller` file, file conflicts easily arise in version management. Maintaining one `api` interface with a corresponding `controller` implementation file can minimize file conflict probabilities during collaboration, as most developers prefer not to waste valuable time resolving file conflicts again and again.
- Finally, the `controller` layer code has its own responsibilities:
  - Validate input parameters: Client-submitted parameters are not trusted and usually require data validation in most scenarios.
  - Implement the interface logic: Either directly implement the interface logic in the `controller` or call one or more `service` interfaces or third-party service interfaces to implement the logic. Avoid implementing `api` interface logic in `service` layers as `api` interfaces are tied to specific business scenarios and are not reusable. 💀 **A common mistake is directly passing the request through the `controller` to the `service` interface, making the `controller` seemingly redundant and the `service` layer's implementation more cumbersome and non-reusable.** 💀
  - Generate return data: Organize internal result data and generate the returning data API definition.

- These responsibilities imply that `controller` code is also relatively complex. Maintaining them separately can alleviate developer mental burden and facilitate clear maintenance of `api` interface logic.

**Some Suggestions**:

If there are too many interface files in an `api` module, consider further splitting complex `api` modules into sub-modules. This can decouple complex `api` modules, and maintaining `api` API definitions and `controller` interface implementation files through multiple directories will make the structure clearer and facilitate better collaboration and version management.

After reviewing the design, if you still prefer managing all interfaces using a single source file, consider the `merge` parameter. 

### Why is there an empty `go` file in the corresponding `controller` module generated from the `api` module?

**For Example**:

![](/markdown/a5b84cce8be1a8b3d563102e7a4c81dd.png)

**Explanation**:

Each `api` module generates an empty `go` file under the module's `controller`. This file is generated only once, allowing users to fill in necessary pre-defined code content, such as internal variable definitions, constants, data structures, or package initialization `init` method definitions, etc., within that module `controller`. _We advocate for good code management practices, suggesting module **pre-defined content** should be consolidated in the module-named `go` file (`module.go`) rather than scattered across different `go` files, to better maintain the code._

If there is currently no need for custom code content in the `controller`, just leave the file empty for future extensions.