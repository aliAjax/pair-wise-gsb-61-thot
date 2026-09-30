import { watchEffect, ref, h, defineComponent, provide, inject, computed, getCurrentInstance, watch, Teleport, reactive } from "vue";
import { c, i } from "./focus-management-CclPs0xY.js";
import { a as w } from "./use-outside-click-cNhWs2ZY.js";
import { f as f$1, u as u$1 } from "./hidden-e5tlhUcy.js";
import { o, A } from "./keyboard-BCt0ZeLv.js";
function E(n2, e2, o2, r) {
  c.isServer || watchEffect((t) => {
    n2 = n2 != null ? n2 : void 0, n2.addEventListener(e2, o2, r), t(() => n2.removeEventListener(e2, o2, r));
  });
}
var d$1 = ((r) => (r[r.Forwards = 0] = "Forwards", r[r.Backwards = 1] = "Backwards", r))(d$1 || {});
function n() {
  let o2 = ref(0);
  return w("keydown", (e2) => {
    e2.key === "Tab" && (o2.value = e2.shiftKey ? 1 : 0);
  }), o2;
}
function N({ defaultContainers: o$1 = [], portals: i$1, mainTreeNodeRef: H2 } = {}) {
  let t = ref(null), r = i(t);
  function u2() {
    var l, f2, a;
    let n2 = [];
    for (let e2 of o$1) e2 !== null && (e2 instanceof HTMLElement ? n2.push(e2) : "value" in e2 && e2.value instanceof HTMLElement && n2.push(e2.value));
    if (i$1 != null && i$1.value) for (let e2 of i$1.value) n2.push(e2);
    for (let e2 of (l = r == null ? void 0 : r.querySelectorAll("html > *, body > *")) != null ? l : []) e2 !== (void 0).body && e2 !== (void 0).head && e2 instanceof HTMLElement && e2.id !== "headlessui-portal-root" && (e2.contains(o(t)) || e2.contains((a = (f2 = o(t)) == null ? void 0 : f2.getRootNode()) == null ? void 0 : a.host) || n2.some((M2) => e2.contains(M2)) || n2.push(e2));
    return n2;
  }
  return { resolveContainers: u2, contains(n2) {
    return u2().some((l) => l.contains(n2));
  }, mainTreeNodeRef: t, MainTreeNode() {
    return H2 != null ? null : h(f$1, { features: u$1.Hidden, ref: t });
  } };
}
function v() {
  let o2 = ref(null);
  return { mainTreeNodeRef: o2, MainTreeNode() {
    return h(f$1, { features: u$1.Hidden, ref: o2 });
  } };
}
let e = /* @__PURE__ */ Symbol("ForcePortalRootContext");
function s() {
  return inject(e, false);
}
let u = defineComponent({ name: "ForcePortalRoot", props: { as: { type: [Object, String], default: "template" }, force: { type: Boolean, default: false } }, setup(o2, { slots: t, attrs: r }) {
  return provide(e, o2.force), () => {
    let { force: f2, ...n2 } = o2;
    return A({ theirProps: n2, ourProps: {}, slot: {}, slots: t, attrs: r, name: "ForcePortalRoot" });
  };
} });
function x(e2) {
  let t = i(e2);
  if (!t) {
    if (e2 === null) return null;
    throw new Error(`[Headless UI]: Cannot find ownerDocument for contextElement: ${e2}`);
  }
  let l = t.getElementById("headlessui-portal-root");
  if (l) return l;
  let r = t.createElement("div");
  return r.setAttribute("id", "headlessui-portal-root"), t.body.appendChild(r);
}
const f = /* @__PURE__ */ new WeakMap();
function U(e2) {
  var t;
  return (t = f.get(e2)) != null ? t : 0;
}
function M(e2, t) {
  let l = t(U(e2));
  return l <= 0 ? f.delete(e2) : f.set(e2, l), l;
}
let $ = defineComponent({ name: "Portal", props: { as: { type: [Object, String], default: "div" } }, setup(e2, { slots: t, attrs: l }) {
  let r = ref(null);
  computed(() => i(r));
  let o$1 = s(), u2 = inject(H, null), n2 = ref(o$1 === true || u2 == null ? x(r.value) : u2.resolveTarget());
  n2.value && M(n2.value, (a) => a + 1);
  let c2 = ref(false);
  watchEffect(() => {
    o$1 || u2 != null && (n2.value = u2.resolveTarget());
  });
  let v2 = inject(d, null), g = false;
  getCurrentInstance();
  return watch(r, () => {
    if (g || !v2) return;
    let a = o(r);
    a && (g = true);
  }), () => {
    if (!c2.value || n2.value === null) return null;
    let a = { ref: r, "data-headlessui-portal": "" };
    return h(Teleport, { to: n2.value }, A({ ourProps: a, theirProps: e2, slot: {}, attrs: l, slots: t, name: "Portal" }));
  };
} }), d = /* @__PURE__ */ Symbol("PortalParentContext");
function q() {
  let e2 = inject(d, null), t = ref([]);
  function l(o2) {
    return t.value.push(o2), e2 && e2.register(o2), () => r(o2);
  }
  function r(o2) {
    let u2 = t.value.indexOf(o2);
    u2 !== -1 && t.value.splice(u2, 1), e2 && e2.unregister(o2);
  }
  let i2 = { register: l, unregister: r, portals: t };
  return [t, defineComponent({ name: "PortalWrapper", setup(o2, { slots: u2 }) {
    return provide(d, i2), () => {
      var n2;
      return (n2 = u2.default) == null ? void 0 : n2.call(u2);
    };
  } })];
}
let H = /* @__PURE__ */ Symbol("PortalGroupContext"), z = defineComponent({ name: "PortalGroup", props: { as: { type: [Object, String], default: "template" }, target: { type: Object, default: null } }, setup(e2, { attrs: t, slots: l }) {
  let r = reactive({ resolveTarget() {
    return e2.target;
  } });
  return provide(H, r), () => {
    let { target: i2, ...o2 } = e2;
    return A({ theirProps: o2, ourProps: {}, slot: {}, attrs: t, slots: l, name: "PortalGroup" });
  };
} });
export {
  $,
  E,
  N,
  d$1 as d,
  n,
  q,
  u,
  v,
  z
};
//# sourceMappingURL=portal-BvWS8jLA.js.map
