<template>
  <div class="editOrderMsg">
    <a-form :form="form">
      <a-row>
        <a-form-item label="合同号" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
          <a-input v-decorator="['contractNo', { rules: [{ required:'true', message: '请填写合同号'}]}]" disabled></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="项目名称" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
          <a-input
            v-decorator="['contractName', { rules: [{ required:'true', message: '请填写项目名称'}]}]"
          ></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="订单类别" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
          <a-input-group compact>
            <a-select
              style="width:100%"
              v-decorator="['orderType', { rules: [{ required:'true', message: '请选择'}]}]"
            >
              >
              <a-select-option :value="1">贸易类</a-select-option>
              <a-select-option :value="2">咨询类</a-select-option>
              <a-select-option :value="3">设计制造类</a-select-option>
              <a-select-option :value="4">其他</a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="订单编号" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
          <a-input v-decorator="['no', { rules: [{ required:'true', message: '请填写订单编号'}]}]" disabled></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="承接部门" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
          <a-input
            v-decorator="['undertakeDep', { rules: [{ required:'true', message: '请填写承接部门'}]}]"
          ></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="业务员" :labelCol="{span:3}" :wrapperCol="{span:21}">
          <a-input v-decorator="['dutyBy']"></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="客户名称" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
          <a-input
            v-decorator="['customerName', { rules: [{ required:'true', message: '请填写客户名称'}]}]"
          ></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="合同金额" :labelCol="{span:3}" :wrapperCol="{span:21}">
          <a-input v-decorator="['totalMoney']" addonAfter="元" style="width:90%"></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="计量单位" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
          <a-input
            v-decorator="['measureUnit', { rules: [{ required:'true', message: '请填写计量单位'}]}]"
          ></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="订单数量" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
          <a-input
            v-decorator="['orderQuantity', { rules: [{ required:'true', message: '请填写订单数量'}]}]"
          ></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="运输方式" :labelCol="{span:3}" :wrapperCol="{span:21}">
          <a-input v-decorator="['transportType']"></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="签订时间" :labelCol="{span:3}" :wrapperCol="{span:21}">
          <a-date-picker @change="onChangeSign" style="width:90%" v-decorator="['gmtSign']" format="YYYY/MM/DD"/>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="交货地点" :labelCol="{span:3}" :wrapperCol="{span:21}">
          <a-input v-decorator="['deliveryPlace']"></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="交货日期" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
          <a-date-picker @change="onChange" style="width:90%" v-decorator="['gmtDelivery']" format="YYYY/MM/DD" />
        </a-form-item>
      </a-row>
      <a-row>
          <a-form-item label="附件" :labelCol="{span:3}" :wrapperCol="{span:21}">
            <a-upload
            v-decorator="['orderDocDTO']"
             name="file"
             :action="global.apiImg"
						 :multiple="true"
						 :fileList="fileList"
						 @change="handleChange"
            >
              <a-button>
                <a-icon type="upload" />选择文件
              </a-button>
            </a-upload>
          </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="备注" :labelCol="{span:3}" :wrapperCol="{span:21}">
          <a-textarea v-decorator="['remark']" :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item :wrapper-col="{ span: 20,offset: 2 }" style="text-align:right">
          <a-button @click="confirmCancel" style="margin-right:12px;">关闭</a-button>
          <a-button type="primary" @click="handleSubmit()">提交</a-button>
        </a-form-item>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: {
    OrderMessageId: {
      default:''
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      orderNo: '',
      dateValue: '',
      editMsg: [],
      fileList: [],
      signDate: '',
      defaultType: ''
    };
  },
  methods: {
    onChangeSign(data,dateString) {
      this.signDate = dateString;
    },
    onChange(date, dateString) {
      console.log(date, dateString);
      this.dateValue = dateString;
    },
    confirmCancel() {
      this.form.resetFields();
      this.$emit("cancelEdit", false);
    },
    handleChange(info) {
			console.log(info);
			let fileList = [...info.fileList];

			// 1. Limit the number of uploaded files
			//    Only to show two recent uploaded files, and old ones will be replaced by the new
			// fileList = fileList.slice(-2);

			// 2. read from response and show file link
			fileList = fileList.map(file => {
				if (file.response) {
					// Component will show file.url as link
					file.url = file.response.url;
				}
				return file;
			});

			this.fileList = fileList;
		},
    handleSubmit() {
      this.form.validateFieldsAndScroll((err, values) => {
        console.log(values,values.gmtSign,values.gmtDelivery);
        if (!err) {
          let qs = require("qs");
          let data = {
            contractName: values.contractName,
            contractNo: values.contractNo,
            customerName: values.customerName,
            dutyBy: values.dutyBy,
            totalMoney: values.totalMoney,
            measureUnit: values.measureUnit,
            transportType: values.transportType,
            deliveryPlace:values.deliveryPlace,
            gmtSign: this.signDate,
            gmtDelivery: this.dateValue,
            no: values.no,
            orderType: values.orderType,
            orderQuantity: values.orderQuantity,
            undertakeDep: values.undertakeDep,
            remark: values.remark,
            orderDocDTOList:
							values.orderDocDTO.fileList == undefined
								? values.orderDocDTO
								: values.orderDocDTO.fileList.map(item => {
										return {
											docName: item.name,
											docPosition:
												item.response == undefined
													? item.docPosition
													: item.response.data
										};
								  })
          };
          console.log(data);
          this.Axios(
            {
              url: `/api-order/order/updateOrder/${this.OrderMessageId}`,
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
                this.$emit("cancelEdit",false);
                
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
					url: `/api-order/order/getOrder/${id}`,
					params: {},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
            console.log(result.data.data);
            this.editMsg = result.data.data;
            this.dateValue = this.editMsg.gmtDelivery;
            this.signDate = this.editMsg.gmtSign;
            this.fileList = result.data.data.orderDocs.map(item => {
							return {
								uid: item.id,
								name: item.docName,
								status: "done",
								docPosition: item.docPosition,
								url: item.docPositionTrueUrl
							};
            });
            setTimeout(()=> {
              this.defaultType = this.editMsg.orderType;
              this.form.setFieldsValue({
                contractName: this.editMsg.contractName,
                contractNo: this.editMsg.contractNo,
                customerName: this.editMsg.customerName,
                dutyBy: this.editMsg.dutyBy,
                totalMoney: this.editMsg.totalMoney,
                measureUnit: this.editMsg.measureUnit,
                transportType: this.editMsg.transportType,
                deliveryPlace: this.editMsg.deliveryPlace,
                gmtSign: this.editMsg.gmtSign == null ? undefined : moment(
                  this.editMsg.gmtSign,
                  "YYYY/MM/DD"
                ),
                gmtDelivery: moment(
                  this.editMsg.gmtDelivery,
                  "YYYY/MM/DD"
                ),
                no: this.editMsg.no,
                orderType: this.editMsg.orderType,
                // orderType: this.editMsg.orderType == 1 ? "贸易类"
                //                  : this.editMsg.orderType == 2 ? "咨询类"
                //                  : this.editMsg.orderType == 3 ? "设计制造类"
                //                  : this.editMsg.orderType == 4 ? "其他" : null,
                orderQuantity: this.editMsg.orderQuantity,
                undertakeDep: this.editMsg.undertakeDep,
                remark: this.editMsg.remark,
                orderDocDTO: result.data.data.orderDocs
                });
            },100)
					}
				},
				({ type, info }) => {}
			);
    }
  },
  created() {
    this.findOne(this.OrderMessageId)
  },
  watch:{
    OrderMessageId(){
      if(this.OrderMessageId != ''){
        this.findOne(this.OrderMessageId)
      }
    }
  }
};
</script>
<style lang="less" scoped>
.editOrderMsg {
  .ant-input {
    width: 90%;
  }
  .ant-input-group {
    width: 90%;
  }
  .ant-row.ant-form-item {
    margin-bottom: 15px;
  }
}
</style>