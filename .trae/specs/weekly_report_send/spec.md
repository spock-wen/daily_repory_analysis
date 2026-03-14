# 周报推送系统 - 技术规格说明书

> 版本：v1.0  
> 创建日期：2026-03-14  
> 状态：待评审

---

## 1. 概述

### 1.1 背景
当前日报系统仅有日报模板，需要新增周报推送功能。周报需要同时支持飞书和 WeLink 两个平台，针对不同受众提供差异化的内容展示。

### 1.2 目标
- ✅ 实现飞书版周报推送（Interactive 卡片，内容丰富）
- ✅ 实现 WeLink 版周报推送（纯文本，精简高效）
- ✅ 支持降级处理（洞察数据缺失时使用项目列表）
- ✅ 字数控制（WeLink 版 ≤ 350 字）
- ✅ 错误处理和监控日志

### 1.3 受众
| 平台 | 目标用户 | 使用场景 | 内容特点 |
|------|----------|----------|----------|
| 飞书 | 文国荣 | 桌面端深入学习 | 详细、结构化、可交互 |
| WeLink | 技术开发者 | 移动端快速浏览 | 精简、关键信号、300 字左右 |

---

## 2. 系统架构

### 2.1 数据流

```
周报数据 (insights-YYYY-Www.json)
         ↓
  weekly-templates.js (模板生成)
         ↓
         ├──→ Feishu 消息 (Interactive 卡片)
         └──→ WeLink 消息 (纯文本)
         ↓
  message-sender.js (发送器)
         ↓
         ├──→ 飞书 Webhook
         └──→ WeLink Webhook
```

### 2.2 模块依赖

```
generate-weekly.js (入口脚本)
    ↓
├── weekly-templates.js (新建)
│   ├── generateFeishuWeekly()
│   ├── generateWeLinkWeekly()
│   └── 辅助方法 (getWeekRange, truncateText 等)
│
├── message-sender.js (修改)
│   ├── generateNotificationContent() - 添加 weekly 支持
│   ├── sendWeeklyAll() - 新增方法
│   └── 现有的 sendFeishuMessage(), sendWebhookRequest()
│
└── 现有的日志、错误处理模块
```

---

## 3. 详细设计

### 3.1 数据结构

#### 3.1.1 输入数据（已存在）
```json
{
  "week": "2026-W11",
  "projects": [...],
  "insights": {
    "weeklyTheme": {
      "oneLiner": "一句话总结",
      "detailed": "详细解读（200 字左右）"
    },
    "highlights": ["热点 1", "热点 2", "热点 3"],
    "topProjects": [
      {
        "repo": "owner/repo",
        "category": "技术创新 | 持续热门 | 企业价值",
        "reason": "入选理由（100 字）",
        "value": "核心价值（一句话）",
        "useCases": ["场景 1", "场景 2"]
      }
    ],
    "trends": {
      "shortTerm": ["短期趋势 1", "短期趋势 2"],
      "longTerm": ["长期趋势 1", "长期趋势 2"]
    },
    "emergingFields": [
      {
        "field": "领域名",
        "description": "描述（50 字）",
        "projects": ["项目 1", "项目 2"]
      }
    ],
    "recommendations": {
      "developers": ["建议 1", "建议 2"],
      "enterprises": ["建议 1", "建议 2"]
    }
  }
}
```

#### 3.1.2 降级数据结构
当 `insights` 字段缺失时，使用 `projects` 字段生成简化版：
```javascript
{
  weeklyTheme: {
    oneLiner: `本周 ${projects.length} 个项目 trending`,
    detailed: "详细洞察数据暂不可用"
  },
  highlights: projects.slice(0, 3).map(p => p.name),
  topProjects: projects.slice(0, 1),
  trends: { shortTerm: [] },
  emergingFields: [],
  recommendations: {
    developers: ["查看完整报告了解更多"],
    enterprises: ["查看完整报告了解更多"]
  }
}
```

### 3.2 模板模块设计

#### 3.2.1 文件位置
`/srv/www/daily-report/src/notifier/weekly-templates.js`

#### 3.2.2 导出方法

