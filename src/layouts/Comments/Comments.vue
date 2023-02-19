<template>
  <!-- Danh sách -->
  <div v-if="!isDetail" class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="title">{{ $t("ListComment") }}</div>
      <BaseButton
        icon="add"
        :text="$t('AddComment')"
        :loading="loadingButton"
        @onClick="onClickAddComment"
      />
    </div>

    <div class="grid-comment">
      <BaseGrid
        :loading="loadingGrid"
        :dataSource="dataSource"
        :columns="columns"
        :total="total"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        width="100%"
        height="calc(100vh - 212px)"
        @changePageSize="changePageSize"
        @changePageIndex="changePageIndex"
      >
        <template v-slot:content="{ data }">
          <div class="d-flex align-items-center">
            <pre>{{ data.value }}</pre>
          </div>
        </template>
        <template v-slot:action="{ data }">
          <div class="d-flex align-items-center">
            <div class="mr-2">
              <BaseButton
                :text="$t('Detail')"
                @onClick="viewDetail(data.data)"
              />
            </div>
            <div>
              <BaseButton
                :text="$t('Delete')"
                type="danger"
                styling-mode="contained"
                class="mr-2"
                @onClick="onClickDelete(data.data)"
              />
            </div>
          </div>
        </template>
      </BaseGrid>
    </div>
  </div>

  <!-- Chi tiết -->
  <div v-if="isDetail" class="container comment-container">
    <div class="title mb-4">{{ $t("CommentDetail") }}</div>
    <div class="card">
      <!-- Name -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("CommentName") }}</span>
        </div>
        <div class="flex1 profile-input">
          <BaseInput
            placeholder="Enter comment name"
            :value="comment.name"
            @onContentReady="onContentReady"
            @onValueChanged="onValueChanged($event, 'name')"
          />
        </div>
      </div>

      <!-- Content -->
      <div class="mb-3 row w-100">
        <div class="w-30">
          <span>{{ $t("Content") }}</span>
        </div>
        <div class="flex1 profile-input">
          <BaseTextArea
            placeholder="Enter comment list"
            height="400px"
            :value="comment.content"
            @onValueChanged="onValueChanged($event, 'content')"
          />
        </div>
      </div>

      <!-- Note -->
      <div class="mb-3 row w-100">
        <div class="w-30"></div>
        <div class="flex1 profile-input">
          <h2>{{ $t("Note") }}</h2>
          <div v-html="$t('CommentNote')"></div>
        </div>
      </div>

      <!-- Cập nhật thông tin -->
      <div class="row justify-content-end mt-3">
        <!-- Hủy bỏ -->
        <BaseButton
          class="mr-2"
          :text="$t('Cancel')"
          type="normal"
          styling-mode="outlined"
          @click="cancel($event)"
        />
        <!-- Cập nhật -->
        <BaseButton
          v-if="isUpdate"
          class="mr-2"
          :text="$t('Update')"
          type="default"
          styling-mode="contained"
          :loading="loadingButton"
          @click="update($event)"
        />
        <!-- Thêm mới -->
        <BaseButton
          v-if="!isUpdate"
          icon="add"
          :text="$t('AddComment')"
          type="default"
          styling-mode="contained"
          :loading="loadingButton"
          @click="create($event)"
        />
      </div>
    </div>
  </div>

  <!-- Popup confirm delete -->
  <BasePopupDelete
    :isVisible="isVisiblePopupDelete"
    :loading="isLoadingDelete"
    @closePopup="closePopupDelete"
    @onDelete="onDelete"
  >
  </BasePopupDelete>
</template>

<script setup lang="ts">
import BaseGrid from "@/base/components/BaseGrid.vue";
import BaseButton from "@/base/components/BaseButton.vue";
import BaseInput from "@/base/components/BaseInput.vue";
import BasePopup from "@/base/components/BasePopup.vue";
import BasePopupDelete from "@/base/components/BasePopupDelete.vue";
import BaseTextArea from "@/base/components/BaseTextArea.vue";
import { computed, onMounted, ref } from "vue";
import { BaseToast } from "@/base/toast/toast";
import { ColumnDataGrid } from "@/base/shared/models/grid/ColumnDataGrid";
import commentService from "@/apis/comments-service";
import { Comment } from "@/commons/models/comment";
import { cloneData } from "@/base/functions/commonFns";
import { ListStatus } from "@/commons/constants/list-status";
import { useI18n } from "vue-i18n";
import { useReCaptcha } from "vue-recaptcha-v3";

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

