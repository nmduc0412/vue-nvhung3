<template>
  <DxPopup
    v-model:visible="isVisible"
    :drag-enabled="false"
    :hide-on-outside-click="false"
    :show-close-button="false"
    :show-title="false"
    :width="width"
    :height="height"
    :position="position"
  >
    <div class="d-flex flex-column w-100 h-100">
      <div class="base-popup-header">
        <div v-if="title">{{ title }}</div>
        <slot v-else name="header"></slot>
        <div @click="closePopup" class="icon-close"></div>
      </div>

      <div class="base-popup-content">
        <DxScrollView :height="'100%'">
          <slot name="content"></slot>
        </DxScrollView>
      </div>

      <div class="base-popup-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </DxPopup>
</template>

<script setup lang="ts">
import { DxScrollView } from "devextreme-vue/scroll-view";
import { DxPopup } from "devextreme-vue/popup";
import type { PropType } from "vue";

const props = defineProps({
  width: { type: String, default: "auto" }, // width button
  height: { type: String, default: "auto" }, // width button
  isVisible: { type: Boolean, default: false },
  showTitle: { type: Boolean, default: true },
  title: { type: String, default: "" },
  position: {
    type: Object,
    default: { my: "center", at: "center", offset: "0 -100", of: "window" },
  },
});

const emit = defineEmits(["closePopup"]);
function closePopup(item: any) {
  emit("closePopup", item);
}
</script>

<style lang="scss" scoped>
@import "@/base/scss/base-icon.scss";

.base-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  font-size: 20px;
  font-weight: 700;

  .icon-close {
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 4px;
    }
  }
}

.base-popup-content {
  padding: 0px 24px;
  height: calc(100% - 140px);
  // max-height: calc(100vh - 140px);
}

.base-popup-footer {
  padding: 24px;
  width: 100%;
  display: flex;
  justify-content: end;
}
</style>

<style lang="scss">
.dx-popup-content {
  padding: 0 !important;
}
</style>
