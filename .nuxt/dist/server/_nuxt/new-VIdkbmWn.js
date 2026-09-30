import { _ as __nuxt_component_0 } from "./nuxt-link-C7gFIhDA.js";
import __nuxt_component_1 from "./Card-BDqcHC5b.js";
import __nuxt_component_3 from "./FormGroup-4pa-_EdW.js";
import __nuxt_component_4 from "./Input-D0aVKprk.js";
import __nuxt_component_6 from "./Select-B6kLXjTL.js";
import __nuxt_component_2 from "./Button-D8wzsEpq.js";
import { defineComponent, reactive, ref, withCtx, createTextVNode, unref, createVNode, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { v as validateProjectInput } from "./validators-D-ZNvAfo.js";
import { u as useCertificationStore } from "./certification-DojyOQvk.js";
import { a as useRouter } from "../server.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/ufo/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/defu/dist/defu.mjs";
import "tailwind-merge";
import "./tooltip-DSSfimG6.js";
import "./Icon-DLyP7dyO.js";
import "./index-B1ESqrck.js";
import "@iconify/vue";
import "@iconify/utils/lib/css/icon";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/perfect-debounce/dist/index.mjs";
import "./useFormGroup-DqE91r20.js";
import "@vueuse/core";
import "./useButtonGroup-CmlPsf0K.js";
import "./Link-BXfM0-H0.js";
import "ohash/utils";
import "./link-Bz3Wc5MF.js";
import "./button-Bz5rwL6o.js";
import "pinia";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/hookable/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/klona/dist/index.mjs";
import "/Users/zhuanzmima0000/Desktop/Pair-wise/reposted-projects/pair-wise-gsb-61/node_modules/@unhead/vue/dist/index.mjs";
import "@tanstack/vue-query";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "new",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useCertificationStore();
    const router = useRouter();
    const form = reactive({
      name: "",
      modelCode: "",
      vehicleType: "M1",
      configuration: "",
      maintenanceVersion: "",
      softwareVersion: "",
      applicant: "",
      agency: "华东认证中心",
      certificateExpiry: ""
    });
    const errors = reactive({});
    const submitted = ref(false);
    const vehicleTypeOptions = [
      { label: "M1 乘用车", value: "M1" },
      { label: "N1 轻型货车", value: "N1" },
      { label: "O2 挂车", value: "O2" }
    ];
    const agencyOptions = [
      { label: "华东认证中心", value: "华东认证中心" },
      { label: "华南认证中心", value: "华南认证中心" },
      { label: "华北认证中心", value: "华北认证中心" }
    ];
    function submit() {
      submitted.value = true;
      Object.assign(errors, validateProjectInput(form));
      if (Object.keys(errors).length) return;
      const id = store.createProject({ ...form });
      void router.push(`/projects/${id}`);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UCard = __nuxt_component_1;
      const _component_UFormGroup = __nuxt_component_3;
      const _component_UInput = __nuxt_component_4;
      const _component_USelect = __nuxt_component_6;
      const _component_UButton = __nuxt_component_2;
      _push(`<!--[--><div class="mb-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-sm text-teal-700 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`返回认证项目`);
          } else {
            return [
              createTextVNode("返回认证项目")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="mt-3 text-2xl font-semibold">新建认证项目</h1><p class="mt-1 text-sm text-slate-600">建立车型、配置和版本基线，随后关联法规项目与证据文件。</p></div>`);
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "项目名称",
              required: "",
              error: unref(submitted) ? unref(errors).name : void 0
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    placeholder: "例如：纯电运动轿车 2028 款"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).name,
                      "onUpdate:modelValue": ($event) => unref(form).name = $event,
                      placeholder: "例如：纯电运动轿车 2028 款"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "车型代码",
              required: "",
              error: unref(submitted) ? unref(errors).modelCode : void 0
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).modelCode,
                    "onUpdate:modelValue": ($event) => unref(form).modelCode = $event,
                    placeholder: "例如：EVS-28"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).modelCode,
                      "onUpdate:modelValue": ($event) => unref(form).modelCode = $event,
                      placeholder: "例如：EVS-28"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "车辆类别",
              required: "",
              error: unref(submitted) ? unref(errors).vehicleType : void 0
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(form).vehicleType,
                    "onUpdate:modelValue": ($event) => unref(form).vehicleType = $event,
                    options: vehicleTypeOptions
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(form).vehicleType,
                      "onUpdate:modelValue": ($event) => unref(form).vehicleType = $event,
                      options: vehicleTypeOptions
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "申报配置",
              required: "",
              error: unref(submitted) ? unref(errors).configuration : void 0
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).configuration,
                    "onUpdate:modelValue": ($event) => unref(form).configuration = $event,
                    placeholder: "例如：长续航四驱版"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).configuration,
                      "onUpdate:modelValue": ($event) => unref(form).configuration = $event,
                      placeholder: "例如：长续航四驱版"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "维护版本",
              required: "",
              error: unref(submitted) ? unref(errors).maintenanceVersion : void 0
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).maintenanceVersion,
                    "onUpdate:modelValue": ($event) => unref(form).maintenanceVersion = $event,
                    placeholder: "MY28.0"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).maintenanceVersion,
                      "onUpdate:modelValue": ($event) => unref(form).maintenanceVersion = $event,
                      placeholder: "MY28.0"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "软件版本",
              required: "",
              error: unref(submitted) ? unref(errors).softwareVersion : void 0
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).softwareVersion,
                    "onUpdate:modelValue": ($event) => unref(form).softwareVersion = $event,
                    placeholder: "9.0.0"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).softwareVersion,
                      "onUpdate:modelValue": ($event) => unref(form).softwareVersion = $event,
                      placeholder: "9.0.0"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "申请主体",
              required: "",
              error: unref(submitted) ? unref(errors).applicant : void 0
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).applicant,
                    "onUpdate:modelValue": ($event) => unref(form).applicant = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).applicant,
                      "onUpdate:modelValue": ($event) => unref(form).applicant = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "认证机构",
              required: "",
              error: unref(submitted) ? unref(errors).agency : void 0
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(form).agency,
                    "onUpdate:modelValue": ($event) => unref(form).agency = $event,
                    options: agencyOptions
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(form).agency,
                      "onUpdate:modelValue": ($event) => unref(form).agency = $event,
                      options: agencyOptions
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "证书有效期",
              required: "",
              error: unref(submitted) ? unref(errors).certificateExpiry : void 0
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).certificateExpiry,
                    "onUpdate:modelValue": ($event) => unref(form).certificateExpiry = $event,
                    type: "date"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).certificateExpiry,
                      "onUpdate:modelValue": ($event) => unref(form).certificateExpiry = $event,
                      type: "date"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="md:col-span-2 xl:col-span-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`建立项目并进入编辑器`);
                } else {
                  return [
                    createTextVNode("建立项目并进入编辑器")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode(_component_UFormGroup, {
                  label: "项目名称",
                  required: "",
                  error: unref(submitted) ? unref(errors).name : void 0
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).name,
                      "onUpdate:modelValue": ($event) => unref(form).name = $event,
                      placeholder: "例如：纯电运动轿车 2028 款"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                createVNode(_component_UFormGroup, {
                  label: "车型代码",
                  required: "",
                  error: unref(submitted) ? unref(errors).modelCode : void 0
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).modelCode,
                      "onUpdate:modelValue": ($event) => unref(form).modelCode = $event,
                      placeholder: "例如：EVS-28"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                createVNode(_component_UFormGroup, {
                  label: "车辆类别",
                  required: "",
                  error: unref(submitted) ? unref(errors).vehicleType : void 0
                }, {
                  default: withCtx(() => [
                    createVNode(_component_USelect, {
                      modelValue: unref(form).vehicleType,
                      "onUpdate:modelValue": ($event) => unref(form).vehicleType = $event,
                      options: vehicleTypeOptions
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                createVNode(_component_UFormGroup, {
                  label: "申报配置",
                  required: "",
                  error: unref(submitted) ? unref(errors).configuration : void 0
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).configuration,
                      "onUpdate:modelValue": ($event) => unref(form).configuration = $event,
                      placeholder: "例如：长续航四驱版"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                createVNode(_component_UFormGroup, {
                  label: "维护版本",
                  required: "",
                  error: unref(submitted) ? unref(errors).maintenanceVersion : void 0
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).maintenanceVersion,
                      "onUpdate:modelValue": ($event) => unref(form).maintenanceVersion = $event,
                      placeholder: "MY28.0"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                createVNode(_component_UFormGroup, {
                  label: "软件版本",
                  required: "",
                  error: unref(submitted) ? unref(errors).softwareVersion : void 0
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).softwareVersion,
                      "onUpdate:modelValue": ($event) => unref(form).softwareVersion = $event,
                      placeholder: "9.0.0"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                createVNode(_component_UFormGroup, {
                  label: "申请主体",
                  required: "",
                  error: unref(submitted) ? unref(errors).applicant : void 0
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).applicant,
                      "onUpdate:modelValue": ($event) => unref(form).applicant = $event
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                createVNode(_component_UFormGroup, {
                  label: "认证机构",
                  required: "",
                  error: unref(submitted) ? unref(errors).agency : void 0
                }, {
                  default: withCtx(() => [
                    createVNode(_component_USelect, {
                      modelValue: unref(form).agency,
                      "onUpdate:modelValue": ($event) => unref(form).agency = $event,
                      options: agencyOptions
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                createVNode(_component_UFormGroup, {
                  label: "证书有效期",
                  required: "",
                  error: unref(submitted) ? unref(errors).certificateExpiry : void 0
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).certificateExpiry,
                      "onUpdate:modelValue": ($event) => unref(form).certificateExpiry = $event,
                      type: "date"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                createVNode("div", { class: "md:col-span-2 xl:col-span-3" }, [
                  createVNode(_component_UButton, {
                    type: "submit",
                    color: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("建立项目并进入编辑器")
                    ]),
                    _: 1
                  })
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=new-VIdkbmWn.js.map
