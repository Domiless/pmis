<template>
  <div class="requisitionDetails_list">
    <a-row style="padding:0 20px;">
      <a-row>
        <a-col :span="24">
          <span class="span_lable">调拨日期：</span>
          <a-date-picker
            :disabledDate="disabledStartDate"
            format="YYYY/MM/DD"
            v-model="startValue"
            placeholder="开始日期"
            @change="(a,b)=>changeDate(a,b,1)"
            style="width:130px;"
          />
          <a-date-picker
            :disabledDate="disabledEndDate"
            format="YYYY/MM/DD"
            placeholder="结束日期"
            v-model="endValue"
            @change="(a,b)=>changeDate(a,b,2)"
            style="width:130px;"
          />
          <span class="span_lable">单据编号：</span>
          <a-input placeholder v-model="transferNo" style="width: 140px"></a-input>
          <span class="span_lable">调出仓库：</span>
          <a-select v-model="fromWarehouseId" style="width: 200px">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option
              :value="item.id"
              v-for="(item, index) in allWarehouse"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
          <span class="span_lable">调入仓库：</span>
          <a-select v-model="toWarehouseId" style="width: 200px">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option
              :value="item.id"
              v-for="(item, index) in allWarehouse"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
          <span class="span_lable">经办人：</span>
          <a-input placeholder v-model="manager" style="width: 140px"></a-input>
          <a-button type="primary" @click="getList">查询</a-button>
        </a-col>
      </a-row>
      <a-row style="padding-top:10px;">
        <a-table
          :columns="columns"
          :scroll="{ x: 1500}"
          :pagination="false"
          :dataSource="data"
          rowKey="id"
        >
          <template slot="operation" slot-scope="text, record, index">
            <a-button class="button_text btn_disabled">查看明细</a-button>
          </template>
        </a-table>
        <a-pagination
          style="padding-top:12px;text-align: right;"
          showQuickJumper
          :defaultCurrent="current"
          :total="total"
          @change="onChange"
          showSizeChanger
          :pageSizeOptions="['10','20','30']"
          @showSizeChange="onShowSizeChange"
          :showTotal="total => `共 ${total} 条`"
        />
      </a-row>
    </a-row>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "transferDate",
    key: "transferDate",
    title: "调拨日期",
    width: 120
  },
  {
    dataIndex: "fromWarehouseName",
    title: "调出仓库",
    width: 100,
    key: "fromWarehouseName"
  },
  {
    dataIndex: "toWarehouseNae",
    title: "调入仓库",
    width: 100,
    key: "toWarehouseNae"
  },
  {
    dataIndex: "transferNo",
    title: "单据编号",
    width: 140,
    key: "transferNo",
    scopedSlots: { customRender: "warehouseNmae" }
  },

  {
    dataIndex: "code",
    key: "code",
    title: "物料编码",
    width: 120
  },
  {
    dataIndex: "drawingCode",
    key: "drawingCode",
    title: "图号",
    width: 120
  },
  {
    dataIndex: "name",
    key: "name",
    title: "名称",
    width: 140
  },
  {
    dataIndex: "specification",
    key: "specification",
    title: "型号/规格",
    width: 100
  },
  {
    dataIndex: "classify",
    key: "classify",
    title: "物料分类",
    width: 100
  },
  {
    dataIndex: "unitEntry",
    key: "unitEntry",
    title: "单位",
    width: 80
  },
  {
    dataIndex: "inventoryAmount",
    key: "inventoryAmount",
    title: "库存数量",
    width: 100
  },
  {
    dataIndex: "transferAmount",
    key: "transferAmount",
    title: "调拨数量",
    width: 100
  },
  {
    dataIndex: "remark",
    key: "remark",
    title: "备注",
    width: 120
  }
];
export default {
  data() {
    return {
      current: 1,
      total: 0,
      columns,
      data: [{ phone: 111, id: 1 }],
      startValue: null,
      endValue: null,
      startDate: "",
      endDate: "",
      fromWarehouseId: -1,
      toWarehouseId: -1,
      allWarehouse: [],
      transferNo: "",
      manager: ""
    };
  },
  methods: {
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getList();
    },
    onChange(current, pageNumber) {
      console.log("Page: ", pageNumber);
      console.log("第几页: ", current);
      this.current = current;
      this.getList();
    },
    getList() {
      this.Axios(
        {
          url: "/api-warehouse/transferItem/reportList",
          params: {
            page: this.current,
            size: this.pageSize,
            startDate: this.startDate != "" ? this.startDate : null,
            endDate: this.endDate != "" ? this.endDate : null,
            fromWarehouseId:
              this.fromWarehouseId != -1 ? this.fromWarehouseId : null,
            toWarehouseId: this.toWarehouseId != -1 ? this.toWarehouseId : null,
            transferNo: this.transferNo != "" ? this.transferNo : null,
            manager: this.manager != "" ? this.manager : null
            // state: this.state,
            // keyword: this.keyword
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.data = result.data.data.content;
            this.total = result.data.data.totalElement;
          }
        },
        ({ type, info }) => {}
      );
    },
    changeDate(a, b, c) {
      console.log(a, b, c);

      if (c == 1) {
        this.startDate = b;
      }
      if (c == 2) {
        this.endDate = b;
      }
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    getWearhouse() {
      this.Axios(
        {
          url: "/api-warehouse/warehouse/list",
          params: {
            page: -1
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            this.allWarehouse = [...result.data.data];
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.getWearhouse();
    this.getList();
  },
  watch: {}
};
</script>
<style lang="less">
.requisitionDetails_list {
  overflow: hidden;
  .span_lable {
    display: inline-block;
    width: 77px;
    text-align: right;
  }
}
</style>