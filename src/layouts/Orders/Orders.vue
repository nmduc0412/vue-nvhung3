<template>
  <!-- Danh sách -->
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="title">{{ $t("Orders") }}</div>
    </div>

    <div class="grid-orders mt-3">
      <BaseGrid
        :loading="loadingGrid"
        :dataSource="dataSource"
        :columns="columns"
        :total="total"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        width="100%"
        height="calc(100vh - 209px)"
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
import BasePopupDelete from "@/base/components/BasePopupDelete.vue";
import { computed, onMounted, ref } from "vue";
import { BaseToast } from "@/base/toast/toast";
import { ColumnDataGrid } from "@/base/shared/models/grid/ColumnDataGrid";
import OrdersService from "@/apis/order-service";
import {
  ListApplication,
  ListServiceType,
  ListTimeUnit,
  ListSpeed,
} from "@/commons/constants/service-package";
import { ListStatus } from "@/commons/constants/list-status";
import { cloneData } from "@/base/functions/commonFns";
import { useReCaptcha } from "vue-recaptcha-v3";
import { useI18n } from "vue-i18n";
const recaptcha = useReCaptcha();
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
    SkipCount: (pageIndex.value - 1) * pageSize.value,
    MaxResultCount: pageSize.value,
  };
});

// Tham số bộ lọc
const filterParam = ref({
  Status: 0,
  UserId: null,
});

// Danh sách cột
const columns = ref(new Array<ColumnDataGrid>());

// Bảng dữ liệu
let dataSource = ref([]);

// loading grid
let loadingGrid = ref(false);

// Danh sách application
const listApplication = cloneData(ListApplication);

// Danh sách service type
const listServiceType = cloneData(ListServiceType);

// Danh sách speed
const listSpeed = cloneData(ListSpeed);

// Danh sách timeUnit
const listTimeUnit = cloneData(ListTimeUnit);

// Danh sách trạng thái
const listStatus = cloneData(ListStatus);

// Popup confirm delete
const isVisiblePopupDelete = ref(false);

// Loading xóa
const isLoadingDelete = ref(false);

// Order
let orderId = "";

onMounted(() => {
  localize();

  getPaging();
});

/**
 * Localize
 */
function localize() {
  columns.value = [
    new ColumnDataGrid("#", "Index", "60px"),
    new ColumnDataGrid(t("Order.Code"), "code"),
    new ColumnDataGrid(t("Order.UrlService"), "urlService"),
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
    new ColumnDataGrid(t("Order.Application"), "ApplicationDisplay"),
    new ColumnDataGrid(t("Order.ServiceType"), "ServiceTypeDisplay"),
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
    new ColumnDataGrid(t("Order.Status"), "StatusDisplay"),
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
 * Xử lý tham số trước khi call api
 */
function handleParam() {
  const params = new URLSearchParams();
  if (typeof pagingParam.value.SkipCount != "undefined") {
    params.append("SkipCount", pagingParam.value.SkipCount.toString());
  }
  if (typeof pagingParam.value.MaxResultCount != "undefined") {
    params.append(
      "MaxResultCount",
      pagingParam.value.MaxResultCount.toString()
    );
  }
  // if (typeof filterParam.value.Status != "undefined") {
  //   params.append("Status", filterParam.value.Status.toString());
  // }
  return params;
}
/**
 * Lấy danh sách Agency
 */
async function getPaging() {
  loadingGrid.value = true;
  const params = handleParam();
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("GetOrder");
  const configs = {
    headers: {
      captcha: token,
    },
    params: params,
  };
  const res = await OrdersService.getPaging(configs);
  if (res && res.data) {
    const data = res.data;
    total.value = data.totalCount;
    const items = data.items;
    items.forEach((item: any, index: number) => {
      item.Index = index + 1;

      if (item.service) {
        // Ứng dụng
        item.ApplicationDisplay =
          listApplication.find((i: any) => i.ID == item.service.application)
            ?.Name || "";

        // Loại service
        item.ServiceTypeDisplay =
          listServiceType.find((i: any) => i.ID == item.service.serviceType)
            ?.Name || "";
      }

      // Tốc độ
      if (item.speed) {
        item.SpeedDisplay =
          listSpeed.find((i: any) => i.ID == item.speed.type)?.Name || "";
      }

      // Bảo hành
      if (item.warranty) {
        const warranty = item.warranty;
        item.WarrantyDisplay =
          warranty.time +
            " " +
            listTimeUnit.find((i: any) => i.ID == warranty.timeUnit)?.Name ||
          "";
      }

      // Trạng thái
      item.StatusDisplay = t(
        listStatus.find((i: any) => i.ID == item.status)?.ResourceKey
      );
    });

    dataSource.value = data.items;
    setTimeout(() => {
      loadingGrid.value = false;
    }, 50);
  }
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
 * Thực hiện xác nhận giao dịch
 */
// async function approveOrder(data: any) {
//   data.loading = true;
//   try {
//     const res = await OrdersService.approveOrder(data.id);
//     if (res && res.data) {
//       toast.showToastSuccess("Approve Order Success!");
//       getPaging();
//     } else {
//       toast.showToastError("Approve Order Error");
//     }
//     data.loading = false;
//   } catch (error: any) {
//     toast.showToastError(error?.message);
//     data.loading = false;
//   }
// }

/**
 * Sự kiện chọn trạng thái
 */
function onChangedStatus(event: any) {
  filterParam.value.Status = event;
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
.promotion-container {
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

.content-add-warranty {
  background: #ffffff;
  padding: 24px;
  border-radius: 8px;
  &.warranty-detail {
    border: 1px solid #e0e0e0;
    background-color: whitesmoke;
  }
  .footer-confirm {
    justify-content: center;
    margin-top: 24px;
    width: 100%;
  }
}
</style>
