#!/usr/bin/env node

/**
 * WeLink 推送测试脚本
 * 用于调试 WeLink 推送功能
 */

require('dotenv').config();
const https = require('https');

// WeLink Webhook URL
const WEBHOOK_URL = process.env.WELINK_WEBHOOK_URLS || 
  'https://open.welink.huaweicloud.com/api/werobot/v1/webhook/send?token=35dfd31807064f3b9ca277a7bd0db0e3&channel=standard';

// 生成时间戳和 UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 构建 WeLink 消息
function buildMessage() {
  return {
    messageType: 'text',
    content: {
      text: `🧪 WeLink 推送测试\n\n` +
            `时间：${new Date().toLocaleString('zh-CN')}\n\n` +
            `这是一条测试消息，用于验证 WeLink 推送功能。\n\n` +
            `🔗 测试链接：https://report.wenspock.site\n\n` +
            `如果收到此消息，说明推送成功！✅`
    },
    timeStamp: Date.now(),
    uuid: generateUUID()
  };
}

// 发送请求
function sendWeLink() {
  const message = buildMessage();
  const payload = JSON.stringify(message);
  const url = new URL(WEBHOOK_URL);

  console.log('=== WeLink 推送测试 ===\n');
  console.log('📤 发送请求:');
  console.log(`   URL: ${WEBHOOK_URL}`);
  console.log(`   消息类型：text`);
  console.log(`   消息内容：${message.content.text.substring(0, 50)}...\n`);

  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Accept-Charset': 'UTF-8'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      console.log('📥 接收响应:');
      console.log(`   状态码：${res.statusCode}`);
      console.log(`   响应头：${JSON.stringify(res.headers)}\n`);

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          console.log('✅ 响应解析成功:');
          console.log(`   ${JSON.stringify(result, null, 2)}\n`);
          
          if (result.code === '0' || result.code === 0 || result.errcode === 0) {
            console.log('🎉 WeLink 推送成功！\n');
            resolve({ success: true, result });
          } else {
            console.log('⚠️ WeLink 推送返回非成功状态:\n');
            resolve({ success: false, result, error: 'Non-success code' });
          }
        } catch (error) {
          console.log('⚠️ 响应解析失败，显示原始内容:');
          console.log(`   ${responseData}\n`);
          
          // 检查是否是 HTML 错误页面
          if (responseData.includes('<!DOCTYPE html>') || responseData.includes('<html>')) {
            console.log('❌ 收到 HTML 错误页面，可能是服务端错误\n');
            resolve({ 
              success: false, 
              error: 'Received HTML error page',
              raw: responseData.substring(0, 500)
            });
          } else {
            resolve({ success: false, error: error.message, raw: responseData });
          }
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ 请求失败:');
      console.log(`   ${error.message}\n`);
      reject(error);
    });

    req.on('timeout', () => {
      console.log('❌ 请求超时\n');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.setTimeout(15000);
    req.write(payload);
    req.end();
  });
}

// 主函数
async function main() {
  try {
    const result = await sendWeLink();
    
    console.log('=== 测试总结 ===\n');
    if (result.success) {
      console.log('✅ WeLink 推送测试通过！');
      process.exit(0);
    } else {
      console.log('❌ WeLink 推送测试失败！');
      console.log(`   错误：${result.error || 'Unknown'}`);
      if (result.raw) {
        console.log(`   原始响应：${result.raw.substring(0, 200)}`);
      }
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ 测试执行失败！');
    console.log(`   错误：${error.message}\n`);
    process.exit(1);
  }
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { sendWeLink, buildMessage };
