<template>
  <div class="addDesign">
    <a-form :form="form">
      <a-row>
        <a-form-item label="关联订单" :labelCol="{span:4}" :wrapperCol="{span:18}" required>
          <a-select
            showSearch
            placeholder="请选择"
            style="width: 100%"
            :defaultActiveFirstOption="false"
            :notFoundContent="null"
          >
            <a-select-option
              v-for="i in 25"
              :key="(i + 9).toString(36) + i"
            >{{(i + 9).toString(36) + i}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="项目名称" :labelCol="{span:4}" :wrapperCol="{span:18}" required>
          <a-input></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="部件名称" :labelCol="{span:4}" :wrapperCol="{span:18}" required>
          <a-input></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="图号" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <a-input></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="需求数量" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <a-input></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="备注" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <a-textarea :rows="4" :autosize="{ minRows: 4, maxRows: 4 }"></a-textarea>
        </a-form-item>
      </a-row>
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
