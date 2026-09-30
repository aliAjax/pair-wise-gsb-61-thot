import { mergeProps, defineComponent, toRef, computed, useSSRContext } from "vue";
import { twJoin } from "tailwind-merge";
import { u as useUI } from "./tooltip-DSSfimG6.js";
import { u as useFormGroup } from "./useFormGroup-DqE91r20.js";
import { _ as _export_sfc, t as twMerge, c as appConfig, m as mergeConfig } from "../server.mjs";
import { ssrRenderAttrs, ssrGetDynamicModelProps, ssrRenderClass, ssrRenderStyle } from "vue/server-renderer";
import "@vueuse/core";
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
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
import "@tanstack/vue-query";
const range = {
  wrapper: "relative w-full flex items-center",
  base: "w-full absolute appearance-none cursor-pointer disabled:cursor-not-allowed disabled:bg-opacity-50 focus:outline-none peer group",
  rounded: "rounded-lg",
  background: "bg-transparent",
  ring: "focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
  progress: {
    base: "absolute pointer-events-none peer-disabled:bg-opacity-50",
    rounded: "rounded-s-lg",
    background: "bg-{color}-500 dark:bg-{color}-400",
    size: {
      "2xs": "h-px",
      "xs": "h-0.5",
      "sm": "h-1",
      "md": "h-2",
      "lg": "h-3",
      "xl": "h-4",
      "2xl": "h-5"
    }
  },
  thumb: {
    base: "[&::-webkit-slider-thumb]:relative [&::-moz-range-thumb]:relative [&::-webkit-slider-thumb]:z-[1] [&::-moz-range-thumb]:z-[1] [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0",
    color: "text-{color}-500 dark:text-{color}-400",
    background: "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:dark:bg-gray-900 [&::-moz-range-thumb]:bg-current",
    ring: "[&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-current",
    size: {
      "2xs": "[&::-webkit-slider-thumb]:h-1.5 [&::-moz-range-thumb]:h-1.5 [&::-webkit-slider-thumb]:w-1.5 [&::-moz-range-thumb]:w-1.5 [&::-webkit-slider-thumb]:mt-[-2.5px] [&::-moz-range-thumb]:mt-[-2.5px]",
      "xs": "[&::-webkit-slider-thumb]:h-2 [&::-moz-range-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-moz-range-thumb]:w-2 [&::-webkit-slider-thumb]:mt-[-3px] [&::-moz-range-thumb]:mt-[-3px]",
      "sm": "[&::-webkit-slider-thumb]:h-3 [&::-moz-range-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-moz-range-thumb]:w-3 [&::-webkit-slider-thumb]:-mt-1 [&::-moz-range-thumb]:-mt-1",
      "md": "[&::-webkit-slider-thumb]:h-4 [&::-moz-range-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-moz-range-thumb]:w-4 [&::-webkit-slider-thumb]:-mt-1 [&::-moz-range-thumb]:-mt-1",
      "lg": "[&::-webkit-slider-thumb]:h-5 [&::-moz-range-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-moz-range-thumb]:w-5 [&::-webkit-slider-thumb]:-mt-1 [&::-moz-range-thumb]:-mt-1",
      "xl": "[&::-webkit-slider-thumb]:h-6 [&::-moz-range-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-moz-range-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-1 [&::-moz-range-thumb]:-mt-1",
      "2xl": "[&::-webkit-slider-thumb]:h-7 [&::-moz-range-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-moz-range-thumb]:w-7 [&::-webkit-slider-thumb]:-mt-1 [&::-moz-range-thumb]:-mt-1"
    }
  },
  track: {
    base: "[&::-webkit-slider-runnable-track]:group-disabled:bg-opacity-50 [&::-moz-range-track]:group-disabled:bg-opacity-50",
    background: "[&::-webkit-slider-runnable-track]:bg-gray-200 [&::-moz-range-track]:bg-gray-200 [&::-webkit-slider-runnable-track]:dark:bg-gray-700 [&::-moz-range-track]:dark:bg-gray-700",
    rounded: "[&::-webkit-slider-runnable-track]:rounded-lg [&::-moz-range-track]:rounded-lg",
    size: {
      "2xs": "[&::-webkit-slider-runnable-track]:h-px [&::-moz-range-track]:h-px",
      "xs": "[&::-webkit-slider-runnable-track]:h-0.5 [&::-moz-range-track]:h-0.5",
      "sm": "[&::-webkit-slider-runnable-track]:h-1 [&::-moz-range-track]:h-1",
      "md": "[&::-webkit-slider-runnable-track]:h-2 [&::-moz-range-track]:h-2",
      "lg": "[&::-webkit-slider-runnable-track]:h-3 [&::-moz-range-track]:h-3",
      "xl": "[&::-webkit-slider-runnable-track]:h-4 [&::-moz-range-track]:h-4",
      "2xl": "[&::-webkit-slider-runnable-track]:h-5 [&::-moz-range-track]:h-5"
    }
  },
  size: {
    "2xs": "h-1.5",
    "xs": "h-2",
    "sm": "h-3",
    "md": "h-4",
    "lg": "h-5",
    "xl": "h-6",
    "2xl": "h-7"
  },
  default: {
    size: "md",
    color: "primary"
  }
};
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.range, range);
const _sfc_main = defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    size: {
      type: String,
      default: null,
      validator(value) {
        return Object.keys(config.size).includes(value);
      }
    },
    color: {
      type: String,
      default: () => config.default.color,
      validator(value) {
        return appConfig.ui.colors.includes(value);
      }
    },
    inputClass: {
      type: String,
      default: null
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
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { ui, attrs } = useUI("range", toRef(props, "ui"), config);
    const { emitFormChange, inputId, color, size, name } = useFormGroup(props, config);
    const value = computed({
      get() {
        return props.modelValue;
      },
      set(value2) {
        emit("update:modelValue", value2);
      }
    });
    const onChange = (event) => {
      emit("change", event.target.value);
      emitFormChange();
    };
    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.size[size.value]
      ), props.class);
    });
    const inputClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.background,
        ui.value.rounded,
        color.value && ui.value.ring.replaceAll("{color}", color.value),
        ui.value.size[size.value]
      ), props.inputClass);
    });
    const thumbClass = computed(() => {
      return twJoin(
        ui.value.thumb.base,
        // Intermediate class to allow thumb ring or background color (set to `current`) as it's impossible to safelist with arbitrary values
        color.value && ui.value.thumb.color.replaceAll("{color}", color.value),
        ui.value.thumb.ring,
        ui.value.thumb.background,
        ui.value.thumb.size[size.value]
      );
    });
    const trackClass = computed(() => {
      return twJoin(
        ui.value.track.base,
        ui.value.track.background,
        ui.value.track.rounded,
        ui.value.track.size[size.value]
      );
    });
    const progressClass = computed(() => {
      return twJoin(
        ui.value.progress.base,
        ui.value.progress.rounded,
        color.value && ui.value.progress.background.replaceAll("{color}", color.value),
        ui.value.progress.size[size.value]
      );
    });
    const progressStyle = computed(() => {
      const { modelValue, min, max } = props;
      const clampedValue = Math.max(min, Math.min(modelValue, max));
      const relativeValue = (clampedValue - min) / (max - min);
      return {
        width: `${relativeValue * 100}%`
      };
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      name,
      inputId,
      value,
      wrapperClass,
      // eslint-disable-next-line vue/no-dupe-keys
      inputClass,
      thumbClass,
      trackClass,
      progressClass,
      progressStyle,
      onChange
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  let _temp0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.wrapperClass }, _attrs))}><input${ssrRenderAttrs((_temp0 = mergeProps({
    id: _ctx.inputId,
    ref: "input",
    value: _ctx.value,
    name: _ctx.name,
    min: _ctx.min,
    max: _ctx.max,
    disabled: _ctx.disabled,
    step: _ctx.step,
    type: "range",
    class: [_ctx.inputClass, _ctx.thumbClass, _ctx.trackClass]
  }, _ctx.attrs), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, _ctx.value))))}><span class="${ssrRenderClass(_ctx.progressClass)}" style="${ssrRenderStyle(_ctx.progressStyle)}"></span></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/Range.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Range = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  Range as default
};
//# sourceMappingURL=Range-Do5owc_V.js.map
