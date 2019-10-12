<template>
  <div class="submitApproval">
    <a-form :form="form">
      <a-row>
        <a-form-item label="审批人:" :labelCol="{ span: 4}"></a-form-item>
        <span></span>
      </a-row>
    </a-form>
    <a-row>
      <a-form-item label="说明:" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
        <a-textarea :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
      </a-form-item>
    </a-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this)
    };
  },
  methods: {
    getList() {
      this.Axios(
        {
          url: "/order/reviewOrder",
          type: "post",
          params: {
            orderId: '',
            procDefId: ''
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
  .ant-row:nth-child(1) {
    margin-bottom: 20px;
  }
  .ant-form-item-label:nth-child(2) {
    line-height: 19px;
  }
}
</style>