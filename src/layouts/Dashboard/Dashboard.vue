<template>
  <div class="container dashboard-container">
    <!-- Nạp tiền -->
    <div>
      <div class="title text-uppercase mt-0">
        {{ $t("Dashboard.Topup") }} {{$config.API_URL}}
      </div>

      <!-- Loading nạp tiền -->
      <div v-if="loadingListTopup">
        <div
          v-for="item in [1, 2, 3, 4, 5, 6]"
          :key="item"
          class="topup-card-container"
        >
          <div class="corner-ribbon-container top-right">
            <div class="corner-ribbon top-right skeleton"></div>
          </div>
          <div class="block-center-between">
            <div
              class="topup-icon skeleton"
              style="width: 87px; height: 92px"
            ></div>
            <div
              class="price-container skeleton"
              style="width: 148px; height: 51px"
            >
              <div class="price-label"></div>
              <div class="price-number"></div>
            </div>
          </div>
          <div class="w-100 mt-4 skeleton" style="height: 40px"></div>
        </div>
      </div>

      <!-- Danh sách nạp tiền -->
      <div
        v-else
        v-for="item in listTopup"
        :key="item.id"
        class="topup-card-container"
      >
        <div class="corner-ribbon-container top-right">
          <div class="corner-ribbon top-right blue">
            <span v-if="item.value.kind == 1" class="text"
              >+{{ item.valueDisplay }}%</span
            >
            <span v-else class="text"
              >+{{ $filters.currency(item.value.value) }}</span
            >
          </div>
        </div>
        <div class="block-center-between">
          <div class="topup-icon">
            <span class="icon icon-topup"></span>
          </div>
          <div class="price-container">
            <div class="price-label">{{ $t("Dashboard.Topup") }}</div>
            <div class="price-number">{{ $filters.number(item.end) }} VNĐ</div>
          </div>
        </div>
        <BaseButton
          width="100%"
          height="40px"
          type="default"
          styling-mode="outlined"
          class="mt-4"
          :text="$t('Dashboard.TopupNow')"
          :loading="item.loadingTopup"
          @click="onClickTopupNow(item)"
        />
      </div>

      <!-- Không có dữ liệu nạp tiền -->
      <div v-if="!loadingListTopup && listTopup.length == 0" class="mt-3">
        {{ $t("Common.NoDataText") }}
      </div>
    </div>

    <!-- Gói dịch vụ -->
    <div>
      <div class="title text-uppercase mt-5">
        {{ $t("Dashboard.PurchaseServices") }}
      </div>

      <!-- Danh sách app -->
      <div class="apps mt-2 pb-3">
        <div
          v-for="app in listApplication"
          :key="app.ID"
          class="app"
          :class="{ appActive: app.ID == activeApplication.ID }"
          @click="chooseApp(app)"
        >
          {{ app.Name }}
        </div>
      </div>

      <!-- Loading Danh sách gói dịch vụ -->
      <div v-if="loadingListServicePackage" class="d-flex flex-wrap">
        <div
          v-for="item in [1, 2, 3, 4]"
          :key="item"
          class="service-card-container d-flex flex-column justify-content-between mt-4 mr-4"
        >
          <div>
            <div class="d-flex justify-content-between">
              <div class="skeleton" style="width: 150px; height: 70px"></div>
              <div
                class="icon-service d-flex align-items-center justify-content-center skeleton"
              ></div>
            </div>

            <div class="mt-3">
              <div
                class="w-100 skeleton"
                style="height: 55px; border-radius: 4px"
              ></div>

              <div
                class="mt-3 w-100 skeleton"
                style="height: 36px; border-radius: 4px"
              ></div>
            </div>

            <div
              class="mt-3 w-100 skeleton"
              style="height: 120px; border-radius: 4px"
            ></div>

            <div
              class="mt-3 w-100 skeleton"
              style="height: 120px; border-radius: 4px"
            ></div>
          </div>

          <div>
            <div
              class="mt-3 w-100 skeleton"
              style="height: 55px; border-radius: 4px"
            ></div>
            <div class="btn-buy mb-2">
              <div
                class="mt-3 w-100 skeleton"
                style="height: 40px; border-radius: 4px"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Danh sách gói dịch vụ -->
      <div v-else class="d-flex flex-wrap">
        <div
          v-for="item in listServicePackage"
          :key="item.id"
          class="service-card-container d-flex flex-column justify-content-between mt-4 mr-4"
        >
          <div>
            <div class="d-flex justify-content-between">
              <div>
                <div class="service-name">{{ item.nameDisplay }}</div>
                <div class="price">
                  {{ $t("Dashboard.Only") }}
                  {{ $filters.currency(item.speed.price) }}/{{
                    $t("Dashboard.Turn")
                  }}
                </div>
                <div class="max-price">
                  Max {{ $filters.number(item.maxQuantity) }}
                  {{ $t("Dashboard.Turn") }},&nbsp;Min
                  {{ $filters.number(item.minQuantity) }}
                  {{ $t("Dashboard.Turn") }}
                </div>
              </div>
              <div
                class="icon-service d-flex align-items-center justify-content-center"
              >
                <div class="icon" :class="item.icon"></div>
              </div>
            </div>

            <div
              v-if="item.serviceType == ServiceTypeEnum.BuffReaction"
              class="mt-3"
            >
              <div class="reaction-icon d-flex justify-content-between">
                <div
                  v-for="reaction in item.reactions"
                  :key="reaction.ReactionIcon"
                  class="icon-buff pointer d-flex align-items-center justify-content-center"
                  :class="[
                    reaction.ReactionName,
                    reaction.Active ? 'active' : '',
                  ]"
                  @click="onClickReaction(item, reaction)"
                >
                  <span class="icon" :class="reaction.ReactionIcon"></span>
                </div>
              </div>
            </div>

            <div class="mt-3">
              <BaseInput
                :placeholder="$t('Dashboard.EnterID')"
                :value="item.urlService"
                @onValueChanged="
                  onChangedServicePackage($event, 'urlService', item)
                "
              />
              <div class="mt-1">
                {{ $t("Dashboard.GetUID") }}
                <a
                  href="https://sites.google.com/view/layid/trang-ch%E1%BB%A7"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="color: rgb(0, 123, 255)"
                  >{{ $t("Dashboard.Here") }}</a
                >
              </div>

              <div class="mt-3">
                <BaseNumberBox2
                  :placeholder="$t('Dashboard.EnterTurnNumber')"
                  :value="item.quantity"
                  :min="item.minQuantity"
                  :max="item.maxQuantity"
                  @onValueChanged="
                    onChangedServicePackage($event, 'quantity', item)
                  "
                />
              </div>
            </div>

            <!-- Comment -->
            <div
              v-if="item.serviceType == ServiceTypeEnum.BuffComment"
              class="mt-3"
            >
              <BaseSelectBox
                :placeholder="$t('Dashboard.EnterComment')"
                :items="listComment"
                :value="item.commentID"
                keyID="id"
                display="name"
                @onValueChanged="onChangedComment($event, item)"
              />
            </div>

            <div class="mt-3" v-if="item.speeds">
              <span>{{ $t("Dashboard.ChooseSpeed") }}</span>
              <div class="ml-2">
                <BaseRadioGroup
                  keyID="type"
                  display="speedDisplay"
                  :items="item.speeds"
                  :value="item.speed.type"
                  @onValueChanged="onChangedSpeed($event, item)"
                />
              </div>
            </div>

            <div class="mt-3" v-if="item.warranties.length > 0">
              <span>{{ $t("Dashboard.ChooseWarranty") }}</span>
              <div class="ml-2">
                <BaseRadioGroup
                  keyID="index"
                  display="warrantyDisplay"
                  :items="item.warranties"
                  :value="item.warranty.index"
                  @onValueChanged="onChangedWarranty($event, item)"
                />
              </div>
            </div>
          </div>

          <div>
            <div class="mt-3">
              <span>{{ $t("Dashboard.TotalPrice") }} </span><br />
              <div class="total-price-detail">
                <div v-if="item.warranty && item.warranty.price > 0">
                  <span
                    >{{ $filters.number(item.quantity) }} x ({{
                      $filters.currency(item.speed.price)
                    }}
                    + {{ $filters.currency(item.warranty.price) }}) =
                  </span>
                  <span>{{
                    $filters.currency(
                      item.quantity * (item.speed.price + item.warranty.price)
                    )
                  }}</span>
                </div>
                <div v-else>
                  <span
                    >{{ $filters.number(item.quantity) }} x
                    {{ $filters.currency(item.speed.price) }} =
                  </span>
                  <span>{{
                    $filters.currency(item.quantity * item.speed.price)
                  }}</span>
                </div>
              </div>
            </div>
            <div class="btn-buy mb-2">
              <BaseButton
                width="100%"
                height="40px"
                type="default"
                styling-mode="outlined"
                class="mt-3"
                :text="$t('Dashboard.BuyNow')"
                :loading="item.loadingBuyNow"
                @click="onClickBuyNow(item)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Không có dữ liệu nạp tiền -->
      <div v-if="!loadingListServicePackage && listServicePackage.length == 0" class="mt-3">
        {{ $t("Common.NoDataText") }}
      </div>
    </div>

    <!-- Popup chọn phương thức thanh toán -->
    <BasePopup
      :v-if="isVisiblePopup"
      :isVisible="isVisiblePopup"
      :title="$t('Payment')"
      @closePopup="onHidden"
    >
      <template v-slot:content>
        <!-- QR Code -->
        <div>
          <img :src="vietQR" />
          <div>
            <div>
              <span>{{ $t("BankName") }}</span
              >:
              <span class="text-bold">{{ paymentMethodActive.BankName }}</span>
            </div>
            <div>
              <span>{{ $t("AccountName") }}</span
              >:
              <span class="text-bold">{{
                paymentMethodActive.AccountName
              }}</span>
            </div>
            <div>
              <span>{{ $t("AccountNumber") }}</span
              >:
              <span class="text-bold">{{
                paymentMethodActive.AccountNumber
              }}</span>
            </div>
            <div>
              <span>{{ $t("AmountMoney") }}</span
              >:
              <span class="text-bold">{{
                $filters.number(paymentMethod.amount)
              }}</span>
              VNĐ
            </div>
          </div>
        </div>
        <!-- 
        <div>
          <div
            v-for="item in listPaymentMethod"
            :key="item.id"
            class="payment-method-item d-flex justify-content-between align-items-center"
            :class="{ active: item.id == paymentMethod.paymentMethodId }"
            @click="activePaymentMethod(item)"
          >
            <div>
              <div>
                <span>{{ $t("BankName") }}</span
                >: <span>{{ item.details.detailId }}</span>
              </div>
              <div>
                <span>{{ $t("AccountName") }}</span
                >: <span>{{ item.details.accountName }}</span>
              </div>
              <div>
                <span>{{ $t("AccountNumber") }}</span
                >: <span>{{ item.details.accountNumber }}</span>
              </div>
            </div>
            <div v-if="item.id == paymentMethod.paymentMethodId">
              <span class="icon icon-check"></span>
            </div>
          </div>
        </div> -->
      </template>
      <template v-slot:footer>
        <BaseButton
          class="mr-2"
          :text="$t('Cancel')"
          type="normal"
          styling-mode="outlined"
          @click="isVisiblePopup = false"
        />
        <BaseButton
          :text="$t('ConfirmPayment')"
          type="default"
          styling-mode="contained"
          :loading="isLoadingDeposit"
          :disabled="listPaymentMethod.length == 0"
          @click="onSaveDeposit()"
        />
      </template>
    </BasePopup>

    <!-- Popup comment -->
    <BasePopup
      :v-if="isVisiblePopupComment"
      :isVisible="isVisiblePopupComment"
      :title="$t('AddComment')"
      customClass="popup-comment"
      width="500px"
      @closePopup="onHiddenComment"
    >
      <template v-slot:content>
        <div>
          <BaseTextArea
            placeholder="Enter comment list"
            :value="servicePackage.comment"
            @onValueChanged="onChangedTextArea($event)"
            @onContentReady="onReadyComment"
          />
        </div>
        <div class="modal-add-comment mt-2">
          <h2>Ghi chú</h2>
          <div>1. Cứ mỗi dòng tính là 1 comment</div>
          <div>2. Yêu cầu tối thiếu 5 comment</div>
          <div>3. Mọi nội dung không phù hợp đều bị từ chối</div>
          <div>4. Hệ thống chỉ xét duyệt từ 8h sáng đến 12h đêm hằng ngày</div>
        </div>
      </template>
      <template v-slot:footer>
        <BaseButton
          type="default"
          styling-mode="contained"
          :text="$t('Save')"
          :disabled="servicePackage.targets.length < 5"
          @click="onSaveComment"
        />
      </template>
    </BasePopup>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/base/components/BaseButton.vue";
