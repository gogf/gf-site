## 概述
在前面的章节我们已经学会了如何利用脚手架生成项目目录. 本文我们继续探讨一下如何结合golang后端框架goframe和js前端框架vue进行开发. 内容比较详尽,各位不妨跟随步骤搭建环境后自行验证. 本文涉及到两个工程:
- caas-deployer: https://gitee.com/liangziyisheng/caas-deployer.git
- caas-deployer-web: https://gitee.com/liangziyisheng/caas-deployer-web.git

caas-deployer+caas-deployer-web是一个前后端分离开发的私有云[容器云]管理平台的安装器. 安装器可以可视化安装一套私有云[容器]管理平台,该私有云平台将自带访问管理、容器服务、监控预警、流程管理、DevOps、CMDB、数据安全等运维服务相关功能模块.

## 前端
先说前端,前端使用了vue3+vite+element-plus实现的.
- 利用脚手架创建vue3工程
  ```
  yarn create vue
  ```

- 中间就是开发vue页面了,前端流程比较简单,这里就不赘述了.有兴趣的同学们可以参考element-plus官网文档做一做.

- 安装依赖&构建生成dist
  ```
  yarn install
  yarn build
  ```
  > 生成的dist目录将在后续gf打包过程中用到

## 后端
再说说后端,因为前面章节已经说了很多关于后端的脚手架流程了.这里仅仅再次总结一下:
- 初始化项目
  ```bash
  gf init caas-deployer
  ```
- 数据库建模[可选]
  > 如果不需要和数据库打交道也就没有这一步了.
  ```sql
  -- 在数据库里提前建立好库和表对象,一般我比较喜欢放在manifest目录下.在这个例子中表名t_开头而字段名以f_开头.
  create table caas_depoyer.t_workload (
  f_id int auto_increment primary key,
  f_app_code varchar(30) comment "应用编码",
  f_name varchar(150) comment "工作负载名称",
  f_version varchar(50) comment "工作负载版本",
  f_description text comment "工作负载说明",
  f_status varchar(1) comment "状态",
  f_grafana_url varchar(255) comment "prometheus监控地址",
  f_unhealth_metrics text comment "异常指标",
  UNIQUE KEY (f_app_code, name)
  );

  ```
- gf生成dao[可选]
  > 如果不需要和数据库打交道也就没有这一步了.
  - 上面创建数据库和表之后,现在需要配置hack/config.yaml,这个配置文件对gf生成dao有用.
  ```yaml
  gfcli:
    gen:
      dao:
        - link: "mysql:caas_deployer:EYiA7Qd%#+J@tcp(127.0.0.1:3306)/caas_deployer"
          tables: "t_application,t_database,t_kubernetes,t_middleware,t_server,t_alert,t_workload,t_stastics,t_report,t_endpoint,t_attackaccess,t_slowaccess,t_slowinterface"
          removePrefix: "t_"
          removeFieldPrefix: "f_"
          descriptionTag: true
          noModelComment: true
          jsonCase: "CamelLower"
          overwriteDao: true
      service:
        - overwrite: true
          clear: false
  ```
  > 特别提醒: 上面在建模的时候表和字段名我都是分别以t_和f_开头, 这里可以通过配置removePrefix和removeFieldPrefix就可以在之后生成dao的时候就不再包含了此前缀,不得不说该工具考虑还挺全面的,给作者点赞. 接下来就可以执行命令生成dao了.
  ```bash
  gf gen dao
  ```
- 编写接口定义
  > 接口定义位于项目结构的api/installer/v1目录(目录需要自己手工创建),结构体名称按照规范要求去写即可. xxxReq和xxxRes是给controller层用的.xxxInput和xxxOutput是给logic层用的. controller和logic层通过service层解耦.
  ```golang
	package v1
	import (
		"github.com/gogf/gf/v2/frame/g"
	)
	type PingReq struct {
		g.Meta  `path:"/ping" tags:"配置" method:"post" summary:"连通性测试"`
		Servers []Server `json:"servers" description:"服务器列表"`
	}
	type PingRes struct {
		g.Meta `mime:"application/json"`
		Result map[string]bool `json:"result" dc:"连通性测试结果"`
	}
	type PingInput struct {
		Servers []Server `json:"servers" description:"服务器列表"`
	}
	type PingOutput struct {
		Result map[string]bool `json:"result" dc:"连通性测试结果"`
	}
  ```
- 生成controller
  > 这一步生成controller层,只是一些没有实现逻辑空方法,后续等logic层实现了之后直接在这儿通过service层调用即可. 以下例子是我已经实现了controller的方法. 大家看到这里的入参PingReq和出参PingRes都是上面api接口定义里的.
  ```bash
  gf gen ctrl
  ```
  ```golang
	package installer
	import (
		"context"
	
		v1 "k8s-deployer/api/installer/v1"
		"k8s-deployer/internal/service"
	)
	func (c *ControllerV1) Ping(ctx context.Context, req *v1.PingReq) (res *v1.PingRes, err error) {
		input := &v1.PingInput{}
		out := &v1.PingOutput{}
		res = &v1.PingRes{}
		input.Servers = req.Servers
		out, err = service.Installer().Ping(ctx, input)
		res.Result = out.Result
		return
	}
  ```
