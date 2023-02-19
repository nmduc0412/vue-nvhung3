<template>
  <DxNumberBox
    v-model:value="props.value"
    :mode="mode"
    :disabled="disabled"
    :placeholder="placeholder"
    :type="type"
    :label="label"
    :labelMode="labelMode"
    :stylingMode="stylingMode"
    :show-spin-buttons="showSpinButtons"
    :min="min"
    :max="max"
    :format="format"
    @value-changed="onValueChanged"
    @enter-key="onEnterKey"
    @content-ready="onContentReady"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from "vue";
import DxNumberBox from "devextreme-vue/number-box";

const props = defineProps({
  visible: { type: Boolean, required: false },
  width: { type: String, default: "auto" },
  height: { type: String, default: "auto" },
  placeholder: { type: String, default: "" },
  mode: { type: String, required: false },
  value: { type: Number },
  disabled: { type: Boolean, required: false },
  label: { type: String },
  labelMode: { type: String },
  type: { type: String },
  stylingMode: { type: String },
  showSpinButtons: { type: Boolean, default: true },
  min: { type: Number, default: 0 },
  max: { type: Number },
  format: { type: String, default: "#,##0.##" },
});

const emits = defineEmits<{
  (e: "onValueChanged", value: Object): void;
  (e: "onEnterKey", value: Object): void;
  (e: "onContentReady", value: Object): void;
}>();

onMounted(() => {});

function onValueChanged(event: any) {
  if (!event) {
    return;
  }
  emits("onValueChanged", event.value);
}

function onEnterKey(event: any) {
  if (!event) {
    return;
  }
  emits("onEnterKey", event);
}

function onContentReady(event: any) {
  if (!event) {
    return;
  }
  emits("onContentReady", event);
}
</script>

<style lang="scss" scoped>
.dx-state-disabled .dx-widget,
.dx-state-disabled.dx-widget {
  opacity: 1;
  background: #e9ecef !important;
}
</style>
