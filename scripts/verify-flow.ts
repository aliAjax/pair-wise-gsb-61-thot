// 端到端逻辑验证：不启动浏览器，直接跑 Pinia store + mock-fetch
import { createPinia, setActivePinia } from 'pinia';
import { useCertificationStore } from '../stores/certification';
import { sampleSupplementPackages } from '../data/sample-packages';
import type { ApprovalProject, SupplementPackage } from '../types/certification';

// ---- 浏览器环境垫片 ----
const storage = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => (storage.has(k) ? storage.get(k)! : null),
  setItem: (k: string, v: string) => void storage.set(k, v),
  removeItem: (k: string) => void storage.delete(k)
};
Object.defineProperty(globalThis, 'crypto', {
  value: { randomUUID: () => `id-${Math.random().toString(36).slice(2)}` },
  configurable: true
});

function assert(cond: boolean, label: string) {
  if (!cond) {
    console.error(`❌ FAIL: ${label}`);
    process.exitCode = 1;
  } else {
    console.log(`✅ ${label}`);
  }
}

function freshStore() {
  storage.clear();
  setActivePinia(createPinia());
  const store = useCertificationStore();
  store.hydrate();
  return store;
}

function pkg(id: string) {
  return structuredClone(sampleSupplementPackages.find((p) => p.packageId === id)!) as SupplementPackage;
}

