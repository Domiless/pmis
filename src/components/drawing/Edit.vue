<template>
	<div class="drawing_edit">
		<a-form :form="form" style="overflow:hidden" @keyup.enter.native="upDate">
			<a-col :span="24">
				<a-col :span="8">
					<a-form-item :label-col=" { span: 6 }" :wrapper-col="{ span: 17 }" label="图纸号">
						<a-input
							v-decorator="['drawingNo',{rules: [{ required: true, message: '请填写图纸号' }]}]"
							style="width:100%"
							disabled
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
						<a-input v-decorator="['userName']" style="width:100%" disabled></a-input>
					</a-form-item>
				</a-col>
			</a-col>
			<a-col :span="24">
				<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="备注">
					<a-textarea v-decorator="['remarks']" maxlength="50" placeholder :rows="4" style="width:100%" />
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
					<a-button style="margin-right:12px;" @click="resetForm">取消</a-button>
					<a-button type="primary" @click="upDate">保存</a-button>
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
	inject: ["reload"],
	props: {
		id: {
			default: null
		}
	},
	data() {
		return {
			headers: {},
			form: this.$form.createForm(this),
			fileList: [],
			fileList1: [],
			editMsg: {}
		};
	},
	methods: {
		upDate() {
			this.form.validateFieldsAndScroll((err, values) => {
				// console.log(values);
				if (!err) {
					console.log(values);
					let data = {
						drawingId: this.editMsg.id,
						drawingName: values.drawingName,
						filePosition:
							values.filePosition.fileList == undefined
								? values.filePosition.map(item => item.position)
								: values.filePosition.fileList.map(item => {
										return item.docPosition == undefined
											? item.response.data
											: item.docPosition;
								  }),
						imgPositions:
							values.imgPositions.fileList == undefined
								? values.imgPositions.map(item => item.position)
								: values.imgPositions.fileList.map(item => {
										return item.docPosition == undefined
											? item.response.data
											: item.docPosition;
								  }),
						remarks: values.remarks
					};
					console.log(data);
					this.Axios(
						{
							url: "/api-workorder/drawing/lib/updateDrawing",
							params: data,
							type: "post",
							option: { successMsg: "修改成功！" },
							config: {
								headers: { "Content-Type": "application/json" }
							}
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								// this.$router.back(-1);
								let params = {
									type: "保存",
									value: false
								};
								this.$emit("editModal", params);
								this.reload();
							}
						},
						({ type, info }) => {}
					);
				}
			});
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
			this.reload();
		},
		findOne(a) {
			this.Axios(
				{
					url: "/api-workorder/drawing/lib/details",
					params: {
						drawingNo: a
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.editMsg = result.data.data;
						setTimeout(() => {
							this.form.setFieldsValue({
								drawingNo: result.data.data.drawingNo,
								drawingName: result.data.data.name,
								remarks: result.data.data.remarks,
								imgPositions: result.data.data.drawingImgDOS,
								userName: result.data.data.createdBy,
								filePosition: result.data.data.drawingFileDOS
							});
						}, 100);

						for (let i = 0; i < result.data.data.drawingImgDOS.length; i++) {
							this.fileList.push({
								uid: Math.floor(Math.random() * 10000),
								status: "done",
								url: result.data.data.drawingImgDOS[i].positionTrueUrl,
								docPosition: result.data.data.drawingImgDOS[i].position,
								name: result.data.data.drawingImgDOS[
									i
								].positionTrueUrl.substring(
									result.data.data.drawingImgDOS[i].positionTrueUrl.lastIndexOf(
										"/"
									) + 1,
									result.data.data.drawingImgDOS[i].positionTrueUrl.lastIndexOf(
										"?"
									)
								)
							});
						}
						for (let i = 0; i < result.data.data.drawingFileDOS.length; i++) {
							this.fileList1.push({
								uid: Math.floor(Math.random() * 10000),
								status: "done",
								url: result.data.data.drawingFileDOS[i].positionTrueUrl,
								docPosition: result.data.data.drawingFileDOS[i].position,
								name: result.data.data.drawingFileDOS[
									i
								].positionTrueUrl.substring(
									result.data.data.drawingFileDOS[
										i
									].positionTrueUrl.lastIndexOf("/") + 1,
									result.data.data.drawingFileDOS[
										i
									].positionTrueUrl.lastIndexOf("?")
								)
							});
						}
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		if (this.id != null && this.id != "") {
			console.log(this.id.drawingNo);
			this.findOne(this.id.drawingNo);
		}
	},
	watch: {
		id() {
			if (this.id != null && this.id != "") {
				console.log(this.id.drawingNo);
				this.findOne(this.id.drawingNo);
			}
		}
	}
};
</script>
<style lang="less">
.drawing_edit {
	.upload-list-inline {
		.ant-upload-list-item {
			display: inline-block;
			width: 150px;
			margin-right: 8px;
		}
	}
}
</style>
