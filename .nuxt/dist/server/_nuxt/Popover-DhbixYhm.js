import { defineComponent, computed, provide, watchEffect, h, Fragment, ref, inject, shallowRef, resolveComponent, mergeProps, withCtx, renderSlot, createVNode, openBlock, createBlock, Transition, createCommentVNode, toRef, watch, useId, useSSRContext } from "vue";
import { defu } from "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/defu/dist/defu.mjs";
import { n, q, N as N$2, E as E$1, d, v } from "./portal-BvWS8jLA.js";
import { i, o, A, N as N$1, u as u$1, a as o$1, s as s$1 } from "./keyboard-BCt0ZeLv.js";
import { w } from "./use-outside-click-cNhWs2ZY.js";
import { s } from "./use-resolve-button-type-CCTzT7JK.js";
import { f, u } from "./hidden-e5tlhUcy.js";
import { l, i as i$2, t } from "./open-closed-DaveoKA1.js";
import { i as i$1, P, N, E, w as w$1, h as h$1, T } from "./focus-management-CclPs0xY.js";
import { c as arrow, u as useUI } from "./tooltip-DSSfimG6.js";
import { u as usePopper } from "./usePopper-BrvKSG9Z.js";
import { _ as _export_sfc, m as mergeConfig, c as appConfig } from "../server.mjs";
import { ssrRenderComponent, ssrRenderSlot, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderStyle } from "vue/server-renderer";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/hookable/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/h3/dist/index.mjs";
import "pinia";
import "vue-router";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/ufo/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/klona/dist/index.mjs";
import "@vueuse/core";
import "tailwind-merge";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
import "@tanstack/vue-query";
const popover = {
  wrapper: "relative",
  container: "z-50 group",
  trigger: "inline-flex w-full",
  width: "",
  background: "bg-white dark:bg-gray-900",
  shadow: "shadow-lg",
  rounded: "rounded-md",
  ring: "ring-1 ring-gray-200 dark:ring-gray-800",
  base: "overflow-hidden focus:outline-none relative",
  // Syntax for `<Transition>` component https://vuejs.org/guide/built-ins/transition.html#css-based-transitions
  transition: {
    enterActiveClass: "transition ease-out duration-200",
    enterFromClass: "opacity-0 translate-y-1",
    enterToClass: "opacity-100 translate-y-0",
    leaveActiveClass: "transition ease-in duration-150",
    leaveFromClass: "opacity-100 translate-y-0",
    leaveToClass: "opacity-0 translate-y-1"
  },
  overlay: {
    base: "fixed inset-0 transition-opacity z-50",
    background: "bg-gray-200/75 dark:bg-gray-800/75",
    transition: {
      enterActiveClass: "ease-out duration-200",
      enterFromClass: "opacity-0",
      enterToClass: "opacity-100",
      leaveActiveClass: "ease-in duration-150",
      leaveFromClass: "opacity-100",
      leaveToClass: "opacity-0"
    }
  },
  popper: {
    strategy: "fixed"
  },
  default: {
    openDelay: 0,
    closeDelay: 0
  },
  arrow
};
var Se = ((s2) => (s2[s2.Open = 0] = "Open", s2[s2.Closed = 1] = "Closed", s2))(Se || {});
let re = /* @__PURE__ */ Symbol("PopoverContext");
function U(d2) {
  let P2 = inject(re, null);
  if (P2 === null) {
    let s2 = new Error(`<${d2} /> is missing a parent <${ye.name} /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(s2, U), s2;
  }
  return P2;
}
let le = /* @__PURE__ */ Symbol("PopoverGroupContext");
function ae() {
  return inject(le, null);
}
let ue = /* @__PURE__ */ Symbol("PopoverPanelContext");
function ge() {
  return inject(ue, null);
}
let ye = defineComponent({ name: "Popover", inheritAttrs: false, props: { as: { type: [Object, String], default: "div" } }, setup(d2, { slots: P2, attrs: s2, expose: h$2 }) {
  var u2;
  let f2 = ref(null);
  h$2({ el: f2, $el: f2 });
  let t$1 = ref(1), o$12 = ref(null), y = ref(null), v2 = ref(null), m = ref(null), b = computed(() => i$1(f2)), E$2 = computed(() => {
    var L, $;
    if (!o(o$12) || !o(m)) return false;
    for (let x of (void 0).querySelectorAll("body > *")) if (Number(x == null ? void 0 : x.contains(o(o$12))) ^ Number(x == null ? void 0 : x.contains(o(m)))) return true;
    let e = E(), r = e.indexOf(o(o$12)), l2 = (r + e.length - 1) % e.length, g = (r + 1) % e.length, G = e[l2], C = e[g];
    return !((L = o(m)) != null && L.contains(G)) && !(($ = o(m)) != null && $.contains(C));
  }), a = { popoverState: t$1, buttonId: ref(null), panelId: ref(null), panel: m, button: o$12, isPortalled: E$2, beforePanelSentinel: y, afterPanelSentinel: v2, togglePopover() {
    t$1.value = u$1(t$1.value, { [0]: 1, [1]: 0 });
  }, closePopover() {
    t$1.value !== 1 && (t$1.value = 1);
  }, close(e) {
    a.closePopover();
    let r = (() => e ? e instanceof HTMLElement ? e : e.value instanceof HTMLElement ? o(e) : o(a.button) : o(a.button))();
    r == null || r.focus();
  } };
  provide(re, a), t(computed(() => u$1(t$1.value, { [0]: i$2.Open, [1]: i$2.Closed })));
  let S = { buttonId: a.buttonId, panelId: a.panelId, close() {
    a.closePopover();
  } }, c = ae(), I = c == null ? void 0 : c.registerPopover, [F, w$2] = q(), i2 = N$2({ mainTreeNodeRef: c == null ? void 0 : c.mainTreeNodeRef, portals: F, defaultContainers: [o$12, m] });
  function p() {
    var e, r, l2, g;
    return (g = c == null ? void 0 : c.isFocusWithinPopoverGroup()) != null ? g : ((e = b.value) == null ? void 0 : e.activeElement) && (((r = o(o$12)) == null ? void 0 : r.contains(b.value.activeElement)) || ((l2 = o(m)) == null ? void 0 : l2.contains(b.value.activeElement)));
  }
  return watchEffect(() => I == null ? void 0 : I(S)), E$1((u2 = b.value) == null ? void 0 : u2.defaultView, "focus", (e) => {
    var r, l2;
    e.target !== void 0 && e.target instanceof HTMLElement && t$1.value === 0 && (p() || o$12 && m && (i2.contains(e.target) || (r = o(a.beforePanelSentinel)) != null && r.contains(e.target) || (l2 = o(a.afterPanelSentinel)) != null && l2.contains(e.target) || a.closePopover()));
  }, true), w(i2.resolveContainers, (e, r) => {
    var l2;
    a.closePopover(), w$1(r, h$1.Loose) || (e.preventDefault(), (l2 = o(o$12)) == null || l2.focus());
  }, computed(() => t$1.value === 0)), () => {
    let e = { open: t$1.value === 0, close: a.close };
    return h(Fragment, [h(w$2, {}, () => A({ theirProps: { ...d2, ...s2 }, ourProps: { ref: f2 }, slot: e, slots: P2, attrs: s2, name: "Popover" })), h(i2.MainTreeNode)]);
  };
} }), Ge = defineComponent({ name: "PopoverButton", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false }, id: { type: String, default: null } }, inheritAttrs: false, setup(d$1, { attrs: P$1, slots: s$12, expose: h$12 }) {
  var u$2;
  let f$1 = (u$2 = d$1.id) != null ? u$2 : `headlessui-popover-button-${i()}`, t2 = U("PopoverButton"), o$2 = computed(() => i$1(t2.button));
  h$12({ el: t2.button, $el: t2.button });
  let y = ae(), v2 = y == null ? void 0 : y.closeOthers, m = ge(), b = computed(() => m === null ? false : m.value === t2.panelId.value), E$12 = ref(null), a = `headlessui-focus-sentinel-${i()}`;
  b.value || watchEffect(() => {
    t2.button.value = o(E$12);
  });
  let S = s(computed(() => ({ as: d$1.as, type: P$1.type })), E$12);
  function c(e) {
    var r, l2, g, G, C;
    if (b.value) {
      if (t2.popoverState.value === 1) return;
      switch (e.key) {
        case o$1.Space:
        case o$1.Enter:
          e.preventDefault(), (l2 = (r = e.target).click) == null || l2.call(r), t2.closePopover(), (g = o(t2.button)) == null || g.focus();
          break;
      }
    } else switch (e.key) {
      case o$1.Space:
      case o$1.Enter:
        e.preventDefault(), e.stopPropagation(), t2.popoverState.value === 1 && (v2 == null || v2(t2.buttonId.value)), t2.togglePopover();
        break;
      case o$1.Escape:
        if (t2.popoverState.value !== 0) return v2 == null ? void 0 : v2(t2.buttonId.value);
        if (!o(t2.button) || (G = o$2.value) != null && G.activeElement && !((C = o(t2.button)) != null && C.contains(o$2.value.activeElement))) return;
        e.preventDefault(), e.stopPropagation(), t2.closePopover();
        break;
    }
  }
  function I(e) {
    b.value || e.key === o$1.Space && e.preventDefault();
  }
  function F(e) {
    var r, l2;
    d$1.disabled || (b.value ? (t2.closePopover(), (r = o(t2.button)) == null || r.focus()) : (e.preventDefault(), e.stopPropagation(), t2.popoverState.value === 1 && (v2 == null || v2(t2.buttonId.value)), t2.togglePopover(), (l2 = o(t2.button)) == null || l2.focus()));
  }
  function w2(e) {
    e.preventDefault(), e.stopPropagation();
  }
  let i$22 = n();
  function p() {
    let e = o(t2.panel);
    if (!e) return;
    function r() {
      u$1(i$22.value, { [d.Forwards]: () => P(e, N.First), [d.Backwards]: () => P(e, N.Last) }) === T.Error && P(E().filter((g) => g.dataset.headlessuiFocusGuard !== "true"), u$1(i$22.value, { [d.Forwards]: N.Next, [d.Backwards]: N.Previous }), { relativeTo: o(t2.button) });
    }
    r();
  }
  return () => {
    let e = t2.popoverState.value === 0, r = { open: e }, { ...l2 } = d$1, g = b.value ? { ref: E$12, type: S.value, onKeydown: c, onClick: F } : { ref: E$12, id: f$1, type: S.value, "aria-expanded": t2.popoverState.value === 0, "aria-controls": o(t2.panel) ? t2.panelId.value : void 0, disabled: d$1.disabled ? true : void 0, onKeydown: c, onKeyup: I, onClick: F, onMousedown: w2 };
    return h(Fragment, [A({ ourProps: g, theirProps: { ...P$1, ...l2 }, slot: r, attrs: P$1, slots: s$12, name: "PopoverButton" }), e && !b.value && t2.isPortalled.value && h(f, { id: a, features: u.Focusable, "data-headlessui-focus-guard": true, as: "button", type: "button", onFocus: p })]);
  };
} });
defineComponent({ name: "PopoverOverlay", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(d2, { attrs: P2, slots: s2 }) {
  let h2 = U("PopoverOverlay"), f2 = `headlessui-popover-overlay-${i()}`, t2 = l(), o2 = computed(() => t2 !== null ? (t2.value & i$2.Open) === i$2.Open : h2.popoverState.value === 0);
  function y() {
    h2.closePopover();
  }
  return () => {
    let v2 = { open: h2.popoverState.value === 0 };
    return A({ ourProps: { id: f2, "aria-hidden": true, onClick: y }, theirProps: d2, slot: v2, attrs: P2, slots: s2, features: N$1.RenderStrategy | N$1.Static, visible: o2.value, name: "PopoverOverlay" });
  };
} });
let je = defineComponent({ name: "PopoverPanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, focus: { type: Boolean, default: false }, id: { type: String, default: null } }, inheritAttrs: false, setup(d$1, { attrs: P$1, slots: s2, expose: h$12 }) {
  var w2;
  let f$1 = (w2 = d$1.id) != null ? w2 : `headlessui-popover-panel-${i()}`, { focus: t2 } = d$1, o$2 = U("PopoverPanel"), y = computed(() => i$1(o$2.panel)), v2 = `headlessui-focus-sentinel-before-${i()}`, m = `headlessui-focus-sentinel-after-${i()}`;
  h$12({ el: o$2.panel, $el: o$2.panel }), provide(ue, o$2.panelId), watchEffect(() => {
    var p, u2;
    if (!t2 || o$2.popoverState.value !== 0 || !o$2.panel) return;
    let i2 = (p = y.value) == null ? void 0 : p.activeElement;
    (u2 = o(o$2.panel)) != null && u2.contains(i2) || P(o(o$2.panel), N.First);
  });
  let b = l(), E$12 = computed(() => b !== null ? (b.value & i$2.Open) === i$2.Open : o$2.popoverState.value === 0);
  function a(i2) {
    var p, u2;
    switch (i2.key) {
      case o$1.Escape:
        if (o$2.popoverState.value !== 0 || !o(o$2.panel) || y.value && !((p = o(o$2.panel)) != null && p.contains(y.value.activeElement))) return;
        i2.preventDefault(), i2.stopPropagation(), o$2.closePopover(), (u2 = o(o$2.button)) == null || u2.focus();
        break;
    }
  }
  function S(i2) {
    var u2, e, r, l2, g;
    let p = i2.relatedTarget;
    p && o(o$2.panel) && ((u2 = o(o$2.panel)) != null && u2.contains(p) || (o$2.closePopover(), ((r = (e = o(o$2.beforePanelSentinel)) == null ? void 0 : e.contains) != null && r.call(e, p) || (g = (l2 = o(o$2.afterPanelSentinel)) == null ? void 0 : l2.contains) != null && g.call(l2, p)) && p.focus({ preventScroll: true })));
  }
  let c = n();
  function I() {
    let i2 = o(o$2.panel);
    if (!i2) return;
    function p() {
      u$1(c.value, { [d.Forwards]: () => {
        var e;
        P(i2, N.First) === T.Error && ((e = o(o$2.afterPanelSentinel)) == null || e.focus());
      }, [d.Backwards]: () => {
        var u2;
        (u2 = o(o$2.button)) == null || u2.focus({ preventScroll: true });
      } });
    }
    p();
  }
  function F() {
    let i2 = o(o$2.panel);
    if (!i2) return;
    function p() {
      u$1(c.value, { [d.Forwards]: () => {
        let u2 = o(o$2.button), e = o(o$2.panel);
        if (!u2) return;
        let r = E(), l2 = r.indexOf(u2), g = r.slice(0, l2 + 1), C = [...r.slice(l2 + 1), ...g];
        for (let L of C.slice()) if (L.dataset.headlessuiFocusGuard === "true" || e != null && e.contains(L)) {
          let $ = C.indexOf(L);
          $ !== -1 && C.splice($, 1);
        }
        P(C, N.First, { sorted: false });
      }, [d.Backwards]: () => {
        var e;
        P(i2, N.Previous) === T.Error && ((e = o(o$2.button)) == null || e.focus());
      } });
    }
    p();
  }
  return () => {
    let i2 = { open: o$2.popoverState.value === 0, close: o$2.close }, { focus: p, ...u$12 } = d$1, e = { ref: o$2.panel, id: f$1, onKeydown: a, onFocusout: t2 && o$2.popoverState.value === 0 ? S : void 0, tabIndex: -1 };
    return A({ ourProps: e, theirProps: { ...P$1, ...u$12 }, attrs: P$1, slot: i2, slots: { ...s2, default: (...r) => {
      var l2;
      return [h(Fragment, [E$12.value && o$2.isPortalled.value && h(f, { id: v2, ref: o$2.beforePanelSentinel, features: u.Focusable, "data-headlessui-focus-guard": true, as: "button", type: "button", onFocus: I }), (l2 = s2.default) == null ? void 0 : l2.call(s2, ...r), E$12.value && o$2.isPortalled.value && h(f, { id: m, ref: o$2.afterPanelSentinel, features: u.Focusable, "data-headlessui-focus-guard": true, as: "button", type: "button", onFocus: F })])];
    } }, features: N$1.RenderStrategy | N$1.Static, visible: E$12.value, name: "PopoverPanel" });
  };
} });
defineComponent({ name: "PopoverGroup", inheritAttrs: false, props: { as: { type: [Object, String], default: "div" } }, setup(d2, { attrs: P2, slots: s2, expose: h$12 }) {
  let f2 = ref(null), t2 = shallowRef([]), o$12 = computed(() => i$1(f2)), y = v();
  h$12({ el: f2, $el: f2 });
  function v$1(a) {
    let S = t2.value.indexOf(a);
    S !== -1 && t2.value.splice(S, 1);
  }
  function m(a) {
    return t2.value.push(a), () => {
      v$1(a);
    };
  }
  function b() {
    var c;
    let a = o$12.value;
    if (!a) return false;
    let S = a.activeElement;
    return (c = o(f2)) != null && c.contains(S) ? true : t2.value.some((I) => {
      var F, w2;
      return ((F = a.getElementById(I.buttonId.value)) == null ? void 0 : F.contains(S)) || ((w2 = a.getElementById(I.panelId.value)) == null ? void 0 : w2.contains(S));
    });
  }
  function E2(a) {
    for (let S of t2.value) S.buttonId.value !== a && S.close();
  }
  return provide(le, { registerPopover: m, unregisterPopover: v$1, isFocusWithinPopoverGroup: b, closeOthers: E2, mainTreeNodeRef: y.mainTreeNodeRef }), () => h(Fragment, [A({ ourProps: { ref: f2 }, theirProps: { ...d2, ...P2 }, slot: {}, attrs: P2, slots: s2, name: "PopoverGroup" }), h(y.MainTreeNode)]);
} });
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.popover, popover);
const _sfc_main = defineComponent({
  components: {
    HPopover: ye,
    HPopoverButton: Ge,
    HPopoverPanel: je
  },
  inheritAttrs: false,
  props: {
    mode: {
      type: String,
      default: "click",
      validator: (value) => ["click", "hover"].includes(value)
    },
    open: {
      type: Boolean,
      default: void 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    openDelay: {
      type: Number,
      default: () => config.default.openDelay
    },
    closeDelay: {
      type: Number,
      default: () => config.default.closeDelay
    },
    overlay: {
      type: Boolean,
      default: false
    },
    popper: {
      type: Object,
      default: () => ({})
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
  emits: ["update:open"],
  setup(props, { emit }) {
    const { ui, attrs } = useUI("popover", toRef(props, "ui"), config, toRef(props, "class"));
    const popper = computed(() => defu(props.mode === "hover" ? { offsetDistance: 0 } : {}, props.popper, ui.value.popper));
    const [trigger, container] = usePopper(popper.value);
    const popover2 = ref(null);
    const popoverApi = ref(null);
    let openTimeout = null;
    let closeTimeout = null;
    const containerStyle = computed(() => {
      if (props.mode !== "hover") {
        return {};
      }
      const offsetDistance = props.popper?.offsetDistance || ui.value.popper?.offsetDistance || 8;
      const placement = popper.value.placement?.split("-")[0];
      const padding = `${offsetDistance}px`;
      if (placement === "top" || placement === "bottom") {
        return {
          paddingTop: padding,
          paddingBottom: padding
        };
      } else if (placement === "left" || placement === "right") {
        return {
          paddingLeft: padding,
          paddingRight: padding
        };
      } else {
        return {
          paddingTop: padding,
          paddingBottom: padding,
          paddingLeft: padding,
          paddingRight: padding
        };
      }
    });
    function onTouchStart(event) {
      if (!event.cancelable || !popoverApi.value || props.mode === "click") {
        return;
      }
      if (popoverApi.value.popoverState === 0) {
        popoverApi.value.closePopover();
      } else {
        popoverApi.value.togglePopover();
      }
    }
    function onMouseEnter() {
      if (props.mode !== "hover" || !popoverApi.value) {
        return;
      }
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
      }
      if (popoverApi.value.popoverState === 0) {
        return;
      }
      openTimeout = openTimeout || setTimeout(() => {
        if (popoverApi.value.togglePopover) {
          popoverApi.value.togglePopover();
        }
        openTimeout = null;
      }, props.openDelay);
    }
    function onMouseLeave() {
      if (props.mode !== "hover" || !popoverApi.value) {
        return;
      }
      if (openTimeout) {
        clearTimeout(openTimeout);
        openTimeout = null;
      }
      if (popoverApi.value.popoverState === 1) {
        return;
      }
      closeTimeout = closeTimeout || setTimeout(() => {
        if (popoverApi.value.closePopover) {
          popoverApi.value.closePopover();
        }
        closeTimeout = null;
      }, props.closeDelay);
    }
    watch(() => props.open, (newValue, oldValue) => {
      if (!popoverApi.value) return;
      if (oldValue === void 0 || newValue === oldValue) return;
      if (newValue) {
        popoverApi.value.popoverState = 0;
      } else {
        popoverApi.value.closePopover();
      }
    });
    watch(() => popoverApi.value?.popoverState, (newValue, oldValue) => {
      if (oldValue === void 0 || newValue === oldValue) return;
      emit("update:open", newValue === 0);
    });
    s$1(() => useId());
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      popover: popover2,
      // eslint-disable-next-line vue/no-dupe-keys
      popper,
      trigger,
      container,
      containerStyle,
      onTouchStart,
      onMouseEnter,
      onMouseLeave
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_HPopover = resolveComponent("HPopover");
  const _component_HPopoverButton = resolveComponent("HPopoverButton");
  const _component_HPopoverPanel = resolveComponent("HPopoverPanel");
  _push(ssrRenderComponent(_component_HPopover, mergeProps({
    ref: "popover",
    class: _ctx.ui.wrapper
  }, _ctx.attrs, { onMouseleave: _ctx.onMouseLeave }, _attrs), {
    default: withCtx(({ open, close }, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_HPopoverButton, {
          ref: "trigger",
          as: "div",
          disabled: _ctx.disabled,
          class: _ctx.ui.trigger,
          role: "button",
          onMouseenter: _ctx.onMouseEnter,
          onTouchstart: _ctx.onTouchStart
        }, {
          default: withCtx((_, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              ssrRenderSlot(_ctx.$slots, "default", {
                open,
                close
              }, () => {
                _push3(`<button${ssrIncludeBooleanAttr(_ctx.disabled) ? " disabled" : ""}${_scopeId2}> Open </button>`);
              }, _push3, _parent3, _scopeId2);
            } else {
              return [
                renderSlot(_ctx.$slots, "default", {
                  open,
                  close
                }, () => [
                  createVNode("button", { disabled: _ctx.disabled }, " Open ", 8, ["disabled"])
                ])
              ];
            }
          }),
          _: 2
        }, _parent2, _scopeId));
        if (_ctx.overlay) {
          _push2(`<template>`);
          if (open) {
            _push2(`<div class="${ssrRenderClass([_ctx.ui.overlay.base, _ctx.ui.overlay.background])}"${_scopeId}></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</template>`);
        } else {
          _push2(`<!---->`);
        }
        if (open) {
          _push2(`<div class="${ssrRenderClass([_ctx.ui.container, _ctx.ui.width])}" style="${ssrRenderStyle(_ctx.containerStyle)}"${_scopeId}><template><div${_scopeId}>`);
          if (_ctx.popper.arrow) {
            _push2(`<div data-popper-arrow class="${ssrRenderClass(Object.values(_ctx.ui.arrow))}"${_scopeId}></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(ssrRenderComponent(_component_HPopoverPanel, {
            class: [_ctx.ui.base, _ctx.ui.background, _ctx.ui.ring, _ctx.ui.rounded, _ctx.ui.shadow],
            static: ""
          }, {
            default: withCtx((_, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                ssrRenderSlot(_ctx.$slots, "panel", {
                  open,
                  close
                }, null, _push3, _parent3, _scopeId2);
              } else {
                return [
                  renderSlot(_ctx.$slots, "panel", {
                    open,
                    close
                  })
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
          _push2(`</div></template></div>`);
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          createVNode(_component_HPopoverButton, {
            ref: "trigger",
            as: "div",
            disabled: _ctx.disabled,
            class: _ctx.ui.trigger,
            role: "button",
            onMouseenter: _ctx.onMouseEnter,
            onTouchstartPassive: _ctx.onTouchStart
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default", {
                open,
                close
              }, () => [
                createVNode("button", { disabled: _ctx.disabled }, " Open ", 8, ["disabled"])
              ])
            ]),
            _: 2
          }, 1032, ["disabled", "class", "onMouseenter", "onTouchstartPassive"]),
          _ctx.overlay ? (openBlock(), createBlock(Transition, mergeProps({
            key: 0,
            appear: ""
          }, _ctx.ui.overlay.transition), {
            default: withCtx(() => [
              open ? (openBlock(), createBlock("div", {
                key: 0,
                class: [_ctx.ui.overlay.base, _ctx.ui.overlay.background]
              }, null, 2)) : createCommentVNode("", true)
            ]),
            _: 2
          }, 1040)) : createCommentVNode("", true),
          open ? (openBlock(), createBlock("div", {
            key: 1,
            ref: "container",
            class: [_ctx.ui.container, _ctx.ui.width],
            style: _ctx.containerStyle,
            onMouseenter: _ctx.onMouseEnter
          }, [
            createVNode(Transition, mergeProps({ appear: "" }, _ctx.ui.transition), {
              default: withCtx(() => [
                createVNode("div", null, [
                  _ctx.popper.arrow ? (openBlock(), createBlock("div", {
                    key: 0,
                    "data-popper-arrow": "",
                    class: Object.values(_ctx.ui.arrow)
                  }, null, 2)) : createCommentVNode("", true),
                  createVNode(_component_HPopoverPanel, {
                    class: [_ctx.ui.base, _ctx.ui.background, _ctx.ui.ring, _ctx.ui.rounded, _ctx.ui.shadow],
                    static: ""
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "panel", {
                        open,
                        close
                      })
                    ]),
                    _: 2
                  }, 1032, ["class"])
                ])
              ]),
              _: 2
            }, 1040)
          ], 46, ["onMouseenter"])) : createCommentVNode("", true)
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/overlays/Popover.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Popover = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  Popover as default
};
//# sourceMappingURL=Popover-DhbixYhm.js.map