// Đối tượng comment
const comment = ref<Comment>(new Comment());

// Popup confirm delete
const isVisiblePopupDelete = ref(false);

// Loading xóa
const isLoadingDelete = ref(false);

// Danh sách trạng thái
const listStatus = cloneData(ListStatus);

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
    new ColumnDataGrid(t("Comment.Name"), "name", "20%"),
    new ColumnDataGrid(t("Comment.Content"), "content", "30%", "custom"),
    new ColumnDataGrid(t("Comment.Status"), "StatusDisplay", "20%"),
    new ColumnDataGrid(
      t("Comment.CreatedDate"),
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
      t("Comment.Action"),
      "action",
      "200px",
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
async function handleConfig() {
  const params = new URLSearchParams();
  params.append("SkipCount", pagingParam.value.SkipCount.toString());
  params.append("MaxResultCount", pagingParam.value.MaxResultCount.toString());
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("GetComment");
  return {
    headers: {
      captcha: token,
    },
    params: params,
  };
}

/**
 * Lấy danh sách Comment
 */
async function getPaging() {
  loadingGrid.value = true;
  try {
    const configAPI = await handleConfig();
    const res = await commentService.getPaging(configAPI);
    if (res && res.data) {
      const data = res.data;
      total.value = data.totalCount;
      const items = data.items;
      items.forEach((item: any, index: number) => {
        item.Index = index + 1;
        item.StatusDisplay = t(
          listStatus.find((i: any) => i.ID == item.status)?.ResourceKey
        );
      });

      dataSource.value = data.items;
    }
  } catch (error: any) {
    toast.showToastError(error?.message);
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
 * Click thêm comment
 */
function onClickAddComment() {
  comment.value = new Comment();
  isDetail.value = true;
}

/**
 * Xử lý trước khi call api
 */
function handleValidate() {
  const listComment = comment.value.content.split("\n");
  if (listComment?.length < 20) {
    toast.showToastWarning(t("CommentWarning"));
    return false;
  }
  return true;
}

/**
 * Thực hiện thêm comment
 */
async function create() {
  const isValid = handleValidate();
  if (!isValid) {
    return;
  }

  loadingButton.value = true;
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("AddComment");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await commentService.create(comment.value, config);
  if (res && (res.data || res.id)) {
    toast.showToastSuccess(t("AddCommentSuccess"));
    cancel();
    getPaging();
  } else {
    toast.showToastError(t("AddCommentFail"));
  }
  loadingButton.value = false;
}

/**
 * Thực hiện thêm comment
 */
async function update() {
  const isValid = handleValidate();
  if (!isValid) {
    return;
  }
  loadingButton.value = true;

  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("UpdateComment");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await commentService.update(
    comment.value.id,
    comment.value,
    config
  );
  if (res && (res.data || res.id)) {
    toast.showToastSuccess(t("UpdateCommentSuccess"));
    cancel();
    getPaging();
  } else {
    toast.showToastError(t("UpdateCommentFail"));
  }
  loadingButton.value = false;
}

/**
 * Hủy bỏ
 */
function cancel() {
  isDetail.value = false;
  isUpdate.value = false;
}

/**
 * Sự kiện nhập thông tin
 */
function onValueChanged(event: any, fieldName: string) {
  if (!event || !fieldName) {
    return;
  }
  (comment.value as any)[fieldName] = event;
}

/**
 * Focus vào commentname
 */
function onContentReady(event: any) {
  setTimeout(() => {
    event.component.focus();
  }, 0);
}

/**
 * Xem chi tiết
 */
function viewDetail(data: any) {
  comment.value = data;
  isDetail.value = true;
  isUpdate.value = true;
}

/**
 * Sự kiện click xóa
 */
function onClickDelete(data: any) {
  if (!data) {
    return;
  }
  comment.value = data;
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
 * Call API xóa
 */
async function onDelete() {
  isLoadingDelete.value = true;
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("DeleteComment");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await commentService.delete(comment.value.id, config);
  if (res && res.data) {
    toast.showToastSuccess("Delete User Success!");
    getPaging();
  } else {
    toast.showToastError("Delete User Error!");
  }
  closePopupDelete();
}
</script>

<style lang="scss" scoped>
.comment-container {
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
