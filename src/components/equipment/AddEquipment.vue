<template>
	<div class="add_equipment">
		<a-row style="line-height:50px;">
			<a-button @click="$router.back(-1)" icon="left">返回</a-button>
			<!-- <a-button type="primary" icon="plus-circle">保存</a-button> -->
		</a-row>
		<a-row>
			<div class="content_case">
				<a-form :form="form">
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="新增方式">
						<a-radio-group v-model="addType">
							<a-radio :value="1">手动创建</a-radio>
							<a-radio :value="2">第三方接入</a-radio>
						</a-radio-group>
					</a-form-item>
					<div v-if="addType==1">
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="设备编号">
							<a-input></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="设备名称">
							<a-input></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="规格型号">
							<a-input></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="设备分类">
							<a-select placeholder="请选择" optionFilterProp="children">
								<a-select-option
									v-for="(item, index) in deviceClassigy"
									:key="index"
									:value="item.value"
								>{{item.label}}</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="设备类别">
							<a-select showSearch placeholder="请选择" optionFilterProp="children">
								<a-select-option v-for="(item, index) in 10" :key="index" :value="item">{{item}}</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="所属机构">
							<a-tree-select
								:dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
								:treeData="treeData"
								placeholder="请选择"
								treeDefaultExpandAll
							>
								<span slot="title" slot-scope="{key, value}">{{value}}</span>
							</a-tree-select>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="设备状态">
							<a-select showSearch placeholder="请选择" optionFilterProp="children">
								<a-select-option
									v-for="(item, index) in deviceState"
									:key="index"
									:value="item.value"
								>{{item.label}}</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="负责人">
							<a-select mode="multiple" style="width: 100%" placeholder="请选择">
								<a-select-option
									v-for="i in 25"
									:key="(i + 9).toString(36) + i"
								>{{(i + 9).toString(36) + i}}</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="安装地点">
							<a-input></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="生产商">
							<a-input></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="供应商">
							<a-input></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="生产日期">
							<a-date-picker style="width:100%"/>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="购买日期">
							<a-date-picker style="width:100%"/>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="购买价格">
							<a-input></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="保修截止日期">
							<a-date-picker style="width:100%"/>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="相关资料">
							<a-upload
								action="//jsonplaceholder.typicode.com/posts/"
								:multiple="true"
								:fileList="fileList"
								@change="handleChange"
							>
								<a-button>
									<a-icon type="upload"/>Upload
								</a-button>
							</a-upload>
						</a-form-item>
						<a-form-item :wrapper-col="{ span: 22,offset: 2 }">
							<a-button type="primary">提交</a-button>
						</a-form-item>
					</div>
					<div v-if="addType==2">
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="接入平台">
							<a-select placeholder="请选择" optionFilterProp="children">
								<a-select-option
									v-for="(item, index) in deviceClassigy"
									:key="index"
									:value="item.value"
								>{{item.label}}</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="接入平台">
							<a-input></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="API key">
							<a-input></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="API Secret">
							<a-input></a-input>
						</a-form-item>
						<a-form-item :wrapper-col="{ span: 22,offset: 2 }">
							<a-button type="primary" @click="verification">验证</a-button>
						</a-form-item>
					</div>
				</a-form>
			</div>
		</a-row>
	</div>
</template>
<script>
const treeData = [
	{
		title: "Node1",
		value: "0-0",
		key: "0-0",
		children: [
			{
				value: "0-0-1",
				key: "0-0-1",
				scopedSlots: {
					// custom title
					title: "title"
				}
			},
			{
				title: "Child Node2",
				value: "0-0-2",
				key: "0-0-2"
			}
		]
	},
	{
		title: "Node2",
		value: "0-1",
		key: "0-1"
	}
];
const deviceClassigy = [
	{
		value: 0,
		label: "生产设备"
	},
	{
		value: 1,
		label: "非生产设备"
	},
	{
		value: 2,
		label: "辅助生产设备"
	},
	{
		value: 3,
		label: "检验检测设备"
	},
	{
		value: 4,
		label: "其他设备"
	}
];
const deviceState = [
	{
		value: 0,
		label: "在用"
	},
	{
		value: 1,
		label: "停用"
	},
	{
		value: 2,
		label: "出租"
	},
	{
		value: 3,
		label: "封存"
	},
	{
		value: 4,
		label: "报废"
	}
];
export default {
	data() {
		return {
			addType: 1,
			form: this.$form.createForm(this),
			treeData,
			deviceClassigy,
			deviceState,
			fileList: [
				{
					uid: "-1",
					name: "xxx.png",
					status: "done",
					url: "http://www.baidu.com"
				}
			]
		};
	},
	methods: {
		verification() {
			this.$message.error("验证失败！");
		},
		handleChange(value) {
			console.log(`selected ${value}`);
		}
	}
};
</script>

<style lang="less">
@border: 1px solid #dde2eb;
.add_equipment {
	.content_case {
		padding: 12px 0;
		width: 80%;
		margin-left: 5%;
		h4 {
			padding: 0 14px;
		}
		.ant-divider-horizontal {
			margin: 4px 0;
		}
		.ant-form-item {
			margin-bottom: 20px;
		}
	}
}
</style>
