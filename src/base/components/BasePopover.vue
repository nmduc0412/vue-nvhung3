<script setup lang="ts">
import { DxScrollView } from "devextreme-vue/scroll-view";
import { DxPopover } from "devextreme-vue/popover";
import type { PropType } from "vue";

const props = defineProps({
  width: { type: String, required: true },
  height: { type: String, default: "auto" },
  isVisible: { type: Boolean, default: false, required: true },
  target: { type: String, default: "auto" },
  position: { type: String },
  dragEnabled: { type: Boolean, default: false },
});

const emits = defineEmits<{
  (e: "onHidden", item: any): void;
}>();

/**
 * Đóng popover
 */
function onHidden(event: any) {
  console.log(1);
  
  emits("onHidden", event);
}
</script>

<template>
  <DxPopover
    :visible="isVisible"
    :width="width"
    :height="height"
    :target="target"
    :position="position"
    :drag-enabled="dragEnabled"
    :hide-on-outside-click="true"
    @hidden="onHidden"
  >
    <div class="p-3">
      <DxScrollView :height="'100%'">
        <slot name="content"></slot>
      </DxScrollView>
    </div>
  </DxPopover>
</template>

<style lang="scss" scoped></style>
