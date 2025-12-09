---
slug: /release/golang
title: Go Release Notes
sidebar_position: 1999999
---

This page records the release notes and new features of major Go versions.

Go maintains a release cadence of a major version every six months, typically in February and August.

## Version List

- [Go 1.24 (2025-02-11)](go1.24.md)
- [Go 1.23 (2024-08-13)](go1.23.md)
- [Go 1.22 (2024-02-06)](go1.22.md)
- [Go 1.21 (2023-08-08)](go1.21.md)
- [Go 1.20 (2023-02-01)](go1.20.md)
- [Go 1.19 (2022-08-02)](go1.19.md)
- [Go 1.18 (2022-03-15)](go1.18.md)
- [Go 1.17 (2021-08-16)](go1.17.md)
- [Go 1.16 (2021-02-16)](go1.16.md)
- [Go 1.15 (2020-08-11)](go1.15.md)
- [Go 1.14 (2020-02-25)](go1.14.md)
- [Go 1.13 (2019-09-03)](go1.13.md)
- [Go 1.12 (2019-02-25)](go1.12.md)
- [Go 1.11 (2018-08-24)](go1.11.md)
- [Go 1.10 (2018-02-16)](go1.10.md)
- [Go 1.9 (2017-08-24)](go1.9.md)
- [Go 1.8 (2017-02-16)](go1.8.md)
- [Go 1.7 (2016-08-15)](go1.7.md)
- [Go 1.6 (2016-02-17)](go1.6.md)
- [Go 1.5 (2015-08-19)](go1.5.md)
- [Go 1.4 (2014-12-10)](go1.4.md)
- [Go 1.3 (2014-06-18)](go1.3.md)
- [Go 1.2 (2013-12-01)](go1.2.md)
- [Go 1.1 (2013-05-13)](go1.1.md)
- [Go 1 (2012-03-28)](go1.0.md)

## Release Note Guidelines

To maintain consistency across version descriptions, it is recommended that new release notes follow the guidelines and paragraph order below:

1. **Introductory Summary**: In the body text before `## Major Changes`, summarize the key improvements of this version in one or two sentences.
2. **`## Major Changes`**: Contains unified subheadings, allowing detailed content to be added in order.
   - `### Language`: New language features, key syntax changes, type system updates, etc.
   - `### Toolchain`: Changes to the `go` command, build/install/module tools, or diagnostic and quality tools.
   - `### Runtime`: Improvements to the scheduler, GC, compiler collaboration, debugging capabilities, and runtime performance.
   - `### Performance`: If there are independent performance optimizations or compiler performance adjustments, this section can be listed separately.
   - `### Standard Library`: List new/modified standard library packages and APIs.
   - `### Platform Support`: New descriptions related to platform, architecture, and system compatibility.
3. **Supplementary Subsections**: If you need to introduce content such as testing or compatibility, you can add subsections like `### Testing Framework`, `### Compatibility Promise`, etc., after the above sections.
4. **`## References`**: Uniformly placed at the end of each document, used to link to official release notes or related Issues/Proposals.

The above structure has been uniformly applied in existing historical documents. Please refer to this template for subsequent manually written or automatically generated release notes to ensure consistency in reading experience and comparative analysis.
