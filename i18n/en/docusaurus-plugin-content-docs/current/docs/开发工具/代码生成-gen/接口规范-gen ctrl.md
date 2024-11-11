---
slug: '/docs/cli/gen-ctrl'
title: 'Interface Specification - Gen Ctrl'
sidebar_position: 0
hide_title: true
---
:::tip
This feature has been available since version `v2.5`. The command currently only supports `HTTP` interface development; for `GRPC`, please refer to the `gen pb` command. In the future, we will consider using this command to generate controllers and `SDK` source code for both `HTTP` and `GRPC`.
:::
## Basic Introduction

### Solving Pain Points

When developing projects, it is often necessary to design `API` interfaces based on business needs and scenarios, using `proto` or `golang struct` to design the input and output of `API`. Then, create corresponding controllers for the `API`, and finally, may also provide `SDK` (also in `Golang`) for internal/external service calls. The following pain points are encountered during development:

- **Repetitive code work is cumbersome**. After creating input and output definition files in `API`, it is still necessary to create corresponding files in the controller directory, initialize controller code, and repeatedly copy input and output structure names from `API` code, which is a tedious repetitive process.
- **There is no reliable specification constraint between API and controller**. Apart from certain naming constraints on `API`, there are no constraints on the creation and method naming of controllers, which are highly flexible. It is difficult to constrain the correspondence between `API` structure names and controller method names, and as the number of interfaces increases, there will be certain maintenance costs.
- **High probability of code file conflicts in team development**. When multiple people develop and collaborate by making changes to the same file, the probability of file conflicts increases, and the effort spent on handling such file conflicts in team development is meaningless.
- **Lack of automatic generation tools for API's HTTP SDK**. After developing `API`, it is often necessary to provide it for immediate internal or external use, lacking convenient `SDK` generation, requiring manual maintenance of this `SDK` code, which is very costly for the calling end.

### Command Features

- Standardizes `API` definition and controller file naming, controller implementation method naming.
- Standardizes the association between `API` definition and controller code, facilitating quick location of `API` implementation.
- Automatically generates controller interfaces, controller initialization files, and code based on `API` definition.
- Automatically generates easy-to-use `HTTP SDK` code based on `API` definition. This feature is configurable and defaults to off.
- Supports `File Watch` automated generation mode: when an `API` structure definition file changes, the corresponding controller and `SDK` code are automatically incrementally updated.

## Prerequisites

### Important Specifications 🔥

One of the purposes of this command is to standardize the writing of `api` code, so we should be aware of some important specifications (otherwise, the code will not be generated):

- The path of the interface definition files in the `api` layer must meet `/api/Module/Version/DefinitionFile.go`, for example: `/api/user/v1/user.go`, `/api/user/v1/user_delete.go`, etc.
  - **Module** here refers to the division of `API` modules, which can be split according to different **business attributes** for easy aggregation and maintenance. You can also consider the module as a specific business resource.
  - **Version** is usually defined in the form of `v1`/`v2`... for `API` compatibility version control. When the same `API` appears with compatibility updates, it needs to be distinguished by different version numbers. The default is to use `v1` to manage the first version.
  - **Definition File** refers to the input and output definition files of `API`, usually each `API` needs a separate `go` file for independent maintenance. Of course, it also supports putting multiple `API`s into one `go` file for unified maintenance.
- The structure names defined in `api` must meet the naming convention of `Operation+Req` and `Operation+Res`. For example: `GetOneReq/GetOneRes`, `GetListReq/GetListRes`, `DeleteReq/DeleteRes`, etc.
  - The operation here is the operation name of the current `API` module, usually corresponding to `CURD`: `Create`, `Update`, `GetList/GetOne`, `Delete`.

Below is an example of the `Hello` interface in the project engineering template:

![Hello Interface Example](/markdown/71be1e0ac8d8eaa7794a476086c110c2.png)

### Suggested Naming

We have made some suggested naming for some common interface definitions for your reference:

| Operation Name | Suggested Naming | Remarks |
| --- | --- | --- |
| **Query List** | `GetListReq/Res` | Usually for paging query data records from the database |
| **Query Details** | `GetOneReq/Res` | Usually requires passing the primary key condition, querying record details from the database |
| **Create Resource** | `CreateReq/Res` | Usually for inserting one or more data records into the data table |
| **Modify Resource** | `UpdateReq/Res` | Usually for modifying one or more data records in the data table according to certain conditions |
| **Delete Resource** | `DeleteReq/Res` | Usually for deleting one or more data records from the data table according to certain conditions |

## Command Usage

The command analyzes the code in the given `api` interface definition directory and automatically generates the corresponding controller/`SDK Go` code files.

### Manual Mode

If you are executing the command manually, simply run `gf gen ctrl` in the project root directory, which will scan the `api` interface definition directory completely and generate the corresponding code.

