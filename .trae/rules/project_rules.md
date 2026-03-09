# 项目规则

## 前端设计规范

### 强制要求

**在以下情况下 MUST invoke `frontend-design` 技能：**

1. ✅ 修改任何 HTML 文件时（特别是 `reports/` 目录下的报告文件）
2. ✅ 修改 `scripts/` 目录下的生成脚本时（如 `generate-daily.js`, `generate-weekly.js`, `generate-monthly.js` 等）
3. ✅ 修改 `src/generator/` 目录下的 HTML 生成器时
4. ✅ 需要调整页面样式、布局、配色方案时
5. ✅ 需要优化用户体验或界面美观度时

### 设计规范

#### 配色方案

项目使用暗黑主题，CSS 变量定义在 `:root` 中：

```css
:root {
  --bg-primary: #0a0a0a;      /* 主背景 */
  --bg-secondary: #111111;    /* 次级背景 */
  --bg-card: #1a1a1a;         /* 卡片背景 */
  --text-primary: #e0e0e0;    /* 主文字 */
  --text-secondary: #a0a0a0;  /* 次级文字 */
  --accent: #00ff41;          /* 强调色（绿色） */
  --accent-dim: #00cc33;      /* 强调色（暗） */
  --border: #333333;          /* 边框色 */
  --success: #00ff41;         /* 成功色 */
  --warning: #ffaa00;         /* 警告色 */
}
```

**禁止随意更改这些主题色值。**

#### 间距系统

使用基于 4px 网格的间距系统：

- `8px` (0.5rem) - 小组件内部间距
- `16px` (1rem) - 中等元素间距
- `24px` (1.5rem) - 大间距
- `40px` (2.5rem) - 区块间距

#### 响应式设计

所有修改必须支持响应式：

- 使用弹性布局（Grid/Flexbox）
- 使用相对单位（rem, %, fr）
- 确保移动端显示正常
- 测试断点：768px

### 代码审查要点

修改 HTML 或生成脚本时应检查：

- [ ] 图标使用是否语义化
- [ ] 是否添加了 title 提示
- [ ] 配色是否符合主题规范
- [ ] 间距是否使用一致单位
- [ ] 响应式设计是否完整
- [ ] 文字对比度是否足够
- [ ] 交互效果是否流畅

### 项目链接生成

在 AI 洞察部分，所有项目名都应自动生成可点击的 GitHub 链接：

**实现方式：**
1. 使用 `linkifyProjectName()` 函数
2. 从项目列表创建 `projectUrlMap`
3. 全局匹配文本中的 `owner/repo` 格式
4. 使用真实的项目 URL，不要硬编码

**示例：**
```javascript
// 在文本中匹配项目名并生成链接
const text = "推荐使用 QwenLM/Qwen-Agent 和 alibaba/page-agent";
// 输出：
// "推荐使用 <a href="...">QwenLM/Qwen-Agent</a> 和 <a href="...">alibaba/page-agent</a>"
```

### 数据字段映射

确保 HTML 生成器使用的字段名与数据加载器输出的字段名一致：

```javascript
// 数据加载器输出 (data-loader.js)
{
  core_features: [...],    // 核心功能
  use_cases: [...],        // 使用场景
  trend_data: [...],       // 热度趋势
  todayStars: 345,         // 今日星数
  stars: 5608,             // 总星数
  forks: 622,              // 分支数
  url: "https://..."       // 项目 URL
}

// HTML 生成器使用 (html-generator.js)
project.core_features
project.use_cases
project.trend_data
project.todayStars
project.stars
project.forks
project.url
```

## 文件结构

```
daily_report_analysis/
├── .trae/
│   └── skills/
│       └── frontend-design/     # 前端设计技能
│           └── SKILL.md
├── reports/
│   └── daily/                # 生成的 HTML 报告
├── scripts/
│   ├── generate-daily.js     # 日报生成脚本 ⚠️ 修改需 invoke frontend-design
│   ├── generate-weekly.js    # 周报生成脚本 ⚠️ 修改需 invoke frontend-design
│   └── generate-monthly.js   # 月报生成脚本 ⚠️ 修改需 invoke frontend-design
└── src/
    └── generator/
        └── html-generator.js # HTML 生成器 ⚠️ 修改需 invoke frontend-design
```

## 违规示例

❌ **错误做法：**
```html
<!-- 使用不直观的图标 -->
<span>🍴 622</span>  <!-- 刀叉表示 Forks -->

<!-- 缺少 title 提示 -->
<span>⭐ 5608</span>

<!-- 硬编码 GitHub URL -->
<a href="https://github.com/${projectName}">${projectName}</a>

<!-- 使用不规范的间距 -->
<div style="margin: 13px;">  <!-- 应使用 8px, 16px, 24px 等标准值 -->
```

✅ **正确做法：**
```html
<!-- 使用语义化图标 -->
<span title="分支数">🌿 622</span>

<!-- 添加 title 提示 -->
<span title="总星数">⭐ 5608</span>

<!-- 从数据中获取 URL -->
<a href="${project.url}">${project.name}</a>

<!-- 使用标准间距 -->
<div style="margin: 16px;">
```
