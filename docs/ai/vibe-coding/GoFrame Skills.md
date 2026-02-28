---
slug: '/ai/goframe-skills'
title: 'GoFrame Skills'
sidebar_position: 0
hide_title: true
description: 'GoFrame Skills 是专为 GoFrame 框架定制的 AI 技能集，帮助 AI 编辑器深度理解 GoFrame 的规范与最佳实践，从而生成高质量、生产就绪的代码。本文介绍如何安装、更新 GoFrame Skills，支持哪些主流 AI 编辑器，以及代码生成、代码优化、问题解答等常见使用场景，助力开发者显著提升 GoFrame 项目开发效率。'
keywords: ['GoFrame', 'Skills', 'AI编程', 'AI编辑器', '代码生成', '代码优化', '问题解答', 'Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf', 'Cline', 'Continue', 'OpenCode', 'Codex', 'agent-skills', 'npx skills', '安装', '更新', '最佳实践']
---

## 关于GoFrame Skills

`GoFrame Skills` 是专为`GoFrame`框架量身定制的`AI`技能集，旨在让`AI`编辑器深度理解`GoFrame`的开发规范与最佳实践，从而生成高质量、生产就绪的代码。它提供：

- **完整的文档覆盖**：涵盖命令行管理、配置管理、日志组件、错误处理、数据校验、类型转换、缓存管理、模板引擎、数据库`ORM`、`I18N`国际化等核心组件的设计介绍、使用说明、最佳实践和注意事项。
- **丰富的实战示例**：包含`HTTP`服务、`gRPC`微服务、服务注册发现、配置中心集成、可观测性、`JWT`认证、文件上传、限流、反向代理等多种项目类型的完整代码示例。
- **`AI`驱动开发**：赋能`AI`深度理解`GoFrame`约定与最佳实践，生成符合框架规范的高质量代码。

