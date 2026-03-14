/**
 * 周报模板模块单元测试
 * 覆盖所有公开方法和边界情况
 */

const { describe, it, test } = require('node:test');
const assert = require('node:assert/strict');

const {
  getWeekRange,
  getWeekNumber,
  truncateText,
  extractOneLiner,
  validateWeLinkMessage,
  generateFeishuWeekly,
  generateWeLinkWeekly,
  generateDegradedInsights
} = require('../../src/notifier/weekly-templates');

describe('weekly-templates', () => {
  // 测试数据
  const weeklyData = {
    week: '2026-W11',
    date: '2026-W11',
    projects: [
      { name: 'moeru-ai/airi', stars: 31372 },
      { name: 'koala73/worldmonitor', stars: 34088 },
      { name: 'alibaba/OpenSandbox', stars: 6972 }
    ]
  };

  const insights = {
    weeklyTheme: {
      oneLiner: 'AI Companion 与智能代理基础设施爆发式增长',
      detailed: '本周 GitHub Trending 全部 10 个项目均为 AI 相关（100% 占比），且呈现高度结构化分化。'
    },
    highlights: [
      'moeru-ai/airi（31,372 stars）：首周登顶 Trending 榜首',
      'koala73/worldmonitor（34,088 stars）：单周净增超 8,200 stars',
      'alibaba/OpenSandbox（6,972 stars）：阿里开源首周即跻身 Top 3'
    ],
    topProjects: [
      {
        repo: 'moeru-ai/airi',
        category: '技术创新',
        reason: '突破性整合语音 TTS/ASR、VRM/Live2D 渲染',
        value: '为个人用户提供具备人格化表达的 AI Companion 基础设施',
        useCases: ['虚拟陪伴与情感交互', '游戏内 AI 协作者']
      }
    ],
    trends: {
      shortTerm: [
        'TypeScript 驱动的 AI 前端实时化',
        '沙盒 API 标准化加速'
      ]
    },
    emergingFields: [
      {
        field: 'AI Companion',
        description: '虚拟陪伴与情感交互的 AI 系统',
        projects: ['moeru-ai/airi']
      },
      {
        field: 'AI 沙盒',
        description: 'AI 代理安全执行的基座设施',
        projects: ['alibaba/OpenSandbox']
      }
    ],
    recommendations: {
      developers: ['关注 AI Companion 技术栈', '学习沙盒 API 设计'],
      enterprises: ['评估 OpenSandbox 企业应用', '构建 AI 代理安全体系']
    }
  };

  describe('getWeekRange', () => {
    test('should return full format for 2026-W11', () => {
      const result = getWeekRange('2026-W11', false);
      // 验证基本格式：包含年份和日期范围
      assert.ok(result.match(/2026.*3.*9.*-.*3.*15/));
    });
    
    test('should return short format for 2026-W11', () => {
      assert.strictEqual(
        getWeekRange('2026-W11', true),
        '3/9-3/15'
      );
    });
    
    test('should throw error for invalid format', () => {
      assert.throws(() => getWeekRange('invalid'), /Invalid week format/);
    });
    
    test('should handle different weeks correctly', () => {
      assert.ok(getWeekRange('2026-W11', false).includes('年'));
      assert.ok(getWeekRange('2026-W20', false).includes('年'));
    });
  });

  describe('getWeekNumber', () => {
    test('should return week number for 2026-W11', () => {
      assert.strictEqual(getWeekNumber('2026-W11'), '11');
    });
    
    test('should return week number for 2026-W01', () => {
      assert.strictEqual(getWeekNumber('2026-W01'), '01');
    });
    
    test('should return week number for 2026-W52', () => {
      assert.strictEqual(getWeekNumber('2026-W52'), '52');
    });
    
    test('should return default for invalid format', () => {
      assert.strictEqual(getWeekNumber('invalid'), '01');
    });
  });

  describe('truncateText', () => {
    test('should not truncate short text', () => {
      assert.strictEqual(truncateText('Short text', 50), 'Short text');
    });
    
    test('should truncate long text with ellipsis', () => {
      const result = truncateText('This is a very long text that needs truncation', 20);
      assert.ok(result.length <= 23);
      assert.ok(result.match(/\.\.\.$/));
    });
    
    test('should truncate without ellipsis when specified', () => {
      const result = truncateText('Long text', 5, false);
      assert.strictEqual(result, 'Long ');
      assert.ok(!result.match(/\.\.\.$/));
    });
    
    test('should handle empty text', () => {
      assert.strictEqual(truncateText('', 10), '');
      assert.strictEqual(truncateText(null, 10), '');
    });
  });

  describe('extractOneLiner', () => {
    test('should extract first sentence', () => {
      const text = 'This is the first sentence. This is the second sentence.';
      const result = extractOneLiner(text);
      assert.strictEqual(result, 'This is the first sentence');
    });
    
    test('should truncate if first sentence is too long', () => {
      const text = 'A'.repeat(50) + '. Second sentence.';
      const result = extractOneLiner(text);
      assert.ok(result.length <= 33);
    });
    
    test('should handle empty text', () => {
      assert.strictEqual(extractOneLiner(''), '');
      assert.strictEqual(extractOneLiner(null), '');
    });
  });

  describe('validateWeLinkMessage', () => {
    test('should return valid for short message', () => {
      const result = validateWeLinkMessage('Short message');
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.count, 13);
    });
    
    test('should return invalid for long message', () => {
      const longMessage = 'a'.repeat(600);
      const result = validateWeLinkMessage(longMessage);
      assert.strictEqual(result.valid, false);
      assert.strictEqual(result.count, 600);
      assert.ok(result.warning.includes('超长'));
    });
    
    test('should return valid for exactly 500 chars', () => {
      const message = 'a'.repeat(500);
      const result = validateWeLinkMessage(message);
      assert.strictEqual(result.valid, true);
    });
    
    test('should return invalid for empty message', () => {
      const result = validateWeLinkMessage('');
      assert.strictEqual(result.valid, false);
      assert.ok(result.warning.includes('为空'));
    });
    
    test('should handle boundary at 500 chars', () => {
      assert.strictEqual(validateWeLinkMessage('a'.repeat(500)).valid, true);
      assert.strictEqual(validateWeLinkMessage('a'.repeat(501)).valid, false);
    });
  });

  describe('generateDegradedInsights', () => {
    test('should generate insights from projects', () => {
      const projects = [
        { name: 'project1' },
        { name: 'project2' },
        { name: 'project3' }
      ];
      
      const degraded = generateDegradedInsights(projects);
      
      assert.ok(degraded.weeklyTheme.oneLiner.includes('3 个项目'));
      assert.strictEqual(degraded.highlights.length, 3);
      assert.strictEqual(degraded.topProjects.length, 1);
      assert.deepStrictEqual(degraded.trends.shortTerm, []);
      assert.deepStrictEqual(degraded.emergingFields, []);
    });
    
    test('should handle empty projects', () => {
      const degraded = generateDegradedInsights([]);
      assert.ok(degraded.weeklyTheme.oneLiner.includes('0 个项目'));
    });
    
    test('should handle null projects', () => {
      const degraded = generateDegradedInsights(null);
      assert.ok(degraded.weeklyTheme.oneLiner.includes('0 个项目'));
    });
  });

  describe('generateFeishuWeekly', () => {
    test('should generate valid Feishu message with full insights', () => {
      const message = generateFeishuWeekly(weeklyData, insights);
      
      assert.ok(message.config);
      assert.ok(message.header);
      assert.ok(message.elements);
      assert.strictEqual(message.config.wide_screen_mode, true);
      assert.strictEqual(message.header.template, 'blue');
      assert.ok(message.elements.length > 5);
    });
    
    test('should include all required sections', () => {
      const message = generateFeishuWeekly(weeklyData, insights);
      const elementsText = message.elements.map(e => e.text?.content || '').join('');
      
      assert.ok(elementsText.includes('🎯 本周核心主题'));
      assert.ok(elementsText.includes('🔥 关键热点'));
      assert.ok(elementsText.includes('⭐ 重点技术突破'));
      assert.ok(elementsText.includes('🔮 短期趋势预判'));
      assert.ok(elementsText.includes('🆕 新兴领域'));
      assert.ok(elementsText.includes('💡 行动建议'));
    });
    
    test('should handle degraded insights gracefully', () => {
      const message = generateFeishuWeekly(weeklyData, null);
      
      assert.ok(message.elements);
      assert.ok(message.elements.length > 0);
    });
    
    test('should handle empty arrays', () => {
      const emptyInsights = {
        weeklyTheme: { oneLiner: 'Test', detailed: 'Test detail' },
        highlights: [],
        topProjects: [],
        trends: { shortTerm: [] },
        emergingFields: [],
        recommendations: { developers: [], enterprises: [] }
      };
      
      const message = generateFeishuWeekly(weeklyData, emptyInsights);
      assert.ok(message.elements);
    });
  });

  describe('generateWeLinkWeekly', () => {
    test('should generate message under 500 chars', () => {
      const message = generateWeLinkWeekly(weeklyData, insights);
      assert.ok(message.length <= 500);
    });
    
    test('should include all required sections', () => {
      const message = generateWeLinkWeekly(weeklyData, insights);
      
      assert.ok(message.includes('📊 GitHub 趋势周报'));
      assert.ok(message.includes('🔥 3 个关键信号'));
      assert.ok(message.includes('📋'));
      assert.ok(message.includes('⏰'));
    });
    
    test('should handle degraded insights', () => {
      const message = generateWeLinkWeekly(weeklyData, null);
      
      assert.ok(message.includes('📊 GitHub 趋势周报'));
      assert.ok(message.length <= 500);
    });
    
    test('should extract 3 signals', () => {
      const message = generateWeLinkWeekly(weeklyData, insights);
      
      assert.ok(message.includes('1️⃣'));
      assert.ok(message.includes('2️⃣'));
      assert.ok(message.includes('3️⃣'));
    });
    
    test('should include report URL', () => {
      const message = generateWeLinkWeekly(weeklyData, insights);
      assert.ok(message.includes('https://report.wenspock.site/weekly/weekly-2026-W11.html'));
    });
    
    test('should not include recommendations section', () => {
      const message = generateWeLinkWeekly(weeklyData, insights);
      assert.ok(!message.includes('建议：'));
    });
    
    test('should include week date range', () => {
      const message = generateWeLinkWeekly(weeklyData, insights);
      assert.ok(message.match(/\d+\/\d+-\d+\/\d+/));
    });
  });
  
  describe('GitHub link conversion', () => {
    test('should convert repo names to GitHub links in Feishu message', () => {
      const message = generateFeishuWeekly(weeklyData, insights);
      const content = JSON.stringify(message);
      
      assert.ok(content.includes('github.com/moeru-ai/airi'));
      assert.ok(content.includes('github.com/koala73/worldmonitor'));
    });
    
    test('should handle repos with special characters', () => {
      const testInsights = {
        ...insights,
        highlights: ['test-org/test_repo：测试项目']
      };
      const message = generateFeishuWeekly(weeklyData, testInsights);
      const content = JSON.stringify(message);
      
      assert.ok(content.includes('github.com/test-org/test_repo'));
    });
  });
  
  describe('boundary cases', () => {
    test('should handle missing highlights', () => {
      const testInsights = { ...insights, highlights: [] };
      const message = generateFeishuWeekly(weeklyData, testInsights);
      
      assert.ok(message.elements);
    });
    
    test('should handle missing trends', () => {
      const testInsights = { ...insights, trends: { shortTerm: [] } };
      const message = generateFeishuWeekly(weeklyData, testInsights);
      
      assert.ok(message.elements);
    });
    
    test('should handle missing emergingFields', () => {
      const testInsights = { ...insights, emergingFields: [] };
      const message = generateFeishuWeekly(weeklyData, testInsights);
      
      assert.ok(message.elements);
    });
    
    test('should handle single highlight', () => {
      const testInsights = { ...insights, highlights: ['Only one highlight'] };
      const message = generateWeLinkWeekly(weeklyData, testInsights);
      
      assert.ok(message.includes('1️⃣'));
    });
  });
});