```javascript
/**
 * 生成飞书版周报消息
 * @param {Object} weeklyData - 周报原始数据
 * @param {Object} insights - 洞察数据（可选，缺失时降级）
 * @returns {Object} 飞书 Interactive 消息 JSON
 */
function generateFeishuWeekly(weeklyData, insights)

/**
 * 生成 WeLink 版周报消息
 * @param {Object} weeklyData - 周报原始数据
 * @param {Object} insights - 洞察数据（可选，缺失时降级）
 * @returns {string} WeLink 纯文本消息
 */
function generateWeLinkWeekly(weeklyData, insights)

/**
 * 获取周日期范围
 * @param {string} week - 周标识 (2026-W11 或 2026-03-10)
 * @param {boolean} short - 是否返回短格式
 * @returns {string} 日期范围 (2026 年 3 月 9 日 - 2026 年 3 月 15 日 或 3/9-3/15)
 */
function getWeekRange(week, short = false)

/**
 * 获取周数
 * @param {string} week - 周标识
 * @returns {string} 周数 (11)
 */
function getWeekNumber(week)

/**
 * 缩短文本（超长时截断）
 * @param {string} text - 原文本
 * @param {number} maxLength - 最大长度
 * @param {boolean} addEllipsis - 是否添加省略号
 * @returns {string} 处理后的文本
 */
function truncateText(text, maxLength, addEllipsis = true)

/**
 * 提取一句话摘要（用于 WeLink 版）
 * @param {string} text - 原文本
 * @returns {string} 摘要（约 30 字）
 */
function extractOneLiner(text)

/**
 * 验证 WeLink 消息字数
 * @param {string} message - 消息文本
 * @returns {Object} { valid: boolean, count: number, warning?: string }
 */
function validateWeLinkMessage(message)
```

### 3.3 飞书版模板

#### 3.3.1 消息结构
```javascript
{
  config: { wide_screen_mode: true },
  header: {
    title: { tag: "plain_text", content: "📊 GitHub 周报洞察" },
    subtitle: { tag: "plain_text", content: "{weekRange} · 第{weekNumber}周" },
    template: "blue"
  },
  elements: [
    // 1. 本周核心主题
    {
      tag: "div",
      text: {
        tag: "lark_md",
        content: "**🎯 本周核心主题**\n{oneLiner}\n\n{detailed}"
      }
    },
    { tag: "hr" },
    
    // 2. 关键热点（动态处理：有 3 个显示 3 个，少于 3 个按实际数量）
    {
      tag: "div",
      text: {
        tag: "lark_md",
        content: "**🔥 关键热点**\n{highlightsContent}"
      }
    },
    { tag: "hr" },
    
    // 3. 重点技术突破（只显示 top 1）
    {
      tag: "div",
      text: {
        tag: "lark_md",
        content: "**⭐ 重点技术突破**\n[{repo}](https://github.com/{repo}) · {category}\n\n**核心价值**：{value}\n\n**技术亮点**：{reason}"
      }
    },
    { tag: "hr" },
    
    // 4. 短期趋势预判（动态处理）
    {
      tag: "div",
      text: {
        tag: "lark_md",
        content: "**🔮 短期趋势预判**\n{trendsContent}"
      }
    },
    { tag: "hr" },
    
    // 5. 新兴领域（动态处理，最多显示 2 个）
    {
      tag: "div",
      text: {
        tag: "lark_md",
        content: "**🆕 新兴领域**\n{emergingFieldsContent}"
      }
    },
    { tag: "hr" },
    
    // 6. 行动建议（动态处理）
    {
      tag: "div",
      text: {
        tag: "lark_md",
        content: "**💡 行动建议**\n\n👨‍💻 **开发者**：\n{devRecommendations}\n\n🏢 **企业**：\n{enterpriseRecommendations}"
      }
    },
    { tag: "hr" },
    
    // 7. 查看完整报告按钮
    {
      tag: "action",
      actions: [
        {
          tag: "button",
          text: { tag: "plain_text", content: "📋 查看完整报告" },
          type: "primary",
          url: "{reportUrl}"
        }
      ]
    },
    
    // 8. 页脚
    {
      tag: "note",
      elements: [
        { tag: "plain_text", content: "⏰ 生成时间：{generatedAt}" }
      ]
    }
  ]
}
```

