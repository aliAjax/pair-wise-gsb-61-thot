import { defineComponent, ref, computed, h, Fragment, watch, shallowRef, watchEffect, provide, inject, nextTick, normalizeClass } from "vue";
import { n, E as E$1, d as d$1, q, N as N$3, u as u$3, $ as $$1, z as z$1 } from "./portal-BvWS8jLA.js";
import { f, u as u$1 } from "./hidden-e5tlhUcy.js";
import { t as t$1, o as o$1 } from "./active-element-history-Cer4cSOw.js";
import { A as A$2, o, u as u$2, i as i$2, N as N$4, a as o$2, S as S$1, T as T$1 } from "./keyboard-BCt0ZeLv.js";
import { i as i$1, S, P, N as N$2, c as c$1 } from "./focus-management-CclPs0xY.js";
import { t as t$2 } from "./micro-task-B6uncIso.js";
import { t as t$3, w as w$1 } from "./use-outside-click-cNhWs2ZY.js";
import { l as l$1, i as i$3, s as s$1, t as t$4 } from "./open-closed-DaveoKA1.js";
import { k } from "./description-CG6lMCGz.js";
function B(t2) {
  if (!t2) return /* @__PURE__ */ new Set();
  if (typeof t2 == "function") return new Set(t2());
  let n2 = /* @__PURE__ */ new Set();
  for (let r of t2.value) {
    let l2 = o(r);
    l2 instanceof HTMLElement && n2.add(l2);
  }
  return n2;
}
var A$1 = ((e) => (e[e.None = 1] = "None", e[e.InitialFocus = 2] = "InitialFocus", e[e.TabLock = 4] = "TabLock", e[e.FocusLock = 8] = "FocusLock", e[e.RestoreFocus = 16] = "RestoreFocus", e[e.All = 30] = "All", e))(A$1 || {});
let ue = Object.assign(defineComponent({ name: "FocusTrap", props: { as: { type: [Object, String], default: "div" }, initialFocus: { type: Object, default: null }, features: { type: Number, default: 30 }, containers: { type: [Object, Function], default: ref(/* @__PURE__ */ new Set()) } }, inheritAttrs: false, setup(t2, { attrs: n$1, slots: r, expose: l2 }) {
  let o$12 = ref(null);
  l2({ el: o$12, $el: o$12 });
  let i2 = computed(() => i$1(o$12)), e = ref(false);
  $({ ownerDocument: i2 }, computed(() => e.value && Boolean(t2.features & 16)));
  let m2 = z({ ownerDocument: i2, container: o$12, initialFocus: computed(() => t2.initialFocus) }, computed(() => e.value && Boolean(t2.features & 2)));
  J({ ownerDocument: i2, container: o$12, containers: t2.containers, previousActiveElement: m2 }, computed(() => e.value && Boolean(t2.features & 8)));
  let f$1 = n();
  function a2(u2) {
    let T2 = o(o$12);
    if (!T2) return;
    ((w2) => w2())(() => {
      u$2(f$1.value, { [d$1.Forwards]: () => {
        P(T2, N$2.First, { skipElements: [u2.relatedTarget] });
      }, [d$1.Backwards]: () => {
        P(T2, N$2.Last, { skipElements: [u2.relatedTarget] });
      } });
    });
  }
  let s2 = ref(false);
  function F(u2) {
    u2.key === "Tab" && (s2.value = true, requestAnimationFrame(() => {
      s2.value = false;
    }));
  }
  function H2(u2) {
    if (!e.value) return;
    let T2 = B(t2.containers);
    o(o$12) instanceof HTMLElement && T2.add(o(o$12));
    let d2 = u2.relatedTarget;
    d2 instanceof HTMLElement && d2.dataset.headlessuiFocusGuard !== "true" && (N$1(T2, d2) || (s2.value ? P(o(o$12), u$2(f$1.value, { [d$1.Forwards]: () => N$2.Next, [d$1.Backwards]: () => N$2.Previous }) | N$2.WrapAround, { relativeTo: u2.target }) : u2.target instanceof HTMLElement && S(u2.target)));
  }
  return () => {
    let u2 = {}, T2 = { ref: o$12, onKeydown: F, onFocusout: H2 }, { features: d2, initialFocus: w2, containers: Q2, ...O } = t2;
    return h(Fragment, [Boolean(d2 & 4) && h(f, { as: "button", type: "button", "data-headlessui-focus-guard": true, onFocus: a2, features: u$1.Focusable }), A$2({ ourProps: T2, theirProps: { ...n$1, ...O }, slot: u2, attrs: n$1, slots: r, name: "FocusTrap" }), Boolean(d2 & 4) && h(f, { as: "button", type: "button", "data-headlessui-focus-guard": true, onFocus: a2, features: u$1.Focusable })]);
  };
} }), { features: A$1 });
function W$1(t2) {
  let n2 = ref(t$1.slice());
  return watch([t2], ([r], [l2]) => {
    l2 === true && r === false ? t$2(() => {
      n2.value.splice(0);
    }) : l2 === false && r === true && (n2.value = t$1.slice());
  }, { flush: "post" }), () => {
    var r;
    return (r = n2.value.find((l2) => l2 != null && l2.isConnected)) != null ? r : null;
  };
}
function $({ ownerDocument: t2 }, n2) {
  W$1(n2);
}
function z({ ownerDocument: t2, container: n2, initialFocus: r }, l2) {
  let o$12 = ref(null);
  ref(false);
  return o$12;
}
function J({ ownerDocument: t2, container: n2, containers: r, previousActiveElement: l2 }, o$12) {
  var i2;
  E$1((i2 = t2.value) == null ? void 0 : i2.defaultView, "focus", (e) => {
    if (!o$12.value) return;
    let m2 = B(r);
    o(n2) instanceof HTMLElement && m2.add(o(n2));
    let f2 = l2.value;
    if (!f2) return;
    let a2 = e.target;
    a2 && a2 instanceof HTMLElement ? N$1(m2, a2) ? (l2.value = a2, S(a2)) : (e.preventDefault(), e.stopPropagation(), S(f2)) : S(l2.value);
  }, true);
}
function N$1(t2, n2) {
  for (let r of t2) if (r.contains(n2)) return true;
  return false;
}
function m$1(t2) {
  let e = shallowRef(t2.getSnapshot());
  return e;
}
function a$1(o2, r) {
  let t2 = o2(), n2 = /* @__PURE__ */ new Set();
  return { getSnapshot() {
    return t2;
  }, subscribe(e) {
    return n2.add(e), () => n2.delete(e);
  }, dispatch(e, ...s2) {
    let i2 = r[e].call(t2, ...s2);
    i2 && (t2 = i2, n2.forEach((c2) => c2()));
  } };
}
function c() {
  let o2;
  return { before({ doc: e }) {
    var l2;
    let n2 = e.documentElement;
    o2 = ((l2 = e.defaultView) != null ? l2 : void 0).innerWidth - n2.clientWidth;
  }, after({ doc: e, d: n2 }) {
    let t2 = e.documentElement, l2 = t2.clientWidth - t2.offsetWidth, r = o2 - l2;
    n2.style(t2, "paddingRight", `${r}px`);
  } };
}
function w() {
  return t$3() ? { before({ doc: r, d: n2, meta: c2 }) {
    function a2(o2) {
      return c2.containers.flatMap((l2) => l2()).some((l2) => l2.contains(o2));
    }
    n2.microTask(() => {
      var s2;
      if ((void 0).getComputedStyle(r.documentElement).scrollBehavior !== "auto") {
        let t2 = o$1();
        t2.style(r.documentElement, "scrollBehavior", "auto"), n2.add(() => n2.microTask(() => t2.dispose()));
      }
      let o2 = (s2 = (void 0).scrollY) != null ? s2 : (void 0).pageYOffset, l2 = null;
      n2.addEventListener(r, "click", (t2) => {
        if (t2.target instanceof HTMLElement) try {
          let e = t2.target.closest("a");
          if (!e) return;
          let { hash: f2 } = new URL(e.href), i2 = r.querySelector(f2);
          i2 && !a2(i2) && (l2 = i2);
        } catch {
        }
      }, true), n2.addEventListener(r, "touchstart", (t2) => {
        if (t2.target instanceof HTMLElement) if (a2(t2.target)) {
          let e = t2.target;
          for (; e.parentElement && a2(e.parentElement); ) e = e.parentElement;
          n2.style(e, "overscrollBehavior", "contain");
        } else n2.style(t2.target, "touchAction", "none");
      }), n2.addEventListener(r, "touchmove", (t2) => {
        if (t2.target instanceof HTMLElement) {
          if (t2.target.tagName === "INPUT") return;
          if (a2(t2.target)) {
            let e = t2.target;
            for (; e.parentElement && e.dataset.headlessuiPortal !== "" && !(e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth); ) e = e.parentElement;
            e.dataset.headlessuiPortal === "" && t2.preventDefault();
          } else t2.preventDefault();
        }
      }, { passive: false }), n2.add(() => {
        var e;
        let t2 = (e = (void 0).scrollY) != null ? e : (void 0).pageYOffset;
        o2 !== t2 && (void 0).scrollTo(0, o2), l2 && l2.isConnected && (l2.scrollIntoView({ block: "nearest" }), l2 = null);
      });
    });
  } } : {};
}
function l() {
  return { before({ doc: e, d: o2 }) {
    o2.style(e.documentElement, "overflow", "hidden");
  } };
}
function m(e) {
  let n2 = {};
  for (let t2 of e) Object.assign(n2, t2(n2));
  return n2;
}
let a = a$1(() => /* @__PURE__ */ new Map(), { PUSH(e, n2) {
  var o2;
  let t2 = (o2 = this.get(e)) != null ? o2 : { doc: e, count: 0, d: o$1(), meta: /* @__PURE__ */ new Set() };
  return t2.count++, t2.meta.add(n2), this.set(e, t2), this;
}, POP(e, n2) {
  let t2 = this.get(e);
  return t2 && (t2.count--, t2.meta.delete(n2)), this;
}, SCROLL_PREVENT({ doc: e, d: n2, meta: t2 }) {
  let o2 = { doc: e, d: n2, meta: m(t2) }, c$12 = [w(), c(), l()];
  c$12.forEach(({ before: r }) => r == null ? void 0 : r(o2)), c$12.forEach(({ after: r }) => r == null ? void 0 : r(o2));
}, SCROLL_ALLOW({ d: e }) {
  e.dispose();
}, TEARDOWN({ doc: e }) {
  this.delete(e);
} });
a.subscribe(() => {
  let e = a.getSnapshot(), n2 = /* @__PURE__ */ new Map();
  for (let [t2] of e) n2.set(t2, t2.documentElement.style.overflow);
  for (let t2 of e.values()) {
    let o2 = n2.get(t2.doc) === "hidden", c2 = t2.count !== 0;
    (c2 && !o2 || !c2 && o2) && a.dispatch(t2.count > 0 ? "SCROLL_PREVENT" : "SCROLL_ALLOW", t2), t2.count === 0 && a.dispatch("TEARDOWN", t2);
  }
});
function d(t2, a$12, n2) {
  let i2 = m$1(a), l2 = computed(() => {
    let e = t2.value ? i2.value.get(t2.value) : void 0;
    return e ? e.count > 0 : false;
  });
  return watch([t2, a$12], ([e, m2], [r], o2) => {
    if (!e || !m2) return;
    a.dispatch("PUSH", e, n2);
    let f2 = false;
    o2(() => {
      f2 || (a.dispatch("POP", r != null ? r : e, n2), f2 = true);
    });
  }, { immediate: true }), l2;
}
let i = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
function E(d2, f2 = ref(true)) {
  watchEffect((o$12) => {
    var a2;
    if (!f2.value) return;
    let e = o(d2);
    if (!e) return;
    o$12(function() {
      var u2;
      if (!e) return;
      let r = (u2 = t.get(e)) != null ? u2 : 1;
      if (r === 1 ? t.delete(e) : t.set(e, r - 1), r !== 1) return;
      let n2 = i.get(e);
      n2 && (n2["aria-hidden"] === null ? e.removeAttribute("aria-hidden") : e.setAttribute("aria-hidden", n2["aria-hidden"]), e.inert = n2.inert, i.delete(e));
    });
    let l2 = (a2 = t.get(e)) != null ? a2 : 0;
    t.set(e, l2 + 1), l2 === 0 && (i.set(e, { "aria-hidden": e.getAttribute("aria-hidden"), inert: e.inert }), e.setAttribute("aria-hidden", "true"), e.inert = true);
  });
}
let u = /* @__PURE__ */ Symbol("StackContext");
var s = ((e) => (e[e.Add = 0] = "Add", e[e.Remove = 1] = "Remove", e))(s || {});
function y() {
  return inject(u, () => {
  });
}
function R$1({ type: o2, enabled: r, element: e, onUpdate: i2 }) {
  let a2 = y();
  function t2(...n2) {
    i2 == null || i2(...n2), a2(...n2);
  }
  provide(u, t2);
}
var Te$1 = ((l2) => (l2[l2.Open = 0] = "Open", l2[l2.Closed = 1] = "Closed", l2))(Te$1 || {});
let H = /* @__PURE__ */ Symbol("DialogContext");
function T(t2) {
  let i2 = inject(H, null);
  if (i2 === null) {
    let l2 = new Error(`<${t2} /> is missing a parent <Dialog /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(l2, T), l2;
  }
  return i2;
}
let A = "DC8F892D-2EBD-447C-A4C8-A03058436FF4", Ye = defineComponent({ name: "Dialog", inheritAttrs: false, props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, open: { type: [Boolean, String], default: A }, initialFocus: { type: Object, default: null }, id: { type: String, default: null }, role: { type: String, default: "dialog" } }, emits: { close: (t2) => true }, setup(t2, { emit: i2, attrs: l2, slots: p, expose: s$12 }) {
  var q$1, W2;
  let n2 = (q$1 = t2.id) != null ? q$1 : `headlessui-dialog-${i$2()}`, u2 = ref(false);
  let r = false, g2 = computed(() => t2.role === "dialog" || t2.role === "alertdialog" ? t2.role : (r || (r = true, console.warn(`Invalid role [${g2}] passed to <Dialog />. Only \`dialog\` and and \`alertdialog\` are supported. Using \`dialog\` instead.`)), "dialog")), D = ref(0), S2 = l$1(), R2 = computed(() => t2.open === A && S2 !== null ? (S2.value & i$3.Open) === i$3.Open : t2.open), m2 = ref(null), E$2 = computed(() => i$1(m2));
  if (s$12({ el: m2, $el: m2 }), !(t2.open !== A || S2 !== null)) throw new Error("You forgot to provide an `open` prop to the `Dialog`.");
  if (typeof R2.value != "boolean") throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${R2.value === A ? void 0 : t2.open}`);
  let c2 = computed(() => u2.value && R2.value ? 0 : 1), k$1 = computed(() => c2.value === 0), w2 = computed(() => D.value > 1), N2 = inject(H, null) !== null, [Q2, X] = q(), { resolveContainers: B2, mainTreeNodeRef: K, MainTreeNode: Z } = N$3({ portals: Q2, defaultContainers: [computed(() => {
    var e;
    return (e = h$1.panelRef.value) != null ? e : m2.value;
  })] }), ee = computed(() => w2.value ? "parent" : "leaf"), U = computed(() => S2 !== null ? (S2.value & i$3.Closing) === i$3.Closing : false), te = computed(() => N2 || U.value ? false : k$1.value), le = computed(() => {
    var e, a2, d2;
    return (d2 = Array.from((a2 = (e = E$2.value) == null ? void 0 : e.querySelectorAll("body > *")) != null ? a2 : []).find((f2) => f2.id === "headlessui-portal-root" ? false : f2.contains(o(K)) && f2 instanceof HTMLElement)) != null ? d2 : null;
  });
  E(le, te);
  let ae = computed(() => w2.value ? true : k$1.value), oe = computed(() => {
    var e, a2, d2;
    return (d2 = Array.from((a2 = (e = E$2.value) == null ? void 0 : e.querySelectorAll("[data-headlessui-portal]")) != null ? a2 : []).find((f2) => f2.contains(o(K)) && f2 instanceof HTMLElement)) != null ? d2 : null;
  });
  E(oe, ae), R$1({ type: "Dialog", enabled: computed(() => c2.value === 0), element: m2, onUpdate: (e, a2) => {
    if (a2 === "Dialog") return u$2(e, { [s.Add]: () => D.value += 1, [s.Remove]: () => D.value -= 1 });
  } });
  let re = k({ name: "DialogDescription", slot: computed(() => ({ open: R2.value })) }), M = ref(null), h$1 = { titleId: M, panelRef: ref(null), dialogState: c2, setTitleId(e) {
    M.value !== e && (M.value = e);
  }, close() {
    i2("close", false);
  } };
  provide(H, h$1);
  let ne = computed(() => !(!k$1.value || w2.value));
  w$1(B2, (e, a2) => {
    e.preventDefault(), h$1.close(), nextTick(() => a2 == null ? void 0 : a2.focus());
  }, ne);
  let ie = computed(() => !(w2.value || c2.value !== 0));
  E$1((W2 = E$2.value) == null ? void 0 : W2.defaultView, "keydown", (e) => {
    ie.value && (e.defaultPrevented || e.key === o$2.Escape && (e.preventDefault(), e.stopPropagation(), h$1.close()));
  });
  let ue$1 = computed(() => !(U.value || c2.value !== 0 || N2));
  return d(E$2, ue$1, (e) => {
    var a2;
    return { containers: [...(a2 = e.containers) != null ? a2 : [], B2] };
  }), watchEffect((e) => {
    if (c2.value !== 0) return;
    let a2 = o(m2);
    if (!a2) return;
    let d2 = new ResizeObserver((f2) => {
      for (let L2 of f2) {
        let x = L2.target.getBoundingClientRect();
        x.x === 0 && x.y === 0 && x.width === 0 && x.height === 0 && h$1.close();
      }
    });
    d2.observe(a2), e(() => d2.disconnect());
  }), () => {
    let { open: e, initialFocus: a2, ...d2 } = t2, f2 = { ...l2, ref: m2, id: n2, role: g2.value, "aria-modal": c2.value === 0 ? true : void 0, "aria-labelledby": M.value, "aria-describedby": re.value }, L2 = { open: c2.value === 0 };
    return h(u$3, { force: true }, () => [h($$1, () => h(z$1, { target: m2.value }, () => h(u$3, { force: false }, () => h(ue, { initialFocus: a2, containers: B2, features: k$1.value ? u$2(ee.value, { parent: ue.features.RestoreFocus, leaf: ue.features.All & ~ue.features.FocusLock }) : ue.features.None }, () => h(X, {}, () => A$2({ ourProps: f2, theirProps: { ...d2, ...l2 }, slot: L2, attrs: l2, slots: p, visible: c2.value === 0, features: N$4.RenderStrategy | N$4.Static, name: "Dialog" })))))), h(Z)]);
  };
} });
defineComponent({ name: "DialogOverlay", props: { as: { type: [Object, String], default: "div" }, id: { type: String, default: null } }, setup(t2, { attrs: i2, slots: l2 }) {
  var u2;
  let p = (u2 = t2.id) != null ? u2 : `headlessui-dialog-overlay-${i$2()}`, s2 = T("DialogOverlay");
  function n2(r) {
    r.target === r.currentTarget && (r.preventDefault(), r.stopPropagation(), s2.close());
  }
  return () => {
    let { ...r } = t2;
    return A$2({ ourProps: { id: p, "aria-hidden": true, onClick: n2 }, theirProps: r, slot: { open: s2.dialogState.value === 0 }, attrs: i2, slots: l2, name: "DialogOverlay" });
  };
} });
defineComponent({ name: "DialogBackdrop", props: { as: { type: [Object, String], default: "div" }, id: { type: String, default: null } }, inheritAttrs: false, setup(t2, { attrs: i2, slots: l2, expose: p }) {
  var r;
  let s2 = (r = t2.id) != null ? r : `headlessui-dialog-backdrop-${i$2()}`, n2 = T("DialogBackdrop"), u2 = ref(null);
  return p({ el: u2, $el: u2 }), () => {
    let { ...g2 } = t2, D = { id: s2, ref: u2, "aria-hidden": true };
    return h(u$3, { force: true }, () => h($$1, () => A$2({ ourProps: D, theirProps: { ...i2, ...g2 }, slot: { open: n2.dialogState.value === 0 }, attrs: i2, slots: l2, name: "DialogBackdrop" })));
  };
} });
let Ge = defineComponent({ name: "DialogPanel", props: { as: { type: [Object, String], default: "div" }, id: { type: String, default: null } }, setup(t2, { attrs: i2, slots: l2, expose: p }) {
  var r;
  let s2 = (r = t2.id) != null ? r : `headlessui-dialog-panel-${i$2()}`, n2 = T("DialogPanel");
  p({ el: n2.panelRef, $el: n2.panelRef });
  function u2(g2) {
    g2.stopPropagation();
  }
  return () => {
    let { ...g2 } = t2, D = { id: s2, ref: n2.panelRef, onClick: u2 };
    return A$2({ ourProps: D, theirProps: g2, slot: { open: n2.dialogState.value === 0 }, attrs: i2, slots: l2, name: "DialogPanel" });
  };
} });
defineComponent({ name: "DialogTitle", props: { as: { type: [Object, String], default: "h2" }, id: { type: String, default: null } }, setup(t2, { attrs: i2, slots: l2 }) {
  var n2;
  let p = (n2 = t2.id) != null ? n2 : `headlessui-dialog-title-${i$2()}`, s2 = T("DialogTitle");
  return () => {
    let { ...u2 } = t2;
    return A$2({ ourProps: { id: p }, theirProps: u2, slot: { open: s2.dialogState.value === 0 }, attrs: i2, slots: l2, name: "DialogTitle" });
  };
} });
function g(e = "") {
  return e.split(/\s+/).filter((t2) => t2.length > 1);
}
let R = /* @__PURE__ */ Symbol("TransitionContext");
var pe = ((a2) => (a2.Visible = "visible", a2.Hidden = "hidden", a2))(pe || {});
function me() {
  return inject(R, null) !== null;
}
function Te() {
  let e = inject(R, null);
  if (e === null) throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
  return e;
}
function ge() {
  let e = inject(N, null);
  if (e === null) throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
  return e;
}
let N = /* @__PURE__ */ Symbol("NestingContext");
function L(e) {
  return "children" in e ? L(e.children) : e.value.filter(({ state: t2 }) => t2 === "visible").length > 0;
}
function Q(e) {
  let t2 = ref([]), a2 = ref(false);
  function s2(n2, r = S$1.Hidden) {
    let l2 = t2.value.findIndex(({ id: f2 }) => f2 === n2);
    l2 !== -1 && (u$2(r, { [S$1.Unmount]() {
      t2.value.splice(l2, 1);
    }, [S$1.Hidden]() {
      t2.value[l2].state = "hidden";
    } }), !L(t2) && a2.value && (e == null || e()));
  }
  function h2(n2) {
    let r = t2.value.find(({ id: l2 }) => l2 === n2);
    return r ? r.state !== "visible" && (r.state = "visible") : t2.value.push({ id: n2, state: "visible" }), () => s2(n2, S$1.Unmount);
  }
  return { children: t2, register: h2, unregister: s2 };
}
let W = N$4.RenderStrategy, he = defineComponent({ props: { as: { type: [Object, String], default: "div" }, show: { type: [Boolean], default: null }, unmount: { type: [Boolean], default: true }, appear: { type: [Boolean], default: false }, enter: { type: [String], default: "" }, enterFrom: { type: [String], default: "" }, enterTo: { type: [String], default: "" }, entered: { type: [String], default: "" }, leave: { type: [String], default: "" }, leaveFrom: { type: [String], default: "" }, leaveTo: { type: [String], default: "" } }, emits: { beforeEnter: () => true, afterEnter: () => true, beforeLeave: () => true, afterLeave: () => true }, setup(e, { emit: t2, attrs: a2, slots: s2, expose: h$1 }) {
  let n2 = ref(0);
  function r() {
    n2.value |= i$3.Opening, t2("beforeEnter");
  }
  function l2() {
    n2.value &= ~i$3.Opening, t2("afterEnter");
  }
  function f2() {
    n2.value |= i$3.Closing, t2("beforeLeave");
  }
  function S2() {
    n2.value &= ~i$3.Closing, t2("afterLeave");
  }
  if (!me() && s$1()) return () => h(Se, { ...e, onBeforeEnter: r, onAfterEnter: l2, onBeforeLeave: f2, onAfterLeave: S2 }, s2);
  let d2 = ref(null), y2 = computed(() => e.unmount ? S$1.Unmount : S$1.Hidden);
  h$1({ el: d2, $el: d2 });
  let { show: v, appear: A2 } = Te(), { register: D, unregister: H2 } = ge(), i2 = ref(v.value ? "visible" : "hidden"), c2 = i$2(), P2 = Q(() => {
    i2.value !== "hidden" && (i2.value = "hidden", H2(c2), S2());
  });
  watchEffect(() => {
    if (y2.value === S$1.Hidden && c2) {
      if (v.value && i2.value !== "visible") {
        i2.value = "visible";
        return;
      }
      u$2(i2.value, { ["hidden"]: () => H2(c2), ["visible"]: () => D(c2) });
    }
  });
  let j = g(e.enter), M = g(e.enterFrom);
  g(e.enterTo);
  g(e.entered);
  g(e.leave);
  g(e.leaveFrom);
  g(e.leaveTo);
  return provide(N, P2), t$4(computed(() => u$2(i2.value, { ["visible"]: i$3.Open, ["hidden"]: i$3.Closed }) | n2.value)), () => {
    let { appear: o2, show: E2, enter: p, enterFrom: V, enterTo: Ce, entered: ye, leave: be, leaveFrom: Ee, leaveTo: Ve, ...U } = e, ne = { ref: d2 }, re = { ...U, ...A2.value && v.value && c$1.isServer ? { class: normalizeClass([a2.class, U.class, ...j, ...M]) } : {} };
    return A$2({ theirProps: re, ourProps: ne, slot: {}, slots: s2, attrs: a2, features: W, visible: i2.value === "visible", name: "TransitionChild" });
  };
} }), ce = he, Se = defineComponent({ inheritAttrs: false, props: { as: { type: [Object, String], default: "div" }, show: { type: [Boolean], default: null }, unmount: { type: [Boolean], default: true }, appear: { type: [Boolean], default: false }, enter: { type: [String], default: "" }, enterFrom: { type: [String], default: "" }, enterTo: { type: [String], default: "" }, entered: { type: [String], default: "" }, leave: { type: [String], default: "" }, leaveFrom: { type: [String], default: "" }, leaveTo: { type: [String], default: "" } }, emits: { beforeEnter: () => true, afterEnter: () => true, beforeLeave: () => true, afterLeave: () => true }, setup(e, { emit: t2, attrs: a2, slots: s2 }) {
  let h$1 = l$1(), n2 = computed(() => e.show === null && h$1 !== null ? (h$1.value & i$3.Open) === i$3.Open : e.show);
  watchEffect(() => {
    if (![true, false].includes(n2.value)) throw new Error('A <Transition /> is used but it is missing a `:show="true | false"` prop.');
  });
  let r = ref(n2.value ? "visible" : "hidden"), l2 = Q(() => {
    r.value = "hidden";
  }), f2 = ref(true), S2 = { show: n2, appear: computed(() => e.appear || !f2.value) };
  return provide(N, l2), provide(R, S2), () => {
    let d2 = T$1(e, ["show", "appear", "unmount", "onBeforeEnter", "onBeforeLeave", "onAfterEnter", "onAfterLeave"]), y2 = { unmount: e.unmount };
    return A$2({ ourProps: { ...y2, as: "template" }, theirProps: {}, slot: {}, slots: { ...s2, default: () => [h(ce, { onBeforeEnter: () => t2("beforeEnter"), onAfterEnter: () => t2("afterEnter"), onBeforeLeave: () => t2("beforeLeave"), onAfterLeave: () => t2("afterLeave"), ...a2, ...y2, ...d2 }, s2.default)] }, attrs: {}, features: W, visible: r.value === "visible", name: "Transition" });
  };
} });
export {
  Ge as G,
  Se as S,
  Ye as Y,
  he as h
};
//# sourceMappingURL=transition-CXfcTVM0.js.map
