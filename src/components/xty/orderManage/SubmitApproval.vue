<template>
  <div class="submitApproval">
    <a-form :form="form">
      <a-row>
        <a-form-item label="选择流程" :labelCol="{ span: 5}" :wrapperCol="{ span: 18 }">
          <a-select
            v-decorator="['chooseProcess', { rules: [{ required:'true', message: '请选择流程'}]}]"
          >
            <a-select-option value="1">项目订单审批(金额小于10万)</a-select-option>
            <a-select-option value="2">项目订单审批(金额大于10万)</a-select-option>
          </a-select>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="选择审批人" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
          <a-radio-group v-decorator="['approver']">
							<a-radio :value="1">张三</a-radio>
							<a-radio :value="0">李四</a-radio>
						</a-radio-group>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="说明" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
          <a-textarea :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
        </a-form-item>
      </a-row>
    </a-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      value: 1
    };
  },
  methods: {
    getList() {
      this.Axios(
        {
          url: "/api-order/order/reviewOrder",
          type: "post",
          params: {
            orderId: "",
            procDefId: ""
          }
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
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="less" scoped>
.submitApproval {
  height: 200px;

}
</style>