# Ollama 云端 API 快速开始指南

## 🚀 5 分钟快速配置

### 步骤 1：获取 Ollama API Key

1. 访问 [https://ollama.com/settings/keys](https://ollama.com/settings/keys)
2. 登录或注册账号
3. 点击 "Create API Key" 创建新的 API Key
4. 复制生成的 API Key（格式类似：`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxx...`）

### 步骤 2：配置环境变量

编辑项目根目录的 `.env` 文件：

```bash
# LLM 配置 - Ollama 云端 API
LLM_API_KEY=你的 API_KEY
LLM_BASE_URL=https://ollama.com
LLM_MODEL=qwen3.5
LLM_TIMEOUT=60000
```

### 步骤 3：测试连接

运行测试脚本验证配置：

```bash
node scripts/test-llm-integration.js
```

**预期输出**：
```
🔍 测试 LLM 模块（Ollama 集成）...

📝 测试 1：简单对话
------------------------------------------------------------
你好，我是由 Google 训练的大型语言模型，致力于为你提供帮助和解答问题。
------------------------------------------------------------
✅ 测试 1 通过

📝 测试 2：生成 AI 洞察（JSON 格式）
------------------------------------------------------------
{
  "oneLiner": "两个项目分别聚焦 AI 虚拟伴侣交互与大模型智能体框架...",
  "hot": ["虚拟形象实时交互技术", "多模态任务自动化框架"],
  "action": ["探索将 Qwen-Agent 的多模态能力集成到 airi..."]
}
------------------------------------------------------------
✅ 测试 2 通过

🎉 所有测试通过！Ollama API 集成成功！
```

### 步骤 4：生成报告

```bash
# 生成日报（自动调用 Ollama AI 分析）
node scripts/generate-daily.js 2026-03-14

# 生成周报
node scripts/generate-weekly.js 2026-W11

# 生成月报
node scripts/generate-monthly.js 2026-03
```

## 📊 AI 洞察示例

生成的 AI 洞察包含：

### 周报 AI 洞察示例

```json
{
  "weeklyTheme": {
    "oneLiner": "AI 伴侣与全球监控爆发，89% 项目聚焦人工智能，基础设施安全成关键。",
    "detailed": "本周 9 个热门项目中 AI 占比高达 89%，人工智能仍是绝对核心..."
  },
  "highlights": [
    "`koala73/worldmonitor` (34702 stars): 实时全球智能仪表盘...",
    "`moeru-ai/airi` (31756 stars): 自我托管 AI 伴侣..."
  ],
  "topProjects": [
    {
      "repo": "koala73/worldmonitor",
      "category": "技术创新",
      "reason": "将 AI 应用于宏观态势感知...",
      "value": "提供统一的人工智能全球监控界面。"
    }
  ],
  "trends": {
    "shortTerm": [
      "AI 伴侣项目从云端转向本地自我托管...",
      "AI 代理沙盒环境需求上升..."
    ]
  },
  "recommendations": {
    "developers": [
      "立即试用 moeru-ai/airi 的 Web 版并贡献 Live2D 动作插件..."
    ],
    "enterprises": [
      "评估 OpenSandbox 企业应用..."
    ]
  }
}
```

## ⚙️ 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `LLM_API_KEY` | Ollama API Key | - | ✅ |
| `LLM_BASE_URL` | API 基础 URL | `https://ollama.com` | ✅ |
| `LLM_MODEL` | 模型名称 | `qwen3.5` | ✅ |
| `LLM_TIMEOUT` | 超时时间（毫秒） | `60000` | ❌ |
| `LLM_TEMPERATURE` | 温度参数 | `0.7` | ❌ |
| `LLM_MAX_TOKENS` | 最大 token 数 | `3000` | ❌ |

### 可选模型

访问 [Ollama 模型库](https://ollama.com/library) 查看所有可用模型：

- `qwen3.5` - 通义千问 3.5（推荐）
- `gpt-oss:120b` - GPT-OSS 120B
- `llama3.1` - Llama 3.1
- 更多模型持续更新...

## 🔧 常见问题

### Q1: API Key 无效？

**A**: 请检查：
1. API Key 是否正确复制（无多余空格）
2. API Key 是否已过期（重新生成）
3. 账号是否已登录验证

### Q2: 响应超时？

**A**: 增加超时时间：
```bash
LLM_TIMEOUT=120000  # 增加到 120 秒
```

### Q3: 模型不可用？

**A**: 更换其他模型：
```bash
LLM_MODEL=llama3.1  # 更换为 Llama 3.1
```

### Q4: 中文回答质量不佳？

**A**: 使用中文优化更好的模型：
```bash
LLM_MODEL=qwen3.5  # 推荐使用通义千问
```

## 📚 参考文档

- **[Ollama 集成指南](OLLAMA_INTEGRATION.md)** - 详细的集成说明
- **[Ollama 官方文档](https://docs.ollama.com/cloud)** - 云端 API 文档
- **[API Key 管理](https://ollama.com/settings/keys)** - 获取和管理 API Key
- **[模型库](https://ollama.com/library)** - 浏览所有可用模型

## 💡 最佳实践

1. **本地测试**：先用小模型快速测试（如 `llama3.1`）
2. **生产环境**：使用大模型获得更好质量（如 `qwen3.5`）
3. **批量处理**：设置合理的超时和并发限制
4. **成本控制**：监控 token 使用情况

## 🎉 完成！

现在你已经成功配置并使用 Ollama 云端 API 生成 AI 洞察了！

如有问题，请参考完整文档或提交 Issue。
