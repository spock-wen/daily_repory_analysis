# 架构重构检查清单

## Phase 1: 基础架构搭建

### 目录结构
- [ ] `src/` 目录已创建
- [ ] `src/loader/` 目录已创建
- [ ] `src/analyzer/` 目录已创建
- [ ] `src/generator/` 目录已创建
- [ ] `src/notifier/` 目录已创建
- [ ] `src/utils/` 目录已创建
- [ ] `data/` 目录已创建
- [ ] `data/briefs/daily/` 目录已创建
- [ ] `data/briefs/weekly/` 目录已创建
- [ ] `data/briefs/monthly/` 目录已创建
- [ ] `data/insights/daily/` 目录已创建
- [ ] `data/insights/weekly/` 目录已创建
- [ ] `data/insights/monthly/` 目录已创建
- [ ] `config/` 目录已创建
- [ ] `tests/` 目录已创建

### 路径配置
- [ ] `src/utils/path.js` 已创建
- [ ] `ROOT_DIR` 正确指向项目根目录
- [ ] `getDailyBriefPath()` 函数正确实现
- [ ] `getWeeklyBriefPath()` 函数正确实现
- [ ] `getMonthlyBriefPath()` 函数正确实现
- [ ] 所有路径函数通过测试

### 工具函数
- [ ] `src/utils/logger.js` 已创建
- [ ] `src/utils/fs.js` 已创建
- [ ] `src/utils/llm.js` 已创建
- [ ] `src/utils/template.js` 已创建
- [ ] 所有工具函数通过测试

### 配置文件
- [ ] `config/config.json` 已创建
- [ ] `config/prompts.json` 已创建
- [ ] `.env.example` 已创建
- [ ] `package.json` 已创建
- [ ] 所有配置项正确

## Phase 2: 核心模块实现

### 数据加载模块
- [ ] `src/loader/daily-loader.js` 已创建
- [ ] `src/loader/weekly-loader.js` 已创建
- [ ] `src/loader/monthly-loader.js` 已创建
- [ ] `src/loader/index.js` 已创建
- [ ] 所有加载器正确加载对应数据
- [ ] 加载器测试通过

### AI 分析模块
- [ ] `src/analyzer/prompt.js` 已创建
- [ ] `src/analyzer/analyzer.js` 已创建
- [ ] 日报分析逻辑正确实现
- [ ] 周报分析逻辑正确实现
- [ ] 月报分析逻辑正确实现
- [ ] `src/analyzer/index.js` 已创建
- [ ] 分析器测试通过

### HTML 生成模块
- [ ] `src/generator/daily-generator.js` 已创建
- [ ] `src/generator/weekly-generator.js` 已创建
- [ ] `src/generator/monthly-generator.js` 已创建
- [ ] `src/generator/index-generator.js` 已创建
- [ ] `src/generator/index.js` 已创建
- [ ] 所有生成器正确生成 HTML
- [ ] 生成器测试通过

### 推送通知模块
- [ ] `src/notifier/feishu.js` 已创建
- [ ] `src/notifier/welink.js` 已创建
- [ ] `src/notifier/index.js` 已创建
- [ ] 飞书推送功能正常
- [ ] WeLink 推送功能正常
- [ ] 推送器测试通过

## Phase 3: 脚本工具实现

### 可执行脚本
- [ ] `scripts/generate-daily.js` 已创建
- [ ] `scripts/generate-weekly.js` 已创建
- [ ] `scripts/generate-monthly.js` 已创建
- [ ] `scripts/generate-all.js` 已创建
- [ ] `scripts/generate-index.js` 已创建
- [ ] `scripts/help.js` 已创建
- [ ] 所有脚本可正常执行

### package.json 配置
- [ ] `generate:daily` 命令已添加
- [ ] `generate:weekly` 命令已添加
- [ ] `generate:monthly` 命令已添加
- [ ] `generate:all` 命令已添加
- [ ] `generate:index` 命令已添加
- [ ] `help` 命令已添加
- [ ] 测试命令已添加
- [ ] 所有命令可正常执行

## Phase 4: 迁移与测试

