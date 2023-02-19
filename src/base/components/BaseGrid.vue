<script setup lang="ts">
import {
  DxDataGrid,
  DxColumn,
  DxButton,
  DxPager,
  DxPaging,
  DxSelection,
} from "devextreme-vue/data-grid";
import { DxLoadPanel } from "devextreme-vue/load-panel";
import { computed, onMounted, ref, useSlots } from "@vue/runtime-core";
import BaseSelectBox from "@/base/components/BaseSelectBox.vue";
import type { ColumnDataGrid } from "@/base/shared/models/grid/ColumnDataGrid";
import type { PropType } from "vue";

const props = defineProps({
  columns: { type: Array as PropType<Array<ColumnDataGrid>> },
  dataSource: { type: Array as PropType<Array<any>> },
  width: { type: String, default: "100%" },
  height: { type: String, default: "100%" },
  pageSizes: {
    type: Array as PropType<Array<string>>,
    default: [25, 50, 100, 200],
  }, // Danh sách số trang
  pageSize: { type: Number, default: 25 }, // Số lượng một bản trang
  pageIndex: { type: Number, default: 1 }, // trang hiện tại
  total: { type: Number, required: false, default: 0 }, // tổng số lượng bản ghi
  loading: { type: Boolean, default: false },
  select: { type: Boolean, default: false }, // có cho phép chọn hàng không
  isPaging: { type: Boolean, default: true }, // Có phân trang?
});

const loadPanel = {
  enabled: false,
};

const emit = defineEmits([
  "onSelectionChanged",
  "changePageSize",
  "changePageIndex",
  "onContentReady",
]);

let pages = computed(() => Math.ceil(props.total / props.pageSize));

const slots = useSlots();

function isExistSlot(slotName: string) {
  return slots[slotName];
}

onMounted(() => {
  // emit("changePageSize", props.pageSize);
});

function onSelectionChanged(item: any) {
  emit("onSelectionChanged", item);
}

function changePageSize(item: any) {
  emit("changePageSize", item);
}

function changePageIndex(item: any) {
  emit("changePageIndex", item);
}

function onContentReady(event: any) {
  emit("onContentReady", event);
}
</script>

<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- Grid -->
    <div class="flex1">
      <DxDataGrid
        :width="width"
        :height="height"
        :loadPanel="loadPanel"
        :data-source="dataSource"
        :show-borders="true"
        :showRowLines="true"
        :showColumnLines="false"
        @content-ready="onContentReady"
        @selection-changed="onSelectionChanged"
        class="base-grid"
        id="base-grid"
        cell-template="grid-cell"
        :noDataText="$t('Common.NoDataText')"
      >
        <DxSelection
          v-if="select"
          :select-all-mode="'page'"
          :show-check-boxes-mode="'always'"
          mode="multiple"
        />
        <DxColumn
          v-for="col in columns"
          :key="col.DataField"
          :fixed="col.Fixed"
          :fixed-position="col.FixedPosition"
          :width="col.Width"
          :alignment="col.Alignment"
          :css-class="col.CssClass"
          :data-type="col.DataType"
          :format="col.Format"
          :caption="col.Caption"
          :data-field="col.DataField"
          :type="col.Type"
          :cell-template="col.CellTemplate"
        >
        </DxColumn>
        <DxPaging :enabled="false"></DxPaging>
        <template #custom="{ data }">
          <slot :name="data.column.dataField" :data="data"> </slot>
        </template>
      </DxDataGrid>
    </div>

    <!-- Phân trang -->
    <div v-if="isPaging" id="pagination" class="pagination-container">
      <div style="width: 90px">
        <BaseSelectBox
          :dataSource="pageSizes"
          :placeholder="$t('SelectAppName')"
          :value="pageSize"
          @onValueChanged="changePageSize($event)"
        />
      </div>
      <ul class="page">
        <li
          :class="{ disable: pageIndex == 1 }"
          @click="changePageIndex(pageIndex - 1)"
          class="page__btn page__item"
        >
          <span class="icon icon-arrow icon-prev"></span>
        </li>

        <li
          @click="changePageIndex(1)"
          class="page__numbers page__item"
          :class="{ active: pageIndex == 1 }"
        >
          1
        </li>

        <li v-if="pageIndex >= 5" class="page__dots page__item">...</li>

        <li
          @click="changePageIndex(pageIndex - 2)"
          v-if="pageIndex >= 4"
          class="page__numbers page__item"
        >
          {{ pageIndex - 2 }}
        </li>

        <li
          @click="changePageIndex(pageIndex - 1)"
          v-if="pageIndex >= 3"
          class="page__numbers page__item"
        >
          {{ pageIndex - 1 }}
        </li>

        <li
          @click="changePageIndex(pageIndex)"
          v-if="pageIndex >= 2"
          class="page__numbers page__item active"
        >
          {{ pageIndex }}
        </li>

        <li
          @click="changePageIndex(pageIndex + 1)"
          v-if="pageIndex < pages - 1"
          class="page__numbers page__item"
        >
          {{ pageIndex + 1 }}
        </li>

        <li
          @click="changePageIndex(pageIndex + 2)"
          v-if="pageIndex < pages - 2"
          class="page__numbers page__item"
        >
          {{ pageIndex + 2 }}
        </li>

        <li
          v-if="pages >= 4 && pageIndex <= pages - 4"
          class="page__item page__dots"
        >
          ...
        </li>

        <li
          @click="changePageIndex(pages)"
          v-if="pages >= 2 && pages != pageIndex"
          :class="{ active: pageIndex == pages }"
          class="page__item page__numbers"
        >
          {{ pages }}
        </li>

        <li
          :class="{ disable: pageIndex == 1 || pageIndex == pages }"
          @click="changePageIndex(pageIndex + 1)"
          class="page__item page__btn"
        >
          <span class="icon icon-arrow icon-next"></span>
        </li>
      </ul>
    </div>
  </div>

  <!-- Loading -->
  <DxLoadPanel
    v-if="loading"
    :position="{ of: '#base-grid' }"
    :visible="loading"
    :show-indicator="true"
    :show-pane="true"
    :shading="false"
    :hide-on-outside-click="false"
    :message="$t('Common.Loading')"
    shading-color="rgba(0,0,0,0.4)"
  />