import BaseInput from "@/base/components/BaseInput.vue";
import BaseNumberBox2 from "@/base/components/BaseNumberBox2.vue";
import BaseSelectBox from "@/base/components/BaseSelectBox.vue";
import BaseRadioGroup from "@/base/components/BaseRadioGroup.vue";
import BasePopup from "@/base/components/BasePopup.vue";
import BaseTextArea from "@/base/components/BaseTextArea.vue";
import { computed, onMounted, ref } from "vue";
import router from "@/router";
import PromotionService from "@/apis/promotion-service";
import PaymentService from "@/apis/payment-service";
import ServicePackageSV from "@/apis/service-package-service";
import OrderService from "@/apis/order-service";
import { BaseToast } from "@/base/toast/toast";
import CommentService from "@/apis/comments-service";
import type { Comment } from "@/commons/models/comment";
import { Banks } from "@/commons/constants/list-bank-v2";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { cloneData } from "@/base/functions/commonFns";
import { ListApplication } from "@/commons/constants/list-application";
import { ServiceTypeEnum } from "@/commons/enums/service-type-enum";
import { useReCaptcha } from "vue-recaptcha-v3";
import { ListServiceType } from "@/commons/constants/service-package";
import useEventsBus from "@/composables/eventBus";
import { EventEmitter } from "@/commons/constants/event-emitter";
import { ErrorCode } from "@/commons/enums/error-code-enum";

