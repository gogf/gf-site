# Unified Framework Design

The software industry is quite similar to the construction industry. If we say our product is a tall building, then program code is the bricks used to build it (our daily work is like "moving bricks" continuously). If software architecture is seen as the overarching plan, then program code is the key component for accurately implementing software architecture.

Given the importance of program code, the importance of development frameworks goes without saying. Development frameworks focus on the code level to solve general technical issues, aiming to allow developers to focus on the business itself, facilitate quick responses to business changes, and improve the overall efficiency of software development and maintenance.

This chapter mainly introduces the significance and necessity of building a unified development framework.

> Before starting this chapter, it is recommended that you understand the framework's: [Modular Design](https://goframe.org/en/docs/design/modular.md). Part of the inspiration and insights are from: [Xiaoma's Experience Sharing](https://goframe.org/en/articles/framework-comparison-goframe-beego-iris-gin).

## 1. Technical Systematization

Systematization focuses more on the overall combat power of the framework rather than each module itself.

Significant features of systematic framework design:

- Comprehensive system, rich components
- Unified standards, consistent style
- Unified abstraction, tight design
- Efficient execution, no redundant logic

The systematization here refers to a top-down unified design of the micro-level code development framework, making the overall framework design thought integrated rather than scattered. Technically, solving a specific problem is relatively straightforward, and developing a specific module is relatively easy. However, abstracting and consolidating common issues, organizing independent modules according to a unified design philosophy, and generating strong overall combat power is not a simple task. This requires the framework designer to have a certain technical background, experience accumulation, vision, and foresight, rather than just focusing on individual modules.

For example, even if we have never developed a framework, we should have used one to some extent and know what modules a framework should at least include. When we need to write logs, we know this component framework must provide, so we look for it in the framework and get usage help from the official website. When we need WebServer, database access, template engines, etc., we can also expect such components to be provided by the framework, so we look for them in the framework and get usage help from the official website.

Additionally, when using various modules in the framework, although each module is designed to be loosely coupled for selective use, we find that their configuration management methods are consistent. They use structured configuration management objects, the same configuration management module, and fixed configuration item-to-object attribute mapping rules. Getting and setting are done through methods prefixed with `Get`/`Set` (all component parameter retrievals and settings are also `Get`/`Set` methods). Global environment variables and startup parameter settings are similarly managed. This enables developers to quickly grasp the framework's behavior, facilitating quick integration and reducing learning costs.

Furthermore, a great feature at the framework level is the full error stack feature, where all component `errors` return with error stacks, allowing top-level business to quickly locate problems through error stacks when errors occur. Currently, only the `GoFrame` framework in the `Golang` development language provides this capability.

These are just a few simple examples. If you're interested, you can discover more intriguing points in the framework.

Finally, we can ponder, why can we subconsciously understand the framework's behavior, and why does the framework offer high convenience and low integration costs, with modules having high organizational coordination despite a "high cohesion, low coupling" design philosophy? This phenomenon is due to whether a framework uses systematized design or is cobbled together.

**Tip**

A fitting analogy: `GoFrame` is a highly disciplined, cohesive, and effective "regular army," not a "scattered team" that's "cobbled together."

## 2. Development Standardization

Code level also requires a series of development standards, such as basic code structure, layering models, encapsulation design, etc. For specifics, please refer to: [Engineering Design 🔥](https://goframe.org/en/docs/design/project.md). A unified framework design ensures that all business projects are coded following a unified code design, forming uniform development standards. In addition, the framework's development toolchain makes it easier to quickly promote and implement development standards: [CLI Tool](https://goframe.org/en/docs/cli.md).

## 3. Component Unification

> Unification here has two layers:
>
> - Multiple identical function components unified into one component.
> - Multiple different function components unified into framework management.

Another pain point is the flourishing development of components:

- Multiple modules implementing the same function logic, increasing choice costs
- Excessive modules dependencies, affecting project stability
- Projects struggle whether to upgrade these module versions due to numerous dependencies
- Different modules depending on different versions of the same third-party module, causing version compatibility issues
- Isolated module design, making each module's replaceability high individually; hard to establish development systems and unify standards

Only a unified development framework can bring independent modules from " **each going its own way**" to " **unified management**":

- Framework designed from top-down, forming a systematic and unified module design, facilitating the implementation of standardized development
- Core framework maintains comprehensive common basic modules, reducing costs of basic module selection
- We only need to maintain a unified framework version, not dozens of module versions
- We only need to understand changes in one framework, not dozens of modules
- During upgrades, only one framework version needs upgrading, not dozens of module versions
- Unified modular design reduces unnecessary logic implementation, improving module performance and usability
- Reduces mental load on developers, improving module maintainability, and making it easier to ensure module version consistency across business projects

## 4. Version Consistency

Version consistency issues mainly arise from excessive project module dependencies and versions, making it hard to maintain and upgrade versions uniformly. After the framework unifies module management, it's easier to ensure project module version consistency. However, note that this consistency is not strong consistency; it merely reduces module and version maintenance complexity, but inconsistency issues still exist. The pain points and improvements were introduced in previous chapters, and you may refer to: [Modular Design](https://goframe.org/en/docs/design/modular.md). No further details here.

> There are some **version strong consistency** code management solutions in the industry, such as using `Monorepo` **large repository** code management. Each has its pros and cons, which you may explore yourself, and there's no further elaboration here.

## 5. Solution Precipitation

Based on a unified development framework, it's easier to form solution precipitation, creating a virtuous cycle between enterprises and the community. Solution precipitation prioritizes adopting tools and code forms over documentation.

## 6. Avoid Resource Waste

When every team tries to create their own wheels, not only does it fail to form a unified development standard, but it also leads to significant resource waste.

> This phenomenon is quite evident in the early days of `Golang` or when an emerging company’s technical system is underdeveloped.

Getting project teams to focus more on business is believed to be the consensus among most tech companies. A unified development architecture abstracts common technical problems and forms general solutions, avoiding each project independently tackling the multitude of encountered technical challenges, effectively freeing up focus.

> Page: https://goframe.org/en/docs/design/unified