#### 3.3.2 字段映射与处理规则

| 模板变量 | 数据源 | 处理规则 | 降级策略 |
|----------|--------|----------|----------|
| `{weekRange}` | `weeklyData.week` | 调用 `getWeekRange(week, false)` | - |
| `{weekNumber}` | `weeklyData.week` | 调用 `getWeekNumber(week)` | - |
| `{oneLiner}` | `insights.weeklyTheme.oneLiner` | 原样使用 | 降级数据生成 |
| `{detailed}` | `insights.weeklyTheme.detailed` | 原样使用 | 降级数据生成 |
| `{highlightsContent}` | `insights.highlights` | 动态生成 bullet points，最多 3 个 | 降级数据生成 |
| `{repo}` | `insights.topProjects[0].repo` | 原样使用 | 降级数据生成 |
| `{category}` | `insights.topProjects[0].category` | 原样使用 | 降级数据生成 |
| `{value}` | `insights.topProjects[0].value` | 原样使用 | 降级数据生成 |
| `{reason}` | `insights.topProjects[0].reason` | 原样使用 | 降级数据生成 |
| `{trendsContent}` | `insights.trends.shortTerm` | 动态生成 bullet points | 空数组时显示"暂无数据" |
| `{emergingFieldsContent}` | `insights.emergingFields` | 最多显示 2 个，格式化输出 | 空数组时显示"暂无数据" |
| `{devRecommendations}` | `insights.recommendations.developers` | 动态生成 bullet points | 降级数据生成 |
| `{enterpriseRecommendations}` | `insights.recommendations.enterprises` | 动态生成 bullet points | 降级数据生成 |
| `{reportUrl}` | `weeklyData.week` | `https://report.wenspock.site/reports/weekly/weekly-{week}.html` | - |
| `{generatedAt}` | 当前时间 | `YYYY-MM-DD HH:mm` 格式，上海时区 | - |

### 3.4 WeLink 版模板

#### 3.4.1 消息结构
```
📊 GitHub 趋势周报 · 第{weekNumber}周
{weekRangeShort}

🎯 {oneLiner}

🔥 3 个关键信号：
1️⃣ {signal1}
2️⃣ {signal2}
3️⃣ {signal3}

💡 开发者关注：
{emergingField}：{description}

建议：{devRecommendation}

📋 {reportUrl}

⏰ {generatedAtShort}
```

#### 3.4.2 字段映射与处理规则

| 模板变量 | 数据源 | 处理规则 | 字数限制 |
|----------|--------|----------|----------|
| `{weekNumber}` | `weeklyData.week` | 调用 `getWeekNumber(week)` | - |
| `{weekRangeShort}` | `weeklyData.week` | 调用 `getWeekRange(week, true)` | ~10 字 |
| `{oneLiner}` | `insights.weeklyTheme.oneLiner` | 原样使用 | ~50 字 |
| `{signal1}` | `insights.highlights[0]` | 调用 `extractOneLiner()` | ~30 字 |
| `{signal2}` | `insights.highlights[1]` | 调用 `extractOneLiner()` | ~30 字 |
| `{signal3}` | `insights.trends.shortTerm[0]` | 调用 `extractOneLiner()` | ~30 字 |
| `{emergingField}` | `insights.emergingFields[0].field` | 原样使用 | ~20 字 |
| `{description}` | `insights.emergingFields[0].description` | 原样使用 | ~50 字 |
| `{devRecommendation}` | `insights.recommendations.developers[0]` | 原样使用 | ~40 字 |
| `{reportUrl}` | - | 完整 URL | ~50 字 |
| `{generatedAtShort}` | 当前时间 | `MM/DD HH:mm` 格式 | ~10 字 |

**总计目标：≤ 350 字**

#### 3.4.3 字数验证
发送前必须调用 `validateWeLinkMessage()` 验证：
- `count <= 350`: ✅ 允许发送
- `count > 350`: ⚠️ 自动截断并记录警告日志

### 3.5 消息发送器修改

#### 3.5.1 文件位置
`/srv/www/daily-report/src/notifier/message-sender.js`

