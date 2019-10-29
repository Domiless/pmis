<template>
  <div class="addProcurement">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="基础信息" key="1">
        <a-form :form="form">
          <a-row>
            <a-form-item label="项目订单" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select
                v-decorator="['workOrderNo', { rules: [{ required:'true', message: '请选择项目订单'}]}]"
                placeholder="请选择"
                showSearch
                @change="sendOrderId"
              >
                <a-select-option v-for="item in ProjectId" :key="item.no">{{ item.no }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="设计单号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select
              labelInValue
                mode="multiple"
                v-decorator="['bomIdS', { rules: [{ required:'true', message: '请选择设计单号'}]}]"
                placeholder="请选择"
                @change="sendId"
              >
                <a-select-option v-for="item in idArr" :key="item.bomNo" :value="item.id">{{ item.bomNo }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="采购单号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input
                v-decorator="['procurementNo', { rules: [{ required:'true', message: '请填写采购单号'}]}]"
              ></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="备注" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['remark']"></a-input>
            </a-form-item>
          </a-row>
        </a-form>
      </a-tab-pane>
      <a-tab-pane tab="采购明细" key="2" style="margin-bottom: 20px">
        <a-table
          rowKey="id"
          :columns="columns"
          :dataSource="data"
          :pagination="true"
          :scroll="{ x: 1600, y: 500 }"
        >
          <span slot="orderNumTitle">
            <span style="color: #f5222d">*</span>订单数量
          </span>
          <span slot="orderUnitTitle">
            <span style="color: #f5222d">*</span>订单单位
          </span>
          <span slot="deliveryDateTitle">
            <span style="color: #f5222d">*</span>交货日期
          </span>
          <span slot="unitPriceTitle">
            <span style="color: #f5222d">*</span>单价
          </span>
          <span slot="taxrateTitle">
            <span style="color: #f5222d">*</span>税率
          </span>
          <span slot="supplierTitle">
            <span style="color: #f5222d">*</span>供应商
          </span>
          <span slot="priceUnitTitle">
            <span style="color: #f5222d">*</span>价格单位
          </span>
          <span slot="moneyTypeTitle">
            <span style="color: #f5222d">*</span>货币类型
          </span>
          <template slot="orderNum" slot-scope="text,record">
            <div key="orderNum">
              <a-input
                maxlength="20"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChangeTable(e.target.value, record.id, 'orderNum')"
              />
            </div>
          </template>
          <template slot="orderUnit" slot-scope="text,record">
            <a-select
              style="width: 100%"
              @change="(value,option) => {
                  let value1 = value;
                  handleChangeTable(value1, record.id, 'orderUnit')
                  }"
            >
              <a-select-option
                v-for="item in unitArr"
                :value="item.name"
                :key="item.id"
              >{{ item.name }}</a-select-option>
            </a-select>
          </template>
          <template slot="deliveryDate" slot-scope="text,record,index">
            <a-date-picker
              @change="(date,dateString) => {
                                      let delivery = dateString;
                                      handleChangeTable(delivery,record.id,'deliveryDate');}"
              format="YYYY/MM/DD"
              placeholder="请选择"
            />
          </template>
          <template slot="unitPrice" slot-scope="text,record">
            <div key="unitPrice">
              <a-input
                maxlength="20"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChangeTable(e.target.value, record.id, 'unitPrice')"
              />
            </div>
          </template>
          <template slot="taxrate" slot-scope="text,record">
            <div key="taxrate">
              <a-input
                maxlength="20"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChangeTable(e.target.value, record.id, 'taxrate')"
              />
            </div>
          </template>
          <template slot="supplier" slot-scope="text,record">
            <a-select
              style="width: 100%"
              @change="(value,option) => {
                  let value1 = value;
                  handleChangeTable(value1, record.id, 'supplier')
                  }"
            >
              <a-select-option
                v-for="item in supplierArr"
                :value="item.supplierName"
                :key="item.supplierNo"
              >{{ item.supplierName }}</a-select-option>
            </a-select>
          </template>
          <template slot="priceUnit" slot-scope="text,record">
            <a-select
              style="width: 100%"
              @change="(value,option) => {
                  let value1 = value;
                  handleChangeTable(value1, record.id, 'priceUnit')
                  }"
            >
              <a-select-option
                v-for="item in priceArr"
                :value="'1'+item.name"
                :key="item.id"
              >1{{ item.name }}</a-select-option>
            </a-select>
          </template>
          <template slot="moneyType" slot-scope="text,record">
            <div key="moneyType">
              <a-input
                maxlength="20"
                style="margin: -5px 0"
                
                :value="text"
                @change="e => handleChangeTable(e.target.value, record.id, 'moneyType')"
              />
            </div>
          </template>
          <template slot="remark" slot-scope="text,record">
            <div key="remark">
              <a-input
                maxlength="20"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChangeTable(e.target.value, record.id, 'remark')"
              />
            </div>
          </template>
          <template slot="summation" slot-scope="text">
            <span>{{text}}</span>
          </template>
        </a-table>
        <div style="position: relative">
          <div style="position: absolute; top: -45px;font-size: 16px">
            <span>合计：{{totalMoney}}</span>
            <!-- <span style="margin-left: 885px">共 {{total}} 条</span> -->
          </div>
        </div>
        <!-- <a-col :span="12" style="padding-top: 12px; height: 36px;">
          <span style="line-height: 12px">合计：</span>
        </a-col> -->
        <!-- <a-col :span="12">
          <a-pagination
            style="padding-top:12px;text-align: right;"
            size="small"
            :defaultCurrent="current"
            :total="total"
            @change="onChange"
            @showSizeChange="onShowSizeChange"
            showQuickJumper
            showSizeChanger
            :pageSizeOptions="['10','20','50','100']"
            :showTotal="total => `共 ${total} 条`"
          ></a-pagination> -->
        <!-- </a-col> -->
      </a-tab-pane>
    </a-tabs>
    <a-row>
      <a-form-item :wrapper-col="{ span: 22,offset: 2 }" style="text-align:right">
        <a-button style="margin-right:12px;" @click="close">关闭</a-button>
        <a-button type="primary" @click="addProcurement">提交</a-button>
      </a-form-item>
    </a-row>
  </div>
