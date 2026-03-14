# 周报推送系统 - 任务分解

> 关联文档：[spec.md](./spec.md)  
> 版本：v1.0  
> 创建日期：2026-03-14

---

## 任务概览

| 任务 ID | 任务名称 | 优先级 | 预计工时 | 依赖 |
|---------|----------|--------|----------|------|
| T1 | 创建周报模板模块 | P0 | 4h | - |
| T2 | 修改消息发送器 | P0 | 2h | T1 |
| T3 | 修改周报生成脚本 | P0 | 1h | T2 |
| T4 | 编写单元测试 | P1 | 3h | T1 |
| T5 | 集成测试与调优 | P1 | 2h | T3, T4 |
| T6 | 部署与灰度发布 | P1 | 1h | T5 |

**总预计工时：13 小时**

---

## 详细任务

### T1: 创建周报模板模块

**文件：** `/srv/www/daily-report/src/notifier/weekly-templates.js`

**任务描述：**
实现周报模板生成逻辑，包括飞书版和 WeLink 版两个模板。

**子任务：**

- [ ] T1.1 实现辅助方法
  - [ ] `getWeekRange(week, short)` - 获取周日期范围
  - [ ] `getWeekNumber(week)` - 获取周数
  - [ ] `truncateText(text, maxLength, addEllipsis)` - 截断文本
  - [ ] `extractOneLiner(text)` - 提取一句话摘要
  - [ ] `validateWeLinkMessage(message)` - 验证 WeLink 消息字数

- [ ] T1.2 实现飞书版模板
  - [ ] `generateFeishuWeekly(weeklyData, insights)`
  - [ ] 处理 8 个模块：主题、热点、突破、趋势、领域、建议、按钮、页脚
  - [ ] 动态处理字段缺失情况
  - [ ] 添加 GitHub 链接转换

- [ ] T1.3 实现 WeLink 版模板
  - [ ] `generateWeLinkWeekly(weeklyData, insights)`
  - [ ] 字数控制在 350 字以内
  - [ ] 提取 3 个关键信号
  - [ ] 添加报告链接

- [ ] T1.4 实现降级逻辑
  - [ ] `generateDegradedInsights(projects)` - 从项目列表生成简化洞察
  - [ ] 处理洞察数据缺失情况

**输出：**
- `src/notifier/weekly-templates.js` - 模板模块文件
- 导出 7 个公开方法

**验收标准：**
- [ ] 所有方法都有 JSDoc 注释
- [ ] 飞书版生成有效的 Interactive 卡片 JSON
- [ ] WeLink 版字数 ≤ 350 字
- [ ] 降级模式正常工作
- [ ] 代码通过 ESLint 检查

**技术要点：**
- 使用飞书 Interactive 卡片语法
- 注意 Markdown 格式在飞书中的渲染规则
- WeLink 版需要精简但不失关键信息

---

### T2: 修改消息发送器

**文件：** `/srv/www/daily-report/src/notifier/message-sender.js`

**任务描述：**
扩展消息发送器以支持周报推送。

**子任务：**

- [ ] T2.1 导入周报模板模块
  ```javascript
  const { generateFeishuWeekly, generateWeLinkWeekly } = require('./weekly-templates');
  ```

- [ ] T2.2 修改 `generateNotificationContent` 方法
  - 添加 `type === 'weekly'` 分支
  - 返回飞书和 WeLink 两个版本的内容

- [ ] T2.3 新增 `sendWeeklyAll` 方法
  - 支持同时发送两个平台
  - 支持单独指定平台（通过 options.platforms）
  - WeLink 版发送前验证字数
  - 记录详细日志
  - 错误隔离（一个平台失败不影响另一个）

- [ ] T2.4 导出新方法
  ```javascript
  module.exports = {
    // ... 现有方法
    sendWeeklyAll
  };
  ```

**输出：**
- 修改后的 `message-sender.js`
- 新增 `sendWeeklyAll` 方法