:::info 提示
目前`GoFrame Skills`处于`Beta`阶段，欢迎通过 [Issues](https://github.com/gogf/skills/issues) 和 [Pull Requests](https://github.com/gogf/skills/pulls) 参与贡献。
:::

## 支持的 AI 编辑器

`GoFrame Skills` 基于开放的 [Agent Skills](https://agentskills.io/) 规范构建，支持市面上所有主流的`AI`编辑器。以下是部分已支持的编辑器：

| 编辑器 | 编辑器 | 编辑器 | 编辑器 |
|---|---|---|---|
| `Claude Code` | `Cursor` | `GitHub Copilot` | `Windsurf` |
| `Cline` | `Continue` | `Roo Code` | `OpenCode` |
| `Codex` | `Gemini CLI` | `Augment` | `Trae` |
| `Amp` | `Goose` | `OpenHands` | `Kilo Code` |
| `Qwen Code` | `Zencoder` | `Replit` | `Junie` |

完整的支持列表请参考：[Supported Agents](https://github.com/vercel-labs/skills?tab=readme-ov-file#supported-agents)。

安装工具会自动检测当前系统中已安装的`AI`编辑器，并将技能安装到对应的目录。

## 安装 GoFrame Skills

`GoFrame Skills`通过`npx skills`命令行工具进行安装，直接执行以下命令即可：

```bash
npx skills add github.com/gogf/skills
```

执行后，工具会自动检测本机已安装的`AI`编辑器，并交互式地引导完成安装。

### 安装范围

安装时可以选择**项目级**或**全局**安装：

| 范围 | 参数 | 安装路径 | 说明 |
|---|---|---|---|
| 项目级（默认） | 无 | `./<agent>/skills/` | 随项目提交，团队共享 |
| 全局 | `-g` | `~/<agent>/skills/` | 对所有项目生效 |

全局安装示例：

```bash
npx skills add github.com/gogf/skills -g
```

## 更新 GoFrame Skills

### 检查更新

运行以下命令检查`GoFrame Skills`是否有可用的新版本：

```bash
npx skills check
```

### 安装更新

确认有更新后，执行以下命令将所有已安装的技能更新到最新版本：

```bash
npx skills update
```

## 常见使用场景

安装`GoFrame Skills`后，`AI`编辑器将具备对`GoFrame`框架的深度理解能力。以下是一些典型的使用场景：

### 代码生成

根据自然语言描述，`AI`可以自动生成符合`GoFrame`规范的项目结构和代码片段，帮助开发者快速搭建项目框架。

**示例 Prompt：**

```text
使用 GoFrame 构建一个用户服务，设计 RESTful API 接口，包含基本的增删改查操作。
```

### 功能开发

在现有项目基础上，`AI`能够理解`GoFrame`的模块划分、依赖注入等设计模式，快速为项目添加新功能模块。

**示例 Prompt：**

```text
为项目添加 JWT 鉴权功能。只有使用有效凭证登录的用户才能访问 /user/profile 等受保护的接口。
```

### 代码优化

`AI`可以分析现有的项目代码，结合框架最佳实践提供优化建议，改善代码的性能、可读性和可维护性。

**示例 Prompt：**

```text
请帮我审查当前项目的数据库查询代码，根据 GoFrame ORM 的最佳实践给出优化建议。
```

### 问题解答

针对开发者在使用`GoFrame`过程中遇到的问题，`AI`能够结合框架文档和最佳实践提供专业、准确的解答与解决方案。

**示例 Prompt：**

```text
为什么我使用 GoFrame ORM 执行事务时，在嵌套函数中获取不到同一个事务对象？
应该如何正确地在 GoFrame 中传递事务上下文？
```

### 代码迁移与升级

当需要将旧版`GoFrame`项目升级到新版本，或从其他框架迁移到`GoFrame`时，`AI`可以提供针对性的迁移方案和代码改写建议。

**示例 Prompt：**

```text
我有一个基于 Gin 框架编写的 HTTP 服务，
请帮我将其迁移到 GoFrame，保持原有的路由结构和中间件逻辑。
```

### 单元测试生成

`AI`可以根据现有的`GoFrame`业务代码，自动生成符合`GoFrame`测试规范的单元测试用例，提升项目的测试覆盖率。

**示例 Prompt：**

```text
请为 internal/service/user 目录下的用户注册逻辑生成单元测试，
使用 GoFrame 推荐的测试方式，并覆盖正常流程和异常流程。
```

## 常见问题

### GoFrame Skills没有被AI编辑器触发？

- 在`AI`编辑器的`Chat`窗口询问"当前已安装的技能有哪些？"以确认技能是否正确安装。如果未被识别出，那么请查询自己的编辑器识别的技能目录是什么（可参考[Supported Agents](https://github.com/vercel-labs/skills?tab=readme-ov-file#supported-agents)），并重新使用安装命令交互式安装到正确的目录下。
- 由于`Skills`的触发机制依赖给定提示词中的关键字，可尝试在提示词中增加更详细和明确的信息，例如"帮助我开发一个用户服务"的提示词也许无法触发`GoFrame Skills`，但"使用`GoFrame`开发一个用户服务"、"使用`GoFrame Skills`开发一个用户服务"或者"使用`Go`开发一个用户服务"则更有可能被正确识别和触发。


### GoFrame Skills生成的代码质量不符合预期？

- 通常来讲，你不太需要怀疑`GoFrame Skills`的质量，因为它是基于框架最佳实践和官方文档构建的。如果生成的代码不符合预期，可能是提示词不够明确或具体，建议优化提示词以获得更符合需求的代码。
- 使用不同的模型可能会产生不同的代码质量和风格，可以根据实际需求选择合适的模型。例如使用`Claude Haiku 4.5`模式生成的代码质量或者技能效果远不及`Claude Opus 4.6`模型。

## 相关链接

- `GoFrame Skills`仓库：[https://github.com/gogf/skills](https://github.com/gogf/skills)
- 通用`skills`安装工具：[https://github.com/vercel-labs/skills](https://github.com/vercel-labs/skills)
