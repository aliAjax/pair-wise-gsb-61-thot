import __nuxt_component_1 from "./Badge-D-kRXobJ.js";
import __nuxt_component_2 from "./Progress-CwDF88zd.js";
import { _ as _sfc_main$1 } from "./StatusBadge-DG46AzPs.js";
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, toDisplayString, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RegulationTree",
  __ssrInlineRender: true,
  props: {
    regulations: {},
    evidence: {}
  },
  setup(__props) {
    const props = __props;
    const expanded = ref(props.regulations.map((item) => item.id));
    function linkedEvidence(id) {
      return props.evidence.filter((item) => item.regulationId === id);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = __nuxt_component_1;
      const _component_UProgress = __nuxt_component_2;
      const _component_StatusBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "divide-y divide-slate-200 border-y border-slate-200 bg-white" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.regulations, (regulation) => {
        _push(`<section><button type="button" class="flex w-full items-start justify-between gap-4 px-4 py-4 text-left hover:bg-slate-50"><span class="min-w-0"><span class="flex flex-wrap items-center gap-2"><strong class="font-mono text-sm">${ssrInterpolate(regulation.code)}</strong>`);
        _push(ssrRenderComponent(_component_UBadge, {
          color: "gray",
          variant: "soft"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(regulation.category)}`);
            } else {
              return [
                createTextVNode(toDisplayString(regulation.category), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(ssrRenderComponent(_component_UBadge, {
          color: regulation.status === "complete" ? "green" : regulation.status === "conflict" ? "red" : "amber",
          variant: "soft"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(regulation.status === "complete" ? "完整" : regulation.status === "conflict" ? "版本冲突" : "缺失")}`);
            } else {
              return [
                createTextVNode(toDisplayString(regulation.status === "complete" ? "完整" : regulation.status === "conflict" ? "版本冲突" : "缺失"), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</span><span class="mt-1 block text-sm font-medium text-slate-800">${ssrInterpolate(regulation.title)}</span></span><span class="shrink-0 text-sm text-slate-500">${ssrInterpolate(regulation.coverage)}% · ${ssrInterpolate(unref(expanded).includes(regulation.id) ? "收起" : "展开")}</span></button>`);
        if (unref(expanded).includes(regulation.id)) {
          _push(`<div class="border-t border-slate-100 bg-slate-50 px-4 py-4"><div class="mb-3"><div class="mb-1 flex items-center justify-between gap-3 text-xs text-slate-500"><span>配置覆盖</span><span>${ssrInterpolate(regulation.coverage)}%</span></div>`);
          _push(ssrRenderComponent(_component_UProgress, {
            value: regulation.coverage,
            size: "xs"
          }, null, _parent));
          _push(`</div>`);
          if (regulation.issues.length) {
            _push(`<div class="mb-4 space-y-1"><!--[-->`);
            ssrRenderList(regulation.issues, (issue) => {
              _push(`<p class="border-l-2 border-amber-500 pl-3 text-sm text-amber-900">${ssrInterpolate(issue)}</p>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          if (linkedEvidence(regulation.id).length) {
            _push(`<div class="space-y-2"><!--[-->`);
            ssrRenderList(linkedEvidence(regulation.id), (item) => {
              _push(`<div class="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white px-3 py-3"><div><p class="text-sm font-medium">${ssrInterpolate(item.name)}</p><p class="mt-1 text-xs text-slate-500"> 文件版本 ${ssrInterpolate(item.version)} · 软件 ${ssrInterpolate(item.softwareVersion)} · ${ssrInterpolate(item.configurations.join("、"))}</p></div>`);
              _push(ssrRenderComponent(_component_StatusBadge, {
                status: item.status
              }, null, _parent));
              _push(`</div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<p class="text-sm text-slate-500">尚未关联证据文件。</p>`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RegulationTree.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=RegulationTree-B7mQLF6-.js.map
