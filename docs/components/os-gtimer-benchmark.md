# 定时器-性能测试

## 性能测试

```
goos: linux
goarch: amd64
pkg: github.com/gogf/gf/v2/os/gtimer
Benchmark_Add-12                         4048776               291.9 ns/op           249 B/op          6 allocs/op
Benchmark_StartStop-12                  100000000              10.96 ns/op             0 B/op          0 allocs/op
PASS
ok      command-line-arguments    6.602s
```

> 页面: https://goframe.org/docs/components/os-gtimer-benchmark
