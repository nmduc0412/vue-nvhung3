<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import DxButton from "devextreme-vue/button";

const props = defineProps({
  width: { type: String, default: "auto" }, // width button
  height: { type: String, default: "auto" }, // width button
  text: { type: String, default: "" }, // content button
  type: { type: String, default: "default" }, // normal, success, default, danger
  stylingMode: { type: String, default: "contained" }, // contained, outlined, text
  loading: { type: Boolean, default: false }, // contained, outlined, text
  disabled: { type: Boolean, default: false },
  icon: { type: String },
});
const emit = defineEmits(["onClick"]);
function onClick(event: any) {
  if (props.loading) {
    return;
  }
  if (!event) {
    return;
  }
  emit("onClick", event);
  event?.element?.blur();
}

const classLoading = computed(() => {
  if (props.stylingMode == "outlined" || props.type == "normal") {
    return "loading-normal";
  } else if (props.type == "default") {
    return "loading-default";
  } else if (props.type == "success") {
    return "loading-success";
  } else if (props.type == "danger") {
    return "loading-danger";
  }
});
</script>

<template>
  <div style="position: relative" :style="{ height: height, width: width }">
    <DxButton
      :disabled="disabled"
      :height="height"
      :width="width"
      :text="text"
      :type="type"
      :styling-mode="stylingMode"
      :icon="icon"
      @click="onClick($event)"
    />
    <!-- Khi có class màu chung thì chuyển qua hiển thị theo class không dùng style -->
    <div v-if="loading" class="loading-container" :class="classLoading">
      <div class="loader"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-container {
  position: absolute;
  top: 1px;
  left: 50%;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  transform: translate(-50%, 0);
  border-radius: 4px;
  pointer-events: none;
  &.loading-normal {
    background: #fff;
  }
  &.loading-default {
    background: #337ab7;
  }
  &.loading-success {
    background: #fff;
  }
  &.loading-danger {
    background: #d9534f;
  }
  .loader {
    position: absolute;
    top: calc(50% - 12px);
    left: calc(50% - 12px);
    border-radius: 50%;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-bottom: 2px solid #3498db;
    width: 24px;
    height: 24px;
    -webkit-animation: spin 1.2s linear infinite;
    /* Safari */
    animation: spin 1.2s linear infinite;
  }
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
