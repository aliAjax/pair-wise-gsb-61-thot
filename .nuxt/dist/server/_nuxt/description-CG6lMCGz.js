import { ref, provide, computed, defineComponent, unref, inject } from "vue";
import { i, A } from "./keyboard-BCt0ZeLv.js";
let u = /* @__PURE__ */ Symbol("DescriptionContext");
function w() {
  let t = inject(u, null);
  if (t === null) throw new Error("Missing parent");
  return t;
}
function k({ slot: t = ref({}), name: o = "Description", props: s = {} } = {}) {
  let e = ref([]);
  function r(n) {
    return e.value.push(n), () => {
      let i2 = e.value.indexOf(n);
      i2 !== -1 && e.value.splice(i2, 1);
    };
  }
  return provide(u, { register: r, slot: t, name: o, props: s }), computed(() => e.value.length > 0 ? e.value.join(" ") : void 0);
}
defineComponent({ name: "Description", props: { as: { type: [Object, String], default: "p" }, id: { type: String, default: null } }, setup(t, { attrs: o, slots: s }) {
  var n;
  let e = (n = t.id) != null ? n : `headlessui-description-${i()}`, r = w();
  return () => {
    let { name: i2 = "Description", slot: l = ref({}), props: d = {} } = r, { ...c } = t, f = { ...Object.entries(d).reduce((a, [g, m]) => Object.assign(a, { [g]: unref(m) }), {}), id: e };
    return A({ ourProps: f, theirProps: c, slot: l.value, attrs: o, slots: s, name: i2 });
  };
} });
export {
  k
};
//# sourceMappingURL=description-CG6lMCGz.js.map
