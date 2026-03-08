# GitHub Trending 报告系统架构重构 Spec

## Why
当前项目存在严重的架构混乱问题：
1. **职责不清**：数据抓取、AI 分析、HTML 生成、推送通知混在一起
2. **文件混乱**：脚本位置不统一，输出路径重复
3. **缺乏统一入口**：日报、周报、月报各自为政，没有统一管理
4. **重复代码**：三个报告类型有大量重复逻辑
5. **数据流不明确**：与前置项目（daily_report）的数据流衔接不清晰

需要重新设计一个清晰、模块化、可扩展的架构。

## What Changes
- ✅ **明确项目定位**：本地报告生成系统，接收远程数据，生成 HTML 报告
- ✅ **统一架构**：日报、周报、月报使用统一的生成流程
- ✅ **模块化设计**：数据加载、AI 分析、HTML 生成、推送通知完全解耦
- ✅ **统一入口**：创建主页统一管理所有报告
- ✅ **统一 AI 分析**：所有报告类型都使用相同的 AI 分析流程
- ✅ **清晰数据流**：
  - 前置项目（daily_report）：抓取数据 → 推送到服务器 `briefs/{daily,weekly,monthly}/`
  - 本地系统：检测数据更新 → AI 分析 → HTML 生成 → 推送通知

## Impact
- **Affected specs**：
  - 文件结构：完全重构
  - 数据流：明确与前置项目的衔接
  - 报告类型：新增月报，统一主页
- **Affected code**：
  - 所有脚本文件
  - HTML 模板
  - 配置文件

## ADDED Requirements

### Requirement: 统一项目架构
系统 SHALL 采用清晰的三层架构：
```
┌─────────────────────────────────────────────────────────┐
│ 前置项目 (daily_report) - GitHub Actions                │
│  - 每日 7:00 抓取日榜 → briefs/daily/data-YYYY-MM-DD.json
│  - 每周一 6:00 抓取周榜 → briefs/weekly/data-week-YYYY-Www.json
│  - 每月 1 日 6:00 抓取月榜 → briefs/monthly/data-month-YYYY-MM.json
│  - 推送到服务器指定目录                                  │
└─────────────────────────────────────────────────────────┘
                            ↓ (文件同步)
┌─────────────────────────────────────────────────────────┐
│ 本地报告系统 (当前项目)                                  │
│  - 检测 briefs/目录数据更新                              │
│  - 调用 AI 生成 .ai_insights.json                        │
│  - 生成 HTML 报告 → reports/{daily,weekly,monthly}/      │
│  - 可选：推送到飞书/WeLink                               │
└─────────────────────────────────────────────────────────┘
```

### Requirement: 统一报告生成流程
系统 SHALL 使用统一的报告生成流程：
```
1. 加载数据 (Load Data)
   ↓
2. AI 分析 (AI Analysis)
   ↓
3. 生成 HTML (Generate HTML)
   ↓
4. 推送通知 (Push Notification) - 可选
```

### Requirement: 统一主页
系统 SHALL 创建统一的主页 `index.html`：
- 显示所有报告（日报、周报、月报）
- 按时间排序
- 支持筛选（日报/周报/月报）
- 显示统计信息（总报告数、最新报告等）

### Requirement: 统一 AI 分析
系统 SHALL 为所有报告类型提供 AI 分析：
- **日报**：每日热点、趋势分析、行动建议
- **周报**：周度总结、热门项目、技术趋势
- **月报**：月度回顾、新兴领域、长期趋势