**验收标准：**
- [ ] `sendWeeklyAll` 能正确生成并发送两个平台的消息
- [ ] 支持单独指定平台
- [ ] 错误处理完善（一个失败不影响另一个）
- [ ] 日志记录完整
- [ ] 不影响现有日报发送功能

**技术要点：**
- 保持与现有 API 的兼容性
- 错误处理要细致，避免单点故障
- 日志要包含足够的调试信息

---

### T3: 修改周报生成脚本

**文件：** `/srv/www/daily-report/scripts/generate-weekly.js`

**任务描述：**
在周报生成脚本中添加推送通知逻辑。

**子任务：**

- [ ] T3.1 导入消息发送器
  ```javascript
  const { sendWeeklyAll } = require('./src/notifier/message-sender');
  ```

- [ ] T3.2 添加推送通知逻辑
  - 在周报生成完成后调用 `sendWeeklyAll`
  - 传入周报数据和洞察数据
  - 处理发送结果

- [ ] T3.3 添加详细日志
  - 记录发送开始时间
  - 记录每个平台的发送结果
  - 记录错误信息（如有）

- [ ] T3.4 添加测试模式支持
  - `--test-mode` 参数：模拟发送，不实际调用 Webhook
  - `--platform` 参数：指定测试平台

**输出：**
- 修改后的 `generate-weekly.js`

**验收标准：**
- [ ] 周报生成后自动发送推送
- [ ] 推送失败不影响周报生成
- [ ] 日志清晰易懂
- [ ] 测试模式正常工作

**技术要点：**
- 推送是可选的，失败不应中断主流程
- 测试模式用于开发调试

---

### T4: 编写单元测试

**文件：** `/srv/www/daily-report/src/notifier/__tests__/weekly-templates.test.js`

**任务描述：**
为周报模板模块编写完整的单元测试。

**子任务：**

- [ ] T4.1 准备测试数据
  - 完整的周报数据示例
  - 完整的洞察数据示例
  - 降级模式数据（无 insights）
  - 边界情况数据（空数组、缺失字段等）

- [ ] T4.2 测试辅助方法
  - `getWeekRange` - 正常格式、短格式、错误输入
  - `getWeekNumber` - 各种周格式
  - `truncateText` - 超长、不超长、是否加省略号
  - `extractOneLiner` - 各种长度文本
  - `validateWeLinkMessage` - 长短消息验证

- [ ] T4.3 测试飞书版模板
  - 正常数据生成
  - 降级数据生成
  - 验证输出结构（config, header, elements）
  - 验证元素数量和内容

- [ ] T4.4 测试 WeLink 版模板
  - 字数验证（≤ 350）
  - 内容结构验证（包含必需章节）
  - 降级模式验证

- [ ] T4.5 测试边界情况
  - insights 完全缺失
  - insights 部分字段缺失
  - highlights 为空或不足 3 个
  - trends 为空
  - emergingFields 为空

**输出：**
- `src/notifier/__tests__/weekly-templates.test.js`

**验收标准：**
- [ ] 测试覆盖率 ≥ 80%
- [ ] 所有测试用例通过
- [ ] 包含边界情况测试
- [ ] 测试代码清晰易懂

**技术要点：**
- 使用 Jest 测试框架（假设项目已使用）
- 测试用例要独立，不相互依赖
- 使用描述性的测试名称

---

### T5: 集成测试与调优

**文件：** `/srv/www/daily-report/scripts/test-weekly-notification.js`

**任务描述：**
进行端到端集成测试，验证完整流程。

**子任务：**

- [ ] T5.1 创建集成测试脚本
  - 模拟完整的周报生成流程
  - 调用消息发送器
  - 验证输出结果

- [ ] T5.2 手动测试飞书版
  - 在实际飞书环境中查看消息
  - 验证格式是否正确
  - 验证链接是否可点击
  - 验证按钮是否可跳转

- [ ] T5.3 手动测试 WeLink 版
  - 在实际 WeLink 环境中查看消息
  - 验证字数是否符合限制
  - 验证格式是否美观
  - 验证链接是否可点击

