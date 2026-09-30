import { _ as __nuxt_component_0 } from "./nuxt-link-C7gFIhDA.js";
import __nuxt_component_1 from "./Badge-D-kRXobJ.js";
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { b as useRoute } from "../server.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/ufo/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/defu/dist/defu.mjs";
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
import "vue-router";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/klona/dist/index.mjs";
import "@vueuse/core";
import "tailwind-merge";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/@unhead/vue/dist/index.mjs";
import "@tanstack/vue-query";
import "./tooltip-DSSfimG6.js";
import "./useButtonGroup-CmlPsf0K.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const navItems = [
      { to: "/", label: "认证项目" },
      { to: "/regulations", label: "法规项目树" },
      { to: "/supplements", label: "批量补件" },
      { to: "/reminders", label: "到期提醒" },
      { to: "/audit", label: "审计记录" }
    ];
    function active(path) {
      if (path === "/") return route.path === "/" || route.path.startsWith("/projects");
      return route.path.startsWith(path);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UBadge = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 text-slate-950" }, _attrs))}><header class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"><div class="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-4 py-3 lg:px-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex min-w-0 items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="flex h-10 w-10 items-center justify-center rounded-md bg-teal-700 font-semibold text-white"${_scopeId}> 认 </span><span class="min-w-0"${_scopeId}><strong class="block truncate text-sm text-slate-900"${_scopeId}>汽车型式认证证据包审阅与补件平台</strong><span class="block text-xs text-slate-500"${_scopeId}>Type Approval Evidence Control / Nuxt 3</span></span>`);
          } else {
            return [
              createVNode("span", { class: "flex h-10 w-10 items-center justify-center rounded-md bg-teal-700 font-semibold text-white" }, " 认 "),
              createVNode("span", { class: "min-w-0" }, [
                createVNode("strong", { class: "block truncate text-sm text-slate-900" }, "汽车型式认证证据包审阅与补件平台"),
                createVNode("span", { class: "block text-xs text-slate-500" }, "Type Approval Evidence Control / Nuxt 3")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="order-3 flex w-full gap-1 overflow-x-auto lg:order-none lg:ml-auto lg:w-auto" aria-label="主导航"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: ["whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium", active(item.to) ? "bg-teal-700 text-white" : "text-slate-600 hover:bg-slate-100"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="ml-auto hidden items-center gap-3 lg:flex"><div class="text-right"><p class="text-xs text-slate-500">当前角色</p><p class="text-sm font-medium">认证机构审阅人</p></div>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: "teal",
        variant: "soft"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`在线`);
          } else {
            return [
              createTextVNode("在线")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></header><main class="mx-auto max-w-[1600px] px-4 py-5 lg:px-6 lg:py-7">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=default-C-Ohij6x.js.map
