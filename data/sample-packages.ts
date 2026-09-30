import type { SupplementPackage } from '~/types/certification';

/**
 * 内置离线补件包样例：审阅人离线时携带这些包，回网后在"离线回网对账"页导入。
 */
export const sampleSupplementPackages: SupplementPackage[] = [
  {
    packageId: 'SUP-118-OFFLINE-01',
    projectId: 'TA-2026-118',
    reviewer: '刘珊',
    exportedAt: '2026-09-29T08:00:00.000Z',
    note: '离线审阅补件：照明加测四驱配置，新增 WLTP 排放报告；回网前两次链路失败演示立即重试。',
    baseline: { maintenanceVersion: 'MY27.1', softwareVersion: '8.4.1' },
    failFirstAttempts: 2,
    items: [
      {
        evidenceId: 'EV-118-03',
        regulationId: 'REG-LIGHT',
        name: '外部照明装置测试记录',
        type: 'test_report',
        version: 'R2',
        softwareVersion: '8.4.1',
        configurations: ['标准续航后驱版', '长续航四驱版'],
        status: 'accepted',
        note: '已补测长续航四驱版后雾灯，离线审阅通过。',
        updatedAt: '2026-09-29T07:40:00.000Z'
      },
      {
        evidenceId: undefined,
        regulationId: 'REG-WLTP',
        name: '轻型车排放与 OBD 测试报告',
        type: 'test_report',
        version: 'R1',
        softwareVersion: '8.4.1',
        configurations: ['长续航四驱版'],
        status: 'accepted',
        note: '离线期间完成实验室排放测试并审阅接受。',
        updatedAt: '2026-09-29T07:50:00.000Z'
      },
      {
        evidenceId: 'EV-118-01',
        regulationId: 'REG-BRAKE',
        name: '制动系统型式试验报告',
        type: 'test_report',
        version: 'R3',
        softwareVersion: '8.4.1',
        configurations: ['长续航四驱版', '标准续航后驱版'],
        status: 'accepted',
        note: '结论维持接受（同版本，无变化）。',
        updatedAt: '2026-09-29T07:30:00.000Z'
      }
    ]
  },
  {
    packageId: 'SUP-118-BASELINE-DRIFT',
    projectId: 'TA-2026-118',
    reviewer: '刘珊',
    exportedAt: '2026-09-29T09:00:00.000Z',
    note: '导出基线 8.4.1；回网前另一位审阅人已把软件基线改为 8.4.2，全部离线结论须重认。',
    baseline: { maintenanceVersion: 'MY27.1', softwareVersion: '8.4.1' },
    items: [
      {
        evidenceId: 'EV-118-02',
        regulationId: 'REG-SOFTWARE',
        name: '软件更新影响评估',
        type: 'software_report',
        version: 'S3',
        softwareVersion: '8.4.1',
        configurations: ['长续航四驱版'],
        status: 'accepted',
        note: '离线依据 8.4.1 审阅接受；基线已漂移，结论失效需在 8.4.2 下重认。',
        updatedAt: '2026-09-29T08:50:00.000Z'
      }
    ]
  },
  {
    packageId: 'SUP-118-REVIEW-DIVERGENCE',
    projectId: 'TA-2026-118',
    reviewer: '外部联合审阅人',
    exportedAt: '2026-09-29T10:00:00.000Z',
    note: '同基线下同文件版本给出相反结论：后到结果不得盖掉当前审阅，默认保留当前。',
    baseline: { maintenanceVersion: 'MY27.1', softwareVersion: '8.4.1' },
    failConfirmOnce: true,
    items: [
      {
        evidenceId: 'EV-118-01',
        regulationId: 'REG-BRAKE',
        name: '制动系统型式试验报告',
        type: 'test_report',
        version: 'R3',
        softwareVersion: '8.4.1',
        configurations: ['长续航四驱版', '标准续航后驱版'],
        status: 'rejected',
        note: '离线复核认为试验边界条件描述不足，建议拒绝（与当前审阅分歧）。',
        updatedAt: '2026-09-29T09:55:00.000Z'
      },
      {
        evidenceId: 'EV-118-04',
        regulationId: 'REG-BATTERY',
        name: '动力电池包安全测试报告',
        type: 'test_report',
        version: 'R5',
        softwareVersion: '8.4.1',
        configurations: ['长续航四驱版', '标准续航后驱版'],
        status: 'accepted',
        note: '补充热扩散复测后新版本，可安全合并。',
        updatedAt: '2026-09-29T09:58:00.000Z'
      }
    ]
  },
  {
    packageId: 'SUP-092-FROZEN-BLOCK',
    projectId: 'TA-2026-092',
    reviewer: '何谦',
    exportedAt: '2026-09-29T11:00:00.000Z',
    note: '项目已批准，导入应被冻结保护拒绝。',
    baseline: { maintenanceVersion: 'MY26.0', softwareVersion: '3.2.4' },
    items: [
      {
        evidenceId: 'EV-092-01',
        regulationId: 'REG-BRAKE',
        name: '制动系统批准报告',
        type: 'certificate',
        version: 'R2',
        softwareVersion: '3.2.4',
        configurations: ['高顶货运版'],
        status: 'accepted',
        note: '试图改写已批准冻结快照。',
        updatedAt: '2026-09-29T10:50:00.000Z'
      }
    ]
  }
];
