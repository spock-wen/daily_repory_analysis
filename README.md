# GitHub Trending 报告系统

## 项目状态

**当前分支**: `feature/new-architecture` - 新架构开发分支

本项目正在进行架构重构，目标是建立清晰、模块化、可扩展的报告生成系统。

## 项目定位

本系统是一个**本地报告生成系统**，与前置项目配合工作：

- **前置项目**：[daily_report](https://github.com/spock-wen/daily_report)
  - 每日 7:00 抓取 GitHub Trending 日榜
  - 每周一 6:00 抓取周榜
  - 每月 1 日 6:00 抓取月榜
  - 推送到服务器 `data/briefs/` 目录

- **当前项目**：
  - 检测数据更新
  - AI 深度分析
  - 生成 HTML 报告（日报/周报/月报）
  - 统一主页管理
  - 可选推送通知

## 新架构特性

✨ **已实现的功能**：

- ✅ **统一架构**：日报、周报、月报使用相同的生成流程
- ✅ **统一 AI 分析**：所有报告类型共享 AI 分析模块
- ✅ **统一主页**：一个页面管理所有报告
- ✅ **模块化设计**：数据加载、AI 分析、HTML 生成、推送通知完全解耦
- ✅ **统一 CLI**：简单的命令行接口

## 目录结构

```
项目根目录/
├── src/                      # 源代码
│   ├── loader/               # 数据加载
│   ├── analyzer/             # AI 分析
│   ├── generator/            # HTML 生成
│   ├── notifier/             # 推送通知
│   ├── utils/                # 工具函数
│   └── index.js              # 主入口文件
├── scripts/                  # 可执行脚本
│   ├── generate-daily.js     # 生成日报
│   ├── generate-weekly.js    # 生成周报
│   ├── generate-monthly.js   # 生成月报
│   ├── generate-all.js       # 生成所有报告
│   ├── generate-index.js     # 生成首页
│   ├── update-index.js       # 更新首页
│   └── help.js               # 帮助文档
├── tests/                    # 测试文件
│   ├── loader/               # 数据加载测试
│   ├── analyzer/             # AI 分析测试
│   ├── generator/            # HTML 生成测试
│   └── notifier/             # 通知发送测试
├── data/                     # 数据目录
│   ├── briefs/               # 输入数据
│   │   ├── daily/
│   │   ├── weekly/
│   │   └── monthly/
│   └── insights/             # AI 分析结果
│       ├── daily/
│       ├── weekly/
│       └── monthly/
├── reports/                  # HTML 输出
│   ├── daily/
│   ├── weekly/
│   ├── monthly/
│   └── index.html            # 统一主页
├── public/                   # 静态资源
│   └── css/                  # 样式文件
├── config/                   # 配置文件
│   ├── config.json           # 项目配置
│   └── prompts.json          # AI 提示词
├── docs/                     # 文档
│   ├── API.md                # API 文档
│   └── DEPLOYMENT.md         # 部署指南
└── todo/                     # 待办计划
```

## 参考数据

`archive/` 目录下保留了历史数据，用于新架构开发时的参考：

- 每日推送数据
- 历史报告样式参考
- 数据结构示例

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入 LLM API 密钥等配置
```

### 3. 生成报告

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

### 4. 查看报告

用浏览器打开 `reports/index.html` 查看首页。

## 文档

- **[部署与开发指南](docs/GUIDE.md)** - 快速开始、Git 配置、自动化部署
- **[API 文档](docs/API.md)** - 详细的 API 使用说明
- **[更新指南](docs/index-update-guide.md)** - 首页更新说明

## 开发与测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定模块测试
node tests/loader/data-loader.test.js
```

### 代码格式化

```bash
npm run lint
npm run format
```

## 前置项目

在开始使用前，请确保已配置好前置项目：

1. 克隆并配置 [daily_report](https://github.com/spock-wen/daily_report)
2. 设置 GitHub Actions 定时任务
3. 配置数据推送到服务器

## 环境变量

创建 `.env` 文件并配置以下变量：

```bash
# 飞书配置（可选，用于推送通知）
FEISHU_APP_ID=your-app-id
FEISHU_APP_SECRET=your-app-secret
FEISHU_RECEIVE_ID=your-open-id

# LLM 配置（用于 AI 分析）
LLM_API_KEY=your-api-key
LLM_BASE_URL=https://api.example.com/v1
LLM_MODEL=qwen-plus
```

## 项目状态

✅ **已完成**：

1. ✅ 基础架构搭建（Phase 1）
2. ✅ 核心模块实现（Phase 2）
3. ✅ 脚本工具实现（Phase 3）
4. ✅ 测试体系建立（Phase 4）
5. ✅ 文档与优化（Phase 5）

📋 **当前状态**：

- ✅ 主入口文件已创建
- ✅ 测试目录结构已重组
- ✅ 数据目录结构已完善
- ✅ 临时文件已清理
- ✅ API 文档已创建
- ✅ 部署指南已创建

## License

MIT License