</template>
<script>
import { stringify } from "querystring";
const columns = [
  {
    dataIndex: "drawingNo",
    title: "图号",
    key: "drawingNo",
    width: 100
  },
  {
    dataIndex: "name",
    title: "名称",
    key: "name",
    width: 100
  },
  {
    dataIndex: "number",
    title: "需求数量",
    key: "number",
    width: 100
  },
  {
    dataIndex: "brand",
    title: "指定品牌",
    key: "brand",
    width: 100
  },
  {
    dataIndex: "designer",
    title: "设计师",
    key: "designer",
    width: 100
  },
  {
    dataIndex: "orderNum",
    // title: "订单数量",
    key: "orderNum",
    slots: { title: "orderNumTitle" },
    scopedSlots: { customRender: "orderNum" },
    width: 100
  },
  {
    dataIndex: "orderUnit",
    // title: "订单单位",
    key: "orderUnit",
    slots: { title: "orderUnitTitle" },
    scopedSlots: { customRender: "orderUnit" },
    width: 100
  },
  {
    dataIndex: "deliveryDate",
    // title: "交货日期",
    key: "deliveryDate",
    slots: { title: "deliveryDateTitle" },
    scopedSlots: { customRender: "deliveryDate" },
    width: 120
  },
  {
    dataIndex: "unitPrice",
    // title: "单价",
    key: "unitPrice",
    slots: { title: "unitPriceTitle" },
    scopedSlots: { customRender: "unitPrice" },
    width: 100
  },
  {
    dataIndex: "taxrate",
    // title: "税率",
    key: "taxrate",
    slots: { title: "taxrateTitle" },
    scopedSlots: { customRender: "taxrate" },
    width: 100
  },
  {
    dataIndex: "supplier",
    // title: "供应商",
    key: "supplier",
    slots: { title: "supplierTitle" },
    scopedSlots: { customRender: "supplier" },
    width: 120
  },
  {
    dataIndex: "priceUnit",
    // title: "价格单位",
    key: "priceUnit",
    slots: { title: "priceUnitTitle" },
    scopedSlots: { customRender: "priceUnit" },
    width: 100
  },
  {
    dataIndex: "moneyType",
    // title: "货币类型",
    key: "moneyType",
    slots: { title: "moneyTypeTitle" },
    scopedSlots: { customRender: "moneyType" },
    width: 100
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark",
    scopedSlots: { customRender: "remark" },
    width: 100
  },
  {
    dataIndex: "summation",
    title: "小计",
    key: "summation",
    scopedSlots: { customRender: "summation" },
    width: 100
  }
];
export default {
  props: {
    sendProcurementNo: {
      default: ''
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      columns,
      data: [],
      current: 1,
      pageSize: 10,
      total: 0,
      ProjectId: [],
      idArr: [],
      unitArr: [],
      supplierArr: [],
      priceArr: [],
      bomName: "",
      designIdArr: [],
      designNameArr: [],
      totalMoney: 0
    };
  },
  methods: {
    handleChangeTable(value, key, column) {
      // console.log(value);
      // console.log(key);
      // console.log(column);

      const newData = [...this.data];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        target[column] = value;
        target.summation = target.orderNum * target.unitPrice * target.taxrate + target.orderNum * target.unitPrice;
        if(isNaN( target.summation )){
          target.summation = 0 ;
        }
        this.data = newData;
      }
      this.totalMoney = 0;
      for(let i = 0; i < this.data.length; i ++) {
        this.totalMoney += this.data[i].summation
      }
    },
    close() {
      this.$emit("cancelAdd", false);
      this.form.resetFields();
    },
    onChange(current, pageNumber) {
      console.log("Page: ", pageNumber);
      console.log("第几页: ", current);
      this.current = current;
      this.getList();
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getList();
    },
    sendOrderId(value) {
      console.log(value);
      for (let i = 0; i < this.ProjectId.length; i++) {
        if (value === this.ProjectId[i].no) {
          this.workOrderId = this.ProjectId[i].id;
        }
      }
      console.log(this.workOrderId);
    },
    sendId(value) {
      console.log(value);
      this.designNameArr = value.map(item => { 
        return item.label
       });
       this.designIdArr = value.map(item => {
         return item.key
       })
      if (value == []) {
        this.data = [];
      } else 
      {
        console.log(this.designIdArr);
        this.Axios(
          {
            url: "/api-order/bom/getBomdes",
            type: "get",
            params: {
              bomIdS: this.designIdArr.join(",")
            },
            option: { enableMsg: false }
          },
          this
        ).then(
          result => {
            if (result.data.code === 200) {
              console.log(result);
              this.data = result.data.data;
              this.total = result.data.data.length;
              this.designIdArr = [];
              this.data = this.data.map(item=>{
                return {
                  ...item,
                  moneyType: "RMB",
                  summation: 0
                }
              })
            }
          },
          ({ type, info }) => {}
        );
        // for(let i = 0; i < this.data.length; i++){
        //   if(value.join(',') === this.data[i].id){
        //     this.bomName = this.data[i].name
        //   }
        // }
        this.Axios(
          {
            url: "/api-order/unit/list",
            type: "get",
            params: {},
            option: { enableMsg: false }
          },
          this
        ).then(
          result => {
            if (result.data.code === 200) {
              // console.log(result);
              this.unitArr = result.data.data.content;
            }
          },
          ({ type, info }) => {}
        );
        this.Axios(
          {
            url: "/api-order/supplier/list",
            type: "get",
            params: {},
            option: { enableMsg: false }
          },
          this
        ).then(
          result => {
            if (result.data.code === 200) {
              // console.log(result);
              this.supplierArr = result.data.data.content;
            }
          },
          ({ type, info }) => {}
        );
        this.Axios(
          {
            url: "/api-order/unit/list",
            type: "get",
            params: {},
            option: { enableMsg: false }
          },
          this
        ).then(
          result => {
            if (result.data.code === 200) {
              // console.log(result);
              this.priceArr = result.data.data.content;
            }
          },
          ({ type, info }) => {}
        );
      }
    },
    addProcurement() {
      const that = this;
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          // if (!this.checkedKeys.length) {
          // 	this.$message.error("请分配角色权限");
          // 	return false;
          // }
          let qs = require("qs");
          let data = {
            bomIds: this.designIdArr.join(","),
            bomName: this.designNameArr.join(","),
            desCount: this.total,
            workOrderId: this.workOrderId,
            workOrderNo: values.workOrderNo,
            purchaseNo: values.procurementNo,
            remark: values.remark,
            summoney: this.totalMoney,
            purchaseDesDTOList: this.data.map(item => {
              return {
                drawingNo: item.drawingNo,
                name: item.name,
                number: item.number,
                brand: item.brand,
                designer: item.designer,
                delivery: item.deliveryDate,
                moneyType: item.moneyType,
                price: item.unitPrice,
                orderNumber: item.orderNum,
                priseUnit: item.priceUnit,
                supplier: item.supplier,
                taxrate: item.taxrate,
                unit: item.orderUnit,
                remark: item.remark,
                total: item.summation
              };
            })
          };
          console.log(data);

          this.Axios(
            {
              url: "/api-order/purchase/add",
              params: data,
              type: "post",
              option: { successMsg: "添加成功！" },
              config: {
                headers: { "Content-Type": "application/json" }
              }
            },
            this
          ).then(
            result => {
              if (result.data.code === 200) {
                console.log(result);
                this.close();
                this.form.resetFields();
              }
            },
            ({ type, info }) => {}
          );
        }
      });
    },
    getDesignId() {
      this.Axios(
        {
          url: "/api-order/bom/list",
          type: "get",
          params: {
						page: 1,
						size: -1,
						auditState: 3
					},
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            // this.idArr = result.data.data.content.filter(item => { item.bomReviewSchedule === 3 });
            this.idArr = result.data.data;
          }
        },
        ({ type, info }) => {}
      );
    },
    getProjectId() {
      this.Axios(
        {
          url: "/api-order/order/getOrderList",
          type: "get",
          params: {
						page: 1,
						size: -1,
						reviewState: 3
					},
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            // console.log(result);
            this.ProjectId = result.data.data;
          }
        },
        ({ type, info }) => {}
      );
    },
    getProcurementId() {
      this.Axios(
        {
          url: "/api-order/supplier/getNo",
          type: "get",
          params: {},
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            // console.log(result);
            this.form.setFieldsValue({
              procurementNo: result.data.data
            });
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.getDesignId();
    this.getProjectId();
    this.getProcurementId();
  }
};
</script>
<style lang="less">
.addProcurement {
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 8px 4px;
  }
  .ant-tabs-tabpane .ant-tabs-tabpane-active {
    margin-bottom: 0px;
  }
}
</style>