```bash
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
If you are using the project engineering scaffold recommended by the framework and have the `make` tool installed on your system, you can also use the `make ctrl` shortcut command.
:::

Parameter Description:

| Name | Required | Default Value | Meaning |
| --- | --- | --- | --- |
| `srcFolder` | No | `api` | Points to the directory address of `api` interface definition files |
| `dstFolder` | No | `internal/controller` | Points to the directory where generated controller files are stored |
| `watchFile` | No |  | Used in IDE file monitoring, for automatically executing generation operations when files change |
| `sdkPath` | No |  | If `HTTP SDK` needs to be generated, this parameter is used to specify the directory path for storing the generated SDK code |
| `sdkStdVersion` | No | `false` | Whether the generated `HTTP SDK` uses standard version management. Standard version management will automatically add request route prefixes based on `API` versions. For example, `v1` version APIs will automatically add `/api/v1` request route prefixes. |
| `sdkNoV1` | No | `false` | Whether the interface module name in the generated `HTTP SDK` does not have a `V1` suffix when the version is `v1`. |
| `clear` | No | `false` | Whether to delete controller interface files in `controller` that do not exist in the `api` layer definition. |
| `merge` | No | `false` | **Controls the generation of `ctrl` controller code files according to the `api` layer files, rather than defaulting to different interface implementation files according to the `api` interface.** |

### Automatic Mode (Recommended)

If you are using `GolandIDE`, you can use our provided configuration file: [watchers.xml](https://wiki.goframe.org/download/attachments/93880327/watchers.xml?version=1&modificationDate=1686817123230&api=v2) to automatically generate interface files when code files are modified. The usage method is as follows:

![GolandIDE Configuration](/markdown/7d15b228b1ee57f8f34254a0413f4fc0.png)

## Usage Examples

### Automatically Generated Interface Definition Files

![Interface Definition Files](/markdown/636aedc34da9bad1f84545dcfbeb38e6.png)

###  Automatically Generated Controller Code Files

![Controller Code Files](/markdown/cff8e2509fc89f6f4c4c0c82bb753334.png)

![Controller Code Files](/markdown/e2219959e53c38a80d37254cd3e9e9de.png)

### Automatically Generated `HTTP SDK` Code Files

![HTTP SDK Code Files](/markdown/f2f5c6793e4aef5ea3c2004ce67edf7b.png)

![HTTP SDK Code Files](/markdown/dd2dac2338ebf838ba317f64b32f5a5f.png)

## Common Questions

### Why is each `api` interface generated into a `controller` file instead of being merged into one `controller` file?

![Controller File Explanation](https://wiki.goframe.org/download/attachments/93880327/image2023-6-15_16-29-12.png?version=1&modificationDate=1686817753666&api=v2)

Of course, for small projects or individual simple projects with only a few interfaces in an `api` module, the management method will not be a problem, and you can maintain the code files according to personal preference. We describe the scenario for more complex business projects or enterprise-level projects with many interfaces in an `api` module.

- First, when developing `api` interfaces, it is clearer to find the implementation of `api` interfaces, rather than searching in a code file that is thousands of lines long.
- Second, in team collaboration projects, if multiple people modify the same `controller` file at the same time, it is easy to have file conflicts. The maintenance method of one `api` interface corresponding to one `controller` implementation file can minimize the probability of file conflicts in code collaboration, and most developers do not want to spend their precious time solving file conflicts over and over again.
- Finally, the `controller` layer has its own responsibilities:
  - Validate input parameters: Parameters submitted by the client are untrusted and need to be validated in most scenarios.
  - Implement interface logic: Directly implement interface logic in `controller`, or call one or more `service` interfaces, third-party service interfaces to implement interface logic. Note that `api` interface logic should not be implemented in the `service` layer interface because `api` interfaces are bound to specific business scenarios and cannot be reused. 💀 **Most common mistakes are that `controller` directly passes the request to the `service` interface to implement `api` interface logic, making the `controller` seem dispensable, and the implementation of the `service` layer is becoming heavier and heavier and cannot be reused.** 💀
  - Generate return data: Organize internal results, generate the return data interface defined by the interface.
- These responsibilities also mean that the code of `controller` is relatively complex, and separate maintenance can reduce the mental burden on developers and make it easier to clearly maintain the implementation logic of `api` interfaces.

**Some suggestions**:

If there are too many interface files under an `api` module, it is recommended to further divide the complex `api` module into sub-modules. This can decouple complex `api` modules and maintain `api` interface definitions and `controller` interface implementation files through multiple directories. The directory structure will be clearer, which is more conducive to team collaboration and version control.

_After reading the above design, if you still want to use a single source file to manage all interfaces, you can refer to the `merge` parameter._

### Why is there an empty `go` file in the corresponding `controller` module generated based on the `api` module?

**For example**:

![Empty Go File](/markdown/a5b84cce8be1a8b3d563102e7a4c81dd.png)

**Explanation**:

An empty `go` file for the `controller` of each `api` module is generated, and this file is generated only once. Users can fill in the necessary predefined code content inside, such as variables, constants, data structure definitions used within the module's `controller`, or package initialization `init` method definitions, etc. _We advocate good code management habits, and **predefined content** under the module should be unified into a `go` file named after the module ( `Module.go` ), rather than being scattered in various `go` files, to better maintain the code._

If there is no custom code content to be filled in the `controller` at present, just keep the file empty to reserve the ability to expand in the future.