- 实现logic层
  > 这一步是真正写业务逻辑的地方,业务逻辑层可以调dao访问数据库,可以调第三方API,可以调其他中间件的api等等. 那当然,你也可以不要logic层,把业务逻辑统统都写到controller里实现,不过我不建议那样做.logic层才是项目开发过程中最耗时的,因为所有复杂逻辑都在这儿.controller层仅仅是透过service层整合logic实现的结果后返回给用户.
  - 创建internal/logic/installer/installer.go
  ```golang
	package installer
	import (
		"context"
		v1 "k8s-deployer/api/installer/v1"
		"github.com/gogf/gf/v2/errors/gerror"
		"github.com/gogf/gf/v2/frame/g"
		"golang.org/x/crypto/ssh"
	)
	type sInstaller struct{}
	func init() {
		service.RegisterInstaller(New())
	}
	func New() *sInstaller {
		return &sInstaller{}
	}
	var l = g.Log("logger for installer")
	// 连接检测
	func (c *sInstaller) Ping(ctx context.Context, in *v1.PingInput) (out *v1.PingOutput, err error) {
		out = &v1.PingOutput{}
		out.Result = make(map[string]bool)
		l.Debug(ctx, in.Servers)
		for _, s := range in.Servers {
			if sshTest(ctx, s.Ip, s.Port, s.Account, s.Password) {
				out.Result[s.Ip] = true
			} else {
				out.Result[s.Ip] = false
			}
		}
		return
	}
  ```
- gf生成service
  > 这一步依据logic层的目录结果和方法名称生成service层供controller层调用,和dao一样,这里生成的go文件不要去改.
  ```
  gf gen service
  ```
  ```golang
	// ================================================================================
	// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
	// You can delete these comments if you wish manually maintain this interface file.
	// ================================================================================
	
	package service
	
	import (
		"context"
		v1 "k8s-deployer/api/installer/v1"
	)
	
	type (
		IInstaller interface {
			// 连接检测
			Ping(ctx context.Context, in *v1.PingInput) (out *v1.PingOutput, err error)
			// 开始从0安装
			Deploy(ctx context.Context, in *v1.DeployInput) (err error)
			// 从失败处继续安装
			Continue(ctx context.Context, in *v1.ContinueInput) (err error)
			// 进度查询
			Progress(ctx context.Context, in *v1.ProgressInput) (out *v1.ProgressOutput, err error)
			// 完成部署,终止程序
			Complete(ctx context.Context) (out *v1.CompleteOutput, err error)
		}
	)
	
	var (
		localInstaller IInstaller
	)
	
	func Installer() IInstaller {
		if localInstaller == nil {
			panic("implement not found for interface IInstaller, forgot register?")
		}
		return localInstaller
	}
	
	func RegisterInstaller(i IInstaller) {
		localInstaller = i
	}

  ```
- 实现controller层
  > 这一步实际上是完善上面gf生成的controller里面的空方法,因为业务逻辑在logic层已经实现了,这里直接透过service层调logic层方法即可.
  ```golang
	package installer
	
	import (
		"context"
	
		v1 "k8s-deployer/api/installer/v1"
		"k8s-deployer/internal/service"
	)
	
	func (c *ControllerV1) Ping(ctx context.Context, req *v1.PingReq) (res *v1.PingRes, err error) {
		input := &v1.PingInput{}
		out := &v1.PingOutput{}
		res = &v1.PingRes{}
		input.Servers = req.Servers
		out, err = service.Installer().Ping(ctx, input)
		res.Result = out.Result
		return
	}
  ```

- 注册路由: 修改cmd/cmd.go
  > 这里重点说一下静态资源,因为我们是个前后端分离的项目,要把前端编译后的dist放到这里让goframe识别到需要做一些特殊设置. 首先s.SetIndexFolder(true),然后添加静态资源路径.因为我要让goframe编译好的二进制文件能直接访问到同目录下的dist目录.所以我这里就直接把dist目录放到和main.go同一目录下即可.
  ```golang
	var (
		Main = gcmd.Command{
			Name:  "main",
			Usage: "main",
			Brief: "start http server",
			Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
				s := g.Server()
				s.SetIndexFolder(true)
				s.SetServerRoot("dist")
				s.AddStaticPath("/config", "dist")
				s.AddStaticPath("/result", "dist")
				s.Group("/api", func(group *ghttp.RouterGroup) {
					group.Middleware(ghttp.MiddlewareHandlerResponse)
					// 允许跨域
					group.Middleware(MiddlewareCORS)
					group.Bind(
						installer.NewV1(),
					)
				})
				s.Run()
				return nil
			},
		}
	)
  ```
- 编译打包
  - 编译成二进制文件,这里可以配置一下hack/config.yaml,指定二进制文件的名称,在我项目里我直接叫app.
    ```
    gf build
    ```
  - 编译前端工程,完事后扔到gf项目目录里去
    ```
    yarn build
    ```
  - 压缩
    ```
    zip -r caas-deployer.zip app manifest dist start.sh stop.sh
    ```
- 部署
  > 解压启动即可


## 更多
因为vue还是比较方便的,平时工作都是以前后端分离的项目为主,几乎没有在后端撸模板文件的.以上以安装器这一前后端分离的项目作为例子给大家说明这一工程开发过程,因为接触goframe已经有很长时间了,总体还是比较顺利的.可能大家觉得仍然不够智能特别是打包和部署那一块,其实我们已经通过流水线实现了持续集成和持续发布,限于篇幅有限没有细说.后续有任何问题可以在文章后留言评论.
> 特别提醒: 安装器项目是一个正式的开源项目,请大家多多关注. 安装器可以可视化安装一套私有云[容器]管理平台,该私有云平台将自带访问管理、容器服务、监控预警、流程管理、DevOps、CMDB、数据安全等运维服务相关功能模块.
  