---
slug: '/docs/design/enums'
title: 'Golang Enums'
sidebar_position: 9
hide_title: true
keywords: [GoFrame framework, Go language, enum implementation, Kubernetes enum, Go constants, cross-service enum, OpenAPI enum, enumeration in Go, API development, SDK generation]
description: "Implementing enum values in Go. Although Go itself doesn't support enum definition, it can simulate enum types using const. This method is widely used in Kubernetes projects. Additionally, this article explores how to efficiently maintain enum values in cross-service calls and front-end and back-end collaboration, providing methods using OpenAPI standard protocols and related tools."
---

## Implementing Enum Values in Go

The `Go` language does not provide an `enum` definition, but we can use `const` to simulate enum types, which is a conventional practice in `Go`.

For example, in the `Kubernetes` project, there are numerous "enum values" defined in the form of constants:

```go
// PodPhase is a label for the condition of a pod at the current time.
type PodPhase string

// These are the valid statuses of pods.
const (
    // PodPending means the pod has been accepted by the system, but one or more of the containers
    // has not been started. This includes time before being bound to a node, as well as time spent
    // pulling images onto the host.
    PodPending PodPhase = "Pending"
    // PodRunning means the pod has been bound to a node and all of the containers have been started.
    // At least one container is still running or is in the process of being restarted.
    PodRunning PodPhase = "Running"
    // PodSucceeded means that all containers in the pod have voluntarily terminated
    // with a container exit code of 0, and the system is not going to restart any of these containers.
    PodSucceeded PodPhase = "Succeeded"
    // PodFailed means that all containers in the pod have terminated, and at least one container has
    // terminated in a failure (exited with a non-zero exit code or was stopped by the system).
    PodFailed PodPhase = "Failed"
    // PodUnknown means that for some reason the state of the pod could not be obtained, typically due
    // to an error in communicating with the host of the pod.
    PodUnknown PodPhase = "Unknown"
)
```

## How to Efficiently Maintain Enum Values Across Services

It is relatively simple to use enum values internally within a project, as they can be defined and used internally. However, when it comes to cross-service calls or front-end and back-end collaboration, efficiency tends to be lower. When services need to demonstrate interface capabilities to external callers, an `API` interface document (or interface definition file, such as `proto`) often needs to be generated, and the client `SDK` for calling is often generated based on the interface document (file).

If it's an interface definition file, like `proto`, the problem can often be resolved by directly viewing the source code, so it's not a big issue. Here, we mainly discuss the problem of maintaining enum values in interface documents, particularly when maintaining enum values through the `OpenAPI` standard protocol during front-end and back-end collaboration. We provide specialized tools for maintaining these enum values, please refer to the chapter: [Enums Maintenance](../开发工具/代码生成-gen/枚举维护-gen%20enums.md)