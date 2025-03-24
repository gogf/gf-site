---
slug: '/docs/web/senior-https'
title: 'HTTPS & TLS'
sidebar_position: 2
hide_title: true
keywords: [GoFrame,HTTPS,TLS,WebServer,Certbot,Let’s Encrypt,SSL证书,ghttp,自动续期,证书生成]
description: "Build an HTTPS service using the GoFrame framework, including preparation, example code, and how to obtain a free SSL certificate via Let's Encrypt. Additionally, it discusses methods to support both HTTP and HTTPS access protocols under the same WebServer, ensuring your application is more secure."
---

## HTTPS Service

Establishing an `HTTPS` service is very simple, using the `EnableHTTPS(certFile, keyFile string) error` method provided by the framework's WebServer. Obviously, this method requires two parameters, namely, two certificate files used for `HTTPS` asymmetric encryption and the corresponding key file.

### Preparation

For local demonstrations, we can use the `openssl` command to generate a local certificate and the corresponding key file for testing. The command is as follows:

1. Use the common `RSA` algorithm to generate a key file

```shell
openssl genrsa -out server.key 2048
```

Additionally, we can use the `ECDSA` algorithm to generate the key file:

```shell
openssl ecparam -genkey -name secp384r1 -out server.key
```

2. Generate a certificate file based on the key file

```shell
openssl req -new -x509 -key server.key -out server.crt -days 365
```

3. (Optional) Generate a public key file based on the key, which is used for client-server communication

```shell
openssl rsa -in server.key -out server.key.public
```

The `openssl` supports many algorithms and command parameters. If you want to learn more, please use the `man openssl` command to view. In this example, the local environment (`Ubuntu`) uses the command to generate the related key, public key, and certificate files as follows:

```bash
$ openssl genrsa -out server.key 2048
Generating RSA private key, 2048 bit long modulus
.........................+++
.....................................................................+++
unable to write 'random state'
e is 65537 (0x10001)

$ openssl req -new -x509 -key server.key -out server.crt -days 365
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields, there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:CH
State or Province Name (full name) [Some-State]:SiChuan
Locality Name (eg, city) []:Chengdu
Organization Name (eg, company) [Internet Widgits Pty Ltd]:John.cn
Organizational Unit Name (eg, section) []:Dev
Common Name (e.g. server FQDN or YOUR name) []:John
Email Address []:john@johng.cn

$ openssl rsa -in server.key -out server.key.public
writing RSA key

$ ll
total 20
drwxrwxr-x  2 john john 4096 Apr 23 21:26 ./
drwxr-xr-x 90 john john 4096 Apr 23 20:55 ../
-rw-rw-r--  1 john john 1383 Apr 23 21:26 server.crt
-rw-rw-r--  1 john john 1675 Apr 23 21:25 server.key
-rw-rw-r--  1 john john 1675 Apr 23 21:26 server.key.public
```

When generating the certificate, the command prompts you to enter some information, which you can leave blank by pressing enter. We randomly filled in some information here.

### Example Code

Based on the generated key and certificate files, we demonstrate how to use `ghttp.Server` to implement an HTTPS service. The example code is as follows:

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := ghttp.GetServer()
    s.BindHandler("/", func(r *ghttp.Request){
        r.Response.Writeln("Hello world from HTTPS!")
    })
    s.EnableHTTPS("/home/john/https/server.crt", "/home/john/https/server.key")
    s.SetPort(8199)
    s.Run()
}
```

As you can see, we directly pass the addresses of the previously generated certificate and key files to `EnableHTTPS`, and set the HTTPS service port using `s.SetPort(8199)`. Of course, we can also use `s.SetHTTPSPort(8199)` to achieve this. In a single service, there is no difference between the two, but when `WebServer` needs to support both `HTTP` and `HTTPS` services simultaneously, their roles are different. We will introduce this feature later. Afterward, we visit the page [https://127.0.0.1:8199/](https://127.0.0.1:8199/) to see the effect:

![](/markdown/5dc4bd89fa1808fd5bd803fbb51d8436.png)

You can see the browser gives a prompt, mainly because the certificate we generated is private, not provided by a third-party trusted company. Browsers usually come with some third-party trusted HTTPS certificate authorities. HTTPS certificates provided by these authorities are considered authoritative and trustworthy by the browser, which is why this prompt does not appear. Generally, this kind of third-party trusted authority certificate cost ranges from a few thousand to tens of thousands of RMB per year. Interested friends can learn more through search engines.

![](/markdown/cf2c20d3a4af3e5f3efe850b5fa89bc1.png)

Here, we directly click `Advanced`, then click `Proceed to 127.0.0.1 (unsafe)`, and finally, you can see the expected result output on the page:

![](/markdown/725593f084b193851698d89a35a2bc40.png)

## Support for `HTTPS` and `HTTP`

We often encounter situations where we need to provide the same service through both HTTP and HTTPS, that is, the only difference is the port and access protocol, while everything else is the same. If we run it using the traditional method of multiple `WebServers`, it will be cumbersome. To easily solve the developer's troubles, `ghttp` provides a very convenient feature: supports "the same" `WebServer` to simultaneously support both `HTTPS` and `HTTP` access protocols. Let's take a look at an example:

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := ghttp.GetServer()
    s.BindHandler("/", func(r *ghttp.Request){
        r.Response.Writeln("You can see this content through both HTTP and HTTPS!")
    })
    s.EnableHTTPS("/home/john/https/server.crt", "/home/john/https/server.key")
    s.SetHTTPSPort(443)
    s.SetPort(80)
    s.Run()
}
```

