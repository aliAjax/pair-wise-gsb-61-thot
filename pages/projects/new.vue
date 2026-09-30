<script setup lang="ts">
import type { ProjectInput } from '~/types/certification';
import { validateProjectInput } from '~/services/validators';
import { useCertificationStore } from '~/stores/certification';

const store = useCertificationStore();
const router = useRouter();
const form = reactive<ProjectInput>({
  name: '',
  modelCode: '',
  vehicleType: 'M1',
  configuration: '',
  maintenanceVersion: '',
  softwareVersion: '',
  applicant: '',
  agency: '华东认证中心',
  certificateExpiry: ''
});
const errors = reactive<Partial<Record<keyof ProjectInput, string>>>({});
const submitted = ref(false);

const vehicleTypeOptions = [
  { label: 'M1 乘用车', value: 'M1' },
  { label: 'N1 轻型货车', value: 'N1' },
  { label: 'O2 挂车', value: 'O2' }
];
const agencyOptions = [
  { label: '华东认证中心', value: '华东认证中心' },
  { label: '华南认证中心', value: '华南认证中心' },
  { label: '华北认证中心', value: '华北认证中心' }
];

function submit() {
  submitted.value = true;
  Object.assign(errors, validateProjectInput(form));
  if (Object.keys(errors).length) return;
  const id = store.createProject({ ...form });
  void router.push(`/projects/${id}`);
}
</script>

<template>
  <div class="mb-6">
    <NuxtLink to="/" class="text-sm text-teal-700 hover:underline">返回认证项目</NuxtLink>
    <h1 class="mt-3 text-2xl font-semibold">新建认证项目</h1>
    <p class="mt-1 text-sm text-slate-600">建立车型、配置和版本基线，随后关联法规项目与证据文件。</p>
  </div>

  <UCard>
    <form class="grid gap-5 md:grid-cols-2 xl:grid-cols-3" @submit.prevent="submit">
      <UFormGroup label="项目名称" required :error="submitted ? errors.name : undefined">
        <UInput v-model="form.name" placeholder="例如：纯电运动轿车 2028 款" />
      </UFormGroup>
      <UFormGroup label="车型代码" required :error="submitted ? errors.modelCode : undefined">
        <UInput v-model="form.modelCode" placeholder="例如：EVS-28" />
      </UFormGroup>
      <UFormGroup label="车辆类别" required :error="submitted ? errors.vehicleType : undefined">
        <USelect v-model="form.vehicleType" :options="vehicleTypeOptions" />
      </UFormGroup>
      <UFormGroup label="申报配置" required :error="submitted ? errors.configuration : undefined">
        <UInput v-model="form.configuration" placeholder="例如：长续航四驱版" />
      </UFormGroup>
      <UFormGroup label="维护版本" required :error="submitted ? errors.maintenanceVersion : undefined">
        <UInput v-model="form.maintenanceVersion" placeholder="MY28.0" />
      </UFormGroup>
      <UFormGroup label="软件版本" required :error="submitted ? errors.softwareVersion : undefined">
        <UInput v-model="form.softwareVersion" placeholder="9.0.0" />
      </UFormGroup>
      <UFormGroup label="申请主体" required :error="submitted ? errors.applicant : undefined">
        <UInput v-model="form.applicant" />
      </UFormGroup>
      <UFormGroup label="认证机构" required :error="submitted ? errors.agency : undefined">
        <USelect v-model="form.agency" :options="agencyOptions" />
      </UFormGroup>
      <UFormGroup label="证书有效期" required :error="submitted ? errors.certificateExpiry : undefined">
        <UInput v-model="form.certificateExpiry" type="date" />
      </UFormGroup>

      <div class="md:col-span-2 xl:col-span-3">
        <UButton type="submit" color="primary">建立项目并进入编辑器</UButton>
      </div>
    </form>
  </UCard>
</template>
