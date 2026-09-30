import __nuxt_component_0 from "./Notification-BcoZqF98.js";
import { mergeProps, createSlots, renderList, withCtx, renderSlot, defineComponent, toRef, computed, useSSRContext } from "vue";
import { twJoin } from "tailwind-merge";
import { u as useUI } from "./tooltip-DSSfimG6.js";
import { q as useState, _ as _export_sfc, t as twMerge, m as mergeConfig, c as appConfig } from "../server.mjs";
import { ssrRenderTeleport, ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import "./Icon-DLyP7dyO.js";
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
import "./Avatar-B0JRsgKB.js";
import "./Button-D8wzsEpq.js";
import "./Link-BXfM0-H0.js";
import "./nuxt-link-C7gFIhDA.js";
import "ohash/utils";
import "./link-Bz3Wc5MF.js";
import "./useButtonGroup-CmlPsf0K.js";
import "./button-Bz5rwL6o.js";
const notifications = {
  wrapper: "fixed flex flex-col justify-end z-[55]",
  position: "bottom-0 end-0",
  width: "w-full sm:w-96",
  container: "px-4 sm:px-6 py-6 space-y-3 overflow-y-auto"
};
function useToast() {
  const notifications2 = useState("notifications", () => []);
  function add(notification) {
    const body = {
      id: (/* @__PURE__ */ new Date()).getTime().toString(),
      ...notification
    };
    const index = notifications2.value.findIndex((n) => n.id === body.id);
    if (index === -1) {
      notifications2.value.push(body);
    }
    return body;
  }
  function remove(id) {
    notifications2.value = notifications2.value.filter((n) => n.id !== id);
  }
  function update(id, notification) {
    const index = notifications2.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      const previous = notifications2.value[index];
      notifications2.value.splice(index, 1, { ...previous, ...notification });
    }
  }
  function clear() {
    notifications2.value = [];
  }
  return {
    add,
    remove,
    update,
    clear
  };
}
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.notifications, notifications);
const _sfc_main = defineComponent({
  components: {
    UNotification: __nuxt_component_0
  },
  inheritAttrs: false,
  props: {
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
    const { ui, attrs } = useUI("notifications", toRef(props, "ui"), config);
    const toast = useToast();
    const notifications2 = useState("notifications", () => []);
    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.position,
        ui.value.width
      ), props.class);
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      toast,
      notifications: notifications2,
      wrapperClass
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_UNotification = __nuxt_component_0;
  ssrRenderTeleport(_push, (_push2) => {
    if (_ctx.notifications.length) {
      _push2(`<div${ssrRenderAttrs(mergeProps({
        class: _ctx.wrapperClass,
        role: "region"
      }, _ctx.attrs))}><div class="${ssrRenderClass(_ctx.ui.container)}"><!--[-->`);
      ssrRenderList(_ctx.notifications, (notification) => {
        _push2(`<div>`);
        _push2(ssrRenderComponent(_component_UNotification, mergeProps({ ref_for: true }, notification, {
          class: notification.click && "cursor-pointer",
          onClick: ($event) => notification.click && notification.click(notification),
          onClose: ($event) => _ctx.toast.remove(notification.id)
        }), createSlots({ _: 2 }, [
          renderList(_ctx.$slots, (_, name) => {
            return {
              name,
              fn: withCtx((slotData, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotData), null, _push3, _parent2, _scopeId);
                } else {
                  return [
                    renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotData))
                  ];
                }
              })
            };
          })
        ]), _parent));
        _push2(`</div>`);
      });
      _push2(`<!--]--></div></div>`);
    } else {
      _push2(`<!---->`);
    }
  }, "body", false, _parent);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/overlays/Notifications.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Notifications = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  Notifications as default
};
//# sourceMappingURL=Notifications-DXO9XKGt.js.map