async function main() {
  /* ===== 场景 A：正常回网（失败重试 + 安全合并 + 新增 + 重复提交） ===== */
  {
    const store = freshStore();
    const session = await store.startImport(pkg('SUP-118-OFFLINE-01'));
    assert(session.status === 'awaiting_confirmation', '失败两次后同一补件包自动重试成功并进入对账');
    assert(session.transportAttempts === 3, `传输共尝试 3 次（实际 ${session.transportAttempts}）`);

    const outcomes = session.lines.map((l) => l.outcome);
    assert(outcomes.includes('safe_update'), '照明 R1→R2 识别为安全合并');
    assert(outcomes.includes('add_evidence'), 'WLTP 新报告识别为随包新增');
    assert(outcomes.includes('unchanged'), '制动报告识别为无变化');

    const beforeAudit = store.projectById('TA-2026-118')!.audit.length;
    const result = await store.confirmImport(session.id);
    assert(result.ok, '确认成功一次写入全部变化');

    const project = store.projectById('TA-2026-118')!;
    const light = project.evidence.find((e) => e.id === 'EV-118-03')!;
    assert(light.version === 'R2' && light.status === 'accepted', '安全合并更新证据版本与结论');
    assert(light.configurations.includes('长续航四驱版'), '安全合并更新配置覆盖');
    assert(Boolean(project.evidence.find((e) => e.regulationId === 'REG-WLTP')), '新增证据已落库');
    const regWltp = project.regulations.find((r) => r.id === 'REG-WLTP')!;
    assert(regWltp.status === 'complete' && regWltp.coverage === 100, '法规覆盖随安全合并更新为完整');

    const again = await store.startImport(pkg('SUP-118-OFFLINE-01'));
    assert(again.duplicated === true, '重复导入返回已确认会话');
    assert(project.audit.length === beforeAudit + 1, '重复提交没有生成第二套审计');
  }

  /* ===== 场景 B：软件基线被另一位审阅人改动，离线结论失效重认 ===== */
  {
    const store = freshStore();
    const project0 = store.projectById('TA-2026-118')!;
    const reviewedCountBefore = project0.evidence.filter((e) => e.status === 'accepted' || e.status === 'rejected').length;

    store.updateProject(
      'TA-2026-118',
      {
        name: project0.name, modelCode: project0.modelCode, vehicleType: project0.vehicleType,
        configuration: project0.configuration, maintenanceVersion: project0.maintenanceVersion,
        softwareVersion: '8.4.2', applicant: project0.applicant, agency: project0.agency,
        certificateExpiry: project0.certificateExpiry
      },
      '另一位审阅人提升软件基线至 8.4.2',
      '另一位审阅人'
    );
    const p2 = store.projectById('TA-2026-118')!;
    const staleCount = p2.evidence.filter((e) => e.status === 'stale').length;
    assert(staleCount === reviewedCountBefore, `基线变更使全部 ${reviewedCountBefore} 项已有审阅结论失效（实际 ${staleCount}）`);
    assert(
      p2.conflicts.filter((c) => c.kind === 'baseline_drift' && !c.resolved).length === reviewedCountBefore,
      '每条失效证据登记一条未解决基线漂移冲突'
    );
    assert(p2.regulations.some((r) => r.status === 'conflict'), '失效导致法规覆盖降为冲突');

    const driftSession = await store.startImport(pkg('SUP-118-BASELINE-DRIFT'));
    assert(driftSession.lines.every((l) => l.outcome === 'reconfirm'), '基线漂移包逐项标记待重认');
    await store.confirmImport(driftSession.id);
    const p3 = store.projectById('TA-2026-118')!;
    const swEvidence = p3.evidence.find((e) => e.id === 'EV-118-02')!;
    assert(swEvidence.version === 'S3' && swEvidence.status === 'stale', '漂移包内容合并但结论保持失效，不被离线接受覆盖');
    assert(swEvidence.softwareVersion === '8.4.2', '证据软件版本对齐当前基线');

    // 页面重开安全点：会话持久化
    const raw = storage.get('vehicle-type-approval-import-sessions-v1')!;
    assert(raw.includes('SUP-118-BASELINE-DRIFT'), '导入会话持久化，页面重开可从安全点继续');

    // 重新确认后解除失效与冲突
    store.updateEvidence('TA-2026-118', swEvidence.id, 'accepted', '按 8.4.2 重新确认');
    const p4 = store.projectById('TA-2026-118')!;
    const reconfirmed = p4.evidence.find((e) => e.id === swEvidence.id)!;
    assert(reconfirmed.status === 'accepted' && Boolean(reconfirmed.reviewedBaseline?.includes('8.4.2')), '失效证据在新基线下重新确认接受');
    assert(
      !p4.conflicts.some((c) => c.evidenceId === swEvidence.id && !c.resolved),
      '重认后对应基线漂移冲突关闭'
    );
  }

  /* ===== 场景 C：同版本审阅分歧 + 确认中途断连（已确认不重做） ===== */
  {
    const store = freshStore();
    const divSession = await store.startImport(pkg('SUP-118-REVIEW-DIVERGENCE'));
    const conflictLine = divSession.lines.find((l) => l.outcome === 'review_conflict');
    assert(Boolean(conflictLine), '识别出同版本审阅分歧');
    assert(conflictLine!.defaultDecision === 'keep_current', '审阅分歧默认保留当前，后到结果不覆盖');
    assert(divSession.lines.some((l) => l.outcome === 'safe_update'), '同包内新版本电池报告识别为安全合并');

    const first = await store.confirmImport(divSession.id);
    assert(!first.ok && first.applied >= 1 && (first.remaining ?? 0) >= 1, '确认中途断连，部分行已落安全点');    const appliedAfterFirst = divSession.lines.filter((l) => l.applied).length;
    const second = await store.confirmImport(divSession.id);
    assert(second.ok, '从安全点继续确认成功');
    const appliedAfterSecond = divSession.lines.filter((l) => l.applied).length;
    assert(appliedAfterFirst >= 1 && appliedAfterSecond === divSession.lines.length, '已确认部分未重做，剩余行补完');

    const project = store.projectById('TA-2026-118')!;
    const brake = project.evidence.find((e) => e.id === 'EV-118-01')!;
    assert(brake.status === 'accepted', '制动报告维持当前审阅，离线拒绝结论未盖掉');
    const battery = project.evidence.find((e) => e.id === 'EV-118-04')!;
    assert(battery.version === 'R5', '同包内安全合并照常落库');
    assert(project.conflicts.some((c) => c.kind === 'review_divergence' && !c.resolved), '审阅分歧登记为未处理冲突');
    const importAuditCount = project.audit.filter((a) => a.dedupKey === `import-confirm:${divSession.id}`).length;
    assert(importAuditCount === 1, '断连重试只保留一条导入审计');

    // 再次确认已完成会话：幂等
    const third = await store.confirmImport(divSession.id);
    assert(third.ok, '已确认会话再次确认幂等返回');
    assert(project.audit.filter((a) => a.dedupKey === `import-confirm:${divSession.id}`).length === 1, '仍只有一条审计');
  }

  /* ===== 场景 D：已批准项目冻结保护 ===== */
  {
    const store = freshStore();
    const frozenBefore = JSON.parse(JSON.stringify(store.projectById('TA-2026-092'))) as ApprovalProject;

    let blocked = false;
    try {
      store.updateProject(
        'TA-2026-092',
        {
          name: '轻型商用车改款', modelCode: 'LCV-4', vehicleType: 'N1', configuration: '高顶货运版',
          maintenanceVersion: 'MY26.0', softwareVersion: '3.2.5', applicant: '西岭商用车',
          agency: '华北认证中心', certificateExpiry: '2027-08-29'
        },
        '试图改已批准基线'
      );
    } catch {
      blocked = true;
    }
    assert(blocked, '已批准项目基线更新被拒绝');

    let evidenceBlocked = false;
    try {
      store.updateEvidence('TA-2026-092', 'EV-092-01', 'rejected', '');
    } catch {
      evidenceBlocked = true;
    }
    assert(evidenceBlocked, '已批准项目证据审阅被拒绝');

    let supplementBlocked = false;
    try {
      store.bulkSupplement('TA-2026-092', ['EV-092-01'], '试图对冻结项目批量补件说明文字');
    } catch {
      supplementBlocked = true;
    }
    assert(supplementBlocked, '已批准项目批量补件被拒绝');

    let importBlocked = false;
    try {
      await store.startImport(pkg('SUP-092-FROZEN-BLOCK'));
    } catch {
      importBlocked = true;
    }
    assert(importBlocked, '已批准项目的离线补件包导入被拒绝');

    const frozenAfter = store.projectById('TA-2026-092')!;
    assert(frozenAfter.softwareVersion === '3.2.4', '项目基线未被改写');
    assert(
      JSON.stringify(frozenAfter.frozenSnapshot) === JSON.stringify(frozenBefore.frozenSnapshot),
      '冻结快照内容未被改写'
    );
  }

  /* ===== 场景 E：批准时生成冻结快照，且导出标明基线与未处理冲突 ===== */
  {
    const store = freshStore();
    const session = await store.startImport(pkg('SUP-118-REVIEW-DIVERGENCE'));
    await store.confirmImport(session.id).catch(() => {});
    await store.confirmImport(session.id);
    const project = store.projectById('TA-2026-118')!;
    assert(project.conflicts.some((c) => !c.resolved), '存在未处理冲突');

    // 动态导入导出函数验证
    const { buildSubmissionExport } = await import('../services/reconcile');
    const report = buildSubmissionExport(project);
    assert(report.adoptedBaseline.softwareVersion === '8.4.1', '导出标明采用基线');
    assert(report.unresolvedConflicts.length >= 1, '导出包含未处理冲突清单');

    // 有冲突时批准被校验阻断（validateSubmission 层）
    const { validateSubmission } = await import('../services/validators');
    assert(validateSubmission(project).some((i) => i.includes('冲突')), '未处理冲突阻断批准');
  }

  console.log('\n全部验证完成。');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
