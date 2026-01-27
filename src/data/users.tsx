
import { translate } from '@docusaurus/Translate';
import { sortBy } from '@site/src/utils/jsUtils';

export type TagType =
  | 'favorite'
  | 'v1'
  | 'v2'
  | 'opensource'
  | 'product'
  | 'adminui'
  | 'frontui'
  | 'library'
  | 'micro'
  | 'cloudnative'
  | 'tool'
  | 'ai'


const Users: User[] = [
  {
    title: 'GFast',
    description: '基于GoFrame 2.x+Vue3+Element Plus+MySQL、PostgreSQL等技术的管理系统，拥有后台基础管理模块，吸取数千用户建议的代码生成工具，全部自主研发，功能完整可控的插件，自定义表单及符合国人审批习惯的流程设计让您拥有众多零代码能力。',
    preview: require('./showcase/gfast.png'),
    website: 'https://www.g-fast.cn/',
    source: 'https://github.com/tiger1103/gfast',
    tags: ['opensource', 'favorite', 'adminui', 'product', 'v2'],
  },
  {
    title: 'Letga',
    description: '基于 GoFrame 和 AntDesign 的中后台管理系统。Letga 集成了通用的中后台基础功能组件，是一款规范化、易扩展、体验佳的企业级开源系统。',
    preview: require('./showcase/letga.png'),
    website: 'https://github.com/lgcgo/letga-server',
    source: 'https://github.com/lgcgo/letga-server',
    tags: ['opensource', 'adminui', 'v2'],
  },
  {
    title: 'DMicro',
    description: 'DMicro是一个高效、可扩展且简单易用的微服务框架。包含drpc,dserver等组件。',
    preview: require('./showcase/dmicro.png'),
    website: 'https://dmicro.vprix.com/#/',
    source: 'https://github.com/osgochina/dmicro',
    tags: ['opensource', 'micro', 'v2'],
  },
  {
    title: 'Jupiter',
    description: 'Jupiter is a governance-oriented microservice framework, which is being used for years at Douyu.',
    preview: require('./showcase/jupiter.png'),
    website: 'https://jupiter.douyu.com/',
    source: 'https://github.com/douyu/jupiter',
    tags: ['opensource', 'micro', 'v1'],
  },
  {
    title: 'HotGo',
    description: 'HotGo是一个基于 Vue 和 GoFrame 2.0 开发的全栈前后端分离的开发基础平台和移动应用平台，集成jwt鉴权，动态路由，动态菜单，casbin鉴权，消息队列，定时任务等功能，提供多种常用场景文件，让您把更多时间专注在业务开发上。 ',
    preview: require('./showcase/hotgo.png'),
    website: 'https://hotgo.facms.cn/admin',
    source: 'https://github.com/bufanyun/hotgo',
    tags: ['opensource', 'favorite', 'adminui', 'product', 'v2'],
  },
  {
    title: 'DNSLog-GO',
    description: 'DNSLog-GO 是一款golang编写的监控 DNS 解析记录的工具，自带Web界面。',
    preview: require('./showcase/dnslog-go.png'),
    website: 'https://github.com/lanyi1998/DNSlog-GO',
    source: 'https://github.com/lanyi1998/DNSlog-GO',
    tags: ['opensource', 'frontui', 'v1'],
  },
  {
    title: 'Nemo',
    description: 'Nemo是用来进行自动化信息收集的一个简单平台，通过集成常用的信息收集工具和技术，实现对内网及互联网资产信息的自动收集，提高隐患排查和渗透测试的工作效率。',
    preview: require('./showcase/nemo.png'),
    website: 'https://github.com/hanc00l/nemo_go',
    source: 'https://github.com/hanc00l/nemo_go',
    tags: ['opensource', 'adminui', 'v1'],
  },
  {
    title: 'OpenSCRM',
    description: 'OpenSCRM是一套基于Go和React的高质量企业微信私域流量管理系统 。遵守Apache2.0协议，全网唯一免费商用。企业微信、私域流量、SCRM。',
    preview: require('./showcase/openscrm.png'),
    website: 'https://github.com/openscrm/api-server',
    source: 'https://github.com/openscrm/api-server',
    tags: ['opensource', 'adminui', 'v1'],
  },
  {
    title: 'Magma',
    description: 'Platform for building access networks and modular network services.',
    preview: require('./showcase/magma.png'),
    website: 'https://magmacore.org/',
    source: 'https://github.com/magma/magma',
    tags: ['opensource', 'adminui', 'v1'],
  },
  {
    title: 'Hybridnet',
    description: 'Make underlay and overlay network can coexist, communicate, even be transformed purposefully.',
    preview: require('./showcase/hybridnet.png'),
    website: 'https://github.com/alibaba/hybridnet',
    source: 'https://github.com/alibaba/hybridnet',
    tags: ['opensource', 'cloudnative', 'v1'],
  },
  {
    title: 'EasyGoAdmin',
    description: '基于Golang、GoFrame、Vue、ElementUI、MySQL等技术栈开发平台框架，拥有完善的(RBAC)权限架构和基础核心管理模块，可以一键CRUD生成整个模块的全部代码，本框架为一站式系统框架开发平台，可以帮助开发者提升开发效率、降低研发成本...',
    preview: require('./showcase/easy-go-admin.png'),
    website: 'https://www.easygoadmin.vip/',
    source: 'https://gitee.com/easygoadmin/EasyGoAdmin_GoFrame_EleVue',
    tags: ['opensource', 'adminui', 'product', 'v1'],
  },
  {
    title: 'SagooIOT',
    description: 'SagooIOT是一个基于Golang开发的开源的企业级物联网基础开发平台。负责设备管理和协议数据管理，支持跨平台的物联网接入及管理方案，平台实现了物联网开发相关的基础功能，基于该功能可以快速的搭建起一整套的IOT相关的业务系统...',
    preview: require('./showcase/sagooiot.png'),
    website: 'https://iotdoc.sagoo.cn/',
    source: 'https://github.com/sagoo-cloud/sagooiot',
    tags: ['opensource', 'favorite', 'adminui', 'product', 'v2'],
  },
  {
    title: 'GF2-Demo',
    description: 'GF2-Demo 是一个基于 GoFrameV2 用来快速开发后端服务的脚手架, 目标使开发者只需关注业务逻辑的编写, 快速且规范地交付项目。',
    preview: require('./showcase/gf2-demo.png'),
    website: 'https://github.com/windvalley/gf2-demo',
    source: 'https://github.com/windvalley/gf2-demo',
    tags: ['opensource', 'v2'],
  },
  {
    title: 'Oldme-API',
    description: 'Oldme-API 是一个基于GoFrame 的前后端分离的个人博客系统，可做为学习 GoFrame 的参考项目。欢迎访问我们博客来一起交流学习。',
    preview: require('./showcase/oldme-api.png'),
    website: 'https://github.com/oldme-git/oldme-api',
    source: 'https://github.com/oldme-git/oldme-api',
    tags: ['opensource', 'frontui', 'v2'],
  },
  {
    title: 'ZzeAdminGo',
    description: '基于 Golang GoFrame + vue3 的、前后端分离的后台管理系统快捷使用模板，支持按钮级别的 RBAC。',
    preview: require('./showcase/zze-admin-go.png'),
    website: 'http://admin.zze.xyz/#/login',
    source: 'https://github.com/zze326/zze-admin-go',
    tags: ['opensource', 'adminui', 'v2'],
  },
  {
    title: 'GF-CMS',
    description: '基于GoFrame v2的企业网站内容管理系统。',
    preview: require('./showcase/gf-cms.jpg'),
    website: 'https://github.com/demozx/gf_cms',
    source: 'https://github.com/demozx/gf_cms',
    tags: ['opensource', 'adminui', 'frontui', 'v2'],
  },
  {
    title: 'UniTranslate',
    description: '基于 Go 实现的一个 百度 有道 谷歌 Deepl ChatGPTFree Google Translator API 免费的Google翻译 翻译统一管理接入平台 统一API 调用规范 多平台翻译...',
    preview: require('./showcase/uni-translate.png'),
    website: 'https://github.com/xgd16/UniTranslate',
    source: 'https://github.com/xgd16/UniTranslate',
    tags: ['opensource', 'tool', 'v2'],
  },
  {
    title: 'kkdl-go',
    description: '基于 GoFrameV2 的短链生成及管理管理平台。',
    preview: require('./showcase/kkdl-go.png'),
    website: 'https://github.com/vaebe/kkdl-go',
    source: 'https://github.com/vaebe/kkdl-go',
    tags: ['opensource', 'v2'],
  },
  {
    title: 'VncProxy',
    description: 'VncProxy 是使用Golang实现的Vnc远程桌面代理组件，完全解析rfb协议，支持远程桌面代理，rbs文件录屏，rbs文件回放，截图，录制视频。',
    preview: require('./showcase/vncproxy.png'),
    website: 'https://github.com/vprix/vncproxy',
    source: 'https://github.com/vprix/vncproxy',
    tags: ['opensource', 'tool', 'v2'],
  },
  {
    title: 'gdb-adapter',
    description: 'GoFrame ORM adapter for Casbin.',
    preview: require('./showcase/library.png'),
    website: 'https://github.com/vance-liu/gdb-adapter',
    source: 'https://github.com/vance-liu/gdb-adapter',
    tags: ['opensource', 'library', 'v1'],
  },
  {
    title: 'gf-casbin-adapter',
    description: 'GoFrame ORM adapter for Casbin.',
    preview: require('./showcase/library.png'),
    website: 'https://github.com/hailaz/gf-casbin-adapter',
    source: 'https://github.com/hailaz/gf-casbin-adapter',
    tags: ['opensource', 'library', 'v2'],
  },
  {
    title: 'csrf',
    description: 'CSRF middleware for GoFrame web server.',
    preview: require('./showcase/library.png'),
    website: 'https://github.com/gogf/csrf',
    source: 'https://github.com/gogf/csrf',
    tags: ['opensource', 'library', 'v2'],
  },
  {
    title: 'goframe-jsonrpc',
    description: '基于 goframe 实现的 jsonrpc2.0可以和 hyperf 的 jsonrpc 无缝对接。',
    preview: require('./showcase/library.png'),
    website: 'https://github.com/zhouyaozhouyao/goframe-jsonrpc',
    source: 'https://github.com/zhouyaozhouyao/goframe-jsonrpc',
    tags: ['opensource', 'library', 'v2'],
  },
  {
    title: 'gf-x-tool',
    description: 'GoFrame 的便利性使用扩展 —— GrayLog —— 快速返回处理 —— 在线翻译支持(百度,有道,google,deepl)。',
    preview: require('./showcase/library.png'),
    website: 'https://github.com/xgd16/gf-x-tool',
    source: 'https://github.com/xgd16/gf-x-tool',
    tags: ['opensource', 'library', 'v2'],
  },
  {
    title: 'gf-x-mqtt',
    description: '快速接入 MQTT。',
    preview: require('./showcase/library.png'),
    website: 'https://github.com/xgd16/gf-x-mqtt',
    source: 'https://github.com/xgd16/gf-x-mqtt',
    tags: ['opensource', 'library', 'v2'],
  },
  {
    title: 'go-orm-helper',
    description: '一个为了让你在 Goland 上写 ORM 能自动补全数据库字段、Tag、生成Struct的插件。支持：Gorm、Xorm、Beego、GoFrame...）',
    preview: require('./showcase/go-orm-helper.png'),
    website: 'https://github.com/johnmai-dev/go-orm-helper',
    source: 'https://github.com/johnmai-dev/go-orm-helper',
    tags: ['opensource', 'tool', 'v2'],
  },
  {
    title: 'GoFrame-Helper',
    description: 'GoFrame Helper 是一款针对 GoFrame 框架 的 Goland/IntelliJ 插件，它提供了代码提示，代码模板，gf 工具自动监听等功能，让您的 GoFrame 之旅更为愉快。',
    preview: require('./showcase/goframe-helper.png'),
    website: 'https://github.com/oldme-git/GoFrame-Helper',
    source: 'https://github.com/oldme-git/GoFrame-Helper',
    tags: ['opensource', 'tool', 'v2'],
  },
  {
    title: '50CMSgo',
    description: 'GoFrame+pearadmin构建的后端开发框架，可以快速搭建政府国产化网站，企业网站，微信小程序商城，html代码解耦合，传统html+css+js超级便于维护，可以跨平台部署在winserver，以及各种过国产操作系统。',
    preview: require('./showcase/50CMSgo.jpg'),
    website: 'https://gitee.com/dexters/50CMSgo',
    source: 'https://gitee.com/dexters/50CMSgo',
    tags: ['opensource', 'favorite', 'adminui', 'frontui', 'v2'],
  },
  {
    title: 'TEN-Agent',
    description: 'TEN Agent is the world’s first real-time multimodal agent integrated with the OpenAI Realtime API, RTC, and features weather checks, web search, vision, and RAG capabilities.',
    preview: require('./showcase/TEN-Agent.png'),
    website: 'https://github.com/TEN-framework/TEN-Agent',
    source: 'https://github.com/TEN-framework/TEN-Agent',
    tags: ['opensource', 'ai', 'frontui', 'v1'],
  },
  {
    title: 'Go-Admin',
    description: 'A golang framework helps gopher to build a data visualization and admin panel in ten minutes.',
    preview: require('./showcase/go-admin.png'),
    website: 'https://www.go-admin.com/',
    source: 'https://github.com/GoAdminGroup/go-admin',
    tags: ['opensource', 'adminui', 'v2'],
  },
  {
    title: 'Cool-Go-Admin',
    description: '一个很酷的后台管理系统开发框架。开源免费、Ai编码、流程编排、扩展插件、模块化。',
    preview: require('./showcase/cool-go-admin.png'),
    website: 'https://github.com/cool-team-official/cool-admin-go',
    source: 'https://github.com/cool-team-official/cool-admin-go',
    tags: ['opensource', 'product', 'adminui', 'v2'],
  },
  {
    title: 'Jie',
    description: 'Jie stands out as a comprehensive security assessment and exploitation tool meticulously crafted for web applications. Its robust suite of features encompasses vulnerability scanning...',
    preview: require('./showcase/jie.png'),
    website: 'https://jie.fireline.fun/',
    source: 'https://github.com/yhy0/Jie',
    tags: ['opensource', 'tool', 'v1'],
  },
  {
    title: 'Venom-Crawler',
    description: '毒液爬行器：专为捡洞而生的爬虫神器。',
    preview: require('./showcase/Venom-Crawler.png'),
    website: 'https://github.com/z-bool/Venom-Crawler',
    source: 'https://github.com/z-bool/Venom-Crawler',
    tags: ['opensource', 'tool', 'v1'],
  },
  {
    title: 'gvc',
    description: 'Geek‘s valuable collection. A cross-platform supertool that brings convinience to coding.',
    preview: require('./showcase/gvc.png'),
    website: 'https://github.com/gvcgo/gvc',
    source: 'https://github.com/gvcgo/gvc',
    tags: ['opensource', 'tool', 'v2'],
  },
  {
    title: 'veinmind-tools',
    description: 'veinmind-tools 是由长亭科技自研，基于 veinmind-sdk 打造的容器安全工具集。',
    preview: require('./showcase/veinmind-tools.png'),
    website: 'https://github.com/chaitin/veinmind-tools',
    source: 'https://github.com/chaitin/veinmind-tools',
    tags: ['opensource', 'tool', 'v1'],
  },
  {
    title: 'gogs',
    description: 'gogs is a simple, fast and lightweight game server framework written in golang.',
    preview: require('./showcase/gogs.png'),
    website: 'https://github.com/metagogs/gogs',
    source: 'https://github.com/metagogs/gogs',
    tags: ['opensource', 'v1'],
  },
  {
    title: 'wscan',
    description: 'Wscan is a web security scanner that focuses on web security, dedicated to making web security accessible to everyone.',
    preview: require('./showcase/wscan.png'),
    website: 'https://github.com/chushuai/wscan',
    source: 'https://github.com/chushuai/wscan',
    tags: ['opensource', 'tool', 'v1'],
  },
  {
    title: 'scan4all',
    description: 'Official repository vuls Scan: 15000+PoCs; 23 kinds of application password crack; 7000+Web fingerprints; 146 protocols and 90000+ rules Port scanning; Fuzz, HW, awesome BugBounty( ͡° ͜ʖ ͡°)...',
    preview: require('./showcase/scan4all.png'),
    website: 'https://github.com/GhostTroops/scan4all',
    source: 'https://github.com/GhostTroops/scan4all',
    tags: ['opensource', 'tool', 'v1'],
  },
  {
    title: 'crawlergo',
    description: 'A powerful browser crawler for web vulnerability scanners.',
    preview: require('./showcase/crawlergo.png'),
    website: 'https://github.com/Qianlitp/crawlergo',
    source: 'https://github.com/Qianlitp/crawlergo',
    tags: ['opensource', 'tool', 'v1'],
  },
  {
    title: '智元 Fast API SDK',
    description: '智元 Fast API 是一站式API管理系统，将各类LLM API进行统一格式、统一规范、统一管理，使其在功能、性能和用户体验上达到极致。',
    preview: require('./showcase/fastapi-sdk.png'),
    website: 'https://github.com/iimeta/fastapi-sdk',
    source: 'https://github.com/iimeta/fastapi-sdk',
    tags: ['opensource', 'adminui', 'v2'],
  },
  {
    title: 'skywalking-go',
    description: 'The Golang auto-instrument Agent for Apache SkyWalking, which provides the native tracing/metrics/logging abilities for Golang projects.',
    preview: require('./showcase/library.png'),
    website: 'https://github.com/apache/skywalking-go',
    source: 'https://github.com/apache/skywalking-go',
    tags: ['opensource', 'library', 'v2'],
  },
  {
    title: 'web-firewall',
    description: '基于Golang+Vue3 开发的Web Linux防火墙，前端使用SoybeanAdmin框架，后端使用GoFrame2，数据库支持 sqlite3(默认)/postgresql ，它可以在Linux系统中基于nfatables用于替代firewalld工具。',
    preview: require('./showcase/web-firewall.jpg'),
    website: 'https://github.com/moreKing/web-firewall',
    source: 'https://github.com/moreKing/web-firewall',
    tags: ['opensource', 'adminui', 'tool', 'v2'],
  },
  {
    title: '蜂鸟(HummingBird)',
    description: '蜂鸟物联网平台是由Golang编写的超轻量级物联网平台，具有轻量级、快速、极低的内存占用等特性，特别适用于个人开发者或初创公司承接中小型物联网项目。',
    preview: require('./showcase/hummingbird.png'),
    website: 'https://doc.hummingbird.winc-link.com/',
    source: 'https://github.com/winc-link/hummingbird',
    tags: ['opensource', 'adminui', 'v2'],
  },
  {
    title: 'Shopsuite Go商城系统',
    description: '基于Uniapp + Vue + ElementUi + Goframe框架的新零售社交电商系统（除了go商城系统外，还有java商城系统及php商城系统），适用于企业新零售、批发商城、B2B商业系统、社交电商商城、分销商城、微信小程序商城...',
    preview: require('./showcase/golershop.png'),
    website: 'https://www.shopsuite.cn/',
    source: 'https://github.com/shsuishang/golershop',
    tags: ['opensource', 'adminui', 'frontui', 'v2'],
  },
  {
    title: 'asciinema',
    description: 'A cross-platform asciinema(v2) terminal session recorder for MacOS/Linux/Windows. Currently a better choice than the official one.',
    preview: require('./showcase/asciinema.png'),
    website: 'https://asciinema.org/',
    source: 'https://github.com/gvcgo/asciinema',
    tags: ['opensource', 'tool', 'v2'],
  },
  {
    title: 'version-manager',
    description: 'A general version manager for thousands of SDKs with TUI inspired by lazygit. No need to remember any commands. Less bugs.',
    preview: require('./showcase/version-manager.png'),
    website: 'https://vdocs.vmr.us.kg/',
    source: 'https://github.com/gvcgo/version-manager',
    tags: ['opensource', 'tool', 'v2'],
  },
  {
    title: '土拨鼠开源充电系统',
    description: '土拨鼠开源充电系统是一套包含鸿蒙、微信小程序、云平台充电设备管理系统。鸿蒙App使用HarmonyOS 4.0开发，小程序使用uniapp开发；功能涉及：登录、注册、查找充电站和充电站、在线充电、订单查询、个人中心等...',
    preview: require('./showcase/HarmonyOS-groundhog-charging-system.png'),
    website: 'https://github.com/cheinlu/HarmonyOS-groundhog-charging-system',
    source: 'https://github.com/cheinlu/HarmonyOS-groundhog-charging-system',
    tags: ['opensource', 'adminui', 'frontui', 'v2'],
  },
  {
    title: '智元 IIM',
    description: '智元 IIM 是一款开源的网页版即时聊天系统, 同时拥有AI聊天对话功能, 支持ChatGPT、Midjourney、文心一言、讯飞星火、通义千问等AI助手功能。',
    preview: require('./showcase/iim-client.png'),
    website: 'https://github.com/iimeta/iim-client',
    source: 'https://github.com/iimeta/iim-client',
    tags: ['opensource', 'adminui', 'frontui', 'v2'],
  },
  {
    title: 'Chatcat',
    description: 'More Secure、Efficient、Integrated An chatGPT-based integrated efficiency tool.',
    preview: require('./showcase/chatcat.png'),
    website: 'https://chat.yippai.com/',
    source: 'https://github.com/MQEnergy/chatcat',
    tags: ['opensource', 'tool', 'ai', 'v2'],
  },
  {
    title: 'KubeCube',
    description: 'KubeCube is an open source enterprise-level container platform that provides enterprises with visualized management of Kubernetes resources and unified multi-cluster-multi-tenant management functions.',
    preview: require('./showcase/kubecube.png'),
    website: 'https://www.kubecube.io/',
    source: 'https://github.com/kubecube-io/KubeCube',
    tags: ['opensource', 'adminui', 'cloudnative', 'v2'],
  },
  {
    title: 'GoFrame-Vue-Element-Admin',
    description: '基于GoFrame2和vue-element-admin搭建的后台框架。',
    preview: require('./showcase/goframe-vue-element-admin.png'),
    website: 'https://gitee.com/lixianpei727/goframe-vue-element-admin',
    source: 'https://gitee.com/lixianpei727/goframe-vue-element-admin',
    tags: ['opensource', 'adminui', 'v2'],
  },
  {
    title: 'devinggo',
    description: '📱🚀 🧩devinggo 是一款基于 Vue 和 Goframe v2 的全栈开发平台，集成 JWT 鉴权、动态路由、消息队列等功能，提供丰富场景模板，助您快速构建企业级应用，专注业务开发。',
    preview: require('./showcase/devinggo.png'),
    website: 'https://devinggo.devinghub.com/',
    source: 'https://github.com/huagelong/devinggo',
    tags: ['opensource', 'adminui', 'v2'],
  },
  {
    title: 'GoframePro',
    description: '基于GoFrame V2框架和字节跳动ArcoDesign前端框架创建开发框架，为开发者快速开发项目。完整开发体系：Auth权限控制管理、数据字典、附件管理（集成本地、阿里云、腾讯云、七牛云的对象存储）、详细操作日志、完善配置管理（系统邮箱、应用配置、插件动态配）、开发工具（代码生成、代码插件市场一键安装和卸载）、支持单点登录等，框架有完整使用文档和GoFly社区全力支持，将推出使用视频教程，社区有众多开发者支持可以提供使用经验和丰富的市场插件支持。',
    preview: require('./showcase/goframepro.png'),
    website: 'https://goflys.cn/',
    source: 'https://github.com/huanglishi/GoFlyAdmin',
    tags: ['opensource', 'adminui', 'v2'],
  },
  {
    title: 'ai-mcp',
    description: '基于 Go 的 MCP 服务端，支持 SSE、受控命令执行、SQL/查询工具、时间工具，集成 GoFrame/MySQL，适配 IDE/Agent 即用。',
    preview: require('./showcase/ai-mcp.png'),
    website: 'https://github.com/xgd16/ai-mcp',
    source: 'https://github.com/xgd16/ai-mcp',
    tags: ['opensource', 'ai', 'tool', 'v2'],
  },
  {
    title: 'gmanager',
    description: '基于GoFrame V2框架的后台管理系统。支持登录、认证、组织机构、用户帐号、角色权限、菜单、配置、操作日志等模块。',
    preview: require('./showcase/gmanager.png'),
    website: 'https://gmanager.jflyfox.com',
    source: 'https://github.com/goflyfox/gmanager',
    tags: ['opensource', 'adminui', 'v2'],
  },
  {
    title: 'gtoken',
    description: '基于GoFrame框架的token插件，通过服务端验证方式实现token认证；已完全可以支撑线上token认证，通过Redis支持集群模式；使用简单，大家可以放心使用。',
    preview: require('./showcase/library.png'),
    website: 'https://github.com/goflyfox/gtoken',
    source: 'https://github.com/goflyfox/gtoken',
    tags: ['opensource', 'library', 'v2'],
  },
];

