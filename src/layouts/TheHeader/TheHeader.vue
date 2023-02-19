<template>
  <div class="header-container">
    <div class="header-left d-flex">
      <div class="brand-image">
        <span class="icon icon-logo"></span>
      </div>
      <div class="menu-icon" @click="onClickMenu">
        <span class="icon icon-menu"></span>
      </div>
    </div>
    <div class="header-right d-flex align-items-center">
      <div class="">
        {{ $t("Balance") }}: {{ $filters.number(userInfo.balance) }}<sup>đ</sup>
      </div>
      <div id="localize" class="pointer ml-3" @click="onClickLocalize">
        <div class="d-flex align-items-center">
          <div class="icon" :class="currentLocalize.Icon"></div>
          <div class="dropdown-toggle"></div>
        </div>
      </div>
      <div id="avatar" class="avatar pointer" @click="onAccoutSetting">
        <span class="icon icon-avatar"></span>
      </div>
    </div>
  </div>

  <!-- Chọn ngôn ngữ -->
  <DxPopover
    :visible="isVisibleLocalize"
    target="#localize"
    position="bottom"
    width="60px"
  >
    <div
      class="dropdown-item"
      v-for="item in listLocalize"
      :key="item.ID"
      @click="onChangeLocalize(item)"
    >
      <div class="icon" :class="item.Icon"></div>
    </div>
  </DxPopover>

  <!-- Popover thiết lập user -->
  <base-popover
    target="#avatar"
    width="300px"
    height="auto"
    position="bottom"
    :isVisible="isVisibleUserSetting"
    @onHidden="isVisibleUserSetting = false"
  >
    <template v-slot:content="{ data }">
      <div class="user-setting">
        <div class="info">
          <div class="avatar pointer" style="margin: auto">
            <div style="fontsize: 24px">T</div>
          </div>
          <div class="fullname text-center">{{ userInfo.name }}</div>
          <div class="text-center" style="color: #666">
            {{ userInfo.userName }}
          </div>
        </div>

        <div class="list-action">
          <div class="action-item" @click="onAccoutSetting">
            Account setting
          </div>
          <div id="theme" class="action-item" @click="onClickTheme">
            Theme: {{ computedSettings.consoleTheme }}
          </div>
          <div class="action-item">Style Mode</div>
        </div>
      </div>
    </template>
  </base-popover>
</template>

<script setup lang="ts">
import BaseDropdownList from "@/base/components/BaseDropdownList.vue";
import BasePopover from "@/base/components/BasePopover.vue";
import { computed, onMounted, ref } from "vue";
import { DxPopover } from "devextreme-vue/popover";
import { LocalStorageKey } from "@/commons/constants/localstorage-key";
import i18n from "@/plugins/i18n";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import router from "@/router";
import { PathURL } from "@/commons/constants/path";
import { Settings } from "@/commons/models/settings";
import { BaseToast } from "@/base/toast/toast";
import {
  getLocalStorage,
  setLocalStorage,
} from "@/base/functions/localStorageFns";
const toast = new BaseToast();

const { t } = useI18n();
const store = useStore();
const userInfo = computed(() => store.state.userInfo);

let isVisibleLocalize = ref(false);

let isVisibleUserSetting = ref(false);

const currentLocalize = ref({ ID: 0, Name: "", Icon: "" });

const listTheme = [
  { ID: 0, ThemeName: "Default" },
  { ID: 1, ThemeName: "Theme1" },
  { ID: 2, ThemeName: "Theme2" },
  { ID: 3, ThemeName: "Theme3" },
  { ID: 4, ThemeName: "Theme4" },
  { ID: 5, ThemeName: "Theme5" },
];

const listLocalize = [
  { ID: 1, Name: "en", Icon: "icon-en" },
  { ID: 2, Name: "vi", Icon: "icon-vi" },
];

const isVisiblePopover = ref(false);

const settings = ref<Settings>(new Settings());

const computedSettings = computed(
  () => store.state.userInfo?.settings || new Settings()
);

const props = defineProps({
  isExpand: { type: Boolean, default: false },
});

const emits = defineEmits<{
  (e: "onClickMenu", value: boolean): void;
}>();

/********************* Popover thiết lập theo User ********************/

onMounted(() => {
  const locale = getLocalStorage("lang") || "vi";
  currentLocalize.value =
    listLocalize.find((item) => item.Name === locale) || listLocalize[1];
});

function onClickLocalize() {
  isVisibleLocalize.value = !isVisibleLocalize.value;
}

function onChangeLocalize(localize: any) {
  isVisibleLocalize.value = false;
  currentLocalize.value = localize;
  i18n.global.locale = localize.Name;
  setLocalStorage("lang", localize.Name);
}

/**
 * Thiết lập thông tin user
 */
function onAccoutSetting() {
  router.push(PathURL.Profile);
}

function onClickMenu() {
  emits("onClickMenu", !props.isExpand);
}
</script>

<style lang="scss" scoped>
@import "@/assets/icons.css";

.header-container {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: inset 0 -1px 0 #eee;
  .brand-name {
    color: rgb(30, 60, 114);
    font-size: 28px;
    font-weight: bold;
    line-height: 1;
  }

  .menu-icon {
    display: none;
  }
  @media (max-width: 576px) {
    .menu-icon {
      display: block;
    }
    .brand-image {
      display: none;
    }
  }

  .avatar {
    // background: rgb(128, 170, 255);
    // color: rgb(255, 255, 255);
    // font-weight: 600;
    min-width: 36px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
    line-height: 1;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-left: 16px;
  }
}

.dropdown-item {
  text-align: center;
  cursor: pointer;
  padding: 8px;
  &:hover {
    background-color: #e9ecef;
  }
}

.dropdown-toggle:after {
  display: inline-block;
  margin-left: 8px;
  vertical-align: 0.255em;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}

.user-setting {
  .avatar {
    background: rgb(128, 170, 255);
    color: rgb(255, 255, 255);
    font-weight: 600;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
    line-height: 1;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-left: 16px;
  }
  .fullname {
    font-size: 20px;
    font-weight: bold;
    margin-top: 8px;
  }
  .list-action {
    margin-top: 8px;
    .action-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 10px;
      border-radius: 6px;
      &:hover,
      &:active {
        background-color: #f2f2f2;
      }
    }
  }
}
</style>
