<template>
    <div class="buyer">
        <a-row style="line-height:50px;">
			<permission-button permCode banType="hide" @click="showAdd">
				<a-icon style="color:#1890ff;" type="plus" />新增
			</permission-button>
			<permission-button
				permCode
				banType="hide"
				@click="showDeleteConfirm"
				:disabled="selectedRowKeys.length != 1"
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
			width="800px"
			:footer="null"
			@cancel="handle(1)"
		>
            <add-buyer @cancelAdd="closeAdd"></add-buyer>
		</a-modal>
    </div>    
</template>
<script>
import addBuyer from "./add"
const columns = [
	{
		dataIndex: "name",
		title: "姓名",
		key: "name",
		width: "100%"
	}
];
export default {
    data() {
        return {
            data: [],
            columns,
            selectedRowKeys: [],
            defaultValue: [],
			addVisible: false,
			current: 1,
			pageSize: 10,
			total: 0
        }
    },
    methods: {
        handle(num) {
            if(num == 1) {
                this.addVisible = false;
            }
        },
        showAdd() {
			this.addVisible = true;
        },
        closeAdd(params) {
			this.addVisible = params;
			this.getList();
        },
        onChange(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
			this.getList();
		},
        onSelectChange(selectedRowKeys, arr) {
			this.selectedRowKeys = selectedRowKeys;
			this.defaultValue = arr;
			console.log(this.selectedRowKeys);
			console.log(this.defaultValue);
        },
        onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			this.getList();
		},
        getList() {
			this.Axios(
				{
					url: "/api-order/buyer/list",
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
        },
        onDelete(e) {
			console.log(this.selectedRowKeys);
			let qs = require("qs");
			let data = qs.stringify({
				id: this.selectedRowKeys.join(",")
			});
			this.Axios(
				{
					url: "/api-order/buyer/delete",
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
    },
    components: {
        addBuyer
	},
	created() {
		this.getList();
	}
}
</script>
<style lang="less" scoped>
.buyer {
	padding: 0 20px;
	.ant-row:nth-child(1) {
		margin-bottom: 10px;
	}
	.ant-row:nth-child(2) {
		margin-bottom: 10px;
	}
}
</style>