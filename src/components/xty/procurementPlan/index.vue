<template>
    <div class="procurementPlan">
        <a-row style="line-height:50px;">
            <a-tooltip placement="top">
                <template slot="title">
                    <span>正在开发中...</span>
                </template>
                <permission-button permCode banType="hide">
                    <a-icon style="color:#1890ff;" type="plus" />新增
                </permission-button>
            </a-tooltip>
            <permission-button
				permCode
				banType="hide"
				@click="showAssign"
				:disabled="selectedRowKeys1.length != 1"
			>
				<a-icon style="color:#1890ff;" type="submit" />指派采购员
			</permission-button>
        </a-row>
        <a-row>
			<a-col :span="24">
				    <span>日期 :</span>
				    <a-range-picker style="width:240px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
				<span style="margin-left: 10px">关键词 :</span>
				<a-input
					placeholder="项目订单编号/设计单号/部件名称/图号/设计负责人"
					style="width: 350px"
					v-model="keyWords"
					@keyup.enter.native="search"
				></a-input>
				<a-button @click="search">搜索</a-button>
			</a-col>
		</a-row>
        <a-row>
            <a-col :span="24">
                <a-tabs :activeKey="currentKey" @change="changeKey">
                    <a-tab-pane tab="未指派" key="1">
                        <a-table
                            rowKey="id"
                            :columns="columns"
                            :dataSource="data"
                            :pagination="false"
                            :rowSelection="{selectedRowKeys:selectedRowKeys1,onChange: onSelectChange1}"
                        >
                            <template slot="partName" slot-scope="text, record">
					            <a href="javascript:" @click="showDetails(record)">{{text}}</a>
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
                    </a-tab-pane>
                    <a-tab-pane tab="已指派" key="2" forceRender>
                         <a-table
                            rowKey="id"
                            :columns="columns"
                            :dataSource="data2"
                            :pagination="false"
                            :rowSelection="{selectedRowKeys:selectedRowKeys2,onChange: onSelectChange2}"
                        >
							<template slot="partName" slot-scope="text, record">
					            <a href="javascript:" @click="showDetails(record)">{{text}}</a>
				            </template>
                        </a-table>
                        <a-pagination
                            style="padding-top:12px;text-align: right;"
                            showQuickJumper
                            :defaultCurrent="current2"
                            :total="total2"
                            @change="onChange2"
                            showSizeChanger
                            :pageSizeOptions="['10','20','30']"
                            @showSizeChange="onShowSizeChange"
                            :showTotal="total2 => `共 ${total2} 条`"
                        />
                    </a-tab-pane>
                </a-tabs>
            </a-col>
        </a-row>
        <a-modal
			title="指派采购员"
			v-model="assignVisible"
			width="1000px"
			:footer="null"
			:maskClosable="false"
			@cancel="handleCancel(1)"
		>
			<assign-buyer :orderMsg="selectedRows1[0]" :orderId="selectedRowKeys1[0]" @cancelAssign="closeAssign" ref="assignBuyer"></assign-buyer>
		</a-modal>
        <a-modal
			title="采购单号详情"
			:footer="null"
			width="1000px"
			:visible="detailsVisible"
			@cancel="handleCancel(2)"
			:maskClosable="false"
		>
			<a-row style="margin-bottom: 10px">
                <a-col :span="12">
                    <span class="label_right">项目订单编号: </span>
					<span>{{details.workOrderNo}}</span>
                </a-col>
                <a-col :span="12">
                    <span class="label_right">设计单号: </span>
					<span>{{details.bomNo}}</span>
                </a-col>
                <a-col :span="12">
                    <span class="label_right">部件名称: </span>
					<span>{{details.partName}}</span>
                </a-col>
                <a-col :span="12">
                    <span class="label_right">图号: </span>
					<span>{{details.bomDrawingNo}}</span>
                </a-col>
                <a-col :span="12">
                    <span class="label_right">设计负责人: </span>
					<span>{{details.production}}</span>
                </a-col>
                <a-col :span="12">
                    <span class="label_right">创建时间: </span>
					<span>{{details.gmtCreated}}</span>
                </a-col>
            </a-row>
            <a-row>
                <a-table
                    rowKey="id"
                    :columns="detailsColumns"
                    :dataSource="detailsData"
                    :pagination="false"
					:scroll="{y: 400}"
                >
                </a-table>
            </a-row>
		</a-modal>
    </div>    