After execution, accessing these two addresses locally [http://127.0.0.1/](http://127.0.0.1/) and [https://127.0.0.1/](https://127.0.0.1/) will show the same content (it should be noted that due to some systems' permission restrictions, WebServer binding `80` and `443` ports require `root/administrator` permissions. If an error is reported when starting, you can change the port number and re-execute it).

In this example, we used two methods to enable HTTPS features:

```go
func (s *Server) EnableHTTPS(certFile, keyFile string) error
func (s *Server) SetHTTPSPort(port ...int) error
```

One is to add certificate and key files, and the other is to set the listening port for the HTTPS protocol. Once these two properties are set, the WebServer will enable the HTTPS feature. Moreover, the example also sets the listening port for HTTP services through the `SetPort` method, so the WebServer will simultaneously listen to the specified HTTPS and HTTP service ports.

## Using `Let’s Encrypt` Free Certificates

There are many `SSL free certificate` authorities, such as:

1. `Tencent Cloud DV SSL Certificate`: [https://cloud.tencent.com/product/ssl](https://cloud.tencent.com/product/ssl)
2. `Let’s Encrypt`: [https://letsencrypt.org/](https://letsencrypt.org/)
3. `CloudFlare SSL`: [https://www.cloudflare.com/](https://www.cloudflare.com/)
4. `StartSSL`: [https://www.startcomca.com/](https://www.startcomca.com/)
5. `Wosign沃通SSL`: [https://www.wosign.com/](https://www.wosign.com/)
6. `loovit.net AlphaSSL`: [https://www.lowendtalk.com/entry/register?Target=discussion%2Fcomment%2F2306096](https://www.lowendtalk.com/entry/register?Target=discussion%2Fcomment%2F2306096)

The following example uses `Let's Encrypt` to introduce how to apply, use, and renew a free certificate.

`Let’s Encrypt` official website: [https://letsencrypt.org/](https://letsencrypt.org/)

The following is an example of how to apply for a `Let's Encrypt` free certificate and use it with the `GoFrame` framework under the `Ubuntu` system.

### Install `Certbot`

`Certbot` official website: [https://certbot.eff.org/](https://certbot.eff.org/)

To apply for a `Let’s Encrypt` free certificate, you need to use the `certbot` tool:

```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
```

### Apply for a Certificate

Use the following command:

```
certbot certonly --standalone -d domain_name --staple-ocsp -m email_address --agree-tos
```

For example:

```
root@ip-172-31-41-204:~# certbot certonly --standalone -d goframe.org --staple-ocsp -m john@goframe.org --agree-tos
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator standalone, Installer None
Starting new HTTPS connection (1): acme-v02.api.letsencrypt.org
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for goframe.org
Waiting for verification...
Cleaning up challenges

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/goframe.org/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/goframe.org/privkey.pem
   Your cert will expire on 2019-01-25. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

By default, the certificate will be installed in `/etc/letsencrypt/`, with the certificate and private key files respectively being:

```
/etc/letsencrypt/live/goframe.org/fullchain.pem
/etc/letsencrypt/live/goframe.org/privkey.pem
```

### Use the Certificate

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := ghttp.GetServer()
    s.BindHandler("/", func(r *ghttp.Request){
        r.Response.Writeln("Hello world from HTTPS!")
    })
    s.EnableHTTPS("/etc/letsencrypt/live/goframe.org/fullchain.pem", "/etc/letsencrypt/live/goframe.org/privkey.pem")
    s.Run()
}
```

### Certificate Renewal

The certificate is valid for `3 months` by default, and it needs to be renewed manually after expiration, using the following command:

```
certbot renew
```

Example 1, we can use the `crontab` scheduled task to achieve automatic renewal:

```
# Try to renew once a day, restart the WebServer running on `GoFrame` framework successfully
0 3 * * * certbot renew --quiet --renew-hook "kill -SIGUSR1 $(pidof process_name)"
```

Example 2, if we manage the certificate through `nginx`, we can set up a scheduled task like this:

```
# Try to renew once a day, certificate renewal requires closing the WebServer listening on port 80
0 3 * * * service nginx stop && certbot renew --quiet --renew-hook "service nginx start"
```

To prevent potential failures of the `certbot renew` command leading to `nginx` not restarting, to ensure stability, you can do this:

```
# Try to renew once a day, certificate renewal requires closing the WebServer listening on port 80
0 3 * * * service nginx stop && certbot renew --quiet --renew-hook "service nginx start"
5 3 * * * service nginx start
```