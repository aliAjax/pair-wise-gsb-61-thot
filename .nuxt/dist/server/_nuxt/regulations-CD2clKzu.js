import __nuxt_component_3 from "./FormGroup-4pa-_EdW.js";
import __nuxt_component_6 from "./Select-B6kLXjTL.js";
import __nuxt_component_2 from "./Button-D8wzsEpq.js";
import { _ as _sfc_main$1 } from "./RegulationTree-B7mQLF6-.js";
import { defineComponent, ref, computed, withCtx, unref, isRef, createVNode, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { u as useCertificationStore, r as regulationCatalog } from "./certification-DojyOQvk.js";
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
import "./Badge-D-kRXobJ.js";
import "./Progress-CwDF88zd.js";
import "./StatusBadge-DG46AzPs.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "regulations",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useCertificationStore();
    const selectedCategory = ref("全部");
    const selectedProjectId = ref("TA-2026-118");
    const categories = computed(() => ["全部", ...Array.from(new Set(regulationCatalog.map((item) => item.category)))]);
    const visible = computed(
      () => selectedCategory.value === "全部" ? regulationCatalog : regulationCatalog.filter((item) => item.category === selectedCategory.value)
    );
    const selectedProject = computed(() => store.projectById(selectedProjectId.value));
    const projectOptions = computed(() => store.projects.map((project) => ({ label: `${project.id} · ${project.name}`, value: project.id })));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UFormGroup = __nuxt_component_3;
      const _component_USelect = __nuxt_component_6;
      const _component_UButton = __nuxt_component_2;
      const _component_RegulationTree = _sfc_main$1;
      _push(`<!--[--><div class="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 class="text-2xl font-semibold">法规项目树</h1><p class="mt-1 text-sm text-slate-600">按安全、环保、能耗、软件和部件分类查看证据覆盖与配置完整性。</p></div><div class="min-w-[320px]">`);
      _push(ssrRenderComponent(_component_UFormGroup, { label: "查看认证项目" }, {
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
      _push(`</div></div><div class="mb-5 flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(unref(categories), (category) => {
        _push(ssrRenderComponent(_component_UButton, {
          key: category,
          size: "xs",
          variant: unref(selectedCategory) === category ? "solid" : "soft",
          color: unref(selectedCategory) === category ? "primary" : "gray",
          onClick: ($event) => selectedCategory.value = category
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(category)}`);
            } else {
              return [
                createTextVNode(toDisplayString(category), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (unref(selectedProject)) {
        _push(ssrRenderComponent(_component_RegulationTree, {
          regulations: unref(visible),
          evidence: unref(selectedProject).evidence
        }, null, _parent));
      } else {
        _push(`<div class="border border-red-200 bg-red-50 p-6 text-red-900">未找到所选认证项目。</div>`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/regulations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=regulations-CD2clKzu.js.map
