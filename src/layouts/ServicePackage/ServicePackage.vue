<template>
  <!-- Danh sách -->
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="title">{{ $t("ServicePackageList") }}</div>
    </div>

    <div class="d-flex">
      <!-- Lọc theo loại Service -->
      <div class="mr-2">
        <BaseSelectBox
          width="200px"
          keyID="ID"
          display="Name"
          :dataSource="listServiceType"
          :value="activeServiceType.ID"
          :searchEnabled="false"
          @onValueChanged="onChangedServiceType($event)"
        />
      </div>
      <div>
        <!-- Lọc theo trạng thái -->
        <BaseSelectBox
          width="200px"
          keyID="ID"
          display="StatusDisplay"
          :dataSource="listStatus"
          :value="activeStatus.ID"
          :searchEnabled="false"
          @onValueChanged="onChangedStatus($event)"
        />
      </div>
    </div>

    <div class="grid-service-package mt-3">
      <BaseGrid
        :loading="loadingGrid"
        :dataSource="dataSource"
        :columns="columns"
        :total="total"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        width="100%"
        height="calc(100vh - 261px)"
        @changePageSize="changePageSize"
        @changePageIndex="changePageIndex"
      >
        <template v-slot:action="{ data }">
          <div class="d-flex align-items-center">
            <BaseButton
              v-if="data.data.status == 1"
              width="92px"
              :text="$t('Cancel')"
              type="danger"
              styling-mode="outlined"
              @onClick="onCancelOrder(data.data)"
            />
          </div>
        </template>
      </BaseGrid>
    </div>
  </div>

  <!-- Popup confirm delete -->
  <BasePopupDelete
    :title="$t('CancelOrder')"
    :content="$t('ContentCancelOrder')"
    :isVisible="isVisiblePopupDelete"
    :loading="isLoadingDelete"
    :textButton="$t('Agree')"
    @closePopup="closePopupDelete"
    @onDelete="callAPICancel"
  >
  </BasePopupDelete>
</template>

<script setup lang="ts">
import BaseGrid from "@/base/components/BaseGrid.vue";
import BaseButton from "@/base/components/BaseButton.vue";
import BaseInput from "@/base/components/BaseInput.vue";
import BaseNumberBox2 from "@/base/components/BaseNumberBox2.vue";
import BaseSelectBox from "@/base/components/BaseSelectBox.vue";
import BasePopupDelete from "@/base/components/BasePopupDelete.vue";
import { computed, onMounted, ref, watch } from "vue";
import { BaseToast } from "@/base/toast/toast";
import { ColumnDataGrid } from "@/base/shared/models/grid/ColumnDataGrid";
import OrderService from "@/apis/order-service";
import { RouterName } from "@/commons/constants/router-name";
import { useRoute } from "vue-router";
import { PathURL } from "@/commons/constants/path";
import { cloneData } from "@/base/functions/commonFns";
import {
  ListServiceType,
  ListSpeed,
  ListTimeUnit,
} from "@/commons/constants/service-package";
import { ListStatus } from "@/commons/constants/list-status";
import { useI18n } from "vue-i18n";
import { useReCaptcha } from "vue-recaptcha-v3";
import { ListApplication } from "@/commons/constants/list-application";
import OrdersService from "@/apis/order-service";

const recaptcha = useReCaptcha();

const route = useRoute();

const { t } = useI18n();

const toast = new BaseToast();

// Trang số
let pageIndex = ref(1);

// Số bản ghi 1 trang
let pageSize = ref(25);

// Tổng số bản ghi
let total = ref(0);

// Tham số phân trang
const pagingParam = computed(() => {
  return {
    Application: activeApplication.value?.ID || 0,
    Status: activeStatus.value?.ID,
    ServiceType: activeServiceType.value?.ID,
    SkipCount: (pageIndex.value - 1) * pageSize.value,
    MaxResultCount: pageSize.value,
  };
});

// Danh sách cột
const columns = ref(new Array<ColumnDataGrid>());

// Bảng dữ liệu
let dataSource = ref([]);

