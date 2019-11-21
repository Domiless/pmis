<template>
  <div class="declaration_details">
    <a-tabs :activeKey="activeKey" @change="callback">
      <a-tab-pane tab="基础信息" key="1">
        <span class="label_style">报审单编号：</span>
        <span>{{smg.purchaseNo}}</span>
        <br />
        <br />
        <span class="label_style">标题：</span>
        <span>{{smg.title}}</span>
        <br />
        <br />
        <span class="label_style">拟制：</span>
        <span>{{smg.production}}</span>
        <br />
        <br />
        <span class="label_style">填报日期：</span>
        <span>{{smg.gmtDelivery}}</span>
        <br />
        <br />
        <span class="label_style">备注：</span>
        <pre
          style="word-wrap:break-word;display:inline-block;vertical-align: top;font-family: 'Chinese Quote'"
        >{{smg.remark}}</pre>
      </a-tab-pane>
      <a-tab-pane tab="采购报审明细" key="2" forceRender>
        <a-table
          class="table_1"
          :scroll="{ x: 2710,y:320}"
          size="small"
          rowKey="id"
          :columns="columns"
          :pagination="false"
          :dataSource="data"
        ></a-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
const columns = [
  {
    title: "项目订单编号",
    key: "workOrderNo",
    dataIndex: "workOrderNo",
    width: 150
  },
  {
    title: "图号",
    key: "drawingNo",
    dataIndex: "drawingNo",
    width: 150
  },
  {
    title: "名称",
    key: "name",
    dataIndex: "name",
    width: 150
  },
  {
    title: "需求数量",
    key: "number",
    dataIndex: "number",
    width: 80
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
    width: 80
  },
  {
    title: "采购名称",
    key: "shopName",
    dataIndex: "shopName",
    width: 120,
    scopedSlots: { customRender: "shopName" }
  },
  {
    title: "订单数量",
    key: "orderNumber",
    dataIndex: "orderNumber",
    width: 80,
    scopedSlots: { customRender: "orderNumber" },
    slots: { title: "dingdanshuliangTitle" }
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
    scopedSlots: { customRender: "delivery" }
  },
  {
    title: "第1供应商",
    key: "firstSupplier",
    dataIndex: "firstSupplier",
    width: 150,
    slots: { title: "diyigongyingshangTitle" },
    scopedSlots: { customRender: "firstSupplierId" }
  },
  {
    title: "第1报价(元)",
    key: "firstOffer",
    dataIndex: "firstOffer",
    width: 100,
    slots: { title: "diyibaojiaTitle" },
    scopedSlots: { customRender: "firstOffer" }
  },
  {
    title: "第2供应商",
    key: "secondSupplier",
    dataIndex: "secondSupplier",
    width: 150,
    scopedSlots: { customRender: "secondSupplierId" }
  },
  {
    title: "第2报价(元)",
    key: "secondOffer",
    dataIndex: "secondOffer",
    width: 100,
    scopedSlots: { customRender: "secondOffer" }
  },
  {
    title: "第3供应商",
    key: "thirdSupplier",
    dataIndex: "thirdSupplier",
    width: 150,
    scopedSlots: { customRender: "thirdSupplierId" }
  },
  {
    title: "第3报价(元)",
    key: "thirdOffer",
    dataIndex: "thirdOffer",
    width: 100,
    scopedSlots: { customRender: "thirdOffer" }
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
    title: "小计",
    key: "total",
    dataIndex: "total",
    width: 80
  }
];
export default {
  props: {
    rowId: {
      default: ""
    }
  },
  data() {
    return {
      columns,
      data: [],
      smg: {},
      activeKey: "1"
    };
  },
  methods: {
    callback(key) {
      this.activeKey = key;
    },
    findOne(id) {
      this.Axios(
        {
          url: "/api-order/purchase/findone",
          type: "get",
          params: {
            id: id
          },
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.smg = result.data.data;
            this.data = result.data.data.purchaseDesDOList;
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.findOne(this.rowId);
  },
  watch: {
    rowId() {
      this.findOne(this.rowId);
    }
  }
};
</script>
<style lang="less">
.declaration_details {
  .label_style {
    display: inline-block;
    width: 120px;
    text-align: right;
  }
  .table_1 {
    .ant-table-body {
      min-height: 320px;
      max-height: 320px;
    }
    .ant-table-placeholder {
      position: relative;
      top: -190px;
    }
  }
}
</style>