<template>
  <div class="w-100 base-input">
    <DxTextBox
      v-model:value="props.value"
      :mode="mode"
      :disabled="disabled"
      :placeholder="placeholder"
      :type="type"
      :label="label"
      :labelMode="labelMode"
      :stylingMode="stylingMode"
      @value-changed="onValueChanged"
      @enter-key="onEnterKey"
      @content-ready="onContentReady"
      @focus-in="onFocus"
    />
    <div
      :class="classPassword"
      v-if="firtMode == 'password'"
      class="icon"
      @click="onToggleShowPassword"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import DxTextBox from "devextreme-vue/text-box";

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
  isShowPassword?: boolean;
}>();

const emits = defineEmits<{
  (e: "onValueChanged", value: Object): void;
  (e: "onEnterKey", value: Object): void;
  (e: "onContentReady", value: Object): void;
  (e: "onFocus", value: Object): void;
  (e: "onToggleShowPassword", value: Object): void;
}>();

// Hiển thị pass ko?
const classPassword = computed(() => {
  if (props.isShowPassword) {
    return "icon-show-password";
  } else {
    return "icon-hide-password";
  }
});

let firtMode = ref("");

onMounted(() => {
  firtMode.value = props.mode || "default";
});

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

function onFocus(event: any) {
  if (!event) {
    return;
  }
  emits("onFocus", event);
}

function onToggleShowPassword(event: any) {
  emits("onToggleShowPassword", !props.isShowPassword);
}
</script>

<style lang="scss" scoped>
@import "@/base/scss/base-icon.scss";
.dx-state-disabled .dx-widget,
.dx-state-disabled.dx-widget {
  opacity: 1;
  background: #e9ecef !important;
}
.base-input {
  position: relative;
  .icon {
    cursor: pointer;
    position: absolute;
    top: 8px;
    right: 8px;
  }
}
</style>
