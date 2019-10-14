<template>
	<div class="addContractManage">
		<a-form :form="form">
			<a-form-item label="合同名称" :labelCol="{span:3}" :wrapperCol="{span:19}" required>
				<a-input v-decorator="['contractName', { rules: [{ required:'true', message: '请填写计量单位'}]}]"></a-input>
			</a-form-item>
			<a-form-item label="合同名称" :labelCol="{span:3}" :wrapperCol="{span:19}">
				<editor></editor>
			</a-form-item>
		</a-form>
	</div>
</template>
<script>
import editor from "../../public/Editor";
export default {
	data() {
		return {
			form: this.$form.createForm(this)
		};
	},
	components: {
		editor
	}
};
</script>
<style lang="less" scoped>
</style>