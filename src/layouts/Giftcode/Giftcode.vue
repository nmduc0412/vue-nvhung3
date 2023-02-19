<template>
  <!-- Nhập giftcode -->
  <div class="container giftcode-container">
    <div class="title mb-4">{{ $t("Giftcode") }}</div>
    <div class="card">
      <!-- Code -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("Giftcode") }}</span>
        </div>
        <div class="flex1 profile-input">
          <BaseInput
            :placeholder="$t('Giftcode_Placeholder')"
            :value="giftcode.code"
            @onContentReady="onReady"
            @onValueChanged="onValueChanged($event)"
          />
        </div>
      </div>

      <!-- Apply Giftcode -->
      <div class="row justify-content-center mt-4">
        <BaseButton
          :text="$t('RedeemReward')"
          type="success"
          styling-mode="contained"
          :loading="isLoading"
          @click="applyGiftcode($event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/base/components/BaseButton.vue";
import BaseInput from "@/base/components/BaseInput.vue";
import { computed, onMounted, ref } from "vue";
import { BaseToast } from "@/base/toast/toast";
import GiftcodeService from "@/apis/giftcode-service";
import { useI18n } from "vue-i18n";
import { useReCaptcha } from "vue-recaptcha-v3";
import useEventsBus from "@/composables/eventBus";
import { EventEmitter } from "@/commons/constants/event-emitter";

const { emit } = useEventsBus();

const recaptcha = useReCaptcha();

const { t } = useI18n();

const toast = new BaseToast();

const giftcode = ref({
  code: "",
});

const isLoading = ref(false);

onMounted(() => {});

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
 * API nhập mã quà tặng
 */
async function applyGiftcode() {
  isLoading.value = true;
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("ApplyGiftCode");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await GiftcodeService.applyGift(giftcode.value, config);
  if (res && res.data) {
    // Bắn data order thành công => Refresh balance
    emit(EventEmitter.RefreshProfile, true);
    toast.showToastSuccess(t("RedeemRewardSuccess"));
    giftcode.value = {
      code: "",
    };
  } else {
    if (res.errorCode === 1001) {
      toast.showToastError(t("GiftCodeNotFound"));
    } else {
      toast.showToastError(t("RedeemRewardFailed"));
    }
  }
  isLoading.value = false;
}

/**
 * Thay đổi giá trị Giftcode
 */
function onValueChanged(data: any) {
  giftcode.value.code = data;
}

/**
 * Focus vào ô Input đầu tiên
 */
function onReady(event: any) {
  setTimeout(() => {
    event.component.focus();
  }, 0);
}
</script>

<style lang="scss" scoped>
.giftcode-container {
  .card {
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
  }
  @media (max-width: 576px) {
    .list-button {
      justify-content: flex-end;
    }
  }
}
</style>