### 代码迁移
- [ ] `generate-html.js` 逻辑已迁移到 `src/generator/daily-generator.js`
- [ ] `generate-weekly.js` 逻辑已迁移到 `src/generator/weekly-generator.js`
- [ ] AI 分析逻辑已迁移到 `src/analyzer/analyzer.js`
- [ ] 推送逻辑已迁移到 `src/notifier/`
- [ ] 旧脚本文件已删除

### 数据迁移
- [ ] `briefs/` 已移动到 `data/briefs/`
- [ ] `.ai_insights.json` 已移动到 `data/insights/daily/`
- [ ] `archive/` 已移动到 `data/archive/`
- [ ] 所有路径引用已更新
- [ ] 数据访问正常

### 完整测试
- [ ] 生成日报流程测试通过
- [ ] 生成周报流程测试通过
- [ ] 生成月报流程测试通过
- [ ] 生成主页流程测试通过
- [ ] AI 分析流程测试通过
- [ ] 推送通知流程测试通过
- [ ] 命令行接口测试通过

## Phase 5: 文档与优化

### 文档
- [ ] `README.md` 已编写
- [ ] `ARCHITECTURE.md` 已编写
- [ ] `API.md` 已编写
- [ ] `DEPLOYMENT.md` 已编写
- [ ] 所有文档内容准确

### 代码优化
- [ ] 所有代码已添加注释
- [ ] 代码风格已统一
- [ ] 错误处理已添加
- [ ] 性能已优化
- [ ] 代码审查通过

## 功能验证

### 日报生成
- [ ] 运行 `npm run generate:daily -- --date=2026-03-08` 成功
- [ ] HTML 生成到 `reports/daily/github-ai-trending-2026-03-08.html`
- [ ] AI 分析生成到 `data/insights/daily/insights-2026-03-08.json`
- [ ] 页面可正常访问
- [ ] 推送通知正常（可选）

### 周报生成
- [ ] 运行 `npm run generate:weekly -- --week=2026-W10` 成功
- [ ] HTML 生成到 `reports/weekly/github-weekly-2026-W10.html`
- [ ] AI 分析生成到 `data/insights/weekly/insights-2026-W10.json`
- [ ] 页面可正常访问
- [ ] 推送通知正常（可选）

### 月报生成
- [ ] 运行 `npm run generate:monthly -- --month=2026-03` 成功
- [ ] HTML 生成到 `reports/monthly/github-monthly-2026-03.html`
- [ ] AI 分析生成到 `data/insights/monthly/insights-2026-03.json`
- [ ] 页面可正常访问
- [ ] 推送通知正常（可选）

### 主页生成
- [ ] 运行 `npm run generate:index` 成功
- [ ] HTML 生成到 `reports/index.html`
- [ ] 显示所有日报、周报、月报
- [ ] 支持筛选功能
- [ ] 页面可正常访问

### 统一 AI 分析
- [ ] 日报 AI 分析包含：热点、趋势、建议
- [ ] 周报 AI 分析包含：总结、热门项目、技术趋势
- [ ] 月报 AI 分析包含：回顾、新兴领域、长期趋势
- [ ] 所有分析调用相同的 AI 模块
- [ ] 分析结果格式统一

## 架构验证

### 文件结构
- [ ] 根目录没有任何 HTML 文件
- [ ] 所有脚本在 `scripts/` 目录
- [ ] 所有源代码在 `src/` 目录
- [ ] 数据输入在 `data/briefs/`
- [ ] AI 分析在 `data/insights/`
- [ ] HTML 输出在 `reports/`

### 数据流
- [ ] 前置项目推送数据到 `data/briefs/{type}/`
- [ ] 本地系统检测数据更新
- [ ] AI 分析调用正常
- [ ] HTML 生成正常
- [ ] 推送通知正常

### 模块化
- [ ] 数据加载模块独立
- [ ] AI 分析模块独立
- [ ] HTML 生成模块独立
- [ ] 推送通知模块独立
- [ ] 模块间通过统一接口通信

### 命令行接口
- [ ] 所有命令可执行
- [ ] 参数解析正确
- [ ] 错误提示清晰
- [ ] 帮助信息完整

## 成功标准
- ✅ 所有 Phase 1-3 的检查点通过
- ✅ 至少完成 Phase 4 的 80%
- ✅ 所有功能测试通过
- ✅ 代码质量达标
- ✅ 文档完整
