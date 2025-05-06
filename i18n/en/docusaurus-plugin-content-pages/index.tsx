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
                    <img src='/img/logo_full.png' className='logo' />
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
                        GoFrame is a modular, high-performance, enterprise-grade Go framework,
                        offering rich components for full projects or standalone use.
                        Whether building a small or large project, or developing a Golang library, 
                        GoFrame boosts efficiency with powerful, ready-to-use tools. Its rich documentation, 
                        detailed comments, and active community make it easy for teams to adopt and grow quickly.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-6">
                    <div className="flex justify-center md:justify-end">
                        <Link className="button button--primary button--md"
                            to="/quick/install" style={{ width: '200px' }}>
                            Quick Start →
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
                    Features
                </h1>
                <div className="text-center mb-10">
                A powerful framework for faster, easier, and more efficient project development.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Comprehensive Engineering</h3>
                            <div className="mb-2">
                            Built on years of experience, covering project setup to code organization, ensuring efficient and stable delivery.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Out Of Box</h3>
                            <div className="mb-2">
                            Offers components like database, cache, validation, and logging, supporting enterprise application development.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Outstanding Performance</h3>
                            <div className="mb-2">
                            Efficiently handles high-concurrency requests with optimized algorithms and data structures, ensuring faster operations.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Cross-Platform</h3>
                            <div className="mb-2">
                            Provides excellent cross-platform compatibility, running seamlessly on Windows, Linux, and Mac OS, ensuring versatility.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Loose Coupling</h3>
                            <div className="mb-2">
                            Independent modules with clear interfaces enable easy modification, enhancing flexibility and stability.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">High Scalability</h3>
                            <div className="mb-2">
                            Flexible interface design enables developers to easily add features, integrate modules, and use third-party libraries to meet business needs.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Comprehensive Documentation</h3>
                            <div className="mb-2">
                            Provides detailed documentation covering from basic usage to advanced features, offering clear and thorough references for developers.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Active Community Support</h3>
                            <div className="mb-2">
                            A vibrant community where members collaborate, share resources, and provide timely support to developers.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Convenient Configuration</h3>
                            <div className="mb-2">
                            Flexible configuration management supports formats, environments, and dynamic loading, improving development ease.
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Robust Error Handling</h3>
                            <div className="mb-2">
                            Clearly captures, categorizes, and reports errors, helping developers locate issues and improve program stability.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Input Validation and Filtering</h3>
                            <div className="mb-2">
                            Built-in validation and filtering prevent malicious inputs like SQL injection and XSS attacks effectively.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Code Generation Toolchain</h3>
                            <div className="mb-2">
                            Efficient code generation toolchain boosts development, reduces repetitive tasks, and ensures code consistency.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Automated API Documentation</h3>
                            <div className="mb-2">
                            Generates clear API documentation from code, reducing manual work and ensuring accuracy and synchronization.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">Web & Microservice Development</h3>
                            <div className="mb-2">
                            Provides powerful tools to efficiently build stable, high-performance, and scalable web applications and microservices.
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card p-8 box-border">
                            <h3 className="mb-2">OpenTelemetry Observability</h3>
                            <div className="mb-2">
                            Tracks application metrics and behaviors, offering insights to optimize performance and reliability for developers.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-5 text-center">
                <Link
                    className="button button--secondary button--md hover:bg-gray-200"
                    to="/docs/cli" style={{ width: '200px' }}>
                    Learn More →
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
                    Users
                </h1>
                <div className="text-center mb-10">
                Here are part of our users. If your company or product is using GoFrame, feel free to contact us.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.tencent.com/" target="_blank">Tencent</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.antfin.com/" target="_blank">Ant Finacial</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.zte.com.cn/china/" target="_blank">ZTE</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.vivo.com/" target="_blank">VIVO</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://igg.com/" target="_blank">IGG</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.ximalaya.com/" target="_blank">XiMaLaYa</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.37.com/" target="_blank">37 Games</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.medlinker.com/" target="_blank">Medlinker</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.zybang.com/" target="_blank">ZYBang</a>
                    </div>
                    <div className="card p-5 box-border text-center">
                        <a href="https://www.leyoujia.com/" target="_blank">LeYouJia</a>
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
                    Contributors
                </h1>
                <div className="text-center mb-5">
                    💖Thanks to all the contributors who made GoFrame possible💖
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
