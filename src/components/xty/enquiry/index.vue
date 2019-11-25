<template>
  <div class="enquiry_list">
    <a-row style="line-height:50px;margin-bottom: 10px;">
      <permission-button
        v-if="activeKey==1"
        permCode
        banType="hide"
        :disabled="selectedRowKeys.length<1"
        @click="add(selectedRows,1)"
      >批量询价</permission-button>
      <permission-button
        v-if="activeKey==2"
        permCode
        banType="hide"
        :disabled="selectedRowKeys1.length<1"
        @click="eidt(selectedRows1,1)"
      >批量修改</permission-button>
    </a-row>
    <a-row style="margin-bottom: 10px;">
      <a-col :span="24">
        <span>日期 :</span>
        <a-range-picker style="width:240px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
        <span>关键词 :</span>
        <a-input
          :placeholder="activeKey==1?'项目订单编号/图号/需求名称/设计师/任务指派人':'项目订单编号/图号/需求名称/供应商名称'"
          style="width: 350px"
          v-model="keyWords"
          @keyup.enter.native="search"
        ></a-input>
        <a-button @click="search">搜索</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-tabs :activeKey="activeKey" @change="callback">
        <a-tab-pane tab="待询价" key="1">
          <a-table
            @change="sortValue"
            rowKey="id"
            :columns="columns"
            :dataSource="data"
            :pagination="false"
            :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
          >
            <template slot="operation" slot-scope="text, record, index">
              <div>
                <a-button class="button_text" @click="add(record,2)">询价</a-button>
              </div>
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
        </a-tab-pane>
        <a-tab-pane tab="已询价" key="2" forceRender>
          <a-table
            @change="sortValue1"
            :scroll="{ x: 2950}"
            rowKey="id"
            :columns="columns1"
            :dataSource="data1"
            :pagination="false"
            :rowSelection="{selectedRowKeys:selectedRowKeys1,onChange: onSelectChange1}"
          >
            <a-button
              slot="operation"
              slot-scope="text, record, index"
              class="button_text"
              @click="eidt(record,2)"
            >修改</a-button>
          </a-table>
          <a-pagination
            style="padding-top:12px;text-align: right;"
            showQuickJumper
            :defaultCurrent="current1"
            :total="total1"
            @change="onChange1"
            showSizeChanger
            :pageSizeOptions="['10','20','30']"
            @showSizeChange="onShowSizeChange1"
            :showTotal="total => `共 ${total} 条`"
          />
        </a-tab-pane>
      </a-tabs>
    </a-row>
    <a-modal
      title="询价"
      :footer="null"
      width="1300px"
      :visible="addVisible"
      @cancel="handleCancel(1)"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <add v-on:addModal="addModal" :dataArray="addArray" ref="addEnquiry"></add>
    </a-modal>
    <a-modal
      title="询价修改"
      :footer="null"
      width="1300px"
      :visible="editVisible"
      @cancel="handleCancel(2)"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <edit v-on:editModal="editModal" :dataArray="editArray"></edit>
    </a-modal>
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
const columns = [
  {
    title: "项目订单编号",
    key: "workOrderNo",
    dataIndex: "workOrderNo",
    width: "12%"
    // sorter: true
  },
  {
    title: "图号",
    key: "drawingNo",
    dataIndex: "drawingNo",
    width: "15%",
    sorter: true
  },
  {
    title: "需求名称",
    key: "name",
    dataIndex: "name",
    width: "15%",
    sorter: true
  },
  {
    title: "需求数量",
    key: "addNum",
    dataIndex: "addNum",
    width: "8%",
    sorter: true
  },
  {
    title: "指定品牌",
    key: "brand",
    dataIndex: "brand",
    width: "10%"
  },
  {
    title: "设计师",
    key: "planner",
    dataIndex: "planner",
    width: "8%",
    sorter: true
  },
  {
    title: "任务指派人",
    key: "assigner",
    dataIndex: "assigner",
    width: "8%",
    sorter: true
  },
  {
    title: "任务指派时间",
    key: "assignerTime",
    dataIndex: "assignerTime",
    width: "11%",
    sorter: true
  },
  {
    title: "采购员",
    key: "appointName",
    dataIndex: "appointName",
    width: "8%"
  },
  {
    title: "操作",
    key: "operation",
    dataIndex: "operation",
    width: "8%",
    scopedSlots: { customRender: "operation" }
  }
];
const columns1 = [
  {
    title: "项目订单编号",
    key: "workOrderNo",
    dataIndex: "workOrderNo",
    width: 150,
    fixed: "left"
  },
  {
    title: "图号",
    key: "drawingNo",
    dataIndex: "drawingNo",
    width: 150,
    fixed: "left",
    sorter: true
  },
  {
    title: "需求名称",
    key: "name",
    dataIndex: "name",
    width: 150,
    fixed: "left",
    sorter: true
  },
  {
    title: "需求数量",
    key: "number",
    dataIndex: "number",
    width: 100,
    sorter: true
  },
  {
    title: "指定品牌",
    key: "brand",
    dataIndex: "brand",
    width: 110
  },
  {
    title: "设计师",
    key: "planner",
    dataIndex: "planner",
    width: 80,
    sorter: true
  },
  {
    title: "采购名称",
    key: "shopName",
    dataIndex: "shopName",
    width: 120,
    scopedSlots: { customRender: "shopName" },
    sorter: true
  },
  {
    title: "订单数量",
    key: "orderNumber",
    dataIndex: "orderNumber",
    width: 100,
    scopedSlots: { customRender: "orderNumber" },
    slots: { title: "dingdanshuliangTitle" },
    sorter: true
  },
  {
    title: "订单单位",
    key: "unit",
    dataIndex: "unit",
    width: 80,
    slots: { title: "dingdandanweiTitle" },
    scopedSlots: { customRender: "unitId" }
  },
  {
    title: "交货日期",
    key: "delivery",
    dataIndex: "delivery",
    width: 140,
    slots: { title: "jiaohuoriqiTitle" },
    scopedSlots: { customRender: "delivery" },
    sorter: true
  },
  {
    title: "第1供应商",
    key: "firstSupplier",
    dataIndex: "firstSupplier",
    width: 150,
    slots: { title: "diyigongyingshangTitle" },
    scopedSlots: { customRender: "firstSupplierId" },
    sorter: true
  },
  {
    title: "第1报价(元)",
    key: "firstOffer",
    dataIndex: "firstOffer",
    width: 120,
    slots: { title: "diyibaojiaTitle" },
    scopedSlots: { customRender: "firstOffer" },
    sorter: true
  },
  {
    title: "第2供应商",
    key: "secondSupplier",
    dataIndex: "secondSupplier",
    width: 150,
    scopedSlots: { customRender: "secondSupplierId" },
    sorter: true
  },
  {
    title: "第2报价(元)",
    key: "secondOffer",
    dataIndex: "secondOffer",
    width: 120,
    scopedSlots: { customRender: "secondOffer" },
    sorter: true
  },
  {
    title: "第3供应商",
    key: "thirdSupplier",
    dataIndex: "thirdSupplier",
    width: 150,
    scopedSlots: { customRender: "thirdSupplierId" },
    sorter: true
  },
  {
    title: "第3报价(元)",
    key: "thirdOffer",
    dataIndex: "thirdOffer",
    width: 120,
    scopedSlots: { customRender: "thirdOffer" },
    sorter: true
  },
  {
    title: "建议供应商",
    key: "supplier",
    dataIndex: "supplier",
    width: 150,
    slots: { title: "jianyigongyingshangTitle" },
    scopedSlots: { customRender: "supplierId" }
  },
  {
    title: "建议价格",
    key: "price",
    dataIndex: "price",
    width: 90
  },
  {
    title: "价格单位",
    key: "priseUnit",
    dataIndex: "priseUnit",
    width: 90,
    slots: { title: "jiagedanweiTitle" },
    scopedSlots: { customRender: "priseUnitId" }
  },
  {
    title: "货币类型",
    key: "moneyType",
    dataIndex: "moneyType",
    width: 90,
    scopedSlots: { customRender: "moneyType" }
  },
  {
    title: "备注",
    key: "remark",
    dataIndex: "remark",
    width: 140,
    scopedSlots: { customRender: "remark" }
  },
  {
    title: "询价时间",
    key: "gmtCreated",
    dataIndex: "gmtCreated",
    width: 140,
    scopedSlots: { customRender: "remark" }
  },
  {
    title: "小计(元)",
    key: "total",
    dataIndex: "total",
    width: 80
  },
  {
    title: "操作",
    key: "operation",
    dataIndex: "operation",
    width: 80,
    fixed: "right",
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  data() {
    return {
      editVisible: false,
      addVisible: false,
      activeKey: "1",
      columns,
      total: 0,
      current: 1,
      data: [],
      columns1,
      total1: 0,
      current1: 1,
      data1: [],
      keyWords: "",
      start: "",
      end: "",
      selectedRowKeys: [],
      selectedRowKeys1: [],
      selectedRows: [],
      selectedRows1: [],
      dateValue: "",
      addArray: [],
      editArray: []
    };
  },
  methods: {
    sortValue(a, b, c) {
      console.log(c);
      this.getList(
        c.columnKey,
        c.order == "ascend" ? "ASC" : c.order == "descend" ? "DESC" : ""
      );
    },
    sortValue1(a, b, c) {
      console.log(c);
      this.getList1(
        c.columnKey,
        c.order == "ascend" ? "ASC" : c.order == "descend" ? "DESC" : ""
      );
    },
    search() {
      if (this.activeKey == 1) {
        this.getList();
      }
      if (this.activeKey == 2) {
        this.getList1();
      }
    },
    addModal() {
      this.addVisible = false;
      this.getList();
      this.getList1();
    },
    editModal() {
      this.editVisible = false;
      this.getList();
      this.getList1();
    },
    handleCancel(a) {
      if (a == 1) {
        this.$refs.addEnquiry.quxiao();
        // this.addVisible = false;
      }
      if (a == 2) {
        this.editVisible = false;
      }
    },
    callback(key) {
      this.activeKey = key;
      console.log(this.activeKey);
    },
    onSelectChange(a, b) {
      this.selectedRowKeys = a;
      this.selectedRows = b;
    },
    onSelectChange1(a, b) {
      this.selectedRowKeys1 = a;
      this.selectedRows1 = b;
    },
    onChangeRange(date, datestring) {
      this.dateValue = datestring;
      console.log(datestring);
    },
    onChange(current, pageNumber) {
      console.log("Page: ", pageNumber);
      console.log("第几页: ", current);
      this.current = current;
      this.selectedRowKeys = [];
      this.selectedRows = [];
      this.getList();
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getList();
    },
    onChange1(current, pageNumber) {
      console.log("Page: ", pageNumber);
      console.log("第几页: ", current);
      this.current = current;
      this.selectedRowKeys1 = [];
      this.selectedRows1 = [];
      this.getList1();
    },
    onShowSizeChange1(current, pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getList1();
    },
    getList(sortname, sortway) {
      this.Axios(
        {
          url: "/api-order/bom/getMybomdes",
          type: "get",
          params: {
            sortname: sortname,
            sortway: sortway,
            page: this.current,
            size: this.pageSize,
            keyword: this.keyWords,
            start: this.dateValue[0] != "" ? this.dateValue[0] : null,
            end: this.dateValue[1] != "" ? this.dateValue[1] : null
          },
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
    getList1(sortname, sortway) {
      this.Axios(
        {
          url: "/api-order/purchase/offerList",
          type: "get",
          params: {
            sortname: sortname,
            sortway: sortway,
            page: this.current,
            size: this.pageSize,
            keyword: this.keyWords,
            start: this.dateValue[0] != "" ? this.dateValue[0] : null,
            end: this.dateValue[1] != "" ? this.dateValue[1] : null
          },
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.data1 = result.data.data.content;
            this.total1 = result.data.data.totalElement;
          }
        },
        ({ type, info }) => {}
      );
    },
    add(row, a) {
      this.addArray = [];
      if (a == 1) {
        this.addArray = [...row];
        this.addVisible = true;
      }
      if (a == 2) {
        this.addArray.push(row);
        this.addVisible = true;
      }
    },
    eidt(row, a) {
      this.editArray = [];
      if (a == 1) {
        if (
          row
            .map(item => {
              return item.isCreate;
            })
            .find(item => item == 1) != undefined
        ) {
          this.$message.error(`所选信息已有业务关联，不可修改`);
          return false;
        }
        this.editArray = [...row];
        this.editVisible = true;
      }
      if (a == 2) {
        if (row.isCreate == 1) {
          this.$message.error(`当前信息已有业务关联，不可修改`);
          return false;
        }
        this.editArray.push(row);
        this.editVisible = true;
      }
    }
  },
  created() {
    this.getList();
    this.getList1();
  },
  components: {
    add,
    edit
  }
};
</script>
<style lang="less">
.enquiry_list {
  overflow: hidden;
  padding: 0 20px;
}
</style>