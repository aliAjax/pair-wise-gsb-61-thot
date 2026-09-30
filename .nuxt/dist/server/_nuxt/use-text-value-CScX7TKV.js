import { ref } from "vue";
import { o as o$1 } from "./keyboard-BCt0ZeLv.js";
let a = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
function o(e) {
  var r, i;
  let n = (r = e.innerText) != null ? r : "", t = e.cloneNode(true);
  if (!(t instanceof HTMLElement)) return n;
  let u = false;
  for (let f of t.querySelectorAll('[hidden],[aria-hidden],[role="img"]')) f.remove(), u = true;
  let l = u ? (i = t.innerText) != null ? i : "" : n;
  return a.test(l) && (l = l.replace(a, "")), l;
}
function g(e) {
  let n = e.getAttribute("aria-label");
  if (typeof n == "string") return n.trim();
  let t = e.getAttribute("aria-labelledby");
  if (t) {
    let u = t.split(" ").map((l) => {
      let r = (void 0).getElementById(l);
      if (r) {
        let i = r.getAttribute("aria-label");
        return typeof i == "string" ? i.trim() : o(r).trim();
      }
      return null;
    }).filter(Boolean);
    if (u.length > 0) return u.join(", ");
  }
  return o(e).trim();
}
function p(a2) {
  let t = ref(""), r = ref("");
  return () => {
    let e = o$1(a2);
    if (!e) return "";
    let l = e.innerText;
    if (t.value === l) return r.value;
    let u = g(e).trim().toLowerCase();
    return t.value = l, r.value = u, u;
  };
}
export {
  p
};
//# sourceMappingURL=use-text-value-CScX7TKV.js.map
