<template>
  <div class="editContractManage">
    <a-form :form="form">
      <a-form-item label="合同名称" :labelCol="{span:3}" :wrapperCol="{span:19}" required>
        <a-input v-decorator="['contractName', { rules: [{ required:'true', message: '请填写计量单位'}]}]"></a-input>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this)
    };
  }
};
</script>
<style lang="less" scoped>
</style>