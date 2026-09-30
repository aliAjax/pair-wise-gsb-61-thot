import __nuxt_component_3 from "./FormGroup-4pa-_EdW.js";
import __nuxt_component_6 from "./Select-B6kLXjTL.js";
import __nuxt_component_2 from "./Button-D8wzsEpq.js";
import { defineComponent, ref, computed, withCtx, unref, isRef, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { u as useCertificationStore } from "./certification-DojyOQvk.js";
import "./tooltip-DSSfimG6.js";
import "../server.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/ofetch/dist/node.mjs";
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
import "@tanstack/vue-query";
import "./Icon-DLyP7dyO.js";
import "./index-B1ESqrck.js";
import "@iconify/utils/lib/css/icon";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/perfect-debounce/dist/index.mjs";
import "./useFormGroup-DqE91r20.js";
import "./useButtonGroup-CmlPsf0K.js";
import "./Link-BXfM0-H0.js";
import "./nuxt-link-C7gFIhDA.js";
import "ohash/utils";
import "./link-Bz3Wc5MF.js";
import "./button-Bz5rwL6o.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "audit",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useCertificationStore();
    const selectedProject = ref("all");
    const projectOptions = computed(() => [
      { label: "全部项目", value: "all" },
      ...store.projects.map((project) => ({ label: `${project.id} · ${project.name}`, value: project.id }))
    ]);
    const entries = computed(
      () => store.projects.filter((project) => selectedProject.value === "all" || project.id === selectedProject.value).flatMap(
        (project) => project.audit.map((entry) => ({
          ...entry,
          projectId: project.id,
          projectName: project.name
        }))
      ).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    );
    function exportAudit() {
      const payload = {
        generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        scope: selectedProject.value,
        projects: store.projects.filter((project) => selectedProject.value === "all" || project.id === selectedProject.value).map((project) => ({
          id: project.id,
          status: project.status,
          maintenanceVersion: project.maintenanceVersion,
          softwareVersion: project.softwareVersion,
          versions: project.versions,
          evidence: project.evidence,
          audit: project.audit
        }))
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = (void 0).createElement("a");
      anchor.href = url;
      anchor.download = "vehicle-type-approval-audit-package.json";
      anchor.click();
      URL.revokeObjectURL(url);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UFormGroup = __nuxt_component_3;
      const _component_USelect = __nuxt_component_6;
      const _component_UButton = __nuxt_component_2;
      _push(`<!--[--><div class="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 class="text-2xl font-semibold">审计与提交包</h1><p class="mt-1 text-sm text-slate-600">保留项目变更、证据审阅、状态流转和批量补件的完整轨迹。</p></div><div class="flex flex-wrap items-end gap-3"><div class="min-w-[300px]">`);
      _push(ssrRenderComponent(_component_UFormGroup, { label: "审计范围" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(selectedProject),
              "onUpdate:modelValue": ($event) => isRef(selectedProject) ? selectedProject.value = $event : null,
              options: unref(projectOptions)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_USelect, {
                modelValue: unref(selectedProject),
                "onUpdate:modelValue": ($event) => isRef(selectedProject) ? selectedProject.value = $event : null,
                options: unref(projectOptions)
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        onClick: exportAudit
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`导出提交包`);
          } else {
            return [
              createTextVNode("导出提交包")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><section class="border border-slate-200 bg-white"><div class="border-b border-slate-200 px-4 py-3"><h2 class="font-semibold">审批时间线</h2><p class="mt-1 text-xs text-slate-500">共 ${ssrInterpolate(unref(entries).length)} 条记录</p></div><div class="space-y-5 p-5"><!--[-->`);
      ssrRenderList(unref(entries), (entry) => {
        _push(`<article class="audit-item"><div class="flex flex-wrap items-center justify-between gap-2"><p class="text-sm font-medium">${ssrInterpolate(entry.action)} · ${ssrInterpolate(entry.actor)}</p><span class="text-xs text-slate-500">${ssrInterpolate(entry.createdAt.slice(0, 16).replace("T", " "))}</span></div><p class="mt-1 text-sm text-slate-600">${ssrInterpolate(entry.detail)}</p><p class="mt-1 text-xs text-slate-500">${ssrInterpolate(entry.projectId)} · ${ssrInterpolate(entry.projectName)}</p></article>`);
      });
      _push(`<!--]-->`);
      if (!unref(entries).length) {
        _push(`<p class="py-10 text-center text-sm text-slate-500">没有符合条件的审计记录。</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/audit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=audit-528QmoQR.js.map
