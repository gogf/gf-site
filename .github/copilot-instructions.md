# GoFrame 官网 (gf-site) Copilot 指南

你正在协助开发 GoFrame 文档网站 (Docusaurus v3)。

## 重要

添加或修改`docs/`目录下的文档时，**必须**同步更新对应的英文文档 (位于 `i18n/en/` 下)，否则无法通过 CI 一致性检查。

## 🏗 架构与结构

- **框架**: Docusaurus v3 (React, TypeScript, MDX)。
- **内容策略**:
  - `docs/`: 包含 _当前_ (Next) 版本的文档。
  - `versioned_docs/`: 包含归档的历史版本 (例如 `version-2.8.x/`)。
  - `i18n/`: 本地化文件 (英文翻译在 `i18n/en/` 中)。
  - `examples/`: 文档中引用的代码示例。
- **定制化**:
  - `src/components/`: 自定义 React 组件 (例如 `AdBanner`, `Comments`)。
  - `src/theme/`: Swizzled 主题组件。
  - `src/css/`: 自定义样式 (`custom.css`, `output.css`)。

## 🛠 关键工作流

- **本地开发**: 运行 `yarn start` 启动本地开发服务器。
- **生产构建**:
  - **不要** 直接运行 `yarn build` 生成生产制品。
  - **必须** 运行 `make build`。此命令会临时将 `versions.build.json` 替换为 `versions.json`，以确保构建正确的版本列表。
- **示例生成**: 运行 `make examples` (调用 `./make-examples.sh`) 从源码重新生成示例文档。
- **一致性检查**: 运行 `make check` 验证文档完整性。

## 📝 规范与模式

- **语言**:
  - **聊天**: 使用 **中文 (简体)** 回复用户。
  - **代码注释**: 使用 **英文** 编写注释。
  - **文档**: 默认内容为中文 (`zh-Hans`)。
- **版本控制**:
  - 项目维护多个版本。编辑时请注意区分 `docs/` (当前版本) 与 `versioned_docs/` (历史版本)。
  - `versions.json` 跟踪所有版本，但 `versions.build.json` 用于实际构建过程。
- **Frontmatter**: 确保保留标准的 Docusaurus frontmatter (`slug`, `title`, `sidebar_position`)。
- **Markdown 校验**: 每次修改文档后，需检查是否存在 Markdown 语法错误（如未闭合的标签、错误的链接格式等）。
- **Mermaid**: Mermaid 图表已启用 (配置中 `markdown: { mermaid: true }`)。

## 🧩 关键文件

- `docusaurus.config.ts`: 主要配置 (插件, 导航栏, 页脚, Algolia)。
- `sidebars.ts`: 当前版本的侧边栏导航结构。
- `Makefile`: 构建和维护命令的单一事实来源。
- `src/css/custom.css`: 全局样式覆盖。

## ⚠️ 常见陷阱

- **版本替换**: 如果不使用 `make build`，会导致生产构建中的版本下拉菜单显示不正确。
- **国际化**: 添加新的 UI 文本时，请记得检查 `i18n/` 是否需要对应的翻译键值。
