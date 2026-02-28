---
slug: '/ai/goframe-skills'
title: 'GoFrame Skills'
sidebar_position: 0
hide_title: true
description: 'GoFrame Skills is a curated AI skill set tailored specifically for the GoFrame framework, enabling AI editors to deeply understand GoFrame conventions and best practices so they can generate high-quality, production-ready code. This guide covers how to install and update GoFrame Skills, which mainstream AI editors are supported, and common usage scenarios such as code generation, code optimization, and problem-solving — helping developers significantly boost their GoFrame project development efficiency.'
keywords: ['GoFrame', 'Skills', 'AI programming', 'AI editor', 'code generation', 'code optimization', 'problem solving', 'Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf', 'Cline', 'Continue', 'OpenCode', 'Codex', 'agent-skills', 'npx skills', 'installation', 'update', 'best practices']
---

## About GoFrame Skills

`GoFrame Skills` is a curated `AI` skill set tailored specifically for the `GoFrame` framework. It is designed to enable `AI` editors to deeply understand `GoFrame`'s development conventions and best practices, so they can generate high-quality, production-ready code. It provides:

- **Comprehensive documentation coverage**: Covers core components including `CLI` management, configuration, logging, error handling, and database `ORM`, with design overviews, usage guides, best practices, and important notes.
- **Rich real-world examples**: Includes code examples for various project types such as `HTTP` services and `gRPC` microservices, helping developers get up to speed quickly.
- **`AI`-driven development**: Empowers `AI` to deeply understand `GoFrame` conventions and best practices, generating code that adheres to framework standards.

:::info Note
`GoFrame Skills` is currently in `Beta`. Contributions via [Issues](https://github.com/gogf/skills/issues) and [Pull Requests](https://github.com/gogf/skills/pulls) are warmly welcome.
:::

## Supported AI Editors

`GoFrame Skills` is built on the open [Agent Skills](https://agentskills.io/) specification and supports all mainstream `AI` editors available today. Here are some of the supported editors:

| Editor | Editor | Editor | Editor |
|---|---|---|---|
| `Claude Code` | `Cursor` | `GitHub Copilot` | `Windsurf` |
| `Cline` | `Continue` | `Roo Code` | `OpenCode` |
| `Codex` | `Gemini CLI` | `Augment` | `Trae` |
| `Amp` | `Goose` | `OpenHands` | `Kilo Code` |
| `Qwen Code` | `Zencoder` | `Replit` | `Junie` |

For the complete list of supported editors, see: [Supported Agents](https://github.com/vercel-labs/skills?tab=readme-ov-file#supported-agents).

The installation tool automatically detects the `AI` editors installed on your system and installs the skills into the appropriate directories.

## Installing GoFrame Skills

`GoFrame Skills` is installed via the `npx skills` command-line tool. Simply run the following command:

```bash
npx skills add github.com/gogf/skills
```

After execution, the tool will automatically detect the `AI` editors installed on your machine and interactively guide you through the installation.

### Installation Scope

You can choose between **project-level** or **global** installation:

| Scope | Flag | Installation Path | Description |
|---|---|---|---|
| Project-level (default) | none | `./<agent>/skills/` | Committed with the project, shared across the team |
| Global | `-g` | `~/<agent>/skills/` | Applies to all projects |

Global installation example:

```bash
npx skills add github.com/gogf/skills -g
```

## Updating GoFrame Skills

### Check for Updates

Run the following command to check whether a new version of `GoFrame Skills` is available:

```bash
npx skills check
```

### Apply Updates

Once you confirm there are updates available, run the following command to update all installed skills to the latest version:

```bash
npx skills update
```

## Common Usage Scenarios

After installing `GoFrame Skills`, your `AI` editor will have an in-depth understanding of the `GoFrame` framework. Here are some typical usage scenarios:

### Code Generation

Based on natural language descriptions, `AI` can automatically generate project structures and code snippets that conform to `GoFrame` conventions, helping developers scaffold projects quickly.

**Example Prompt:**

```text
Build a user service using GoFrame with RESTful API endpoints covering basic CRUD operations.
```

### Feature Development

Building on an existing project, `AI` can understand `GoFrame`'s module organization and dependency injection patterns to quickly add new feature modules to your project.

**Example Prompt:**

```text
Add JWT authentication to the project. Only users who log in with valid credentials should be able to access protected endpoints such as /user/profile.
```

### Code Optimization

`AI` can analyze existing project code and provide optimization suggestions based on framework best practices, improving code performance, readability, and maintainability.

**Example Prompt:**

```text
Please review the database query code in the current project and suggest optimizations based on GoFrame ORM best practices.
```

### Problem Solving

When developers encounter issues while using `GoFrame`, `AI` can combine framework documentation and best practices to provide professional and accurate answers and solutions.

**Example Prompt:**

```text
Why can't I access the same transaction object inside a nested function when executing a transaction with GoFrame ORM?
How should I correctly pass a transaction context in GoFrame?
```

### Code Migration and Upgrades

When upgrading an older `GoFrame` project to a new version, or migrating from another framework to `GoFrame`, `AI` can provide targeted migration plans and code rewrite suggestions.

**Example Prompt:**

```text
I have an HTTP service written with the Gin framework.
Please help me migrate it to GoFrame while preserving the original routing structure and middleware logic.
```

### Unit Test Generation

`AI` can automatically generate unit test cases that comply with `GoFrame`'s testing conventions based on existing business code, improving the project's test coverage.

**Example Prompt:**

```text
Please generate unit tests for the user registration logic under the internal/logic/user directory,
using GoFrame's recommended testing approach and covering both the happy path and error cases.
```

## Related Links

- `GoFrame Skills` repository: [https://github.com/gogf/skills](https://github.com/gogf/skills)
- General `skills` installation tool: [https://github.com/vercel-labs/skills](https://github.com/vercel-labs/skills)
- Supported editors list: [Supported Agents](https://github.com/vercel-labs/skills?tab=readme-ov-file#supported-agents)
