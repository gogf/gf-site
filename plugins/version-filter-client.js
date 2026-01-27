/**
 * 客户端脚本：版本过滤
 * 在页面加载后过滤版本下拉菜单
 * 英文版只显示 2.9.x 及之后的版本
 */

// 根据语言过滤版本
function filterVersionsByLocale(locale) {
  if (locale !== 'en') {
    return;
  }

  // 英文版：隐藏 2.8.x 及之前的版本
  setTimeout(() => {
    const versionsToHide = [
      '2.8.x',
      '2.7.x',
      '2.6.x',
      '2.5.x',
      '2.4.x',
      '2.3.x',
      '2.2.x',
      '2.1.x',
      '2.0.x',
      '1.16.x',
    ];

    // 找到版本下拉菜单中的所有链接项
    const dropdownLinks = document.querySelectorAll('.dropdown__link');
    
    dropdownLinks.forEach(link => {
      const text = link.textContent?.trim() || '';
      
      // 检查是否是需要隐藏的版本
      const shouldHide = versionsToHide.some(version => text.includes(version));

      if (shouldHide) {
        // 隐藏该链接所在的 <li> 元素
        const listItem = link.closest('li');
        if (listItem) {
          listItem.style.display = 'none';
        }
      }
    });
  }, 100);
}

// 获取当前语言
function getCurrentLocale() {
  const htmlLang = document.documentElement.lang || 'zh-Hans';
  return htmlLang.startsWith('en') ? 'en' : 'zh-Hans';
}

// 页面加载时执行过滤
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const locale = getCurrentLocale();
      filterVersionsByLocale(locale);
    });
  } else {
    const locale = getCurrentLocale();
    filterVersionsByLocale(locale);
  }

  // 监听 MutationObserver 以应对动态内容加载
  const observer = new MutationObserver(() => {
    const locale = getCurrentLocale();
    filterVersionsByLocale(locale);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}


