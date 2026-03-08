# 架构重构任务清单

## Phase 1: 基础架构搭建 (优先级：高)

- [ ] **Task 1: 创建新的目录结构**
  - [ ] 创建 `src/` 目录
  - [ ] 创建 `src/loader/` 目录
  - [ ] 创建 `src/analyzer/` 目录
  - [ ] 创建 `src/generator/` 目录
  - [ ] 创建 `src/notifier/` 目录
  - [ ] 创建 `src/utils/` 目录
  - [ ] 创建 `data/` 目录
  - [ ] 创建 `data/briefs/` 目录（包含 daily/weekly/monthly）
  - [ ] 创建 `data/insights/` 目录（包含 daily/weekly/monthly）
  - [ ] 创建 `config/` 目录
  - [ ] 创建 `tests/` 目录

- [ ] **Task 2: 实现统一路径配置**
  - [ ] 创建 `src/utils/path.js`
  - [ ] 实现所有路径辅助函数
  - [ ] 导出统一的路径配置对象
  - [ ] 编写路径配置测试

- [ ] **Task 3: 实现工具函数**
  - [ ] 创建 `src/utils/logger.js` - 统一日志输出
  - [ ] 创建 `src/utils/fs.js` - 文件操作封装
  - [ ] 创建 `src/utils/llm.js` - LLM 调用封装
  - [ ] 创建 `src/utils/template.js` - 模板渲染封装

- [ ] **Task 4: 创建配置文件**
  - [ ] 创建 `config/config.json` - 主配置
  - [ ] 创建 `config/prompts.json` - AI Prompt 模板
  - [ ] 创建 `.env.example` - 环境变量示例
  - [ ] 创建 `package.json` - 项目配置

## Phase 2: 核心模块实现 (优先级：高)

- [ ] **Task 5: 实现数据加载模块**
  - [ ] 创建 `src/loader/daily-loader.js` - 日报数据加载
  - [ ] 创建 `src/loader/weekly-loader.js` - 周报数据加载
  - [ ] 创建 `src/loader/monthly-loader.js` - 月报数据加载
  - [ ] 创建 `src/loader/index.js` - 统一导出
  - [ ] 编写加载器测试

- [ ] **Task 6: 实现 AI 分析模块**
  - [ ] 创建 `src/analyzer/prompt.js` - Prompt 模板
  - [ ] 创建 `src/analyzer/analyzer.js` - AI 分析核心
  - [ ] 实现日报分析逻辑
  - [ ] 实现周报分析逻辑
  - [ ] 实现月报分析逻辑
  - [ ] 创建 `src/analyzer/index.js` - 统一导出
  - [ ] 编写分析器测试

- [ ] **Task 7: 实现 HTML 生成模块**
  - [ ] 创建 `src/generator/daily-generator.js` - 日报生成
  - [ ] 创建 `src/generator/weekly-generator.js` - 周报生成
  - [ ] 创建 `src/generator/monthly-generator.js` - 月报生成
  - [ ] 创建 `src/generator/index-generator.js` - 主页生成
  - [ ] 创建 `src/generator/index.js` - 统一导出
  - [ ] 编写生成器测试

- [ ] **Task 8: 实现推送通知模块**
  - [ ] 创建 `src/notifier/feishu.js` - 飞书推送
  - [ ] 创建 `src/notifier/welink.js` - WeLink 推送
  - [ ] 创建 `src/notifier/index.js` - 统一导出
  - [ ] 编写推送器测试

## Phase 3: 脚本工具实现 (优先级：中)

- [ ] **Task 9: 创建可执行脚本**
  - [ ] 创建 `scripts/generate-daily.js` - 生成日报脚本
  - [ ] 创建 `scripts/generate-weekly.js` - 生成周报脚本
  - [ ] 创建 `scripts/generate-monthly.js` - 生成月报脚本
  - [ ] 创建 `scripts/generate-all.js` - 生成所有报告脚本
  - [ ] 创建 `scripts/generate-index.js` - 生成主页脚本
  - [ ] 创建 `scripts/help.js` - 帮助信息脚本

- [ ] **Task 10: 配置 package.json 脚本**
  - [ ] 添加 `generate:daily` 命令
  - [ ] 添加 `generate:weekly` 命令
  - [ ] 添加 `generate:monthly` 命令
  - [ ] 添加 `generate:all` 命令
  - [ ] 添加 `generate:index` 命令
  - [ ] 添加 `help` 命令
  - [ ] 添加测试命令

## Phase 4: 迁移与测试 (优先级：中)

- [ ] **Task 11: 迁移现有代码**
  - [ ] 迁移 `generate-html.js` 逻辑到 `src/generator/daily-generator.js`
  - [ ] 迁移 `generate-weekly.js` 逻辑到 `src/generator/weekly-generator.js`
  - [ ] 迁移 AI 分析逻辑到 `src/analyzer/analyzer.js`
  - [ ] 迁移推送逻辑到 `src/notifier/`
  - [ ] 删除旧的脚本文件

- [ ] **Task 12: 数据迁移**
  - [ ] 移动 `briefs/` 到 `data/briefs/`
  - [ ] 移动 `.ai_insights.json` 到 `data/insights/daily/`
  - [ ] 移动 `archive/` 到 `data/archive/`
  - [ ] 更新所有路径引用

- [ ] **Task 13: 完整测试**
  - [ ] 测试生成日报流程
  - [ ] 测试生成周报流程
  - [ ] 测试生成月报流程
  - [ ] 测试生成主页流程
  - [ ] 测试 AI 分析流程
  - [ ] 测试推送通知流程
  - [ ] 测试命令行接口

## Phase 5: 文档与优化 (优先级：低)

- [ ] **Task 14: 编写文档**
  - [ ] 编写 `README.md` - 项目说明
  - [ ] 编写 `ARCHITECTURE.md` - 架构说明
  - [ ] 编写 `API.md` - API 文档
  - [ ] 编写 `DEPLOYMENT.md` - 部署指南

- [ ] **Task 15: 代码优化**
  - [ ] 添加代码注释
  - [ ] 统一代码风格
  - [ ] 添加错误处理
  - [ ] 性能优化
  - [ ] 代码审查

# Task Dependencies

## Phase 1 Dependencies
- Task 2 depends on Task 1 (先创建目录，再添加文件)
- Task 3 depends on Task 1 (先创建目录，再添加文件)
- Task 4 depends on Task 1 (先创建目录，再添加配置)

## Phase 2 Dependencies
- Task 5 depends on Task 2 (使用路径配置)
- Task 6 depends on Task 2, Task 3 (使用路径配置和工具函数)
- Task 7 depends on Task 2, Task 3, Task 6 (使用路径配置、工具函数和分析模块)
- Task 8 depends on Task 2, Task 3 (使用路径配置和工具函数)

## Phase 3 Dependencies
- Task 9 depends on Task 5, Task 6, Task 7, Task 8 (使用所有模块)
- Task 10 depends on Task 9 (脚本创建后配置命令)

## Phase 4 Dependencies
- Task 11 depends on Task 5, Task 6, Task 7, Task 8 (新模块就绪后迁移)
- Task 12 depends on Task 1 (新目录结构就绪)
- Task 13 depends on Task 9, Task 11, Task 12 (所有脚本和迁移完成后测试)

## Phase 5 Dependencies
- Task 14 depends on Task 13 (测试通过后编写文档)
- Task 15 depends on Task 13 (测试通过后优化)
