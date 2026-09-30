import type { ApprovalProject, RegulationItem } from '~/types/certification';

export const regulationCatalog: RegulationItem[] = [
  {
    id: 'REG-BRAKE',
    code: 'GB 21670',
    title: '乘用车制动系统技术要求',
    category: '安全',
    required: true,
    status: 'complete',
    coverage: 100,
    issues: []
  },
  {
    id: 'REG-LIGHT',
    code: 'GB 4785',
    title: '汽车及挂车外部照明和光信号装置',
    category: '安全',
    required: true,
    status: 'missing',
    coverage: 75,
    issues: ['长续航配置缺少后雾灯测试']
  },
  {
    id: 'REG-EMC',
    code: 'GB 34660',
    title: '道路车辆电磁兼容性要求',
    category: '环保',
    required: true,
    status: 'complete',
    coverage: 100,
    issues: []
  },
  {
    id: 'REG-SOFTWARE',
    code: 'R156',
    title: '软件更新管理体系',
    category: '软件',
    required: true,
    status: 'conflict',
    coverage: 67,
    issues: ['软件基线 8.4.1 与测试报告 8.3.9 不一致']
  },
  {
    id: 'REG-WLTP',
    code: 'GB 18352.6',
    title: '轻型汽车污染物排放限值',
    category: '环保',
    required: true,
    status: 'complete',
    coverage: 100,
    issues: []
  },
  {
    id: 'REG-BATTERY',
    code: 'GB 38031',
    title: '电动汽车用动力蓄电池安全要求',
    category: '安全',
    required: true,
    status: 'complete',
    coverage: 100,
    issues: []
  },
  {
    id: 'REG-ENERGY',
    code: 'GB 27999',
    title: '乘用车燃料消耗量评价方法及指标',
    category: '能耗',
    required: true,
    status: 'missing',
    coverage: 80,
    issues: ['高性能四驱配置尚未提交能耗一致性说明']
  },
  {
    id: 'REG-COMPONENT',
    code: 'R100.2',
    title: '电动车辆特定部件安全要求',
    category: '部件',
    required: true,
    status: 'complete',
    coverage: 100,
    issues: []
  }
];

