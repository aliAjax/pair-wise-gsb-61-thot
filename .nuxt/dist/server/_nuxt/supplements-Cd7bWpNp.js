import __nuxt_component_3 from "./FormGroup-4pa-_EdW.js";
import __nuxt_component_6 from "./Select-B6kLXjTL.js";
import { _ as _sfc_main$1 } from "./StatusBadge-DG46AzPs.js";
import __nuxt_component_7 from "./Textarea-DqjrDef4.js";
import __nuxt_component_2 from "./Button-D8wzsEpq.js";
import { defineComponent, ref, computed, unref, withCtx, isRef, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderAttr } from "vue/server-renderer";
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
import "./Badge-D-kRXobJ.js";
import "./Link-BXfM0-H0.js";
import "./nuxt-link-C7gFIhDA.js";
import "ohash/utils";
import "./link-Bz3Wc5MF.js";
import "./button-Bz5rwL6o.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "supplements",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useCertificationStore();
    const selectedProjectId = ref("");
    const selectedEvidence = ref([]);
    const note = ref("");
    const message = ref("");
    const error = ref("");
    const projectOptions = computed(
      () => store.projects.filter((project) => project.evidence.some((evidence) => ["rejected", "resubmit", "missing"].includes(evidence.status))).map((project) => ({
        label: `${project.id} · ${project.name}`,
        value: project.id
      }))
    );
    const current = computed(() => store.projects.find((project) => project.id === selectedProjectId.value));
    const pendingEvidence = computed(
      () => current.value?.evidence.filter((item) => ["rejected", "resubmit", "missing"].includes(item.status)) ?? []
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UFormGroup = __nuxt_component_3;
      const _component_USelect = __nuxt_component_6;
      const _component_StatusBadge = _sfc_main$1;
      const _component_UTextarea = __nuxt_component_7;
      const _component_UButton = __nuxt_component_2;
      _push(`<!--[--><div class="mb-6"><h1 class="text-2xl font-semibold">批量补件工作区</h1><p class="mt-1 text-sm text-slate-600">将退回项统一更新到当前软件基线，并记录补件范围和影响配置。</p></div>`);
      if (unref(message)) {
        _push(`<div class="mb-4 border border-green-200 bg-green-50 p-3 text-sm text-green-900">${ssrInterpolate(unref(message))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(error)) {
        _push(`<div class="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-900">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-6 xl:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]"><section class="border border-slate-200 bg-white p-5">`);
      _push(ssrRenderComponent(_component_UFormGroup, { label: "认证项目" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_USelect, {
              modelValue: unref(selectedProjectId),
              "onUpdate:modelValue": ($event) => isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
              options: unref(projectOptions)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_USelect, {
                modelValue: unref(selectedProjectId),
                "onUpdate:modelValue": ($event) => isRef(selectedProjectId) ? selectedProjectId.value = $event : null,
                options: unref(projectOptions)
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(current)) {
        _push(`<div class="mt-5 space-y-3 text-sm"><div><p class="text-slate-500">车型配置</p><p class="mt-1 font-medium">${ssrInterpolate(unref(current).modelCode)} · ${ssrInterpolate(unref(current).configuration)}</p></div><div><p class="text-slate-500">当前版本基线</p><p class="mt-1 font-medium">${ssrInterpolate(unref(current).maintenanceVersion)} / SW ${ssrInterpolate(unref(current).softwareVersion)}</p></div><div><p class="text-slate-500">待补件数量</p><p class="metric-value mt-1 text-2xl font-semibold">${ssrInterpolate(unref(pendingEvidence).length)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="border border-slate-200 bg-white"><div class="border-b border-slate-200 px-4 py-3"><h2 class="font-semibold">选择待补件证据</h2><p class="mt-1 text-xs text-slate-500">提交后证据状态变为已提交，软件版本自动更新为项目基线。</p></div><form class="p-4"><div class="space-y-3"><!--[-->`);
      ssrRenderList(unref(pendingEvidence), (item) => {
        _push(`<label class="flex gap-3 border border-slate-200 p-4"><input${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEvidence)) ? ssrLooseContain(unref(selectedEvidence), item.id) : unref(selectedEvidence)) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", item.id)} class="mt-1"><span class="min-w-0 flex-1"><span class="flex flex-wrap items-center justify-between gap-2"><strong class="text-sm">${ssrInterpolate(item.name)}</strong>`);
        _push(ssrRenderComponent(_component_StatusBadge, {
          status: item.status
        }, null, _parent));
        _push(`</span><span class="mt-2 block text-sm text-slate-600">${ssrInterpolate(item.note)}</span><span class="mt-2 block text-xs text-slate-500">${ssrInterpolate(item.regulationId)} · 文件 ${ssrInterpolate(item.version)} · 软件 ${ssrInterpolate(item.softwareVersion)} · ${ssrInterpolate(item.configurations.join("、"))}</span></span></label>`);
      });
      _push(`<!--]-->`);
      if (!unref(pendingEvidence).length) {
        _push(`<p class="py-10 text-center text-sm text-slate-500">没有待补件证据。</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-5">`);
      _push(ssrRenderComponent(_component_UFormGroup, { label: "批量补件说明" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UTextarea, {
              modelValue: unref(note),
              "onUpdate:modelValue": ($event) => isRef(note) ? note.value = $event : null,
              rows: 4,
              placeholder: "填写新增测试、说明文件、版本核对和配置覆盖结论"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UTextarea, {
                modelValue: unref(note),
                "onUpdate:modelValue": ($event) => isRef(note) ? note.value = $event : null,
                rows: 4,
                placeholder: "填写新增测试、说明文件、版本核对和配置覆盖结论"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        color: "primary",
        class: "mt-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`提交批量补件`);
          } else {
            return [
              createTextVNode("提交批量补件")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form></section></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/supplements.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=supplements-Cd7bWpNp.js.map
