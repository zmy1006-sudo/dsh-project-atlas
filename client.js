window.__ModuleLoader__.load({
  id: 'dsh-project-atlas',
  factory: (require) => {
    const React = require('react');
    const h = React.createElement;
    const { useState, useEffect, useMemo } = React;

    /** 插件命名空间：i18n 注册与侧栏面板 id 共用。 */
    const NS = 'dsh-project-atlas';
    /** 侧栏图标 id，同时也是 main 面板的 key。 */
    const PANEL_ID = 'project-atlas';
    const VIEW_KEY = 'dsh.project-atlas.view.v1';
    const SIZE_KEY = 'dsh.project-atlas.size.v1';

    /**
     * 五套类型色：soft 用于填充与光晕，light / dark 是两套主题下的文字与描边色。
     * 只允许写死这一组十六进制，容器、文字、边框一律走宿主主题变量。
     */
    const TONES = {
      blue: { soft: '#4C8DFF', light: '#2563EB', dark: '#8FBBFF' },
      mint: { soft: '#22C58B', light: '#0A7D5A', dark: '#4EDDA5' },
      peach: { soft: '#FF9A4D', light: '#C2570A', dark: '#FFAE70' },
      violet: { soft: '#9B7BFF', light: '#6D3BD8', dark: '#B79BFF' },
      sand: { soft: '#E0B749', light: '#8F6A12', dark: '#E8C56B' },
    };

    const CATEGORIES = [
      { id: 'model', tone: 'violet' },
      { id: 'web', tone: 'blue' },
      { id: 'deck', tone: 'peach' },
      { id: 'plugin', tone: 'mint' },
      { id: 'viz', tone: 'sand' },
    ];

    /** 每类一个 24×24 线性图标（stroke 继承 currentColor）。 */
    const GLYPHS = {
      model: ['M4 17.5 9.4 11l3.4 3.3L19.6 6', 'M15.6 6h4v4'],
      web: ['M9.4 8.2 5.6 12l3.8 3.8', 'M14.6 8.2 18.4 12l-3.8 3.8', 'M13.2 6.4l-2.4 11.2'],
      deck: ['M3.6 5.6h16.8v9.8H3.6z', 'M12 15.4v3.2', 'M8.6 19.4h6.8'],
      plugin: ['M8.4 4.2v3.4', 'M15.6 4.2v3.4', 'M6.2 7.6h11.6v4.2a5.2 5.2 0 0 1-5.2 5.2h-1.2a5.2 5.2 0 0 1-5.2-5.2z', 'M12 17v2.6'],
      viz: ['M7.4 19.4V12', 'M12 19.4V6.6', 'M16.6 19.4v-5.2', 'M4.8 19.4h14.4'],
    };

    /**
     * 演示数据：全部为通用示例，不含任何个人信息。
     * 想换成自己的项目，直接改这个数组即可（字段见 README）。
     */
    const PROJECTS = [
      {
        id: 'daily-brief',
        category: 'plugin',
        date: '2025-11-18',
        title: '晨间简报：侧栏待办与日历汇总',
        path: 'daily-brief/',
        summary: '在侧栏做一页当天待办：分时段排布、勾选完成、随手备注，并把日历里的事件同步进来，让开工第一眼就看到今天要做什么。',
        hours: 14,
        cost: 76,
        plans: ['重复日程参与同步，避免误改整个系列', '把当天简报导出成 Markdown', '侧栏收窄到 420px 时的排版再收一版'],
      },
      {
        id: 'skill-map',
        category: 'plugin',
        date: '2025-10-24',
        title: '技能清单：本机技能来源梳理',
        path: 'skill-map/',
        summary: '扫描本机会话记录，汇总每个技能的来源、加载次数与会话连线，并给低频技能做一个可恢复的回收站，用来收拾越攒越多的技能。',
        hours: 11.5,
        cost: 58,
        plans: ['使用趋势按周聚合，而不是只给一个总数', '回收站支持按时间批量恢复', '补上调用维度的统计口径说明'],
      },
      {
        id: 'style-compare',
        category: 'viz',
        date: '2025-10-02',
        title: '风格对照页：五种视觉语言实测',
        path: 'style-compare/',
        summary: '用同一份内容做 flat、glass、neumorph、neon、material 五种落地页，逐风格截图对比，确认同一套排版换皮之后的可读性差异。',
        hours: 4.5,
        cost: 19,
        plans: ['把五种风格拆成可切换的主题变量', '补一版移动端断点'],
      },
      {
        id: 'quarter-deck',
        category: 'deck',
        date: '2025-07-16',
        title: '季度复盘材料：模板重建与图表重绘',
        path: 'quarter-deck/',
        summary: '重建四十余页汇报稿：统一母版，重画图表与图标资产，再逐页渲染 PNG 与源文件对照，修掉错位与文字溢出。',
        hours: 22,
        cost: 118,
        plans: ['图表数据改为从表格文件直接读取', '输出一版 16:9 之外的打印比例', '给非技术同事补一份改稿说明'],
      },
      {
        id: 'forecast-web',
        category: 'web',
        date: '2025-10-14',
        title: '预测工作台：把命令行模型包成网页',
        path: 'forecast-web/',
        summary: '把命令行里的时序预测模型包成可用 Web 应用：预测、批量、回测、诊断、历史五个页面，后端按服务拆分，图表库本地托管，不依赖外网。',
        hours: 34,
        cost: 178,
        plans: ['回测与预测共用一套推理缓存', '后端补上鉴权，目前只适合本机运行', '页面状态写进 URL，刷新不丢参数'],
      },
      {
        id: 'forecast-demo',
        category: 'viz',
        date: '2025-09-08',
        title: '单页演示站：把预测结果讲清楚',
        path: 'forecast-demo/',
        summary: '一页静态站点，用预测曲线和结论卡片把模型效果讲给不看代码的人；脚本定时重跑预测并更新页面数据。',
        hours: 6,
        cost: 24,
        plans: ['预测更新改成增量，避免每次全量重算', '加大字号与对比度，适配投影场景'],
      },
      {
        id: 'forecast-model',
        category: 'model',
        date: '2025-08-26',
        title: '时序预测模型：微调与回测',
        path: 'forecast-model/',
        summary: '在本机跑通一个开源时序模型：拉日线与分钟线数据做微调，补上批量预测与历史回测脚本，并把结果整理成可对比的分析报告。',
        hours: 18.5,
        cost: 96,
        plans: ['胜率、最大回撤等指标固化成报告模板', '多标的并行推理，缩短批量预测时间', '补一份数据预处理与微调的中文说明'],
      },
    ];

    /** 档案编号：按 PROJECTS 顺序生成 01 起，筛选时保持不变。 */
    const PROJECT_NO = new Map(
      PROJECTS.map((project, index) => [project.id, String(index + 1).padStart(2, '0')]),
    );
    /** 标签的轻微倾斜，让一列标签像手贴上去的，悬停时摆正。 */
    const TILTS = [-0.7, 0.55, -0.45, 0.8, -0.6, 0.5, -0.35];

    function projectTilt(project) {
      const index = PROJECTS.findIndex((item) => item.id === project.id);
      return TILTS[(index < 0 ? 0 : index) % TILTS.length] + 'deg';
    }

    const zh = {
      'panel.eyebrow': 'DSH · 项目档案',
      'panel.title': '项目档案',
      'panel.subtitle': '最近完成的 {count} 个项目 · 悬停标签展开细节',
      'stat.projects': '项目',
      'stat.hours': '累计工时',
      'stat.cost': '累计成本',
      'stat.plans': '待完善',
      'unit.hours': '小时',
      'cost.format': '¥{value}',
      'filter.all': '全部',
      'field.hours': '花费时间',
      'field.cost': '费用成本',
      'field.plans': '后期待完善',
      'field.path': '项目目录',
      'metric.plans': '待完善 {count}',
      'toolbar.total': '当前 {count} 个项目',
      'view.grid': '网格视图',
      'view.list': '列表视图',
      'size.label': '标签大小',
      'size.s': '小',
      'size.m': '中',
      'size.l': '大',
      'empty.title': '这个类型还没有项目',
      'empty.body': '换一个筛选，或把新项目补进数据里。',
      'foot.note': '示例数据 · 改 client.js 里的 PROJECTS 就换成你自己的项目',
      'cat.model': '数据与模型',
      'cat.web': 'Web 应用',
      'cat.deck': '文档与演示',
      'cat.plugin': '插件与工具',
      'cat.viz': '可视化',
    };

    const en = {
      'panel.eyebrow': 'DSH · PROJECT ATLAS',
      'panel.title': 'Project Atlas',
      'panel.subtitle': '{count} recent projects · hover a tag for details',
      'stat.projects': 'Projects',
      'stat.hours': 'Hours',
      'stat.cost': 'Cost',
      'stat.plans': 'Open items',
      'unit.hours': 'h',
      'cost.format': '¥{value}',
      'filter.all': 'All',
      'field.hours': 'Time spent',
      'field.cost': 'Cost',
      'field.plans': 'Next steps',
      'field.path': 'Directory',
      'metric.plans': '{count} to do',
      'toolbar.total': '{count} shown',
      'view.grid': 'Grid view',
      'view.list': 'List view',
      'size.label': 'Tag size',
      'size.s': 'S',
      'size.m': 'M',
      'size.l': 'L',
      'empty.title': 'No projects of this type yet',
      'empty.body': 'Pick another filter, or add the new project to the data.',
      'foot.note': 'Sample data · edit PROJECTS in client.js to use your own records',
      'cat.model': 'Data & models',
      'cat.web': 'Web apps',
      'cat.deck': 'Docs & decks',
      'cat.plugin': 'Plugins & tooling',
      'cat.viz': 'Visualization',
    };

    const CSS = `
      .dpa-root { position: relative; display: block; width: 100%; height: 100%; overflow: auto; container-type: inline-size; container-name: atlas; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-base); font-family: inherit; }
      .dpa-root *, .dpa-root *::before, .dpa-root *::after { box-sizing: border-box; }
      .dpa-wrap { max-width: 1140px; margin: 0 auto; padding: 26px 26px 64px; }

      .dpa-hero { position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap; padding: 19px 21px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 18px; background: var(--dsw-alias-bg-layer-1); }
      .dpa-hero::before { content: ''; position: absolute; inset: -120px -80px auto -80px; height: 260px; background: radial-gradient(60% 100% at 18% 0%, rgba(155,123,255,.24), transparent 60%), radial-gradient(50% 90% at 55% 0%, rgba(76,141,255,.2), transparent 62%), radial-gradient(45% 80% at 88% 0%, rgba(34,197,139,.2), transparent 64%); pointer-events: none; }
      .dpa-head { position: relative; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
      .dpa-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--dsw-alias-label-secondary); }
      .dpa-title { margin: 0; font-size: 24px; line-height: 1.2; font-weight: 700; letter-spacing: -.022em; }
      .dpa-sub { font-size: 12.5px; color: var(--dsw-alias-label-secondary); }
      .dpa-stats { position: relative; display: flex; align-items: stretch; gap: 9px; flex-wrap: wrap; }
      .dpa-stat { min-width: 88px; display: flex; flex-direction: column; gap: 3px; padding: 8px 12px 9px; border: 1px solid var(--dpaStatBorder); border-radius: 13px; background: var(--dpaStatTint); transition: transform .16s ease, box-shadow .16s ease; }
      .dpa-stat:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -14px var(--dpaStatColor); }
      .dpa-statValue { font-size: 17px; font-weight: 700; letter-spacing: -.02em; color: var(--dpaStatColor); font-variant-numeric: tabular-nums; }
      .dpa-statLabel { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--dsw-alias-label-secondary); white-space: nowrap; }
      .dpa-statIcon { display: inline-flex; color: var(--dpaStatColor); opacity: .9; }

      .dpa-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin: 18px 0 14px; }
      .dpa-filters { display: flex; flex-wrap: wrap; gap: 7px; }
      .dpa-tools { display: flex; align-items: center; gap: 8px; }
      .dpa-total { font-size: 11.5px; color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; white-space: nowrap; }

      .dpa-chip { display: inline-flex; align-items: center; gap: 7px; height: 31px; padding: 0 12px 0 10px; border: 1px solid var(--dpaChipBorder); border-radius: 999px; background: var(--dpaChipTint); color: var(--dpaChipColor); font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: transform .14s ease, background .14s ease, color .14s ease, border-color .14s ease, box-shadow .14s ease; }
      .dpa-chip:hover { transform: translateY(-1px); box-shadow: 0 4px 12px -6px var(--dpaChipShadow); }
      .dpa-chip:active { transform: scale(.97); }
      .dpa-chip[aria-pressed="true"] { background: var(--dpaChipColor); border-color: var(--dpaChipColor); color: var(--dpaChipOn); box-shadow: 0 7px 18px -7px var(--dpaChipShadow); }
      .dpa-dot { width: 7px; height: 7px; flex: none; border-radius: 50%; background: var(--dpaChipColor); }
      .dpa-chip[aria-pressed="true"] .dpa-dot { background: var(--dpaChipOn); }
      .dpa-chipCount { font-size: 11px; font-variant-numeric: tabular-nums; opacity: .72; }

      .dpa-seg { position: relative; display: inline-flex; align-items: center; padding: 2px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; background: var(--dsw-alias-bg-layer-2); transition: opacity .18s ease; }
      .dpa-segOff { opacity: .42; pointer-events: none; }
      .dpa-segThumb { position: absolute; top: 2px; bottom: 2px; left: 2px; width: calc((100% - 4px) / var(--segCount)); border-radius: 8px; background: var(--dsw-alias-bg-base); box-shadow: 0 1px 3px rgba(0,0,0,.14); transform: translateX(calc(var(--segIndex) * 100%)); transition: transform .26s cubic-bezier(.22,.8,.36,1); }
      .dpa-segBtn { position: relative; z-index: 1; display: inline-flex; align-items: center; justify-content: center; gap: 4px; min-width: 34px; height: 26px; padding: 0 8px; border: 0; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 11.5px; font-weight: 600; cursor: pointer; transition: color .16s ease; }
      .dpa-segBtn[aria-pressed="true"] { color: var(--dsw-alias-label-primary); }
      .dpa-segBtn:hover { color: var(--dsw-alias-label-primary); }
      .dpa-segBtn:active { transform: scale(.94); }

      @keyframes dpaIn { from { opacity: 0; transform: translateY(12px) rotate(var(--tilt, 0deg)) scale(.97); } to { opacity: 1; transform: rotate(var(--tilt, 0deg)); } }
      @keyframes dpaRowIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

      .dpa-grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(min(var(--cardMin, 320px), 100%), 1fr)); align-items: start; }
      .dpa-grid.dpaSizeS { --cardMin: 246px; --cardMinH: 46px; --cardPad: 9px 13px; --titleSize: 14px; --titleClamp: 1; }
      .dpa-grid.dpaSizeM { --cardMin: 318px; --cardMinH: 58px; --cardPad: 10px 15px; --titleSize: 15px; --titleClamp: 2; }
      .dpa-grid.dpaSizeL { --cardMin: 396px; --cardMinH: 66px; --cardPad: 12px 17px; --titleSize: 16.5px; --titleClamp: 2; }
      .dpa-grid.dpaSizeS .dpa-summary { -webkit-line-clamp: 1; }
      .dpa-grid.dpaSizeL .dpa-summary { -webkit-line-clamp: 3; }

      .dpa-card { position: relative; display: flex; flex-direction: column; justify-content: center; min-height: var(--cardMinH, 58px); overflow: hidden; padding: var(--cardPad, 10px 15px); border: 1px solid var(--dpaRing); border-radius: 999px; background: var(--dsw-alias-bg-layer-1); outline: none; transform: rotate(var(--tilt, 0deg)); animation: dpaIn .3s cubic-bezier(.22,.8,.36,1) backwards; animation-delay: calc(var(--i, 0) * 26ms); transition: transform .2s cubic-bezier(.22,.8,.36,1), box-shadow .2s ease, border-color .2s ease, border-radius .26s cubic-bezier(.22,.8,.36,1); }
      .dpa-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, var(--dpaTint), transparent 72%); opacity: .75; transition: opacity .22s ease; pointer-events: none; }
      .dpa-card:hover::before, .dpa-card:focus-visible::before { opacity: 1; }
      .dpa-card:hover, .dpa-card:focus-visible { transform: translateY(-3px) rotate(0deg); border-color: var(--dpaRing); border-radius: 16px; box-shadow: 0 20px 38px -18px var(--dpaGlow), 0 0 0 1px var(--dpaRing); }
      .dpa-card:focus-visible { outline: 2px solid var(--dpaAccent); outline-offset: 2px; }
      .dpa-tag { position: relative; display: flex; align-items: center; gap: 9px; }
      .dpa-no { flex: none; font: 600 10.5px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: .06em; color: var(--dpaAccent); opacity: .72; font-variant-numeric: tabular-nums; }
      .dpa-cardTitle { flex: 1 1 auto; min-width: 0; margin: 0; font-size: var(--titleSize, 15px); font-weight: 650; line-height: 1.42; letter-spacing: -.006em; display: -webkit-box; -webkit-line-clamp: var(--titleClamp, 2); -webkit-box-orient: vertical; overflow: hidden; }
      .dpa-hint { flex: none; display: inline-flex; color: var(--dpaAccent); opacity: .4; transition: transform .22s cubic-bezier(.22,.8,.36,1), opacity .18s ease; }
      .dpa-card:hover .dpa-hint, .dpa-card:focus-visible .dpa-hint { transform: rotate(180deg); opacity: .95; }
      .dpa-logo { flex: none; width: 25px; height: 25px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; color: #fff; background: linear-gradient(150deg, var(--dpaSoft), var(--dpaDeep)); box-shadow: 0 5px 12px -6px var(--dpaGlow); transition: transform .24s cubic-bezier(.22,.8,.36,1), box-shadow .24s ease; }
      .dpa-card:hover .dpa-logo, .dpa-card:focus-visible .dpa-logo { transform: rotate(-10deg) scale(1.1); box-shadow: 0 8px 18px -7px var(--dpaGlow); }

      .dpa-detail { position: relative; max-height: 0; opacity: 0; overflow: hidden; transition: max-height .28s cubic-bezier(.22,.8,.36,1), opacity .2s ease, margin-top .28s ease; }
      .dpa-card:hover .dpa-detail, .dpa-card:focus-visible .dpa-detail { max-height: 380px; opacity: 1; margin-top: 12px; }
      .dpa-detailHead { position: relative; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .dpa-badge { display: inline-flex; align-items: center; height: 21px; padding: 0 8px; border-radius: 999px; background: var(--dpaTint); color: var(--dpaAccent); font-size: 11px; font-weight: 700; }
      .dpa-date { margin-left: auto; font-size: 10.8px; color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; white-space: nowrap; }
      .dpa-summary { margin: 9px 0 0; font-size: 12.3px; line-height: 1.6; color: var(--dsw-alias-label-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .dpa-metrics { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
      .dpa-metric { display: inline-flex; align-items: center; gap: 5px; font-size: 10.8px; color: var(--dsw-alias-label-secondary); }
      .dpa-metricIcon { display: inline-flex; color: var(--dpaAccent); }
      .dpa-metricValue { font-size: 13.5px; font-weight: 700; letter-spacing: -.015em; font-variant-numeric: tabular-nums; color: var(--dpaAccent); }
      .dpa-plansPill { margin-left: auto; display: inline-flex; align-items: center; height: 21px; padding: 0 8px; border-radius: 999px; background: var(--dpaTint); color: var(--dpaAccent); font-size: 10.5px; font-weight: 700; white-space: nowrap; }
      .dpa-path { display: flex; align-items: center; gap: 5px; margin-top: 9px; font-size: 10.5px; color: var(--dsw-alias-label-secondary); }
      .dpa-pathIcon { display: inline-flex; flex: none; opacity: .8; }
      .dpa-pathText { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .dpa-detailTitle { display: flex; align-items: center; gap: 6px; margin-top: 9px; padding-top: 9px; border-top: 1px dashed var(--dsw-alias-border-l1); font-size: 10.5px; font-weight: 700; letter-spacing: .03em; color: var(--dsw-alias-label-secondary); }
      .dpa-detailIcon { display: inline-flex; color: var(--dpaAccent); }
      .dpa-detail ul, .dpa-rowDetail ul { display: flex; flex-direction: column; gap: 5px; margin: 7px 0 2px; padding: 0; list-style: none; }
      .dpa-detail li, .dpa-rowDetail li { position: relative; padding-left: 13px; font-size: 11.8px; line-height: 1.55; color: var(--dsw-alias-label-primary); }
      .dpa-detail li::before, .dpa-rowDetail li::before { content: ''; position: absolute; left: 2px; top: 6.4px; width: 5px; height: 5px; border-radius: 50%; background: var(--dpaAccent); opacity: .8; }

      .dpa-list { display: flex; flex-direction: column; gap: 8px; }
      .dpa-row { position: relative; display: grid; grid-template-columns: auto auto minmax(0, 1fr) auto; align-items: center; gap: 9px; padding: 8px 14px 8px 12px; border: 1px solid var(--dpaRing); border-radius: 999px; background: linear-gradient(100deg, var(--dpaTint), var(--dsw-alias-bg-layer-1) 58%); outline: none; overflow: hidden; animation: dpaRowIn .26s cubic-bezier(.22,.8,.36,1) backwards; animation-delay: calc(var(--i, 0) * 20ms); transition: transform .2s cubic-bezier(.22,.8,.36,1), border-color .18s ease, box-shadow .18s ease, border-radius .26s cubic-bezier(.22,.8,.36,1); }
      .dpa-row:hover, .dpa-row:focus-visible { transform: translateY(-1px); border-radius: 14px; box-shadow: 0 14px 28px -20px var(--dpaGlow), 0 0 0 1px var(--dpaRing); }
      .dpa-row:focus-visible { outline: 2px solid var(--dpaAccent); outline-offset: 2px; }
      .dpa-row .dpa-logo { width: 22px; height: 22px; border-radius: 7px; }
      .dpa-rowNo { font-size: 10px; }
      .dpa-rowTitle { min-width: 0; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13.5px; font-weight: 650; letter-spacing: -.005em; }
      .dpa-rowHint { align-self: center; }
      .dpa-row:hover .dpa-rowHint, .dpa-row:focus-visible .dpa-rowHint { transform: rotate(180deg); opacity: .95; }
      .dpa-rowDetail { grid-column: 1 / -1; max-height: 0; opacity: 0; overflow: hidden; transition: max-height .28s cubic-bezier(.22,.8,.36,1), opacity .2s ease, margin-top .28s ease; }
      .dpa-row:hover .dpa-rowDetail, .dpa-row:focus-visible .dpa-rowDetail { max-height: 320px; opacity: 1; margin-top: 9px; }
      .dpa-rowDetailInner { padding-top: 9px; border-top: 1px dashed var(--dsw-alias-border-l1); }
      .dpa-rowDetail .dpa-detailHead { gap: 9px; }
      .dpa-rowDetail .dpa-plansPill { margin-left: 0; }
      .dpa-rowSummary { margin-top: 8px; -webkit-line-clamp: 2; }
      .dpa-rowDate { font-size: 10.8px; color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; white-space: nowrap; }
      .dpa-rowMeta { display: inline-flex; align-items: center; gap: 10px; font-size: 11px; font-variant-numeric: tabular-nums; white-space: nowrap; }
      .dpa-rowDetail .dpa-rowMeta { margin-left: auto; }
      .dpa-rowMetaItem { display: inline-flex; align-items: center; gap: 4px; color: var(--dsw-alias-label-secondary); }
      .dpa-rowMetaValue { font-weight: 700; color: var(--dpaAccent); }

      .dpa-empty { display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 44px 18px; border: 1px dashed var(--dsw-alias-border-l2); border-radius: 16px; text-align: center; color: var(--dsw-alias-label-secondary); animation: dpaIn .3s ease backwards; }
      .dpa-emptyIcon { display: inline-flex; color: var(--dsw-alias-brand-primary); opacity: .85; }
      .dpa-emptyTitle { color: var(--dsw-alias-label-primary); font-size: 13.5px; font-weight: 600; }
      .dpa-emptyBody { font-size: 12.3px; }
      .dpa-foot { margin: 24px 0 0; font-size: 11.2px; line-height: 1.6; color: var(--dsw-alias-label-secondary); text-align: center; }

      @container atlas (max-width: 760px) {
        .dpa-wrap { padding: 20px 14px 56px; }
        .dpa-title { font-size: 21px; }
        .dpa-stats { width: 100%; }
        .dpa-stat { flex: 1 1 0; min-width: 0; }
        .dpa-toolbar { align-items: flex-start; }
        .dpa-rowDetail .dpa-date { display: none; }
      }
      @container atlas (max-width: 620px) {
        .dpa-rowDetail .dpa-badge, .dpa-rowDetail .dpa-rowMeta { display: none; }
        .dpa-segBtn { padding: 0 6px; }
      }
      @media (hover: none) {
        .dpa-hint { display: none; }
        .dpa-card { border-radius: 16px; }
        .dpa-row { border-radius: 14px; }
        .dpa-detail { max-height: 380px; opacity: 1; margin-top: 12px; }
        .dpa-rowDetail { max-height: 320px; opacity: 1; margin-top: 9px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .dpa-card, .dpa-row, .dpa-logo, .dpa-hint, .dpa-detail, .dpa-rowDetail, .dpa-chip, .dpa-stat, .dpa-segThumb, .dpa-segBtn, .dpa-empty { animation: none; transition: none; }
        .dpa-card, .dpa-row { transform: none; }
        .dpa-card:hover, .dpa-card:focus-visible, .dpa-row:hover, .dpa-row:focus-visible, .dpa-chip:hover, .dpa-stat:hover { transform: none; }
      }
    `;

    function channels(hex) {
      const raw = String(hex).replace('#', '');
      const full = raw.length === 3 ? raw.split('').map((part) => part + part).join('') : raw;
      const value = Number.parseInt(full, 16);
      return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
    }

    function rgba(hex, alpha) {
      const { r, g, b } = channels(hex);
      return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    }

    /** 加深：图标块渐变要保证白色图形始终清晰。 */
    function darken(hex, amount) {
      const { r, g, b } = channels(hex);
      const mix = (value) =>
        Math.round(value * (1 - amount))
          .toString(16)
          .padStart(2, '0');
      return '#' + mix(r) + mix(g) + mix(b);
    }

    function formatNumber(value) {
      return Number.isInteger(value) ? String(value) : String(Math.round(value * 10) / 10);
    }

    function readPref(key, fallback) {
      try {
        const value = window.localStorage.getItem(key);
        return value || fallback;
      } catch {
        return fallback;
      }
    }

    function writePref(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        /* 隐私模式或禁用存储时静默降级 */
      }
    }

    function icon(size, paths, strokeWidth) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: strokeWidth || 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': true,
          focusable: 'false',
          style: { display: 'block' },
        },
        paths.map((d, index) => h('path', { key: index, d })),
      );
    }

    const clockIcon = (size) => icon(size, ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 7.6V12l3 1.9']);
    const coinIcon = (size) =>
      icon(size, ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M9.1 8.5 12 11.9l2.9-3.4', 'M12 11.9v4.4', 'M9.6 13.7h4.8']);
    const flagIcon = (size) => icon(size, ['M6 20V4.6', 'M6 5h11.4l-2.3 3.7 2.3 3.7H6']);
    const folderIcon = (size) =>
      icon(size, ['M3.6 7.4a2 2 0 0 1 2-2h2.9l1.7 2.1h6.2a2 2 0 0 1 2 2v7.7a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2z']);
    const chevronIcon = (size) => icon(size, ['M6.5 9.5 12 15l5.5-5.5'], 2.2);
    const gridIcon = (size) =>
      icon(size, ['M4.5 4.5h6v6h-6z', 'M13.5 4.5h6v6h-6z', 'M4.5 13.5h6v6h-6z', 'M13.5 13.5h6v6h-6z'], 1.6);
    const listIcon = (size) => icon(size, ['M4 7h16', 'M4 12h16', 'M4 17h10'], 1.8);
    const archiveIcon = (size) =>
      icon(size, ['M4 7.6h16', 'M4.6 7.6h14.8v10.6a2 2 0 0 1-2 2H6.6a2 2 0 0 1-2-2z', 'M9.6 11.8h4.8']);

    /** 每个标签的色调变量，深浅主题各取一套文字色。 */
    function toneStyle(tone, mode) {
      const accent = mode === 'dark' ? tone.dark : tone.light;
      return {
        '--dpaAccent': accent,
        '--dpaSoft': tone.soft,
        '--dpaDeep': darken(accent, 0.22),
        '--dpaTint': rgba(tone.soft, mode === 'dark' ? 0.2 : 0.14),
        '--dpaRing': rgba(tone.soft, mode === 'dark' ? 0.5 : 0.42),
        '--dpaGlow': rgba(tone.soft, 0.32),
      };
    }

    const Stat = ({ label, value, color, glyph }) =>
      h(
        'div',
        {
          className: 'dpa-stat',
          style: {
            '--dpaStatColor': color,
            '--dpaStatTint': rgba(color, 0.1),
            '--dpaStatBorder': rgba(color, 0.22),
          },
        },
        h('div', { className: 'dpa-statValue' }, value),
        h(
          'div',
          { className: 'dpa-statLabel' },
          h('span', { className: 'dpa-statIcon' }, glyph(11)),
          h('span', null, label),
        ),
      );

    function Seg({ className, value, options, onChange, label }) {
      const index = Math.max(0, options.findIndex((option) => option.value === value));
      return h(
        'div',
        {
          className: 'dpa-seg' + (className ? ' ' + className : ''),
          role: 'group',
          'aria-label': label,
          style: { '--segCount': options.length, '--segIndex': index },
        },
        h('span', { className: 'dpa-segThumb', 'aria-hidden': true }),
        options.map((option) =>
          h(
            'button',
            {
              key: option.value,
              type: 'button',
              className: 'dpa-segBtn',
              title: option.title,
              'aria-label': option.title,
              'aria-pressed': value === option.value ? 'true' : 'false',
              onClick: () => onChange(option.value),
            },
            option.icon ? option.icon(12) : null,
            option.text ? h('span', null, option.text) : null,
          ),
        ),
      );
    }

    function PlanList({ project, t }) {
      return h(
        'div',
        null,
        h(
          'div',
          { className: 'dpa-detailTitle' },
          h('span', { className: 'dpa-detailIcon' }, flagIcon(11)),
          h('span', null, t('field.plans')),
        ),
        h(
          'ul',
          null,
          project.plans.map((plan, index) => h('li', { key: index }, plan)),
        ),
      );
    }

    function ProjectCard({ project, category, t, index, mode }) {
      const tone = TONES[category.tone];
      const no = PROJECT_NO.get(project.id) || '01';
      return h(
        'article',
        {
          className: 'dpa-card',
          tabIndex: 0,
          'aria-label': no + ' ' + project.title,
          title: project.title,
          style: Object.assign(
            { '--i': index, '--tilt': projectTilt(project) },
            toneStyle(tone, mode),
          ),
        },
        h(
          'div',
          { className: 'dpa-tag' },
          h('span', { className: 'dpa-no', 'aria-hidden': true }, no),
          h(
            'span',
            { className: 'dpa-logo', 'aria-hidden': true },
            icon(14, GLYPHS[category.id] || GLYPHS.model, 2.2),
          ),
          h('h2', { className: 'dpa-cardTitle' }, project.title),
          h('span', { className: 'dpa-hint', 'aria-hidden': true }, chevronIcon(11)),
        ),
        h(
          'div',
          { className: 'dpa-detail' },
          h(
            'div',
            { className: 'dpa-detailHead' },
            h('span', { className: 'dpa-badge' }, t('cat.' + category.id)),
            h('time', { className: 'dpa-date', dateTime: project.date }, project.date),
          ),
          h('p', { className: 'dpa-summary' }, project.summary),
          h(
            'div',
            { className: 'dpa-metrics' },
            h(
              'span',
              { className: 'dpa-metric', title: t('field.hours') },
              h('span', { className: 'dpa-metricIcon' }, clockIcon(12)),
              h('span', { className: 'dpa-metricValue' }, formatNumber(project.hours)),
              h('span', null, t('unit.hours')),
            ),
            h(
              'span',
              { className: 'dpa-metric', title: t('field.cost') },
              h('span', { className: 'dpa-metricIcon' }, coinIcon(12)),
              h(
                'span',
                { className: 'dpa-metricValue' },
                t('cost.format', { value: formatNumber(project.cost) }),
              ),
            ),
            h(
              'span',
              { className: 'dpa-plansPill', title: t('field.plans') },
              h('span', null, t('metric.plans', { count: project.plans.length })),
            ),
          ),
          project.path
            ? h(
                'div',
                { className: 'dpa-path', title: t('field.path') + '：' + project.path },
                h('span', { className: 'dpa-pathIcon' }, folderIcon(11)),
                h('span', { className: 'dpa-pathText' }, project.path),
              )
            : null,
          h(PlanList, { project, t }),
        ),
      );
    }

    function ProjectRow({ project, category, t, index, mode }) {
      const tone = TONES[category.tone];
      const no = PROJECT_NO.get(project.id) || '01';
      return h(
        'article',
        {
          className: 'dpa-row',
          tabIndex: 0,
          'aria-label': no + ' ' + project.title,
          title: project.title,
          style: Object.assign({ '--i': index }, toneStyle(tone, mode)),
        },
        h('span', { className: 'dpa-no dpa-rowNo', 'aria-hidden': true }, no),
        h(
          'span',
          { className: 'dpa-logo', 'aria-hidden': true },
          icon(13, GLYPHS[category.id] || GLYPHS.model, 2.2),
        ),
        h('h3', { className: 'dpa-rowTitle' }, project.title),
        h('span', { className: 'dpa-hint dpa-rowHint', 'aria-hidden': true }, chevronIcon(11)),
        h(
          'div',
          { className: 'dpa-rowDetail' },
          h(
            'div',
            { className: 'dpa-rowDetailInner' },
            h(
              'div',
              { className: 'dpa-detailHead' },
              h('span', { className: 'dpa-badge' }, t('cat.' + category.id)),
              h('time', { className: 'dpa-rowDate', dateTime: project.date }, project.date),
              h(
                'span',
                { className: 'dpa-rowMeta' },
                h(
                  'span',
                  { className: 'dpa-rowMetaItem', title: t('field.hours') },
                  clockIcon(12),
                  h('span', { className: 'dpa-rowMetaValue' }, formatNumber(project.hours)),
                  h('span', null, t('unit.hours')),
                ),
                h(
                  'span',
                  { className: 'dpa-rowMetaItem', title: t('field.cost') },
                  coinIcon(12),
                  h(
                    'span',
                    { className: 'dpa-rowMetaValue' },
                    t('cost.format', { value: formatNumber(project.cost) }),
                  ),
                ),
              ),
              h(
                'span',
                { className: 'dpa-plansPill', title: t('field.plans') },
                h('span', null, t('metric.plans', { count: project.plans.length })),
              ),
            ),
            h('p', { className: 'dpa-summary dpa-rowSummary' }, project.summary),
            project.path
              ? h(
                  'div',
                  { className: 'dpa-path', title: t('field.path') + '：' + project.path },
                  h('span', { className: 'dpa-pathIcon' }, folderIcon(11)),
                  h('span', { className: 'dpa-pathText' }, project.path),
                )
              : null,
            h(PlanList, { project, t }),
          ),
        ),
      );
    }

    function EmptyState({ t }) {
      return h(
        'div',
        { className: 'dpa-empty' },
        h('div', { className: 'dpa-emptyIcon' }, archiveIcon(26)),
        h('div', { className: 'dpa-emptyTitle' }, t('empty.title')),
        h('div', { className: 'dpa-emptyBody' }, t('empty.body')),
      );
    }

    const STAT_COLORS = { projects: '#8B6BFF', hours: '#3D7BFF', cost: '#C98A18', plans: '#12A87A' };

    function createPanel(ctx, t) {
      return function ProjectAtlasPanel() {
        const [filter, setFilter] = useState('all');
        const [view, setView] = useState(() => readPref(VIEW_KEY, 'grid'));
        const [size, setSize] = useState(() => readPref(SIZE_KEY, 'm'));
        const [locale, setLocale] = useState(() => ctx.locale.getSnapshot());
        const [mode, setMode] = useState(() => ctx.theme.getTheme().active.colorScheme);

        useEffect(() => ctx.locale.subscribe(() => setLocale(ctx.locale.getSnapshot())), []);
        useEffect(
          () =>
            ctx.on('theme/change', (snapshot) =>
              setMode(snapshot && snapshot.active ? snapshot.active.colorScheme : ctx.theme.getTheme().active.colorScheme),
            ),
          [],
        );
        useEffect(() => writePref(VIEW_KEY, view), [view]);
        useEffect(() => writePref(SIZE_KEY, size), [size]);

        const projects = useMemo(
          () =>
            PROJECTS.slice().sort((a, b) => {
              if (a.date === b.date) return 0;
              return a.date < b.date ? 1 : -1;
            }),
          [],
        );

        const totals = useMemo(() => {
          let hours = 0;
          let cost = 0;
          let plans = 0;
          for (const project of projects) {
            hours += project.hours;
            cost += project.cost;
            plans += project.plans.length;
          }
          return { hours, cost, plans };
        }, [projects]);

        const counts = useMemo(() => {
          const map = {};
          for (const project of projects) map[project.category] = (map[project.category] || 0) + 1;
          return map;
        }, [projects]);

        const categoryOf = (id) => CATEGORIES.find((category) => category.id === id) || CATEGORIES[0];
        const shown =
          filter === 'all' ? projects : projects.filter((project) => project.category === filter);

        function chip(id) {
          const active = filter === id;
          const category = id === 'all' ? null : categoryOf(id);
          const count = id === 'all' ? projects.length : counts[id];
          const tone = category ? TONES[category.tone] : null;
          const accent = tone ? (mode === 'dark' ? tone.dark : tone.light) : null;
          return h(
            'button',
            {
              key: 'chip-' + id,
              type: 'button',
              className: 'dpa-chip',
              'aria-pressed': active ? 'true' : 'false',
              onClick: () => setFilter(id),
              style: category
                ? {
                    '--dpaChipColor': accent,
                    '--dpaChipTint': rgba(tone.soft, mode === 'dark' ? 0.18 : 0.11),
                    '--dpaChipBorder': rgba(tone.soft, 0.3),
                    '--dpaChipShadow': rgba(tone.soft, 0.45),
                    '--dpaChipOn': '#ffffff',
                  }
                : {
                    '--dpaChipColor': 'var(--dsw-alias-brand-primary)',
                    '--dpaChipTint': 'var(--dsw-alias-bg-layer-2)',
                    '--dpaChipBorder': 'var(--dsw-alias-border-l1)',
                    '--dpaChipShadow': 'transparent',
                    '--dpaChipOn': 'var(--dsw-alias-bg-base)',
                  },
            },
            category ? h('span', { className: 'dpa-dot', 'aria-hidden': true }) : null,
            h('span', null, id === 'all' ? t('filter.all') : t('cat.' + id)),
            h('span', { className: 'dpa-chipCount' }, String(count)),
          );
        }

        const viewOptions = [
          { value: 'grid', title: t('view.grid'), icon: gridIcon },
          { value: 'list', title: t('view.list'), icon: listIcon },
        ];
        const sizeOptions = [
          { value: 's', title: t('size.s'), text: 'S' },
          { value: 'm', title: t('size.m'), text: 'M' },
          { value: 'l', title: t('size.l'), text: 'L' },
        ];

        return h(
          'div',
          { className: 'dpa-root', 'data-locale': locale && locale.active ? locale.active : 'zh' },
          h(
            'div',
            { className: 'dpa-wrap' },
            h(
              'section',
              { className: 'dpa-hero' },
              h(
                'div',
                { className: 'dpa-head' },
                h('div', { className: 'dpa-eyebrow' }, t('panel.eyebrow')),
                h('h1', { className: 'dpa-title' }, t('panel.title')),
                h('div', { className: 'dpa-sub' }, t('panel.subtitle', { count: projects.length })),
              ),
              h(
                'div',
                { className: 'dpa-stats' },
                h(Stat, { label: t('stat.projects'), value: String(projects.length), color: STAT_COLORS.projects, glyph: archiveIcon }),
                h(Stat, { label: t('stat.hours'), value: formatNumber(totals.hours), color: STAT_COLORS.hours, glyph: clockIcon }),
                h(Stat, { label: t('stat.cost'), value: '¥' + formatNumber(totals.cost), color: STAT_COLORS.cost, glyph: coinIcon }),
                h(Stat, { label: t('stat.plans'), value: String(totals.plans), color: STAT_COLORS.plans, glyph: flagIcon }),
              ),
            ),
            h(
              'div',
              { className: 'dpa-toolbar' },
              h(
                'div',
                { className: 'dpa-filters' },
                chip('all'),
                CATEGORIES.map((category) => chip(category.id)),
              ),
              h(
                'div',
                { className: 'dpa-tools' },
                h('span', { className: 'dpa-total' }, t('toolbar.total', { count: shown.length })),
                h(Seg, {
                  value: view,
                  options: viewOptions,
                  onChange: setView,
                  label: t('view.grid') + ' / ' + t('view.list'),
                }),
                h(Seg, {
                  className: view === 'list' ? 'dpa-segOff' : '',
                  value: size,
                  options: sizeOptions,
                  onChange: setSize,
                  label: t('size.label'),
                }),
              ),
            ),
            shown.length === 0
              ? h(EmptyState, { t })
              : view === 'grid'
                ? h(
                    'div',
                    { key: 'grid-' + size + '-' + filter, className: 'dpa-grid dpaSize' + size.toUpperCase() },
                    shown.map((project, index) =>
                      h(ProjectCard, {
                        key: project.id,
                        project,
                        category: categoryOf(project.category),
                        t,
                        index,
                        mode,
                      }),
                    ),
                  )
                : h(
                    'div',
                    { key: 'list-' + filter, className: 'dpa-list' },
                    shown.map((project, index) =>
                      h(ProjectRow, {
                        key: project.id,
                        project,
                        category: categoryOf(project.category),
                        t,
                        index,
                        mode,
                      }),
                    ),
                  ),
            h('div', { className: 'dpa-foot' }, t('foot.note')),
          ),
        );
      };
    }

    /** 侧栏图标：一个归档盒 + 编号感的分隔线。 */
    const PanelIcon = () =>
      h(
        'svg',
        {
          width: 18,
          height: 18,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': true,
          focusable: 'false',
        },
        h('path', { d: 'M4 7.6h16' }),
        h('path', { d: 'M5.2 7.6h13.6v10.2a2 2 0 0 1-2 2H7.2a2 2 0 0 1-2-2z' }),
        h('path', { d: 'M9.4 4.4h5.2' }),
        h('path', { d: 'M10 12.4h4' }),
      );

    function apply(ctx) {
      const locale = ctx.locale || ctx.get('locale');
      const slots = ctx.slots || ctx.get('slots');

      locale.register(NS, 'zh', zh);
      locale.register(NS, 'en', en);
      const t = locale.bind(NS);

      ctx.effect(() => {
        const style = document.createElement('style');
        style.id = 'dsh-project-atlas-style';
        style.textContent = CSS;
        document.head.appendChild(style);
        return () => style.remove();
      }, 'project-atlas styles');

      slots.inject('sidebar.panellist', () =>
        slots.register(
          { name: 'sidebar.panellist', id: PANEL_ID, order: 30, label: () => t('panel.title') },
          PanelIcon,
        ),
      );

      slots.inject('main', () =>
        slots.register({ name: 'main', key: PANEL_ID }, createPanel(ctx, t)),
      );
    }

    return { apply, inject: ['slots', 'locale', 'theme'] };
  },
});
