/**
 * Docusaurus 插件：版本过滤
 * 在客户端运行时根据语言过滤版本显示
 * 英文版只显示 2.9.x 及之后的版本
 */

module.exports = function versionFilterPlugin(context, options) {
  return {
    name: 'version-filter-plugin',
    
    // 提供客户端模块
    getClientModules() {
      return [require.resolve('./version-filter-client.js')];
    },
  };
};
