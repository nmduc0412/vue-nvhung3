<template>
  <!-- Giao diện chính -->
  <div class="container profile-container">
    <div class="title mb-4">{{ $t("Agency") }}</div>

    <div class="card">
      <!-- Agency secret key -->
      <div v-if="!isAddAgency" class="mb-3 row w-100">
        <div class="w-30"><span>Agency secret key</span></div>
        <div class="flex1 profile-input">
          <BaseInput
            :value="agency.agencyKey"
            :disabled="true"
            @onValueChanged="onValueChanged($event, 'agencyKey')"
          />
        </div>
      </div>

      <!-- Domain -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("Domain") }}</span>
        </div>
        <div class="flex1 profile-input">
          <BaseInput
            :value="agency.domain"
            placeholder="Enter domain"
            @onValueChanged="onChangedAgency($event, 'domain')"
          />
        </div>
      </div>

      <!-- Title -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("Title") }}</span>
        </div>
        <div class="flex1 profile-input">
          <BaseInput
            :value="agency.title"
            placeholder="Enter title"
            @onValueChanged="onChangedAgency($event, 'title')"
          />
        </div>
      </div>

      <!-- Address -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("Address") }}</span>
        </div>
        <div class="flex1 profile-input">
          <BaseInput
            :value="agency.address"
            placeholder="Enter address"
            @onValueChanged="onChangedAgency($event, 'address')"
          />
        </div>
      </div>

      <!-- Contact information -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("ContactInformation") }}</span>
        </div>
        <div class="flex1 profile-input">
          <BaseInput
            :value="agency.contact"
            placeholder="Enter contact information"
            @onValueChanged="onChangedAgency($event, 'contact')"
          />
        </div>
      </div>

      <!-- Payment Infomation -->
      <div class="mb-3 row w-100">
        <div class="w-30">{{ $t("PaymentInformation") }}</div>
        <div class="flex1 profile-input">
          <div class="content-detail">
            <div class="row">
              <div class="w-30">{{ $t("BankName") }}</div>
              <BaseInput
                class="w-70"
                :value="agency.paymentInformation.bankName"
                placeholder="Enter contact information"
                @onValueChanged="onChangedPayment($event, 'bankName')"
              />
            </div>

            <div class="row mt-3">
              <div class="w-30">{{ $t("AccountNumber") }}</div>
              <BaseInput
                class="w-70"
                :value="agency.paymentInformation.bankNumber"
                placeholder="Enter contact information"
                @onValueChanged="onChangedPayment($event, 'bankNumber')"
              />
            </div>

            <div class="row mt-3">
              <div class="w-30">{{ $t("AccountName") }}</div>
              <BaseInput
                class="w-70"
                :value="agency.paymentInformation.accountName"
                placeholder="Enter contact information"
                @onValueChanged="onChangedPayment($event, 'accountName')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Setting -->
      <div class="mb-3 row w-100" v-if="agency.settings">
        <div class="w-30">{{ $t("Settings") }}</div>
        <div class="flex1 profile-input">
          <div class="content-detail">
            <div class="row">
              <div class="w-30">{{ $t("UserTheme") }}</div>
              <div class="w-70">
                <BaseSelectBox
                  :items="consoleThemes"
                  :value="agency.settings.consoleTheme"
                  @onValueChanged="onChangedTheme($event, 'consoleTheme')"
                />
              </div>
            </div>

            <div class="row mt-3">
              <div class="w-30">{{ $t("LandingTheme") }}</div>
              <div class="w-70">
                <BaseSelectBox
                  :items="landingThemes"
                  :value="agency.settings.landingTheme"
                  @onValueChanged="onChangedTheme($event, 'landingTheme')"
                />
              </div>
            </div>

            <div class="row mt-3">
              <div class="w-30">{{ $t("Currency") }}</div>
              <BaseInput
                class="w-70"
                :value="agency.settings.currency"
                placeholder="Enter currency"
                @onValueChanged="onChangedTheme($event, 'currency')"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-end">
        <!-- Thêm đại lý -->
        <div v-if="isAddAgency">
          <BaseButton
            icon="add"
            class="ml-3 mt-3"
            type="default"
            styling-mode="contained"
            :text="$t('AddAgency')"
            :loading="isLoading"
            @click="addAgency($event)"
          />
        </div>

        <div v-else>
          <!-- Cập nhật thông tin đại lý -->
          <BaseButton
            class="ml-3 mt-3"
            type="default"
            styling-mode="contained"
            :text="$t('UpdateAgency')"
            :loading="isLoading"
            @click="updateAgency($event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BasePopup from "@/base/components/BasePopup.vue";
