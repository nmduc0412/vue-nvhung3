<template>
  <DxSelectBox
    :items="items"
    :data-source="dataSource"
    :display-expr="display"
    :value-expr="keyID"
    :placeholder="placeholder"
    :class="customClass"
    :width="width"
    :min-width="minWidth"
    :search-enabled="searchEnabled"
    :readOnly="readOnly"
    v-model:value="props.value"
    @value-changed="onValueChanged"
    @content-ready="onContentReady"
  />
</template>
<script setup lang="ts">
import DxSelectBox from "devextreme-vue/select-box";
import type ArrayStore from "devextreme/data/array_store";
import type { PropType } from "vue";

const props = defineProps({
  visible: { type: Boolean, default: false },
  width: { type: String, default: "auto" },
  minWidth: { type: String, default: "auto" },
  height: { type: String, default: "auto" },
  placeholder: { type: String, default: "Select..." },
  items: { type: Array as PropType<Array<any>> },
  dataSource: { type: Array as PropType<Array<any>> },
  display: { type: String },
  keyID: { type: String },
  value: { type: Number || String },
  searchEnabled: { type: Boolean, default: false },
  customClass: { type: String, default: "" },
  readOnly: { type: Boolean, default: false },
});

const emits = defineEmits<{
  (e: "onValueChanged", item: any): void;
  (e: "onContentReady", item: any): void;
}>();

/**
 * Sau khi load component
 */
function onContentReady(event: any) {
  if (!event) {
    return;
  }
  emits("onContentReady", event.value);
}

/**
 * Chọn item của selectbox
 */
function onValueChanged(event: any) {
  if (!event) {
    return;
  }
  emits("onValueChanged", event.value);
}
</script>

<style lang="scss" scoped></style>
