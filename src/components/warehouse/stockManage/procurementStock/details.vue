<template>
  <div class="details">
    <a-row class="detailsMsg">
      <a-col :span="12">
        <span class="label_right">单据编号：</span>
        <span>{{detailsMsg.orderCode}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_right">收货仓库：</span>
        <span>{{warehouseName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_right">供应商：</span>
        <span>{{detailsMsg.fromName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_right">开单日期：</span>
        <span>{{detailsMsg.gmtCreated}}</span>
      </a-col>
    </a-row>
    <!-- <a-row style="line-height:50px;">
      <permission-button permCode banType="hide" type="primary">批量入库</permission-button>
    </a-row>-->
    <a-row>
      <a-table
        :scroll="{ x: 1200,y:500}"
        rowKey="id"
        class="table_style"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
      >
      <!-- <template slot="code" slot-scope="text, record">
          <div class="codeMsg">{{text}}</div>
      </template> -->
      <template slot="index" slot-scope="text, record, index">
                <span>{{index+1}}</span>
      </template>
      </a-table>
    </a-row>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "index",
    key: "index",
    title: "",
    width: 20,
    scopedSlots: { customRender: "index" },
    align: "center"
  },
  {
    title: "物料编码",
    key: "code",
    dataIndex: "code",
    scopedSlots: { customRender: "code" },
    width: 250
  },
  {
    title: "名称",
    key: "name",
    dataIndex: "name",
    width: 200
  },
  {
    title: "型号/规格",
    key: "specification",
    dataIndex: "specification",
    width: 200
  },
  {
    title: "单位",
    key: "unit",
    dataIndex: "unit",
    width: 50
  },
  {
    title: "总数量",
    key: "orderAmount",
    dataIndex: "orderAmount",
    width: 50
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
  // {
  //   title: "库存单位",
  //   key: "warehouseUnit",
  //   dataIndex: "warehouseUnit",
  //   width: 80,
  //   scopedSlots: { customRender: "warehouseUnit" }
  // },
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
    sendId: {
      default: ""
    }
  },
  data() {
    return {
      columns,
      data: [],
      unitArr: [],
      placeArr: [],
      categoryArr: [],
      detailsMsg: [],
      treeData: [],
      warehouseName: ""
    };
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
  },
  watch: {
    sendId() {
      this.findOne(this.sendId);
    }
  }
};
</script>
<style lang="less">
.details {
  .detailsMsg {
    margin-bottom: 10px;
  }
  .label_right {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  .table_style {
    .ant-table-body {
      min-height: 500px;
      max-height: 500px;
    }
  }
  .codeMsg {
    width: 200px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td
  {
    padding: 8px 2px;
  }
}
</style>