# 项目档案 · Project Atlas

[English](README.md) | 中文

把最近完成的项目做成一面**标签墙**，挂在 DeepSeek Harness 的侧栏里。

每个项目是一枚胶囊标签：`01 → [类型图标] → 标题 → 展开箭头`。标签带一点随机倾斜和类型色渐变，扫一眼就能按颜色分出「数据与模型 / Web 应用 / 文档与演示 / 插件与工具 / 可视化」；鼠标移上去（或键盘 Tab 聚焦）标签会「长开」成一张卡，展开日期、摘要、工时、费用、项目目录和「后期待完善」清单。

## 特性

- **标签式布局**：编号 + 类型色图标 + 标题，收起时只有 46–66px 高，一屏能扫完所有项目。
- **悬停展开**：圆角从 999px 收成 16px、倾斜摆正、上浮 3px，详情在 0.26s 内展开。
- **双视图**：网格（标签墙）/ 列表（单行标签），带滑块动画的分段控件切换。
- **三档尺寸**：S / M / L 调整最小列宽、内边距、标题字号与行数。
- **类型筛选**：按类型过滤，每个 chip 带类型色圆点和数量。
- **深浅主题**：容器与文字全部使用宿主主题变量（`--dsw-alias-*`），跟随外壳自动切换；只有类型色是插件自带的五套 token。
- **记住偏好**：视图与尺寸写进 `localStorage`，刷新后保持。
- **可访问**：卡片/行可 Tab 聚焦，`:focus-visible` 与悬停同效；支持 `prefers-reduced-motion` 与触屏（`hover: none` 时详情常开）。
- **容器查询**：按面板自身宽度排版（≤760px、≤620px 两档），不依赖窗口宽度。
- **零运行时依赖**：没有构建步骤，界面全部在 `client.js` 里，图标是内联 SVG。

## 安装

三种方式任选：

1. **插件市场**：把本仓库的 `market-index.json` 托管到任意 http(s) 地址，在 DSH 的插件页添加该索引 URL，然后从「发现」里安装。
2. **npm**：`pnpm add dsh-project-atlas`（装到 DSH profile 目录），再在插件页启用。
3. **本地目录**：DSH 插件页的「从目录安装」选本目录，或用 `plugin_manager` 的 `install_bundle` 指向本目录。

启用后侧栏的「全局面板」区会出现「项目档案」图标，点开即面板。

## 换成你自己的项目

所有数据都在 `client.js` 顶部的 `PROJECTS` 数组里，字段如下：

```js
{
  id: 'forecast-web',        // 唯一标识，也是标签编号的依据（按数组顺序 01 起）
  category: 'web',           // model | web | deck | plugin | viz
  date: '2025-10-14',        // YYYY-MM-DD，面板按时间倒序显示
  title: '预测工作台：把命令行模型包成网页',
  path: 'forecast-web/',     // 项目目录，可留空
  summary: '……',             // 一两句话，悬停时显示两行
  hours: 34,                 // 工时，可为小数
  cost: 178,                 // 费用（人民币）
  plans: ['……'],             // 后期待完善，逐条列出
}
```

改完保存、刷新 DSH 页面即可。仓库里附带的是 7 条**演示数据**，不含任何个人信息，放心替换。

新增一种类型：在 `CATEGORIES` 里加 `{ id, tone }`（`tone` 取 `TONES` 的键），在 `GLYPHS` 里加一组 SVG path，再在 `zh` / `en` 两份字典里补上 `cat.<id>` 文案。

## 设计说明

- 五套类型色：`blue #4C8DFF`、`mint #22C58B`、`peach #FF9A4D`、`violet #9B7BFF`、`sand #E0B749`，每套再派生当前主题的文字色、加深色（图标块渐变深端）、`tint` / `ring` / `glow` 三档透明度。
- 收起高度由 `--cardMinH` 控制（S 46 / M 58 / L 66），网格用 `align-items: start`，只有被悬停的那枚标签长高，旁边的不会被撑成大空卡。
- 入场动画 `dpaIn` 用 `animation-fill-mode: backwards` 并把标签倾斜角写进关键帧，所以动画结束后悬停的位移仍然生效。

## 目录结构

| 文件 | 作用 |
| --- | --- |
| `package.json` | 包清单：`dsh.bundle.patch`、`dsh.client`、`engines.dsh` |
| `cordis.patch.yml` | 向 profile 插入 `project-atlas` 插件行 |
| `index.js` | Host 半边（空实现，界面全在浏览器端） |
| `client.js` | 面板、侧栏图标、演示数据、样式与动效 |
| `locale/zh.json`、`locale/en.json` | 插件管理页显示的名称与说明 |
| `icon.svg` | 插件图标 |
| `market-index.json` | 插件市场索引（格式 1）示例，用于分发 |

## License

MIT
