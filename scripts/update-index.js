#!/usr/bin/env node

/**
 * 首页更新脚本
 * 用法：node scripts/update-index.js
 * 
 * 用于在前置工程推送新 JSON 数据后，快速更新首页
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('🔄 更新首页');
console.log('='.repeat(60) + '\n');

try {
  // 调用首页生成脚本
  const scriptPath = path.join(__dirname, 'generate-index.js');
  execSync(`node ${scriptPath}`, { stdio: 'inherit' });
  
  console.log('\n✅ 首页更新完成！\n');
  process.exit(0);
} catch (error) {
  console.error('\n❌ 首页更新失败:', error.message);
  process.exit(1);
}
