/**
 * 统一日志工具模块
 * 提供结构化的日志输出功能
 */

// 日志级别
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// 当前日志级别（从环境变量读取，默认为 INFO）
const currentLevel = parseInt(process.env.LOG_LEVEL || '1', 10);

// 日志颜色（ANSI 颜色码）
const colors = {
  reset: '\x1b[0m',
  debug: '\x1b[36m',   // 青色
  info: '\x1b[32m',    // 绿色
  warn: '\x1b[33m',    // 黄色
  error: '\x1b[31m',   // 红色
  success: '\x1b[35m', // 紫色
};

/**
 * 格式化日志消息
 * @param {string} level - 日志级别
 * @param {string} message - 消息内容
 * @param {Object} meta - 附加信息
 */
function formatLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}]${metaStr} ${message}`;
}

/**
 * 输出日志
 * @param {string} level - 日志级别
 * @param {string} color - 颜色码
 * @param {string} message - 消息内容
 * @param {Object} meta - 附加信息
 */
function log(level, color, message, meta = {}) {
  if (LogLevel[level.toLowerCase()] >= currentLevel) {
    const formatted = formatLog(level, message, meta);
    console.log(`${color}${formatted}${colors.reset}`);
  }
}

// 日志方法
const logger = {
  /**
   * 调试日志
   * @param {string} message - 消息内容
   * @param {Object} meta - 附加信息
   */
  debug(message, meta) {
    log('DEBUG', colors.debug, message, meta);
  },

  /**
   * 信息日志
   * @param {string} message - 消息内容
   * @param {Object} meta - 附加信息
   */
  info(message, meta) {
    log('INFO', colors.info, message, meta);
  },

  /**
   * 警告日志
   * @param {string} message - 消息内容
   * @param {Object} meta - 附加信息
   */
  warn(message, meta) {
    log('WARN', colors.warn, message, meta);
  },

  /**
   * 错误日志
   * @param {string} message - 消息内容
   * @param {Object} meta - 附加信息
   */
  error(message, meta) {
    log('ERROR', colors.error, message, meta);
  },

  /**
   * 成功日志
   * @param {string} message - 消息内容
   * @param {Object} meta - 附加信息
   */
  success(message, meta) {
    log('SUCCESS', colors.success, message, meta);
  },

  /**
   * 分隔线
   */
  divider(char = '=', length = 60) {
    console.log(char.repeat(length));
  },

  /**
   * 标题
   * @param {string} title - 标题内容
   */
  title(title) {
    this.divider();
    console.log(`  ${title}`);
    this.divider();
  },
};

module.exports = logger;
