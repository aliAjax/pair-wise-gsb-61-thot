import { ofetch } from 'ofetch';
import type { ApprovalProject, ProjectFilters, SupplementPackage } from '~/types/certification';
import { mockFetch } from './mock-fetch';

const client = ofetch.create({
  baseURL: '/api',
  retry: 0
}, {
  fetch: mockFetch as typeof fetch
});

function matches(project: ApprovalProject, filters: ProjectFilters) {
  const query = filters.query.trim().toLowerCase();
  const matchesQuery =
    !query ||
    [project.id, project.name, project.modelCode, project.configuration, project.softwareVersion]
      .join(' ')
      .toLowerCase()
      .includes(query);
  const matchesStatus = filters.status === 'all' || project.status === filters.status;
  const matchesAgency = filters.agency === 'all' || project.agency === filters.agency;
  const matchesRisk =
    filters.risk === 'all' ||
    (filters.risk === 'expiring' && new Date(project.certificateExpiry) <= new Date('2026-12-31')) ||
    (filters.risk === 'missing' &&
      project.regulations.some((item) => item.status === 'missing' || item.status === 'conflict')) ||
    (filters.risk === 'version_conflict' &&
      project.evidence.some((item) => item.softwareVersion !== project.softwareVersion || item.status === 'stale'));

  return matchesQuery && matchesStatus && matchesAgency && matchesRisk;
}

export interface ImportUploadResult {
  accepted: boolean;
  packageId: string;
  duplicated?: boolean;
}

export const certificationApi = {
  async listProjects(filters: ProjectFilters) {
    const projects = await client<ApprovalProject[]>('/projects');
    return projects.filter((project) => matches(project, filters));
  },

  async getProject(id: string) {
    return client<ApprovalProject>(`/projects/${encodeURIComponent(id)}`);
  },

  /** 上传离线补件包（传输层可能失败，调用方使用同一补件包立即重试） */
  async uploadSupplementPackage(projectId: string, pkg: SupplementPackage) {
    return client<ImportUploadResult>(`/projects/${encodeURIComponent(projectId)}/supplement-imports`, {
      method: 'POST',
      body: {
        packageId: pkg.packageId,
        failFirstAttempts: pkg.failFirstAttempts ?? 0
      }
    });
  },

  /** 确认写入；failRemaining > 0 时模拟在写入若干行后断连 */
  async confirmImportSession(sessionId: string, failRemaining = 0) {
    return client<{ committed: boolean; sessionId: string }>(
      `/import-sessions/${encodeURIComponent(sessionId)}/confirm`,
      {
        method: 'POST',
        body: { failRemaining }
      }
    );
  }
};
