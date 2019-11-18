<template>
  <div class="declaration_edit">
    <a-form :form="form">
      <a-tabs :activeKey="activeKey" @change="callback">
        <a-tab-pane tab="基础信息" key="1">
          <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="报审单编号">
            <a-input
              disabled
              v-decorator="[
							'purchaseNo',
							{rules: [{ required: true, message: '请填写报审单编号' }]}
							]"
            ></a-input>
          </a-form-item>
          <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="标题">
            <a-input
              autocomplete="off"
              v-decorator="[
							'title',
							{rules: [{ required: true, message: '请填写标题' }]}
							]"
            ></a-input>
          </a-form-item>
          <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="拟制">
            <a-input v-decorator="['production']" disabled></a-input>
          </a-form-item>
          <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="填报日期">
            <a-date-picker
              v-decorator="['gmtDelivery']"
              @change="onChangeDate"
              format="YYYY/MM/DD"
              style="width:100%;"
            />
          </a-form-item>
          <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="备注">
            <a-textarea
              v-decorator="['remark']"
              :autosize="{ minRows: 4, maxRows: 4 }"
              maxlength="200"
            ></a-textarea>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane tab="采购报审明细" key="2" forceRender>
          <div>已询价的明细：</div>
          <a-table
            class="table_1"
            :scroll="{ x: 2710,y:320}"
            size="small"
            rowKey="id"
            :columns="columns"
            :pagination="false"
            :dataSource="data"
            :rowSelection="{selectedRowKeys:selectedRowKeysLeft,onChange: (a,b)=>onSelectChange(a,b,1)}"
          ></a-table>
          <a-col :span="24" style="overflow:hidden;padding:7px 0;">
            <span style="font-size:14px;">已选择：{{selectedRowsRight.length}}</span>
            <span>
              <a-button size="small" @click="delSelect">删除已选</a-button>
              <a-button size="small" @click="delAll">清空全部</a-button>
            </span>
          </a-col>
          <a-col :span="24" style="padding-bottom:20px;">
            <a-table
              class="table_2"
              :scroll="{ x: 2710,y:320}"
              size="small"
              rowKey="id"
              :columns="columns"
              :pagination="false"
              :dataSource="selectedRowsRight"
              :rowSelection="{selectedRowKeys:selectedRowKeysRight,onChange:  (a,b)=>onSelectChange(a,b,2)}"
            ></a-table>
          </a-col>
        </a-tab-pane>
      </a-tabs>
      <a-form-item style="display:block;text-align:right;">
        <a-button style="margin-right:12px;" @click="quxiao">取消</a-button>
        <a-button type="primary" @click="toSave">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import moment from "moment";
