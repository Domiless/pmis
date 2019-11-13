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
			>
				<a-icon style="color:#1890ff;" type="submit" />指派采购员
			</permission-button>
        </a-row>
        <a-row>
			<a-col :span="24">
                <a-col :span="5">
				    <span>日期 :</span>
				    <a-range-picker style="width:240px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
                </a-col>
				<span>关键词 :</span>
				<a-input
					placeholder="项目订单编号/采购单号/申请人"
					style="width: 250px"
					v-model="keyWords"
					@keyup.enter.native="getList"
				></a-input>
				<a-button @click="getList">搜索</a-button>
			</a-col>
		</a-row>
        <a-row>
            <a-col :span="24">
                <a-tabs defaultActiveKey="1">
                    <a-tab-pane tab="未指派" key="1">
                        <a-table
                            rowKey="id"
                            :columns="columns"
                            :dataSource="data"
                            :pagination="false"
                            :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
                        >
                            <template slot="production" slot-scope="text, record">
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
                            :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
                        >

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
			<assign-buyer @cancelAssign="closeAssign" ref="assignBuyer"></assign-buyer>
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
                </a-col>
                <a-col :span="12">
                    <span class="label_right">设计单号: </span>
                </a-col>
                <a-col :span="12">
                    <span class="label_right">部件名称: </span>
                </a-col>
                <a-col :span="12">
                    <span class="label_right">图号: </span>
                </a-col>
                <a-col :span="12">
                    <span class="label_right">设计负责人: </span>
                </a-col>
                <a-col :span="12">
                    <span class="label_right">创建时间: </span>
                </a-col>
            </a-row>
            <a-row>
                <a-table
                    rowKey="id"
                    :columns="detailsColumns"
                    :dataSource="detailsData"
                    :pagination="false"
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
		dataIndex: "purchaseNo",
		title: "设计单号",
		key: "purchaseNo",
		width: "15%"
	},
	{
		dataIndex: "production",
		title: "部件名称",
        key: "production",
        scopedSlots: { customRender: "production" },
		width: "10%"
	},
	{
		dataIndex: "drawNo",
		title: "图号",
		key: "drawNo",
		width: "10%"
	},
	{
		dataIndex: "isOffer",
		title: "需求数量",
		key: "isOffer",
		width: "8%"
	},
	{
		dataIndex: "reviewSchedule",
		title: "设计负责人",
		key: "reviewSchedule",
		width: "8%"
    },
    {
		dataIndex: "gmtCreated",
		title: "创建时间",
		key: "gmtCreated",
		width: "10%"
	},
	{
		dataIndex: "remark",
		title: "备注",
		key: "remark"
	}
];
const detailsColumns = [
    {
		dataIndex: "workOrderNo",
		title: "图号",
		key: "workOrderNo",
		width: "20%"
	},
	{
		dataIndex: "purchaseNo",
		title: "名称",
		key: "purchaseNo",
		scopedSlots: { customRender: "purchaseNo" },
		width: "20%"
	},
	{
		dataIndex: "production",
		title: "指定品牌",
		key: "production",
		width: "10%"
	},
	{
		dataIndex: "drawNo",
		title: "需求数量",
		key: "drawNo",
		width: "10%"
	},
	{
		dataIndex: "isOffer",
		title: "指派采购员",
		key: "isOffer",
		scopedSlots: { customRender: "isOffer" },
		width: "20%"
    },
    {
		dataIndex: "gmtCreated",
		title: "指派时间",
		key: "gmtCreated",
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
            selectedRowKeys: [],
            selectedRows: [],
            defaultValue: [],
			assignVisible: false,
            editVisible: false,
            detailsVisible: false,
			current: 1,
			pageSize: 10,
            total: 0,
            dateValue: [],
            keyWords: '',
            details: []
        }
    },
    methods: {
        showAssign() {
            this.assignVisible = true;
        },
        handleCancel(num) {
            if(num == 1) {
                // this.$refs.assignBuyer.close();
            }
            if(num == 2) {
                this.detailsVisible = false;
            }
        },
        showDetails(row) {
			this.details = row;
			this.detailsVisible = true;
			console.log(this.details);
		},
        closeAssign(params) {
            this.assignVisible = params;
        },
        onChangeRange(date, datestring) {
			this.dateValue = datestring;
			console.log(this.dateValue);
		},
        onSelectChange(selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys;
			this.selectedRows = selectedRows;
			console.log(this.selectedRowKeys);
			console.log(this.selectedRows);
		},
        onChange() {

        },
        onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			this.getList();
		},
        getList() {
			this.Axios(
				{
					url: "/api-order/",
					type: "get",
					params: {
						page: this.current,
						size: this.pageSize,
						keyword: this.keyWords,
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
    },
    components: {
        assignBuyer
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