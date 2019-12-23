<template>
	<div class="measureUnit">
		<a-row style="line-height:50px;">
			<permission-button permCode="unit_lookup.unit_add" banType="hide" @click="addVisible=true">
				<a-icon style="color:#1890ff;" type="plus" />新增
			</permission-button>
			<permission-button
				permCode="unit_lookup.unit_update"
				banType="hide"
				@click="showEdit"
				:disabled="selectedRowKeys.length!=1"
			>
				<a-icon style="color:#1890ff;" type="edit" />修改
			</permission-button>
			<permission-button
				permCode="unit_lookup.unit_delete"
				banType="hide"
				@click="showDeleteConfirm"
				:disabled="selectedRowKeys.length!=1"
			>
				<a-icon style="color:#1890ff;" type="delete" />删除
			</permission-button>
		</a-row>
		<a-row>
			<a-table
				rowKey="id"
				:columns="columns"
				:dataSource="data"
				:pagination="false"
				:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
			></a-table>
			<a-pagination
				style="padding-top:12px;text-align: right;"
				showQuickJumper
				:defaultCurrent="current"
				:total="total"
				@change="onChange"
				showSizeChanger
				:pageSizeOptions="['10','20','30']"
				@showSizeChange="onShowSizeChange"
				:showTotal="total => `共 ${total} 条`"
			/>
		</a-row>
		<a-modal
			title="新增"
			v-model="addVisible"
			:maskClosable="false"
			width="500px"
			@ok="addUnit"
			@cancel="handleCancel(1)"
		>
			<a-form :form="form">
				<a-form-item label="计量单位" :labelCol="{span:5}" :wrapperCol="{span:17}" required>
					<a-input
						v-decorator="['name',
             { rules: [{ required:'true', message: '请填写计量单位'}, {validator: checkName}]}]"
					></a-input>
				</a-form-item>
				<a-form-item label="备注" :labelCol="{span:5}" :wrapperCol="{span:17}">
					<a-textarea v-decorator="['remark']" :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal
			title="修改"
			v-model="editVisible"
			:maskClosable="false"
			width="500px"
			@ok="editUnit"
			@cancel="handleCancel(2)"
		>
			<a-form :form="form">
				<a-form-item label="计量单位" :labelCol="{span:5}" :wrapperCol="{span:17}" required>
					<a-input
						v-decorator="['name', { 
              rules: [{ required:'true', message: '请填写计量单位'}, {validator: checkName}]}]"
					></a-input>
				</a-form-item>
				<a-form-item label="备注" :labelCol="{span:5}" :wrapperCol="{span:17}">
					<a-textarea v-decorator="['remark']" :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script>
const columns = [
	{
		dataIndex: "name",
		title: "计量单位",
		key: "name",
		width: "60%"
	},
	{
		dataIndex: "remark",
		title: "备注",
		key: "remark",
		width: "40%"
	}
];
export default {
	data() {
		return {
			form: this.$form.createForm(this),
			columns,
			data: [],
			selectedRowKeys: [],
			defaultValue: [],
			addVisible: false,
			editVisible: false,
			current: 1,
			pageSize: 10,
			total: 0
		};
	},
	methods: {
		checkName(rule, value, callback) {
			if (
				/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z]){1,20}$/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入正确的单位名称"));
			} else {
				callback();
			}
		},
		onChange(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
			this.getList();
		},
		onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			this.getList();
		},
		onSelectChange(selectedRowKeys, arr) {
			this.selectedRowKeys = selectedRowKeys;
			this.defaultValue = arr;
			console.log(this.selectedRowKeys);
			console.log(arr);
		},
		handleCancel(num) {
			if (num == 1) {
				this.form.resetFields();
				this.addVisible = false;
			} else {
				this.form.resetFields();
				this.editVisible = false;
				this.selectedRowKeys = [];
			}
		},
		showEdit() {
			this.editVisible = true;
			setTimeout(() => {
				this.form.setFieldsValue({
					name: this.defaultValue[0].name,
					remark: this.defaultValue[0].remark
				});
			}, 100);
		},
		getList() {
			this.Axios(
				{
					url: "/api-order/unit/list",
					type: "get",
					params: {
						page: this.current,
						size: this.pageSize
					},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.data = result.data.data.content;
						this.total = result.data.data.totalElement;
					}
				},
				({ type, info }) => {}
			);
		},
		addUnit() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log("Received values of form: ", values);
					// if (!this.checkedKeys.length) {
					// 	this.$message.error("请分配角色权限");
					// 	return false;
					// }
					let qs = require("qs");
					let data = qs.stringify({
						name: values.name,
						remake: values.remark
					});
					console.log(data);

					this.Axios(
						{
							url: "/api-order/unit/add",
							params: data,
							type: "post",
							option: { successMsg: "添加成功！" }
							// config: {
							// 	headers: { "Content-Type": "application/json" }
							// }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.getList();
								this.form.resetFields();
								this.addVisible = false;
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		editUnit() {
			this.form.validateFieldsAndScroll((err, values) => {
				console.log(values);
				if (!err) {
					let qs = require("qs");
					let data = qs.stringify({
						id: this.selectedRowKeys[0],
						name: values.name,
						remake: values.remark
					});
					console.log(data);
					this.Axios(
						{
							url: "/api-order/unit/update",
							params: data,
							type: "post",
							option: { successMsg: "修改成功！" }
							// config: {
							//   headers: { "Content-Type": "application/json" }
							// }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.form.resetFields();
								this.editVisible = false;
								this.selectedRowKeys = [];
								this.getList();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		onDelete(e) {
			console.log(this.selectedRowKeys);
			let qs = require("qs");
			let data = qs.stringify({
				id: this.selectedRowKeys.join(",")
			});
			this.Axios(
				{
					url: "/api-order/unit/delete",
					params: data,
					type: "post",
					option: { successMsg: "删除成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.getList();
						this.selectedRowKeys = [];
					}
				},
				({ type, info }) => {}
			);
		},
		showDeleteConfirm() {
			let that = this;
			this.$confirm({
				title: "确定删除吗？",
				content: "",
				okText: "确定",
				okType: "danger",
				cancelText: "取消",
				onOk: function() {
					that.onDelete();
				},
				onCancel() {}
			});
		}
	},
	created() {
		this.getList();
	}
};
</script>
<style lang="less" scoped>
.measureUnit {
	padding: 0 20px;
	.ant-row:nth-child(1) {
		margin-bottom: 10px;
	}
	.ant-row:nth-child(2) {
		margin-bottom: 10px;
	}
}
</style>