<template>
  <div class="login-container w-100 h-100">
    <div class="login-form">
      <!-- Tiêu đề -->
      <div class="w-100 d-flex pointer">
        <div
          v-for="item in listTab"
          :key="item.ID"
          class="title-form flex1"
          @click="onClickTab(item)"
          :class="{ active: activeTab == item.ID }"
        >
          {{ $t(item.TabName) }}
        </div>
      </div>

      <!-- Thông tin đăng nhập-->
      <div v-if="activeTab == 2" class="main-form">
        <!-- Tên đăng nhập -->
        <div class="group-form">
          <div class="label">
            {{ $t("Login.Username_Label") }}<span style="color: red"> *</span>
          </div>
          <div class="flex1">
            <BaseInput
              :value="loginParam.username"
              @onValueChanged="onChangeLogin($event, 'username')"
              @onContentReady="onReady"
              @onEnterKey="onEnterKey"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="group-form">
          <div class="label">
            {{ $t("Login.Password_Label") }}<span style="color: red"> *</span>
          </div>
          <div class="flex1">
            <BaseInput
              :mode="password.Mode"
              :isShowPassword="password.IsShowPassword"
              :value="loginParam.password"
              @onValueChanged="onChangeLogin($event, 'password')"
              @onEnterKey="onEnterKey"
              @onToggleShowPassword="onToggleShowPassword"
            />
          </div>
        </div>

        <!-- Quên mật khẩu -->
        <!-- <div class="forgot-password text-right pointer">
          {{ $t("Forgot_Password") }}
        </div> -->

        <!-- Button đăng nhập -->
        <div class="button w-100">
          <BaseButton
            width="100%"
            height="50px"
            :text="$t('Login.Login')"
            type="default"
            styling-mode="contained"
            :loading="isLoading"
            @onClick="onSubmit"
          />
        </div>
      </div>

      <!-- Thông tin đăng ký -->
      <div v-if="activeTab == 1" class="main-form">
        <!-- Họ -->
        <div class="group-form">
          <div class="label">
            {{ $t("Login.SurName_Label") }}<span style="color: red"> *</span>
          </div>
          <div class="flex1">
            <BaseInput
              :value="registerParam.surName"
              @onValueChanged="onChangeRegister($event, 'surName')"
              @onContentReady="onReady"
              @onEnterKey="onRegister"
            />
          </div>
        </div>

        <!-- Tên -->
        <div class="group-form">
          <div class="label">
            {{ $t("Login.Name_Label") }}<span style="color: red"> *</span>
          </div>
          <div class="flex1">
            <BaseInput
              :value="registerParam.name"
              @onValueChanged="onChangeRegister($event, 'name')"
              @onEnterKey="onRegister"
            />
          </div>
        </div>

        <!-- Họ và tên -->
        <div class="group-form">
          <div class="label">
            {{ $t("Login.FullName_Label") }}<span style="color: red"> *</span>
          </div>
          <div class="flex1">
            <BaseInput :value="registerParam.fullname" :disabled="true" />
          </div>
        </div>

        <!-- Email -->
        <div class="group-form">
          <div class="label">{{ $t("Login.Email_Label") }}</div>
          <div class="flex1">
            <BaseInput
              :value="registerParam.email"
              @onValueChanged="onChangeRegister($event, 'email')"
              @onEnterKey="onRegister"
            />
          </div>
        </div>

        <!-- Phone -->
        <div class="group-form">
          <div class="label">
            {{ $t("Login.Mobile_Label") }}<span style="color: red"> *</span>
          </div>
          <div class="flex1">
            <BaseInput
              :value="registerParam.phoneNumber"
              @onValueChanged="onChangeRegister($event, 'phoneNumber')"
              @onEnterKey="onRegister"
            />
          </div>
        </div>

        <!-- Tên đăng nhập -->
        <div class="group-form">
          <div class="label">
            {{ $t("Login.Username_Label") }}<span style="color: red"> *</span>
          </div>
          <div class="flex1">
            <BaseInput
              :disabled="true"
              :value="registerParam.phoneNumber"
              @onValueChanged="onChangeRegister($event, 'phoneNumber')"
              @onEnterKey="onRegister"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="group-form">
          <div class="label">
            {{ $t("Login.Password_Label") }}<span style="color: red"> *</span>
          </div>
          <div class="flex1">
            <BaseInput
              :mode="passwordRegister.Mode"
              :isShowPassword="passwordRegister.IsShowPassword"
              :value="registerParam.password"
              @onValueChanged="onChangeRegister($event, 'password')"
              @onEnterKey="onRegister"
              @onToggleShowPassword="onToggleShowPasswordRegister"
            />
          </div>
        </div>

        <!-- Button đăng ký -->
        <div class="button w-100">
          <BaseButton
            width="100%"
            height="50px"
            :text="$t('Login.Register')"
            type="default"
            styling-mode="contained"
            :loading="isLoading"
            @onClick="onRegister"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "@/base/components/BaseInput.vue";
