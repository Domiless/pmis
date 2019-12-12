<template>
  <div class="put_in_details">
    <a-col :span="24" class="case" v-if="detalisMsg.dataSource=='PURCHASING'">
      <a-col :span="12">
        <span class="label_case">单据编号：</span>
        <span>{{detalisMsg.orderCode}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">收货仓库：</span>
        <span>{{detalisMsg.warehouse.name}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">供应商：</span>
        <span>{{detalisMsg.fromName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">开单日期：</span>
        <span>{{detalisMsg.date}}</span>
      </a-col>
    </a-col>
    <a-col :span="24" class="case" v-if="detalisMsg.dataSource=='PRODUCE'">
      <a-col :span="12">
        <span class="label_case">单据编号：</span>
        <span>{{detalisMsg.orderCode}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">收货仓库：</span>
        <span>{{detalisMsg.warehouse.name}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">生产部门：</span>
        <span>{{detalisMsg.fromName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">开单日期：</span>
        <span>{{detalisMsg.date}}</span>
      </a-col>
    </a-col>
    <a-col :span="24" class="case" v-if="detalisMsg.dataSource=='RETURN'">
      <a-col :span="12">
        <span class="label_case">单据编号：</span>
        <span>{{detalisMsg.orderCode}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">收货仓库：</span>
        <span>{{detalisMsg.warehouse.name}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">退料部门：</span>
        <span>{{detalisMsg.fromName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">开单日期：</span>
        <span>{{detalisMsg.date}}</span>
      </a-col>
    </a-col>
    <a-col :span="24" class="case" v-if="detalisMsg.dataSource=='OTHER'">
      <a-col :span="12">
        <span class="label_case">单据编号：</span>
        <span>{{detalisMsg.orderCode}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">收货仓库：</span>
        <span>{{detalisMsg.warehouse.name}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">物料来源：</span>
        <span>{{detalisMsg.fromName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">开单日期：</span>
        <span>{{detalisMsg.date}}</span>
      </a-col>
    </a-col>
    <a-col :span="24">
      <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id"></a-table>
      <a-table :columns="columns1" :pagination="false" :dataSource="data" rowKey="id"></a-table>
    </a-col>
  </div>
</template>
<script>
const columns = [
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
    width: 180
  },
  {
    dataIndex: "name",
    key: "name",
    title: "名称",
    width: 180
  },
  {
    dataIndex: "specification",
    key: "specification",
    title: "型号/规格",
    width: 140
  },
  {
    dataIndex: "unit",
    key: "unit",
    title: "单位",
    width: 80
  },
  //   {
  //     dataIndex: "amount",
  //     key: "amount",
  //     title: "库存数量",
  //     width: 100
  //   },
  {
    dataIndex: "number",
    key: "number",
    title: "数量",
    width: 100
  },
  {
    dataIndex: "classifiName",
    key: "classifiName",
    title: "物料分类",
    width: 100
  },
  {
    dataIndex: "remark",
    key: "remark",
    title: "备注",
    width: 200,
    scopedSlots: { customRender: "beizhu" }
  }
];
const columns1 = [
  {
    title: "物料编码",
    key: "code",
    dataIndex: "code",
    scopedSlots: { customRender: "code" },
    width: 200
  },
  {
    title: "名称",
    key: "name",
    dataIndex: "name",
    width: 150
  },
  {
    title: "型号/规格",
    key: "specification",
    dataIndex: "specification",
    width: 150
  },
  {
    title: "单位",
    key: "unit",
    dataIndex: "unit",
    width: 150
  },
  {
    title: "总数量",
    key: "orderAmount",
    dataIndex: "orderAmount",
    width: 150
  },
  {
    title: "已入",
    key: "inStorage",
    dataIndex: "inStorage",
    width: 80
  },
  {
    title: "待入",
    key: "outStorage",
    dataIndex: "outStorage",
    width: 80
  },
  {
    title: "入库数量",
    key: "stockNumber",
    dataIndex: "stockNumber",
    width: 80,
    scopedSlots: { customRender: "stockNumber" }
  },
  {
    title: "库存单位",
    key: "warehouseUnit",
    dataIndex: "warehouseUnit",
    width: 80,
    scopedSlots: { customRender: "warehouseUnit" }
  },
  {
    title: "分类",
    key: "category",
    dataIndex: "category",
    width: 100,
    scopedSlots: { customRender: "category" }
  },
  {
    title: "批次",
    key: "batch",
    dataIndex: "batch",
    width: 80,
    scopedSlots: { customRender: "batch" }
  },
  {
    title: "备注",
    key: "note",
    dataIndex: "note",
    width: 140,
    scopedSlots: { customRender: "note" }
  }
];
export default {
  props: {
    id: {
      default: null
    }
  },
  data() {
    return {
      detalisMsg: {},
      columns,
      columns1,
      data: []
    };
  },
  methods: {
    findOne() {
      this.Axios(
        {
          url: "/api-warehouse/order/findOne?orderId=" + this.id,
          params: {},
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result.data.data);

            let OneMsg = { ...result.data.data };
            this.data = OneMsg.orderItems;
            this.detalisMsg = OneMsg;
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.findOne();
  }
};
</script>
<style lang="less">
.put_in_details {
  overflow: hidden;
  .label_case {
    display: inline-block;
    width: 120px;
    text-align: right;
  }
  .case {
    span {
      padding: 8px 0;
    }
  }
}
</style>