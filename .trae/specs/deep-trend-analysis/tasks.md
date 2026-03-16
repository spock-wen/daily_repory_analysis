# 深度趋势分析任务清单

- [ ] **数据层 (Data Layer)** <!-- id: 1 -->
    - [x] 实现 `DataLoader.loadPastWeekDailyData(weekStart)` 方法，用于加载过去 7 天的日报数据 <!-- id: 2 -->
    - [ ] 确保该方法在缺少某些天数据时能优雅处理（不崩溃，记录日志并跳过） <!-- id: 3 -->

- [ ] **分析层 (Analysis Layer)** <!-- id: 4 -->
    - [x] 在 `config/prompts.json` 中创建新的提示词模板，专注于"二阶推理"（跨天、跨项目因果分析） <!-- id: 5 -->
    - [ ] 实现 `InsightAnalyzer.analyzeDeepTrends(dailyDataList)` 方法 <!-- id: 6 -->
    - [ ] 集成 LLM 调用逻辑，生成 JSON 格式的叙事性趋势内容 <!-- id: 7 -->

- [ ] **展示层 (Presentation Layer)** <!-- id: 8 -->
    - [ ] 更新 `html-generator.js` 中的 `renderWeeklyHTML` 方法，加入新版块的渲染逻辑 <!-- id: 9 -->
    - [ ] 添加 CSS 样式，支持叙事性布局（优化字体、行高、引用块样式） <!-- id: 10 -->
    - [ ] 实现"佐证项目列表" (Evidence List) 的渲染，包含时间线标记 (Mon/Tue...) <!-- id: 11 -->

- [ ] **集成与测试 (Integration & Testing)** <!-- id: 12 -->
    - [ ] 更新 `generate-weekly.js` 主流程，调用新的分析管道 <!-- id: 13 -->
    - [ ] 运行 `2026-W11` 周报生成测试，并人工验证生成的 HTML 效果 <!-- id: 14 -->
