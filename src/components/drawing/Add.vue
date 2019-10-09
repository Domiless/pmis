<template>
	<div class="drawing_add">
		<a-form :form="form" style="overflow:hidden" @keyup.enter.native="add">
			<a-col :span="24">
				<a-col :span="8">
					<a-form-item :label-col=" { span: 6 }" :wrapper-col="{ span: 17 }" label="图纸号">
						<a-input
							v-decorator="['drawingNo',{rules: [{ required: true, message: '请填写图纸号' }]}]"
							style="width:100%"
							maxlength="20"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item :label-col=" { span: 7 }" :wrapper-col="{ span: 17 }" label="图纸名称">
						<a-input
							v-decorator="['drawingName',{rules: [{ required: true, message: '请填写图纸名称' }]}]"
							style="width:100%"
							maxlength="20"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item :label-col=" { span: 7 }" :wrapper-col="{ span: 17 }" label="录入人">
						<!-- <a-input v-decorator="['userName']" style="width:100%" disabled></a-input> -->
						<span>{{userName}}</span>
					</a-form-item>
				</a-col>
			</a-col>
			<a-col :span="24">
				<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="备注">
					<a-textarea v-decorator="['remarks']" placeholder maxlength="50" :rows="4" style="width:100%" />
				</a-form-item>
			</a-col>
			<a-col :span="24">
				<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="图纸图片">
					<a-upload
						:action="global.apiImg"
						listType="picture"
						:defaultFileList="fileList"
						class="upload-list-inline"
						@change="uploadImg"
						v-decorator="['imgPositions']"
					>
						<a-button>
							<a-icon type="upload" />上传图纸
						</a-button>
					</a-upload>
				</a-form-item>
			</a-col>
			<a-col :span="24">
				<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="图纸源文件">
					<a-upload
						name="file"
						:multiple="true"
						:action="global.apiImg"
						@change="handleChange"
						:defaultFileList="fileList1"
						v-decorator="['filePosition']"
					>
						<a-button>
							<a-icon type="upload" />上传文件
						</a-button>
					</a-upload>
				</a-form-item>
			</a-col>
			<a-col :span="24">
				<a-form-item :wrapper-col="{ span: 22,offset:2 }" style="text-align: right;">
					<a-button style="margin-right:12px;" @click="confirmCancel">取消</a-button>
					<a-button type="primary" @click="add">保存</a-button>
				</a-form-item>
			</a-col>
		</a-form>
	</div>
</template>
<script>
import Vue from "vue";
import { Col, Upload, Form, Input, Icon } from "ant-design-vue";
Vue.use(Col);
Vue.use(Upload);
Vue.use(Form);
Vue.use(Input);
Vue.use(Icon);
export default {
	data() {
		return {
			headers: {},
			form: this.$form.createForm(this),
			fileList: [],
			fileList1: [],
			userName: ""
		};
	},
	methods: {
		confirmCancel() {
			let params = { type: "取消", value: false };
			this.$emit("addModal", params);
			this.form.resetFields();
		},
		handleChange(info) {
			if (info.file.status !== "uploading") {
				// console.log(info.file, info.fileList);
			}
			if (info.file.status === "done") {
				console.log(info);
				if (info.file.response.code === 200) {
					this.$message.success(`上传成功！`);
				}
				// this.$message.success(`${info.file.name} file uploaded successfully`);
			} else if (info.file.status === "error") {
				this.$message.error(`上传失败！`);
			}
		},
		uploadImg(info) {
			if (info.file.status !== "uploading") {
				// console.log(info.file, info.fileList);
			}
			if (info.file.status === "done") {
				if (info.file.response.code === 200) {
					this.$message.success(`上传成功！`);
				}
				// this.fileList=
				console.log(this.fileList);
			} else if (info.file.status === "error") {
				this.$message.error(`上传失败！`);
			}
		},
		resetForm() {
			this.form.resetFields();
		},
		add() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					// console.log(values);
					let data = {
						drawingName: values.drawingName,
						drawingNo: values.drawingNo,
						filePosition:
							values.filePosition != undefined
								? values.filePosition.fileList.map(item => {
										return item.response.data;
								  })
								: [],
						imgPositions:
							values.imgPositions != undefined
								? values.imgPositions.fileList.map(item => {
										return item.response.data;
								  })
								: [],
						remarks: values.remarks
					};
					console.log(data);
					this.Axios(
						{
							url: "/api-workorder/drawing/lib/addLib",
							params: data,
							type: "post",
							option: { successMsg: "保存成功！" },
							config: {
								headers: { "Content-Type": "application/json" }
							}
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.form.resetFields();
								let params = { type: "确认", value: false };
								this.$emit("addModal", params);
							}
						},
						({ type, info }) => {}
					);
				}
			});
		}
	},
	created() {
		this.userName = JSON.parse(sessionStorage.getItem("user")).userName;
		// setTimeout(() => {
		// 	this.form.setFieldsValue({
		// 		userName: this.userName
		// 	});
		// }, 100);
	},
	watch: {}
};
</script>
<style lang="less">
.drawing_add {
	.upload-list-inline {
		.ant-upload-list-item {
			display: inline-block;
			width: 150px;
			margin-right: 8px;
		}
	}
}
</style>
