# 首页更新机制说明

## 📋 概述

首页 (`reports/index.html`) 是整个报告系统的导航中心，需要保持与最新报告同步。

## 🔄 更新时机

### 场景 1：前置工程推送数据后自动更新（推荐）

**流程**：
```
前置工程推送 JSON → 生成报告 HTML → 自动更新首页
```

**操作方式**：
```bash
# 每日生成（会自动更新首页）
npm run generate:all

# 或单独生成某个报告（需要手动更新首页）
npm run generate:daily
npm run update:index  # 手动更新首页
```

**优点**：
- 首页始终保持最新状态
- 无需额外操作
- 自动化程度高

---

### 场景 2：手动触发更新

**使用场景**：
- 前置工程已经推送了新的 JSON 数据
- 只想更新首页，不生成新报告
- 修复了首页的某个问题后重新生成

**操作方式**：
```bash
# 快速更新首页
npm run update:index

# 或直接调用生成脚本
node scripts/generate-index.js
```

---

### 场景 3：定时任务自动更新

**使用场景**：
- 希望首页定时自动刷新
- 部署在服务器上运行

**示例（Linux cron）**：
```bash
# 每 6 小时更新一次首页
0 */6 * * * cd /path/to/daily_report_analysis && npm run update:index

# 每天凌晨 2 点更新
0 2 * * * cd /path/to/daily_report_analysis && npm run update:index
```

**示例（Windows Task Scheduler）**：
```powershell
# 创建定时任务
$action = New-ScheduledTaskAction -Execute "npm" -Argument "run update:index" -WorkingDirectory "D:\Dev\Spock\daily_report_analysis"
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -TaskName "GitHub Trending Index Update" -Action $action -Trigger $trigger
```

---

## 🛠️ 命令说明

### `npm run generate:all`
生成所有报告（日报 + 周报 + 月报 + 首页）

### `npm run generate:daily`
仅生成日报（不更新首页）

### `npm run generate:weekly`
仅生成周报（不更新首页）

### `npm run generate:monthly`
仅生成月报（不更新首页）

### `npm run generate:index`
生成首页（不检查是否有新数据，直接重新生成）

### `npm run update:index`
更新首页（语义化命令，功能同 generate:index）

---

## 📊 首页数据来源

首页从以下位置读取数据：

```
data/
├── briefs/
│   ├── daily/      ← 读取所有日报 JSON
│   │   └── data-YYYY-MM-DD.json
│   ├── weekly/     ← 读取所有周报 JSON
│   │   └── data-weekly-YYYY-Www.json
│   └── monthly/    ← 读取所有月报 JSON
│       └── data-monthly-YYYY-MM.json
```

**注意**：首页不依赖已生成的 HTML 文件，直接从 JSON 数据生成。

---

## 🔧 集成到工作流

### 推荐工作流

```
1. 前置工程推送新的 JSON 数据
         ↓
2. 触发报告生成脚本
   - npm run generate:daily (每日)
   - npm run generate:weekly (每周)
   - npm run generate:monthly (每月)
         ↓
3. 生成对应报告的 HTML
         ↓
4. 自动/手动更新首页
   - 使用 generate-all.js: 自动更新 ✅
   - 单独生成：手动运行 npm run update:index
```

### 自动化脚本示例

```bash
#!/bin/bash
# daily-update.sh - 每日自动更新脚本

echo "📅 开始每日更新流程..."

# 生成日报
npm run generate:daily

# 更新首页
npm run update:index

echo "✅ 每日更新完成！"
```

---

## 📝 注意事项

1. **首页生成速度**：非常快（<1 秒），因为只是读取 JSON 并生成 HTML
2. **数据一致性**：首页总是反映最新的 JSON 数据状态
3. **月报 HTML**：当前月报生成功能还在 TODO 中，首页会显示月报数据但链接可能无效
4. **文件路径**：首页使用相对路径链接到报告，确保部署时保持目录结构

---

## 🚀 未来优化

- [ ] 添加首页增量更新（只更新变化的部分）
- [ ] 添加更新日志（显示上次更新时间）
- [ ] 添加更新钩子（webhook 触发）
- [ ] 添加更新通知（更新完成后发送消息）
