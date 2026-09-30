import { ref, watchEffect } from "vue";
import { o } from "./keyboard-BCt0ZeLv.js";
function r(t, e) {
  if (t) return t;
  let n = e != null ? e : "button";
  if (typeof n == "string" && n.toLowerCase() === "button") return "button";
}
function s(t, e) {
  let n = ref(r(t.value.type, t.value.as));
  return watchEffect(() => {
    var u;
    n.value || o(e) && o(e) instanceof HTMLButtonElement && !((u = o(e)) != null && u.hasAttribute("type")) && (n.value = "button");
  }), n;
}
export {
  s
};
//# sourceMappingURL=use-resolve-button-type-CCTzT7JK.js.map
