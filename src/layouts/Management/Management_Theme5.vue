<template>
  <div class="d-flex flex-column w-100 h-100">
    <!-- Header   -->
    <div class="header">
      <TheHeader @onClickMenu="onClickMenu($event)" :isExpand="isExpand" />
    </div>

    <!-- Container -->
    <div class="flex1 d-flex h-100 container-content">
      <!-- Sidebar -->
      <div class="sidebar" :class="{ expand: isExpand }">
        <TheSidebar @onClickSidebar="isExpand = false" />
      </div>

      <!-- Main -->
      <div class="main flex1">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from "@/layouts/TheHeader/TheHeader.vue";
import TheSidebar from "@/layouts/TheSidebar/TheSidebar_Theme5.vue";
import { ref } from "@vue/reactivity";
import { RouterView } from "vue-router";

const isExpand = ref(false);

function onClickMenu(e: boolean) {
  isExpand.value = e;
}
</script>

<style lang="scss" scoped>
@media (max-width: 576px) {
  .sidebar {
    position: absolute;
    bottom: 0;
    z-index: 100;
    transform: translateX(-255px);
    transition: all 0.5s;
    &.expand {
      transform: translateX(0);
      transition: all 0.5s;
      width: 100%;
    }
  }
}

.sidebar {
  width: 255px;
}
.main {
  // padding: 24px 36px;
  width: calc(100% - 255px);
  background-color: #f4f6f8;
}
.container-content {
  overflow: hidden;
}
</style>

<style lang="scss">
.main {
  .container {
    padding: 24px;
    height: 100%;
    overflow: auto;
  }
}
</style>
