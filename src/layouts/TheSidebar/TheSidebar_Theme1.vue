<script setup lang="ts">
import { ListTabDefault } from "@/commons/constants/listtab.js";
import router from "@/router";
import { ref } from "@vue/reactivity";
import DxScrollView from "devextreme-vue/scroll-view";
import { watch } from "vue";
import { useRoute } from "vue-router";
import { PathURL } from "@/commons/constants/path";
import { RouterName } from "@/commons/constants/router-name";

const route = useRoute();

const props = defineProps({
  isExpand: { type: Boolean, default: false },
});

const emits = defineEmits<{
  (e: "onClickSidebar", value: boolean): void;
}>();

let listTab = ref(ListTabDefault);

// Active Item
let acticeItem = ref(listTab.value[0]);
let acticeItemChild = ref(null);
watch(
  () => route.path,
  async (route) => {
    // focus lại vào tab cha
    for (const key in PathURL) {
      if (Object.prototype.hasOwnProperty.call(PathURL, key)) {
        const value = (PathURL as any)[key];
        if (
          value !== "" &&
          (route.includes(value) || route.includes(value.replace("/:tab", "")))
        ) {
          var tab =
            ListTabDefault.find((x) => x.Router == key) || ListTabDefault[0];
          // focus lại vào tab con
          // if (tab?.ListChild?.length) {
          //   tab.IsShowChild = true;
          //   acticeItemChild.value = tab.ListChild.find(
          //     (x) => x.Router == route.params.tab
          //   );
          // }
          acticeItem.value = tab;

          return;
        }
      }
    }
  },
  { immediate: true }
);

// Click SidebarItem
function onClickSidebarItem(item: any) {
  emits("onClickSidebar", true);

  if (!item) return;
  acticeItemChild.value = null;
  acticeItem.value = item;
  item.IsShowChild = item.ListChild?.length > 0 ? true : false;
  listTab.value.forEach((element: any) => {
    if (element.ID != item.ID) {
      element.IsShowChild = false;
    }
  });

  if (
    // acticeItem.value.Router == RouterName.Clone ||
    acticeItem.value.Router == RouterName.EarnMoney ||
    acticeItem.value.Router == RouterName.Report
  ) {
    acticeItemChild.value =
      acticeItemChild.value ?? acticeItem.value.ListChild[0];
    router.push({
      name: acticeItem.value?.Router,
      params: { tab: acticeItemChild.value.Router },
    });
  } else router.push({ name: item?.Router });
}

function onClickSidebarItemChild(item: any) {
  if (!item) return;
  acticeItemChild.value = item;
  router.push({
    name: acticeItem.value?.Router,
    params: { tab: acticeItemChild.value.Router },
  });
}
</script>

<template>
  <DxScrollView :height="'calc(100vh - 68px)'">
    <div class="sidebar-container w-100 h-100">
      <template v-for="(item, index) in listTab" :key="item.ID">
        <div class="sidebar-item">
          <!-- Item cha -->
          <div
            class="sidebar-parent-item d-flex align-items-center"
            :class="{ active: acticeItem.ID == item.ID }"
            @click="onClickSidebarItem(item)"
          >
            <div class="sidebar-icon">
              <span class="icon" :class="item.Icon"></span>
            </div>
            <div class="sidebar-name">{{ $t(item.Name) }}</div>
          </div>
          <!-- Danh sách Item con -->
          <div
            v-if="item.ListChild && item.IsShowChild == true"
            class="list-child"
          >
            <div
              class="sidebar-child-item"
              v-for="itemChild in item.ListChild"
              :key="itemChild.ID"
              :class="{
                active:
                  acticeItemChild &&
                  itemChild &&
                  acticeItemChild.ID == itemChild.ID,
              }"
              @click="onClickSidebarItemChild(itemChild)"
            >
              {{ $t(itemChild.Name) }}
            </div>
          </div>
        </div>
        <div class="sidebar-divine" v-if="index == listTab.length - 3"></div>
      </template>
    </div>
  </DxScrollView>
</template>

<style lang="scss" scoped>
@import "@/assets/icons.css";
.sidebar-container {
  min-height: calc(100vh - 68px);
  background-color: #c04038;
  color: #ffffff;
  padding: 30px 20px;
  min-width: 255px;
  .sidebar-parent-item,
  .sidebar-child-item {
    line-height: 42px;
    cursor: pointer;
    color: #fff;
    padding: 0px 11px;
    &.active {
      background-color: #8b1f18;
      border-radius: 15px;
    }
    .sidebar-icon {
      width: 24px;
      min-height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sidebar-name {
      margin-left: 10px;
    }
  }
  .list-child {
    padding-top: 8px;
    padding-left: 24px;
  }
  .sidebar-divine {
    height: 1px;
    background: hsla(0, 0%, 100%, 0.2);
    margin: 30px 11px;
  }
}
</style>