// loading grid
let loadingGrid = ref(false);

// Tham số
const param = {
  symbol: import.meta.env.VITE_APPROVE_AGENCY_SYMBOL,
  ip: import.meta.env.VITE_APPROVE_AGENCY_IP,
};

// Loading Button
const loadingButton = ref(false);

// Check đang là view nào?
const isDetail = ref(false);

// Check đang là view nào?
const isUpdate = ref(false);

// Danh sách ứng dụng
const listApplication = cloneData(ListApplication);

// Danh sách service type
const listServiceType = cloneData(ListServiceType);

// Danh sách timeUnit
const listTimeUnit = cloneData(ListTimeUnit);

// Danh sách trạng thái
const listStatus = ref([]);

// Ứng dụng đang được chọn
const activeApplication = ref(listApplication[0]);

const activeServiceType = ref(listServiceType[0]);

// Trạng thái đang chọn
const activeStatus = ref({});

// Loading thêm loadingPackage
const loadingPackage = ref(false);

// Danh sách speed
const listSpeed = cloneData(ListSpeed);

// Popup confirm delete
const isVisiblePopupDelete = ref(false);

// Loading xóa
const isLoadingDelete = ref(false);

// Order
let orderId = "";

watch(
  () => route.path,
  async (path) => {
    activeApplication.value = listApplication.find(
      (item: any) => item.Path == path
    );
    getPaging();
  },
  { immediate: true }
);

