<template>
	<div>
		<a-row>
			<div style="line-height:50px;">
				<a-col :span="24">
					<permission-button permCode banType="hide" @click="addVisible = true;">
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
		}
	},
	created() {},
	components: {
		editor
	}
};
</script>