import BaseButton from "@/base/components/BaseButton.vue";
import authService from "@/apis/auth-service.js";
import accountService from "@/apis/account-service";
import { LoginParam } from "@/commons/models/request-param/login-param";
import { ref, onMounted } from "vue";
import DxButton from "devextreme-vue/button";
import DxTextBox from "devextreme-vue/text-box";
import router from "@/router";
import { LocalStorageKey } from "@/base/shared/constants/localstorage-key";
import { PathURL } from "@/commons/constants/path";
import { BaseToast } from "@/base/toast/toast";
import { RegisterParam } from "@/commons/models/request-param/register-param";
import ProfileService from "@/apis/profile-service";
import { useStore } from "vuex";
import { setLocalStorage } from "@/base/functions/localStorageFns";
import { LocalStorageKey as LocalstorageKeyApp } from "@/commons/constants/localstorage-key";
import { useI18n } from "vue-i18n";
import { useReCaptcha } from "vue-recaptcha-v3";
import { ErrorCode } from "@/commons/enums/error-code-enum";

const recaptcha = useReCaptcha();

// -------------- Khai báo biến --------------- //

const { t } = useI18n();

const store = useStore();

const isLoading = ref(false);

const toast = new BaseToast();

const listTab = ref([
  {
    ID: 1,
    TabName: "Login.Register",
  },
  {
    ID: 2,
    TabName: "Login.Login",
  },
]);

const activeTab = ref(2);

let loginParam = ref<LoginParam>(
  new LoginParam(
    "",
    "",
    "",
    "password",
    import.meta.env.VITE_CLIENT_ID,
    import.meta.env.VITE_CLIENT_SECRET
  )
);

// Tham số đăng ký tài khoản
let registerParam = ref<RegisterParam>(new RegisterParam());

const password = ref({
  Mode: "password",
  IsShowPassword: false,
});

const passwordRegister = ref({
  Mode: "password",
  IsShowPassword: false,
});

// -------------- Khai báo hàm --------------- //

onMounted(() => {});

/**
 * Sự kiện active tab
 */
function onClickTab(tab: any) {
  activeTab.value = tab.ID;
  registerParam.value = new RegisterParam();
  loginParam.value = new LoginParam(
    "",
    "",
    "",
    "password",
    import.meta.env.VITE_CLIENT_ID,
    import.meta.env.VITE_CLIENT_SECRET
  );
}

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
 * Hàm gọi service đăng nhập
 */
async function login(param: LoginParam) {
  if (!param.username || !param.password) {
    toast.showToastWarning(t("ToastMessgage.LoginEmpty"));
    return;
  }

  isLoading.value = true;
  const params = new URLSearchParams();
  params.append("grant_type", param.grant_type);
  params.append("client_id", param.client_id);
  params.append("client_secret", param.client_secret);
  params.append("username", param.username);
  params.append("password", param.password);

  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("Login");

  const config = {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
      captcha: token,
    },
  };

  try {
    // const response = await axios(options);
    const response = await authService.login(params, config);
    if (response["access_token"]) {
      setLocalStorage(
        LocalStorageKey.Token,
        response["token_type"] + " " + response["access_token"]
      );
      toast.showToastSuccess(t("ToastMessgage.LoginSuccess"));

      // Gọi service lấy thông tin user
      const res = await ProfileService.getUserInfo();
      if (res && res.data) {
        const userInfo = res.data;
        if (store) {
          store.commit("GET_USER_INFO", userInfo);
        }
        const settings = userInfo.settings;
        const themeName = settings?.consoleTheme
          ? settings?.consoleTheme
          : settings?.theme;
        setLocalStorage(
          LocalstorageKeyApp.AutoLike_Theme,
          themeName || "Default"
        );
      }

      isLoading.value = false;

      // Điều hướng đến trang chủ
      router.push(PathURL.Dashboard);
    } else {
      isLoading.value = false;
      toast.showToastError(t("ToastMessgage.LoginError"));
    }
  } catch (error) {
    isLoading.value = false;
    toast.showToastError(t("ToastMessgage.LoginError"));
  }

  // const response = await authService.loginV2(loginParam);
  // if (response && response.message == "Success") {
  //   const data = response.data;
  //   if (data) {
  //     localStorage.setItem(LocalStorageKey.Token, data.token);
  //   }
  //   // Điều hướng đến trang chủ
  //   router.push(PathURL.Dashboard);
  // }
}

