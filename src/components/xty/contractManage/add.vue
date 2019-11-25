<template>
  <div class="addContractManage">
    <a-form :form="form">
      <a-form-item label="合同名称" :labelCol="{span:3}" :wrapperCol="{span:19}" required>
        <a-input v-decorator="['contractName', { rules: [{ required:'true', message: '请填写合同名称'}]}]"></a-input>
      </a-form-item>
      <a-form-item label="合同内容" :labelCol="{span:3}" :wrapperCol="{span:19}">
        <editor v-on:tinymceValue="tinymceValue" ref="clearContent"></editor>
      </a-form-item>
      <a-row>
        <a-col :span="24" :offset="3">
          <span style="color: #1890ff;cursor: pointer" @click="checkVariable">查看变量</span>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ span: 20,offset: 2 }" style="text-align:right">
        <a-button @click="confirmCancel" style="margin-right:12px;">关闭</a-button>
        <a-button type="primary" @click="addContract()">提交</a-button>
      </a-form-item>
    </a-form>
    <a-modal
      title="变量列表"
      v-model="showVisible"
			:maskClosable="false"
			width="800px"
			:footer="null"
			@cancel="showVisible = false"
      >
      <a-row>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">交货方式：</span>
            <span>{{variableMsg.交货方式}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">供方：</span>
            <span>{{variableMsg.供方}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">单位名称：</span>
            <span>{{variableMsg.单位名称}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">单位地址：</span>
            <span>{{variableMsg.单位地址}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">合同编号：</span>
            <span>{{variableMsg.合同编号}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">合计税金：</span>
            <span>{{variableMsg.合计税金}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">合计贷款：</span>
            <span>{{variableMsg.合计货款}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">含税金额：</span>
            <span>{{variableMsg.含税金额}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">大写合计税金：</span>
            <span>{{variableMsg.大写合计税金}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">大写合计贷款：</span>
            <span>{{variableMsg.大写合计货款}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">大写含税金额：</span>
            <span>{{variableMsg.大写含税金额}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">委托代理人：</span>
            <span>{{variableMsg.委托代理人}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">开户银行：</span>
            <span>{{variableMsg.开户银行}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">法定代表人：</span>
            <span>{{variableMsg.法定代表人}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">电话：</span>
            <span>{{variableMsg.电话}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">税率：</span>
            <span>{{variableMsg.税率}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">签订地点：</span>
            <span>{{variableMsg.签订地点}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">签订时间：</span>
            <span>{{variableMsg.签订时间}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">账号：</span>
            <span>{{variableMsg.账号}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">邮政编码：</span>
            <span>{{variableMsg.邮政编码}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
            <span class="label_right">需方：</span>
            <span>{{variableMsg.需方}}</span>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import editor from "../../public/Editor";
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      content: "",
      showVisible: false,
      variableMsg: []
    };
  },
  methods: {
    checkVariable() {
      this.showVisible = true;
      this.Axios(
				{
					url: "/api-order/template/getReplace",
					type: "get",
					params: {},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
            console.log(result);
            this.variableMsg = result.data.data;
					}
				},
				({ type, info }) => {}
			);
    },
    tinymceValue(value) {
      this.content = value;
      console.log(this.content);
    },
    confirmCancel() {
      this.form.resetFields();
      this.$emit("changeAddContract", false);
    },
    addContract() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          // if (!this.checkedKeys.length) {
          // 	this.$message.error("请分配角色权限");
          // 	return false;
          // }
          let qs = require("qs");
          let data = qs.stringify({
            title: values.contractName,
            content: this.content
          });
          console.log(data);

          this.Axios(
            {
              url: "/api-order/template/add",
              params: data,
              type: "post",
              option: { successMsg: "添加成功！" }
              //   config: {
              //     headers: { "Content-Type": "application/json" }
              //   }
            },
            this
          ).then(
            result => {
              if (result.data.code === 200) {
                console.log(result);
                this.content = '';
                this.$refs.clearContent.clearValue();
                this.confirmCancel();
              }
            },
            ({ type, info }) => {}
          );
        }
      });
    }
  },
  components: {
    editor
  }
};
</script>
<style lang="less">
.label_right{
    display: inline-block;
    width: 100px;
    text-align: right;
  }
</style>