let columns = [
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
      pagination: {},
      activeKey: "1",
      form: this.$form.createForm(this),
      dateValue: "",
      selectedRowKeysLeft: [],
      selectedRowKeysRight: [],
      selectedRows: [],
      selectedRowsRight: [],
      columns,
      data: [],
      dataRight: []
    };
  },
  methods: {
    moment,
    quxiao() {
      // this.form.resetFields();
      // this.selectedRowKeysRight = [];
      // this.selectedRowsRight = [];
      // this.selectedRows = [];
      // this.selectedRowKeysLeft = [];
      // this.dateValue = "";
      // setTimeout(() => {
      // 	this.form.setFieldsValue({
      // 		person: JSON.parse(sessionStorage.getItem("user")).userName
      // 	});
      // }, 100);
      this.activeKey = "1";
      this.$emit("addModal", 1);
      // this.getList1();
      this.findOne(this.rowId);
      // this.getNum();
    },
    onSelectChange(a, b, c) {
      if (c == 1) {
        this.selectedRowKeysLeft = a;
        this.selectedRows = b;
        let arr = new Array();
        arr = [...this.selectedRowsRight];
        this.selectedRowsRight = [];
        arr = arr.concat(b);
        arr = Array.from(new Set(arr));
        if (this.selectedRowKeysLeft.length < 1) {
          this.selectedRowsRight = [];
        } else {
          for (let i = 0; i < this.selectedRowKeysLeft.length; i++) {
            this.selectedRowsRight.push(
              arr.find(item => {
                return item.id == this.selectedRowKeysLeft[i];
              })
            );
          }
        }
      }
      if (c == 2) {
        this.selectedRowKeysRight = a;
      }
    },
    delAll() {
      this.selectedRowKeysRight = [];
      this.selectedRows = [];
      this.selectedRowKeysLeft = [];
      this.selectedRowsRight = [];
    },
    delSelect() {
      for (let i = 0; i < this.selectedRowKeysRight.length; i++) {
        this.selectedRowsRight = this.selectedRowsRight.filter(item => {
          return item.id != this.selectedRowKeysRight[i];
        });
        this.selectedRowKeysLeft = this.selectedRowKeysLeft.filter(item => {
          return item != this.selectedRowKeysRight[i];
        });
      }
      this.selectedRowKeysRight = [];
    },
    callback(key) {
      this.activeKey = key;
    },
    onChangeDate(a, b) {
      this.dateValue = b;
    },
    getList1() {
      this.Axios(
        {
          url: "/api-order/purchase/offerList",
          type: "get",
          params: {
            page: 1,
            size: -1,
            id: this.rowId
          },
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.data = result.data.data;
          }
        },
        ({ type, info }) => {}
      );
    },
    getNum() {
      this.Axios(
        {
          url: "/api-order/supplier/getNo",
          type: "get",
          params: {
            num: "BSD"
          },
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            // this.data = result.data.data;
            setTimeout(() => {
              this.form.setFieldsValue({
                purchaseNo: result.data.data
              });
            }, 100);
          }
        },
        ({ type, info }) => {}
      );
    },
    toSave() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.selectedRowsRight.length < 1) {
            this.$message.error(`请选择采购报审单明细`);
          } else {
            let data = {
              gmtDelivery: this.dateValue,
              purchaseNo: values.purchaseNo,
              remark: values.remark,
              title: values.title,
              id: this.rowId,
              purchaseDesDTOList: this.selectedRowsRight.map(item => {
                return {
                  id: item.id
                };
              })
            };
            this.Axios(
              {
                url: "/api-order/purchase/update",
                params: data,
                type: "post",
                option: { successMsg: "修改成功！" },
                config: {
                  headers: { "Content-Type": "application/json" }
                }
              },
              this
            ).then(
              result => {
                if (result.data.code === 200) {
                  console.log(result);
                  this.form.resetFields();
                  this.selectedRowKeysRight = [];
                  this.selectedRowsRight = [];
                  this.selectedRows = [];
                  this.selectedRowKeysLeft = [];
                  this.dateValue = "";
                  // setTimeout(() => {
                  // 	this.form.setFieldsValue({
                  // 		person: JSON.parse(sessionStorage.getItem("user")).userName
                  // 	});
                  // }, 100);
                  this.activeKey = "1";
                  this.$emit("addModal", 2);
                }
              },
              ({ type, info }) => {}
            );
          }
        }
      });
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
            this.selectedRowsRight = result.data.data.purchaseDesDOList;
            this.selectedRowKeysLeft = result.data.data.purchaseDesDOList.map(
              item => {
                return item.id;
              }
            );
            // this.data = result.data.data;
            this.dateValue = result.data.data.gmtDelivery;
            setTimeout(() => {
              this.form.setFieldsValue({
                purchaseNo: result.data.data.purchaseNo,
                remark: result.data.data.remark,
                gmtDelivery:
                  result.data.data.gmtDelivery != "" &&
                  result.data.data.gmtDelivery != null
                    ? moment(result.data.data.gmtDelivery, "YYYY/MM/DD")
                    : undefined,
                title: result.data.data.title,
                production: result.data.data.production
              });
            }, 100);
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.getList1();
    this.findOne(this.rowId);
    // this.getNum();
    // setTimeout(() => {
    // 	this.form.setFieldsValue({
    // 		person: JSON.parse(sessionStorage.getItem("user")).userName
    // 	});
    // }, 100);
  },
  watch: {
    rowId() {
      if (this.rowId != "" && this.rowId != null) {
        this.findOne(this.rowId);
        this.getList1();
      }
    }
  }
};
</script>
<style lang="less">
.declaration_edit {
  .ant-table-small
    > .ant-table-content
    > .ant-table-scroll
    > .ant-table-header
    > table
    > .ant-table-thead
    > tr
    > th,
  .ant-table-small
    > .ant-table-content
    > .ant-table-scroll
    > .ant-table-body
    > table
    > .ant-table-tbody
    > tr
    > td {
    padding: 4px 4px;
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
  .table_2 {
    position: relative;
    .ant-table-body {
      min-height: 320px;
      max-height: 320px;
    }
    .ant-table-placeholder {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -44px;
      margin-top: -27px;
    }
  }
}
</style>