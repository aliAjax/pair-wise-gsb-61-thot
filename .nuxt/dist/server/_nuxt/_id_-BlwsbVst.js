import { _ as __nuxt_component_0 } from "./nuxt-link-C7gFIhDA.js";
import { _ as _sfc_main$2 } from "./StatusBadge-DG46AzPs.js";
import __nuxt_component_2$1 from "./Progress-CwDF88zd.js";
import __nuxt_component_3 from "./FormGroup-4pa-_EdW.js";
import __nuxt_component_4 from "./Input-D0aVKprk.js";
import __nuxt_component_2 from "./Button-D8wzsEpq.js";
import __nuxt_component_6 from "./Select-B6kLXjTL.js";
import __nuxt_component_7 from "./Textarea-DqjrDef4.js";
import __nuxt_component_8 from "./Tabs-3WyEKAZz.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext, computed, ref, reactive, watch, unref, createVNode, isRef, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./RegulationTree-B7mQLF6-.js";
import __nuxt_component_1 from "./Badge-D-kRXobJ.js";
import { a as validateSubmission } from "./validators-D-ZNvAfo.js";
import { u as useCertificationStore } from "./certification-DojyOQvk.js";
import { b as useRoute } from "../server.mjs";
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
import "./keyboard-BCt0ZeLv.js";
import "./use-resolve-button-type-CCTzT7JK.js";
import "./hidden-e5tlhUcy.js";
import "./focus-management-CclPs0xY.js";
import "./micro-task-B6uncIso.js";
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
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "EvidenceTable",
  __ssrInlineRender: true,
  props: {
    evidence: {},
    editable: { type: Boolean }
  },
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const typeLabels = {
      test_report: "测试报告",
      part_list: "部件清单",
      software_report: "软件报告",
      exemption: "豁免材料",
      certificate: "证书"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StatusBadge = _sfc_main$2;
      const _component_UButton = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-x-auto" }, _attrs))}><table class="data-table min-w-[980px]"><thead><tr><th>证据文件</th><th>法规项</th><th>文件 / 软件版本</th><th>配置覆盖</th><th>状态</th><th>审阅说明</th>`);
      if (__props.editable) {
        _push(`<th>操作</th>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.evidence, (item) => {
        _push(`<tr><td><p class="font-medium">${ssrInterpolate(item.name)}</p><p class="mt-1 text-xs text-slate-500">${ssrInterpolate(typeLabels[item.type])} · ${ssrInterpolate(item.id)}</p></td><td class="font-mono text-sm">${ssrInterpolate(item.regulationId)}</td><td><p>文件 ${ssrInterpolate(item.version)}</p><p class="${ssrRenderClass([item.softwareVersion !== item.softwareVersion ? "text-red-700" : "text-slate-500", "mt-1 text-xs"])}"> 软件 ${ssrInterpolate(item.softwareVersion)}</p></td><td class="max-w-[260px] text-sm">${ssrInterpolate(item.configurations.join("、"))}</td><td>`);
        _push(ssrRenderComponent(_component_StatusBadge, {
          status: item.status
        }, null, _parent));
        _push(`</td><td class="max-w-[320px] text-sm text-slate-600">${ssrInterpolate(item.note)}</td>`);
        if (__props.editable) {
          _push(`<td><div class="flex min-w-[180px] flex-wrap gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            size: "xs",
            color: "green",
            variant: "soft",
            onClick: ($event) => emit("update", item.id, "accepted")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`接受`);
              } else {
                return [
                  createTextVNode("接受")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            size: "xs",
            color: "red",
            variant: "soft",
            onClick: ($event) => emit("update", item.id, "rejected")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`拒绝`);
              } else {
                return [
                  createTextVNode("拒绝")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            size: "xs",
            color: "amber",
            variant: "soft",
            onClick: ($event) => emit("update", item.id, "resubmit")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`重新抽样`);
              } else {
                return [
                  createTextVNode("重新抽样")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></td>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tr>`);
      });
      _push(`<!--]-->`);
      if (!__props.evidence.length) {
        _push(`<tr><td${ssrRenderAttr("colspan", __props.editable ? 7 : 6)} class="py-12 text-center text-slate-500">当前项目尚未关联证据。</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EvidenceTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const store = useCertificationStore();
    const id = String(route.params.id);
    const project = computed(() => store.projectById(id));
    const activeTab = ref(0);
    const message = ref("");
    const error = ref("");
    const editor = reactive({
      name: "",
      modelCode: "",
      vehicleType: "",
      configuration: "",
      maintenanceVersion: "",
      softwareVersion: "",
      applicant: "",
      agency: "",
      certificateExpiry: ""
    });
    watch(
      project,
      (value) => {
        if (!value) return;
        Object.assign(editor, {
          name: value.name,
          modelCode: value.modelCode,
          vehicleType: value.vehicleType,
          configuration: value.configuration,
          maintenanceVersion: value.maintenanceVersion,
          softwareVersion: value.softwareVersion,
          applicant: value.applicant,
          agency: value.agency,
          certificateExpiry: value.certificateExpiry
        });
      },
      { immediate: true }
    );
    const transitionStatus = ref("under_review");
    const transitionReason = ref("");
    const editReason = ref("");
    const supplementNote = ref("");
    const selectedEvidence = ref([]);
    const tabs = [
      { label: "证据文件", icon: "i-heroicons-document-text" },
      { label: "法规项目", icon: "i-heroicons-list-bullet" },
      { label: "版本与影响", icon: "i-heroicons-arrows-right-left" },
      { label: "审计记录", icon: "i-heroicons-clock" }
    ];
    const transitionOptions = computed(() => {
      const current = project.value?.status;
      if (current === "draft") return [{ label: "提交认证机构", value: "submitted" }];
      if (current === "submitted") return [{ label: "开始审阅", value: "under_review" }];
      if (current === "under_review") {
        return [
          { label: "要求补件", value: "supplement_required" },
          { label: "批准", value: "approved" },
          { label: "拒绝", value: "rejected" }
        ];
      }
      if (current === "supplement_required") return [{ label: "重新提交补件", value: "submitted" }];
      return [{ label: "重新打开审阅", value: "under_review" }];
    });
    const blockingIssues = computed(() => project.value ? validateSubmission(project.value) : []);
    function updateEvidence(evidenceId, status) {
      if (!project.value) return;
      store.updateEvidence(id, evidenceId, status, `审阅人将证据标记为${status}`);
      message.value = "证据审阅状态已更新。";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_StatusBadge = _sfc_main$2;
      const _component_UProgress = __nuxt_component_2$1;
      const _component_UFormGroup = __nuxt_component_3;
      const _component_UInput = __nuxt_component_4;
      const _component_UButton = __nuxt_component_2;
      const _component_USelect = __nuxt_component_6;
      const _component_UTextarea = __nuxt_component_7;
      const _component_UTabs = __nuxt_component_8;
      const _component_EvidenceTable = _sfc_main$1;
      const _component_RegulationTree = _sfc_main$3;
      const _component_UBadge = __nuxt_component_1;
      if (!unref(project)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "border border-red-200 bg-red-50 p-6 text-red-900" }, _attrs))}> 未找到认证项目 ${ssrInterpolate(unref(id))}。 </div>`);
      } else {
        _push(`<!--[--><div class="mb-6 flex flex-wrap items-start justify-between gap-4"><div>`);
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
        _push(`<div class="mt-3 flex flex-wrap items-center gap-3"><h1 class="text-2xl font-semibold">${ssrInterpolate(unref(project).id)}</h1>`);
        _push(ssrRenderComponent(_component_StatusBadge, {
          status: unref(project).status
        }, null, _parent));
        _push(`</div><p class="mt-2 text-lg font-medium">${ssrInterpolate(unref(project).name)}</p><p class="mt-1 text-sm text-slate-500">${ssrInterpolate(unref(project).modelCode)} · ${ssrInterpolate(unref(project).vehicleType)} · ${ssrInterpolate(unref(project).configuration)} · ${ssrInterpolate(unref(project).maintenanceVersion)} / SW ${ssrInterpolate(unref(project).softwareVersion)}</p></div><div class="min-w-[240px] border border-slate-200 bg-white p-4"><div class="flex items-center justify-between text-sm"><span class="text-slate-500">证据完整度</span><span class="metric-value font-semibold">${ssrInterpolate(unref(project).progress)}%</span></div>`);
        _push(ssrRenderComponent(_component_UProgress, {
          class: "mt-2",
          value: unref(project).progress,
          size: "sm"
        }, null, _parent));
        _push(`<p class="mt-2 text-xs text-slate-500">证书到期：${ssrInterpolate(unref(project).certificateExpiry)}</p></div></div>`);
        if (unref(message)) {
          _push(`<div class="mb-4 border border-green-200 bg-green-50 p-3 text-sm text-green-900">${ssrInterpolate(unref(message))}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(error)) {
          _push(`<div class="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-900">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(blockingIssues).length) {
          _push(`<div class="mb-5 border border-amber-200 bg-amber-50 p-4"><p class="text-sm font-semibold text-amber-950">批准前阻断项</p><ul class="mt-2 list-inside list-disc space-y-1 text-sm text-amber-900"><!--[-->`);
          ssrRenderList(unref(blockingIssues), (issue) => {
            _push(`<li>${ssrInterpolate(issue)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="mb-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]"><div class="border border-slate-200 bg-white p-5"><div class="mb-4 flex items-center justify-between gap-3"><div><h2 class="font-semibold">项目与版本基线</h2><p class="mt-1 text-xs text-slate-500">变更会生成新版本并标记受影响配置。</p></div></div><form class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">`);
        _push(ssrRenderComponent(_component_UFormGroup, { label: "项目名称" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(editor).name,
                "onUpdate:modelValue": ($event) => unref(editor).name = $event
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UInput, {
                  modelValue: unref(editor).name,
                  "onUpdate:modelValue": ($event) => unref(editor).name = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UFormGroup, { label: "车型代码" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(editor).modelCode,
                "onUpdate:modelValue": ($event) => unref(editor).modelCode = $event
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UInput, {
                  modelValue: unref(editor).modelCode,
                  "onUpdate:modelValue": ($event) => unref(editor).modelCode = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UFormGroup, { label: "配置" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(editor).configuration,
                "onUpdate:modelValue": ($event) => unref(editor).configuration = $event
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UInput, {
                  modelValue: unref(editor).configuration,
                  "onUpdate:modelValue": ($event) => unref(editor).configuration = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UFormGroup, { label: "维护版本" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(editor).maintenanceVersion,
                "onUpdate:modelValue": ($event) => unref(editor).maintenanceVersion = $event
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UInput, {
                  modelValue: unref(editor).maintenanceVersion,
                  "onUpdate:modelValue": ($event) => unref(editor).maintenanceVersion = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UFormGroup, { label: "软件版本" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(editor).softwareVersion,
                "onUpdate:modelValue": ($event) => unref(editor).softwareVersion = $event
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UInput, {
                  modelValue: unref(editor).softwareVersion,
                  "onUpdate:modelValue": ($event) => unref(editor).softwareVersion = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UFormGroup, { label: "证书有效期" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(editor).certificateExpiry,
                "onUpdate:modelValue": ($event) => unref(editor).certificateExpiry = $event,
                type: "date"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UInput, {
                  modelValue: unref(editor).certificateExpiry,
                  "onUpdate:modelValue": ($event) => unref(editor).certificateExpiry = $event,
                  type: "date"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UFormGroup, { label: "申请主体" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(editor).applicant,
                "onUpdate:modelValue": ($event) => unref(editor).applicant = $event
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UInput, {
                  modelValue: unref(editor).applicant,
                  "onUpdate:modelValue": ($event) => unref(editor).applicant = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UFormGroup, { label: "认证机构" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(editor).agency,
                "onUpdate:modelValue": ($event) => unref(editor).agency = $event
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UInput, {
                  modelValue: unref(editor).agency,
                  "onUpdate:modelValue": ($event) => unref(editor).agency = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UFormGroup, { label: "变更原因" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(editReason),
                "onUpdate:modelValue": ($event) => isRef(editReason) ? editReason.value = $event : null,
                placeholder: "说明变更和影响范围"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UInput, {
                  modelValue: unref(editReason),
                  "onUpdate:modelValue": ($event) => isRef(editReason) ? editReason.value = $event : null,
                  placeholder: "说明变更和影响范围"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="md:col-span-2 xl:col-span-3">`);
        _push(ssrRenderComponent(_component_UButton, {
          type: "submit",
          color: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`保存并生成版本`);
            } else {
              return [
                createTextVNode("保存并生成版本")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></form></div><div class="border border-slate-200 bg-white p-5"><h2 class="font-semibold">审批流转</h2><p class="mt-1 text-xs text-slate-500">批准前系统检查缺失证据、版本错配和配置覆盖。</p><form class="mt-4 space-y-4">`);
        _push(ssrRenderComponent(_component_UFormGroup, { label: "目标状态" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_USelect, {
                modelValue: unref(transitionStatus),
                "onUpdate:modelValue": ($event) => isRef(transitionStatus) ? transitionStatus.value = $event : null,
                options: unref(transitionOptions)
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_USelect, {
                  modelValue: unref(transitionStatus),
                  "onUpdate:modelValue": ($event) => isRef(transitionStatus) ? transitionStatus.value = $event : null,
                  options: unref(transitionOptions)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UFormGroup, { label: "流转依据" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UTextarea, {
                modelValue: unref(transitionReason),
                "onUpdate:modelValue": ($event) => isRef(transitionReason) ? transitionReason.value = $event : null,
                rows: 3,
                placeholder: "记录接受、拒绝或补件依据"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UTextarea, {
                  modelValue: unref(transitionReason),
                  "onUpdate:modelValue": ($event) => isRef(transitionReason) ? transitionReason.value = $event : null,
                  rows: 3,
                  placeholder: "记录接受、拒绝或补件依据"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          type: "submit",
          color: "primary",
          class: "w-full justify-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`提交审批流转`);
            } else {
              return [
                createTextVNode("提交审批流转")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</form></div></section>`);
        _push(ssrRenderComponent(_component_UTabs, {
          modelValue: unref(activeTab),
          "onUpdate:modelValue": ($event) => isRef(activeTab) ? activeTab.value = $event : null,
          items: tabs,
          class: "mb-5"
        }, null, _parent));
        if (unref(activeTab) === 0) {
          _push(`<section class="border border-slate-200 bg-white"><div class="border-b border-slate-200 px-4 py-3"><h2 class="font-semibold">证据文件审阅</h2><p class="mt-1 text-xs text-slate-500">逐项接受、拒绝或要求重新抽样。</p></div>`);
          _push(ssrRenderComponent(_component_EvidenceTable, {
            evidence: unref(project).evidence,
            editable: "",
            onUpdate: updateEvidence
          }, null, _parent));
          _push(`</section>`);
        } else if (unref(activeTab) === 1) {
          _push(`<section><div class="mb-4"><h2 class="font-semibold">法规项目覆盖</h2><p class="mt-1 text-sm text-slate-500">按法规项展开证据、配置覆盖和阻断问题。</p></div>`);
          _push(ssrRenderComponent(_component_RegulationTree, {
            regulations: unref(project).regulations,
            evidence: unref(project).evidence
          }, null, _parent));
          _push(`</section>`);
        } else if (unref(activeTab) === 2) {
          _push(`<section class="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]"><div class="border border-slate-200 bg-white"><div class="border-b border-slate-200 px-4 py-3"><h2 class="font-semibold">版本差异</h2></div><div class="divide-y divide-slate-200"><!--[-->`);
          ssrRenderList(unref(project).versions, (version) => {
            _push(`<article class="p-4"><div class="flex flex-wrap items-start justify-between gap-3"><div><p class="font-medium">${ssrInterpolate(version.label)} · ${ssrInterpolate(version.author)}</p><p class="mt-1 text-xs text-slate-500">${ssrInterpolate(version.createdAt.slice(0, 16).replace("T", " "))}</p></div>`);
            _push(ssrRenderComponent(_component_UBadge, {
              color: "gray",
              variant: "soft"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(version.impactedConfigurations.join("、"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(version.impactedConfigurations.join("、")), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div><p class="mt-3 text-sm">${ssrInterpolate(version.summary)}</p><ul class="mt-2 list-inside list-disc text-sm text-slate-600"><!--[-->`);
            ssrRenderList(version.changes, (change) => {
              _push(`<li>${ssrInterpolate(change)}</li>`);
            });
            _push(`<!--]--></ul></article>`);
          });
          _push(`<!--]--></div></div><div class="border border-slate-200 bg-white p-5"><h2 class="font-semibold">批量补件</h2><p class="mt-1 text-xs text-slate-500">将缺失、被拒或待重交证据更新到当前软件基线。</p><form class="mt-4 space-y-4"><!--[-->`);
          ssrRenderList(unref(project).evidence.filter((evidence) => ["rejected", "resubmit", "missing"].includes(evidence.status)), (item) => {
            _push(`<label class="flex gap-3 border border-slate-200 p-3"><input${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEvidence)) ? ssrLooseContain(unref(selectedEvidence), item.id) : unref(selectedEvidence)) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", item.id)} class="mt-1"><span><span class="block text-sm font-medium">${ssrInterpolate(item.name)}</span><span class="mt-1 block text-xs text-slate-500">${ssrInterpolate(item.id)} · 当前 SW ${ssrInterpolate(item.softwareVersion)}</span></span></label>`);
          });
          _push(`<!--]-->`);
          if (!unref(project).evidence.some((evidence) => ["rejected", "resubmit", "missing"].includes(evidence.status))) {
            _push(`<p class="text-sm text-slate-500"> 当前没有待补件证据。 </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(_component_UFormGroup, { label: "补件说明" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UTextarea, {
                  modelValue: unref(supplementNote),
                  "onUpdate:modelValue": ($event) => isRef(supplementNote) ? supplementNote.value = $event : null,
                  rows: 3,
                  placeholder: "说明已完成的测试、配置覆盖和版本更新"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UTextarea, {
                    modelValue: unref(supplementNote),
                    "onUpdate:modelValue": ($event) => isRef(supplementNote) ? supplementNote.value = $event : null,
                    rows: 3,
                    placeholder: "说明已完成的测试、配置覆盖和版本更新"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            type: "submit",
            color: "primary",
            class: "w-full justify-center"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`批量更新并重新提交`);
              } else {
                return [
                  createTextVNode("批量更新并重新提交")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</form></div></section>`);
        } else {
          _push(`<section class="border border-slate-200 bg-white p-5"><h2 class="font-semibold">项目审计记录</h2><div class="mt-5 space-y-5"><!--[-->`);
          ssrRenderList(unref(project).audit, (entry) => {
            _push(`<article class="audit-item"><div class="flex flex-wrap items-center justify-between gap-2"><p class="text-sm font-medium">${ssrInterpolate(entry.action)} · ${ssrInterpolate(entry.actor)}</p><span class="text-xs text-slate-500">${ssrInterpolate(entry.createdAt.slice(0, 16).replace("T", " "))}</span></div><p class="mt-1 text-sm text-slate-600">${ssrInterpolate(entry.detail)}</p></article>`);
          });
          _push(`<!--]--></div></section>`);
        }
        _push(`<!--]-->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-BlwsbVst.js.map