const { emit } = useEventsBus();

const recaptcha = useReCaptcha();

const { t } = useI18n();

const toast = new BaseToast();

const store = useStore();
const userInfo = computed(() => {
  return store.state.userInfo;
});

// Danh sách gói nạp tiền
const listTopup = ref([]);

// Danh sách gói dịch vụ
const listServicePackage = ref([]);

// Danh sách ứng dụng
const listApplication = ref(cloneData(ListApplication));

const listNation = ref([
  {
    ID: 0,
    Name: "Random",
  },
]);

const activeApplication = ref(listApplication.value[0]);

// Danh sách speed mặc định
const listSpeedDefault = [
  { type: 0, typeName: "Low", resourceKey: "Speed.Low" },
  { type: 1, typeName: "Medium", resourceKey: "Speed.Medium" },
  { type: 2, typeName: "Normal", resourceKey: "Speed.Normal" },
  { type: 3, typeName: "High", resourceKey: "Speed.High" },
];

// Danh sách đơn vị thời gian
const listTimeUnitDefault = [
  {
    timeUnit: 0,
    timeUnitName: "Day",
    resoureKey: "TimeUnit.Day",
  },
  {
    timeUnit: 1,
    timeUnitName: "Week",
    resoureKey: "TimeUnit.Week",
  },
  {
    timeUnit: 2,
    timeUnitName: "Month",
    resoureKey: "TimeUnit.Month",
  },
  {
    timeUnit: 3,
    timeUnitName: "Year",
    resoureKey: "TimeUnit.Year",
  },
];

