# Preparation

The subsequent microservices chapters mainly focus on the `GRPC` protocol, introducing microservices development, components, and tool usage.

## Dependency Installation

Before further learning, please first understand the relevant concepts of `GRPC` and install the corresponding tools to the local development environment:

- [https://grpc.io/](https://grpc.io/)
- [https://grpc.io/docs/languages/go/quickstart/](https://grpc.io/docs/languages/go/quickstart/)

If it's a `MacOS` environment, consider using the `brew` tool to install dependencies:

```bash
brew install grpc protoc-gen-go protoc-gen-go-grpc
```

After installing the dependency tools, please refer to the chapter [https://grpc.io/docs/languages/go/quickstart/](https://grpc.io/docs/languages/go/quickstart/) to complete the basic study of the `protoc` tool usage.

## Framework Tools

Please ensure the version of the GoFrame framework CLI development tool is `>= v2.4`. For tool installation and upgrade, please refer to the chapter: [CLI Tool](https://goframe.org/en/docs/cli.md)

The framework tools provide additional command support for the `GRPC` protocol, greatly simplifying the microservices development based on the `GRPC` protocol.

> Page: https://goframe.org/en/docs/micro-service/prepare-environment
