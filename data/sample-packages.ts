import type { OfflineSupplementPackage } from '~/types/certification';

// 示例补件包基于种子数据动态构造，便于演示逐项对账的各种处置：
//  - 安全新增 / 安全更新
//  - 网内审阅更新（current_newer，当前审阅优先）
//  - 重复提交（duplicate）
//  - 软件基线漂移（baseline_conflict，旧结论失效需重新确认）
//  - 引用不存在法规（unknown_regulation）
//  - 已批准冻结项目（frozen）

export function buildSamplePackages(): Record<string, OfflineSupplementPackage> {
  return {
    safe: {
      packageId: 'SUP-118-SAFE',
      projectId: 'TA-2026-118',
      projectName: '纯电运动轿车 2027 款（安全合并示例）',
      exportedAt: '2026-09-29T08:00:00.000Z',
      reviewer: '刘珊（离线）',
      baselineSoftwareVersion: '8.4.1',
      baselineMaintenanceVersion: 'MY27.1',
      note: '离线审阅人在与网内一致的 8.4.1 基线上完成的补件。',
      evidenceEntries: [
        {
          evidenceId: 'EV-118-03',
          regulationId: 'REG-LIGHT',
          name: '外部照明装置测试记录',
          type: 'test_report',
          fileVersion: 'R2',
          softwareVersion: '8.4.1',
          configurations: ['长续航四驱版', '标准续航后驱版'],
          decision: 'accepted',
          note: '已补全长续航四驱版后雾灯测试，配置覆盖完整。',
          reviewedAt: '2026-09-29T07:30:00.000Z'
        },
        {
          evidenceId: 'EV-118-05',
          regulationId: 'REG-EMC',
          name: '电磁兼容补充测试记录',
          type: 'test_report',
          fileVersion: 'R1',
          softwareVersion: '8.4.1',
          configurations: ['长续航四驱版', '标准续航后驱版'],
          decision: 'accepted',
          note: '新增四驱配置 EMC 补充测试，结论合格。',
          reviewedAt: '2026-09-29T07:40:00.000Z'
        },
        {
          evidenceId: 'EV-118-01',
          regulationId: 'REG-BRAKE',
          name: '制动系统型式试验报告',
          type: 'test_report',
          fileVersion: 'R3',
          softwareVersion: '8.4.1',
          configurations: ['长续航四驱版', '标准续航后驱版'],
          decision: 'accepted',
          note: '重复带回的同版本同结论报告，应识别为重复提交。',
          reviewedAt: '2026-09-29T07:20:00.000Z'
        },
        {
          evidenceId: 'EV-118-04',
          regulationId: 'REG-BATTERY',
          name: '动力电池包安全测试报告',
          type: 'test_report',
          fileVersion: 'R4',
          softwareVersion: '8.4.1',
          configurations: ['长续航四驱版', '标准续航后驱版'],
          decision: 'rejected',
          note: '离线审阅人在 09-18 曾要求拒件，但网内审阅人在更晚的 09-19 已完成接受；回网后应保留当前审阅，后到结果不得覆盖。',
          reviewedAt: '2026-09-18T00:00:00.000Z'
        }
      ]
    },
    baseline: {
      packageId: 'SUP-118-BASELINE',
      projectId: 'TA-2026-118',
      projectName: '纯电运动轿车 2027 款（基线漂移示例）',
      exportedAt: '2026-09-29T09:00:00.000Z',
      reviewer: '刘珊（离线）',
      baselineSoftwareVersion: '8.3.9',
      baselineMaintenanceVersion: 'MY27.1',
      note: '补件在旧基线 8.3.9 下完成；回网时网内基线已升级到 8.4.1，结论需重新确认。',
      evidenceEntries: [
        {
          evidenceId: 'EV-118-02',
          regulationId: 'REG-SOFTWARE',
          name: '软件更新影响评估',
          type: 'software_report',
          fileVersion: 'S3',
          softwareVersion: '8.3.9',
          configurations: ['长续航四驱版'],
          decision: 'accepted',
          note: '基于 8.3.9 的离线接受结论，不能直接覆盖到 8.4.1。',
          reviewedAt: '2026-09-29T08:30:00.000Z'
        },
        {
          evidenceId: 'EV-118-07',
          regulationId: 'REG-BRAKE',
          name: '制动系统旧基线复核记录',
          type: 'test_report',
          fileVersion: 'R1',
          softwareVersion: '8.3.9',
          configurations: ['长续航四驱版'],
          decision: 'accepted',
          note: '网内尚无该编号，但基线已漂移，仍需按 8.4.1 重新确认。',
          reviewedAt: '2026-09-29T08:35:00.000Z'
        },
        {
          evidenceId: 'EV-118-08',
          regulationId: 'REG-UNKNOWN',
          name: '引用了网内不存在法规项的补件',
          type: 'exemption',
          fileVersion: 'R1',
          softwareVersion: '8.3.9',
          configurations: ['长续航四驱版'],
          decision: 'accepted',
          note: '法规项在当前项目中不存在，需人工核对适用性。',
          reviewedAt: '2026-09-29T08:40:00.000Z'
        }
      ]
    },
    frozen: {
      packageId: 'SUP-092-FROZEN',
      projectId: 'TA-2026-092',
      projectName: '轻型商用车改款（已批准冻结示例）',
      exportedAt: '2026-09-29T10:00:00.000Z',
      reviewer: '何谦（离线）',
      baselineSoftwareVersion: '3.2.4',
      baselineMaintenanceVersion: 'MY26.0',
      note: '目标项目已批准并冻结，任何补件均不得写入冻结快照。',
      evidenceEntries: [
        {
          evidenceId: 'EV-092-01',
          regulationId: 'REG-BRAKE',
          name: '制动系统批准报告',
          type: 'certificate',
          fileVersion: 'R2',
          softwareVersion: '3.2.4',
          configurations: ['高顶货运版'],
          decision: 'accepted',
          note: '试图改写已批准的冻结快照，应被拒绝。',
          reviewedAt: '2026-09-29T09:30:00.000Z'
        }
      ]
    }
  };
}