/**
 * Click sự kiện Đăng nhập
 */
function onSubmit() {
  // const deviceID = genderDeviceID();
  login(loginParam.value);
}

/**
 * Gõ enter để đăng nhập
 */
function onEnterKey(event: any) {
  onSubmit();
}

/**
 * Focus vào ô Input đầu tiên
 */
function onReady(event: any) {
  setTimeout(() => {
    event.component.focus();
  }, 0);
}

/**
 * Thay đổi thông tin đăng nhập
 */
function onChangeLogin(event: any, fieldName: string) {
  if (event == undefined || !fieldName) {
    return;
  }
  (loginParam.value as any)[fieldName] = event;
}

/**
 * Thay đổi thông tin đăng ký
 */
function onChangeRegister(event: any, fieldName: string) {
  if (event == undefined || !fieldName) {
    return;
  }
  (registerParam.value as any)[fieldName] = event;
  registerParam.value.fullname =
    registerParam.value.surName + " " + registerParam.value.name;
  registerParam.value.userName = registerParam.value.phoneNumber;
}

/**
 * Nhấn đăng ký
 */
async function onRegister() {
  const isValid = hanleValidateRegister();
  if (!isValid) {
    return;
  }

  isLoading.value = true;
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("Register");
  const config = {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      captcha: token,
    },
  };

  const res = await accountService.registerUser(registerParam.value, config);
  if (res && res.data) {
    toast.showToastSuccess(t("Login.Toast_Register_Success"));
    loginParam.value.username = registerParam.value.userName;
    loginParam.value.password = registerParam.value.password;
    activeTab.value = 2;
    registerParam.value = new RegisterParam();
  } else {
    if (res.errorCode == ErrorCode.UsernameExisted) {
      toast.showToastWarning(t("Login.Toast_UsernameExisted"));
    } else {
      toast.showToastError(t("Login.Toast_Register_Fail"));
    }
  }
  isLoading.value = false;
}

/**
 * Xử lý validate trước khi Register(
 */
function hanleValidateRegister() {
  if (!registerParam.value.name || !registerParam.value.surName) {
    toast.showToastWarning(t("ToastMessgage.FullnameEmpty"));
    return false;
  }

  if (!registerParam.value.phoneNumber) {
    toast.showToastWarning(t("ToastMessgage.PhoneNumberEmpty"));
    return false;
  }

  if (!registerParam.value.userName || !registerParam.value.password) {
    toast.showToastWarning(t("ToastMessgage.LoginEmpty"));
    return false;
  }

  return true;
}

/**
 * Hiển thị password không?
 */
function onToggleShowPassword(event: any) {
  password.value.Mode = event ? "text" : "password";
  password.value.IsShowPassword = event;
}

function onToggleShowPasswordRegister(event: any) {
  passwordRegister.value.Mode = event ? "text" : "password";
  passwordRegister.value.IsShowPassword = event;
}
</script>

<style lang="scss" scoped>
.login-container {
  background-color: #f5f6fa;
  padding-top: 50px;
  .login-form {
    margin: auto;
    background-color: #ffffff;
    margin-top: 48px;
    border-radius: 10px;
    max-width: 500px;
    .title-form {
      color: #707070;
      background: #f3f4f7;
      padding: 32px 16px;
      text-align: center;
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      text-transform: uppercase;
      border-radius: 0 !important;
      &.active {
        background-color: #ffffff;
      }
    }
    .main-form {
      padding: 40px;
      .group-form {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        margin-top: 16px;
        .label {
          color: #707070;
          font-style: normal;
          font-weight: 600;
          font-size: 14px;
          line-height: 16px;
          width: 30%;
        }
      }
      .forgot-password {
        margin-top: 12px;
        color: #707070;
      }
      .button {
        margin-top: 32px;
      }
    }
  }
}
</style>