### Requirement: 模块化文件结构
系统 SHALL 保持清晰的文件结构：
```
项目根目录/
├── src/                      # 源代码
│   ├── loader/               # 数据加载模块
│   │   ├── daily-loader.js   # 日报数据加载
│   │   ├── weekly-loader.js  # 周报数据加载
│   │   ├── monthly-loader.js # 月报数据加载
│   │   └── index.js          # 统一导出
│   ├── analyzer/             # AI 分析模块
│   │   ├── analyzer.js       # AI 分析核心
│   │   ├── prompt.js         # Prompt 模板
│   │   └── index.js          # 统一导出
│   ├── generator/            # HTML 生成模块
│   │   ├── daily-generator.js   # 日报生成
│   │   ├── weekly-generator.js  # 周报生成
│   │   ├── monthly-generator.js # 月报生成
│   │   ├── index-generator.js   # 主页生成
│   │   └── index.js          # 统一导出
│   ├── notifier/             # 推送通知模块
│   │   ├── feishu.js         # 飞书推送
│   │   ├── welink.js         # WeLink 推送
│   │   └── index.js          # 统一导出
│   └── utils/                # 工具函数
│       ├── path.js           # 路径配置
│       ├── logger.js         # 日志
│       └── fs.js             # 文件操作
├── scripts/                  # 可执行脚本
│   ├── generate-daily.js     # 生成日报
│   ├── generate-weekly.js    # 生成周报
│   ├── generate-monthly.js   # 生成月报
│   ├── generate-all.js       # 生成所有报告
│   └── generate-index.js     # 生成主页
├── data/                     # 数据目录
│   ├── briefs/               # 输入数据（来自 daily_report）
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
├── config/                   # 配置文件
│   ├── config.json           # 主配置
│   └── prompts.json          # AI Prompt 配置
├── tests/                    # 测试
│   ├── loader/
│   ├── analyzer/
│   └── generator/
├── .env                      # 环境变量
├── .env.example              # 环境变量示例
├── package.json              # 项目配置
└── README.md                 # 项目说明
```

### Requirement: 统一路径配置
系统 SHALL 使用统一的路径配置：
```javascript
// src/utils/path.js
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../..');

module.exports = {
  ROOT_DIR,
  DATA_DIR: path.join(ROOT_DIR, 'data'),
  BRIEFS_DIR: path.join(ROOT_DIR, 'data', 'briefs'),
  INSIGHTS_DIR: path.join(ROOT_DIR, 'data', 'insights'),
  REPORTS_DIR: path.join(ROOT_DIR, 'reports'),
  CONFIG_DIR: path.join(ROOT_DIR, 'config'),
  
  // 日报路径
  getDailyBriefPath: (date) => path.join(module.exports.BRIEFS_DIR, 'daily', `data-${date}.json`),
  getDailyInsightPath: (date) => path.join(module.exports.INSIGHTS_DIR, 'daily', `insights-${date}.json`),
  getDailyReportPath: (date) => path.join(module.exports.REPORTS_DIR, 'daily', `github-ai-trending-${date}.html`),
  
  // 周报路径
  getWeeklyBriefPath: (week) => path.join(module.exports.BRIEFS_DIR, 'weekly', `data-week-${week}.json`),
  getWeeklyInsightPath: (week) => path.join(module.exports.INSIGHTS_DIR, 'weekly', `insights-${week}.json`),
  getWeeklyReportPath: (week) => path.join(module.exports.REPORTS_DIR, 'weekly', `github-weekly-${week}.html`),
  
  // 月报路径
  getMonthlyBriefPath: (month) => path.join(module.exports.BRIEFS_DIR, 'monthly', `data-month-${month}.json`),
  getMonthlyInsightPath: (month) => path.join(module.exports.INSIGHTS_DIR, 'monthly', `insights-${month}.json`),
  getMonthlyReportPath: (month) => path.join(module.exports.REPORTS_DIR, 'monthly', `github-monthly-${month}.html`),
};
```

### Requirement: 统一命令行接口
系统 SHALL 提供统一的命令行接口：
```bash
# 生成日报
npm run generate:daily -- --date=2026-03-08

# 生成周报
npm run generate:weekly -- --week=2026-W10

# 生成月报
npm run generate:monthly -- --month=2026-03

# 生成所有报告（检测最新数据）
npm run generate:all

# 生成主页
npm run generate:index

# 查看帮助
npm run help
```

## MODIFIED Requirements

### Requirement: 数据流逻辑
**修改前**：本地抓取 → AI 分析 → HTML 生成 → 推送
**修改后**：
1. **前置项目**（daily_report - GitHub Actions）：
   - 每日 7:00：抓取日榜 → `briefs/daily/data-YYYY-MM-DD.json`
   - 每周一 6:00：抓取周榜 → `briefs/weekly/data-week-YYYY-Www.json`
   - 每月 1 日 6:00：抓取月榜 → `briefs/monthly/data-month-YYYY-MM.json`
   - 推送到服务器：`/srv/www/daily-report/data/briefs/`