import BaseButton from "@/base/components/BaseButton.vue";
import BaseSelectBox from "@/base/components/BaseSelectBox.vue";
import BaseInput from "@/base/components/BaseInput.vue";
import { DxPopup } from "devextreme-vue/popup";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import ArrayStore from "devextreme/data/array_store";
import { BaseToast } from "@/base/toast/toast";
import { ListBank } from "@/commons/constants/list-bank";
import { Agency } from "@/commons/models/agency";
import authService from "@/apis/auth-service";
import AgencyService from "@/apis/agency-service";
import SettingsService from "@/apis/settings-service";
import { useReCaptcha } from "vue-recaptcha-v3";
const recaptcha = useReCaptcha();

const toast = new BaseToast();

const store = useStore();
const userInfo = computed(() =>
  JSON.parse(JSON.stringify(store.state.userInfo || {}))
);

// Mở popup đổi mk
const isVisiblePopup = ref(false);

// Đối tượng mật khẩu
let passwordInfo = ref({
  confirm_password: "",
  newPassword: "",
  password: "",
});

// Datasource bank
const listBank = JSON.parse(JSON.stringify(ListBank));

// Thông tin đại lý
let agency = ref<Agency>(new Agency());

// Danh sách theme
let consoleThemes = ref([]);
let landingThemes = ref([]);

const isLoading = ref(false);

const isAddAgency = ref(true);

onMounted(() => {
  getAllTheme();

  getAgencyInfo();
});

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
 * Sự kiện nhập text
 */
function onValueChanged(event: any, fieldName: string) {
  if (!event || !fieldName) {
    return;
  }
  userInfo.value[fieldName] = event;
}

/**
 * Lấy danh sách tất cả theme
 */
async function getAllTheme() {
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("GetAllTheme");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await SettingsService.getAllTheme(config);
  if (res && res.data) {
    const data = res.data;
    consoleThemes.value = data.consoleThemes;
    landingThemes.value = data.landingThemes;
  }
}

/**
 * Sự kiện chọn theme
 */
function onChangedTheme(event: any, fieldName: string) {
  if (!event || !fieldName) {
    return;
  }
  agency.value.settings[fieldName] = event;
}

/**
 * Sự kiện chọn ngân hàng
 */
function onChangedPayment(event: any, fieldName: string) {
  if (!event || !fieldName) {
    return;
  }
  agency.value.paymentInformation[fieldName] = event;
}
/**
 * Sự kiện nhập text
 */
function onChangedAgency(event: any, fieldName: string) {
  if (!event || !fieldName) {
    return;
  }
  agency.value[fieldName] = event;
}

/**
 * Thêm đại lý
 */
async function addAgency(event: any) {
  isLoading.value = true;
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("AddAgency");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await AgencyService.registerAgency(agency.value, config);
  if (res && res.data) {
    isAddAgency.value = false;
    agency.value = res.data;
    toast.showToastSuccess("Add Agency Success");
  } else {
    const messages = res?.messages?.domain;
    if (messages?.length > 0) {
      toast.showToastError(messages[0]);
    } else {
      toast.showToastError("Error");
    }
  }
  isLoading.value = false;
}

/**
 * Update đại lý
 */
async function updateAgency(event: any) {
  isLoading.value = true;
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("UpdateAgency");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await AgencyService.updateAgencyProfile(agency.value, config);
  if (res && res.data) {
    toast.showToastSuccess("Update Agency Success!");
  } else {
    toast.showToastError("Update Agency Error!");
  }
  isLoading.value = false;
}

/**
 * Lấy thông tin đại lý
 */
async function getAgencyInfo() {
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("GetAgencyInfo");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await AgencyService.getAgencyProfile(config);
  if (res && res.data) {
    isAddAgency.value = false;
    const data = res.data;
    agency.value = new Agency(
      data.domain,
      data.title,
      data.address,
      data.contact,
      data.agencyKey,
      data.paymentInformation
        ? data.paymentInformation
        : agency.value.paymentInformation,
      data.settings ? data.settings : agency.value.settings
    );
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
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

  .content-detail {
    background: #ffffff;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background-color: whitesmoke;
    .footer-confirm {
      justify-content: center;
      margin-top: 24px;
      width: 100%;
    }
  }

  @media (max-width: 576px) {
    .list-button {
      justify-content: flex-end;
    }
  }
}

.popup-container {
  padding: 24px;
  .auth-form .title {
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    text-transform: uppercase;
    color: #1e3c72;
    margin-bottom: 40px;
  }
}
</style>
