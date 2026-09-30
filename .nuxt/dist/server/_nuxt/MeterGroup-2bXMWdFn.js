import { defineComponent, toRef, computed, cloneVNode, h } from "vue";
import { twJoin } from "tailwind-merge";
import __nuxt_component_0 from "./Icon-DLyP7dyO.js";
import { u as useUI } from "./tooltip-DSSfimG6.js";
import { g as getSlotsChildren, m as mergeConfig, c as appConfig } from "../server.mjs";
import { m as meter } from "./meter-B60JAxnv.js";
import "./index-B1ESqrck.js";
import "@iconify/vue";
import "@iconify/utils/lib/css/icon";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/perfect-debounce/dist/index.mjs";
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
import "@tanstack/vue-query";
import "vue/server-renderer";
const meterGroup = {
  wrapper: "flex flex-col gap-2 w-full",
  base: "flex flex-row flex-nowrap flex-shrink overflow-hidden",
  background: "bg-gray-200 dark:bg-gray-700",
  transition: "transition-all",
  rounded: "rounded-full",
  shadow: "",
  list: "list-disc list-inside",
  orientation: {
    "rounded-none": { left: "rounded-s-none", right: "rounded-e-none" },
    "rounded-sm": { left: "rounded-s-sm", right: "rounded-e-sm" },
    "rounded": { left: "rounded-s", right: "rounded-e" },
    "rounded-md": { left: "rounded-s-md", right: "rounded-e-md" },
    "rounded-lg": { left: "rounded-s-lg", right: "rounded-e-lg" },
    "rounded-xl": { left: "rounded-s-xl", right: "rounded-e-xl" },
    "rounded-2xl": { left: "rounded-s-2xl", right: "rounded-e-2xl" },
    "rounded-3xl": { left: "rounded-s-3xl", right: "rounded-e-3xl" },
    "rounded-full": { left: "rounded-s-full", right: "rounded-e-full" }
  },
  default: {
    size: "md",
    icon: "i-heroicons-minus-20-solid"
  }
};
const meterConfig = mergeConfig(appConfig.ui.strategy, appConfig.ui.meter, meter);
const meterGroupConfig = mergeConfig(appConfig.ui.strategy, appConfig.ui.meterGroup, meterGroup);
const MeterGroup = defineComponent({
  components: {
    UIcon: __nuxt_component_0
  },
  inheritAttrs: false,
  slots: Object,
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    size: {
      type: String,
      default: () => meterConfig.default.size,
      validator(value) {
        return Object.keys(meterConfig.meter.bar.size).includes(value);
      }
    },
    indicator: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: () => meterGroupConfig.default.icon
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
  setup(props, { slots }) {
    const { ui, attrs } = useUI("meterGroup", toRef(props, "ui"), meterGroupConfig);
    const { ui: uiMeter } = useUI("meter", void 0, meterConfig);
    if (!slots.default) {
      throw new Error("Meter Group has no Meter children.");
    }
    const normalizedMin = computed(() => props.min > props.max ? props.max : props.min);
    const normalizedMax = computed(() => props.max < props.min ? props.min : props.max);
    const children = computed(() => getSlotsChildren(slots));
    const rounded = computed(() => ui.value.orientation[ui.value.rounded]);
    function clampPercent(value, min, max) {
      if (min == max) {
        return value < min ? 0 : 100;
      }
      if (min > max) {
        max = [min, min = max][0];
      }
      const percent2 = (value - min) / (max - min) * 100;
      return Math.max(0, Math.min(100, percent2));
    }
    const labels = computed(() => {
      return children.value.map((node) => node.props.label);
    });
    const percents = computed(() => {
      return children.value.map((node) => clampPercent(node.props.value, props.min, props.max));
    });
    const percent = computed(() => {
      return Math.max(0, Math.max(percents.value.reduce((prev, percent2) => prev + percent2, 0)));
    });
    const clones = computed(() => children.value.map((node, index) => {
      const vProps = {};
      vProps.style = { width: `${percents.value[index]}%` };
      vProps.size = props.size;
      vProps.min = normalizedMin.value;
      vProps.max = normalizedMax.value;
      vProps.ui = node.props?.ui || {};
      vProps.ui.wrapper = node.props?.ui?.wrapper || "";
      vProps.ui.wrapper += [
        node.props?.ui?.wrapper,
        ui.value.background,
        ui.value.transition
      ].filter(Boolean).join(" ");
      vProps.ui.meter = node.props?.ui?.meter || {};
      vProps.ui.meter.background = `bg-${node.props.color}-500 dark:bg-${node.props.color}-400`;
      vProps.ui.meter.rounded = "rounded-none";
      vProps.ui.meter.bar = node.props?.ui?.meter?.bar || {};
      if (index === 0) {
        vProps.ui.meter.rounded = `${rounded.value.left} rounded-e-none`;
      }
      if (index === children.value.length - 1) {
        vProps.ui.meter.rounded = `${rounded.value.right} rounded-s-none`;
      }
      labels.value[index] = node.props.label;
      const clone = cloneVNode(node, vProps);
      delete clone.children?.label;
      delete clone.props?.indicator;
      delete clone.props?.label;
      return clone;
    }));
    const baseClass = computed(() => {
      return twJoin(
        ui.value.base,
        ui.value.background,
        ui.value.rounded,
        ui.value.shadow,
        uiMeter.value.meter.size[props.size]
      );
    });
    const indicatorContainerClass = computed(() => {
      return twJoin(
        uiMeter.value.indicator.container
      );
    });
    const indicatorClass = computed(() => {
      return twJoin(
        uiMeter.value.indicator.text,
        uiMeter.value.indicator.size[props.size]
      );
    });
    const vNodeChildren = computed(() => {
      const vNodeSlots = [
        void 0,
        h("div", { class: baseClass.value }, clones.value),
        void 0
      ];
      if (props.indicator) {
        vNodeSlots[0] = h("div", { class: indicatorContainerClass.value }, [
          h("div", { class: indicatorClass.value, style: { width: `${percent.value}%` } }, Math.round(percent.value) + "%")
        ]);
      } else if (slots.indicator) {
        vNodeSlots[0] = slots.indicator({ percent: percent.value });
      }
      vNodeSlots[2] = h("ol", { class: ui.value.list }, labels.value.map((label, key) => {
        const labelClass = computed(() => {
          return twJoin(
            uiMeter.value.label.base,
            uiMeter.value.label.text,
            uiMeter.value.color[clones.value[key]?.props.color] ?? uiMeter.value.label.color.replaceAll("{color}", clones.value[key]?.props.color ?? uiMeter.value.default.color),
            uiMeter.value.label.size[props.size]
          );
        });
        return h("li", { class: labelClass.value }, [
          h(__nuxt_component_0, { name: clones.value[key]?.props.icon ?? props.icon }),
          `${label} (${Math.round(percents.value[key])}%)`
        ]);
      }));
      return vNodeSlots;
    });
    return () => h("div", { class: ui.value.wrapper, ...attrs.value }, vNodeChildren.value);
  }
});
export {
  MeterGroup as default
};
//# sourceMappingURL=MeterGroup-2bXMWdFn.js.map