// Popup chọn hình thức thanh toán
const isVisiblePopup = ref(false);

// Danh sách phương thức thanh toán
const listPaymentMethod = ref([]);

// Icon Reactions
const listReaction = [
  {
    ReactionName: "like",
    ReactionIcon: "icon-like",
    Active: false,
  },
  {
    ReactionName: "love",
    ReactionIcon: "icon-love",
    Active: false,
  },
  {
    ReactionName: "care",
    ReactionIcon: "icon-care",
    Active: false,
  },
  {
    ReactionName: "haha",
    ReactionIcon: "icon-haha",
    Active: false,
  },
  {
    ReactionName: "wow",
    ReactionIcon: "icon-wow",
    Active: false,
  },
  {
    ReactionName: "sad",
    ReactionIcon: "icon-sad",
    Active: false,
  },
  {
    ReactionName: "angry",
    ReactionIcon: "icon-angry",
    Active: false,
  },
];

// Tham số lưu Deposit
const paymentMethod = ref({
  paymentMethodId: "",
  amount: 0,
});

// Loading khi thanh toán
const isLoadingDeposit = ref(false);

// Popup nhập comment
const isVisiblePopupComment = ref(false);

// Service package đang được chọn
const servicePackage = ref({
  urlService: "",
  warranty: {
    timeUnit: 0,
    time: 0,
    price: 0.0,
  },
  speed: {
    type: 0,
    price: 0,
  },
  serviceId: "",
  quantity: 0,
  targets: [],
  comment: "",
});

