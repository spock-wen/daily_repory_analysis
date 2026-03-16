#!/usr/bin/env node

/**
 * 首页生成脚本
 * 用法：node scripts/generate-index.js
 */

const fs = require('fs');
const path = require('path');

// 工具函数
const utils = require('../src/utils');

async function generateIndex() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 开始生成首页');
  console.log('='.repeat(60));

  try {
    // 步骤 1: 收集所有报告数据
    console.log('📥 步骤 1/3: 收集报告数据...');
    const reportsData = collectReportsData();
    console.log(`   ✅ 收集到 ${reportsData.daily.length} 篇日报，${reportsData.weekly.length} 篇周报，${reportsData.monthly.length} 篇月报\n`);

    // 步骤 2: 生成 HTML
    console.log('🎨 步骤 2/3: 生成 HTML...');
    const html = generateIndexHTML(reportsData);
    const indexPath = path.join(process.cwd(), 'reports', 'index.html');
    fs.writeFileSync(indexPath, html, 'utf-8');
    console.log(`   ✅ HTML 已生成：${indexPath}\n`);

    // 步骤 3: 复制样式文件（如果不存在）
    console.log('📋 步骤 3/3: 检查样式文件...');
    const cssSource = path.join(process.cwd(), 'public', 'css', 'index.css');
    if (!fs.existsSync(cssSource)) {
      console.log('   ⚠️  样式文件不存在，请手动创建 public/css/index.css');
    } else {
      console.log('   ✅ 样式文件已存在\n');
    }

    // 完成
    console.log('='.repeat(60));
    console.log('🎉 首页生成完成！');
    console.log('='.repeat(60));
    console.log(`📄 报告文件：${indexPath}`);
    console.log(`🔗 访问链接：file:///${indexPath.replace(/\\/g, '/')}\n`);

    return {
      success: true,
      indexPath,
      reportCounts: {
        daily: reportsData.daily.length,
        weekly: reportsData.weekly.length,
        monthly: reportsData.monthly.length
      }
    };
  } catch (error) {
    console.error('\n❌ 首页生成失败:', error.message);
    console.error(error.stack);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 收集所有报告数据
 */
function collectReportsData() {
  const dataDir = path.join(process.cwd(), 'data', 'briefs');
  const reportsData = {
    daily: [],
    weekly: [],
    monthly: []
  };

  // 收集日报数据
  const dailyDir = path.join(dataDir, 'daily');
  if (fs.existsSync(dailyDir)) {
    const dailyFiles = fs.readdirSync(dailyDir)
      .filter(f => f.startsWith('data-') && f.endsWith('.json'))
      .sort(); // 按日期排序
    
    dailyFiles.forEach(file => {
      const filePath = path.join(dailyDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      reportsData.daily.push({
        date: data.date,
        projectCount: data.projects?.length || 0,
        aiProjectCount: data.projects?.filter(p => p.isAI).length || 0,
        avgStars: calculateAvgStars(data.projects),
        projects: data.projects || []
      });
    });
  }

  // 收集周报数据
  const weeklyDir = path.join(dataDir, 'weekly');
  if (fs.existsSync(weeklyDir)) {
    const weeklyFiles = fs.readdirSync(weeklyDir)
      .filter(f => f.startsWith('data-weekly-') && f.endsWith('.json'))
      .sort();
    
    weeklyFiles.forEach(file => {
      const filePath = path.join(weeklyDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      // 从文件名提取周数（data-weekly-2026-W11.json → 2026-W11）
      const weekMatch = file.match(/data-weekly-(\d{4}-W\d{2})\.json/);
      const week = weekMatch ? weekMatch[1] : (data.week || data.date);
      
      reportsData.weekly.push({
        week,
        projectCount: data.projects?.length || 0,
        avgStars: calculateAvgStars(data.projects),
        theme: data.aiInsights?.weeklyTheme || '',
        projects: data.projects || []
      });
    });
  }

  // 收集月报数据
  const monthlyDir = path.join(dataDir, 'monthly');
  if (fs.existsSync(monthlyDir)) {
    const monthlyFiles = fs.readdirSync(monthlyDir)
      .filter(f => f.startsWith('data-') && f.endsWith('.json'))
      .sort();
    
    monthlyFiles.forEach(file => {
      const filePath = path.join(monthlyDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      reportsData.monthly.push({
        month: data.date || data.month,
        projectCount: data.projects?.length || 0,
        avgStars: calculateAvgStars(data.projects),
        projects: data.projects || []
      });
    });
  }

  return reportsData;
}

/**
 * 计算平均 Stars
 */
function calculateAvgStars(projects) {
  if (!projects || projects.length === 0) return '0';
  
  const total = projects.reduce((sum, p) => {
    const stars = typeof p.stars === 'number' ? p.stars : parseInt(p.stars) || 0;
    return sum + stars;
  }, 0);
  
  const avg = Math.round(total / projects.length);
  return avg >= 1000 ? `${(avg / 1000).toFixed(1)}k` : avg.toString();
}

/**
 * 生成首页 HTML
 */
function generateIndexHTML(reportsData) {
  const latestDaily = reportsData.daily[reportsData.daily.length - 1] || {};
  const latestWeekly = reportsData.weekly[reportsData.weekly.length - 1] || {};
  const latestMonthly = reportsData.monthly[reportsData.monthly.length - 1] || {};

  // 合并所有项目
  const allProjects = [
    ...(latestDaily.projects || []),
    ...(latestWeekly.projects || []),
    ...(latestMonthly.projects || [])
  ];

  // 去重（按 repo 名称）
  const uniqueProjects = Array.from(
    new Map(allProjects.map(p => [p.repo, p])).values()
  );

  // 按 Stars 排序，取 Top 10
  const topProjects = uniqueProjects
    .sort((a, b) => (b.stars || 0) - (a.stars || 0))
    .slice(0, 10);

  // 统计信息
  const totalReports = reportsData.daily.length + reportsData.weekly.length + reportsData.monthly.length;
  const totalProjects = uniqueProjects.length;
  const aiProjects = uniqueProjects.filter(p => p.isAI).length;
  const aiPercentage = totalProjects > 0 ? Math.round((aiProjects / totalProjects) * 100) : 0;
  
  // 计算所有项目的平均 Stars
  const allStars = uniqueProjects.map(p => p.stars || 0);
  const avgStarsAll = allStars.length > 0 
    ? Math.round(allStars.reduce((a, b) => a + b, 0) / allStars.length)
    : 0;
  const avgStarsDisplay = avgStarsAll >= 1000 ? `${(avgStarsAll / 1000).toFixed(1)}k` : avgStarsAll.toString();

  // 项目类型统计
  const typeStats = {};
  uniqueProjects.forEach(p => {
    const type = p.analysis?.type || 'other';
    const typeName = p.analysis?.typeName || '其他';
    if (!typeStats[type]) {
      typeStats[type] = { name: typeName, count: 0 };
    }
    typeStats[type].count++;
  });

  // 编程语言统计
  const langStats = {};
  uniqueProjects.forEach(p => {
    const lang = p.language || 'Unknown';
    langStats[lang] = (langStats[lang] || 0) + 1;
  });

  // 生成项目榜单 HTML
  const topProjectsHTML = topProjects.map((project, index) => {
    const starsDisplay = project.stars >= 1000 ? `${(project.stars / 1000).toFixed(1)}k` : project.stars.toString();
    return `
            <div class="project-card" data-search="${project.name} ${project.descZh || ''} ${project.language || ''}">
                <div class="project-header">
                    <span class="project-rank">#${index + 1}</span>
                    <a href="${project.url}" target="_blank" class="project-name">${project.fullName || project.repo}</a>
                </div>
                <div class="project-description">${project.descZh || project.desc || '暂无描述'}</div>
                <div class="project-tags">
                    <span class="tag tag-type">${project.analysis?.typeName || '其他'}</span>
                    <span class="tag tag-lang">${project.language || 'Unknown'}</span>
                    <span class="tag tag-stars">⭐ ${starsDisplay}</span>
                </div>
            </div>`;
  }).join('\n');

  // 生成类型分布 HTML
  const typeStatsHTML = Object.entries(typeStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([type, stat]) => `
                <div class="stat-row">
                    <span class="stat-label">${stat.name}</span>
                    <span class="stat-value">${stat.count} 个</span>
                </div>`).join('');

  // 生成语言分布 HTML
  const langStatsHTML = Object.entries(langStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => `
                <div class="stat-row">
                    <span class="stat-label">${lang}</span>
                    <span class="stat-value">${count} 个</span>
                </div>`).join('');

  // 生成报告历史 HTML
  const dailyHistoryHTML = reportsData.daily.slice(-7).reverse().map(d => `
                <a href="daily/github-ai-trending-${d.date}.html" class="history-link">
                    <span class="history-date">${d.date}</span>
                    <span class="history-count">${d.projectCount} 个项目</span>
                </a>`).join('');

  const weeklyHistoryHTML = reportsData.weekly.slice(-4).reverse().map(w => `
                <a href="weekly/github-weekly-${w.week}.html" class="history-link">
                    <span class="history-date">${w.week}</span>
                    <span class="history-count">${w.projectCount} 个项目</span>
                </a>`).join('');

  const monthlyHistoryHTML = reportsData.monthly.slice(-3).reverse().map(m => `
                <a href="monthly/github-monthly-${m.month.replace('-', '')}.html" class="history-link">
                    <span class="history-date">${m.month}</span>
                    <span class="history-count">${m.projectCount} 个项目</span>
                </a>`).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub AI Trending - 首页</title>
    <link rel="stylesheet" href="../public/css/index.css">
</head>
<body>
    <div class="container">
        <!-- 顶部标题区 -->
        <header>
            <h1>🚀 GitHub AI Trending 洞察系统</h1>
            <p class="subtitle">每日/每周/每月 AI 项目趋势追踪</p>
            <p class="last-update">最后更新：${new Date().toLocaleString('zh-CN')}</p>
        </header>

        <!-- 全局统计卡片 -->
        <section class="stats-section">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${reportsData.daily.length}</div>
                    <div class="stat-label">📅 累计日报</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportsData.weekly.length}</div>
                    <div class="stat-label">📊 累计周报</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportsData.monthly.length}</div>
                    <div class="stat-label">📈 累计月报</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalProjects}</div>
                    <div class="stat-label">🔍 追踪项目</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${aiPercentage}%</div>
                    <div class="stat-label">🤖 AI 占比</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${avgStarsDisplay}</div>
                    <div class="stat-label">⭐ 平均 Stars</div>
                </div>
            </div>
        </section>

        <!-- 报告导航区 -->
        <section class="report-nav-section">
            <h2>📋 报告导航</h2>
            <div class="report-nav-grid">
                <!-- 日报导航 -->
                <div class="report-card daily">
                    <div class="report-header">
                        <h3>📅 最新日报</h3>
                        <span class="report-date">${latestDaily.date || '暂无'}</span>
                    </div>
                    <div class="report-stats">
                        <div class="report-stat">
                            <span class="label">项目数</span>
                            <span class="value">${latestDaily.projectCount || 0}</span>
                        </div>
                        <div class="report-stat">
                            <span class="label">AI 项目</span>
                            <span class="value">${latestDaily.aiProjectCount || 0}</span>
                        </div>
                        <div class="report-stat">
                            <span class="label">平均 Stars</span>
                            <span class="value">${latestDaily.avgStars || '0'}</span>
                        </div>
                    </div>
                    <a href="daily/github-ai-trending-${latestDaily.date || 'latest'}.html" class="report-btn">查看详情</a>
                    <div class="report-history">
                        <h4>最近日报</h4>
                        ${dailyHistoryHTML}
                    </div>
                </div>

                <!-- 周报导航 -->
                <div class="report-card weekly">
                    <div class="report-header">
                        <h3>📊 最新周报</h3>
                        <span class="report-date">${latestWeekly.week || '暂无'}</span>
                    </div>
                    <div class="report-stats">
                        <div class="report-stat">
                            <span class="label">项目数</span>
                            <span class="value">${latestWeekly.projectCount || 0}</span>
                        </div>
                        <div class="report-stat">
                            <span class="label">平均 Stars</span>
                            <span class="value">${latestWeekly.avgStars || '0'}</span>
                        </div>
                    </div>
                    ${latestWeekly.theme ? `<div class="report-theme">主题：${latestWeekly.theme}</div>` : ''}
                    <a href="weekly/github-weekly-${latestWeekly.week}.html" class="report-btn">查看详情</a>
                    <div class="report-history">
                        <h4>最近周报</h4>
                        ${weeklyHistoryHTML}
                    </div>
                </div>

                <!-- 月报导航 -->
                <div class="report-card monthly">
                    <div class="report-header">
                        <h3>📈 最新月报</h3>
                        <span class="report-date">${latestMonthly.month || '暂无'}</span>
                    </div>
                    <div class="report-stats">
                        <div class="report-stat">
                            <span class="label">项目数</span>
                            <span class="value">${latestMonthly.projectCount || 0}</span>
                        </div>
                        <div class="report-stat">
                            <span class="label">平均 Stars</span>
                            <span class="value">${latestMonthly.avgStars || '0'}</span>
                        </div>
                    </div>
                    <a href="monthly/github-monthly-${latestMonthly.month?.replace('-', '') || 'latest'}.html" class="report-btn">查看详情</a>
                    <div class="report-history">
                        <h4>最近月报</h4>
                        ${monthlyHistoryHTML}
                    </div>
                </div>
            </div>
        </section>

        <!-- AI 洞察模块 -->
        <section class="insights-section">
            <h2>🤖 AI 洞察</h2>
            <div class="insights-grid">
                <div class="insight-card">
                    <h3>📊 项目类型分布</h3>
                    ${typeStatsHTML}
                </div>
                <div class="insight-card">
                    <h3>💻 编程语言分布</h3>
                    ${langStatsHTML}
                </div>
                <div class="insight-card">
                    <h3>🔥 最热项目</h3>
                    ${topProjects[0] ? `
                        <div class="hot-project">
                            <div class="hot-project-name">${topProjects[0].fullName || topProjects[0].repo}</div>
                            <div class="hot-project-stars">⭐ ${topProjects[0].stars >= 1000 ? `${(topProjects[0].stars / 1000).toFixed(1)}k` : topProjects[0].stars} Stars</div>
                            <div class="hot-project-type">${topProjects[0].analysis?.typeName || '其他'}</div>
                        </div>
                    ` : '<p>暂无数据</p>'}
                </div>
            </div>
        </section>

        <!-- 趋势图表占位 -->
        <section class="trends-section">
            <h2>📈 趋势分析</h2>
            <div class="trends-placeholder">
                <div class="placeholder-icon">📊</div>
                <div class="placeholder-text">趋势图表功能即将推出</div>
                <div class="placeholder-desc">敬请期待：技术趋势走势、项目增长曲线、领域热度变化</div>
            </div>
        </section>

        <!-- 明星项目榜单 -->
        <section class="top-projects-section">
            <h2>⭐ 明星项目榜单 (Top 10)</h2>
            
            <!-- 搜索框 -->
            <div class="search-container">
                <input type="text" id="searchInput" class="search-input" placeholder="🔍 搜索项目、描述、编程语言...">
            </div>

            <!-- 项目榜单 -->
            <div class="projects-grid" id="projectsGrid">
                ${topProjectsHTML}
            </div>

            <!-- 无搜索结果提示 -->
            <div id="noResults" class="no-results" style="display: none;">
                😕 未找到匹配的项目，请尝试其他关键词
            </div>
        </section>

        <!-- 底部信息 -->
        <footer>
            <p>由 AI 自动生成 · 数据来源 GitHub Trending API</p>
            <p>最后更新：${new Date().toLocaleString('zh-CN')}</p>
        </footer>
    </div>

    <script>
        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        const projectsGrid = document.getElementById('projectsGrid');
        const noResults = document.getElementById('noResults');

        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase().trim();
            const projectCards = projectsGrid.querySelectorAll('.project-card');
            let visibleCount = 0;

            projectCards.forEach(card => {
                const searchText = card.getAttribute('data-search') || '';
                if (searchText.toLowerCase().includes(keyword)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // 显示/隐藏无结果提示
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        });
    </script>
</body>
</html>`;
}

/**
 * 获取周号（辅助函数）
 */
function getWeekNumber(dateStr) {
  const date = new Date(dateStr);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
}

// 执行生成
generateIndex()
  .then(result => {
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n💥 未处理的错误:', error);
    process.exit(1);
  });
