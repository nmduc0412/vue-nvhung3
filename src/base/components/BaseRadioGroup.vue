<template>
  <div class="custom-radio-group">
    <DxRadioGroup
      v-model:value="props.value"
      :items="items"
      :value-expr="keyID"
      :display-expr="display"
      :disabled="disabled"
      @value-changed="onValueChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import type { PropType } from "vue";
import DxRadioGroup from "devextreme-vue/radio-group";

const props = defineProps({
  items: { type: Array as PropType<Array<any>> },
  keyID: { type: String },
  display: { type: String },
  value: { type: Number || String },
  disabled: { type: Boolean, default: false },
});

const emits = defineEmits<{
  (e: "onValueChanged", item: any): void;
}>();

onMounted(() => {});

function onValueChanged(event: any) {
  if (!event) {
    return;
  }
  emits("onValueChanged", event.value);
}
</script>

<style lang="scss">
.custom-radio-group {
  .dx-radiogroup {
    .dx-radiobutton-icon {
      width: 16px;
      height: 16px;
    }
    .dx-radiobutton-icon::before {
      display: block;
      width: 16px;
      height: 16px;
      border: 1px solid #ddd;
      background-color: #fff;
      content: "";
      border-radius: 11px;
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
    }
    .dx-radiobutton-icon-checked .dx-radiobutton-icon-dot {
      display: block;
      margin-top: -13px;
      margin-left: 5px;
      width: 8px;
      height: 8px;
      background: #337ab7;
      content: "";
      border-radius: 5px;
    }
    .dx-item-content{
        margin-top: 2px;
    }
  }
}
</style>
