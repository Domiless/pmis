<template>
    <div class="addBuyer">
        <a-row>
            <a-col :span="12" class="table_case">
				<a-col :span="24">
					<a-tree-select
						allowClear
						style="width: 100%"
						:dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
						:treeData="treeData"
						placeholder="请选择"
						treeDefaultExpandAll
						@change="tableTreeselect"
					></a-tree-select>
				</a-col>
				<a-col :span="24">
					<a-table
						:scroll="{ y: 300 }"
						size="small"
						:columns="columns"
						:pagination="false"
						:dataSource="data"
						:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
						rowKey="id"
					></a-table>
				</a-col>
			</a-col>
			<a-col :span="12" class="value_case">
				<a-col :span="24">
					<ul>
						<h4>已选：</h4>
						<li v-for="(item, index) in selectedRows" :key="index">
							<span>{{item.userName}}</span>
							<a-icon type="close-circle" @click="delUserId(index)" />
						</li>
					</ul>
				</a-col>
			</a-col>
        </a-row>
        <a-row>
            <a-col :span="5" :offset="19">
                <permission-button permCode banType="hide" style="margin-right:12px;" @click="cancel">取消</permission-button>
			    <permission-button permCode banType="hide" type="primary"  @click="submit">提交</permission-button>
            </a-col>
        </a-row>
    </div>    
</template>
<script>
import { TreeSelect } from "ant-design-vue";
const columns = [
	{
		dataIndex: "userName",
		title: "名称",
		width: "45%",
		key: "userName"
	},
	{
		dataIndex: "workTypeName",
		title: "职能/工种",
		width: "50%",
		key: "workTypeName"
	}
];
export default {
    data() {
        return {
            data: [
				{
					name: "张三",
					description: "钳工",
					id: 1
				},
				{
					name: "张三",
					description: "钳工",
					id: 2
				},
				{
					name: "张三",
					description: "钳工",
					id: 3
				},
				{
					name: "张三",
					description: "钳工",
					id: 4
				},
				{
					name: "张三",
					description: "钳工",
					id: 5
				},
				{
					name: "张三",
					description: "钳工",
					id: 6
				},
				{
					name: "张三",
					description: "钳工",
					id: 7
				},
				{
					name: "张三",
					description: "钳工",
					id: 8
				},
				{
					name: "张三",
					description: "钳工",
					id: 9
				}
			],
            treeData: [],
            columns,
            selectedRowKeys: [],
            selectedRows: [],
        }
    },
    methods: {
        cancel() {
            this.$emit("cancelAdd",false);
        },
        submit() {

        },
        tableTreeselect(e) {
			console.log(e);
        },
        onSelectChange(selectedRowKeys, a) {
			this.selectedRowKeys = selectedRowKeys;
			this.selectedRows = a;
			console.log(a);
        },
        delUserId(index) {
			this.selectedRowKeys.splice(index, 1);
			this.selectedRows.splice(index, 1);
        },
    }
}
</script>
<style lang="less" scoped>
.addBuyer {
    .ant-row:nth-child(1) {
        margin-bottom: 10px;
    }
    .table_case {
		background-color: #fafafa;
		padding: 8px;
		border-radius: 4px;
		height: 395px;
		overflow: hidden;
	}
	.value_case {
		padding: 0px 12px;
		border-radius: 8px;
		height: 395px;
		overflow: hidden;
		ul {
			height: 395px;
			overflow-y: auto;
			background-color: #fafafa;
			border-radius: 4px;
			padding: 0 4px;
			li {
				list-style-type: none;
				padding: 0 4px;
				position: relative;
				&:hover {
					background-color: #e6f7ff;
				}
				i {
					position: absolute;
					right: 12px;
					top: 12px;
					cursor: pointer;
					&:hover {
						color: #1890ff;
					}
				}
			}
		}
	}
}
</style>