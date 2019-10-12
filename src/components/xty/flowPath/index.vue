<template>
	<div class="flow_path">
		<a-col :span="24" style="padding:0 20px;">
			<a-row>
				<div style="line-height:50px;">
					<a-col :span="8">
						<permission-button permCode banType="hide" @click="addVisible=true">
							<a-icon style="color:#1890ff;" type="plus" />新增
						</permission-button>
						<permission-button
							permCode
							banType="hide"
							@click="editVisible=true"
							:disabled="selectedRowKeys.length!=1"
						>
							<a-icon style="color:#1890ff;" type="edit" />修改
						</permission-button>
						<permission-button permCode banType="hide" :disabled="selectedRowKeys.length!=1" @click>启用/禁用</permission-button>
					</a-col>
				</div>
			</a-row>
			<a-row style="padding-top:10px;">
				<a-table
					:columns="columns"
					:pagination="false"
					:dataSource="data"
					:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
					rowKey="id"
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
				:footer="null"
				width="800px"
				:visible="addVisible"
				@cancel="handleCancel(1)"
				:maskClosable="false"
			>
				<add></add>
			</a-modal>
			<a-modal
				title="修改"
				:footer="null"
				width="800px"
				:visible="editVisible"
				@cancel="handleCancel(2)"
				:maskClosable="false"
			>
				<edit></edit>
			</a-modal>
		</a-col>
	</div>
</template>
<script>
import add from "./add&&edit/add";
import edit from "./add&&edit/edit";
const columns = [
	{
		dataIndex: "name",
		title: "流程类型",
		width: "20%",
		key: "name"
	},
	{
		dataIndex: "description",
		title: "流程名称",
		width: "60%",
		key: "description"
	},
	{
		dataIndex: "state",
		title: "状态",
		width: "15%",
		key: "state"
	}
];
export default {
	data() {
		return {
			editVisible: false,
			addVisible: false,
			columns,
			data: [
				{
					name: 11,
					description: 22,
					state: 33
				}
			],
			current: 1,
			pageSize: 10,
			total: 0,
			selectedRowKeys: []
		};
	},
	methods: {
		handleCancel(a) {
			if (a == 1) {
				this.addVisible = false;
			}
			if (a == 2) {
				this.editVisible = false;
			}
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
			console.log(this.selectedRowKeys);
		},
		onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			// this.getList();
		},
		onChange(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
			// this.getList();
		}
	},
	components: {
		add,
		edit
	}
};
</script>