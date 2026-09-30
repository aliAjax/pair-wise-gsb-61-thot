import { ref, watchEffect } from "vue";
import { i as i$1 } from "./focus-management-CclPs0xY.js";
function r(e) {
  return [e.screenX, e.screenY];
}
function u$1() {
  let e = ref([-1, -1]);
  return { wasMoved(n) {
    let t = r(n);
    return e.value[0] === t[0] && e.value[1] === t[1] ? false : (e.value = t, true);
  }, update(n) {
    e.value = r(n);
  } };
}
function i({ container: e, accept: t, walk: d, enabled: o }) {
  watchEffect(() => {
    let r2 = e.value;
    if (!r2 || o !== void 0 && !o.value) return;
    let l = i$1(e);
    if (!l) return;
    let c2 = Object.assign((f2) => t(f2), { acceptNode: t }), n = l.createTreeWalker(r2, NodeFilter.SHOW_ELEMENT, c2, false);
    for (; n.nextNode(); ) d(n.currentNode);
  });
}
function u(l) {
  throw new Error("Unexpected object: " + l);
}
var c = ((i2) => (i2[i2.First = 0] = "First", i2[i2.Previous = 1] = "Previous", i2[i2.Next = 2] = "Next", i2[i2.Last = 3] = "Last", i2[i2.Specific = 4] = "Specific", i2[i2.Nothing = 5] = "Nothing", i2))(c || {});
function f(l, n) {
  let t = n.resolveItems();
  if (t.length <= 0) return null;
  let r2 = n.resolveActiveIndex(), s = r2 != null ? r2 : -1;
  switch (l.focus) {
    case 0: {
      for (let e = 0; e < t.length; ++e) if (!n.resolveDisabled(t[e], e, t)) return e;
      return r2;
    }
    case 1: {
      s === -1 && (s = t.length);
      for (let e = s - 1; e >= 0; --e) if (!n.resolveDisabled(t[e], e, t)) return e;
      return r2;
    }
    case 2: {
      for (let e = s + 1; e < t.length; ++e) if (!n.resolveDisabled(t[e], e, t)) return e;
      return r2;
    }
    case 3: {
      for (let e = t.length - 1; e >= 0; --e) if (!n.resolveDisabled(t[e], e, t)) return e;
      return r2;
    }
    case 4: {
      for (let e = 0; e < t.length; ++e) if (n.resolveId(t[e], e, t) === l.id) return e;
      return r2;
    }
    case 5:
      return null;
    default:
      u(l);
  }
}
export {
  c,
  f,
  i,
  u$1 as u
};
//# sourceMappingURL=calculate-active-index-BN0T2bP2.js.map