#### 3.5.2 修改内容

**1. 修改 `generateNotificationContent` 方法**
```javascript
function generateNotificationContent(type, data, insights) {
  if (type === 'weekly') {
    return {
      feishu: generateFeishuWeekly(data, insights),
      welink: generateWeLinkWeekly(data, insights)
    };
  }
  // ... 现有逻辑
}
```

**2. 新增 `sendWeeklyAll` 方法**
```javascript
/**
 * 发送周报到所有平台
 * @param {Object} weeklyData - 周报数据
 * @param {Object} insights - 洞察数据
 * @param {Object} options - 配置选项
 * @returns {Object} { feishu: boolean, welink: boolean, logs: string[] }
 */
async function sendWeeklyAll(weeklyData, insights, options = {}) {
  const results = {
    feishu: false,
    welink: false,
    logs: []
  };
  
  try {
    // 生成内容
    const content = generateNotificationContent('weekly', weeklyData, insights);
    
    // 发送飞书
    if (options.platforms?.includes('feishu') || !options.platforms) {
      results.feishu = await sendFeishuMessage(content.feishu, options.feishuWebhook);
      results.logs.push(`Feishu: ${results.feishu ? 'success' : 'failed'}`);
    }
    
    // 发送 WeLink
    if (options.platforms?.includes('welink') || !options.platforms) {
      // 字数验证
      const validation = validateWeLinkMessage(content.welink);
      if (!validation.valid) {
        logger.warn('WeLink message too long:', validation);
      }
      
      results.welink = await sendWebhookRequest(content.welink, options.welinkWebhook);
      results.logs.push(`WeLink: ${results.welink ? 'success' : 'failed'} (${validation.count} chars)`);
    }
    
  } catch (error) {
    logger.error('sendWeeklyAll error:', error);
    throw error;
  }
  
  return results;
}
```

### 3.6 周报生成脚本修改

#### 3.6.1 文件位置
`/srv/www/daily-report/scripts/generate-weekly.js`

#### 3.6.2 修改内容

**在发送通知部分添加周报专用逻辑：**
```javascript
// 发送推送通知
if (options.sendNotification) {
  logger.info('Sending weekly notification...');
  
  try {
    const results = await sendWeeklyAll(weeklyData, insights, {
      platforms: ['feishu', 'welink'],
      feishuWebhook: process.env.FEISHU_WEBHOOK_URL,
      welinkWebhook: process.env.WELINK_WEBHOOK_URL
    });
    
    logger.info('Notification results:', results);
    
    // 记录监控指标
    if (results.feishu) {
      logger.info('✅ Feishu notification sent successfully');
    }
    if (results.welink) {
      logger.info('✅ WeLink notification sent successfully');
    }
    
  } catch (error) {
    logger.error('Failed to send notification:', error);
    // 不中断流程，继续执行
  }
}
```

---

## 4. 错误处理

### 4.1 错误类型与处理策略

| 错误类型 | 触发条件 | 处理策略 | 日志级别 |
|----------|----------|----------|----------|
| `INSIGHTS_MISSING` | insights 文件不存在 | 使用降级数据，继续执行 | WARN |
| `FIELD_MISSING` | 部分字段缺失 | 使用默认值或跳过该模块 | WARN |
| `WELINK_TOO_LONG` | WeLink 消息超过 350 字 | 自动截断，记录警告 | WARN |
| `FEISHU_SEND_FAILED` | 飞书发送失败 | 记录错误，继续发送 WeLink | ERROR |
| `WELINK_SEND_FAILED` | WeLink 发送失败 | 记录错误，不影响飞书 | ERROR |
| `BOTH_SEND_FAILED` | 两个平台都失败 | 抛出异常，中断流程 | ERROR |

### 4.2 降级逻辑

