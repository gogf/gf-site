import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ContributorsSVG from '@site/static/img/contributors.svg';
import Layout from '@theme/Layout';

function HomepageHeader() {
    const githubImage = useBaseUrl('/img/github.svg');
    return (
        <header>
            <div className="container logo-container">
                <div>
                    <img src={require('/markdown/0ec2082abc02139e3fc1ce9090862d33.png').default}
                        className='logo' />
                    <div className="logo-badges">
                        <a href="https://pkg.go.dev/github.com/gogf/gf/v2" target="_blank">
                            <img src="https://godoc.org/github.com/gogf/gf?status.svg" alt="Go Doc" />
                        </a>
                        <a href="https://travis-ci.com/github/gogf/gf" target="_blank">
                            <img src="https://api.travis-ci.com/gogf/gf.svg?branch=master" alt="Build Status" />
                        </a>
                        <a href="https://goreportcard.com/report/github.com/gogf/gf" target="_blank">
                            <img src="https://goreportcard.com/badge/github.com/gogf/gf" alt="Go Report" />
                        </a>
                        <a href="https://codecov.io/gh/gogf/gf/branch/master" target="_blank">
                            <img src="https://codecov.io/gh/gogf/gf/branch/master/graph/badge.svg" alt="Code Coverage" />
                        </a>
                        <a href="https://github.com/gogf/gf" target="_blank">
                            <img src="https://img.shields.io/badge/production-ready-blue.svg" alt="Production Ready" />
                        </a>
                        <a href="https://github.com/gogf/gf" target="_blank">
                            <img src="https://img.shields.io/github/license/gogf/gf.svg?style=flat" alt="License" />
                        </a>
                        <br />
                        <a href="https://github.com/gogf/gf/releases" target="_blank">
                            <img src="https://img.shields.io/github/v/release/gogf/gf" alt="Release" />
                        </a>
                        <a href="https://github.com/gogf/gf/pulls" target="_blank">
                            <img src="https://img.shields.io/github/issues-pr/gogf/gf" alt="GitHub pull requests" />
                        </a>
                        <a href="https://github.com/gogf/gf/pulls?q=is%3Apr+is%3Aclosed" target="_blank">
                            <img src="https://img.shields.io/github/issues-pr-closed/gogf/gf"
                                alt="GitHub closed pull requests" />
                        </a>
                        <a href="https://github.com/gogf/gf/issues" target="_blank">
                            <img src="https://img.shields.io/github/issues/gogf/gf" alt="GitHub issues" />
                        </a>
                        <a href="https://github.com/gogf/gf/issues?q=is%3Aissue+is%3Aclosed" target="_blank">
                            <img src="https://img.shields.io/github/issues-closed/gogf/gf" alt="GitHub closed issues" />
                        </a>
                        <img src="https://img.shields.io/github/stars/gogf/gf?style=flat" alt="Stars" />
                        <img src="https://img.shields.io/github/forks/gogf/gf?style=flat" alt="Forks" />
                    </div>
                </div>

                <div className="container mt-5 text-left">
                    <p>
                        <code>GoFrame</code> 是一款模块化、高性能、企业级的 <code>Go</code> 语言基础开发框架。
                        <code>GoFrame</code> 是一款通用性的基础开发框架，提供通用丰富的基础开发组件，
                        既可用于开发完整的工程化项目，也可以作为工具库独立使用。
                    </p>
                    <p>
                        如果您想使用 <code>Golang</code> 开发一个业务型项目，无论是小型还是中大型项目，
                        <code>GoFrame</code> 是您的不二之选。如果您想开发一个 <code>Golang</code> 组件库，
                        <code>GoFrame</code> 提供开箱即用、丰富强大的基础组件库也能助您的工作事半功倍。
                        如果您是团队 <code>Leader</code>， <code>GoFrame</code> 丰富的资料文档、详尽的代码注释、
                        活跃的社区特点将会极大降低您的指导成本，支持团队快速接入、语言转型与能力提升。
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-6">
                    <div className="flex justify-center md:justify-end">
                        <Link className="button button--primary button--md"
                            to="/quick/install" style={{ width: '200px' }}>
                            快速开始 →
                        </Link>
                    </div>

                    <div className="flex md:justify-start justify-center">
                        <Link className="button button--secondary button--md hover:bg-gray-200"
                            to="https://github.com/gogf/gf" style={{
                                width: '200px',
                                paddingLeft: '50px',
                                backgroundImage: `url(${githubImage})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: '45px center',
                            }}>
                            GitHub →
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Features() {
    return (
        <section>
            <div className="container mt-20">
                <h1 className="text-center largest font-bold">
                    框架特点
                </h1>
                <div className="text-center mb-10">
                    强大的开发框架助您的项目快速成型、易于维护、事半功倍。
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">工程完备</h3>
                            <div className="mb-2">
                                多年工程实践经验沉淀，涵盖从项目构建到代码组织等全流程工具规范，保障团队少走弯路、稳定交付。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">开箱即用</h3>
                            <div className="mb-2">
                                提供数据库、网络服务、缓存管理、数据校验、日志记录等丰富组件，为企业级应用开发提供全面支持。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">性能卓越</h3>
                            <div className="mb-2">
                                轻松处理大量并发请求，经过优化的内部算法和数据结构，使得框架在执行各种操作时速度更快。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">跨平台性</h3>
                            <div className="mb-2">
                                出色的跨平台性，能够在不同操作系统（如 Windows、Linux、Mac OS 等）上无缝运行。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">松耦合性</h3>
                            <div className="mb-2">
                                组件模块独立，通过清晰接口交互，方便修改替换，增强开发灵活性与系统稳定性。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">高扩展性</h3>
                            <div className="mb-2">
                                灵活的组件接口设计，允许开发者轻松添加新功能、模块或集成第三方库以满足不同的业务需求。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">详尽的开发文档</h3>
                            <div className="mb-2">
                                涵盖框架各个方面，从基础使用到高级特性，为开发者提供全面、细致且易理解的参考资料。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">活跃的社区支持</h3>
                            <div className="mb-2">
                                拥有活跃的社区，成员们积极交流、分享经验、协作互助，为开发者提供丰富的资源和及时的支持。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">优秀的错误处理</h3>
                            <div className="mb-2">
                                清晰准确地捕获、分类和提示错误，帮助开发者快速定位问题，有效提升程序的稳定性和可维护性。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">输入验证与过滤</h3>
                            <div className="mb-2">
                                内置了强大的输入验证和过滤机制，能够有效防止各种恶意输入，如 SQL 注入、跨站脚本攻击(XSS)等。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">代码生成工具链</h3>
                            <div className="mb-2">
                                高效便捷的代码生成工具链，极大提高开发效率，减少重复性工作，同时保证代码的规范性和一致性。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">自动化接口文档</h3>
                            <div className="mb-2">
                                根据代码结构自动生成清晰、规范的接口文档，节省人工编写时间，提高文档与代码的同步性和准确性。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">HTTP Web&微服务开发</h3>
                            <div className="mb-2">
                                具备强大的功能和工具集，可高效构建稳定、高性能且易于扩展的 Web 应用和微服务体系。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">OpenTelemetry可观测性</h3>
                            <div className="mb-2">
                                精准地追踪、监控应用的各项指标和行为，为开发者提供深入的洞察，助力优化应用性能与可靠性。
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">更好的中文化支持</h3>
                            <div className="mb-2">
                                提供丰富的本地中文化文档资料、社区资源支持，针对大中国区的团队和企业用户更加友好。
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-5 text-center">
                <Link
                    className="button button--secondary button--md hover:bg-gray-200"
                    to="/docs/design" style={{ width: '200px' }}>
                    了解更多 →
                </Link>
            </div>
        </section>
    );
}

function Users() {
    return (
        <section>
            <div className="container mt-20">
                <h1 className="text-center largest font-bold">
                    用户列表
                </h1>
                <div className="text-center mb-10">
                    在这里列举了部分知名用户，如果您的企业或者产品正在使用<code>GoFrame</code>，欢迎联系我们。
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.tencent.com/" target="_blank">腾讯科技</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.antfin.com/" target="_blank">蚂蚁金服</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.zte.com.cn/china/" target="_blank">中兴科技</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.vivo.com/" target="_blank">VIVO</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://igg.com/" target="_blank">IGG</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.ximalaya.com/" target="_blank">喜马拉雅</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.37.com/" target="_blank">三七互娱</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.medlinker.com/" target="_blank">医联科技</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.zybang.com/" target="_blank">作业帮</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.leyoujia.com/" target="_blank">乐有家</a>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Contributors() {
    return (
        <section>
            <div className="container mt-20">
                <h1 className="text-center largest font-bold">
                    贡献者列表
                </h1>
                <div className="text-center mb-5">
                    💖感谢所有参与<code>GoFrame</code>开源建设的贡献者💖
                </div>
                <div className="contributors text-center">
                    {
                        isMobileDevice() ? (
                            <a href="https://github.com/gogf/gf/graphs/contributors" target="_blank">
                                <img src={'/img/contributors.svg'} alt="GoFrame Contributors" />
                            </a>) : (
                            <ContributorsSVG title="GoFrame Contributors" />
                        )}
                </div>
            </div>
        </section>
    )
}

function isMobileDevice() {
    if (typeof navigator !== 'undefined') {
        return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return false;
}

export default function Home(): JSX.Element {
    return (
        <Layout>
            <HomepageHeader />
            <Features />
            <Users />
            <Contributors />
            <div className="mt-20"></div>
        </Layout>
    );
}
