#!/usr/bin/env node
/**
 * DataLoader 模块测试
 */

const path = require('path');
const DataLoader = require('../../src/loader/data-loader');

// 测试计数器
let totalTests = 0;
let passedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ ${testName}`);
    passedTests++;
  } else {
    console.log(`  ❌ ${testName}`);
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('  DataLoader 模块测试');
  console.log('='.repeat(60) + '\n');

  try {
    const loader = new DataLoader();

    // 测试 1: 实例化
    assert(loader instanceof DataLoader, 'DataLoader 可实例化');
    assert(typeof loader.loadDailyData === 'function', 'loadDailyData 方法存在');
    assert(typeof loader.loadWeeklyData === 'function', 'loadWeeklyData 方法存在');
    assert(typeof loader.loadMonthlyData === 'function', 'loadMonthlyData 方法存在');
    assert(typeof loader.validateData === 'function', 'validateData 方法存在');

    // 测试 2: 数据格式标准化
    const mockData = {
      projects: [
        {
          fullName: 'owner/repo',
          descZh: '测试项目',
          url: 'https://github.com/owner/repo',
          stars: 1000,
          forks: 100,
          language: 'JavaScript',
          isAI: true,
          todayStars: 500
        }
      ]
    };

    const normalized = loader.normalizeDataFormat(mockData);
    assert(normalized.trending_repos, '标准化后包含 trending_repos');
    assert(normalized.trending_repos.length === 1, '项目数量正确');
    assert(normalized.trending_repos[0].name === 'owner/repo', '项目名称正确');
    assert(normalized.stats, '包含统计数据');

    // 测试 3: 数据验证
    const validData = {
      brief: {
        trending_repos: [],
        stats: {}
      },
      aiInsights: {
        summary: '测试总结',
        project_insights: []
      }
    };

    const validation = loader.validateData(validData);
    assert(validation.valid === true, '有效数据验证通过');

    const invalidData = {};
    const invalidValidation = loader.validateData(invalidData);
    assert(invalidValidation.valid === false, '无效数据验证失败');

  } catch (error) {
    console.log(`  ❌ 测试执行失败：${error.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`  测试结果：${passedTests}/${totalTests} 通过`);
  console.log('='.repeat(60) + '\n');

  process.exit(passedTests === totalTests ? 0 : 1);
}

runTests();
