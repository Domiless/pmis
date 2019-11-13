<template>
	<div class="enquiry_add">
		<a-table
			:scroll="{ x: 2230,y:600}"
			rowKey="id"
			:columns="columns"
			:dataSource="data"
			:pagination="false"
			size="small"
		>
			<span slot="dingdanshuliangTitle">
				<span style="color: #f5222d">*</span>订单数量
			</span>
			<span slot="dingdandanweiTitle">
				<span style="color: #f5222d">*</span>订单单位
			</span>
			<span slot="jiaohuoriqiTitle">
				<span style="color: #f5222d">*</span>交货日期
			</span>
			<span slot="diyigongyingshangTitle">
				<span style="color: #f5222d">*</span>第1供应商
			</span>
			<span slot="diyibaojiaTitle">
				<span style="color: #f5222d">*</span>第1报价(元)
			</span>
			<span slot="jiagedanweiTitle">
				<span style="color: #f5222d">*</span>价格单位
			</span>
			<template
				v-for="col in ['caigoumingcheng', 'dingdanshuliang','diyibaojia','dierbaojia','disanbaojia','beizhu']"
				:slot="col"
				slot-scope="text, record, index"
			>
				<div :key="col">
					<a-input
						style="margin: -5px 0;width:100%"
						:value="text"
						@change="e => handleChange(e.target.value, record.id, col)"
					/>
				</div>
			</template>
			<template
				v-for="l in ['diyigongyingshang', 'diergongyingshang', 'disangongyingshang']"
				:slot="l"
				slot-scope="text, record, index"
			>
				<div :key="l">
					<a-select
						showSearch
						:filterOption="filterOption"
						style="width:100%;margin: -5px 0"
						:value="text"
						@change="e => handleChange(e, record.id, l)"
					>
						<a-select-option value="lucy">Lucy</a-select-option>
					</a-select>
				</div>
			</template>
			<template v-for="i in ['jiagedanwei']" :slot="i" slot-scope="text, record, index">
				<div :key="i">
					<a-select
						style="width:100%;margin: -5px 0"
						:value="text"
						@change="e => handleChange(e, record.id, i)"
					>
						<a-select-option value="lucy">Lucy</a-select-option>
					</a-select>
				</div>
			</template>
			<template v-for="j in ['type']" :slot="j" slot-scope="text, record, index">
				<div :key="j">
					<a-select
						style="width:100%;margin: -5px 0"
						:value="text"
						@change="e => handleChange(e, record.id, j)"
					>
						<a-select-option value="lucy">Lucy</a-select-option>
					</a-select>
				</div>
			</template>
			<template v-for="z in ['dingdandanwei']" :slot="z" slot-scope="text, record, index">
				<div :key="z">
					<a-select
						style="width:100%;margin: -5px 0"
						:value="text"
						@change="e => handleChange(e, record.id, z)"
					>
						<a-select-option value="lucy">Lucy</a-select-option>
					</a-select>
				</div>
			</template>
			<template v-for="k in ['jiaohuoriqi']" :slot="k" slot-scope="text, record, index">
				<div :key="k">
					<a-date-picker
						:defaultValue="text!=''&&text!=null?moment(text, 'YYYY/MM/DD'):undefined"
						format="YYYY/MM/DD"
						@change="(a,b)=>onChange(a,b,record.id, k)"
						style="width:100%;"
					/>
				</div>
			</template>
		</a-table>
		<div style="text-align:right;line-height:50px;">
			<a-button @click="quxiao">取消</a-button>
			<a-button type="primary">提交</a-button>
		</div>
	</div>
