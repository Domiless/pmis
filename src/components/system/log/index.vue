<template>
	<div class="log_case">
		<a-col :span="24" style="padding:0 20px;">
			<a-row>
				<div style="line-height:50px;">
					<a-col :span="24" style="text-align:right;">
						<a-select defaultValue="lucy" style="width: 120px" v-model="type">
							<a-select-option :value="-1">全部</a-select-option>
							<a-select-option :value="0">修改</a-select-option>
							<a-select-option :value="1">删除</a-select-option>
							<a-select-option :value="2">新增</a-select-option>
							<a-select-option :value="3">其它</a-select-option>
						</a-select>
						<a-range-picker
							@change="onChangeTime"
							allowClear
							format="YYYY/MM/DD"
							style="width:250px;text-align: left;"
						/>
						<a-input
							placeholder="操作人/内容"
							v-model="keyword"
							style="width:300px;"
							@keyup.enter.native="getList"
						></a-input>
						<a-button @click="getList">搜索</a-button>
					</a-col>
				</div>
			</a-row>
			<a-row style="padding-top:10px;">
				<a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id">
					<template slot="operateType" slot-scope="text, record, index">
						<span>{{text==0?"修改":text==1?"删除":text==2?"新增":text==3?"其它":""}}</span>
					</template>
				</a-table>
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
		</a-col>
	</div>
</template>
<script>
const columns = [
	{
		dataIndex: "operatorName",
		title: "操作人",
		width: "20%",
		key: "operatorName"
	},
	{
		dataIndex: "operateDesc",
		title: "操作内容",
		width: "45%",
		key: "operateDesc"
	},
	{
		dataIndex: "operateType",
		title: "操作类型",
		width: "15%",
		key: "operateType",
		scopedSlots: { customRender: "operateType" }
	},
	{
		dataIndex: "gmtCreate",
		title: "操作时间",
		width: "20%",
		key: "gmtCreate"
	}
];
export default {
	data() {
		return {
			columns,
			total: 0,
			current: 1,
			data: [],
			startTime: null,
			endTime: null,
			type: -1,
			keyword: ""
		};
	},
	methods: {
		onChangeTime(a, b) {
			this.startTime = b[0] != "" ? b[0] : null;
			this.endTime = b[1] != "" ? b[1] : null;
		},
		onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			this.getList();
		},
		onChange(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
			this.getList();
		},
		getList() {
			this.Axios(
				{
					url: "/api-platform/log/list",
					params: {
						startTime: this.startTime,
						endTime: this.endTime,
						operaType: this.type == -1 ? null : this.type,
						keyWord: this.keyword,
						page: this.current,
						size: this.pageSize
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.data = result.data.data.content;
						this.total = result.data.data.totalElement;
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
<style lang="less">
.log_case {
	overflow: hidden;
}
</style>