- [ ] T5.4 测试降级模式
  - 删除或移动 insights 文件
  - 运行周报生成
  - 验证降级消息内容

- [ ] T5.5 性能测试
  - 测量模板生成时间（目标 < 100ms）
  - 测量消息发送时间（目标 < 3s）
  - 检查内存使用

- [ ] T5.6 调优优化
  - 根据测试结果调整模板
  - 优化 WeLink 版字数
  - 修复发现的问题

**输出：**
- `scripts/test-weekly-notification.js` - 集成测试脚本
- 测试报告（包含性能数据）
- 问题清单及修复记录

**验收标准：**
- [ ] 飞书消息显示正常
- [ ] WeLink 消息字数 ≤ 350 字
- [ ] 所有链接可点击
- [ ] 降级模式正常工作
- [ ] 性能指标达标
- [ ] 无严重 bug

**技术要点：**
- 集成测试脚本应支持多种测试场景
- 性能测试要多次运行取平均值

---

### T6: 部署与灰度发布

**任务描述：**
将代码部署到生产环境，并按灰度计划发布。

**子任务：**

- [ ] T6.1 代码审查
  - 检查代码质量
  - 验证测试覆盖率
  - 确认无安全漏洞

- [ ] T6.2 部署到生产环境
  ```bash
  cd /srv/www/daily-report
  git pull origin main
  npm install  # 如有新依赖
  npm test -- weekly-templates
  ```

- [ ] T6.3 环境变量检查
  - 确认 `FEISHU_WEBHOOK_URL` 存在
  - 确认 `WELINK_WEBHOOK_URL` 存在
  - 验证 Webhook URL 有效性

- [ ] T6.4 Phase 1: 仅飞书（Week 1）
  - 配置只发送飞书平台
  - 监控发送成功率
  - 收集用户反馈

- [ ] T6.5 Phase 2: 双平台（Week 2）
  - 启用 WeLink 推送
  - 监控两个平台成功率
  - 验证成功率 ≥ 95%

- [ ] T6.6 Phase 3: 全量发布（Week 3）
  - 收集并分析用户反馈
  - 优化模板内容
  - 正式全量发布

- [ ] T6.7 监控与告警
  - 配置发送失败告警
  - 监控日志异常
  - 准备应急响应方案

**输出：**
- 生产环境部署完成
- 灰度发布报告
- 监控告警配置

**验收标准：**
- [ ] 代码成功部署到生产环境
- [ ] Phase 1 发送成功率 100%
- [ ] Phase 2 双平台成功率 ≥ 95%
- [ ] 用户反馈积极
- [ ] 监控告警正常工作

**技术要点：**
- 灰度发布要循序渐进
- 准备好回滚方案
- 及时响应用户反馈

---

## 任务依赖关系

```
T1 (模板模块)
  ↓
T2 (消息发送器)
  ↓
T3 (周报脚本) → T4 (单元测试)
  ↓              ↓
T5 (集成测试) ←──┘
  ↓
T6 (部署发布)
```

---

## 风险与应对

| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|----------|
| 飞书卡片格式不兼容 | 中 | 高 | 提前在飞书开发者工具测试 |
| WeLink 字数超限 | 高 | 中 | 严格字数验证，自动截断 |
| 洞察数据缺失 | 中 | 中 | 完善降级逻辑 |
| Webhook 发送失败 | 低 | 高 | 重试机制，告警通知 |
| 性能不达标 | 低 | 中 | 优化模板生成逻辑 |

---

## 里程碑

| 里程碑 | 预计完成时间 | 包含任务 |
|--------|--------------|----------|
| M1: 核心功能完成 | Day 1-2 | T1, T2, T3 |
| M2: 测试完成 | Day 3 | T4, T5 |
| M3: Phase 1 完成 | Week 1 | T6 (部分) |
| M4: Phase 2 完成 | Week 2 | T6 (部分) |
| M5: 全量发布 | Week 3 | T6 (完成) |

---

**文档结束**
