<template>
  <!-- Danh sách -->
  <div v-if="!isDetail" class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="title">{{ $t("Transaction") }}</div>
    </div>

    <div class="grid-promotion">
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
        <template v-slot:status="{ data }">
          <div
            class="d-flex align-items-center justify-content-center w-100 h-100"
          >
            <div v-if="data.data.status == 0" class="tag pending">
              {{ $t("Pending") }}
            </div>
            <div v-else class="tag completed">{{ $t("Completed") }}</div>
          </div>
        </template>

        <template v-slot:action="{ data }">
          <div class="d-flex align-items-center justify-content-center">
            <BaseButton
              :text="$t('Detail')"
              :loading="data.data.isLoading"
              @onClick="viewDetail(data.data)"
            />
          </div>
        </template>
      </BaseGrid>
    </div>
  </div>

  <!-- Chi tiết transaction -->
  <div v-else class="container transaction-detail-container">
    <div class="d-flex">
      <BaseButton
        icon="arrowleft"
        styling-mode="outlined"
        class="mr-3"
        @click="isDetail = false"
      />
      <div class="title mb-3">{{ $t("TransactionDetail") }}</div>
    </div>
    <div class="card" @click="increment">
      <div class="card-body">
        <div class="container-fluid">
          <!-- Code -->
          <div class="mb-3 row w-100">
            <div class="w-25">
              <span>{{ $t("TransactionV2.Code") }}</span>
            </div>
            <div class="flex1 profile-input">
              <div class="mb-1 text-16 text-bold">{{ transaction.code }}</div>
              <div class="text-12 text-muted">
                {{ $t("TransactionV2.CodeNote") }}
              </div>
            </div>
          </div>

          <!-- Price -->
          <div class="mb-3 row w-100">
            <div class="w-25">
              <span>{{ $t("TransactionV2.Amount") }}</span>
            </div>
            <div class="flex1 profile-input">
              <div>{{ $filters.currency(transaction.amount) }}</div>
            </div>
          </div>

          <!-- Created date -->
          <div class="mb-3 row w-100">
            <div class="w-25">
              <span>{{ $t("TransactionV2.CreatedDate") }}</span>
            </div>
            <div class="flex1 profile-input">
              <div>{{ transaction.creationTimeDisplay }}</div>
            </div>
          </div>

          <!-- Status -->
          <div class="mb-3 row w-100">
            <div class="w-25">
              <span>{{ $t("TransactionV2.Status") }}</span>
            </div>
            <div class="flex1 profile-input">
              <div v-if="transaction.status == 0" class="tag pending">
                {{ $t("Pending") }}
              </div>
              <div v-else class="tag completed">{{ $t("Completed") }}</div>
            </div>
          </div>

          <!-- Payment guide -->
          <div class="mb-3 row w-100">
            <div class="w-25">
              <span>{{ $t("TransactionV2.PaymentGuide") }}</span>
            </div>
            <div class="flex1 profile-input">
              <div class="mb-1">
                {{ $t("TransactionV2.TransferNote") }}
              </div>
              <div class="mb-1">
                {{ $t("TransactionV2.BankName") }}:
                <span class="text-bold">{{
                  transaction.paymentMethodDetail.detailId
                }}</span>
              </div>
              <div class="mb-1">
                {{ $t("TransactionV2.AccountNumber") }}:
                <span class="text-bold">{{
                  transaction.paymentMethodDetail.accountNumber
                }}</span>
              </div>
              <div class="mb-1">
                {{ $t("TransactionV2.AccountName") }}:
                <span class="text-bold">{{
                  transaction.paymentMethodDetail.accountName
                }}</span>
              </div>
              <div class="mb-1">
                {{ $t("TransactionV2.Amount") }}:
                <span class="text-bold">{{
                  $filters.currency(transaction.amount)
                }}</span>
              </div>
              <div class="mb-1">
                {{ $t("TransactionV2.TransferContent") }}:
                <span class="text-bold">{{ transaction.code }}</span>
              </div>
            </div>
          </div>

          <!-- Note -->
          <div class="row w-100">
            <div class="w-25"></div>
            <div class="flex1 profile-input">
              <span class="text-bold">{{
                $t("TransactionV2.Note")
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseGrid from "@/base/components/BaseGrid.vue";
import BaseButton from "@/base/components/BaseButton.vue";
import BaseInput from "@/base/components/BaseInput.vue";
import BaseNumberBox2 from "@/base/components/BaseNumberBox2.vue";
import BaseSelectBox from "@/base/components/BaseSelectBox.vue";
import { computed, onMounted, ref } from "vue";
import { BaseToast } from "@/base/toast/toast";
import { ColumnDataGrid } from "@/base/shared/models/grid/ColumnDataGrid";
import { formatDateTime } from "@/base/functions/formatDate";
import TransactionService from "@/apis/transaction-service";
import { useReCaptcha } from "vue-recaptcha-v3";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const recaptcha = useReCaptcha();

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

// Danh sách cột
const columns = ref(new Array<ColumnDataGrid>());

// Bảng dữ liệu
let dataSource = ref([]);

// loading grid
let loadingGrid = ref(false);

// Check có phải màn hình chi tiết
const isDetail = ref(false);

const transaction = ref({
  paymentMethodId: "",
  promotionId: "",
  code: "",
  user: {
    userName: null,
    name: "",
    surName: "",
    phoneNumber: "",
    email: "",
    id: "",
  },
  amount: 0,
  bonus: 0,
  fee: 0,
  status: 0,
  creationTime: "",
  id: "",
  creationTimeDisplay: "",
  paymentMethodDetail: {
    detailId: "VCB",
    accountName: "TRUONG THANH NAM",
    accountNumber: "0011000412973",
  },
  isLoading: false,
});

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
    new ColumnDataGrid(t("TransactionV2.Code"), "code", "15%"),
    new ColumnDataGrid(
      t("TransactionV2.Amount"),
      "amount",
      "15%",
      "",
      "right",
      false,
      "",
      "",
      "number",
      "#,##0.## đ"
    ),
    new ColumnDataGrid(
      t("TransactionV2.Bonus"),
      "bonus",
      "15%",
      "",
      "right",
      false,
      "",
      "",
      "number",
      "#,##0.## đ"
    ),
    new ColumnDataGrid(
      t("TransactionV2.Status"),
      "status",
      "15%",
      "custom",
      "center",
      false,
      "right"
    ),
    new ColumnDataGrid(
      t("TransactionV2.CreatedDate"),
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
      t("TransactionV2.Action"),
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
 * Lấy danh sách Agency
 */
async function getPaging() {
  loadingGrid.value = true;
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("GetTransaction");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await TransactionService.getPaging(pagingParam.value, config);
  if (res && res.data) {
    const data = res.data;
    total.value = data.totalCount;
    const items = data.items;
    items.forEach((item: any, index: number) => {
      item.Index = index + 1;
      item.creator =
        (item.user.name ? item.user.name + " - " : "") + item.user.phoneNumber;
    });

    dataSource.value = data.items;
  }
  loadingGrid.value = false;
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
 * Xem chi tiết giao dịch
 */
async function viewDetail(data: any) {
  if (!data) {
    return;
  }
  transaction.value = data;
  transaction.value.creationTimeDisplay = formatDateTime(
    new Date(transaction.value.creationTime)
  );
  transaction.value.isLoading = true;
  transaction.value.paymentMethodDetail = data.paymentMethod.details;

  isDetail.value = true;
  transaction.value.isLoading = false;
}
</script>

<style lang="scss" scoped>
.tag {
  padding: 4px;
  font-size: 12px;
  line-height: 16px;
  border-radius: 4px;
  color: #fff;
  width: fit-content;
  &.pending {
    background-color: #f0ad4e;
  }
  &.completed {
    background-color: #5cb85c;
  }
}

.transaction-detail-container {
  .card {
    position: relative;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid #edf2f9;
    border-radius: 0.25rem;
    margin-bottom: 1.5rem;
    -webkit-filter: drop-shadow(0 0 30px hsla(0, 0%, 70.6%, 0.2));
    filter: drop-shadow(0 0 30px rgba(180, 180, 180, 0.2));
    .card-body {
      -webkit-flex: 1 1 auto;
      flex: 1 1 auto;
      min-height: 1px;
      padding: 24px;
      .badge {
        display: inline-block;
        padding: 5px 10px;
        font-size: 75%;
        font-weight: 700;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 0.25rem;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
          border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        &.badge-warning {
          background-color: #ffc107;
          color: #ffffff;
          padding: 5px 10px;
        }
        &.badge-active {
          background-color: rgb(76, 217, 100);
          color: #ffffff;
          padding: 5px 10px;
        }
      }
      .row {
        align-items: normal;
        .w-25 {
          width: 25%;
          min-width: 150px;
        }
        .profile-input {
          min-width: 200px;
        }
      }
    }
  }
}
</style>
