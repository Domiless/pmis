<template>
	<div class="declaration_add">
		<a-form :form="form">
			<a-tabs :activeKey="activeKey" @change="callback">
				<a-tab-pane tab="基础信息" key="1">
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="报审单编号">
						<a-input
							v-decorator="[
							'no',
							{rules: [{ required: true, message: '请填写报审单编号' }]}
							]"
						></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="标题">
						<a-input
							v-decorator="[
							'title',
							{rules: [{ required: true, message: '请填写标题' }]}
							]"
						></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="拟制">
						<a-input v-decorator="['person']" disabled></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="填报日期">
						<a-date-picker
							v-decorator="['time']"
							@change="onChangeDate"
							format="YYYY/MM/DD"
							style="width:100%;"
						/>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="备注">
						<a-textarea v-decorator="['remark']" :autosize="{ minRows: 4, maxRows: 4 }" maxlength="200"></a-textarea>
					</a-form-item>
				</a-tab-pane>
				<a-tab-pane tab="采购报审明细" key="2" forceRender>
					<div>已询价的明细：</div>
					<a-table
						class="table_1"
						:scroll="{ x: 2270,y:320}"
						size="small"
						rowKey="id"
						:columns="columns"
						:pagination="false"
						:dataSource="data"
						:rowSelection="{selectedRowKeys:selectedRowKeysLeft,onChange: (a,b)=>onSelectChange(a,b,1)}"
					></a-table>
					<a-col :span="24" style="overflow:hidden;padding:7px 0;">
						<span style="font-size:14px;">已选择：{{selectedRowsRight.length}}</span>
						<span>
							<a-button size="small" @click="delSelect">删除已选</a-button>
							<a-button size="small" @click="delAll">清空全部</a-button>
						</span>
					</a-col>
					<a-col :span="24" style="padding-bottom:20px;">
						<a-table
							class="table_2"
							:scroll="{ x: 2270,y:320}"
							size="small"
							rowKey="id"
							:columns="columns"
							:pagination="false"
							:dataSource="selectedRowsRight"
							:rowSelection="{selectedRowKeys:selectedRowKeysRight,onChange:  (a,b)=>onSelectChange(a,b,2)}"
						></a-table>
					</a-col>
				</a-tab-pane>
			</a-tabs>
			<a-form-item style="display:block;text-align:right;">
				<a-button style="margin-right:12px;" @click="quxiao">取消</a-button>
				<a-button type="primary" @click>保存</a-button>
			</a-form-item>
		</a-form>
	</div>
