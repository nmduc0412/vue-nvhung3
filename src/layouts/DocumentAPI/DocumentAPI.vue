<template>
  <div class="container document-container">
    <div class="title mb-4">{{ $t("DocumentAPI.DocumentAPI") }}</div>
    <div class="card">
      <!-- Tài liệu Online -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("DocumentAPI.Postman") }}</span>
        </div>
        <div class="flex1 profile-input">
          <a
            style="padding-left: 12px"
            class="text-primary"
            :href="linkPostman"
            target="_blank"
            >{{ linkPostman }}</a
          >
        </div>
      </div>

      <!-- File đính kèm -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("DocumentAPI.DetailGuideDocument") }}</span>
        </div>
        <div class="flex1 profile-input">
          <a
            style="padding-left: 12px"
            class="text-primary"
            :href="linkDetail"
            target="_blank"
            >{{ linkDetail }}</a
          >
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

const linkPostman = import.meta.env.VITE_LINK_DOCUMENT_API;

const linkDetail = import.meta.env.VITE_LINK_DOCUMENT_API_DETAIL;

onMounted(() => {});
</script>

<style lang="scss" scoped>
.document-container {
  .card {
    .row {
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
    .qr-code {
      width: 300px;
      height: 300px;
    }
  }
}
</style>
