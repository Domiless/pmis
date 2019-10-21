<template>
  <div class="addContractManage">
    <a-form :form="form">
      <a-form-item label="合同名称" :labelCol="{span:3}" :wrapperCol="{span:19}" required>
        <a-input v-decorator="['contractName', { rules: [{ required:'true', message: '请填写合同名称'}]}]"></a-input>
      </a-form-item>
      <a-form-item label="合同内容" :labelCol="{span:3}" :wrapperCol="{span:19}">
        <editor v-on:tinymceValue="tinymceValue"></editor>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 20,offset: 2 }" style="text-align:right">
        <a-button @click="confirmCancel" style="margin-right:12px;">关闭</a-button>
        <a-button type="primary" @click="addContract()">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import editor from "../../public/Editor";
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      content: ""
    };
  },
  methods: {
    tinymceValue(value) {
      this.content = value;
      console.log(this.content);
    },
    confirmCancel() {
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
                this.confirmCancel();
                this.form.resetFields();
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
<style lang="less" scoped>
</style>