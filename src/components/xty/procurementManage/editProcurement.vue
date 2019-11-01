<template>
  <div class="editProcurement">
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
                disabled
              >
                <a-select-option v-for="item in ProjectId" :key="item.no">{{ item.no+" - "+item.contractName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="设计单号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select
                mode="multiple"
                v-decorator="['bomIdS', { rules: [{ required:'true', message: '请选择设计单号'}]}]"
                placeholder="请选择"
                @change="sendId"
                disabled
              >
                <a-select-option v-for="item in idArr" :key="item.bomNo">{{ item.bomNo }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="采购单号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input
                disabled
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
          :scroll="{ x: 1900, y: 500 }"
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
          <span slot="priseUnitTitle">
            <span style="color: #f5222d">*</span>价格单位
          </span>
          <span slot="moneyTypeTitle">
            <span style="color: #f5222d">*</span>货币类型
          </span>
          <template slot="orderNumber" slot-scope="text,record">
            <div key="orderNumber">
              <a-input
                maxlength="20"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChangeTable(e.target.value, record.id, 'orderNumber')"
              />
            </div>
          </template>
          <template slot="unit" slot-scope="text,record">
            <a-select
              style="width: 100%"
              :value="text"
              @change="(value,option) => {
                  let value1 = value;
                  handleChangeTable(value1, record.id, 'unit')
                  }"
            >
              <a-select-option
                v-for="item in unitArr"
                :value="item.name"
                :key="item.id"
              >{{ item.name }}</a-select-option>
            </a-select>
          </template>
          <template slot="delivery" slot-scope="text,record,index">
            <a-date-picker
            :defaultValue="text!=''&&text!=null?moment(text, 'YYYY/MM/DD'):undefined"
              @change="(date,dateString) => {
                                      handleChangeTable(dateString,record.id,'delivery');}"
              format="YYYY/MM/DD"
              placeholder="请选择"
            />
          </template>
          <template slot="price" slot-scope="text,record">
            <div key="price">
              <a-input
                maxlength="20"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChangeTable(e.target.value, record.id, 'price')"
              />
            </div>
          </template>
          <template slot="taxrate" slot-scope="text,record">
            <div key="taxrate">
              <a-input
                maxlength="20"
                style="margin: -5px 0;width: 95px"
                :value="text"
                @change="e => handleChangeTable(e.target.value, record.id, 'taxrate')"
              />
              <span>%</span>
            </div>
          </template>
          <template slot="supplier" slot-scope="text,record">
            <a-select
              style="width: 100%"
              :value="text"
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
          <template slot="priseUnit" slot-scope="text,record">
            <a-select
              style="width: 100%"
              :value="text"
              @change="(value,option) => {
                  let value1 = value;
                  handleChangeTable(value1, record.id, 'priseUnit')
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
          <template slot="total" slot-scope="text">
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
        </a-col>
        <a-col :span="12">
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
          ></a-pagination>
        </a-col> -->
      </a-tab-pane>
    </a-tabs>
    <a-row>
      <a-form-item :wrapper-col="{ span: 22,offset: 2 }" style="text-align:right">
        <a-button style="margin-right:12px;" @click="close">关闭</a-button>
        <a-button type="primary" @click="editProcurement">提交</a-button>
      </a-form-item>
    </a-row>
  </div>
</template>
<script>
import moment from "moment";
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
    dataIndex: "orderNumber",
    // title: "订单数量",
    key: "orderNumber",
    slots: { title: "orderNumTitle" },
    scopedSlots: { customRender: "orderNumber" },
    width: 100
  },
  {
    dataIndex: "unit",
    // title: "订单单位",
    key: "unit",
    slots: { title: "orderUnitTitle" },
    scopedSlots: { customRender: "unit" },
    width: 100
  },
  {
    dataIndex: "delivery",
    // title: "交货日期",
    key: "delivery",
    slots: { title: "deliveryDateTitle" },
    scopedSlots: { customRender: "delivery" },
    width: 120
  },
  {
    dataIndex: "price",
    // title: "单价",
    key: "price",
    slots: { title: "unitPriceTitle" },
    scopedSlots: { customRender: "price" },
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
    dataIndex: "priseUnit",
    // title: "价格单位",
    key: "priseUnit",
    slots: { title: "priseUnitTitle" },
    scopedSlots: { customRender: "priseUnit" },
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
    dataIndex: "total",
    title: "小计",
    key: "total",
    width: 100
  }
];
export default {
  props: {
    procurementId: {
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
      totalMoney: 0,
      isOffer: true,
      workOrderId: '',
      totalNumber: 0
    };
  },
  methods: {
    filterOption(input, option) {
			return (
				option.componentOptions.children[0].text
					.toLowerCase()
					.indexOf(input.toLowerCase()) >= 0
			);
		},
    handleChangeTable(value, key, column) {
      // console.log(value);
      // console.log(key);
      // console.log(column);

      const newData = [...this.data];
      const target = newData.filter(item => key === item.id)[0];
      console.log(target);
      if (target) {
        target[column] = value;
        target.total = target.orderNumber * target.price * (target.taxrate/100) + target.orderNumber * target.price;
        if(isNaN( target.total )){
          target.total = 0 ;
        }
        this.data = newData;
      }
      this.totalMoney = 0;
      for(let i = 0; i < this.data.length; i ++) {
        this.totalMoney += this.data[i].total
      }
    },
    moment,
    close() {
      this.$emit("cancelEdit", false);
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
      this.getDesignId(this.workOrderId);
    },
    getUnitArr(){
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
    },
    getSupplierArr(){
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
    },
    getPriceArr(){
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
    },
    sendId(value) {
      console.log(value);
      this.designNameArr = value;
      for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < this.idArr.length; j++) {
          if (value[i] === this.idArr[j].bomNo) {
            if (this.designIdArr.indexOf(this.idArr[j].id) === -1) {
              this.designIdArr.push(this.idArr[j].id);
            }
          }
        }
      }
      console.log(this.designIdArr);
      if(value.length < 1) {
        this.data = []
      } else {
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
                  number: item.addNum,
                  designer: item.planner,
                  moneyType: "RMB",
                  summation: 0
                }
              })
            this.data = this.data.map(item => {
              delete item.addNum;
              delete item.planner;
              return {
                ...item
              }
            })
            console.log(this.data);
          }
        },
        ({ type, info }) => {}
      );
      // for(let i = 0; i < this.data.length; i++){
      //   if(value.join(',') === this.data[i].id){
      //     this.bomName = this.data[i].name
      //   }
      // }
      this.getUnitArr();
      this.getSupplierArr();
      this.getPriceArr();
      }
    },
    editProcurement() {
      const that = this;
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          // if (!this.checkedKeys.length) {
          // 	this.$message.error("请分配角色权限");
          // 	return false;
          // }
          this.designNameArr = values.bomIdS;
          for (let i = 0; i < values.bomIdS.length; i++) {
            for (let j = 0; j < this.idArr.length; j++) {
              if (values.bomIdS[i] === this.idArr[j].bomNo) {
                if (this.designIdArr.indexOf(this.idArr[j].id) === -1) {
                  this.designIdArr.push(this.idArr[j].id);
                }
              }
            }
          }
          //判断采购必填是否为空
          let judgeData =  this.data.map(item => {
              return {
                delivery: item.delivery,
                moneyType: item.moneyType,
                price: item.price,
                orderNumber: item.orderNumber,
                priseUnit: item.priseUnit,
                supplier: item.supplier,
                taxrate: item.taxrate,
                unit: item.unit
              };
            })
          for(let i = 0; i < judgeData.length; i++ ) {
            for(let j in judgeData[i]) {
              console.log(judgeData[i][j]);
              if( judgeData[i][j] == null || judgeData[i][j] == ""){
                this.isOffer = false
              }
            }
          }
          console.log(judgeData);
          console.log(this.designIdArr);
          let qs = require("qs");
          let data = {
            id: this.procurementId,
            bomIds: this.designIdArr.join(","),
            bomName: typeof(values.bomIdS) == "string" ? values.bomIdS : values.bomIdS.join(','),
            desCount: this.total,
            workOrderId: this.workOrderId,
            workOrderNo: values.workOrderNo,
            purchaseNo: values.procurementNo,
            remark: values.remark,
            summoney: this.totalMoney,
            isOffer: this.isOffer,
            purchaseDesDTOList: this.data.map(item => {
              return {
                drawingNo: item.drawingNo,
                name: item.name,
                number: item.number,
                brand: item.brand,
                designer: item.designer,
                delivery: item.delivery,
                moneyType: item.moneyType,
                price: item.price,
                orderNumber: item.orderNumber,
                priseUnit: item.priseUnit,
                supplier: item.supplier,
                taxrate: item.taxrate,
                unit: item.unit,
                remark: item.remark,
                total: item.total
              };
            })
          };
          console.log(data);

          this.Axios(
            {
              url: "/api-order/purchase/update",
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
                this.total = 0;
                console.log(result);
                this.close();
              }
            },
            ({ type, info }) => {}
          );
        }
      });
    },
    findOne(id) {
      this.Axios(
        {
          url: "/api-order/purchase/findone",
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
            let msg = result.data.data;
            this.getDesignId(msg.workOrderId);
            this.data = msg.purchaseDesDOList;
            this.total = msg.purchaseDesDOList.length;
            this.bomIds = msg.bomIds;
            this.bomName = msg.bomName;
            this.workOrderId = msg.workOrderId;
            this.totalMoney = msg.summoney;
            setTimeout(() => {
              this.form.setFieldsValue({
                workOrderNo: msg.workOrderNo,
                bomIdS: msg.bomName,
                procurementNo: msg.purchaseNo,
                remark: msg.remark
              });
            }, 100);
          }
        },
        ({ type, info }) => {}
      );
    },
    getDesignId(id) {
      this.Axios(
        {
          url: "/api-order/bom/list",
          type: "get",
          params: {
						page: 1,
						size: -1,
            auditState: 3,
            orderId: id
					},
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
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
            console.log(result);
            this.ProjectId = result.data.data;
          }
        },
        ({ type, info }) => {}
      );
    },
    // getProcurementId() {
    //   this.Axios(
    //     {
    //       url: "/api-order/supplier/getNo",
    //       type: "get",
    //       params: {
    //       num: "CG"
    //      },
    //       option: { enableMsg: false }
    //     },
    //     this
    //   ).then(
    //     result => {
    //       if (result.data.code === 200) {
    //         // console.log(result);
    //         this.form.setFieldsValue({
    //           procurementNo: result.data.data
    //         })
    //       }
    //     },
    //     ({ type, info }) => {}
    //   );
    // }
  },
  created() {
    this.getUnitArr();
    this.getSupplierArr();
    this.getPriceArr();
    this.getProjectId();
    // this.getProcurementId();
    this.findOne(this.procurementId);
  },
  watch: {
    procurementId(){
      if(this.procurementId != ''){
        this.findOne(this.procurementId);
      }
    }
  }
};
</script>
<style lang="less">
.editProcurement {
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 8px 4px;
  }
  //  .ant-table-fixed-header .ant-table-scroll .ant-table-header {
  //   overflow: hidden;
  //   height: 54px;
  // }
}
</style>