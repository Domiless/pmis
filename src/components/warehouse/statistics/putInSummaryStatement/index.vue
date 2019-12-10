<template>
  <div class="putInSummaryStatement_list">
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
          <a-select defaultValue="lucy" style="width: 140px">
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
          <span class="span_lable">仓库：</span>
          <a-select defaultValue="lucy" style="width: 140px">
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
          <span class="span_lable">单据编号:</span>
          <a-input placeholder style="width: 140px"></a-input>
          <a-button type="primary">查询</a-button>
        </a-col>
      </a-row>
      <a-row style="padding-top:10px;">
        <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id">
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
    dataIndex: "warehouseCode",
    key: "warehouseCode",
    title: "业务日期",
    width: "20%"
  },
  {
    dataIndex: "name",
    title: "单据编号",
    width: "30%",
    key: "name",
    scopedSlots: { customRender: "warehouseNmae" }
  },
  {
    dataIndex: "warehouseAdmins",
    title: "单据类型",
    width: "20%",
    key: "warehouseAdmins"
  },

  {
    dataIndex: "phone",
    key: "phone",
    title: "收货仓库",
    width: "15%"
  },
  {
    dataIndex: "operation",
    key: "operation",
    title: "操作",
    width: "10%",
    scopedSlots: { customRender: "operation" }
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
      current: 1,
      total: 0,
      columns,
      data: [{ phone: 111, id: 1 }],
      startValue: null,
      endValue: null,
      startDate: "",
      endDate: ""
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
          url: "/api-warehouse/warehouse/list",
          params: {
            page: this.current,
            size: this.pageSize
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
            this.data = this.data.map(item => {
              return {
                ...item,
                warehouseAdmins: item.warehouseAdmins
                  .map(item => item.employeeName)
                  .join("、")
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
    }
  },
  created() {},
  watch: {}
};
</script>
<style lang="less">
.putInSummaryStatement_list {
  overflow: hidden;
  .span_lable {
    display: inline-block;
    width: 77px;
    text-align: right;
  }
}
</style>