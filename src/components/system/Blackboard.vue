<template>
	<div>
		<a-row>
			<div style="line-height:50px;">
				<a-col :span="24">
					<permission-button permCode banType="hide" @click="save">
						<a-icon style="color:#1890ff;" type="plus" />保存
					</permission-button>
				</a-col>
			</div>
		</a-row>
		<a-row style="padding-top:10px;">
			<div style="width:1000px;">
				<editor v-on:tinymceValue="tinymceValue" :value="editorValue"></editor>
			</div>
		</a-row>
	</div>
</template>
<script>
import editor from "../public/Editor";
export default {
	data() {
		return {
			editorValue: "",
			content: ""
		};
	},
	methods: {
		tinymceValue(params) {
			this.content = params;
			console.log(params);
		},
		getList() {
			this.Axios(
				{
					url: "/api-order/blackborad/get",
					params: {},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.editorValue = result.data.data;
					}
				},
				({ type, info }) => {}
			);
		},
		save() {
			let qs = require("qs");
			let data = qs.stringify({
				content: this.content
			});
			this.Axios(
				{
					url: "/api-order/blackborad/save",
					params: data,
					type: "post",
					option: { successMsg: "保存成功" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.getList();
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		this.getList();
	},
	components: {
		editor
	}
};
</script>