<template>
  <div class="editProcurementContract">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="基础信息" key="1">
        <a-form :form="form">
          <!-- <a-row>
            <a-form-item label="采购单号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select
                v-decorator="['procurementNo', { rules: [{ required:'true', message: '请选择采购单号'}]}]"
                placeholder="请选择"
                showSearch
                disabled
                @change="getProcurementId"
              >
                <a-select-option v-for="item in procurementNo" :key="item.purchaseNo">{{ item.purchaseNo }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-row> -->
          <a-row>
            <a-form-item label="供应商" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select
                v-decorator="['supplier', { rules: [{ required:'true', message: '请选择供应商'}]}]"
                placeholder="请选择"
                showSearch
                disabled
              >
                <a-select-option :value="item.supplierName" v-for="(item,index) in supplierName"  :key="index">{{ item.supplierName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="合同编号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input
              disabled
               v-decorator="['contractNo', { rules: [{ required:'true', message: '请输入合同编号'}]}]"></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="合同模板" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select
                v-decorator="['contractTemplate', { rules: [{ required:'true', message: '请选择合同模板'}]}]"
                placeholder="请选择"
              >
                <a-select-option v-for="item in contractTemplate" :key="item.id" :value="item.title">{{ item.title }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="供方" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['supplier2', { rules: [{ required:'true', message: '请输入供方'}]}]"></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="需求方" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['demand', { rules: [{ required:'true', message: '请输入需方'}]}]"></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="业务员" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['salesman']"></a-input>
            </a-form-item>
          </a-row>
           <a-row>
            <a-form-item label="税率" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <!-- <a-input v-decorator="['tax', { rules: [{ required:'true', message: '请输入税率'}]}]"></a-input> -->
              <a-select
                v-decorator="['taxrate', { rules: [{ required:'true', message: '请选择税率'}]}]"
                placeholder="请选择"
              >
                <a-select-option value="0%">0%</a-select-option>
                <a-select-option value="3%">3%</a-select-option>
                <a-select-option value="5%">5%</a-select-option>
                <a-select-option value="6%">6%</a-select-option>
                <a-select-option value="9%">9%</a-select-option>
                <a-select-option value="13%">13%</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <!-- <a-row>
            <a-form-item label="总金额" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['totalMoney']" disabled></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="金额大写" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['moneyUpper']" disabled></a-input>
            </a-form-item>
          </a-row> -->
          <a-row>
            <a-form-item label="签订地点" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['signPlace']"></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="签订日期" :labelCol="{span:3}" :wrapperCol="{span:19}">
              <a-date-picker
                @change="onChangeSign"
                style="width:100%"
                v-decorator="['gmtSign']"
                format="YYYY/MM/DD"
              />
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="合同有效期" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-range-picker  v-decorator="['usefulTime']" @change="onChangeRange" format="YYYY/MM/DD"/>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="供货方式" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['supplyMode']"></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="备注" :labelCol="{span:3}" :wrapperCol="{span:19}">
              <a-textarea v-decorator="['remark']" :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
            </a-form-item>
          </a-row>
        </a-form>
      </a-tab-pane>
      <a-tab-pane tab="采购明细" key="2" style="margin-bottom: 20px">
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
					<a-row>
						<a-col :span="24" style="overflow:hidden;padding:7px 0;">
							<span style="font-size:14px;">已选择：{{selectedRowsRight.length}}</span>
							<span>
								<a-button size="small" @click="delSelect">删除已选</a-button>
								<a-button size="small" @click="delAll">清空全部</a-button>
							</span>
						</a-col>
					</a-row>
					<a-row>
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
					</a-row>
					<a-row>
						<a-col :span="3" style="text-align: right">
							<span>合计货款(不含税): </span>
						</a-col>
						<a-col :span="21" style="padding-left: 10px">
							<span>{{ summoney }}</span>
							<span>({{ chineseMoney }})</span>
						</a-col>
					</a-row>
					<a-row>
						<a-col :span="3" style="text-align: right">
							<span>税金合计: </span>
						</a-col>
						<a-col :span="21" style="padding-left: 10px">
							<span>{{ taxMoney }}</span>
							<span>({{ chineseTaxMoney }})</span>
						</a-col>
					</a-row>
					<a-row>
						<a-col :span="3" style="text-align: right">
							<span>合计货款(含税):</span>
						</a-col>
						<a-col :span="21" style="padding-left: 10px">
							<span>{{ sumtaxMoney }}</span>
							<span>({{ chineseSumtaxMoney }})</span>
						</a-col>
					</a-row>
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
    procurementContractId: {
      default: ''
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      columns,
      selectedRowKeysLeft: [],
			selectedRowKeysRight: [],
			selectedRows: [],
			selectedRowsRight: [],
      data: [],
      current: 1,
      pageSize: 10,
      total: 0,
      signDate: "",
      procurementNo: [],
      supplierName: [],
      contractTemplate: [],
			procurementId: '',
			dateValue: '',
			summoney: '',
			chineseMoney: '',
			sumtaxMoney: '',
			chineseSumtaxMoney: '',
			taxMoney: '',
			chineseTaxMoney: '',
			supplierId: '',
			modelId: ''

    };
  },
  methods: {
    close() {
      this.form.resetFields();
      this.$emit('cancelEdit',false);
    },
    onChangeSign(data, dateString) {
			this.signDate = dateString;
			console.log(this.signDate);
    },
    onChangeRange(date,datestring){
      this.dateValue = datestring.join(" ~ ");
      console.log(this.dateValue)
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
				for(let i = 0; i < this.selectedRowsRight.length; i ++) {
					this.summoney += this.selectedRowsRight[i].total;
				}
				this.taxMoney = this.taxrateValue.replace('%','')/100 * this.summoney;
				this.sumtaxMoney = this.taxMoney + this.summoney;
				this.chineseMoney = this.number_chinese(this.summoney);
				this.chineseTaxMoney =  this.number_chinese(this.taxMoney);
				this.chineseSumtaxMoney = this.number_chinese(this.sumtaxMoney);
			}
			if (c == 2) {
				this.selectedRowKeysRight = a;
			}
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
    delAll() {
			this.selectedRowKeysRight = [];
			this.selectedRows = [];
			this.selectedRowKeysLeft = [];
			this.selectedRowsRight = [];
		},
		getDetailMsg(id) {
      this.Axios(
				{
					url: "/api-order/purchase/getDesBysupplier",
          type: "get",
         	params: {
						supplierId: id
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
    // getProcurementId(value) {
    //   for(let i = 0; i < this.procurementNo.length; i ++){
    //     if(value === this.procurementNo[i].purchaseNo){
    //       this.procurementId = this.procurementNo[i].id
    //     }
    //   }
    //   console.log(this.procurementId);
    //   this.findOne(this.procurementId);
    // },
    // findOne(id) {
		// 	this.Axios(
		// 		{
		// 			url: '/api-order/purchase/findone',
		// 			params: {
    //         id: id
    //       },
		// 			type: "get",
		// 			option: { enableMsg: false }
		// 		},
		// 		this
		// 	).then(
		// 		result => {
		// 			if (result.data.code === 200) {
    //         console.log(result);
    //         this.data = result.data.data.purchaseDesDOList;
    //         this.total = result.data.data.purchaseDesDOList.length;
		// 			}
		// 		},
		// 		({ type, info }) => {}
		// 	);
    // },
    setDefalut(id){
      this.Axios(
				{
					url: '/api-order/shopContract/findone',
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
						this.signDate = msg.digndate;
						this.dateValue = msg.validity;
						this.summoney = msg.summoney;
						this.supplierId = msg.supplierId;
						this.modelId = msg.modelId;
						this.taxMoney = msg.taxMoney;
						this.sumtaxMoney = msg.sumtaxMoney;
						this.chineseMoney = msg.chineseMoney;
						this.chineseTaxMoney =  msg.chineseTaxMoney;
						this.chineseSumtaxMoney = msg.chineseSumtaxMoney;
						this.selectedRowsRight = msg.purchaseDesDOList;
            setTimeout(()=> {
              this.form.setFieldsValue({
                // procurementNo: msg.purchaseNo,
                contractNo: msg.shopContractNo,
                contractTemplate: msg.model,
								supplier: msg.supplier,
								supplier2: msg.supplierName,
                demand: msg.demand,
								salesman: msg.salesman,
								taxrate: msg.taxrate,
                // totalMoney: msg.summoney,
                // moneyUpper: msg.chineseMoney,
                signPlace: msg.place, 
                supplyMode: msg.sendway,
                remark: msg.remark,
                gmtSign: msg.digndate == null ? undefined : moment(
                          msg.digndate,
                          "YYYY/MM/DD"
												),
								usefulTime: [moment(msg.validity.split(" ~ ")[0],"YYYY/MM/DD"),moment(msg.validity.split(" ~ ")[1],"YYYY/MM/DD")]
								});
						},100)
						// this.getDetailMsg(msg.supplierId);
					}
				},
				({ type, info }) => {}
			);
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
					this.total = this.selectedRowsRight.length;
					let qs = require("qs");
					let data = {
            id: this.procurementContractId,
            supplierId: this.supplierId,
            supplier: values.supplier,
            shopContractNo: values.contractNo,
            model: values.contractTemplate,
            modelId: this.modelId,
            supplierName: values.supplier2,
            demand: values.demand,
            salesman : values.salesman,
            taxrate: values.taxrate,
            place : values.signPlace,
            digndate: this.signDate,
            validity: this.dateValue,
            sendway: values.supplyMode,
						remark: values.remark,
						summoney: this.summoney,
						chineseMoney: this.chineseMoney,
						sumtaxMoney: this.sumtaxMoney,
						chineseSumtaxMoney: this.chineseSumtaxMoney,
						taxMoney: this.taxMoney,
						chineseTaxMoney: this.chineseTaxMoney,
            // shopContractDesDOList: this.selectedRowsRight.map(item => {
						// 														return {
						// 															brand: item.brand,
						// 															delivery: item.delivery,
						// 															designer: item.planner,
						// 															drawingNo: item.drawingNo,
						// 															moneyType: item.moneyType,
						// 															name: item.name,
						// 															number: item.brand,
						// 															orderNumber: item.orderNumber,
						// 															price: item.price,
						// 															priseUnit: item.priseUnit,
						// 															purchaseDesID: item.id,
						// 															remark: item.remark,
						// 															supplier: item.supplier,
						// 															unit: item.unit
						// 														}
						// }),
						purchaseDesId: this.selectedRowsRight.map(item => item.id),
            desCount: this.total,
          };
          console.log(data);

					this.Axios(
						{
							url: "/api-order/shopContract/update",
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
                this.close();
							}
						},
						({ type, info }) => {}
					);
				}
      });
    },
    getProcurementNo() {
      this.Axios(
				{
					url: "/api-order/purchase/list",
          type: "get",
         	params: {},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
            // console.log(result);
            this.procurementNo = result.data.data.content;
            
      
					}
				},
				({ type, info }) => {}
			);
    },
    getSupplierName() {
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
            this.supplierName = result.data.data.content;
            
      
					}
				},
				({ type, info }) => {}
			);
    },
    getContract(){
      this.Axios(
        {
          url: "/api-order/template/list",
          type: "get",
          params: {},
          option: {enableMsg: false}
        },
        this
      ).then(
        result => {
          if(result.data.code ===200) {
            // console.log(result);
            this.contractTemplate = result.data.data.content;

          }
        }
      )
    },
    // getContractId() {
    //   this.Axios(
    //     {
    //       url: "/api-order/supplier/getNo",
    //       type: "get",
    //       params: {},
    //       option: { enableMsg: false }
    //     },
    //     this
    //   ).then(
    //     result => {
    //       if (result.data.code === 200) {
    //         // console.log(result);
    //         this.form.setFieldsValue({
    //           contractNo: result.data.data
    //         })
    //       }
    //     },
    //     ({ type, info }) => {}
    //   );
    // }
  },
  created() {
    this.setDefalut(this.procurementContractId);
    // this.getProcurementNo();
    // this.getSupplierName();
    this.getContract();
    // this.getContractId();
  },
  watch: {
    procurementContractId(){
      if( this.procurementContractId != '' ) {
        this.setDefalut(this.procurementContractId)
      }
    }
  }
};
</script>
<style lang="less" >
.editProcurementContract {
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