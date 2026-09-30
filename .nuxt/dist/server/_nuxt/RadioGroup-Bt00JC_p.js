import { _ as __nuxt_component_0, r as radio } from "./Radio-D-Vw8cm5.js";
import { mergeProps, createSlots, withCtx, renderSlot, defineComponent, toRef, provide, computed, useSSRContext } from "vue";
import { u as useUI } from "./tooltip-DSSfimG6.js";
import { u as useFormGroup } from "./useFormGroup-DqE91r20.js";
import { _ as _export_sfc, c as appConfig, m as mergeConfig, i as get } from "../server.mjs";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot, ssrInterpolate, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import "tailwind-merge";
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
const radioGroup = {
  wrapper: "relative flex items-start",
  fieldset: "",
  legend: "text-sm font-medium text-gray-700 dark:text-gray-200 mb-1",
  default: {
    color: "primary"
  }
};
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.radioGroup, radioGroup);
const configRadio = mergeConfig(appConfig.ui.strategy, appConfig.ui.radio, radio);
const _sfc_main = defineComponent({
  components: {
    URadio: __nuxt_component_0
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Object, Boolean],
      default: ""
    },
    name: {
      type: String,
      default: null
    },
    legend: {
      type: String,
      default: null
    },
    options: {
      type: Array,
      default: () => []
    },
    optionAttribute: {
      type: String,
      default: "label"
    },
    valueAttribute: {
      type: String,
      default: "value"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: () => config.default.color,
      validator(value) {
        return appConfig.ui.colors.includes(value);
      }
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    },
    uiRadio: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { ui, attrs } = useUI("radioGroup", toRef(props, "ui"), config, toRef(props, "class"));
    const { ui: uiRadio } = useUI("radio", toRef(props, "uiRadio"), configRadio);
    const { emitFormChange, color, name } = useFormGroup(props, config, false);
    provide("radio-group", { color, name });
    const onUpdate = (value) => {
      emit("update:modelValue", value);
      emit("change", value);
      emitFormChange();
    };
    const guessOptionValue = (option) => {
      return get(option, props.valueAttribute, get(option, props.optionAttribute));
    };
    const guessOptionText = (option) => {
      return get(option, props.optionAttribute, get(option, props.valueAttribute));
    };
    const guessOptionSelected = (option) => {
      return props.modelValue === guessOptionValue(option);
    };
    const normalizeOption = (option) => {
      if (["string", "number", "boolean"].includes(typeof option)) {
        return {
          value: option,
          label: option
        };
      }
      return {
        ...option,
        value: guessOptionValue(option),
        label: guessOptionText(option),
        selected: guessOptionSelected(option)
      };
    };
    const normalizedOptions = computed(() => {
      return props.options.map((option) => normalizeOption(option));
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      // eslint-disable-next-line vue/no-dupe-keys
      uiRadio,
      attrs,
      normalizedOptions,
      onUpdate
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_URadio = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: _ctx.ui.wrapper
  }, _attrs))}><fieldset${ssrRenderAttrs(mergeProps(_ctx.attrs, {
    class: _ctx.ui.fieldset
  }))}>`);
  if (_ctx.legend || _ctx.$slots.legend) {
    _push(`<legend class="${ssrRenderClass(_ctx.ui.legend)}">`);
    ssrRenderSlot(_ctx.$slots, "legend", {}, () => {
      _push(`${ssrInterpolate(_ctx.legend)}`);
    }, _push, _parent);
    _push(`</legend>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<!--[-->`);
  ssrRenderList(_ctx.normalizedOptions, (option) => {
    _push(ssrRenderComponent(_component_URadio, {
      key: option.value,
      label: option.label,
      "model-value": _ctx.modelValue,
      value: option.value,
      help: option.help,
      disabled: option.disabled || _ctx.disabled,
      ui: _ctx.uiRadio,
      onChange: ($event) => _ctx.onUpdate(option.value)
    }, createSlots({ _: 2 }, [
      _ctx.$slots.label ? {
        name: "label",
        fn: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "label", mergeProps({ ref_for: true }, { option, selected: option.selected }), null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "label", mergeProps({ ref_for: true }, { option, selected: option.selected }))
            ];
          }
        }),
        key: "0"
      } : void 0,
      _ctx.$slots.help ? {
        name: "help",
        fn: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "help", mergeProps({ ref_for: true }, { option, selected: option.selected }), null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "help", mergeProps({ ref_for: true }, { option, selected: option.selected }))
            ];
          }
        }),
        key: "1"
      } : void 0
    ]), _parent));
  });
  _push(`<!--]--></fieldset></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/RadioGroup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RadioGroup = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  RadioGroup as default
};
//# sourceMappingURL=RadioGroup-Bt00JC_p.js.map