```javascript
function prepareInsightsData(weeklyData, insightsPath) {
  try {
    if (!fs.existsSync(insightsPath)) {
      logger.warn('Insights file missing, using degraded data:', insightsPath);
      return generateDegradedInsights(weeklyData.projects);
    }
    
    const insights = JSON.parse(fs.readFileSync(insightsPath, 'utf-8'));
    
    // 验证必需字段
    const requiredFields = ['weeklyTheme', 'highlights', 'topProjects'];
    const missingFields = requiredFields.filter(f => !insights[f]);
    
    if (missingFields.length > 0) {
      logger.warn('Missing fields:', missingFields);
      // 部分降级：填补缺失字段
      return { ...insights, ...generateDegradedInsights(weeklyData.projects) };
    }
    
    return insights;
    
  } catch (error) {
    logger.error('Failed to load insights:', error.message);
    return generateDegradedInsights(weeklyData.projects);
  }
}
```

---

## 5. 监控与日志

### 5.1 日志记录点

```javascript
// 1. 模板生成
logger.info('Generating Feishu weekly template...');
logger.info('Generating WeLink weekly template...');

// 2. 字数验证
logger.info(`WeLink message length: ${count} chars`);

// 3. 发送结果
logger.info('Feishu send result:', { success, messageId, timestamp });
logger.info('WeLink send result:', { success, charCount, timestamp });

// 4. 错误日志
logger.error('Feishu send failed:', { error, platform, week });
```

### 5.2 监控指标（可选，后续实现）

| 指标 | 类型 | 说明 |
|------|------|------|
| `weekly.notification.sent` | Counter | 周报发送次数（分平台） |
| `weekly.notification.failed` | Counter | 周报发送失败次数 |
| `weekly.message.length` | Gauge | WeLink 消息长度 |
| `weekly.click_through.rate` | Gauge | 报告链接点击率（需埋点） |

---

## 6. 测试策略

### 6.1 单元测试

**测试文件：** `/srv/www/daily-report/src/notifier/__tests__/weekly-templates.test.js`

**测试用例：**

```javascript
describe('weekly-templates', () => {
  describe('getWeekRange', () => {
    test('should return full format for 2026-W11', () => {
      expect(getWeekRange('2026-W11', false))
        .toBe('2026 年 3 月 9 日 - 2026 年 3 月 15 日');
    });
    
    test('should return short format for 2026-W11', () => {
      expect(getWeekRange('2026-W11', true))
        .toBe('3/9-3/15');
    });
  });
  
  describe('generateFeishuWeekly', () => {
    test('should generate valid Feishu message with full insights', () => {
      const message = generateFeishuWeekly(weeklyData, insights);
      expect(message).toHaveProperty('config');
      expect(message).toHaveProperty('header');
      expect(message).toHaveProperty('elements');
      expect(message.elements.length).toBeGreaterThan(5);
    });
    
    test('should handle degraded insights gracefully', () => {
      const message = generateFeishuWeekly(weeklyData, null);
      expect(message).toHaveProperty('elements');
    });
  });
  
  describe('generateWeLinkWeekly', () => {
    test('should generate message under 350 chars', () => {
      const message = generateWeLinkWeekly(weeklyData, insights);
      expect(message.length).toBeLessThanOrEqual(350);
    });
    
    test('should include all required sections', () => {
      const message = generateWeLinkWeekly(weeklyData, insights);
      expect(message).toContain('📊 GitHub 趋势周报');
      expect(message).toContain('🔥 3 个关键信号');
      expect(message).toContain('📋');
    });
  });
  
  describe('validateWeLinkMessage', () => {
    test('should return valid for short message', () => {
      const result = validateWeLinkMessage('Short message');
      expect(result.valid).toBe(true);
    });
    
    test('should return invalid for long message', () => {
      const longMessage = 'a'.repeat(400);
      const result = validateWeLinkMessage(longMessage);
      expect(result.valid).toBe(false);
      expect(result.count).toBe(400);
    });
  });
});
```

### 6.2 集成测试

**测试脚本：** `/srv/www/daily-report/scripts/test-weekly-notification.js`

```bash
# 测试完整流程
node scripts/generate-weekly.js 2026-W11 --test-mode

# 仅测试飞书
node scripts/generate-weekly.js 2026-W11 --test-mode --platform=feishu

# 仅测试 WeLink
node scripts/generate-weekly.js 2026-W11 --test-mode --platform=welink

# 测试降级模式（无 insights 文件）
node scripts/generate-weekly.js 2026-W99 --test-mode
```

