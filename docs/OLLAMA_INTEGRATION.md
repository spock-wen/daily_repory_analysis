# Ollama 云端 API 集成指南

## ✅ 已完成的修改

### 1. 核心修改：`src/utils/llm.js`

**修改内容：**
- ✅ 支持 Ollama 云端 API（`https://ollama.com/api/chat`）
- ✅ 保持 OpenAI 兼容 API 支持（`/chat/completions`）
- ✅ 自动识别 API 类型（根据域名）
- ✅ 支持两种响应格式解析（Ollama 和 OpenAI）

**关键改动：**

```javascript
// 1. 默认配置更新
const config = {
  apiKey: process.env.LLM_API_KEY || '',
  baseUrl: process.env.LLM_BASE_URL || 'https://ollama.com',  // 改为 Ollama
  model: process.env.LLM_MODEL || 'qwen3.5',  // 改为 Ollama 模型
  timeout: parseInt(process.env.LLM_TIMEOUT || '60000', 10),
};

// 2. 自动识别 API 类型
const isOllama = url.hostname === 'ollama.com' || url.hostname === 'ollama.ac.cn';
if (isOllama) {
  url.pathname = '/api/chat';  // Ollama 端点
} else {
  url.pathname = '/chat/completions';  // OpenAI 端点
}

// 3. 支持两种响应格式
if (response.message && response.message.content) {
  // Ollama 格式：{ message: { content: '...' } }
  content = response.message.content;
} else if (response.choices && response.choices.length > 0) {
  // OpenAI 格式：{ choices: [{ message: { content: '...' } }] }
  content = response.choices[0].message?.content;
}
```

### 2. 环境变量配置（`.env`）

```bash
# LLM 配置（已更新为 Ollama）
LLM_API_KEY=your-api-key-here
LLM_BASE_URL=https://ollama.com
LLM_MODEL=qwen3.5
LLM_TIMEOUT=60000
```

### 3. 测试脚本

创建了多个测试脚本验证集成：

- ✅ `scripts/test-ollama-js.js` - 官方 Ollama JS SDK
- ✅ `scripts/test-ollama-official.py` - 官方 Ollama Python SDK
- ✅ `scripts/test-llm-integration.js` - 集成测试（使用项目 llm 模块）

## 📊 测试结果

### 测试 1：简单对话
```
✅ 通过
响应：你好，我是由 Google 训练的大型语言模型，致力于为你提供帮助和解答问题。
```

### 测试 2：生成 AI 洞察（JSON 格式）
```
✅ 通过
响应：{
  "oneLiner": "两个项目分别聚焦 AI 虚拟伴侣交互与大模型智能体框架...",
  "hot": ["虚拟形象实时交互技术", "多模态任务自动化框架"],
  "action": ["探索将 Qwen-Agent 的多模态能力集成到 airi..."]
}
```

## 🔧 使用方式

### 在项目中调用 LLM

```javascript
const { callLLM } = require('./src/utils/llm');

// 调用 AI 生成洞察
const insights = await callLLM('请分析以下 GitHub 项目...', {
  temperature: 0.7,
  maxTokens: 2000
});
```

### 运行 AI 分析

```bash
# 生成日报（自动调用 Ollama API）
node scripts/generate-daily.js 2026-03-14

# 生成周报（自动调用 Ollama API）
node scripts/generate-weekly.js 2026-W11

# 生成月报（自动调用 Ollama API）
node scripts/generate-monthly.js 2026-03
```

## 📝 API 对比

| 特性 | 百炼 API | Ollama 云端 API |
|------|----------|----------------|
| 基础 URL | `https://dashscope.aliyuncs.com` | `https://ollama.com` |
| 端点 | `/api/v1/services/aigc/text-generation/generation` | `/api/chat` |
| 认证 | `Authorization: Bearer {KEY}` | `Authorization: Bearer {KEY}` |
| 请求格式 | 百炼专有格式 | Ollama 格式 |
| 响应格式 | `{ output.text }` | `{ message.content }` |
| 模型 | `qwen-plus`, `qwen-turbo` | `qwen3.5`, `gpt-oss:120b` |

## ⚠️ 注意事项

1. **API Key 获取**
   - 访问 https://ollama.com/settings/keys
   - 登录账号后创建 API Key
   - 更新 `.env` 中的 `LLM_API_KEY`

2. **模型选择**
   - 当前使用：`qwen3.5`
   - 可用模型：访问 https://ollama.com/library
   - 云模型名称不需要 `:cloud` 后缀

3. **性能**
   - 响应时间：~5-10 秒（取决于模型大小）
   - 超时设置：60 秒（可调整 `LLM_TIMEOUT`）

4. **兼容性**
   - ✅ 完全兼容现有代码
   - ✅ 无需修改调用逻辑
   - ✅ 自动识别 API 类型

## 🚀 下一步

1. **测试完整流程**
   ```bash
   # 测试日报生成 + AI 分析
   node scripts/generate-daily.js 2026-03-14
   
   # 测试周报生成 + AI 分析
   node scripts/generate-weekly.js 2026-W11
   ```

2. **监控使用情况**
   - 查看日志：`logs/` 目录
   - 监控 token 使用：Ollama 控制台
   - 调整超时：根据实际响应时间

3. **优化提示词**
   - 查看：`config/prompts.json`
   - 根据 Ollama 模型特性优化
   - 测试不同 temperature 参数

## 📚 参考文档

- Ollama 官方文档：https://docs.ollama.com/cloud
- Ollama 模型库：https://ollama.com/library
- API Key 管理：https://ollama.com/settings/keys
