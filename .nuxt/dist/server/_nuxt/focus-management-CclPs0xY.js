import { nextTick } from "vue";
import { o, u } from "./keyboard-BCt0ZeLv.js";
var i$1 = Object.defineProperty;
var d = (t, e, r) => e in t ? i$1(t, e, { enumerable: true, configurable: true, writable: true, value: r }) : t[e] = r;
var n = (t, e, r) => (d(t, typeof e != "symbol" ? e + "" : e, r), r);
class s {
  constructor() {
    n(this, "current", this.detect());
    n(this, "currentId", 0);
  }
  set(e) {
    this.current !== e && (this.currentId = 0, this.current = e);
  }
  reset() {
    this.set(this.detect());
  }
  nextId() {
    return ++this.currentId;
  }
  get isServer() {
    return this.current === "server";
  }
  get isClient() {
    return this.current === "client";
  }
  detect() {
    return "server";
  }
}
let c$1 = new s();
function i(r) {
  if (c$1.isServer) return null;
  if (r instanceof Node) return r.ownerDocument;
  if (r != null && r.hasOwnProperty("value")) {
    let n2 = o(r);
    if (n2) return n2.ownerDocument;
  }
  return void 0;
}
let c = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((e) => `${e}:not([tabindex='-1'])`).join(",");
var N = ((n2) => (n2[n2.First = 1] = "First", n2[n2.Previous = 2] = "Previous", n2[n2.Next = 4] = "Next", n2[n2.Last = 8] = "Last", n2[n2.WrapAround = 16] = "WrapAround", n2[n2.NoScroll = 32] = "NoScroll", n2))(N || {}), T = ((o2) => (o2[o2.Error = 0] = "Error", o2[o2.Overflow = 1] = "Overflow", o2[o2.Success = 2] = "Success", o2[o2.Underflow = 3] = "Underflow", o2))(T || {}), F = ((t) => (t[t.Previous = -1] = "Previous", t[t.Next = 1] = "Next", t))(F || {});
function E(e = (void 0).body) {
  return e == null ? [] : Array.from(e.querySelectorAll(c)).sort((r, t) => Math.sign((r.tabIndex || Number.MAX_SAFE_INTEGER) - (t.tabIndex || Number.MAX_SAFE_INTEGER)));
}
var h = ((t) => (t[t.Strict = 0] = "Strict", t[t.Loose = 1] = "Loose", t))(h || {});
function w(e, r = 0) {
  var t;
  return e === ((t = i(e)) == null ? void 0 : t.body) ? false : u(r, { [0]() {
    return e.matches(c);
  }, [1]() {
    let l = e;
    for (; l !== null; ) {
      if (l.matches(c)) return true;
      l = l.parentElement;
    }
    return false;
  } });
}
function _(e) {
  let r = i(e);
  nextTick(() => {
    r && !w(r.activeElement, 0) && S(e);
  });
}
var y = ((t) => (t[t.Keyboard = 0] = "Keyboard", t[t.Mouse = 1] = "Mouse", t))(y || {});
function S(e) {
  e == null || e.focus({ preventScroll: true });
}
let H = ["textarea", "input"].join(",");
function I(e) {
  var r, t;
  return (t = (r = e == null ? void 0 : e.matches) == null ? void 0 : r.call(e, H)) != null ? t : false;
}
function O(e, r = (t) => t) {
  return e.slice().sort((t, l) => {
    let o2 = r(t), i2 = r(l);
    if (o2 === null || i2 === null) return 0;
    let n2 = o2.compareDocumentPosition(i2);
    return n2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : n2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function v(e, r) {
  return P(E(), r, { relativeTo: e });
}
function P(e, r, { sorted: t = true, relativeTo: l = null, skipElements: o2 = [] } = {}) {
  var m;
  let i2 = (m = Array.isArray(e) ? e.length > 0 ? e[0].ownerDocument : void 0 : e == null ? void 0 : e.ownerDocument) != null ? m : void 0, n2 = Array.isArray(e) ? t ? O(e) : e : E(e);
  o2.length > 0 && n2.length > 1 && (n2 = n2.filter((s2) => !o2.includes(s2))), l = l != null ? l : i2.activeElement;
  let x = (() => {
    if (r & 5) return 1;
    if (r & 10) return -1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), p = (() => {
    if (r & 1) return 0;
    if (r & 2) return Math.max(0, n2.indexOf(l)) - 1;
    if (r & 4) return Math.max(0, n2.indexOf(l)) + 1;
    if (r & 8) return n2.length - 1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), L = r & 32 ? { preventScroll: true } : {}, a = 0, d2 = n2.length, u2;
  do {
    if (a >= d2 || a + d2 <= 0) return 0;
    let s2 = p + a;
    if (r & 16) s2 = (s2 + d2) % d2;
    else {
      if (s2 < 0) return 3;
      if (s2 >= d2) return 1;
    }
    u2 = n2[s2], u2 == null || u2.focus(L), a += x;
  } while (u2 !== i2.activeElement);
  return r & 6 && I(u2) && u2.select(), 2;
}
export {
  E,
  N,
  O,
  P,
  S,
  T,
  _,
  c$1 as c,
  h,
  i,
  v,
  w
};
//# sourceMappingURL=focus-management-CclPs0xY.js.map