onMounted(() => {
  localize();
  // getPaging();
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
 * Đa ngôn ngữ
 */
function localize() {
  listStatus.value = cloneData(ListStatus);
  listStatus.value.forEach((status: any) => {
    status.StatusDisplay = t(status.ResourceKey);
  });
  activeStatus.value = listStatus.value[1];

  columns.value = [
    new ColumnDataGrid("#", "Index", "60px"),
    new ColumnDataGrid(t("Order.Code"), "code"),
    new ColumnDataGrid(t("Order.UrlService"), "urlService", "320px"),
    new ColumnDataGrid(
      t("Order.Quantity"),
      "quantity",
      "auto",
      "",
      "left",
      false,
      "",
      "",
      "number",
      "#,##0.##"
    ),
    new ColumnDataGrid(
      t("Order.Completed"),
      "completedQuantity",
      "auto",
      "",
      "left",
      false,
      "",
      "",
      "number",
      "#,##0.##"
    ),
    // new ColumnDataGrid(t("Order.Application"), "ApplicationDisplay"),
    // new ColumnDataGrid(t("Order.ServiceType"), "ServiceTypeDisplay"),
    new ColumnDataGrid(t("Order.Speed"), "SpeedDisplay"),
    new ColumnDataGrid(t("Order.Warranty"), "WarrantyDisplay"),
    new ColumnDataGrid(
      t("Order.Total"),
      "price",
      "120px",
      "",
      "left",
      false,
      "",
      "",
      "number",
      "#,##0.## đ"
    ),
    new ColumnDataGrid(
      t("Order.DoActionTime"),
      "doActionTime",
      "auto",
      "",
      "center",
      false,
      "",
      "",
      "date",
      "dd/MM/yyyy HH:mm:ss"
    ),
    new ColumnDataGrid(
      t("Order.DoResultTime"),
      "doResultTime",
      "auto",
      "",
      "center",
      false,
      "",
      "",
      "date",
      "dd/MM/yyyy HH:mm:ss"
    ),
    new ColumnDataGrid(
      t("Order.CreatedDate"),
      "creationTime",
      "auto",
      "",
      "center",
      false,
      "",
      "",
      "date",
      "dd/MM/yyyy HH:mm:ss"
    ),
    new ColumnDataGrid(
      t("Order.Action"),
      "action",
      "125px",
      "custom",
      "center",
      true,
      "right"
    ),
  ];
}

/**
 * Xử lý tham số call api
 */
function handleParam(params: any) {
  const searchParams = new URLSearchParams();
  searchParams.append("application", params.Application);
  searchParams.append("status", params.Status);
  searchParams.append("serviceType", params.ServiceType);
  searchParams.append("skipCount", params.SkipCount);
  searchParams.append("maxResultCount", params.MaxResultCount);
  return searchParams;
}

/**
 * Lấy danh sách dịch vụ
 */
async function getPaging() {
  loadingGrid.value = true;
  dataSource.value = [];

  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("GetOrder");
  const params = handleParam(pagingParam.value);
  const config = {
    params: params,
    headers: {
      captcha: token,
    },
  };
  const res = await OrderService.getPaging(config);
  if (res && res.data) {
    const data = res.data;
    total.value = data.totalCount;
    const items = data.items;
    items.forEach((item: any, index: number) => {
      item.Index = index + 1;

      // Người tạo
      item.Fullname = (item.user.surName || "") + " " + (item.user.name || "");
      (item.user.name ? item.user.name + " - " : "") + item.user.phoneNumber;

      // Ứng dụng
      item.ApplicationDisplay =
        listApplication.find((i: any) => i.ID == item.service?.application)
          ?.Name || "";

      // Loại service
      item.ServiceTypeDisplay =
        listServiceType.find((i: any) => i.ID == item.service?.serviceType)
          ?.Name || "";

      // Tốc độ
      if (item.speed) {
        item.SpeedDisplay =
          listSpeed.find((i: any) => i.ID == item.speed?.type)?.Name || "";
      }

      // Bảo hành
      if (item.warranty) {
        item.WarrantyDisplay =
          item.warranty.time +
            " " +
            listTimeUnit.find((i: any) => i.ID == item.warranty.timeUnit)
              ?.Name || "";
      }
    });

    dataSource.value = data.items;
  }
  setTimeout(() => {
    loadingGrid.value = false;
  }, 50);
}

/**
 * Thay đổi số lượng bản ghi 1 trang
 */
function changePageSize(size: any) {
  pageSize.value = size;
  getPaging();
}

/**
 * Thay đổi số trang
 */
function changePageIndex(index: any) {
  pageIndex.value = index;
  getPaging();
}

/**
 * Sự kiện chọn loại dịch vụ
 */
function onChangedServiceType(event: any) {
  activeServiceType.value =
    listServiceType.find((item: any) => item.ID == event) || listServiceType[0];
  getPaging();
}

/**
 * Sự kiện chọn trạng thái
 */
function onChangedStatus(event: any) {
  activeStatus.value =
    listStatus.value.find((item: any) => item.ID == event) ||
    listStatus.value[0];
  getPaging();
}

/**
 * Sự kiện hủy Order
 */
function onCancelOrder(data: any) {
  if (!data) {
    return;
  }
  orderId = data.id;
  isVisiblePopupDelete.value = true;
}

/**
 * Sự kiện đóng popup xóa
 */
function closePopupDelete() {
  isLoadingDelete.value = false;
  isVisiblePopupDelete.value = false;
}

/**
 * Call API Cancel
 */
async function callAPICancel() {
  isLoadingDelete.value = true;
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("CancelOrder");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await OrdersService.cancelOrder(orderId, null, config);
  if (res && res.data) {
    toast.showToastSuccess("Cancel Order Success!");
    getPaging();
  } else {
    console.log(res);
    toast.showToastError("Cancel Order Error!");
  }
  closePopupDelete();
}
</script>

<style lang="scss" scoped>
.apps {
  display: flex;
  align-items: center;
  font-weight: bold;
  border-bottom: 1px solid #e3ebf6;
}

.app {
  width: 100px;
  cursor: pointer;
  margin-right: 8px;
  text-align: center;
}

.app:hover {
  color: #f5f5f5 !important;
  background: linear-gradient(180deg, #3cf 0, #06f);
  border-bottom: 1px solid #2c7be5 !important;
  border-radius: 18px;
  padding: 10px;
}

.appActive {
  color: #f5f5f5 !important;
  background: linear-gradient(180deg, #3cf 0, #06f);
  border-bottom: 1px solid #2c7be5 !important;
  border-radius: 18px;
  padding: 10px;
}
</style>
