<template>
  <!-- Popup confirm xóa -->
  <BasePopup
    :isVisible="isVisible"
    :title="title"
    :width="width"
    :height="height"
    @closePopup="closePopup"
  >
    <template v-slot:content
      ><div>{{ content }}</div></template
    >
    <template v-slot:footer>
      <BaseButton
        :text="$t('Cancel')"
        class="mr-2"
        type="normal"
        styling-mode="contained"
        @onClick="closePopup"
      />
      <BaseButton
        type="danger"
        styling-mode="contained"
        :text="textButton"
        :loading="loading"
        @onClick="onDelete"
      />
    </template>
  </BasePopup>
</template>

<script setup lang="ts">
import BasePopup from "@/base/components/BasePopup.vue";
import BaseButton from "@/base/components/BaseButton.vue";
import type { PropType } from "vue";

const props = defineProps({
  isVisible: { type: Boolean, default: false, required: true },
  width: { type: String, default: "500px" }, // width popup
  height: { type: String, default: "auto" }, // height popup
  title: { type: String, default: "Delete Confirm" },
  content: {
    type: String,
    default: "Are you sure you want to delete this item?",
  },
  textButton: { type: String, default: "Delete" },
  loading: { type: Boolean, default: false },
});

const emits = defineEmits<{
  (e: "closePopup", value: Boolean): void;
  (e: "onDelete", value: any): void;
}>();

/**
 * Đóng popup
 */
function closePopup(item: any) {
  emits("closePopup", item);
}

/**
 * Xác nhận xóa
 */
function onDelete(item: any) {
  emits("onDelete", item);
}
</script>