export const seedProjects: ApprovalProject[] = [
  {
    id: 'TA-2026-118',
    name: '纯电运动轿车 2027 款',
    modelCode: 'EVS-27',
    vehicleType: 'M1',
    configuration: '长续航四驱版',
    maintenanceVersion: 'MY27.1',
    softwareVersion: '8.4.1',
    status: 'under_review',
    progress: 78,
    applicant: '远航汽车工程部',
    reviewer: '刘珊',
    agency: '华东认证中心',
    submittedAt: '2026-09-18',
    updatedAt: '2026-09-28T10:45:00.000Z',
    certificateExpiry: '2026-12-16',
    regulations: regulationCatalog,
    evidence: [
      {
        id: 'EV-118-01',
        projectId: 'TA-2026-118',
        regulationId: 'REG-BRAKE',
        name: '制动系统型式试验报告',
        type: 'test_report',
        version: 'R3',
        softwareVersion: '8.4.1',
        configurations: ['长续航四驱版', '标准续航后驱版'],
        status: 'accepted',
        note: '试验条件与量产软件基线一致。',
        updatedAt: '2026-09-20T03:00:00.000Z'
      },
      {
        id: 'EV-118-02',
        projectId: 'TA-2026-118',
        regulationId: 'REG-SOFTWARE',
        name: '软件更新影响评估',
        type: 'software_report',
        version: 'S2',
        softwareVersion: '8.3.9',
        configurations: ['长续航四驱版'],
        status: 'rejected',
        note: '报告软件版本落后于当前整车基线。',
        updatedAt: '2026-09-25T06:30:00.000Z'
      },
      {
        id: 'EV-118-03',
        projectId: 'TA-2026-118',
        regulationId: 'REG-LIGHT',
        name: '外部照明装置测试记录',
        type: 'test_report',
        version: 'R1',
        softwareVersion: '8.4.1',
        configurations: ['标准续航后驱版'],
        status: 'resubmit',
        note: '需补充长续航四驱配置后雾灯测试。',
        updatedAt: '2026-09-27T04:10:00.000Z'
      },
      {
        id: 'EV-118-04',
        projectId: 'TA-2026-118',
        regulationId: 'REG-BATTERY',
        name: '动力电池包安全测试报告',
        type: 'test_report',
        version: 'R4',
        softwareVersion: '8.4.1',
        configurations: ['长续航四驱版', '标准续航后驱版'],
        status: 'accepted',
        note: '覆盖全部量产电池配置。',
        updatedAt: '2026-09-19T08:00:00.000Z'
      }
    ],
    versions: [
      {
        id: 'VER-118-02',
        label: 'MY27.1 / 8.4.1',
        author: '远航汽车工程部',
        createdAt: '2026-09-27T04:10:00.000Z',
        summary: '更新软件基线并补充照明配置覆盖。',
        changes: ['整车软件由 8.3.9 升级至 8.4.1', '新增长续航四驱配置照明声明'],
        impactedConfigurations: ['长续航四驱版']
      },
      {
        id: 'VER-118-01',
        label: 'MY27.1 / 8.3.9',
        author: '远航汽车工程部',
        createdAt: '2026-09-18T01:20:00.000Z',
        summary: '首次提交型式认证证据包。',
        changes: ['建立法规项目与首版测试报告关联'],
        impactedConfigurations: ['长续航四驱版', '标准续航后驱版']
      }
    ],
    audit: [
      {
        id: 'AUD-118-04',
        actor: '刘珊',
        action: '退回补件',
        detail: '软件影响评估版本错配，照明证据缺少配置覆盖。',
        createdAt: '2026-09-28T10:45:00.000Z'
      },
      {
        id: 'AUD-118-03',
        actor: '远航汽车工程部',
        action: '更新版本',
        detail: '软件基线更新为 8.4.1，需重新确认受影响法规项。',
        createdAt: '2026-09-27T04:10:00.000Z'
      }
    ]
  },
  {
    id: 'TA-2026-109',
    name: '插电式混合动力多用途车',
    modelCode: 'PHV-M9',
    vehicleType: 'M1',
    configuration: '七座旗舰版',
    maintenanceVersion: 'MY26.2',
    softwareVersion: '5.7.0',
    status: 'supplement_required',
    progress: 64,
    applicant: '北辰汽车',
    reviewer: '赵驰',
    agency: '华南认证中心',
    submittedAt: '2026-09-05',
    updatedAt: '2026-09-26T02:15:00.000Z',
    certificateExpiry: '2026-11-20',
    regulations: regulationCatalog.slice(0, 6),
    evidence: [
      {
        id: 'EV-109-01',
        projectId: 'TA-2026-109',
        regulationId: 'REG-EMC',
        name: '整车电磁兼容报告',
        type: 'test_report',
        version: 'R2',
        softwareVersion: '5.7.0',
        configurations: ['七座旗舰版'],
        status: 'accepted',
        note: '实验室报告与申报配置一致。',
        updatedAt: '2026-09-10T03:00:00.000Z'
      },
      {
        id: 'EV-109-02',
        projectId: 'TA-2026-109',
        regulationId: 'REG-ENERGY',
        name: '能耗一致性证明材料',
        type: 'test_report',
        version: 'R1',
        softwareVersion: '5.6.8',
        configurations: ['七座旗舰版'],
        status: 'resubmit',
        note: '测试软件版本与当前申报版本不一致。',
        updatedAt: '2026-09-26T02:15:00.000Z'
      }
    ],
    versions: [
      {
        id: 'VER-109-01',
        label: 'MY26.2 / 5.7.0',
        author: '北辰汽车',
        createdAt: '2026-09-05T08:00:00.000Z',
        summary: '首次提交 PHEV 整车证据包。',
        changes: ['建立 6 个法规项'],
        impactedConfigurations: ['七座旗舰版']
      }
    ],
    audit: [
      {
        id: 'AUD-109-02',
        actor: '赵驰',
        action: '要求补件',
        detail: '能耗证据软件版本需更新后重新抽样测试。',
        createdAt: '2026-09-26T02:15:00.000Z'
      }
    ]
  },
  {
    id: 'TA-2026-092',
    name: '轻型商用车改款',
    modelCode: 'LCV-4',
    vehicleType: 'N1',
    configuration: '高顶货运版',
    maintenanceVersion: 'MY26.0',
    softwareVersion: '3.2.4',
    status: 'approved',
    progress: 100,
    applicant: '西岭商用车',
    reviewer: '何谦',
    agency: '华北认证中心',
    submittedAt: '2026-07-12',
    updatedAt: '2026-08-30T09:20:00.000Z',
    certificateExpiry: '2027-08-29',
    regulations: regulationCatalog.slice(0, 5),
    evidence: [
      {
        id: 'EV-092-01',
        projectId: 'TA-2026-092',
        regulationId: 'REG-BRAKE',
        name: '制动系统批准报告',
        type: 'certificate',
        version: 'R1',
        softwareVersion: '3.2.4',
        configurations: ['高顶货运版'],
        status: 'accepted',
        expiryDate: '2027-08-29',
        note: '已纳入正式批准版本。',
        updatedAt: '2026-08-30T09:20:00.000Z'
      }
    ],
    versions: [
      {
        id: 'VER-092-02',
        label: '批准版 / 3.2.4',
        author: '何谦',
        createdAt: '2026-08-30T09:20:00.000Z',
        summary: '完成审批并锁定正式提交包。',
        changes: ['批准全部法规项', '锁定软件与维护版本'],
        impactedConfigurations: ['高顶货运版']
      }
    ],
    audit: [
      {
        id: 'AUD-092-03',
        actor: '何谦',
        action: '批准',
        detail: '全部适用范围证据通过审阅，提交包版本锁定。',
        createdAt: '2026-08-30T09:20:00.000Z'
      }
    ]
  },
  {
    id: 'TA-2026-120',
    name: '城市物流电动货车',
    modelCode: 'EVL-3',
    vehicleType: 'N1',
    configuration: '标准厢式版',
    maintenanceVersion: 'MY27.0',
    softwareVersion: '1.9.2',
    status: 'draft',
    progress: 32,
    applicant: '江洲新能源',
    reviewer: '待分派',
    agency: '华东认证中心',
    updatedAt: '2026-09-27T12:30:00.000Z',
    certificateExpiry: '2026-10-24',
    regulations: regulationCatalog.filter((item) => ['REG-BRAKE', 'REG-EMC', 'REG-BATTERY'].includes(item.id)),
    evidence: [
      {
        id: 'EV-120-01',
        projectId: 'TA-2026-120',
        regulationId: 'REG-BATTERY',
        name: '电池包部件清单',
        type: 'part_list',
        version: 'D1',
        softwareVersion: '1.9.2',
        configurations: ['标准厢式版'],
        status: 'submitted',
        note: '等待认证机构确认零件号完整性。',
        updatedAt: '2026-09-27T12:30:00.000Z'
      }
    ],
    versions: [
      {
        id: 'VER-120-01',
        label: 'MY27.0 / 1.9.2',
        author: '江洲新能源',
        createdAt: '2026-09-27T12:30:00.000Z',
        summary: '建立认证项目草稿。',
        changes: ['录入整车基础信息和电池部件清单'],
        impactedConfigurations: ['标准厢式版']
      }
    ],
    audit: [
      {
        id: 'AUD-120-01',
        actor: '江洲新能源',
        action: '建立项目',
        detail: '创建认证证据包草稿。',
        createdAt: '2026-09-27T12:30:00.000Z'
      }
    ]
  }
];
