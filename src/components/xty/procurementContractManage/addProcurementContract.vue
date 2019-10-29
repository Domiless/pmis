<template>
  <div class="addProcurementContract">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="基础信息" key="1">
        <a-form :form="form">
          <a-row>
            <a-form-item label="采购单号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select
                v-decorator="['procurementNo', { rules: [{ required:'true', message: '请选择采购单号'}]}]"
                placeholder="请选择"
                showSearch
                @change="getProcurementId"
              >
                <a-select-option v-for="item in procurementNo" :key="item.purchaseNo">{{ item.purchaseNo }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="合同编号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input
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
            <a-form-item label="供应商" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select
                v-decorator="['supplier', { rules: [{ required:'true', message: '请选择供应商'}]}]"
                placeholder="请选择"
                showSearch
                @change="getSupplierTotal"
              >
                <a-select-option :value="item.supplierName" v-for="(item,index) in supplierName"  :key="index">{{ item.supplierName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="需求方" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['demand', { rules: [{ required:'true', message: '请输入需求方'}]}]"></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="业务员" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['salesman']"></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="总金额" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['totalMoney']" disabled></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="金额大写" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['moneyUpper']" disabled></a-input>
            </a-form-item>
          </a-row>
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
            <a-form-item label="供货方式" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select
                v-decorator="['supplyMode']"
                placeholder="请选择"
                showSearch
              >
                <a-select-option value="供方送货">供方送货</a-select-option>
                <a-select-option value="自提">自提</a-select-option>
              </a-select>
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
        <a-table rowKey="id" :columns="columns" :dataSource="data" :scroll="{ x: 1900, y: 500 }" :pagination="true"/>
        <!-- <a-col :span="12" style="padding-top: 12px; height: 36px;">
          <span style="line-height: 12px">合计：</span>
        </a-col> -->
        <!-- <a-col :span="24">
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
        <!-- <div style="position: relative">
          <div style="position: absolute; top: -45px;font-size: 16px">
            <span>合计：</span>
            <span style="margin-left: 885px">共 {{total}} 条</span>
          </div>
        </div> -->
      </a-tab-pane>
    </a-tabs>
    <a-row>
      <a-form-item :wrapper-col="{ span: 20,offset: 2 }" style="text-align:right">
        <a-button style="margin-right:12px;" @click="close">关闭</a-button>
        <a-button type="primary" @click="addProcurement">提交</a-button>
      </a-form-item>
    </a-row>
  </div>
</template>
<script>
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
    title: "订单数量",
    key: "orderNumber",
    width: 100
  },
  {
    dataIndex: "unit",
    title: "订单单位",
    key: "unit",
    width: 100
  },
  {
    dataIndex: "delivery",
    title: "交货日期",
    key: "delivery",
    width: 120
  },
  {
    dataIndex: "price",
    title: "单价",
    key: "price",
    width: 100
  },
  {
    dataIndex: "taxrate",
    title: "税率",
    key: "taxrate",
    width: 100
  },
  {
    dataIndex: "supplier",
    title: "供应商",
    key: "supplier",
    width: 100
  },
  {
    dataIndex: "priseUnit",
    title: "价格单位",
    key: "priseUnit",
    width: 100
  },
  {
    dataIndex: "moneyType",
    title: "货币类型",
    key: "moneyType",
    width: 100
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark",
    width: 100
  }
];
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      columns,
      data: [],
      current: 1,
      pageSize: 10,
      total: 0,
      signDate: "",
      procurementNo: [],
      supplierName: [],
      contractTemplate: [],
      procurementId: '',
      contractNoWatch: ''
    };
  },
  methods: {
    number_chinese(str) {
			var num = parseFloat(str);
			var strOutput = "",
				strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
			num += "00";
			var intPos = num.indexOf(".");
			if (intPos >= 0) {
				num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
			}
			strUnit = strUnit.substr(strUnit.length - num.length);
			for (var i = 0; i < num.length; i++) {
				strOutput +=
					"零壹贰叁肆伍陆柒捌玖".substr(num.substr(i, 1), 1) +
					strUnit.substr(i, 1);
			}
			return strOutput
				.replace(/零角零分$/, "整")
				.replace(/零[仟佰拾]/g, "零")
				.replace(/零{2,}/g, "零")
				.replace(/零([亿|万])/g, "$1")
				.replace(/零+元/, "元")
				.replace(/亿零{0,3}万/, "亿")
				.replace(/^元/, "零元");
		},
    getSupplierTotal(value) {
      let totalData = this.data.filter(item => item.supplier === value);
      let money = 0;
      for(let i = 0; i < totalData.length; i ++) {
        money += totalData[i].total;
      }
      this.form.setFieldsValue({
        totalMoney: money,
        moneyUpper: this.number_chinese(money)
      })
      console.log(totalData);

    },
    close() {
      this.form.resetFields();
      this.contractNoWatch = '';
      this.$emit('cancelAdd',false);
    },
    onChangeSign(data, dateString) {
      this.signDate = dateString;
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
    getProcurementId(value) {
      for(let i = 0; i < this.procurementNo.length; i ++){
        if(value === this.procurementNo[i].purchaseNo){
          this.procurementId = this.procurementNo[i].id
        }
      }
      console.log(this.procurementId)
      this.findOne(this.procurementId)
    },
    findOne(id) {
			this.Axios(
				{
					url: '/api-order/purchase/findone',
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
            this.data = result.data.data.purchaseDesDOList;
            this.total = result.data.data.purchaseDesDOList.length;
            console.log(this.data);
            console.log(this.total);
					}
				},
				({ type, info }) => {}
			);
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
            purchaseNo: values.procurementNo,
            purchaseId: this.procurementId,
            supplier: values.supplier,
            chineseMoney: values.moneyUpper,
            summoney: values.totalMoney,
            demand: values.demand,
            digndate: this.signDate,
            model: values.contractTemplate,
            place : values.signPlace,
            remark: values.remark,
            salesman : values.salesman,
            sendway: values.supplyMode,
            shopContractNo: values.contractNo,
            shopContractDesDOList: this.data,
            desCount: this.total,
          };
          console.log(data);

					this.Axios(
						{
							url: "/api-order/shopContract/add",
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
                this.form.resetFields();
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
            this.procurementNo = result.data.data;
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
            console.log(result);
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
    getContractId() {
      this.Axios(
        {
          url: "/api-order/supplier/getNo",
          type: "get",
          params: {
            num: "CGHT"
          },
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            // console.log(result);
            this.form.setFieldsValue({
              contractNo: result.data.data
            })
            this.contractNoWatch = result.data.data;
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.getProcurementNo();
    this.getSupplierName();
    this.getContract();
    this.getContractId()
  },
  watch: {
    contractNoWatch() {
      if(this.contractNoWatch == '') {
        this.getContractId();
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>