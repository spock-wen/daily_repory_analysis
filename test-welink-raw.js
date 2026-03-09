require('dotenv').config();
const https = require('https');

async function testWeLinkRaw() {
  const webhookUrl = process.env.WELINK_WEBHOOK_URLS;
  
  console.log('=== WeLink 原始请求测试 ===\n');
  console.log('Webhook URL:', webhookUrl);
  
  const message = {
    msgtype: 'markdown',
    markdown: {
      content: `# WeLink 推送测试\n\n你好！这是一条测试消息。\n\n如果你看到这条消息，说明 WeLink 推送功能工作正常！✅`
    }
  };
  
  const payload = JSON.stringify(message);
  const url = new URL(webhookUrl);
  
  console.log('\n请求信息:');
  console.log('Hostname:', url.hostname);
  console.log('Path:', url.pathname);
  console.log('Message:', payload);
  console.log('');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search, // 包含查询参数
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length.toString()
      }
    };
    
    console.log('完整 Path:', options.path);
    console.log('');
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('响应状态码:', res.statusCode);
        console.log('响应头:', JSON.stringify(res.headers, null, 2));
        console.log('响应内容:', data);
        resolve({ statusCode: res.statusCode, data });
      });
    });
    
    req.on('error', (error) => {
      console.error('请求错误:', error.message);
      reject(error);
    });
    
    req.write(payload);
    req.end();
  });
}

testWeLinkRaw().catch(err => console.error('错误:', err));
