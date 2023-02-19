<template>
  <!-- Giao diện chính -->
  <div class="container profile-container">
    <div class="title mb-4">{{ $t("Profile") }}</div>
    <div class="card">
      <!-- Họ -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("Surname") }}</span
          ><span style="color: red"> *</span>
        </div>
        <div class="flex1 profile-input">
          <BaseInput
            :value="userInfo.surname"
            placeholder="Enter surname"
            @onValueChanged="onValueChanged($event, 'surname')"
          />
        </div>
      </div>

      <!-- Tên user -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("Name") }}</span
          ><span style="color: red"> *</span>
        </div>
        <div class="flex1 profile-input">
          <BaseInput
            :value="userInfo.name"
            placeholder="Enter name"
            @onValueChanged="onValueChanged($event, 'name')"
          />
        </div>
      </div>

      <!-- Username -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("UserName") }}</span
          ><span style="color: red"> *</span>
        </div>
        <div class="flex1 profile-input">
          <BaseInput
            :value="userInfo.userName"
            :disabled="true"
            @onValueChanged="onValueChanged($event, 'userName')"
          />
        </div>
      </div>

      <!-- Email -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>Email</span><span style="color: red"> *</span>
        </div>
        <div class="flex1 profile-input">
          <BaseInput
            :value="userInfo.email"
            placeholder="Enter email"
            @onValueChanged="onValueChanged($event, 'email')"
          />
        </div>
      </div>

      <!-- User Theme -->
      <div class="mb-3 row w-100" v-if="userInfo.settings">
        <div class="w-30">
          <span>{{ $t("UserTheme") }}</span>
        </div>
        <div class="flex1 profile-input">
          <div class="select-container text-14">
            <BaseSelectBox
              :items="consoleThemes"
              :value="userInfo.settings.consoleTheme"
              @onValueChanged="onChangedTheme($event, 'consoleTheme')"
            />
          </div>
        </div>
      </div>

      <!-- LandingTheme -->
      <div class="mb-3 row w-100" v-if="userInfo.settings">
        <div class="w-30">
          <span>{{ $t("LandingTheme") }}</span>
        </div>
        <div class="flex1 profile-input">
          <div class="select-container text-14">
            <BaseSelectBox
              :items="landingThemes"
              :value="userInfo.settings.landingTheme"
              @onValueChanged="onChangedTheme($event, 'landingTheme')"
            />
          </div>
        </div>
      </div>

      <!-- Currency -->
      <div class="mb-3 row w-100" v-if="userInfo.settings">
        <div class="w-30">
          <span>{{ $t("Currency") }}</span>
        </div>
        <div class="flex1 profile-input">
          <BaseInput
            :value="userInfo.settings.currency"
            placeholder="Enter currency"
            @onValueChanged="onChangedTheme($event, 'currency')"
          />
        </div>
      </div>

      <!-- Danh sách button -->
      <div class="row justify-content-between pt-1 list-button">
        <!-- Đổi mật khẩu -->
        <BaseButton
          class="mt-3"
          :text="$t('ChangePassword')"
          type="default"
          styling-mode="contained"
          @click="onClickChangePassword($event)"
        />

        <div class="row justify-content-end">
          <!-- Cập nhật thông tin -->
          <BaseButton
            class="mt-3"
            width="120px"
            type="default"
            styling-mode="contained"
            :loading="isLoading"
            :text="$t('Update')"
            @click="updateUserInfo($event)"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Popup đổi mật khẩu -->
  <BasePopup
    :isVisible="isVisiblePopup"
    :title="$t('ChangePassword')"
    width="600px"
    @closePopup="onHidden"
  >
    <template v-slot:content>
      <div class="auth-form">
        <div class="form-change-password">
          <div class="d-flex align-items-center mb-3">
            <label for="forgot-password-phone" class="w-40">{{
              $t("TitlePassword")
            }}</label>
            <div class="pl-0 w-80">
              <BaseInput
                :value="passwordInfo.password"
                :placeholder="$t('PlaceholderPassword')"
                :mode="password.Mode"
                :isShowPassword="password.IsShowPassword"
                @onContentReady="onContentReady"
                @onValueChanged="onChangedPassword($event, 'password')"
                @onToggleShowPassword="onToggleShowPassword"
              />
            </div>
          </div>
          <div class="d-flex align-items-center mb-3">
            <label
              for="forgot-password-phone"
              class="form-label col-form-label w-40"
              >{{ $t("TitleNewPassword") }}</label
            >
            <div class="pl-0 w-80">
              <BaseInput
                :value="passwordInfo.newPassword"
                :placeholder="$t('PlaceholderNewPassword')"
                :mode="newPassword.Mode"
                :isShowPassword="newPassword.IsShowPassword"
                @onValueChanged="onChangedPassword($event, 'newPassword')"
                @onToggleShowPassword="onToggleShowNewPassword"
              />
            </div>
          </div>
          <div class="d-flex align-items-center mb-3">
            <label
              for="forgot-password-phone"
              class="form-label col-form-label w-40"
              >{{ $t("TitleConfirmPassword") }}</label
            >
            <div class="pl-0 w-80">
              <BaseInput
                :value="passwordInfo.confirm_password"
                :placeholder="$t('PlaceholderConfirmPassword')"
                :mode="confirmPassword.Mode"
                :isShowPassword="confirmPassword.IsShowPassword"
                @onValueChanged="onChangedPassword($event, 'confirm_password')"
                @onToggleShowPassword="onToggleShowConfirmPassword"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <BaseButton
        :text="$t('Save')"
        type="default"
        styling-mode="contained"
        :loading="isLoadingPassword"
        @click="confirmChangePassword($event)"
      />
    </template>
  </BasePopup>
