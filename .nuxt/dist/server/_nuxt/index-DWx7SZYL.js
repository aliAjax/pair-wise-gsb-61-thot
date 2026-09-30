import __nuxt_component_2 from "./Button-D8wzsEpq.js";
import { defineComponent, mergeProps, useSSRContext, reactive, computed, withCtx, createTextVNode, unref, createVNode, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import __nuxt_component_3 from "./FormGroup-4pa-_EdW.js";
import __nuxt_component_4 from "./Input-D0aVKprk.js";
import __nuxt_component_6 from "./Select-B6kLXjTL.js";
import { _ as __nuxt_component_0 } from "./nuxt-link-C7gFIhDA.js";
import { _ as _sfc_main$2 } from "./StatusBadge-DG46AzPs.js";
import __nuxt_component_2$1 from "./Progress-CwDF88zd.js";
import { useQueryClient, useQuery } from "@tanstack/vue-query";
import { ofetch } from "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/ofetch/dist/node.mjs";
import { s as seedProjects, u as useCertificationStore } from "./certification-DojyOQvk.js";
import "./Link-BXfM0-H0.js";
import "ohash/utils";
import "../server.mjs";
import "#internal/nuxt/paths";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/hookable/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/h3/dist/index.mjs";
import "pinia";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/ufo/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/klona/dist/index.mjs";
import "@vueuse/core";
import "tailwind-merge";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
import "./link-Bz3Wc5MF.js";
import "./Icon-DLyP7dyO.js";
import "./index-B1ESqrck.js";
import "@iconify/utils/lib/css/icon";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/perfect-debounce/dist/index.mjs";
import "./tooltip-DSSfimG6.js";
import "./useButtonGroup-CmlPsf0K.js";
import "./button-Bz5rwL6o.js";
import "./useFormGroup-DqE91r20.js";
import "./Badge-D-kRXobJ.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "StatTile",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    note: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "border border-slate-200 bg-white p-4" }, _attrs))}><p class="text-sm text-slate-500">${ssrInterpolate(__props.label)}</p><p class="metric-value mt-2 text-3xl font-semibold text-slate-950">${ssrInterpolate(__props.value)}</p><p class="mt-2 text-xs text-slate-500">${ssrInterpolate(__props.note)}</p></article>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatTile.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const STORAGE_KEY = "vehicle-type-approval-projects-v1";
function currentProjects() {
  if (typeof localStorage === "undefined") return structuredClone(seedProjects);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(seedProjects);
  } catch {
    return structuredClone(seedProjects);
  }
}
const mockFetch = async (input) => {
  const source = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  const url = new URL(source, "http://local.test");
  await new Promise((resolve) => setTimeout(resolve, 70));
  const send = (data, status = 200) => new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json"
    }
  });
  if (url.pathname === "/api/projects") {
    return send(currentProjects());
  }
  const match = url.pathname.match(/^\/api\/projects\/([^/]+)$/);
  if (match) {
    const project = currentProjects().find((item) => item.id === decodeURIComponent(match[1]));
    return project ? send(project) : send({ message: "项目不存在" }, 404);
  }
  return send({ message: "未实现的模拟接口" }, 404);
};
const client = ofetch.create({
  baseURL: "/api",
  retry: 0
}, {
  fetch: mockFetch
});
function matches(project, filters) {
  const query = filters.query.trim().toLowerCase();
  const matchesQuery = !query || [project.id, project.name, project.modelCode, project.configuration, project.softwareVersion].join(" ").toLowerCase().includes(query);
  const matchesStatus = filters.status === "all" || project.status === filters.status;
  const matchesAgency = filters.agency === "all" || project.agency === filters.agency;
  const matchesRisk = filters.risk === "all" || filters.risk === "expiring" && new Date(project.certificateExpiry) <= /* @__PURE__ */ new Date("2026-12-31") || filters.risk === "missing" && project.regulations.some((item) => item.status === "missing" || item.status === "conflict") || filters.risk === "version_conflict" && project.evidence.some((item) => item.softwareVersion !== project.softwareVersion);
  return matchesQuery && matchesStatus && matchesAgency && matchesRisk;
}
const certificationApi = {
  async listProjects(filters) {
    const projects = await client("/projects");
    return projects.filter((project) => matches(project, filters));
  },
  async getProject(id) {
    return client(`/projects/${encodeURIComponent(id)}`);
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useCertificationStore();
    useQueryClient();
    const filters = reactive({
      query: "",
      status: "all",
      agency: "all",
      risk: "all"
    });
    const statusOptions = [
      { label: "全部状态", value: "all" },
      { label: "草稿", value: "draft" },
      { label: "已提交", value: "submitted" },
      { label: "审阅中", value: "under_review" },
      { label: "待补件", value: "supplement_required" },
      { label: "已批准", value: "approved" },
      { label: "已拒绝", value: "rejected" }
    ];
    const riskOptions = [
      { label: "全部关注项", value: "all" },
      { label: "证书临近到期", value: "expiring" },
      { label: "法规覆盖缺失", value: "missing" },
      { label: "软件版本冲突", value: "version_conflict" }
    ];
    const agencyOptions = computed(() => [
      { label: "全部机构", value: "all" },
      ...store.agencies.map((agency) => ({ label: agency, value: agency }))
    ]);
    const { data, isPending, isError, refetch } = useQuery({
      queryKey: computed(() => ["projects", filters]),
      queryFn: () => certificationApi.listProjects({ ...filters })
    });
    const projectRows = computed(() => data.value ?? []);
    const openCount = computed(() => store.projects.filter((project) => !["approved", "rejected"].includes(project.status)).length);
    const supplementCount = computed(() => store.projects.filter((project) => project.status === "supplement_required").length);
    const versionConflictCount = computed(
      () => store.projects.filter(
        (project) => project.evidence.some((evidence) => evidence.softwareVersion !== project.softwareVersion)
      ).length
    );
    const expiringCount = computed(
      () => store.projects.filter((project) => new Date(project.certificateExpiry) <= /* @__PURE__ */ new Date("2026-12-31")).length
    );
    function riskLabel(project) {
      if (project.evidence.some((item) => item.softwareVersion !== project.softwareVersion)) return "软件版本冲突";
      if (project.regulations.some((item) => item.status !== "complete")) return "法规覆盖缺失";
      if (new Date(project.certificateExpiry) <= /* @__PURE__ */ new Date("2026-12-31")) return "证书临近到期";
      return "未见阻断项";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_2;
      const _component_StatTile = _sfc_main$1;
      const _component_UFormGroup = __nuxt_component_3;
      const _component_UInput = __nuxt_component_4;
      const _component_USelect = __nuxt_component_6;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_StatusBadge = _sfc_main$2;
      const _component_UProgress = __nuxt_component_2$1;
      _push(`<!--[--><div class="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p class="text-sm font-medium text-teal-700">型式认证运营</p><h1 class="mt-1 text-2xl font-semibold">认证证据包工作台</h1><p class="mt-2 text-sm text-slate-600">按车型、配置、法规项目和维护版本组织证据，控制缺失、错配与补件闭环。</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/projects/new",
        color: "primary",
        icon: "i-heroicons-plus"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`新建认证项目`);
          } else {
            return [
              createTextVNode("新建认证项目")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><section class="workspace-grid mb-6"><div class="col-span-12 sm:col-span-6 xl:col-span-3">`);
      _push(ssrRenderComponent(_component_StatTile, {
        label: "开放认证项目",
        value: unref(openCount),
        note: "草稿、审阅和补件队列"
      }, null, _parent));
      _push(`</div><div class="col-span-12 sm:col-span-6 xl:col-span-3">`);
      _push(ssrRenderComponent(_component_StatTile, {
        label: "待补件项目",
        value: unref(supplementCount),
        note: "认证机构已退回要求补件"
      }, null, _parent));
      _push(`</div><div class="col-span-12 sm:col-span-6 xl:col-span-3">`);
      _push(ssrRenderComponent(_component_StatTile, {
        label: "版本冲突",
        value: unref(versionConflictCount),
        note: "证据软件版本与申报基线不一致"
      }, null, _parent));
      _push(`</div><div class="col-span-12 sm:col-span-6 xl:col-span-3">`);
      _push(ssrRenderComponent(_component_StatTile, {
        label: "90 天内到期",
        value: unref(expiringCount),
        note: "证书或批准文件临近失效"
      }, null, _parent));
      _push(`</div></section><section class="mb-5 border border-slate-200 bg-white p-4"><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">`);
      _push(ssrRenderComponent(_component_UFormGroup, { label: "关键词" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(filters).query,
              "onUpdate:modelValue": ($event) => unref(filters).query = $event,
              placeholder: "项目号、车型、配置或软件版本"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(filters).query,
                "onUpdate:modelValue": ($event) => unref(filters).query = $event,
                placeholder: "项目号、车型、配置或软件版本"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormGroup, { label: "审批状态" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(filters).status,
              "onUpdate:modelValue": ($event) => unref(filters).status = $event,
              options: statusOptions
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_USelect, {
                modelValue: unref(filters).status,
                "onUpdate:modelValue": ($event) => unref(filters).status = $event,
                options: statusOptions
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormGroup, { label: "认证机构" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(filters).agency,
              "onUpdate:modelValue": ($event) => unref(filters).agency = $event,
              options: unref(agencyOptions)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_USelect, {
                modelValue: unref(filters).agency,
                "onUpdate:modelValue": ($event) => unref(filters).agency = $event,
                options: unref(agencyOptions)
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormGroup, { label: "风险筛选" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(filters).risk,
              "onUpdate:modelValue": ($event) => unref(filters).risk = $event,
              options: riskOptions
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_USelect, {
                modelValue: unref(filters).risk,
                "onUpdate:modelValue": ($event) => unref(filters).risk = $event,
                options: riskOptions
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-3 flex flex-wrap gap-4 text-xs text-slate-500"><span>筛选结果 ${ssrInterpolate(unref(projectRows).length)} 项</span><span>全部项目 ${ssrInterpolate(unref(store).projects.length)} 项</span><span>本地数据已启用</span></div></section><section class="border border-slate-200 bg-white">`);
      if (unref(isPending)) {
        _push(`<div class="p-10 text-center text-slate-500">正在读取认证项目索引…</div>`);
      } else if (unref(isError)) {
        _push(`<div class="p-10 text-center text-red-700">认证项目索引读取失败。</div>`);
      } else {
        _push(`<div class="overflow-x-auto"><table class="data-table min-w-[1120px]"><thead><tr><th>认证项目</th><th>车型 / 配置</th><th>版本基线</th><th>状态</th><th>完整性</th><th>关键风险</th><th>机构 / 审阅人</th><th>操作</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(projectRows), (project) => {
          _push(`<tr><td>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/projects/${project.id}`,
            class: "font-semibold text-teal-700 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(project.id)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(project.id), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<p class="mt-1 max-w-[280px] text-sm text-slate-600">${ssrInterpolate(project.name)}</p></td><td><p class="font-medium">${ssrInterpolate(project.modelCode)} · ${ssrInterpolate(project.vehicleType)}</p><p class="mt-1 text-sm text-slate-500">${ssrInterpolate(project.configuration)}</p></td><td><p>${ssrInterpolate(project.maintenanceVersion)}</p><p class="mt-1 font-mono text-xs text-slate-500">SW ${ssrInterpolate(project.softwareVersion)}</p></td><td>`);
          _push(ssrRenderComponent(_component_StatusBadge, {
            status: project.status
          }, null, _parent));
          _push(`</td><td class="min-w-[150px]"><div class="flex items-center gap-3">`);
          _push(ssrRenderComponent(_component_UProgress, {
            value: project.progress,
            size: "xs",
            class: "min-w-[80px]"
          }, null, _parent));
          _push(`<span class="metric-value text-sm">${ssrInterpolate(project.progress)}%</span></div></td><td class="text-sm">${ssrInterpolate(riskLabel(project))}</td><td><p>${ssrInterpolate(project.agency)}</p><p class="mt-1 text-xs text-slate-500">${ssrInterpolate(project.reviewer)}</p></td><td>`);
          _push(ssrRenderComponent(_component_UButton, {
            size: "xs",
            color: "primary",
            variant: "soft",
            to: `/projects/${project.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`打开审阅`);
              } else {
                return [
                  createTextVNode("打开审阅")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td></tr>`);
        });
        _push(`<!--]-->`);
        if (!unref(projectRows).length) {
          _push(`<tr><td colspan="8" class="py-12 text-center text-slate-500">没有符合当前条件的认证项目。</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div>`);
      }
      _push(`</section><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DWx7SZYL.js.map
