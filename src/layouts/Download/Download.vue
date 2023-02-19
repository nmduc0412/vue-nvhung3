<template>
  <!-- Nhập giftcode -->
  <div class="container giftcode-container">
    <div class="title mb-4">{{ $t("DownloadApp") }}</div>
    <div class="card">
      <!-- Download App Desktop -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("DownloadDesktop") }}</span>
        </div>
        <div class="flex1 profile-input">
          <a style="padding-left:12px" class="text-primary" :href="linkDesktop" target="_blank">{{
            linkDesktop
          }}</a>
        </div>
      </div>

      <!-- Download App Desktop -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("DownloadMobile") }}</span>
        </div>
        <div class="flex1 profile-input">
          <a style="padding-left:12px" class="text-primary" :href="linkAppMobile" target="_blank">{{
            linkAppMobile
          }}</a>
          <div class="qr-code">
            <img class="w-100 h-100" src="/src/assets/icons/QRCode_AppMobile.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { BaseToast } from "@/base/toast/toast";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const toast = new BaseToast();

const linkDesktop = import.meta.env.VITE_LINK_APP_DESKTOP;

const linkAppMobile = import.meta.env.VITE_LINK_APP_MOBILE;

onMounted(() => {});
</script>

<style lang="scss" scoped>
.giftcode-container {
  .card {
    .row{
      align-items: normal;
    }
    margin-bottom: 1.5rem;
    border-color: #edf2f9;
    background: #fff;
    -webkit-filter: drop-shadow(0 0 30px hsla(0, 0%, 70.6%, 0.2));
    filter: drop-shadow(0 0 30px rgba(180, 180, 180, 0.2));
    border-radius: 0.25rem;
    padding: 24px;
    .w-30 {
      min-width: 146px;
    }
    .profile-input {
      min-width: 150px;
    }
    .in_active_check {
      color: #dc3545;
    }
    .qr-code{
      width: 300px;
      height: 300px;
    }
  }
}
</style>
