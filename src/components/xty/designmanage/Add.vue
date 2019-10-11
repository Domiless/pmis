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
          <a-input
							v-decorator="[
							'projectName',
							{rules: [{ required: true, message: '请填写项目名称' }]}
							]"
						></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="部件名称" :labelCol="{span:4}" :wrapperCol="{span:18}" required>
          <a-input
							v-decorator="[
							'partName',
							{rules: [{ required: true, message: '请填写部件名称' }]}
							]"
						></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="图号" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <a-input
							v-decorator="['bomDrawingNo']"
						></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="需求数量" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <a-input
							v-decorator="['number']"
						></a-input>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="备注" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <a-textarea :rows="4" :autosize="{ minRows: 4, maxRows: 4 }" 	v-decorator="['remake']"></a-textarea>
        </a-form-item>
      </a-row>
      <a-row>
          <a-form-item :wrapper-col="{ span: 20,offset: 2 }" style="text-align:right">
            <a-button @click="closeAdd" style="margin-right:12px;">关闭</a-button>
						<a-button type="primary" @click="addDesign()">提交</a-button>
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
  },
  methods: {
    closeAdd() {
     this.$emit("changeAddOrder", false);
    },
    addDesign() {
       this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log("Received values of form: ", values);
					// if (!this.checkedKeys.length) {
					// 	this.$message.error("请分配角色权限");
					// 	return false;
					// }
					let qs = require("qs");
					let data = {
						id: values.id,
            workOrderId: values.workOrderId,
            workOrderNo: values.linkPhone,
            projectName: values.projectName,
            bomDrawingNo: values.bomDrawingNo,
            partName: values.partName,
            number: values.number,
            remake: values.remake
          };
          console.log(data);

					this.Axios(
						{
							url: "/api-order/bom/add",
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
                this.getList();
                this.closeAdd();
							}
						},
						({ type, info }) => {}
					);
				}
			});
    }
  }
};
</script>
<style lang="less" scoped>
</style>