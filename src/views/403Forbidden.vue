<template>
  <div class="content-403-forbidden flex-column center-center w-100">
    <div class="title">403!</div>
    <div class="message">{{ $t("403Forbidden.Message") }}</div>
    <div class="mt-3">
      <BaseButton
        icon="arrowleft"
        :text="$t('403Forbidden.BackHome')"
        type="default"
        styling-mode="contained"
        @onClick="backHome"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/base/components/BaseButton.vue";
import { PathURL } from "@/commons/constants/path";
import router from "@/router";

/**
 * Quay lại trang chủ
 */
function backHome() {
  // Điều hướng đến trang chủ
  router.push(PathURL.Dashboard);
}
</script>

<style lang="scss" scoped>
.content-403-forbidden {
  height: 80%;
  .title {
    font-size: 150px;
  }
}
</style>
