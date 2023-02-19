<template></template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import router from "@/router";
import authService from "@/apis/auth-service.js";
import { LocalStorageKey } from "@/base/shared/constants/localstorage-key";
import { PathURL } from "@/commons/constants/path";
import { removeLocalStorage } from "@/base/functions/localStorageFns";
import { LocalStorageKey as LocalStorageKeyApp } from "@/commons/constants/localstorage-key";

// Hàm khởi tạo
onMounted(() => {
  logout();
});

/**
 * Hàm gọi service đăng xuất
 */
async function logout() {
  removeLocalStorage(LocalStorageKey.Token);
  removeLocalStorage(LocalStorageKeyApp.AutoLike_Theme);
  router.push(PathURL.Login);
}
</script>
