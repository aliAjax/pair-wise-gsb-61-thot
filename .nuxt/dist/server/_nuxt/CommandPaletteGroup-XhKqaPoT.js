import __nuxt_component_0 from "./Icon-DLyP7dyO.js";
import { _ as __nuxt_component_1 } from "./Avatar-B0JRsgKB.js";
import __nuxt_component_0$1 from "./Kbd-DUQusklq.js";
import { resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, renderSlot, openBlock, createBlock, createCommentVNode, Fragment, renderList, defineComponent, computed, useId, useSSRContext } from "vue";
import { r as rt } from "./combobox-yPzTVLoZ.js";
import { s } from "./keyboard-BCt0ZeLv.js";
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrRenderSlot, ssrRenderStyle } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
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
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/ufo/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/klona/dist/index.mjs";
import "@vueuse/core";
import "tailwind-merge";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/@unhead/vue/dist/index.mjs";
import "@tanstack/vue-query";
import "./tooltip-DSSfimG6.js";
import "@tanstack/vue-virtual";
import "./form-DsUILy5F.js";
import "./active-element-history-Cer4cSOw.js";
import "./micro-task-B6uncIso.js";
import "./use-outside-click-cNhWs2ZY.js";
import "./focus-management-CclPs0xY.js";
import "./use-resolve-button-type-CCTzT7JK.js";
import "./calculate-active-index-BN0T2bP2.js";
import "./hidden-e5tlhUcy.js";
import "./open-closed-DaveoKA1.js";
const _sfc_main = defineComponent({
  components: {
    HComboboxOption: rt,
    UIcon: __nuxt_component_0,
    UAvatar: __nuxt_component_1,
    UKbd: __nuxt_component_0$1
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    query: {
      type: String,
      default: ""
    },
    groupAttribute: {
      type: String,
      required: true
    },
    commandAttribute: {
      type: String,
      required: true
    },
    selectedIcon: {
      type: String,
      required: true
    },
    ui: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const label = computed(() => {
      const label2 = props.group[props.groupAttribute];
      return typeof label2 === "function" ? label2(props.query) : label2;
    });
    function highlight(text, { indices, value }) {
      if (text === value) {
        return "";
      }
      let content = "";
      let nextUnhighlightedIndiceStartingIndex = 0;
      indices.forEach((indice) => {
        const lastIndiceNextIndex = indice[1] + 1;
        const isMatched = lastIndiceNextIndex - indice[0] >= props.query.length;
        content += [
          value.substring(nextUnhighlightedIndiceStartingIndex, indice[0]),
          isMatched && "<mark>",
          value.substring(indice[0], lastIndiceNextIndex),
          isMatched && "</mark>"
        ].filter(Boolean).join("");
        nextUnhighlightedIndiceStartingIndex = lastIndiceNextIndex;
      });
      content += value.substring(nextUnhighlightedIndiceStartingIndex);
      const index = content.indexOf("<mark>");
      if (index > 60) {
        content = `...${content.substring(index - 60)}`;
      }
      return content;
    }
    s(() => useId());
    return {
      label,
      highlight
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_HComboboxOption = resolveComponent("HComboboxOption");
  const _component_UIcon = __nuxt_component_0;
  const _component_UAvatar = __nuxt_component_1;
  const _component_UKbd = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: _ctx.ui.group.wrapper
  }, _attrs))}>`);
  if (_ctx.label) {
    _push(`<h2 class="${ssrRenderClass(_ctx.ui.group.label)}">${ssrInterpolate(_ctx.label)}</h2>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="${ssrRenderClass(_ctx.ui.group.container)}"${ssrRenderAttr("aria-label", _ctx.group[_ctx.groupAttribute])}><!--[-->`);
  ssrRenderList(_ctx.group.commands, (command, index) => {
    _push(ssrRenderComponent(_component_HComboboxOption, {
      key: `${_ctx.group.key}-${index}`,
      value: command,
      disabled: command.disabled,
      as: "template"
    }, {
      default: withCtx(({ active, selected }, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<div class="${ssrRenderClass([_ctx.ui.group.command.base, active ? _ctx.ui.group.command.active : _ctx.ui.group.command.inactive, command.disabled ? "cursor-not-allowed" : "cursor-pointer"])}"${_scopeId}><div class="${ssrRenderClass(_ctx.ui.group.command.container)}"${_scopeId}>`);
          ssrRenderSlot(_ctx.$slots, `${_ctx.group.key}-icon`, {
            group: _ctx.group,
            command,
            active,
            selected
          }, () => {
            if (command.icon) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: command.icon,
                class: [_ctx.ui.group.command.icon.base, active ? _ctx.ui.group.command.icon.active : _ctx.ui.group.command.icon.inactive, command.iconClass],
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
            } else if (command.avatar) {
              _push2(ssrRenderComponent(_component_UAvatar, mergeProps({ ref_for: true }, { size: _ctx.ui.group.command.avatar.size, ...command.avatar }, {
                class: _ctx.ui.group.command.avatar.base,
                "aria-hidden": "true"
              }), null, _parent2, _scopeId));
            } else if (command.chip) {
              _push2(`<span class="${ssrRenderClass(_ctx.ui.group.command.chip.base)}" style="${ssrRenderStyle({ background: `#${command.chip}` })}"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
          }, _push2, _parent2, _scopeId);
          _push2(`<div class="${ssrRenderClass([_ctx.ui.group.command.label, command.disabled && _ctx.ui.group.command.disabled])}"${_scopeId}>`);
          ssrRenderSlot(_ctx.$slots, `${_ctx.group.key}-command`, {
            group: _ctx.group,
            command,
            active,
            selected
          }, () => {
            if (command.prefix) {
              _push2(`<span class="${ssrRenderClass([command.prefixClass || _ctx.ui.group.command.prefix, "flex-shrink-0"])}"${_scopeId}>${ssrInterpolate(command.prefix)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span class="${ssrRenderClass([{ "flex-none": command.suffix || command.matches?.length }, "truncate"])}"${_scopeId}>${ssrInterpolate(command[_ctx.commandAttribute])}</span>`);
            if (command.matches?.length) {
              _push2(`<span class="${ssrRenderClass([command.suffixClass || _ctx.ui.group.command.suffix, "truncate"])}"${_scopeId}>${_ctx.highlight(command[_ctx.commandAttribute], command.matches[0]) ?? ""}</span>`);
            } else if (command.suffix) {
              _push2(`<span class="${ssrRenderClass([command.suffixClass || _ctx.ui.group.command.suffix, "truncate"])}"${_scopeId}>${ssrInterpolate(command.suffix)}</span>`);
            } else {
              _push2(`<!---->`);
            }
          }, _push2, _parent2, _scopeId);
          _push2(`</div></div>`);
          if (selected) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: _ctx.selectedIcon,
              class: _ctx.ui.group.command.selectedIcon.base,
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else if (active && (_ctx.group.active || _ctx.$slots[`${_ctx.group.key}-active`])) {
            ssrRenderSlot(_ctx.$slots, `${_ctx.group.key}-active`, {
              group: _ctx.group,
              command,
              active,
              selected
            }, () => {
              if (_ctx.group.active) {
                _push2(`<span class="${ssrRenderClass(_ctx.ui.group.active)}"${_scopeId}>${ssrInterpolate(_ctx.group.active)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
          } else {
            ssrRenderSlot(_ctx.$slots, `${_ctx.group.key}-inactive`, {
              group: _ctx.group,
              command,
              active,
              selected
            }, () => {
              if (command.shortcuts?.length) {
                _push2(`<span class="${ssrRenderClass(_ctx.ui.group.command.shortcuts)}"${_scopeId}><!--[-->`);
                ssrRenderList(command.shortcuts, (shortcut) => {
                  _push2(ssrRenderComponent(_component_UKbd, { key: shortcut }, {
                    default: withCtx((_, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${ssrInterpolate(shortcut)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(shortcut), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                });
                _push2(`<!--]--></span>`);
              } else if (!command.disabled && _ctx.group.inactive) {
                _push2(`<span class="${ssrRenderClass(_ctx.ui.group.inactive)}"${_scopeId}>${ssrInterpolate(_ctx.group.inactive)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
          }
          _push2(`</div>`);
        } else {
          return [
            createVNode("div", {
              class: [_ctx.ui.group.command.base, active ? _ctx.ui.group.command.active : _ctx.ui.group.command.inactive, command.disabled ? "cursor-not-allowed" : "cursor-pointer"]
            }, [
              createVNode("div", {
                class: _ctx.ui.group.command.container
              }, [
                renderSlot(_ctx.$slots, `${_ctx.group.key}-icon`, {
                  group: _ctx.group,
                  command,
                  active,
                  selected
                }, () => [
                  command.icon ? (openBlock(), createBlock(_component_UIcon, {
                    key: 0,
                    name: command.icon,
                    class: [_ctx.ui.group.command.icon.base, active ? _ctx.ui.group.command.icon.active : _ctx.ui.group.command.icon.inactive, command.iconClass],
                    "aria-hidden": "true"
                  }, null, 8, ["name", "class"])) : command.avatar ? (openBlock(), createBlock(_component_UAvatar, mergeProps({
                    key: 1,
                    ref_for: true
                  }, { size: _ctx.ui.group.command.avatar.size, ...command.avatar }, {
                    class: _ctx.ui.group.command.avatar.base,
                    "aria-hidden": "true"
                  }), null, 16, ["class"])) : command.chip ? (openBlock(), createBlock("span", {
                    key: 2,
                    class: _ctx.ui.group.command.chip.base,
                    style: { background: `#${command.chip}` }
                  }, null, 6)) : createCommentVNode("", true)
                ]),
                createVNode("div", {
                  class: [_ctx.ui.group.command.label, command.disabled && _ctx.ui.group.command.disabled]
                }, [
                  renderSlot(_ctx.$slots, `${_ctx.group.key}-command`, {
                    group: _ctx.group,
                    command,
                    active,
                    selected
                  }, () => [
                    command.prefix ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: ["flex-shrink-0", command.prefixClass || _ctx.ui.group.command.prefix]
                    }, toDisplayString(command.prefix), 3)) : createCommentVNode("", true),
                    createVNode("span", {
                      class: ["truncate", { "flex-none": command.suffix || command.matches?.length }]
                    }, toDisplayString(command[_ctx.commandAttribute]), 3),
                    command.matches?.length ? (openBlock(), createBlock("span", {
                      key: 1,
                      class: ["truncate", command.suffixClass || _ctx.ui.group.command.suffix],
                      innerHTML: _ctx.highlight(command[_ctx.commandAttribute], command.matches[0])
                    }, null, 10, ["innerHTML"])) : command.suffix ? (openBlock(), createBlock("span", {
                      key: 2,
                      class: ["truncate", command.suffixClass || _ctx.ui.group.command.suffix]
                    }, toDisplayString(command.suffix), 3)) : createCommentVNode("", true)
                  ])
                ], 2)
              ], 2),
              selected ? (openBlock(), createBlock(_component_UIcon, {
                key: 0,
                name: _ctx.selectedIcon,
                class: _ctx.ui.group.command.selectedIcon.base,
                "aria-hidden": "true"
              }, null, 8, ["name", "class"])) : active && (_ctx.group.active || _ctx.$slots[`${_ctx.group.key}-active`]) ? renderSlot(_ctx.$slots, `${_ctx.group.key}-active`, {
                group: _ctx.group,
                command,
                active,
                selected
              }, () => [
                _ctx.group.active ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: _ctx.ui.group.active
                }, toDisplayString(_ctx.group.active), 3)) : createCommentVNode("", true)
              ], void 0, 1) : renderSlot(_ctx.$slots, `${_ctx.group.key}-inactive`, {
                group: _ctx.group,
                command,
                active,
                selected
              }, () => [
                command.shortcuts?.length ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: _ctx.ui.group.command.shortcuts
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(command.shortcuts, (shortcut) => {
                    return openBlock(), createBlock(_component_UKbd, { key: shortcut }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(shortcut), 1)
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ], 2)) : !command.disabled && _ctx.group.inactive ? (openBlock(), createBlock("span", {
                  key: 1,
                  class: _ctx.ui.group.inactive
                }, toDisplayString(_ctx.group.inactive), 3)) : createCommentVNode("", true)
              ], void 0, 2)
            ], 2)
          ];
        }
      }),
      _: 2
    }, _parent));
  });
  _push(`<!--]--></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/navigation/CommandPaletteGroup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CommandPaletteGroup = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  CommandPaletteGroup as default
};
//# sourceMappingURL=CommandPaletteGroup-XhKqaPoT.js.map
