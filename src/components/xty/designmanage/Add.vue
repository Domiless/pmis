<template>
	<div class="addDesign">
		<a-tabs v-model="activeKey">
			<a-tab-pane tab="基础信息" key="1">
				<a-form :form="form">
					<a-row>
						<a-form-item label="项目订单" :labelCol="{span:3}" :wrapperCol="{span:18}" required>
							<a-select
								v-decorator="[
                'workOrderId',
                {rules: [{ required: true, message: '请选择项目订单' }]}
                ]"
								showSearch
								placeholder="请选择"
								optionFilterProp="children"
								style="width: 100%"
								:filterOption="filterOption"
							>
								<a-select-option v-for="(i,j) in orderListValue" :key="j" :value="i.no">{{i.contractName}}</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
					<a-row>
						<a-form-item label="设计单号" :labelCol="{span:3}" :wrapperCol="{span:18}" required>
							<a-input-search
								v-decorator="[
                'designNo',
                {rules: [{ required: true, message: '请填写设计单号' }]}
                ]"
								@search="onSearch"
								enterButton="生成"
							/>
						</a-form-item>
						<a-form-item label="项目名称" :labelCol="{span:3}" :wrapperCol="{span:18}" required>
							<a-input
								v-decorator="[
							'projectName',
							{rules: [{ required: true, message: '请填写项目名称' }]}
							]"
							></a-input>
						</a-form-item>
					</a-row>
					<a-row>
						<a-form-item label="部件名称" :labelCol="{span:3}" :wrapperCol="{span:18}" required>
							<a-input
								v-decorator="[
							'partName',
							{rules: [{ required: true, message: '请填写部件名称' }]}
							]"
							></a-input>
						</a-form-item>
					</a-row>
					<a-row>
						<a-form-item label="图号" :labelCol="{span:3}" :wrapperCol="{span:18}">
							<a-input v-decorator="['bomDrawingNo']"></a-input>
						</a-form-item>
					</a-row>
					<a-row>
						<a-form-item label="需求数量" :labelCol="{span:3}" :wrapperCol="{span:18}">
							<a-input v-decorator="['number']"></a-input>
						</a-form-item>
					</a-row>
					<a-row>
						<a-form-item label="备注" :labelCol="{span:3}" :wrapperCol="{span:18}">
							<a-textarea :rows="4" :autosize="{ minRows: 4, maxRows: 4 }" v-decorator="['remake']"></a-textarea>
						</a-form-item>
					</a-row>
				</a-form>
			</a-tab-pane>
			<a-tab-pane tab="Bom" key="2" style="margin-bottom: 20px">
				<a-row>
					<a-col style="text-align: right; margin-bottom: 10px">
						<a-button @click="addVisible=true">导入BOM</a-button>
					</a-col>
					<a-table
						:columns="columns"
						:dataSource="data"
						:scroll="{ x: 1900, y: 400 }"
						:pagination="false"
						row-key="drawingNo"
					></a-table>
				</a-row>
			</a-tab-pane>
		</a-tabs>
		<a-row>
			<a-form-item :wrapper-col="{ span: 22,offset: 2 }" style="text-align:right">
				<a-button @click="closeAdd" style="margin-right:12px;">关闭</a-button>
				<a-button type="primary" @click="addDesign()">提交</a-button>
			</a-form-item>
		</a-row>
		<a-modal
			title="导入提示"
			:footer="null"
			width="420px"
			:visible="addVisible"
			@cancel="addVisible=false"
			@ok="addVisible=false"
			:maskClosable="false"
		>
			<div>
				导入步骤：
				<br />1、下载模板
				<a href="http://114.116.238.150/model/BOM.xlsx">《BOM模板.xlsx》</a>；
				<br />2、按格式要求填写，请勿模板修改结构；
				<br />3、点击下方“选择文件”按钮导入数据；
				<br />4、校对并保存数据。
				<br />
				<span style="color:#f00">提示：重复导入时，已经有数据将会被清空。</span>
			</div>
			<div style="padding-top:12px; text-align: right">
				<a-upload
					:action="ApiSrc()"
					:headers="headers"
					:multiple="true"
					:fileList="fileList"
					:showUploadList="false"
					@change="handleChangeUpload"
				>
					<a-button type="primary">
						<a-icon type="upload" />选择文件
					</a-button>
				</a-upload>
			</div>
		</a-modal>
	</div>
