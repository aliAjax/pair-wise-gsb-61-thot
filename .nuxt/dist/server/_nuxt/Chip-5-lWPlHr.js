import { mergeProps, defineComponent, toRef, computed, useSSRContext } from "vue";
import { twJoin } from "tailwind-merge";
import { u as useUI } from "./tooltip-DSSfimG6.js";
import { _ as _export_sfc, c as appConfig, m as mergeConfig } from "../server.mjs";
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
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
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
import "@tanstack/vue-query";
const chip = {
  wrapper: "relative inline-flex items-center justify-center flex-shrink-0",
  base: "absolute rounded-full ring-1 ring-white dark:ring-gray-900 flex items-center justify-center text-white dark:text-gray-900 font-medium whitespace-nowrap",
  background: "bg-{color}-500 dark:bg-{color}-400",
  position: {
    "top-right": "top-0 right-0",
    "bottom-right": "bottom-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-left": "bottom-0 left-0"
  },
  translate: {
    "top-right": "-translate-y-1/2 translate-x-1/2 transform",
    "bottom-right": "translate-y-1/2 translate-x-1/2 transform",
    "top-left": "-translate-y-1/2 -translate-x-1/2 transform",
    "bottom-left": "translate-y-1/2 -translate-x-1/2 transform"
  },
  size: {
    "3xs": "h-[4px] min-w-[4px] text-[4px] p-px",
    "2xs": "h-[5px] min-w-[5px] text-[5px] p-px",
    "xs": "h-1.5 min-w-[0.375rem] text-[6px] p-px",
    "sm": "h-2 min-w-[0.5rem] text-[7px] p-0.5",
    "md": "h-2.5 min-w-[0.625rem] text-[8px] p-0.5",
    "lg": "h-3 min-w-[0.75rem] text-[10px] p-0.5",
    "xl": "h-3.5 min-w-[0.875rem] text-[11px] p-1",
    "2xl": "h-4 min-w-[1rem] text-[12px] p-1",
    "3xl": "h-5 min-w-[1.25rem] text-[14px] p-1"
  },
  default: {
    size: "sm",
    color: "primary",
    position: "top-right",
    inset: false
  }
};
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.chip, chip);
const _sfc_main = defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: () => config.default.size,
      validator(value) {
        return Object.keys(config.size).includes(value);
      }
    },
    color: {
      type: String,
      default: () => config.default.color,
      validator(value) {
        return ["gray", ...appConfig.ui.colors].includes(value);
      }
    },
    position: {
      type: String,
      default: () => config.default.position,
      validator(value) {
        return Object.keys(config.position).includes(value);
      }
    },
    text: {
      type: [String, Number],
      default: null
    },
    inset: {
      type: Boolean,
      default: () => config.default.inset
    },
    show: {
      type: Boolean,
      default: true
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { ui, attrs } = useUI("chip", toRef(props, "ui"), config, toRef(props, "class"));
    const chipClass = computed(() => {
      return twJoin(
        ui.value.base,
        ui.value.size[props.size],
        ui.value.position[props.position],
        props.inset ? null : ui.value.translate[props.position],
        ui.value.background.replaceAll("{color}", props.color)
      );
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      chipClass
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: _ctx.ui.wrapper
  }, _ctx.attrs, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  if (_ctx.show) {
    _push(`<span class="${ssrRenderClass(_ctx.chipClass)}">`);
    ssrRenderSlot(_ctx.$slots, "content", {}, () => {
      _push(`${ssrInterpolate(_ctx.text)}`);
    }, _push, _parent);
    _push(`</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Chip.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Chip = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  Chip as default
};
//# sourceMappingURL=Chip-5-lWPlHr.js.map
