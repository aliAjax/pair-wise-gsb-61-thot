import { defineComponent, toRef, computed, h } from "vue";
import { twJoin } from "tailwind-merge";
import { u as useUI } from "./tooltip-DSSfimG6.js";
import { g as getSlotsChildren, t as twMerge, m as mergeConfig, c as appConfig } from "../server.mjs";
import { u as useProvideButtonGroup } from "./useButtonGroup-CmlPsf0K.js";
import { b as button } from "./button-Bz5rwL6o.js";
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
import "vue/server-renderer";
const buttonGroup = {
  wrapper: {
    horizontal: "inline-flex -space-x-px",
    vertical: "inline-flex flex-col -space-y-px"
  },
  rounded: "rounded-md",
  shadow: "shadow-sm",
  orientation: {
    "rounded-none": { horizontal: { start: "rounded-s-none", end: "rounded-e-none" }, vertical: { start: "rounded-t-none", end: "rounded-b-none" } },
    "rounded-sm": { horizontal: { start: "rounded-s-sm", end: "rounded-e-sm" }, vertical: { start: "rounded-t-sm", end: "rounded-b-sm" } },
    "rounded": { horizontal: { start: "rounded-s", end: "rounded-e" }, vertical: { start: "rounded-t", end: "rounded-b" } },
    "rounded-md": { horizontal: { start: "rounded-s-md", end: "rounded-e-md" }, vertical: { start: "rounded-t-md", end: "rounded-b-md" } },
    "rounded-lg": { horizontal: { start: "rounded-s-lg", end: "rounded-e-lg" }, vertical: { start: "rounded-t-lg", end: "rounded-b-lg" } },
    "rounded-xl": { horizontal: { start: "rounded-s-xl", end: "rounded-e-xl" }, vertical: { start: "rounded-t-xl", end: "rounded-b-xl" } },
    "rounded-2xl": { horizontal: { start: "rounded-s-2xl", end: "rounded-e-2xl" }, vertical: { start: "rounded-t-2xl", end: "rounded-b-2xl" } },
    "rounded-3xl": { horizontal: { start: "rounded-s-3xl", end: "rounded-e-3xl" }, vertical: { start: "rounded-t-3xl", end: "rounded-b-3xl" } },
    "rounded-full": { horizontal: { start: "rounded-s-full", end: "rounded-e-full" }, vertical: { start: "rounded-t-full", end: "rounded-b-full" } }
  }
};
const buttonConfig = mergeConfig(appConfig.ui.strategy, appConfig.ui.button, button);
const buttonGroupConfig = mergeConfig(appConfig.ui.strategy, appConfig.ui.buttonGroup, buttonGroup);
const ButtonGroup = defineComponent({
  name: "ButtonGroup",
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: null,
      validator(value) {
        return Object.keys(buttonConfig.size).includes(value);
      }
    },
    orientation: {
      type: String,
      default: "horizontal",
      validator(value) {
        return ["horizontal", "vertical"].includes(value);
      }
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
    const { ui, attrs } = useUI("buttonGroup", toRef(props, "ui"), buttonGroupConfig);
    const children = computed(() => getSlotsChildren(slots));
    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper[props.orientation],
        ui.value.rounded,
        ui.value.shadow
      ), props.class);
    });
    const rounded = computed(() => ui.value.orientation[ui.value.rounded][props.orientation]);
    useProvideButtonGroup({ orientation: toRef(props, "orientation"), size: toRef(props, "size"), ui, rounded });
    return () => h("div", { class: wrapperClass.value, ...attrs.value }, children.value);
  }
});
export {
  ButtonGroup as default
};
//# sourceMappingURL=ButtonGroup-s8t5rjeB.js.map
