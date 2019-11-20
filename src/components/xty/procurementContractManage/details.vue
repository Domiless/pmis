<template>
  <div class="details">
    <a-tabs  :activeKey="activeKey" @change="callback">
      <a-tab-pane tab="基础信息" key="1">
        <a-row>
          <!-- <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">采购单号：</span>
          <span>{{contractDetails.purchaseNo}}</span>
          </a-col>-->
          <a-col :span="24" style="margin-bottom:12px;">
            <span class="label_right">供应商：</span>
            <span>{{contractDetails.supplier}}</span>
          </a-col>
          <a-col :span="24" style="margin-bottom:12px;">
            <span class="label_right">合同编号：</span>
            <span>{{contractDetails.shopContractNo}}</span>
          </a-col>
          <a-col :span="24" style="margin-bottom:12px;">
            <span class="label_right">合同模板：</span>
            <span>{{contractDetails.model}}</span>
          </a-col>
          <a-col :span="24" style="margin-bottom:12px;">
            <span class="label_right">供方：</span>
            <span>{{contractDetails.supplierName}}</span>
          </a-col>
          <a-col :span="24" style="margin-bottom:12px;">
            <span class="label_right">需方：</span>
            <span>{{contractDetails.demand}}</span>
          </a-col>
          <a-col :span="24" style="margin-bottom:12px;">
            <span class="label_right">业务员：</span>
            <span>{{contractDetails.salesman}}</span>
          </a-col>
          <a-col :span="24" style="margin-bottom:12px;">
            <span class="label_right">税率：</span>
            <span>{{contractDetails.taxrate}}</span>
          </a-col>
          <!-- <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">总金额：</span>
          <span>{{contractDetails.summoney}}</span>
        </a-col>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">金额大写：</span>
          <span>{{contractDetails.chineseMoney}}</span>
          </a-col>-->

          <a-col :span="24" style="margin-bottom:12px;">
            <span class="label_right">签订地点：</span>
            <span>{{contractDetails.place}}</span>
          </a-col>
          <a-col :span="24" style="margin-bottom:12px;">
            <span class="label_right">签订日期：</span>
            <span>{{contractDetails.digndate}}</span>
          </a-col>
          <a-col :span="24" style="margin-bottom:12px;">
            <span class="label_right">合同有效期：</span>
            <span>{{contractDetails.validity}}</span>
          </a-col>
          <a-col :span="24" style="margin-bottom:12px;">
            <span class="label_right">供货方式：</span>
            <span>{{contractDetails.sendway}}</span>
          </a-col>
          <a-col :span="24" style="margin-bottom:12px;">
            <span class="label_right">备注：</span>
            <span>{{contractDetails.remark}}</span>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane tab="采购明细" key="2" style="margin-bottom: 20px">
        <!-- <a-table rowKey="id" :columns="columns2" :dataSource="data2" :scroll="{ x: 1900, y: 500 }" :pagination="true"/> -->
        <a-table
          class="table_1"
          :scroll="{ x: 2710,y:320}"
          size="small"
          rowKey="id"
          :columns="columns2"
          :pagination="false"
          :dataSource="data2"
        ></a-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
const columns2 = [
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
    },
    defaultActiveKey: {
      default: "1"
    }
  },
  data() {
    return {
        columns2,
				data2: [],
				contractDetails: {},
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
          url: "/api-order/shopContract/findone",
          params: {
            id: id
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.contractDetails = result.data.data;
            this.data2 = result.data.data.purchaseDesDOList;
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.findOne(this.rowId);
    this.activeKey = this.defaultActiveKey;
  },
  watch: {
	rowId() {
		this.findOne(this.rowId);
	}
  }
};
</script>
<style lang="less">
.details {
    .label_right{
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