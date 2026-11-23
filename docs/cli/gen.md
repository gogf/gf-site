# 代码生成-gen

**说明**

从 `v2` 版本开始，最新的 `CLI` 工具版本功能会随着 `GoFrame` 框架的最新版本编译，引入如果本地的 `CLI` 工具自动化生成的代码与项目的 `GoFrame` 框架版本出现兼容性问题时，建议升级项目框架版本，或者自定义安装旧版本的 `CLI` 工具。旧版本CLI工具安装方式参考仓库首页介绍： [https://github.com/gogf/gf-cli](https://github.com/gogf/gf-cli)

## 重要说明🔥

- `CLI` 工具提供的代码生成功能，目的是 **规范化项目代码编写**、 **简化项目开发复杂度**， **让开发者能够把精力聚焦于业务逻辑本身**。
- `CLI` 工具本身会需要有一定前置的学习和理解成本（尽量理解为什么），但在熟练之后，大家的开发工作将会事半功倍。
- `CLI` 工具的代码生成功能针对于企业级项目、多成员的团队性项目中收益会非常高。但针对于单人小型项目，开发者可根据个人意愿评估是否选择使用。 `GoFrame` 框架本身只是提供了基础组件，采用了组件化的灵活设计，不会对项目代码做严格的要求；但 `CLI` 工具会有一定的条框限制，目的是使得团队中每个成员的步调和风格一致，不会使得开发者的代码编写过于随意。

## 使用方式

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

## 相关文档

子页面：

- [接口规范-gen ctrl](https://goframe.org/docs/cli/gen-ctrl.md)
- [数据规范-gen dao](https://goframe.org/docs/cli/gen-dao.md)
- [模块规范-gen service](https://goframe.org/docs/cli/gen-service.md)
- [枚举维护-gen enums](https://goframe.org/docs/cli/gen-enums.md)
- [协议编译-gen pb](https://goframe.org/docs/cli/gen-pb.md)
- [数据表PB-gen pbentity](https://goframe.org/docs/cli/gen-pbentity.md)

> 页面: https://goframe.org/docs/cli/gen