</template>

<script setup lang="ts">
import BasePopup from "@/base/components/BasePopup.vue";
import BaseButton from "@/base/components/BaseButton.vue";
import BaseSelectBox from "@/base/components/BaseSelectBox.vue";
import BaseInput from "@/base/components/BaseInput.vue";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { BaseToast } from "@/base/toast/toast";
import profileService from "@/apis/profile-service";
import SettingsService from "@/apis/settings-service";
import { LocalStorageKey } from "@/commons/constants/localstorage-key";
import {
  getLocalStorage,
  setLocalStorage,
} from "@/base/functions/localStorageFns";
import { cloneData } from "@/base/functions/commonFns";
import { useReCaptcha } from "vue-recaptcha-v3";
const recaptcha = useReCaptcha();

const toast = new BaseToast();

const store = useStore();
const userInfo = computed(() =>
  cloneData(
    store.state.userInfo || {
      userName: "",
      normalizedUserName: "",
      name: "",
      surname: "",
      phoneNumber: "",
      email: "",
      normalizedEmail: "",
      socialNetwork: null,
      balance: 0.0,
      settings: {
        consoleTheme: "Default",
        landingTheme: "Default",
        currency: "",
      },
      id: "",
    }
  )
);

// Mở popup đổi mk
const isVisiblePopup = ref(false);

// Đối tượng mật khẩu
let passwordInfo = ref({
  confirm_password: "",
  newPassword: "",
  password: "",
});

// Danh sách theme
let consoleThemes = ref([]);
let landingThemes = ref([]);

// Loading update thông tin user
const isLoading = ref(false);

// Loading cập nhật mật khẩu
const isLoadingPassword = ref(false);

const password = ref({
  Mode: "password",
  IsShowPassword: false,
});

const confirmPassword = ref({
  Mode: "password",
  IsShowPassword: false,
});

const newPassword = ref({
  Mode: "password",
  IsShowPassword: false,
});

onMounted(() => {
  getAllTheme();
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
 * Call api update thông tin
 */
async function updateUserInfo() {
  const oldConsoleTheme = getLocalStorage(LocalStorageKey.AutoLike_Theme);
  isLoading.value = true;

  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("UpdateUserInfo");
  const config = {
    headers: {
      captcha: token,
    },
  };

  const res = await profileService.updateUserInfo(userInfo.value, config);
  if (res && res.data) {
    toast.showToastSuccess("The information was updated successfully");

    // Nếu có thay đổi theme thì set vào localstorage rồi reload
    if (oldConsoleTheme != res.data?.settings?.consoleTheme) {
      setLocalStorage(
        LocalStorageKey.AutoLike_Theme,
        userInfo?.value?.settings?.consoleTheme || "Default"
      );
      window.location.href = window.location.origin;
    }
  } else {
    toast.showToastError("An error has occurred");
  }
  isLoading.value = false;
}

/**
 * Sự kiện đóng mk
 */
function onHidden(event: any) {
  isVisiblePopup.value = false;
}

/**
 * Nhấn mở popup đổi mk
 */
function onClickChangePassword(event: any) {
  isVisiblePopup.value = true;
}

/**
 * Sự kiện nhập text
 */
function onChangedPassword(event: any, fieldName: string) {
  if (!event || !fieldName) {
    return;
  }
  passwordInfo.value[fieldName] = event;
}

/**
 * Xác nhận đổi mật khẩu
 */
function confirmChangePassword(event: any) {
  changePassword(passwordInfo.value);
}

/**
 * Call api đổi mk
 */
async function changePassword(passwordInfo: any) {
  if (passwordInfo.newPassword != passwordInfo.confirm_password) {
    toast.showToastWarning("Confirm password failed!");
    return;
  }
  isLoadingPassword.value = true;
  try {
    // Lấy token Recaptcha
    const token = await getTokenRecaptcha("ChangePassword");
    const config = {
      headers: {
        captcha: token,
      },
    };
    const res = await profileService.changePassword(passwordInfo, config);
    if (res && res?.data) {
      isVisiblePopup.value = false;
      toast.showToastSuccess("Change password success!");
    } else {
      toast.showToastError(res?.message);
    }
    isLoadingPassword.value = false;
  } catch (error: any) {
    toast.showToastError(error?.message);
    isLoadingPassword.value = false;
  }
}

/**
 * Hiển thị password không?
 */
function onToggleShowPassword(event: any) {
  password.value.Mode = event ? "text" : "password";
  password.value.IsShowPassword = event;
}

function onToggleShowNewPassword(event: any) {
  newPassword.value.Mode = event ? "text" : "password";
  newPassword.value.IsShowPassword = event;
}

function onToggleShowConfirmPassword(event: any) {
  confirmPassword.value.Mode = event ? "text" : "password";
  confirmPassword.value.IsShowPassword = event;
}

/** ------------------ Thêm đại lý ---------------- */

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
  userInfo.value.settings[fieldName] = event;
}

/**
 * Focus vào username
 */
function onContentReady(event: any) {
  setTimeout(() => {
    event.component.focus();
  }, 0);
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
  @media (max-width: 576px) {
    .list-button {
      justify-content: flex-end;
    }
  }
}

.auth-form .title {
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  text-transform: uppercase;
  color: #1e3c72;
  margin-bottom: 40px;
}
</style>
