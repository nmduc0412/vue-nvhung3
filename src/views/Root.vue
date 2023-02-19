<script setup lang="ts">
import { RouterView } from "vue-router";
import { LocalStorageKey } from "@/commons/constants/localstorage-key";
import ProfileService from "@/apis/profile-service";
import { useStore } from "vuex";
import { computed, onMounted, watch } from "vue";
import { setLocalStorage } from "@/base/functions/localStorageFns";
import { useReCaptcha } from "vue-recaptcha-v3";
import useEventsBus from "@/composables/eventBus";
import { EventEmitter } from "@/commons/constants/event-emitter";
const recaptcha = useReCaptcha();

const store = useStore();
let userInfo = computed(() => store.state.userInfo);

const { bus } = useEventsBus();

onMounted(() => {
  // Load dữ liệu
  getUserInfo();
});

// Nhận dũ liệu refresh lại thông tin User
watch(
  () => bus.value.get(EventEmitter.RefreshProfile),
  (value: boolean) => {
    if (value) {
      getUserInfo(true);
    }
  }
);

/**
 * Lấy Token Recaptcha
 */
async function getTokenRecaptcha(action: string = "") {
  if (import.meta.env.VITE_IS_USE_RECAPTCHA) {
    await recaptcha?.recaptchaLoaded();
    return await recaptcha?.executeRecaptcha(action);
  } else {
    return "";
  }
}

/**
 * Lấy thông tin User
 */
async function getUserInfo(isCallAPI = false) {
  if (!userInfo.value || isCallAPI) {
    // Lấy token Recaptcha
    const token = await getTokenRecaptcha("GetProfile");
    recaptcha?.instance.value?.hideBadge();

    const config = {
      headers: {
        captcha: token,
      },
    };

    const response = await ProfileService.getUserInfo(config);
    if (response && response.data) {
      const currentUserInfo = response.data;
      const settings = currentUserInfo.settings || {
        consoleTheme: "Default",
        landingTheme: "Default",
        currency: "",
      };
      currentUserInfo.settings = settings;
      if (store) {
        store.commit("GET_USER_INFO", currentUserInfo);
      }
      const themeName = settings?.consoleTheme
        ? settings?.consoleTheme
        : settings?.theme;
      setLocalStorage(LocalStorageKey.AutoLike_Theme, themeName || "Default");
    }
  }
}

</script>

<template>
  <RouterView />
</template>