// Danh sách comment
const listComment = ref(new Array<Comment>());

// Link vietQR
const vietQR = ref("");

const paymentMethodActive = ref({
  BankName: "",
  AccountName: "",
  AccountNumber: "",
});

// Danh sách dịch vụ
const listServiceType = cloneData(ListServiceType);

// Loading
const loadingListTopup = ref(true);

const loadingListServicePackage = ref(true);

onMounted(() => {
  // Lấy danh sách tất cả gói
  getAllPromotion();

  // Lấy danh sách gói dịch vụ
  getAllServicePackage();
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
 * Lấy danh sách tất cả gói
 */
async function getAllPromotion() {
  loadingListTopup.value = true;
  const token = await getTokenRecaptcha("GetAllPromotion");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await PromotionService.getAllPromotion(config);
  loadingListTopup.value = false;
  if (res?.data) {
    listTopup.value = res.data;
    if (listTopup.value.length) {
      listTopup.value.forEach((item: any) => {
        if (item.value && item.value.kind == 1)
          item.valueDisplay = item.value.value * 100;
      });
    }
  }
}

/**
 * Lấy danh sách tất cả gói
 */
async function getAllServicePackage() {
  loadingListServicePackage.value = true;
  listServicePackage.value = [];

  let isComment = false;
  const token = await getTokenRecaptcha("GetAllServicePackage");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await ServicePackageSV.getServiceByApp(
    activeApplication.value.ID,
    config
  );

  loadingListServicePackage.value = false;

  if (res?.data) {
    const listPackage = res.data;
    if (listPackage?.length <= 0) {
      return;
    }
    listPackage.forEach((item: any) => {
      // Xử lý tên gói dịch vụ
      item.nameDisplay = t("Dashboard.ServicePackageName", { name: item.name });

      // Mặc định số lượng turn là 100
      item.quantity = item.minQuantity;

      // Xử lý speeds
      const speeds = item.speeds;
      if (speeds?.length > 0) {
        item.speed = speeds[0];
        speeds.forEach((i: any) => {
          const speed = listSpeedDefault.find((e) => e.type == i.type);
          if (speed) {
            i.speedDisplay = t(speed.resourceKey);
          }
        });
      }

      // Xử lý warranties
      const warranties = item.warranties;
      if (warranties?.length > 0) {
        warranties.forEach((i: any, index: number) => {
          i.index = index;
          const warranty = listTimeUnitDefault.find(
            (e) => e.timeUnit == i.timeUnit
          );
          if (warranty) {
            i.warrantyDisplay =
              i.time + " " + t(warranty.resoureKey + (i.time > 1 ? "s" : ""));
          }
          i.timeValue =
            i.time +
            " " +
            listTimeUnitDefault.find((e) => e.timeUnit == i.timeUnit)
              ?.timeUnitName +
            (i.time > 1 ? "s" : "");
        });
        item.warranty = warranties[0];
      }

      // Xử lý Reaction
      if (item.serviceType == ServiceTypeEnum.BuffReaction) {
        item.reactions = JSON.parse(JSON.stringify(listReaction));
      }

      // Xử lý Comment
      if (item.serviceType == ServiceTypeEnum.BuffComment) {
        isComment = true;
      }

      // Xử lý Icon Service Type
      item.icon = listServiceType.find(
        (i: any) => i.ID == item.serviceType
      )?.Icon;
    });

    listServicePackage.value = listPackage;

    if (isComment) {
      getPaging();
    }
  }
}

/**
 * Click mua ngay
 */
async function onClickTopupNow(item: any) {
  item.loadingTopup = true;
  paymentMethod.value.amount = item.end;
  // Lấy danh sách hình thức thanh toán
  const token = await getTokenRecaptcha("GetPaymentMethod");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const response = await PaymentService.getAllPaymentMethod(config);
  if (response?.data) {
    listPaymentMethod.value = response?.data;
    if (listPaymentMethod.value?.length) {
      const paymentMethodTemp = listPaymentMethod.value[0];
      if (paymentMethodTemp) {
        const detail = (paymentMethodTemp as any)["details"];
        paymentMethodActive.value = {
          BankName: detail?.detailId,
          AccountName: detail?.accountName,
          AccountNumber: detail?.accountNumber,
        };
        handleVietQR();
        paymentMethod.value.paymentMethodId = paymentMethodTemp.id;
      }
    }
    setTimeout(() => {
      isVisiblePopup.value = true;
      item.loadingTopup = false;
    }, 600);
  } else {
    item.loadingTopup = false;
    toast.showToastError("No payment method yet!");
  }
}

/**
 * Xử lý dữ liệu để có link image VietQR
 */
function handleVietQR() {
  const vietQRTemp = import.meta.env.VITE_VIETQR_URL;
  const bin =
    Banks.find((item) => item.name == paymentMethodActive.value.BankName)
      ?.bin || "";
  vietQR.value = vietQRTemp.replace("<BANK_ID>", bin);
  vietQR.value = vietQR.value.replace(
    "<ACCOUNT_NO>",
    paymentMethodActive.value.AccountNumber
  );
  vietQR.value = vietQR.value.replace(
    "<TEMPLATE>",
    import.meta.env.VITE_VIETQR_TEMPLATE
  );
  vietQR.value = vietQR.value.replace(
    "<AMOUNT>",
    paymentMethod.value.amount.toString()
  );
  const fullname =
    (userInfo.value.surName || "") + " " + (userInfo.value.name || "");
  vietQR.value = vietQR.value.replace(
    "<DESCRIPTION>",
    fullname + " " + t("Payment")
  );
  vietQR.value = vietQR.value.replace(
    "<ACCOUNT_NAME>",
    paymentMethodActive.value.BankName
  );
}

/**
 * Click save => Tạo transaction
 */
async function onSaveDeposit(item: any) {
  isLoadingDeposit.value = true;
  const token = await getTokenRecaptcha("Payment");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await PaymentService.paymentDeposit(paymentMethod.value, config);
  if (res?.data) {
    toast.showToastSuccess(t("Dashboard.TopupSuccess"));
    router.push("/transaction");
  } else {
    if (res?.errorCode == ErrorCode.DepositTooFast) {
      toast.showToastWarning(t("Dashboard.DepositTooFast"));
    } else {
      toast.showToastError(t("Dashboard.TopupError"));
    }
  }

  isLoadingDeposit.value = false;
  isVisiblePopup.value = false;

  // const res = await transactionSV.createTransaction({ pack_id: id });
  // if (res?.message == "Success" && res?.data) {
  //   router.push({
  //     name: RouterName.TransactionDetail,
  //     params: { id: res?.data?.id },
  //   });
  // }
}

/**
 * Chọn app
 */
function chooseApp(data: any) {
  activeApplication.value = data;
  getAllServicePackage();
}

/**
 * Thay đổi giá trị trong gói dịch vụ
 */
function onChangedServicePackage(value: any, fieldName: string, item: any) {
  if (!item) {
    return;
  }
  item[fieldName] = value;
}

/**
 * Thay đổi giá trị speed
 */
function onChangedSpeed(value: any, item: any) {
  if (!item) {
    return;
  }
  const index = item.speeds.findIndex((i: any) => i.type == value);
  if (index >= 0) {
    item.speed = item.speeds[index];
  }
}

/**
 * Thay đổi giá trị warranty
 */
function onChangedWarranty(value: any, item: any) {
  if (!item) {
    return;
  }
  const index = item.warranties.findIndex((i: any) => i.index == value);
  if (index >= 0) {
    item.warranty = item.warranties[index];
  }
}

/**
 * Click mua ngay
 */
async function onClickBuyNow(data: any) {
  data.loadingBuyNow = true;

  const param = data;
  param.serviceId = data.id;
  param.urlService = data.urlService;

  const isValid = handleValidate(data);
  if (!isValid) {
    data.loadingBuyNow = false;
    return;
  }

  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("Order");
  const config = {
    headers: {
      captcha: token,
    },
  };
  const res = await OrderService.order(param, config);
  if (res?.data) {
    handleAfterOrder(res?.data);
    toast.showToastSuccess(t("Dashboard.OrderSuccess"));
  } else {
    toast.showToastError(t("Dashboard.OrderError"));
  }

  data.loadingBuyNow = false;
}

/**
 * Xử lý dữ liệu sau khi đặt hàng
 */
function handleAfterOrder(data: any) {
  // Gán lại giá trị Default
  const index = listServicePackage.value.findIndex(
    (item: any) => item.id == data?.service.id
  );
  if (index >= 0) {
    (listServicePackage.value[index] as any).urlService = "";
  }

  // Bắn data order thành công => Refresh balance
  emit(EventEmitter.RefreshProfile, true);
}

/**
 * Xử lý validate trước khi lưu
 */
function handleValidate(data: any) {
  // Kiểm tra có đủ tiền mua
  const amount =
    data.quantity * (data?.speed?.price || 0 + data?.warranty?.price || 0);
  if (userInfo?.value?.balance < amount) {
    toast.showToastWarning(t("ToastNotEnoughBalance"));
    return false;
  }

  if (!data.urlService || data.urlService == "") {
    toast.showToastWarning(t("ToastURLNotEmpty"));
    return false;
  }

  if (
    data.serviceType == ServiceTypeEnum.BuffComment &&
    (!data.targets || data.targets?.length == 0)
  ) {
    toast.showToastWarning(t("ToastCommentNotEmpty"));
    return false;
  }

  if (
    data.serviceType == ServiceTypeEnum.BuffReaction &&
    (!data.targets || data.targets?.length == 0)
  ) {
    toast.showToastWarning(t("ToastReactionNotEmpty"));
    return false;
  }
  return true;
}

/**
 * Ẩn popup chọn hình thức thanh toán
 */
function onHidden() {
  isVisiblePopup.value = false;
}

/**
 * Hành động nhấn click reaction
 */
function onClickReaction(data: any, reaction: any) {
  data.targets = data.targets || [];
  reaction.Active = !reaction.Active;
  if (reaction.Active) {
    data.targets.push(reaction.ReactionName);
  } else {
    const index = data.targets.indexOf(reaction.ReactionName);
    if (index >= 0) {
      data.targets.splice(index, 1);
    }
  }
}

/**
 * Sự kiện chọn payment method
 */
function activePaymentMethod(data: any) {
  if (!data) {
    return;
  }
  paymentMethod.value.paymentMethodId = data.id;
}

/**
 * Focus vào comment
 */
function onReadyComment(event: any) {
  setTimeout(() => {
    event.component.focus();
  }, 0);
}

/**
 * Mở popup nhập comment
 */
function onFocusComment(data: any) {
  servicePackage.value = data;
  servicePackage.value.targets = servicePackage.value.targets || [];
  isVisiblePopupComment.value = true;
}

/**
 * Lưu comment
 */
function onSaveComment() {
  isVisiblePopupComment.value = false;
}

/**
 * Nhập comment
 */
function onChangedTextArea(value: string) {
  if (value) {
    servicePackage.value.comment = value;
    servicePackage.value.targets = servicePackage.value.comment.split("\n");
  }
}

/**
 * Huy
 */
function onHiddenComment() {
  // servicePackage.value.comment = "";
  // servicePackage.value.targets = [];
  isVisiblePopupComment.value = false;
}

/**
 * Sự kiện chọn Comment
 */
function onChangedComment(value: any, item: any) {
  item.commentID = value;
  item.targets = listComment.value
    .find((i) => i.id == value)
    ?.content?.split("\n");
}

/**
 * Xử lý tham số trước khi call api
 */
async function handleConfig() {
  const params = new URLSearchParams();
  // Lấy token Recaptcha
  const token = await getTokenRecaptcha("GetComment");

  // params.append("SkipCount", "0");
  // params.append("MaxResultCount", "1000");
  // params.append("Status", "0");
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
  try {
    const configAPI = await handleConfig();
    const res = await CommentService.getPaging(configAPI);
    if (res && res.data) {
      const data = res.data;
      listComment.value = data.items;
    }
  } catch (error: any) {
    toast.showToastError(error?.message);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/icons.css";
.dashboard-container {
  background: var(--background-color);
  color: var(--text-color);
}
.dashboard-container {
  .title {
    margin-top: 40px;
  }
  .dashboard-warning {
    color: #dc3548;
    font-size: 18px;
    font-weight: 600;
    .dashboard-regulations-title {
      font-size: 30px;
    }
    .dashboard-regulations-content {
      margin-left: 20px;
      line-height: 25px;
    }
  }
  .topup-card-container {
    background: #fff;
    -webkit-filter: drop-shadow(0 0 30px hsla(0, 0%, 70.6%, 0.2));
    filter: drop-shadow(0 0 30px rgba(180, 180, 180, 0.2));
    max-width: 340px;
    width: 100%;
    border-radius: 20px;
    padding: 30px;
    position: relative;
    display: inline-block;
    margin-top: 24px;
    margin-right: 24px;
    .corner-ribbon-container {
      top: 0;
      right: 0;
      left: auto;
      position: absolute;
      overflow: hidden;
      width: 92px;
      height: 92px;
    }
    .corner-ribbon {
      width: 100px;
      background: #2a5298;
      position: absolute;
      top: 18px;
      left: 18px;
      text-align: center;
      letter-spacing: 1px;
      color: #f0f0f0;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
    }
    .topup-icon {
      background: #e5edfe;
      border-radius: 20px;
      padding: 5px 20px;
    }

    .price-container {
      display: -webkit-flex;
      display: flex;
      -webkit-flex-direction: column;
      flex-direction: column;
      -webkit-align-items: flex-end;
      align-items: flex-end;
      .price-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 23px;
        color: #4e89ff;
      }
      .price-number {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
        color: #1e3c72;
      }
    }

    .topup-description {
      min-height: 84px;
    }

    .block-center-between {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: space-between;
      justify-content: space-between;
    }
  }
  .w-30 {
    width: 30%;
    min-width: 160px;
  }
  .apps {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-weight: bold;
    border-bottom: 1px solid #e3ebf6;
  }

  .app {
    width: 100px;
    cursor: pointer;
    margin-right: 8px;
    margin-top: 8px;
    text-align: center;
    padding: 10px;
    border-radius: 18px;
    border-bottom: 1px solid transparent;
  }

  .app:hover {
    color: #f5f5f5 !important;
    background: linear-gradient(180deg, #3cf 0, #06f);
    border-bottom: 1px solid #2c7be5 !important;
  }

  .appActive {
    color: #f5f5f5 !important;
    background: linear-gradient(180deg, #3cf 0, #06f);
    border-bottom: 1px solid #2c7be5 !important;
  }
  .service-card-container {
    background: #fff;
    -webkit-filter: drop-shadow(0 0 30px hsla(0, 0%, 70.6%, 0.2));
    filter: drop-shadow(0 0 30px rgba(180, 180, 180, 0.2));
    width: 265px;
    height: auto;
    border-radius: 20px;
    padding: 12px;
    position: relative;
    margin-right: 16px !important;
    .icon-service {
      background: #2a5298;
      border-radius: 50%;
      padding: 14px;
      height: 48px;
      width: 48px;
      min-width: 48px;
    }
    .service-name {
      font-style: normal;
      font-weight: 600;
      font-size: 15px;
      line-height: 30px;
      color: #2a5298;
    }
    .price {
      font-style: normal;
      font-weight: 400;
      font-size: 10px;
      line-height: 22px;
      color: #666;
    }
    .max-price {
      font-style: normal;
      font-weight: 400;
      font-size: 10px;
      line-height: 18px;
      color: #999;
    }
    .total-price-detail {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      color: #666;
    }
    .reaction-icon {
      padding: 8px 0;
      .icon-buff {
        &.active {
          border-radius: 50%;
          box-shadow: 0 0 20px #fac351;
          &.like {
            box-shadow: 0 0 20px #1098f5;
          }
          &.love {
            box-shadow: 0 0 20px #f95671;
          }
          &.angry {
            box-shadow: 0 0 20px #ea630b;
          }
          .icon {
            min-width: 25px;
            width: 25px;
            height: 25px;
          }
        }
        &:hover {
          border-radius: 50%;
          box-shadow: 0 0 20px #fac351;
          // -webkit-animation: bounce 0.5s;
          // animation: bounce 0.5s;
          // -webkit-animation-direction: alternate;
          // animation-direction: alternate;
          // -webkit-animation-iteration-count: infinite;
          // animation-iteration-count: infinite;
          &.like {
            box-shadow: 0 0 20px #1098f5;
          }
          &.love {
            box-shadow: 0 0 20px #f95671;
          }
          &.angry {
            box-shadow: 0 0 20px #ea630b;
          }
        }
      }
    }
  }
}

.payment-method-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin: 8px 0;
  padding: 8px 16px;
  cursor: pointer;
  &.active {
    border-color: #2d6da3;
  }
}

.popup-comment {
  .dx-textarea {
    height: 207px;
  }
}
</style>