</template>

<style lang="scss">
.pagination-container {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ul {
  list-style-type: none;
}

.items-list {
  max-width: 90vw;
  margin: 8px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 12px;
  justify-content: center;
  align-content: center;

  @media only screen and (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.item {
  width: 100px;
  height: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--greyDark);
  cursor: pointer;

  span {
    background: #ffffff;
    box-shadow: 0 4px 8px rgba(#5a6181, 0.05);
    border-radius: 5px;
    padding: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  &:hover {
    span {
      transform: scale(1.2);
      color: var(--primary);
    }
  }

  p {
    font-size: 14px;
    margin-top: 4px;
    color: var(--greyLight);
  }
}

.page {
  .disable {
    pointer-events: none;
    opacity: 0.5;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  &__numbers,
  &__btn,
  &__dots {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px;
    font-size: 14px;
    cursor: pointer;
  }

  &__item {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    justify-content: center;
    margin: 0 2px;
    border: 1px solid #d9dade;
    background-color: #fff;
    cursor: pointer;

    &:hover {
      color: var(--primary);
    }

    &.active {
      border-color: #274bf7;
      color: #274bf7;
      background-color: #fff;
    }
  }

  .icon-arrow {
    width: 12px;
    height: 12px;
    min-width: 12px;
    display: inline-block;
    background-image: url("/src/base/icon/icon-arrow-down.svg");
  }

  .icon-prev {
    transform: rotate(90deg);
  }

  .icon-next {
    transform: rotate(270deg);
  }
}

.base-grid {
  .dx-datagrid-headers.dx-datagrid-nowrap {
    border-bottom: none !important;
    text-transform: uppercase;
  }

  .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
    background: #f2f2f2;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
    height: 45px;
    line-height: 30px;
  }

  .dx-datagrid-rowsview .dx-datagrid-table .dx-row.dx-freespace-row,
  .dx-datagrid-rowsview .dx-datagrid-table .dx-row.dx-virtual-row {
    display: none;
  }
  
  .dx-datagrid-content .dx-datagrid-table .dx-row > td,
  .dx-datagrid-content .dx-datagrid-table .dx-row > tr > td {
    vertical-align: middle;
  }
}
</style>