</template>
<script>
import assignBuyer from "./assignBuyer"
const columns = [
	{
		dataIndex: "workOrderNo",
		title: "项目订单编号",
		key: "workOrderNo",
		width: "15%"
	},
	{
		dataIndex: "bomNo",
		title: "设计单号",
		key: "bomNo",
		width: "15%"
	},
	{
		dataIndex: "partName",
		title: "部件名称",
        key: "partName",
        scopedSlots: { customRender: "partName" },
		width: "10%"
	},
	{
		dataIndex: "bomDrawingNo",
		title: "图号",
		key: "bomDrawingNo",
		width: "10%"
	},
	{
		dataIndex: "number",
		title: "需求数量",
		key: "number",
		width: "8%"
	},
	{
		dataIndex: "production",
		title: "设计负责人",
		key: "production",
		width: "8%"
    },
    {
		dataIndex: "assignerTime",
		title: "创建时间",
		key: "assignerTime",
		width: "10%"
	},
	{
		dataIndex: "remake",
		title: "备注",
		key: "remake"
	}
];
const detailsColumns = [
    {
		dataIndex: "drawingNo",
		title: "图号",
		key: "drawingNo",
		width: "20%"
	},
	{
		dataIndex: "name",
		title: "名称",
		key: "name",
		width: "20%"
	},
	{
		dataIndex: "brand",
		title: "指定品牌",
		key: "brand",
		width: "10%"
	},
	{
		dataIndex: "addNum",
		title: "需求数量",
		key: "addNum",
		width: "10%"
	},
	{
		dataIndex: "appointName",
		title: "指派采购员",
		key: "appointName",
		width: "20%"
    },
    {
		dataIndex: "assignerTime",
		title: "指派时间",
		key: "assignerTime",
		width: "20%"
	},
]
export default {
    data() {
        return {
            data: [
                {
                    workOrderNo: '111',
                    purchaseNo: '222',
                    production: '部件名称'

                }
            ],
            data2: [],
            detailsData: [],
            columns,
            detailsColumns,
			selectedRowKeys1: [],
			selectedRowKeys2: [],
			selectedRows1: [],
			selectedRows2: [],
            defaultValue: [],
			assignVisible: false,
            editVisible: false,
            detailsVisible: false,
			current: 1,
			current2:1,
			pageSize: 10,
			pageSize2:10,
			total: 0,
			total2: 0,
            dateValue: [],
            keyWords: '',
			details: [],
			currentKey: "1"
        }
    },
    methods: {
		changeKey(activeKey) {
			console.log(activeKey);
			this.currentKey = activeKey;
		},
		search() {
			if(this.currentKey == 1 ) {
				this.getList();
			}
			if(this.currentKey == 2 ) {
				this.getList2();
			}
		},
        showAssign() {
            this.assignVisible = true;
        },
        handleCancel(num) {
            if(num == 1) {
                this.$refs.assignBuyer.close();
            }
            if(num == 2) {
                this.detailsVisible = false;
            }
        },
        showDetails(row) {
			this.details = row;
			this.detailsVisible = true;
			console.log(this.details);
			this.Axios(
				{
					url: "/api-order/bom/getBomdes",
					type: "get",
					params: {
						bomIdS: this.details.id
					},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.detailsData = result.data.data;
					}
				},
				({ type, info }) => {}
			);
		},
        closeAssign(params) {
			this.assignVisible = params;
			this.getList();
			this.selectedRowKeys1 = [];
		},
		onChange(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
			this.getList();
		},
		onChange2(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current2 = current;
			this.getList2();
		},
        onChangeRange(date, datestring) {
			this.dateValue = datestring;
			console.log(this.dateValue);
		},
        onSelectChange1(selectedRowKeys, selectedRows) {
			this.selectedRowKeys1 = selectedRowKeys;
			this.selectedRows1 = selectedRows;
			console.log(this.selectedRowKeys1);
			console.log(this.selectedRows1);
		},
		onSelectChange2(selectedRowKeys, selectedRows) {
			this.selectedRowKeys2 = selectedRowKeys;
			this.selectedRows2 = selectedRows;
			console.log(this.selectedRowKeys2);
			console.log(this.selectedRows2);
		},
        onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			this.getList();
		},
		onShowSizeChange2(current, pageSize) {
			this.pageSize2 = pageSize;
			this.current2 = 1;
			this.getList2();
		},
        getList() {
			this.Axios(
				{
					url: "/api-order/bom/list",
					type: "get",
					params: {
						page: this.current,
						size: this.pageSize,
						keyword: this.keyWords,
						type: 0,
						auditState: 3,
						isAppiont: 0,
						start: this.dateValue[0] != "" ? this.dateValue[0] : null,
						end: this.dateValue[1] != "" ? this.dateValue[1] : null
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
		getList2() {
			this.Axios(
				{
					url: "/api-order/bom/list",
					type: "get",
					params: {
						page: this.current2,
						size: this.pageSize2,
						keyword: this.keyWords,
						type: 0,
						auditState: 3,
						isAppiont: 1,
						start: this.dateValue[0] != "" ? this.dateValue[0] : null,
						end: this.dateValue[1] != "" ? this.dateValue[1] : null
					},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.data2 = result.data.data.content;
						this.total2 = result.data.data.totalElement;
					}
				},
				({ type, info }) => {}
			);
		},
    },
    components: {
        assignBuyer
	},
	created(){
		this.getList();
		this.getList2();
	}
}
</script>
<style lang="less" scoped>
.procurementPlan {
	padding: 0 20px;
	.ant-row:nth-child(1) {
		margin-bottom: 10px;
	}
	.ant-row:nth-child(2) {
		margin-bottom: 10px;
    }
    
}
.label_right {
        display: inline-block;
        width: 120px;
        text-align: right;
    }
</style>