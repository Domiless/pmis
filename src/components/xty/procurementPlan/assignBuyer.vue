<template>
    <div class="assignBuyer">
        <a-row>
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
                :columns="columns"
                :dataSource="data"
                :pagination="false"
            >
            </a-table>
        </a-row>
        <a-row>
            <a-form-item :wrapper-col="{ span: 22,offset: 2 }" style="text-align:right">
                <a-button style="margin-right:12px;" @click="close">关闭</a-button>
                <a-button type="primary" @click="submit">提交</a-button>
            </a-form-item>
        </a-row>
    </div>
</template>
<script>
const columns = [
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
		width: "30%"
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
]
export default {
    data() {
        return {
            data: [],
            columns,
        }
    },
    methods: {
         close() {
            this.$emit("cancelAssign", false);
        },
        submit() {
            
        }
    }
}
</script>
<style lang="less" scoped>
.assignBuyer {
    .ant-row:nth-child(1) {
		margin-bottom: 10px;
	}
    .label_right {
        display: inline-block;
        width: 120px;
        text-align: right;
    }
}
</style>