### 6.3 手动验证清单

- [ ] 飞书消息在飞书客户端显示正常
- [ ] 飞书消息所有链接可点击
- [ ] 飞书消息按钮可点击并跳转正确 URL
- [ ] WeLink 消息在移动端显示完整
- [ ] WeLink 消息字数 ≤ 350 字
- [ ] WeLink 消息链接可点击
- [ ] 降级模式消息内容合理
- [ ] 错误日志记录正确

---

## 7. 部署与发布

### 7.1 部署步骤

1. **代码部署**
   ```bash
   cd /srv/www/daily-report
   git pull origin main
   
   # 验证新文件存在
   ls -la src/notifier/weekly-templates.js
   
   # 运行测试
   npm test -- weekly-templates
   ```

2. **环境变量检查**
   ```bash
   # 确保以下变量存在
   echo $FEISHU_WEBHOOK_URL
   echo $WELINK_WEBHOOK_URL
   ```

3. **权限检查**
   ```bash
   # 确保脚本可执行
   chmod +x scripts/generate-weekly.js
   ```

### 7.2 灰度发布计划

| 阶段 | 时间 | 范围 | 验证指标 |
|------|------|------|----------|
| Phase 1 | Week 1 | 仅飞书 | 发送成功率 100% |
| Phase 2 | Week 2 | 飞书 + WeLink | 两个平台成功率 ≥ 95% |
| Phase 3 | Week 3 | 全量 | 收集用户反馈，优化内容 |

### 7.3 回滚方案

如果推送失败或内容有误：

```bash
# 1. 停止定时任务
crontab -r  # 或注释掉相关任务

# 2. 代码回滚
cd /srv/www/daily-report
git revert HEAD

# 3. 发送修正通知（如需要）
# 手动编辑消息重新发送
```

---

## 8. 验收标准

### 8.1 功能验收

- [x] 飞书版消息包含：主题、热点、突破、趋势、领域、建议、按钮、页脚
- [x] WeLink 版消息字数 ≤ 350 字
- [x] 两个平台消息都能成功发送
- [x] 链接可点击并跳转正确 URL
- [x] 降级模式正常工作

### 8.2 质量验收

- [x] 单元测试覆盖率 ≥ 80%
- [x] 所有测试用例通过
- [x] 代码通过 ESLint 检查
- [x] 错误日志记录完整

### 8.3 性能验收

- [x] 模板生成时间 < 100ms
- [x] 消息发送时间 < 3s（单平台）
- [x] 无内存泄漏

---

## 9. 附录

### 9.1 周计算工具方法

```javascript
/**
 * 获取周日期范围
 */
function getWeekRange(week, short = false) {
  // 解析周标识
  const match = week.match(/(\d{4})-W(\d{2})/);
  if (!match) {
    throw new Error(`Invalid week format: ${week}`);
  }
  
  const year = parseInt(match[1]);
  const weekNum = parseInt(match[2]);
  
  // 计算周一日期
  const jan1 = new Date(year, 0, 1);
  const dayOfWeek = jan1.getDay();
  const mondayOffset = dayOfWeek === 0 ? 1 : dayOfWeek;
  const monday = new Date(year, 0, 1 + (weekNum - 1) * 7 + (1 - mondayOffset));
  
  // 计算周日日期
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  
  if (short) {
    return `${monday.getMonth() + 1}/${monday.getDate()}-${sunday.getMonth() + 1}/${sunday.getDate()}`;
  }
  
  return `${year}年${monday.getMonth() + 1}月${monday.getDate()}日 - ${year}年${sunday.getMonth() + 1}月${sunday.getDate()}日`;
}

/**
 * 获取周数
 */
function getWeekNumber(week) {
  const match = week.match(/W(\d{2})/);
  return match ? match[1] : '01';
}
```

### 9.2 参考文档

- [飞书开放平台 - 消息卡片](https://open.feishu.cn/document/ukTMzUjL4YDM24iNxcAT04gMxYjL)
- [WeLink 开放 API](https://developer.welink.huaweicloud.com/)
- [实施文档](./weekly-report-implementation.md)

---

**文档结束**
