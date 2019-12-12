<template>
  <div class="outboundSummaryStatement_list">
    <a-row style="padding:0 20px;">
      <a-row>
        <a-col :span="24">
          <span class="span_lable">业务日期 :</span>
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
          <span class="span_lable">单据类型：</span>
          <a-select v-model="dataSource" style="width: 140px">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option value="RECEIVE">领料出库</a-select-option>
            <a-select-option value="SALES">销售出库</a-select-option>
            <a-select-option value="RETURN">退货出库</a-select-option>
            <a-select-option value="OTHER">其他出库</a-select-option>
          </a-select>
          <span class="span_lable">仓库：</span>
          <a-select v-model="warehouseId" style="width: 140px">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option
              :value="item.id"
              v-for="(item, index) in allWarehouse"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
          <span class="span_lable">单据编号：</span>
          <a-input placeholder style="width: 140px" v-model="keyword"></a-input>
          <a-button type="primary" @click="getList">查询</a-button>
        </a-col>
      </a-row>
      <a-row style="padding-top:10px;">
        <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id">
          <template slot="danjubianhao" slot-scope="text, record, index">
            <a href="javascript:" @click="showDetails(record.id)">{{text}}</a>
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
    <a-modal
      title="详情"
      :footer="null"
      width="1200px"
      :visible="detalisVisible"
      @cancel="handleCancel()"
      :maskClosable="false"
      :destroyOnClose="true"
      class="details_modal"
    >
      <detail :id="rowId"></detail>
    </a-modal>
  </div>
</template>
<script>
import detail from "./details";
const columns = [
  {
    dataIndex: "gmtCreated",
    key: "gmtCreated",
    title: "业务日期",
    width: "20%"
  },
  {
    dataIndex: "code",
    title: "单据编号",
    width: "30%",
    key: "code",
    scopedSlots: { customRender: "danjubianhao" }
  },
  {
    dataIndex: "outType",
    title: "单据类型",
    width: "20%",
    key: "outType",
    customRender: function(text, record, index) {
      return text == "RECEIVE"
        ? "领料出库"
        : text == "SALES"
        ? "销售出库"
        : text == "RETURN"
        ? "退货出库"
        : "其他出库";
    }
  },

  {
    dataIndex: "warehouse",
    key: "warehouse",
    title: "收货仓库",
    width: "15%"
  }

  // {
  //   dataIndex: "schedule",
  //   key: "schedule",
  //   title: "备注",
  //   width: "20%"
  // }
];
export default {
  data() {
    return {
      rowId: "",
      detalisVisible: false,
      current: 1,
      pageSize: 10,
      total: 0,
      columns,
      data: [],
      startValue: null,
      endValue: null,
      startDate: "",
      endDate: "",
      warehouseId: -1,
      allWarehouse: [],
      dataSource: -1,
      keyword: null
    };
  },
  components: {
    detail
  },
  methods: {
    handleCancel() {
      this.detalisVisible = false;
    },
    showDetails(id) {
      this.rowId = id;
      this.detalisVisible = true;
    },
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
          url: "/api-warehouse/outOrder/list",
          params: {
            page: this.current,
            size: this.pageSize,
            outType: this.dataSource == -1 ? null : this.dataSource,
            warehouseId: this.warehouseId == -1 ? null : this.warehouseId,
            startTime: this.startDate != "" ? this.startDate : null,
            endTime: this.endDate != "" ? this.endDate : null,
            keyword: this.keyword == "" ? null : this.keyword
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
            this.data = this.data.map(item => {
              return {
                ...item,
                warehouse: item.warehouse.name
              };
            });
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
  },
  watch: {}
};
</script>
<style lang="less">
.outboundSummaryStatement_list {
  overflow: hidden;
  .span_lable {
    display: inline-block;
    width: 77px;
    text-align: right;
  }
}
.details_modal {
  .ant-modal-body {
    padding-top: 0px;
  }
}
</style>