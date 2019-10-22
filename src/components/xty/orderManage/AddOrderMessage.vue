<template>
  <div class="addOrderMsg">
      <a-form :form="form">
        <a-row>
          <a-form-item label="合同号" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
            <a-input v-decorator="['contractNo', { rules: [{ required:'true', message: '请填写合同号'}]}]"></a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item label="项目名称" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
            <a-input v-decorator="['contractName', { rules: [{ required:'true', message: '请填写项目名称'}]}]"></a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item
            label="订单类别"
            :labelCol="{span:3}"
            :wrapperCol="{span:21}"
            required
          >
            <a-input-group compact>
                <a-select style="width:100%" v-decorator="['orderType', { rules: [{ required:'true', message: '请选择'}]}]">>
                    <a-select-option value="1">贸易类</a-select-option>
                    <a-select-option value="2">咨询类</a-select-option>
                    <a-select-option value="3">设计制造类</a-select-option>
                    <a-select-option value="4">其他</a-select-option>
                </a-select>
            </a-input-group>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item
            label="订单编号"
            :labelCol="{span:3}"
            :wrapperCol="{span:21}"
            required
          >
            <a-input v-decorator="['no', { rules: [{ required:'true', message: '请填写订单编号'}]}]"></a-input>
            <a-button style="margin-left:5px" @click="getOrderNo()">生成</a-button>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item
            label="承接部门"
            :labelCol="{span:3}"
            :wrapperCol="{span:21}"
            required
          >
            <a-input v-decorator="['undertakeDep', { rules: [{ required:'true', message: '请填写承接部门'}]}]"></a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item
            label="业务员"
            :labelCol="{span:3}"
            :wrapperCol="{span:21}"
          >
            <a-input v-decorator="['dutyBy']"></a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item label="客户名称" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
            <a-input v-decorator="['customerName', { rules: [{ required:'true', message: '请填写客户名称'}]}]"></a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item label="合同金额" :labelCol="{span:3}" :wrapperCol="{span:21}">
            <a-input v-decorator="['totalMoney']" addonAfter="元" style="width:90%"></a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item label="计量单位" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
            <a-input v-decorator="['measureUnit', { rules: [{ required:'true', message: '请填写计量单位'}]}]"></a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item label="订单数量" :labelCol="{span:3}" :wrapperCol="{span:21}" required>
            <a-input v-decorator="['orderQuantity', { rules: [{ required:'true', message: '请填写订单数量'}]}]"></a-input>
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
            <a-date-picker @change="onChange" style="width:90%" v-decorator="['gmtDelivery']" format="YYYY/MM/DD"/>
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
						<a-button type="primary" @click="addOrder()">提交</a-button>
					</a-form-item>
        </a-row>
      </a-form>
  </div>
</template>
<script>
export default {
  props: ['getlist'],
  data() {
    return {
      form: this.$form.createForm(this),
      orderNo: '',
      dataValue: '',
      signDate: '',
      fileList: [],

    };
  },
  methods: {
    closeAdd() {
     this.$emit("changeAddOrder", false);
    },
    onChangeSign(data,dateString) {
      this.signDate = dateString;
    },
    onChange(date, dateString) {
			console.log(date, dateString);
			this.dataValue = dateString;
		},
    confirmCancel() {
			this.$emit("changeAddOrder", false);
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
    addOrder() {
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
						contractName: values.contractName,
            contractNo: values.contractNo,
            customerName: values.customerName,
            dutyBy: values.dutyBy,
            totalMoney: values.totalMoney,
            measureUnit: values.measureUnit,
            transportType: values.transportType,
            deliveryPlace:values.deliveryPlace,
            gmtSign: this.signDate,
            gmtDelivery: this.dataValue,
            no: values.no,
            orderType: values.orderType,
            orderQuantity: values.orderQuantity,
            undertakeDep: values.undertakeDep,
            remark: values.remark,
            OrderDocDTO: 
            values.orderDocDTO != undefined
								? values.orderDocDTO.fileList.map(item => {
										return {
											docName: item.name,
											docPosition: item.response.data
										};
								  })
								: []
          };
          console.log(data);

					this.Axios(
						{
							url: "/api-order/order/addOrder",
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
                this.getlist();
                setTimeout(() => {
                  this.closeAdd()
                  this.form.resetFields();
                },0) 
							}
						},
						({ type, info }) => {}
					);
				}
      });
    },
    getOrderNo() {
      this.Axios(
				{
					url: "/api-order/order/generateOrderNo",
          type: "get"
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
            this.orderNo = result.data.data
            this.form.setFieldsValue({
              no: this.orderNo
            })
            console.log(this.orderNo)
					}
				}
			);
    }
  }
};
</script>
<style lang="less" scoped>

  .addOrderMsg {
    .ant-input {
      width: 90%;
    }
    .ant-input-group {
      width: 90%;
    
    }
    .ant-row.ant-form-item {
      margin-bottom: 15px;
    }
    // .ant-calendar-picker {
    //   width: 750px;
    // }
  }

</style>