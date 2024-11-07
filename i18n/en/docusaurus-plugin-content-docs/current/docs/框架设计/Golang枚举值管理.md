---
slug: '/docs/design/enums'
title: 'Golang Enum Value Management'
sidebar_position: 9
hide_title: true
---

## Enum Implementation in Go

The `Go` language does not provide a definition for `enum`, but we can simulate enum types using `const`, which is a conventional approach in `Go`.

For example, in the `Kubernetes` project, there are numerous "enum values" defined as constants:

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

## Efficient Maintenance of Enum Values Across Services

If enum values are used only within a project, it is relatively simple; define and use them internally. However, when it comes to cross-service calls or collaboration between front-end and back-end, the efficiency drops. When a service needs to present its interface capabilities to external callers, it often requires generating `API` documentation (or interface definition files, such as `proto`), and it may also need to generate client `SDKs` based on the interface documentation (files).

If it's an interface definition file, such as `proto`, you can often solve this problem by directly viewing the source code, which is not a significant issue. Our main discussion here is about maintaining enum values in interface documentation, especially when maintaining enum values through the `OpenAPI` standard protocol during front-end and back-end collaboration. We provide a dedicated tool for maintaining these enum values, for details, please refer to the section: [Enum Maintenance-gen enums](/docs/cli/gen-enums)

