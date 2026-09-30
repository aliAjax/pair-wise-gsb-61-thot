# 汽车型式认证证据包审阅与补件平台

用于按车型、配置、法规项目和维护版本组织测试报告、部件清单、软件版本及豁免材料的本地认证工作台。

## 技术栈

- Nuxt 3 + TypeScript
- Nuxt UI
- Pinia
- Nuxt Router
- ofetch
- TanStack Query for Vue

## 主要工作区

- `/`：认证项目列表、关键词/状态/机构/风险筛选和项目统计
- `/projects/new`：建立车型、配置、维护版本和软件版本基线
- `/projects/[id]`：证据审阅、法规覆盖、状态流转、版本差异、批量补件和审计
- `/regulations`：按法规分类查看项目证据覆盖
- `/supplements`：跨项目批量补件
- `/reminders`：证书和证据到期提醒
- `/audit`：跨项目审批时间线与提交包导出

## 本地运行

```bash
npm install
npm run dev
```

访问 `http://localhost:18461`。

## 构建与检查

```bash
npm run typecheck
npm run build
```

项目没有后端服务，使用结构化模拟数据，并通过 Pinia 和浏览器 `localStorage` 持久化车型项目、证据状态、版本和审计记录。ofetch 由本地模拟 fetch 适配器承载，TanStack Query 负责项目索引查询和筛选缓存。
