<template>
  <DxTextArea
    v-model:value="value"
    :mode="mode"
    :disabled="disabled"
    :placeholder="placeholder"
    :type="type"
    :label="label"
    :labelMode="labelMode"
    :stylingMode="stylingMode"
    :width="width"
    :height="height"
    @value-changed="onValueChanged"
    @enter-key="onEnterKey"
    @content-ready="onContentReady"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from "vue";
import DxTextArea from 'devextreme-vue/text-area';

const props = defineProps<{
  visible?: boolean;
  height?: string;
  width?: string;
  placeholder?: string;
  mode?: string;
  value?: any;
  disabled?: boolean;
  label?: string;
  labelMode?: string;
  type?: string;
  stylingMode?: string;
}>();

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
