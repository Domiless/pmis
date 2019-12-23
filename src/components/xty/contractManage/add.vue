<template>
  <div class="addContractManage">
    <a-form :form="form">
      <a-form-item label="合同名称" :labelCol="{span:2}" :wrapperCol="{span:21}" required>
        <a-input v-decorator="['contractName', { rules: [{ required:'true', message: '请填写合同名称'}]}]"></a-input>
      </a-form-item>
      <a-form-item label="合同内容" :labelCol="{span:2}" :wrapperCol="{span:21}" style="margin-bottom: 0px">
        <editor v-on:tinymceValue="tinymceValue" ref="clearContent"></editor>
      </a-form-item>
      <a-row>
        <a-col :span="24" :offset="2">
          <span style="color: #1890ff;cursor: pointer" @click="checkVariable">查看变量</span>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ span: 21,offset: 2 }" style="text-align:right" class="btn">
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
        <a-col :span="12" style="margin-bottom:12px;" v-for="(item,i) in variableMsg" :key="i">
            <span class="label_right">{{item}}:</span>
            <span>{{variableVal[item]}}</span>
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
      variableMsg: [],
      variableVal: []
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
            this.variableVal = result.data.data;
            this.variableMsg = result.data.data;
            this.variableMsg = Object.keys(this.variableMsg);
            console.log(this.variableMsg);
            console.log(this.variableVal);
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
.addContractManage {
  .label_right{
      display: inline-block;
      width: 100px;
      text-align: right;
    }
  .btn {
    margin-bottom: 0px;
  }
  .mce-edit-area.mce-container.mce-panel.mce-stack-layout-item {
    height: 580px;
    iframe {
      height: 100% !important
    }
  }
}

</style>