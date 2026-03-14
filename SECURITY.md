# 🔒 安全提示

## API Key 安全配置

### ✅ 已采取的安全措施

1. **`.env` 文件已加入 `.gitignore`**
   - `.env` 文件不会被提交到 Git 仓库
   - 敏感信息得到保护

2. **文档中使用占位符**
   - 所有文档中的 API Key 示例都已替换为 `your-api-key-here` 或 `xxx...`
   - 不会泄露真实 API Key

3. **测试脚本不硬编码**
   - 所有测试脚本从环境变量读取配置
   - 不直接在代码中写死 API Key

### ⚠️ 重要提醒

**请立即检查并执行以下操作：**

1. **检查 `.env` 文件**
   ```bash
   # 确认 .env 在 .gitignore 中
   cat .gitignore | grep .env
   ```

2. **不要提交 `.env` 文件**
   ```bash
   # 查看 git 状态（.env 不应该出现在列表中）
   git status
   ```

3. **如果已经提交了敏感信息**
   - 立即删除该提交
   - 立即更换 API Key
   - 检查 Git 历史记录

### 📝 正确的配置方式

**`.env` 文件示例**：
```bash
# 真实配置（不要提交到 Git！）
LLM_API_KEY=你的真实 API_KEY
LLM_BASE_URL=https://ollama.com
LLM_MODEL=qwen3.5
```

**`.env.example` 文件示例**（可以提交）：
```bash
# 示例配置（可以安全提交）
LLM_API_KEY=your-api-key-here
LLM_BASE_URL=https://ollama.com
LLM_MODEL=qwen3.5
```

### 🔐 最佳实践

1. **永远不要**
   - ❌ 在代码中硬编码 API Key
   - ❌ 在文档中写真实 API Key
   - ❌ 将 `.env` 文件提交到 Git
   - ❌ 在公开场合分享 API Key

2. **始终要**
   - ✅ 使用环境变量管理敏感信息
   - ✅ 使用 `.env.example` 提供配置模板
   - ✅ 定期更换 API Key
   - ✅ 限制 API Key 的访问权限

### 🚨 如果发生泄露

**立即采取以下措施：**

1. **撤销泄露的 API Key**
   - 访问 https://ollama.com/settings/keys
   - 删除泄露的 API Key

2. **生成新的 API Key**
   - 在相同页面创建新的 API Key
   - 更新 `.env` 文件

3. **检查使用记录**
   - 查看是否有异常使用
   - 监控 token 消耗

4. **更新文档**
   - 确保所有文档都已移除真实 API Key
   - 使用占位符替代

### 📚 相关文档

- [Ollama 快速开始](docs/OLLAMA_QUICKSTART.md) - 配置指南
- [Ollama 集成指南](docs/OLLAMA_INTEGRATION.md) - 技术文档
- [配置说明](docs/CONFIG.md) - 环境变量配置

---

**安全无小事，请时刻保持警惕！** 🔒
