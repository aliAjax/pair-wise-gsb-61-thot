import { _ as __nuxt_component_0 } from "./nuxt-link-C7gFIhDA.js";
import __nuxt_component_1 from "./Badge-D-kRXobJ.js";
import __nuxt_component_2 from "./Button-D8wzsEpq.js";
import { defineComponent, computed, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { u as useCertificationStore } from "./certification-DojyOQvk.js";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/hookable/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/h3/dist/index.mjs";
import "pinia";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/defu/dist/defu.mjs";
import "vue-router";
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
import "./tooltip-DSSfimG6.js";
import "./useButtonGroup-CmlPsf0K.js";
import "./Link-BXfM0-H0.js";
import "ohash/utils";
import "./link-Bz3Wc5MF.js";
import "./button-Bz5rwL6o.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "reminders",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useCertificationStore();
    const today = /* @__PURE__ */ new Date("2026-09-29");
    const reminders = computed(
      () => store.projects.flatMap((project) => {
        const items = [
          {
            project,
            name: "认证证书",
            expiresAt: project.certificateExpiry,
            status: project.status,
            impact: `${project.configuration} 全部配置`
          },
          ...project.evidence.filter((evidence) => evidence.expiryDate).map((evidence) => ({
            project,
            name: evidence.name,
            expiresAt: evidence.expiryDate,
            status: evidence.status,
            impact: evidence.configurations.join("、")
          }))
        ];
        return items;
      }).filter((item) => new Date(item.expiresAt) <= /* @__PURE__ */ new Date("2027-03-31")).map((item) => ({
        ...item,
        days: Math.ceil((new Date(item.expiresAt).getTime() - today.getTime()) / 864e5)
      })).sort((a, b) => a.days - b.days)
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UBadge = __nuxt_component_1;
      const _component_UButton = __nuxt_component_2;
      _push(`<!--[--><div class="mb-6"><h1 class="text-2xl font-semibold">证书与证据到期提醒</h1><p class="mt-1 text-sm text-slate-600">按 180 天窗口检查证书、测试报告和豁免材料，明确影响配置与续证动作。</p></div><section class="border border-slate-200 bg-white"><div class="border-b border-slate-200 px-4 py-3"><h2 class="font-semibold">到期队列</h2><p class="mt-1 text-xs text-slate-500">共 ${ssrInterpolate(unref(reminders).length)} 项，以 2026-09-29 为基准日。</p></div><div class="overflow-x-auto"><table class="data-table min-w-[920px]"><thead><tr><th>项目</th><th>到期对象</th><th>到期日</th><th>剩余天数</th><th>影响配置</th><th>动作</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(reminders), (item) => {
        _push(`<tr><td>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/projects/${item.project.id}`,
          class: "font-semibold text-teal-700 hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.project.id)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.project.id), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<p class="mt-1 text-sm text-slate-500">${ssrInterpolate(item.project.name)}</p></td><td>${ssrInterpolate(item.name)}</td><td>${ssrInterpolate(item.expiresAt)}</td><td>`);
        _push(ssrRenderComponent(_component_UBadge, {
          color: item.days < 30 ? "red" : item.days < 90 ? "amber" : "blue",
          variant: "soft"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.days)} 天 `);
            } else {
              return [
                createTextVNode(toDisplayString(item.days) + " 天 ", 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td>${ssrInterpolate(item.impact)}</td><td>`);
        _push(ssrRenderComponent(_component_UButton, {
          size: "xs",
          color: "primary",
          variant: "soft",
          to: `/projects/${item.project.id}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`检查续证`);
            } else {
              return [
                createTextVNode("检查续证")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td></tr>`);
      });
      _push(`<!--]-->`);
      if (!unref(reminders).length) {
        _push(`<tr><td colspan="6" class="py-12 text-center text-slate-500">当前窗口内没有到期对象。</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></section><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reminders.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=reminders-BiGwQJaT.js.map
