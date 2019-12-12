<template>
  <div class="out_details">
    <a-col :span="24" class="case" v-if="detalisMsg.outType=='RECEIVE'">
      <a-col :span="12">
        <span class="label_case">单据编号：</span>
        <span>{{detalisMsg.code}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">出货仓库：</span>
        <span>{{detalisMsg.warehouse.name}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">领料部门：</span>
        <span>{{detalisMsg.goName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">出库日期：</span>
        <span>{{detalisMsg.outDate}}</span>
      </a-col>
    </a-col>
    <a-col :span="24" class="case" v-if="detalisMsg.outType=='SALES'">
      <a-col :span="12">
        <span class="label_case">单据编号：</span>
        <span>{{detalisMsg.code}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">出货仓库：</span>
        <span>{{detalisMsg.warehouse.name}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">客户名称：</span>
        <span>{{detalisMsg.goName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">出库日期：</span>
        <span>{{detalisMsg.outDate}}</span>
      </a-col>
    </a-col>
    <a-col :span="24" class="case" v-if="detalisMsg.outType=='RETURN'">
      <a-col :span="12">
        <span class="label_case">单据编号：</span>
        <span>{{detalisMsg.code}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">出货仓库：</span>
        <span>{{detalisMsg.warehouse.name}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">供应商：</span>
        <span>{{detalisMsg.goName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">出库日期：</span>
        <span>{{detalisMsg.outDate}}</span>
      </a-col>
    </a-col>
    <a-col :span="24" class="case" v-if="detalisMsg.outType=='OTHER'">
      <a-col :span="12">
        <span class="label_case">单据编号：</span>
        <span>{{detalisMsg.code}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">出货仓库：</span>
        <span>{{detalisMsg.warehouse.name}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">单位：</span>
        <span>{{detalisMsg.goName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">出库日期：</span>
        <span>{{detalisMsg.outDate}}</span>
      </a-col>
    </a-col>
    <a-col :span="24">
      <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id"></a-table>
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
      data: []
    };
  },
  methods: {
    findOne() {
      this.Axios(
        {
          url: "/api-warehouse/outOrder/findOne/" + this.id,
          params: {},
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            let OneMsg = { ...result.data.data };
            this.data = OneMsg.orderItems.map(item => {
              return {
                number: item.amount,
                remark: item.note,
                drawingCode: item.warehouseItem.drawingCode,
                code: item.warehouseItem.code,
                name: item.warehouseItem.name,
                id: item.warehouseItem.id,
                specification: item.warehouseItem.specification,
                unit: item.warehouseItem.unit,
                amount: item.warehouseItem.amount,
                classifiName: item.warehouseItem.classification.name
              };
            });
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
.out_details {
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