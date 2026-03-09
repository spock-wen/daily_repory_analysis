/**
 * GitHub Trending 报告生成系统 - 主入口文件
 * 
 * 统一导出所有核心模块，提供完整的 API 接口
 */

// 核心模块
const DataLoader = require('./loader/data-loader');
const InsightAnalyzer = require('./analyzer/insight-analyzer');
const HTMLGenerator = require('./generator/html-generator');
const MessageSender = require('./notifier/message-sender');

// 工具模块
const utils = require('./utils');
const pathUtils = require('./utils/path');
const logger = require('./utils/logger');
const fsUtils = require('./utils/fs');
const llmUtils = require('./utils/llm');
const templateUtils = require('./utils/template');

// 配置
const config = require('../config/config.json');
const prompts = require('../config/prompts.json');

module.exports = {
  // 核心模块
  DataLoader,
  InsightAnalyzer,
  HTMLGenerator,
  MessageSender,
  
  // 工具模块
  utils,
  path: pathUtils,
  logger,
  fs: fsUtils,
  llm: llmUtils,
  template: templateUtils,
  
  // 配置
  config,
  prompts,
  
  // 版本信息
  version: '2.0.0'
};