export type User = {
  title: string;
  description: string;
  preview: string | null; // null = use our serverless screenshot service
  website: string;
  source: string | null;
  tags: TagType[];
};

export type Tag = {
  label: string;
  description: string;
  color: string;
};

export const Tags: { [type in TagType]: Tag } = {
  favorite: {
    label: translate({ message: 'Favorite' }),
    description: translate({
      message:
        '我们喜欢并推荐给大家的案例，感兴趣可以瞧瞧。',
      id: 'showcase.tag.favorite.description',
    }),
    color: '#e9669e',
  },
  v1: {
    label: translate({ message: 'V1' }),
    description: translate({
      message:
        '该案例使用GoFrame V1版本。',
      id: 'showcase.tag.v1.description',
    }),
    color: '#BFDADC',
  },
  v2: {
    label: translate({ message: 'V2' }),
    description: translate({
      message:
        '该案例使用GoFrame V2版本。',
      id: 'showcase.tag.v2.description',
    }),
    color: '#D4C5F9',
  },
  opensource: {
    label: translate({ message: 'OpenSource' }),
    description: translate({
      message: '开源项目案例，通常是开源站点或组件，带有参考的源码案例。',
      id: 'showcase.tag.opensource.description',
    }),
    color: '#39ca30',
  },
  product: {
    label: translate({ message: 'Product' }),
    description: translate({
      message: '带有商业授权案例，该案例可能同时具有源码和商业授权。',
      id: 'showcase.tag.product.description',
    }),
    color: '#dfd545',
  },
  frontui: {
    label: translate({ message: 'FrontUI' }),
    description: translate({
      message:
        '带有前台UI的使用案例。',
      id: 'showcase.tag.frontui.description',
    }),
    color: '#0E8A16',
  },
  adminui: {
    label: translate({ message: 'AdminUI' }),
    description: translate({
      message:
        '带有管理后台UI的使用案例。',
      id: 'showcase.tag.adminui.description',
    }),
    color: '#14cfc3',
  },
  library: {
    label: translate({ message: 'Library' }),
    description: translate({
      message:
        'Go源码组件，供import使用。',
      id: 'showcase.tag.library.description',
    }),
    color: '#1D76DB',
  },
  micro: {
    label: translate({ message: 'MicroService' }),
    description: translate({
      message:
        '该案例支持微服务开发架构。',
      id: 'showcase.tag.micro.description',
    }),
    color: '#E99695',
  },
  cloudnative: {
    label: translate({ message: 'CloudNative' }),
    description: translate({
      message:
        '该案例支持云原生开发架构。',
      id: 'showcase.tag.cloudnative.description',
    }),
    color: '#C5DEF5',
  },
  tool: {
    label: translate({ message: 'Tool' }),
    description: translate({
      message:
        '系统或开发工具类的案例。',
      id: 'showcase.tag.tool.description',
    }),
    color: '#000000',
  },
  ai: {
    label: translate({ message: 'AI' }),
    description: translate({
      message:
        '该案例与AI技术相关。',
      id: 'showcase.tag.ai.description',
    }),
    color: '#B60205',
  },
};

export const TagList = Object.keys(Tags) as TagType[];
function sortUsers() {
  let result = Users;
  // Sort by site name
  result = sortBy(result, (user) => user.title.toLowerCase());
  // Sort by favorite tag, favorites first
  result = sortBy(result, (user) => !user.tags.includes('favorite'));
  return result;
}

export const sortedUsers = sortUsers();
