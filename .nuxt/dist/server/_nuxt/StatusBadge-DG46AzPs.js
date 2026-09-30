import __nuxt_component_1 from "./Badge-D-kRXobJ.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StatusBadge",
  __ssrInlineRender: true,
  props: {
    status: {}
  },
  setup(__props) {
    const labels = {
      draft: "草稿",
      submitted: "已提交",
      under_review: "审阅中",
      supplement_required: "待补件",
      approved: "已批准",
      rejected: "已拒绝",
      missing: "缺失",
      accepted: "已接受",
      resubmit: "需重交"
    };
    const colors = {
      draft: "gray",
      submitted: "blue",
      under_review: "blue",
      supplement_required: "amber",
      approved: "green",
      rejected: "red",
      missing: "gray",
      accepted: "green",
      resubmit: "amber"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = __nuxt_component_1;
      _push(ssrRenderComponent(_component_UBadge, mergeProps({
        color: colors[__props.status],
        variant: "soft"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(labels[__props.status])}`);
          } else {
            return [
              createTextVNode(toDisplayString(labels[__props.status]), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatusBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=StatusBadge-DG46AzPs.js.map