</template>
<script>
import moment from "moment";
const columns = [
	{
		title: "项目订单编号",
		key: "no",
		dataIndex: "no",
		width: 150,
		fixed: "left"
	},
	{
		title: "图号",
		key: "daringNo",
		dataIndex: "daringNo",
		width: 150,
		fixed: "left"
	},
	{
		title: "名称",
		key: "name",
		dataIndex: "name",
		width: 150,
		fixed: "left"
	},
	{
		title: "需求数量",
		key: "number",
		dataIndex: "number",
		width: 80
	},
	{
		title: "指定品牌",
		key: "brand",
		dataIndex: "brand",
		width: 110
	},
	{
		title: "设计师",
		key: "stylist ",
		dataIndex: "stylist ",
		width: 80
	},
	{
		title: "采购名称",
		key: "caigoumingcheng",
		dataIndex: "caigoumingcheng",
		width: 120,
		scopedSlots: { customRender: "caigoumingcheng" }
	},
	{
		// title: "订单数量",
		key: "dingdanshuliang",
		dataIndex: "dingdanshuliang",
		width: 80,
		scopedSlots: { customRender: "dingdanshuliang" },
		slots: { title: "dingdanshuliangTitle" }
	},
	{
		// title: "订单单位",
		key: "dingdandanwei",
		dataIndex: "dingdandanwei",
		width: 80,
		slots: { title: "dingdandanweiTitle" },
		scopedSlots: { customRender: "dingdandanwei" }
	},
	{
		// title: "交货日期",
		key: "jiaohuoriqi",
		dataIndex: "jiaohuoriqi",
		width: 140,
		slots: { title: "jiaohuoriqiTitle" },
		scopedSlots: { customRender: "jiaohuoriqi" }
	},
	{
		// title: "第1供应商",
		key: "diyigongyingshang",
		dataIndex: "diyigongyingshang",
		width: 120,
		slots: { title: "diyigongyingshangTitle" },
		scopedSlots: { customRender: "diyigongyingshang" }
	},
	{
		// title: "第1报价(元)",
		key: "diyibaojia",
		dataIndex: "diyibaojia",
		width: 100,
		slots: { title: "diyibaojiaTitle" },
		scopedSlots: { customRender: "diyibaojia" }
	},
	{
		title: "第2供应商",
		key: "diergongyingshang",
		dataIndex: "diergongyingshang",
		width: 120,
		scopedSlots: { customRender: "diergongyingshang" }
	},
	{
		title: "第2报价(元)",
		key: "dierbaojia",
		dataIndex: "dierbaojia",
		width: 100,
		scopedSlots: { customRender: "dierbaojia" }
	},
	{
		title: "第3供应商",
		key: "disangongyingshang",
		dataIndex: "disangongyingshang",
		width: 120,
		scopedSlots: { customRender: "disangongyingshang" }
	},
	{
		title: "第3报价(元)",
		key: "disanbaojia",
		dataIndex: "disanbaojia",
		width: 100,
		scopedSlots: { customRender: "disanbaojia" }
	},
	{
		// title: "价格单位",
		key: "jiagedanwei",
		dataIndex: "jiagedanwei",
		width: 90,
		slots: { title: "jiagedanweiTitle" },
		scopedSlots: { customRender: "jiagedanwei" }
	},
	{
		title: "货币类型",
		key: "type",
		dataIndex: "type",
		width: 90,
		scopedSlots: { customRender: "type" }
	},
	{
		title: "备注",
		key: "beizhu",
		dataIndex: "beizhu",
		width: 140,
		scopedSlots: { customRender: "beizhu" }
	},
	{
		title: "小计",
		key: "xiaoji",
		dataIndex: "xiaoji",
		width: 80
	}
];
export default {
	props: {},
	data() {
		return {
			columns,
			data: [
				{ name: 1111, id: 1 },
				{ name: 1111, id: 2 },
				{ name: 1111, id: 3 },
				{ name: 1111, id: 4 },
				{ name: 1111, id: 5 },
				{ name: 1111, id: 6 },
				// { name: 1111, id: 7 },
				// { name: 1111, id: 8 },
				// { name: 1111, id: 9 },
				// { name: 1111, id: 10 },
				// { name: 1111, id: 11 },
				// { name: 1111, id: 12 },
				// { name: 1111, id: 13 },
				// { name: 1111, id: 14 },
				// { name: 1111, id: 15 },
				// { name: 1111, id: 16 },
				// { name: 1111, id: 17 }
			]
		};
	},
	methods: {
		filterOption(input, option) {
			return (
				option.componentOptions.children[0].text
					.toLowerCase()
					.indexOf(input.toLowerCase()) >= 0
			);
		},
		quxiao() {
			this.$emit("addModal", false);
		},
		moment,
		onChange(a, b, key, column) {
			const newData = [...this.data];
			const target = newData.filter(item => key === item.id)[0];
			if (target) {
				target[column] = b;
				this.data = newData;
			}
		},
		handleChange(value, key, column) {
			const newData = [...this.data];
			const target = newData.filter(item => key === item.id)[0];
			if (target) {
				target[column] = value;
				this.data = newData;
			}
		}
	}
};
</script>
<style lang="less">
.enquiry_add {
	.ant-table-fixed-left,
	.ant-table-fixed-right {
		z-index: 2;
	}
}
</style>