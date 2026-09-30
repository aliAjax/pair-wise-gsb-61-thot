import { seedProjects } from '~/data/seed';
import type { ApprovalProject } from '~/types/certification';

const STORAGE_KEY = 'vehicle-type-approval-projects-v1';

function currentProjects(): ApprovalProject[] {
  if (typeof localStorage === 'undefined') return structuredClone(seedProjects);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ApprovalProject[]) : structuredClone(seedProjects);
  } catch {
    return structuredClone(seedProjects);
  }
}

/**
 * 离线回网传输故障模拟：
 * - importFailures：补件包上传剩余失败次数（由补件包 failFirstAttempts 声明），
 *   审阅人立即用同一补件包重试，次数耗尽后放行；
 * - confirmFailures：确认写入剩余失败次数，用于制造"部分已确认后断连"。
 */
const importFailures = new Map<string, number>();
const confirmFailures = new Map<string, number>();

export const mockFetch: typeof fetch = async (input, init) => {
  const source = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const url = new URL(source, 'http://local.test');
  await new Promise((resolve) => setTimeout(resolve, 70));

  const send = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        'content-type': 'application/json'
      }
    });

  const readBody = () => {
    try {
      return init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  };

  if (url.pathname === '/api/projects' && (!init?.method || init.method === 'GET')) {
    return send(currentProjects());
  }

  const importMatch = url.pathname.match(/^\/api\/projects\/([^/]+)\/supplement-imports$/);
  if (importMatch && init?.method === 'POST') {
    const body = readBody();
    const packageId = String(body.packageId ?? '');
    const projectId = decodeURIComponent(importMatch[1]);
    const project = currentProjects().find((item) => item.id === projectId);
    if (!project) return send({ message: '项目不存在' }, 404);
    if (project.status === 'approved') {
      return send({ message: '项目已批准，冻结快照不可改写，补件包不能导入' }, 409);
    }
    if (!importFailures.has(packageId)) {
      importFailures.set(packageId, Number(body.failFirstAttempts ?? 0));
    }
    const remaining = importFailures.get(packageId) ?? 0;
    if (remaining > 0) {
      importFailures.set(packageId, remaining - 1);
      return send({ message: '回网链路中断，请使用同一补件包立即重试' }, 502);
    }
    return send({ accepted: true, packageId });
  }

  const confirmMatch = url.pathname.match(/^\/api\/import-sessions\/([^/]+)\/confirm$/);
  if (confirmMatch && init?.method === 'POST') {
    const sessionId = decodeURIComponent(confirmMatch[1]);
    const body = readBody();
    if (!confirmFailures.has(sessionId)) {
      confirmFailures.set(sessionId, Number(body.failRemaining ?? 0));
    }
    const remaining = confirmFailures.get(sessionId) ?? 0;
    if (remaining > 0) {
      confirmFailures.set(sessionId, remaining - 1);
      return send({ message: '确认写入中途断连，已确认部分保留在安全点' }, 502);
    }
    return send({ committed: true, sessionId });
  }

  const match = url.pathname.match(/^\/api\/projects\/([^/]+)$/);
  if (match) {
    const project = currentProjects().find((item) => item.id === decodeURIComponent(match[1]));
    return project ? send(project) : send({ message: '项目不存在' }, 404);
  }

  return send({ message: '未实现的模拟接口' }, 404);
};
