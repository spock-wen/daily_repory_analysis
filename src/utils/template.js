/**
 * 模板渲染工具模块
 * 提供 HTML 模板渲染功能
 */

const logger = require('./logger');

/**
 * 简单的模板渲染函数
 * 支持 ${variable} 和 ${function()} 语法
 * 
 * @param {string} template - 模板字符串
 * @param {Object} data - 数据对象
 * @param {Object} helpers - 辅助函数
 * @returns {string} 渲染后的 HTML
 */
function renderTemplate(template, data = {}, helpers = {}) {
  try {
    // 合并数据和辅助函数
    const context = { ...data, ...helpers };
    
    // 使用 Function 构造器创建渲染函数
    const keys = Object.keys(context);
    const values = Object.values(context);
    
    // 创建模板函数
    const renderFn = new Function(
      ...keys,
      `return \`${template}\`;`
    );
    
    // 执行渲染
    const result = renderFn(...values);
    logger.debug('模板渲染成功');
    return result;
  } catch (error) {
    logger.error('模板渲染失败', { error: error.message });
    throw error;
  }
}

/**
 * 从文件加载模板
 * @param {string} templatePath - 模板文件路径
 * @returns {Promise<string>} 模板内容
 */
async function loadTemplate(templatePath) {
  const fs = require('./fs');
  
  try {
    const content = await fs.readFile(templatePath, 'utf8');
    logger.debug(`模板已加载：${templatePath}`);
    return content;
  } catch (error) {
    logger.error(`加载模板失败：${templatePath}`, { error: error.message });
    throw error;
  }
}

/**
 * 渲染 HTML 页面
 * @param {string} title - 页面标题
 * @param {string} content - 页面内容
 * @param {Object} options - 选项
 * @returns {string} 完整的 HTML 页面
 */
function renderHtmlPage(title, content, options = {}) {
  const {
    charset = 'UTF-8',
    viewport = 'width=device-width, initial-scale=1.0',
    styles = '',
    scripts = '',
  } = options;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="${charset}">
    <meta name="viewport" content="${viewport}">
    <title>${title}</title>
    ${styles ? `<style>${styles}</style>` : ''}
    ${scripts ? `<script>${scripts}</script>` : ''}
</head>
<body>
    ${content}
</body>
</html>`;
}

/**
 * 转义 HTML 特殊字符
 * @param {string} text - 原始文本
 * @returns {string} 转义后的文本
 */
function escapeHtml(text) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  return String(text).replace(/[&<>"']/g, (char) => escapeMap[char]);
}

/**
 * Markdown 转 HTML（简单实现）
 * @param {string} markdown - Markdown 文本
 * @returns {string} HTML 文本
 */
function markdownToHtml(markdown) {
  // 简单的 Markdown 转换
  let html = markdown
    // 标题
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 粗体
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
    // 列表
    .replace(/^\s*[-*+]\s+(.*)$/gim, '<li>$1</li>')
    .replace(/^\s*\d+\.\s+(.*)$/gim, '<li>$1</li>')
    // 代码块
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    // 段落
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^/gim, '<p>')
    .replace(/$/gim, '</p>');
  
  return html;
}

module.exports = {
  renderTemplate,
  loadTemplate,
  renderHtmlPage,
  escapeHtml,
  markdownToHtml,
};
