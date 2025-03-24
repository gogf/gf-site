`GoFrame`官网源码。

## 本地运行

```shell
# 安装依赖
yarn

# 添加依赖（举例）
yarn add @docusaurus/theme-classic

# 删除依赖（举例）
yarn remove @docusaurus/theme-classic

# 运行
yarn start

# 构建
yarn build

```

```shell
# 更换源 
# .npmrc 文件中指定优先级最高
# 其次是 npm config get registry
# 最后是 yarn config get registry
# 优先级：.npmrc > npm config > yarn config
npm config get registry
npm config set registry https://registry.npmjs.org

yarn config get registry
yarn config set registry https://registry.npmjs.org

rm yarn.lock
yarn install --force
# 实在不行可以手动替换
sed -i 's|https://mirrors.tencent.com/npm/|https://registry.npmjs.org/|g' yarn.lock
```

## 教程贡献

Step1: 教程的 markdown 文件请提交到`docs/course`目录下，每个教程使用单独的目录管理。

Step2: 在`docusaurus.config.ts`配置文件中添加顶部菜单。

Step3: 在`sidebars.ts`配置文件中的`courseSidebar`配置项中添加侧边栏菜单，参考已有配置。

Step4: 本地执行`yarn start`查看效果，并调整样式，直到满意后提交`PR`。

## 案例展示

- 案例图片大小限制：`640x320`，存放于目录：[src/data/showcase](./src/data/showcase/)
- 更新数据文件：[src/data/users.tsx](./src/data/users.tsx)

## 多语言

```shell
# 多语言文档路径
https://docusaurus.io/docs/i18n/introduction#translation-files-location
https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#i18n

# 创建多语言元数据
yarn write-translations --locale en

# 指定i18n语言运行
yarn start --locale en
```

## 多版本

创建新版本

```bash
yarn run docusaurus docs:version 2.8.x
```

## 评论设置

文档 https://rikublock.dev/docs/tutorials/giscus-integration/

```shell
# 因为插入的位置不同，我们使用 swizzle DocItem/Paginator来修改
yarn run swizzle @docusaurus/theme-classic DocItem/Paginator --wrap --typescript
```

## petercat.ai

文档 https://github.com/petercat-ai/petercat/blob/main/docs/guides/quick_%20assistant_start_cn.md

```shell
# 因为插入的位置不同，我们使用 swizzle Layout来修改
yarn run swizzle @docusaurus/theme-classic Layout --wrap --typescript
```
