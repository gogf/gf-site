---
slug: '/docs/web/http-client-transport'
title: 'HTTPClient - Transport'
sidebar_position: 5
hide_title: true
keywords: [GoFrame, GoFrame framework, HTTPClient, Transport, Unix Socket, Custom Transport, http.Client, gclient.Client, Client Connection Pool, MaxIdleConnsPerHost]
description: "In the GoFrame framework, advanced usage of HTTPClient is achieved through custom Transport. This includes methods of client-server communication using Unix Socket and specific implementations for setting the size of the client connection pool parameters. The examples provide a wealth of real code snippets to help developers better understand and apply these techniques."
---

Since `gclient.Client` internally wraps and extends the `http.Client` object from the standard library, any features available in `http.Client` are also supported by `gclient.Client`. Here, we are discussing examples of Transport usage. Let's look at a few examples:

## Using `Unix Socket`

The client and server communicate using `Unix Socket`, implemented using `Transport`. The following code is excerpts from a real project and cannot run independently, only for reference.

```go
func (*Guardian) ConvertContainerPathToHostPath(
    ctx context.Context, namespace, podName, containerName, containerPath string,
) (string, error) {
    var (
        client = g.Client()
        url    = "http://localhost/api/v1/pod/path"
        req    = webservice.HostPathInfoReq{
            Namespace:     namespace,
            PodName:       podName,
            ContainerName: containerName,
            ContainerPath: containerPath,
        }
        res *webservice.HostPathInfoRes
    )
    client.Transport = &http.Transport{
        DialContext: func(ctx context.Context, network, addr string) (net.Conn, error) {
            return net.Dial("unix", serviceSocketPath)
        },
    }
    err := client.ContentJson().GetVar(ctx, url, req).Scan(&res)
    if err != nil {
        return "", gerror.Wrapf(
            err,
            `request guardian failed for url: %s, req: %s`,
            url, gjson.MustEncodeString(req),
        )
    }
    if res == nil {
        return "", gerror.Newf(
            `nil response from guardian request url: %s, req: %s`,
            url, gjson.MustEncodeString(req),
        )
    }
    return res.HostPath, nil
}
```

## Setting Client Connection Pool Size Parameters

```go
func ExampleNew_MultiConn_Recommend() {
    var (
        ctx    = gctx.New()
        client = g.Client()
    )

    // controls the maximum idle (keep-alive) connections to keep per-host
    client.Transport.(*http.Transport).MaxIdleConnsPerHost = 5

    for i := 0; i < 5; i++ {
        go func() {
            if r, err := client.Get(ctx, "http://127.0.0.1:8999/var/json"); err != nil {
                panic(err)
            } else {
                fmt.Println(r.ReadAllString())
                r.Close()
            }
        }()
    }

    time.Sleep(time.Second * 1)

    // Output:
    //{"id":1,"name":"john"}
    //{"id":1,"name":"john"}
    //{"id":1,"name":"john"}
    //{"id":1,"name":"john"}
    //{"id":1,"name":"john"}
}
```