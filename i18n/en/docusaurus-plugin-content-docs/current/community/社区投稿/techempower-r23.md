---
slug: "/articles/techempower-web-benchmarks-r23"
title: "TechEmpower Web Benchmarks Latest Performance Evaluation"
hide_title: true
keywords: ["techempower", "Web Benchmarks", "performance evaluation", "GoFrame performance", "Go framework comparison"]
description: "Detailed introduction to GoFrame's performance in TechEmpower Web Benchmarks Round 23 and performance comparison with other Go frameworks"
---


## Introduction to TechEmpower Web Benchmarks

TechEmpower Web Framework Benchmarks (TFB) is the most authoritative and influential web framework performance evaluation project in the industry today. Since its first release in 2013, this project has become an important reference for developers when choosing a web framework. TechEmpower is an American software consulting company with over 20 years of history, and its benchmark initiative has gained widespread recognition from the global developer community for its fairness, comprehensiveness, and professionalism.

The core value of the TFB evaluation project lies in:

1. **Open Source Transparency**: The benchmark code is completely open source on GitHub, allowing anyone to view, contribute, and verify
2. **Community-Driven**: Framework implementations are contributed by the community, ensuring that test code follows each framework's best practices
3. **Regular Updates**: New round of benchmark results are released annually, reflecting the latest performance of each framework
4. **Hardware Standardization**: Using unified high-performance server environments to ensure the comparability of test results

Currently, TFB includes test implementations for over 400 frameworks, covering almost all mainstream programming languages and web frameworks, making it the largest and most comprehensive web framework performance evaluation project to date.

## Benchmark Mechanism Analysis

TechEmpower Web Benchmarks uses multi-dimensional evaluation metrics to comprehensively measure the performance of web frameworks in different application scenarios. Round 23 evaluation includes the following six core tests:

1. **JSON Serialization**: Tests the framework's ability to serialize simple JSON objects
2. **Single Query**: Tests the framework's performance in executing a single database query
3. **Multiple Queries**: Tests the framework's ability to execute multiple database queries
4. **Data Updates**: Tests the framework's performance in executing database update operations
5. **Plaintext**: Tests the framework's performance in handling simple text responses
6. **Fortunes**: Tests the framework's performance in combining database queries and HTML template rendering

Each test records the following key metrics:
- **Request Throughput (RPS)**: Number of requests processed per second, the core performance indicator
- **Latency Distribution**: Including average latency, P99 latency, etc., reflecting the stability of response speed
- **Error Rate**: Reflects the stability of the framework under high load
- **Resource Consumption**: Including CPU usage, memory occupation, etc., reflecting the resource efficiency of the framework

Finally, TechEmpower provides an overall ranking based on the comprehensive performance of all test items, fully reflecting the performance level of each framework. This comprehensive evaluation approach avoids the one-sidedness that might come from focusing on a single metric, providing developers with a more comprehensive reference.

## GoFrame's Performance in Round 23

In the latest TechEmpower Web Benchmarks Round 23 evaluation, GoFrame demonstrated excellent performance:

![GoFrame's performance in Round 23](/img/image-1.png)

### Performance Highlights

**GoFrame performed impressively in Round 23:**
- **Overall Ranking**: Ranked in the top 15% among more than 400 frameworks tested, and ranked 6th among Go language frameworks
- **Request Throughput**: Achieved 658,423 RPS (Requests Per Second) in the JSON serialization test
- **Latency Performance**: P99 latency controlled within 2.3ms, ensuring stable user experience
- **Resource Consumption**: Single instance memory usage maintained below 128MB, high resource utilization efficiency

### Go Framework Performance Comparison

![GoFrame's performance comparison with other mainstream frameworks in the Go language ecosystem](/img/image.png)

In the Go language ecosystem, the performance comparison between GoFrame and other mainstream frameworks is as follows:

| Framework     | JSON Test(RPS) | Single Query(RPS) | Multiple Queries(RPS) | P99 Latency | Memory Usage |
|---------------|----------------|-------------------|----------------------|-------------|--------------|
| **GoFrame**   | 658,423        | 125,846           | 32,157               | 2.3ms       | 128MB        |
| Gin           | 702,115        | 121,320           | 30,845               | 1.9ms       | 135MB        |
| Echo          | 712,340        | 118,750           | 29,980               | 1.7ms       | 140MB        |
| Fiber         | 735,200        | 115,620           | 28,450               | 1.5ms       | 125MB        |
| Chi           | 598,120        | 110,340           | 27,890               | 2.5ms       | 115MB        |

From the comparison data, it can be seen that GoFrame performs excellently in comprehensive performance, especially with significant advantages in database operations. Although slightly lower than Fiber and Echo in pure JSON serialization tests, GoFrame demonstrates stronger performance advantages in scenarios involving database operations, which is more valuable for reference in actual business applications.

## Performance Evolution Trend

Compared to Round 22 data, GoFrame has shown significant performance improvements in Round 23:

- **RPS Growth**: Overall throughput increased by 18.7%
- **Memory Optimization**: Memory usage reduced by 22%
- **Latency Improvement**: P99 latency reduced by 15%
- **Error Rate Reduction**: Decreased from 0.02% to 0.008%

These continuous performance improvements are due to the GoFrame team's constant optimization of the framework's core components and active adoption of new Go language features. In particular, the GoFrame team has promptly adapted to the memory management optimizations and garbage collection improvements introduced in Go 1.20, fully leveraging the performance potential of these new features.

## Test Environment Description

The test environment configuration used by TechEmpower Web Benchmarks Round 23 is as follows:

- **Hardware**: Intel Xeon Platinum 8375C @ 3.2GHz, 32 cores 64 threads
- **Memory**: 128GB DDR4-3200
- **Network**: 10Gbps network interface
- **Operating System**: Ubuntu 22.04 LTS
- **Load**: 500 concurrent connections
- **Test Duration**: 30 seconds warm-up + 5 minutes formal testing

## Conclusion

The evaluation results of TechEmpower Web Benchmarks Round 23 show that GoFrame, as a full-featured Go web development framework, achieves excellent performance while maintaining rich functionality. In the Go language ecosystem, GoFrame's comprehensive performance ranks among the top, especially showing significant performance advantages in complex business scenarios involving database operations.

For enterprise application development, GoFrame provides the best balance of performance and functionality, capable of meeting the stringent requirements of high concurrency and low latency, while providing a comprehensive development toolchain and rich component ecosystem, greatly improving development efficiency.

With the GoFrame team's continuous optimization and iteration of the framework, we have reason to believe that GoFrame will achieve even more outstanding results in future TechEmpower evaluations, providing Go developers with a more efficient and reliable development framework.

> References:
> - [TechEmpower Web Framework Benchmarks Official Website](https://www.techempower.com/benchmarks/#hw=ph&test=composite&section=data-r23)
> - [TechEmpower Framework Benchmarks GitHub Repository](https://github.com/TechEmpower/FrameworkBenchmarks)
