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

✨ **计划中的功能**：

- 📊 **统一架构**：日报、周报、月报使用相同的生成流程
- 🧠 **统一 AI 分析**：所有报告类型共享 AI 分析模块
- 🏠 **统一主页**：一个页面管理所有报告
- 📦 **模块化设计**：数据加载、AI 分析、HTML 生成、推送通知完全解耦
- 💻 **统一 CLI**：简单的命令行接口

## 目录结构（规划中）

```
项目根目录/
├── src/                      # 源代码
│   ├── loader/               # 数据加载
│   ├── analyzer/             # AI 分析
│   ├── generator/            # HTML 生成
│   ├── notifier/             # 推送通知
│   └── utils/                # 工具函数
├── scripts/                  # 可执行脚本
│   ├── generate-daily.js
│   ├── generate-weekly.js
│   ├── generate-monthly.js
│   ├── generate-all.js
│   └── generate-index.js
├── data/                     # 数据目录
│   ├── briefs/               # 输入数据
│   └── insights/             # AI 分析结果
├── reports/                  # HTML 输出
│   ├── daily/
│   ├── weekly/
│   ├── monthly/
│   └── index.html            # 统一主页
├── archive/                  # 历史数据（保留参考）
└── config/                   # 配置文件
```

## 参考数据

`archive/` 目录下保留了历史数据，用于新架构开发时的参考：

- 每日推送数据
- 历史报告样式参考
- 数据结构示例

## 开发进度

详细的重构计划请参考：

- [架构规格说明](.trae/specs/simplify-architecture/spec.md)
- [任务清单](.trae/specs/simplify-architecture/tasks.md)
- [检查清单](.trae/specs/simplify-architecture/checklist.md)

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

## 下一步

1. ✅ 创建新分支 `feature/new-architecture`
2. ✅ 清理旧文件，保留参考数据
3. ⏳ 实施 Phase 1: 基础架构搭建
4. ⏳ 实施 Phase 2: 核心模块实现
5. ⏳ 实施 Phase 3: 脚本工具实现
6. ⏳ 实施 Phase 4: 迁移与测试
7. ⏳ 实施 Phase 5: 文档与优化

## License

MIT License