2. **本地系统**（当前项目）：
   - 检测 `data/briefs/` 目录数据更新
   - 调用 AI 分析 → `data/insights/{daily,weekly,monthly}/`
   - 生成 HTML → `reports/{daily,weekly,monthly}/`
   - 可选：推送到飞书/WeLink

### Requirement: AI 分析流程
**修改前**：每个脚本各自调用 AI
**修改后**：统一的 AI 分析模块
```javascript
// src/analyzer/analyzer.js
const { callLLM } = require('../utils/llm');
const { getPrompt } = require('./prompt');

async function analyze(data, reportType) {
  const prompt = getPrompt(reportType, data);
  const response = await callLLM(prompt);
  return parseAIResponse(response);
}

module.exports = { analyze };
```

### Requirement: HTML 生成流程
**修改前**：每个脚本独立生成 HTML
**修改后**：统一的 HTML 生成模块
```javascript
// src/generator/daily-generator.js
const { analyze } = require('../analyzer');
const { renderTemplate } = require('../utils/template');

async function generateDailyReport(data) {
  const insights = await analyze(data, 'daily');
  const html = renderTemplate('daily', data, insights);
  return html;
}

module.exports = { generateDailyReport };
```

## REMOVED Requirements

### Requirement: 本地抓取逻辑
**Reason**：由前置项目（daily_report）统一负责
**Migration**：移除 `run-analysis.js` 中的抓取逻辑

### Requirement: 复杂的环境判断
**Reason**：增加维护成本
**Migration**：统一使用配置文件 + 环境变量

### Requirement: 根目录输出
**Reason**：造成文件混乱
**Migration**：所有输出到 `reports/` 目录

## 数据流图

```
┌─────────────────────────────────────────────────────────────┐
│ GitHub Trending                                             │
│  - Daily: https://github.com/trending?since=daily           │
│  - Weekly: https://github.com/trending?since=weekly         │
│  - Monthly: https://github.com/trending?since=monthly       │
└─────────────────────────────────────────────────────────────┘
                            ↓ (抓取)
┌─────────────────────────────────────────────────────────────┐
│ 前置项目：daily_report (GitHub Actions)                     │
│  - 每日 7:00: data-YYYY-MM-DD.json                          │
│  - 每周一 6:00: data-week-YYYY-Www.json                     │
│  - 每月 1 日 6:00: data-month-YYYY-MM.json                  │
│  - 推送到服务器：/srv/www/daily-report/data/briefs/         │
└─────────────────────────────────────────────────────────────┘
                            ↓ (文件同步)
┌─────────────────────────────────────────────────────────────┐
│ 本地系统：当前项目                                          │
│                                                              │
│  1. 检测数据更新                                             │
│     - 扫描 data/briefs/{daily,weekly,monthly}/              │
│     - 对比已生成报告                                        │
│     ↓                                                        │
│  2. AI 分析                                                  │
│     - 调用 LLM → data/insights/{type}/                      │
│     - 生成：热点、趋势、建议                                │
│     ↓                                                        │
│  3. HTML 生成                                                │
│     - 读取数据 + AI 洞察                                     │
│     - 生成 HTML → reports/{type}/                           │
│     ↓                                                        │
│  4. 推送通知（可选）                                         │
│     - 飞书消息                                              │
│     - WeLink 消息                                           │
│     ↓                                                        │
│  5. 生成主页                                                 │
│     - 汇总所有报告                                          │
│     - 生成 index.html                                       │
└─────────────────────────────────────────────────────────────┘
```

## 成功标准
- ✅ 文件结构清晰，职责明确
- ✅ 所有脚本在 `scripts/` 目录
- ✅ 所有源代码在 `src/` 目录
- ✅ 数据输入：`data/briefs/`
- ✅ AI 分析：`data/insights/`
- ✅ HTML 输出：`reports/`
- ✅ 统一主页管理所有报告
- ✅ 所有报告都有 AI 分析
- ✅ 提供统一的命令行接口
- ✅ 完整的测试覆盖
