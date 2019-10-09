<template>
	<div class="module_customization">
		<a-row>
			<div class="content_case">
				<a-form :form="form">
					<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="“工单管理”替换为">
						<a-input></a-input>
						<a-tooltip placement="top">
							<template slot="title">
								<span>您可以将本系统的模块名称随意修改，为方便您的使用习惯。（不填写表示使用系统默认）</span>
							</template>
							<a-icon type="exclamation-circle" style="margin-left:8px;" />
						</a-tooltip>
					</a-form-item>
					<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="“生产进度”替换为">
						<a-input></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="“工艺图纸”替换为">
						<a-input></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="“数据中心”替换为">
						<a-input></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="“模拟报价”替换为">
						<a-input></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="“工种管理”替换为">
						<a-input></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="“员工管理”替换为">
						<a-input></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="“合作单位”替换为">
						<a-input></a-input>
					</a-form-item>
					<a-form-item :wrapper-col="{ span: 20,offset: 4 }">
						<a-button type="primary">提交</a-button>
					</a-form-item>
				</a-form>
			</div>
		</a-row>
	</div>
</template>
<script>
import Vue from "vue";
import { Row, Form, Input, Tooltip } from "ant-design-vue";
Vue.use(Input);
Vue.use(Row);
Vue.use(Form);
Vue.use(Tooltip);

export default {
	data() {
		return {
			form: this.$form.createForm(this)
		};
	}
};
</script>

<style lang="less">
.module_customization {
	.content_case {
		padding: 12px 0;
		width: 80%;
		margin-left: 5%;
		h4 {
			padding: 0 14px;
		}
		.ant-divider-horizontal {
			margin: 4px 0;
		}
		.ant-form-item {
			margin-bottom: 20px;
		}
		.ant-input {
			width: 300px;
		}
	}
}
</style>
