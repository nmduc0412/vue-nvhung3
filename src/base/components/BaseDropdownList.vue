<script setup lang="ts">
import { DxPopover } from "devextreme-vue/popover";

defineProps([
  "width",
  "height",
  "isVisible",
  "target",
  "position",
  "items",
  "key",
  "display",
]);
const emit = defineEmits(['onValueChanged'])
function onValueChanged(item : any) {
  emit("onValueChanged", item);
}
</script>

<template>
  <DxPopover
    :width="width"
    :visible="isVisible"
    :target="target"
    :position="position"
  >
    <div
      class="dropdown-item"
      v-for="item in items"
      :key="item[key]"
      @click="onValueChanged(item)"
    >
      {{ item[display] }}
    </div>
  </DxPopover>
</template>

<style lang="scss" scoped>

.dropdown-item {
  cursor: pointer;
  padding: 8px;
  &:hover {
    background-color: #e9ecef;
  }
}
</style>