</template>
<script>
let columns = [
	{
		dataIndex: "xiangmudingdanhao",
		key: "xiangmudingdanhao",
		title: "项目订单号",
		width: 150
	},
	{
		dataIndex: "tuhao",
		key: "tuhao",
		title: "图号",
		width: 150
	},
	{
		dataIndex: "xuqiumingcheng",
		key: "xuqiumingcheng",
		title: "需求名称",
		width: 150
	},
	{
		dataIndex: "xuqiushuliang",
		key: "xuqiushuliang",
		title: "需求数量",
		width: 90
	},
	{
		dataIndex: "zhidingpinpai",
		key: "zhidingpinpai",
		title: "指定品牌",
		width: 120
	},
	{
		dataIndex: "shejishi",
		key: "shejishi",
		title: "设计师",
		width: 90
	},
	{
		dataIndex: "caigoumingcheng",
		key: "caigoumingcheng",
		title: "采购名称",
		width: 120
	},
	{
		dataIndex: "dingdanshuliang",
		key: "dingdanshuliang",
		title: "订单数量",
		width: 80
	},
	{
		dataIndex: "dingdandanwei",
		key: "dingdandanwei",
		title: "订单单位",
		width: 80
	},
	{
		dataIndex: "jiaohuoriqi",
		key: "jiaohuoriqi",
		title: "交货日期",
		width: 110
	},
	{
		dataIndex: "diyigongyingshang",
		key: "diyigongyingshang",
		title: "第1供应商",
		width: 120
	},
	{
		dataIndex: "diyibaojia",
		key: "diyibaojia",
		title: "第1报价(元)",
		width: 90
	},
	{
		dataIndex: "diergongyingshang",
		key: "diergongyingshang",
		title: "第2供应商",
		width: 120
	},
	{
		dataIndex: "dierbaojia",
		key: "dierbaojia",
		title: "第2报价(元)",
		width: 90
	},
	{
		dataIndex: "disangongyingshang",
		key: "disangongyingshang",
		title: "第3供应商",
		width: 120
	},
	{
		dataIndex: "disanbaojia",
		key: "disanbaojia",
		title: "第3报价(元)",
		width: 90
	},
	{
		dataIndex: "jianyijiage",
		key: "jianyijiage",
		title: "建议价格",
		width: 80
	},
	{
		dataIndex: "jiagedanwei",
		key: "jiagedanwei",
		title: "价格单位",
		width: 80
	},
	{
		dataIndex: "huobileixing",
		key: "huobileixing",
		title: "货币类型",
		width: 90
	},
	{
		dataIndex: "beizhu",
		key: "beizhu",
		title: "备注",
		width: 120
	}
];
export default {
	data() {
		return {
			pagination: {},
			activeKey: "1",
			form: this.$form.createForm(this),
			dateValue: "",
			selectedRowKeysLeft: [],
			selectedRowKeysRight: [],
			selectedRows: [],
			selectedRowsRight: [],
			columns,
			data: [
				{
					xiangmudingdanhao: 11111,
					id: 1
				},
				{
					xiangmudingdanhao: 11111,
					id: 2
				},
				{
					xiangmudingdanhao: 11111,
					id: 13
				},
				{
					xiangmudingdanhao: 11111,
					id: 14
				},
				{
					xiangmudingdanhao: 11111,
					id: 15
				},
				{
					xiangmudingdanhao: 11111,
					id: 16
				},
				{
					xiangmudingdanhao: 11111,
					id: 17
				},
				{
					xiangmudingdanhao: 11111,
					id: 18
				},
				{
					xiangmudingdanhao: 11111,
					id: 19
				},
				{
					xiangmudingdanhao: 11111,
					id: 10
				},
				{
					xiangmudingdanhao: 11111,
					id: 100
				}
			],
			dataRight: []
		};
	},
	methods: {
		quxiao() {
			this.form.resetFields();
			this.selectedRowKeysRight = [];
			this.selectedRowsRight = [];
			this.selectedRows = [];
			this.selectedRowKeysLeft = [];
			this.dateValue = "";
			setTimeout(() => {
				this.form.setFieldsValue({
					person: JSON.parse(sessionStorage.getItem("user")).userName
				});
			}, 100);
			this.activeKey = "1";
			this.$emit("addModal", false);
		},
		onSelectChange(a, b, c) {
			if (c == 1) {
				this.selectedRowKeysLeft = a;
				this.selectedRows = b;
				let arr = new Array();
				arr = [...this.selectedRowsRight];
				this.selectedRowsRight = [];
				arr = arr.concat(b);
				arr = Array.from(new Set(arr));
				if (this.selectedRowKeysLeft.length < 1) {
					this.selectedRowsRight = [];
				} else {
					for (let i = 0; i < this.selectedRowKeysLeft.length; i++) {
						this.selectedRowsRight.push(
							arr.find(item => {
								return item.id == this.selectedRowKeysLeft[i];
							})
						);
					}
				}
			}
			if (c == 2) {
				this.selectedRowKeysRight = a;
			}
		},
		delAll() {
			this.selectedRowKeysRight = [];
			this.selectedRows = [];
			this.selectedRowKeysLeft = [];
			this.selectedRowsRight = [];
		},
		delSelect() {
			for (let i = 0; i < this.selectedRowKeysRight.length; i++) {
				this.selectedRowsRight = this.selectedRowsRight.filter(item => {
					return item.id != this.selectedRowKeysRight[i];
				});
				this.selectedRowKeysLeft = this.selectedRowKeysLeft.filter(item => {
					return item != this.selectedRowKeysRight[i];
				});
			}
			this.selectedRowKeysRight = [];
		},
		callback(key) {
			this.activeKey = key;
		},
		onChangeDate(a, b) {
			this.dateValue = b;
		}
	},
	created() {
		setTimeout(() => {
			this.form.setFieldsValue({
				person: JSON.parse(sessionStorage.getItem("user")).userName
			});
		}, 100);
	}
};
</script>
<style lang="less">
.declaration_add {
	.ant-table-small
		> .ant-table-content
		> .ant-table-scroll
		> .ant-table-body
		> table
		> .ant-table-tbody
		> tr
		> td {
		padding: 4px 4px;
	}
	.table_1 {
		.ant-table-body {
			min-height: 320px;
			max-height: 320px;
		}
		.ant-table-placeholder {
			position: relative;
			top: -190px;
		}
	}
	.table_2 {
		position: relative;
		.ant-table-body {
			min-height: 320px;
			max-height: 320px;
		}
		.ant-table-placeholder {
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -44px;
			margin-top: -27px;
		}
	}
}
</style>