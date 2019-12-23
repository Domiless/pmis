<template>
  <div class="picking_details">
    <a-col :span="24" class="case">
      <a-col :span="12">
        <span class="label_case">单据类型：</span>
        <span>
          {{oneMsg.outType== "RECEIVE"
          ? "领料出库"
          : oneMsg.outType == "SALES"
          ? "销售出库"
          : oneMsg.outType == "RETURN"
          ? "退货出库"
          : "其他出库"}}
        </span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">单据编号：</span>
        <span>{{oneMsg.code}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">原始单据号：</span>
        <span>{{oneMsg.goCode}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">供应商：</span>
        <span>{{oneMsg.goName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">出货仓库：</span>
        <span>{{oneMsg.warehouse.name}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">出货日期：</span>
        <span>{{oneMsg.outDate}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">经办人：</span>
        <span>{{oneMsg.handlerName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_case">制单人：</span>
        <span>{{oneMsg.preparedName}}</span>
      </a-col>
      <a-col :span="24">
        <span class="label_case">备注：</span>
        <pre
          style="display:inline-block;vertical-align: top;word-wrap:break-word;width:1100px;padding:8px 0;"
        >{{oneMsg.note}}</pre>
      </a-col>
      <a-col :span="24">
        <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id"></a-table>
      </a-col>
    </a-col>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "index",
    key: "index",
    title: "",
    width: 40,
    scopedSlots: { customRender: "xuhao" },
    align: "center"
  },
  // {
  //   dataIndex: "xuanzewuliao",
  //   key: "xuanzewuliao",
  //   title: "选择物料",
  //   width: 80,
  //   scopedSlots: { customRender: "xuanzewuliao" }
  // },
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
  {
    dataIndex: "warehouseName",
    key: "warehouseName",
    title: "仓库",
    width: 100
  },
  {
    dataIndex: "amount",
    key: "amount",
    title: "库存数量",
    width: 100
  },
  {
    dataIndex: "number",
    key: "number",
    title: "数量",
    width: 120,
    scopedSlots: { customRender: "shuliang" },
    slots: { title: "shuliangTitle" }
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
      oneMsg: {
        warehouse: {}
      },
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
            this.oneMsg = { ...result.data.data };
            console.log(this.oneMsg);
            this.data = this.oneMsg.orderItems.map(item => {
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
                classifiName: item.warehouseItem.classification.name,
                warehouseName: item.warehouseItem.warehouse.name
              };
            });
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
.picking_details {
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