</template>
<script>
const columns = [
	{
		title: "图号",
		dataIndex: "drawingNo",
		key: "drawingNo",
		// fixed: "left",
		width: 150
	},
	{
		title: "名称",
		dataIndex: "name",
		key: "name",
		width: 150
	},
	{
		title: "装入部件号",
		dataIndex: "partsNo",
		key: "partsNo",
		width: 150
	},
	{
		title: "组件中零件数量",
		dataIndex: "groupNum",
		key: "groupNum",
		width: 150
	},
	{
		title: "单机中零件数量",
		dataIndex: "singleNum",
		key: "singleNum",
		width: 150
	},
	{
		title: "需求总数量",
		dataIndex: "addNum",
		key: "addNum",
		width: 150
	},
	{
		title: "装入整件号",
		dataIndex: "entiretyNo",
		key: "entiretyNo",
		width: 150
	},
	{
		title: "领料单位",
		dataIndex: "picking",
		key: "picking",
		width: 150
	},
	{
		title: "备注",
		dataIndex: "remake",
		key: "remake",
		width: 150
	},
	{
		title: "零件类别",
		dataIndex: "partCat",
		key: "8",
		width: 150
	},
	{
		title: "指定品牌",
		dataIndex: "brand",
		key: "brand",
		width: 150
	},
	{
		title: "设计师",
		dataIndex: "planner",
		key: "planner",
		width: 150
	}
];
export default {
	data() {
		return {
			activeKey: "1",
			orderListValue: [],
			form: this.$form.createForm(this),
			orderNo: "",
			data: [],
			columns,
			addVisible: false,
			fileList: [],
			headers: {
				Authorization: "bearer " + sessionStorage.getItem("token")
				// encType: "multipart/form-data"
			}
		};
	},
	methods: {
		onSearch() {
			this.Axios(
				{
					url: "/api-order/supplier/getNo",
					type: "get",
					params: {},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						setTimeout(() => {
							this.form.setFieldsValue({
								designNo: result.data.data
							});
						}, 100);
					}
				},
				({ type, info }) => {}
			);
		},
		handleChangeUpload(info) {
			console.log(info.file);
			info.fileList = info.fileList.slice(-1);
			this.fileList = info.fileList;
			if (info.file.response.code === 200) {
				this.$message.success("上传成功！");
				// console.log(info);
				this.data = info.fileList[0].response.data;
				console.log(this.data);
				this.addVisible = false;
			} else {
				this.$message.error(info.file.response.msg);
			}
		},
		ApiSrc() {
			return this.global.apiSrc + "/api-order/bom/resolve";
		},
		filterOption(input, option) {
			return (
				option.componentOptions.children[0].text
					.toLowerCase()
					.indexOf(input.toLowerCase()) >= 0
			);
		},
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
						bomNo: values.designNo,
						workOrderId: values.workOrderId,
						// workOrderNo: this.orderListValue.find(item => {
						// 	return item.id == values.workOrderId;
						// }).contractNo,
						workOrderNo: values.workOrderId,
						projectName: values.projectName,
						bomDrawingNo: values.bomDrawingNo,
						partName: values.partName,
						number: values.number,
						remake: values.remake,
						bomDesExcelDTOList: this.data
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
								this.form.resetFields();
								this.data = [];
								this.activeKey = "1";
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		getList() {
			this.Axios(
				{
					url: "/api-order/order/getOrderList",
					type: "get",
					params: {
						page: 1,
						size: -1,
						reviewState: 3
					},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.orderListValue = result.data.data;
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
</style>