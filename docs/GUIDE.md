# GitHub Trending 报告系统 - 部署与开发指南

## 📋 目录

1. [快速开始](#快速开始)
2. [Git 版本控制](#git-版本控制)
3. [自动化部署](#自动化部署)
4. [服务器部署](#服务器部署)
5. [常见问题](#常见问题)

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/spock-wen/daily_report_analysis.git
cd daily_report_analysis
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入 LLM API 密钥等配置
```

**.env 配置**：

```bash
# LLM 配置（必需）
LLM_API_KEY=your-api-key
LLM_BASE_URL=https://api.example.com/v1
LLM_MODEL=qwen-plus

# 飞书通知（可选）
FEISHU_APP_ID=your-app-id
FEISHU_APP_SECRET=your-app-secret
FEISHU_RECEIVE_ID=your-open-id

# WeLink 通知（可选）
WELINK_WEBHOOK_URLS=https://your-webhook-url
```

### 4. 生成报告

```bash
# 生成日报
npm run generate:daily -- 2026-03-08

# 生成周报
npm run generate:weekly -- 2026-W11

# 生成月报
npm run generate:monthly -- 2026-03

# 生成所有报告
npm run generate:all

# 生成首页
npm run generate:index
```

### 5. 查看报告

用浏览器打开 `reports/index.html` 查看首页。

---

## 📦 Git 版本控制

### ✅ 应该提交的文件

#### 源代码和配置
- `src/` - 所有源代码
- `scripts/` - 生成脚本
- `config/` - 配置文件
- `.gitignore` - Git 忽略规则

#### 测试和文档
- `tests/` - 测试文件
- `docs/` - 技术文档
- `README.md` - 项目说明

#### 数据目录结构
- 使用 `.gitkeep` 保留目录结构
- 实际数据文件是否提交取决于团队需求

### ❌ 不应该提交的文件

#### 构建产物
- `reports/**/*.html` - 生成的 HTML 报告
  - 可通过脚本重新生成
  - 会增加仓库体积
  - 内容频繁变化

#### 敏感信息
- `.env` - 环境变量（包含 API 密钥）
- `.env.local`, `.env.*.local`

#### 临时文件和依赖
- `*.tmp`, `*.bak`, `*.old`
- `node_modules/` - npm 依赖
- `*.log` - 日志文件
- `coverage/`, `.nyc_output/` - 测试报告

### .gitignore 配置说明

```gitignore
# 生成的 HTML 报告（构建产物，不提交）
reports/daily/*.html
reports/weekly/*.html
reports/monthly/*.html
reports/index.html

# 保留目录结构
!reports/.gitkeep
!reports/daily/.gitkeep
!reports/weekly/.gitkeep
!reports/monthly/.gitkeep
```

**解释**：
- 前 4 行：忽略所有生成的 HTML 报告
- 后 4 行：保留 `.gitkeep` 文件，确保目录结构被提交
- 其他人克隆后可创建相同的目录结构

### 提交流程

#### 首次提交

```bash
# 初始化仓库
git init

# 添加所有文件（自动忽略 .gitignore 中的文件）
git add .

# 查看状态
git status

# 提交
git commit -m "Initial commit"
```

#### 日常开发

```bash
# 查看变更
git status

# 添加变更
git add src/ scripts/ config/ docs/

# 提交
git commit -m "feat: 添加新功能"
```

#### 生成报告后

```bash
# 生成报告
npm run generate:daily -- 2026-03-08

# 查看状态（报告会显示但未跟踪）
git status

# 不需要添加 reports/ 目录
# 只提交源代码的变更（如果有）
```

### 移除已提交的 HTML 文件

如果 HTML 文件已经被提交过：

```bash
# 从 Git 索引中移除（保留本地文件）
git rm --cached reports/daily/*.html
git rm --cached reports/weekly/*.html
git rm --cached reports/monthly/*.html
git rm --cached reports/index.html

# 提交更改
git commit -m "chore: 移除生成的 HTML 报告文件"
```

---

## 🚀 自动化部署

### 方案 1：GitHub Actions + GitHub Pages

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Reports

on:
  schedule:
    - cron: '0 8 * * *'  # 每天 8:00 UTC
  workflow_dispatch:

jobs:
  generate-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Generate reports
        run: npm run generate:all
        env:
          LLM_API_KEY: ${{ secrets.LLM_API_KEY }}
          LLM_BASE_URL: ${{ secrets.LLM_BASE_URL }}
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./reports
```

**配置 GitHub Pages**：
1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 部署后访问：`https://your-username.github.io/repo-name/`

### 方案 2：Cron 定时任务（Linux/Mac）

```bash
# 编辑 crontab
crontab -e

# 每天下午 4 点生成日报
0 16 * * * cd /path/to/repo && /usr/bin/node scripts/generate-daily.js $(date +\%Y-\%m-\%d) >> /var/log/github-report.log 2>&1

# 每周一上午 6 点生成周报
0 6 * * 1 cd /path/to/repo && /usr/bin/node scripts/generate-weekly.js >> /var/log/github-report.log 2>&1

# 每月 1 日上午 6 点生成月报
0 6 1 * * cd /path/to/repo && /usr/bin/node scripts/generate-monthly.js >> /var/log/github-report.log 2>&1
```

### 方案 3：Systemd 服务（Linux 服务器）

创建服务文件 `/etc/systemd/system/github-report.service`：

```ini
[Unit]
Description=GitHub Trending Report Generator
After=network.target

[Service]
Type=oneshot
User=www-data
WorkingDirectory=/var/www/github-report
ExecStart=/usr/bin/node scripts/generate-daily.js
Environment=NODE_ENV=production
Environment=LLM_API_KEY=your-api-key

[Install]
WantedBy=multi-user.target
```

创建定时器 `/etc/systemd/system/github-report.timer`：

```ini
[Unit]
Description=Run GitHub Report Generator Daily
Requires=github-report.service

[Timer]
OnCalendar=*-*-* 16:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

启用服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable github-report.timer
sudo systemctl start github-report.timer
```

---

## 🖥️ 服务器部署（Nginx）

### 1. 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### 2. 配置 Nginx

创建配置文件 `/etc/nginx/sites-available/github-report`：

```nginx
server {
    listen 80;
    server_name report.yourdomain.com;
    
    root /var/www/github-report;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # 启用 Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # 缓存静态资源
    location ~* \.(css|js|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/github-report /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. 部署报告

```bash
# 生成报告
npm run generate:all
npm run generate:index

# 复制到 web 目录
sudo cp -r reports/* /var/www/github-report/
```

### 4. 启用 HTTPS（可选）

使用 Let's Encrypt 免费证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d report.yourdomain.com
```

---

## 🔍 故障排查

### 常见问题

#### Q1: 依赖安装失败

```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

#### Q2: 环境变量未生效

确保 `.env` 文件在项目根目录，格式正确：

```bash
# 正确
LLM_API_KEY=your-key

# 错误（包含空格）
LLM_API_KEY = your-key
```

#### Q3: 报告生成失败

检查数据文件是否存在：

```bash
ls -la data/briefs/daily/
ls -la data/briefs/weekly/
ls -la data/briefs/monthly/
```

#### Q4: LLM API 调用失败

检查网络连接和 API Key：

```bash
# 检查网络
curl -I $LLM_BASE_URL

# 检查 API Key
curl -H "Authorization: Bearer $LLM_API_KEY" $LLM_BASE_URL/models
```

#### Q5: 如何分享报告给团队？

推荐方式：
1. **部署到服务器** - 分享在线链接
2. **GitHub Pages** - 免费托管
3. **云存储** - Google Drive、OneDrive 等

#### Q6: 数据文件（data/）应该提交吗？

取决于场景：
- **开发环境**：建议提交示例数据
- **生产环境**：不提交真实数据
- **敏感数据**：绝对不提交，使用加密存储

---

## 📊 性能优化

### 1. 启用缓存

在 `config/config.json` 中配置：

```json
{
  "analyzer": {
    "cacheEnabled": true,
    "cacheTTL": 3600
  }
}
```

### 2. 并行生成报告

修改 `scripts/generate-all.js` 使用 `Promise.all`：

```javascript
async function generateAll() {
  await Promise.all([
    generateDaily(),
    generateWeekly(),
    generateMonthly()
  ]);
}
```

### 3. 静态资源 CDN

将 CSS、JS 文件托管到 CDN：

```html
<link rel="stylesheet" href="https://cdn.yourdomain.com/css/style.css">
```

---

## 📋 最佳实践

1. **只提交源文件** - 不提交构建产物
2. **保护敏感信息** - 使用 `.env` 和本地配置
3. **保持仓库精简** - 定期清理临时文件
4. **使用 CI/CD** - 自动化生成和部署
5. **文档齐全** - 提交 README 和说明文档
6. **语义化提交** - 使用规范的提交信息

---

## 🔗 相关文档

- **[API 文档](API.md)** - 详细的 API 使用说明
- **[项目结构优化总结](../STRUCTURE_OPTIMIZATION_SUMMARY.md)** - 本次优化的详细记录
