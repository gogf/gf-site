/**
 * Docusaurus 插件：排除 static/markdown 目录的图片不被 webpack 打包到 assets/images
 *
 * 原理：Docusaurus 的 remark transformImage 插件会将 Markdown 中
 * 绝对路径引用的图片（如 ![](/markdown/xxx.png)）转为 require() 调用，
 * 导致 webpack 将这些图片打包到 build/assets/images/ 中（带 hash），
 * 同时 static 目录的原样拷贝也照常进行，造成图片重复。
 *
 * 本插件通过自定义 remark 插件，在 transformImage 处理之前，
 * 将 /markdown/ 开头的图片路径加上 pathname:// 前缀，
 * 使 Docusaurus 跳过 webpack 处理，直接使用 static 拷贝的文件。
 */

const skipStaticMarkdownImages = function () {
  return async (root) => {
    const { visit } = await import('unist-util-visit');
    visit(root, 'image', (node) => {
      if (node.url && node.url.startsWith('/markdown/')) {
        node.url = 'pathname://' + node.url;
      }
    });
  };
};

module.exports = function staticImageExcludePlugin() {
  return {
    name: 'static-image-exclude-plugin',
    configureWebpack() {
      return {
        mergeStrategy: {
          'module.rules': 'append',
        },
      };
    },
  };
};

module.exports.skipStaticMarkdownImages = skipStaticMarkdownImages;
