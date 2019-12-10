<template>
    <div class="details">
        <a-row>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">单据类型：</span>
                <span>退料入库</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">单据编号：</span>
                <span>{{detailsMsg.orderCode}}</span>
            </a-col>
             <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">原始单据号：</span>
                <span>{{detailsMsg.oldOrderCode}}</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">退料部门：</span>
                <span>{{detailsMsg.fromName}}</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">退回仓库：</span>
                <span>{{warehouseName}}</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">入库日期：</span>
                <span>{{detailsMsg.gmtCreated}}</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">经办人：</span>
                <span>{{detailsMsg.handlerName}}</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">制单人：</span>
                <span>{{detailsMsg.preparedName}}</span>
            </a-col>
            <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">备注：</span>
                <span>{{detailsMsg.note}}</span>
            </a-col>
        </a-row>
        <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id">
          <template slot="index" slot-scope="text, record, index">
                <span>{{index+1}}</span>
          </template>
        </a-table>
    </div>
</template>
<script>
const columns = [
  {
    dataIndex: "index",
    key: "index",
    title: "",
    width: 40,
    scopedSlots: { customRender: "index" },
    align: "center"
  },
//   {
//     dataIndex: "xuanzewuliao",
//     key: "xuanzewuliao",
//     title: "选择物料",
//     width: 80,
//     scopedSlots: { customRender: "xuanzewuliao" }
//   },
  {
    dataIndex: "code",
    key: "code",
    title: "物料编码",
    width: 120
  },
  {
    dataIndex: "drawingNo",
    key: "drawingNo",
    title: "图号",
    width: 140
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
    width: 140
  },
  {
    dataIndex: "unit",
    key: "unit",
    title: "单位",
    width: 80
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
    // title: "数量",
    width: 120,
    scopedSlots: { customRender: "number" },
    slots: { title: "numberTitle" }
  },
  {
    dataIndex: "classification.name",
    key: "classification.name",
    title: "物料分类",
    width: 100
  },
  {
    dataIndex: "note",
    key: "note",
    title: "备注",
    width: 160,
    scopedSlots: { customRender: "note" }
  }
];
export default {
    props: {
      sendId: {
        default: ""
      }
    },
    data() {
        return {
            columns,
            data: [],
            detailsMsg: [],
            warehouseName: ''
        }
    },
   methods: {
    findOne(id) {
      this.Axios(
        {
          url: "/api-warehouse/order/findOne",
          params: {
            orderId: id
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.detailsMsg = result.data.data;
            this.data = result.data.data.orderItems;
            this.warehouseName = result.data.data.warehouse.name;
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.findOne(this.sendId);
  }
}
</script>
<style lang="less">
.details {
    .label_right {
        display: inline-block;
        width: 100px;
        text-align: right;
    }
}
</style>