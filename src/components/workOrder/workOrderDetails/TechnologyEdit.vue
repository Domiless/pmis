<template>
	<div class="technology_edit">
		<a-row>
			<h3>
				<i class="iconfont" style="font-size:16px;color:#1890ff">&#xe61b;</i>基础信息
			</h3>
		</a-row>
		<a-form :form="form" layout="inline" style="voerflow:hidden;" @keyup.enter.native="update">
			<a-col :span="12">
				<a-form-item label="关联工单">
					<span>{{formMsg.workOrderNo}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="工作令号">
					<span>{{formMsg.gongzuolingNo}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="名称">
					<span>{{formMsg.name}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="图号">
					<span>{{formMsg.drawingNo}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="原料类型">
					<a-select
						v-decorator="['type',{rules: [{ required: true, message: '请选择原料' }]}]"
						style="width: 246px"
						placeholder="请选择"
						showSearch
						:filterOption="filterOption"
						@change="handleMaterial"
					>
						<a-select-option :value="1">板料</a-select-option>
						<a-select-option :value="2">棒料</a-select-option>
						<a-select-option :value="3">型材</a-select-option>
					</a-select>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="选择原料">
					<a-select
						style="width: 246px"
						v-decorator="['rawMaterialId',{rules: [{ required: true, message: '请选择原料' }]}]"
						placeholder="请选择"
						showSearch
						:filterOption="filterOption"
					>
						<a-select-option
							:value="item.id"
							v-for="(item,index) in materialList"
							:key="index"
						>{{item.name}}</a-select-option>
					</a-select>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="计划数量">
					<span>{{formMsg.num}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="毛坯数量">
					<a-input v-decorator="['embryoNum']" disabled style="width:246px;"></a-input>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="每毛坯件数">
					<a-input
						type="number"
						oninput="if(value.length>10)value=value.slice(0,10)"
						v-decorator="['inTheEmbryoComponents',{rules: [{ required: true, message: '请填写每毛坯件数' },{validator: chickNumber}]}]"
						style="width:246px;"
						@change="geteMbryoNum"
					></a-input>
				</a-form-item>
			</a-col>
			<a-col :span="24" v-if="materialVlaue==1||materialVlaue==null">
				<a-col :span="12">
					<a-form-item label="毛坯外形尺寸长">
						<a-input
							type="number"
							placeholder="单位:mm"
							oninput="if(value.length>10)value=value.slice(0,10)"
							v-decorator="['length1',{rules: [{ required: true, message: '请填写长' }]}]"
							style="width:114px;"
						></a-input>&nbsp;±
						<a-input
							type="number"
							placeholder="单位:mm"
							oninput="if(value.length>10)value=value.slice(0,10);if(value<0)value=null"
							v-decorator="['lengthError']"
							style="width:114px;"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="毛坯外形尺寸宽">
						<a-input
							type="number"
							placeholder="单位:mm"
							oninput="if(value.length>10)value=value.slice(0,10)"
							v-decorator="['width',{rules: [{ required: true, message: '请填写宽' },{validator: chickNumber}]}]"
							style="width:114px;"
						></a-input>&nbsp;±
						<a-input
							type="number"
							placeholder="单位:mm"
							oninput="if(value.length>10)value=value.slice(0,10);if(value<0)value=null"
							v-decorator="['widthError']"
							style="width:114px;"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="毛坯外形尺寸高">
						<a-input
							type="number"
							placeholder="单位:mm"
							oninput="if(value.length>10)value=value.slice(0,10)"
							v-decorator="['height',{rules: [{ required: true, message: '请填写高' },{validator: chickNumber}]}]"
							style="width:114px;"
						></a-input>&nbsp;±
						<a-input
							type="number"
							placeholder="单位:mm"
							oninput="if(value.length>10)value=value.slice(0,10);if(value<0)value=null"
							v-decorator="['heightError']"
							style="width:114px;"
						></a-input>
					</a-form-item>
				</a-col>
			</a-col>
			<a-col :span="24" v-if="materialVlaue==2">
				<a-col :span="12">
					<a-form-item label="毛坯外形尺寸半径">
						<a-input
							type="number"
							placeholder="单位:mm"
							oninput="if(value.length>10)value=value.slice(0,10)"
							v-decorator="['radius',{rules: [{ required: true, message: '请填写半径' },{validator: chickNumber}]}]"
							style="width:114px;"
						></a-input>&nbsp;±
						<a-input
							type="number"
							placeholder="单位:mm"
							oninput="if(value.length>10)value=value.slice(0,10);if(value<0)value=null"
							v-decorator="['radiusError']"
							style="width:114px;"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="毛坯外形尺寸长度">
						<a-input
							type="number"
							placeholder="单位:mm"
							oninput="if(value.length>10)value=value.slice(0,10)"
							v-decorator="['stickLength',{rules: [{ required: true, message: '请填写长度' },{validator: chickNumber}]}]"
							style="width:114px;"
						></a-input>&nbsp;±
						<a-input
							type="number"
							placeholder="单位:mm"
							oninput="if(value.length>10)value=value.slice(0,10);if(value<0)value=null"
							v-decorator="['stickLengthError']"
							style="width:114px;"
						></a-input>
					</a-form-item>
				</a-col>
			</a-col>
			<a-col :span="24" v-if="materialVlaue==3">
				<a-col :span="12">
					<a-form-item label="毛坯外形尺寸长度">
						<a-input
							type="number"
							placeholder="单位:mm"
							oninput="if(value.length>10)value=value.slice(0,10)"
							v-decorator="['profileLength',{rules: [{ required: true, message: '请填写长度' },{validator: chickNumber}]}]"
							style="width:114px;"
						></a-input>&nbsp;±
						<a-input
							type="number"
							placeholder="单位:mm"
							oninput="if(value.length>10)value=value.slice(0,10);if(value<0)value=null"
							v-decorator="['profileLengthError']"
							style="width:114px;"
						></a-input>
					</a-form-item>
				</a-col>
			</a-col>
			<a-col :span="24">
				<a-form-item label="备注">
					<a-input v-decorator="['remarks']" maxlength="50" style="width:820px;"></a-input>
				</a-form-item>
			</a-col>
			<a-col :span="24">
				<h3>
					<i class="iconfont" style="font-size:16px;color:#1890ff">&#xe603;</i>排配信息
				</h3>
			</a-col>
			<a-col :span="24">
				<a-table :pagination="false" :columns="columns" :dataSource="data" bordered rowKey="id">
					<template v-for="col in ['remarks']" :slot="col" slot-scope="text, record, index">
						<div :key="col">
							<a-input
								maxlength="20"
								style="margin: -5px 0"
								:value="text"
								@change="e => handleChangeTable(e.target.value, record.id, col)"
							/>
						</div>
					</template>
					<template slot="processInfo" slot-scope="text, record, index">
						<div>
							<a-textarea
								:autosize="{ minRows: 2, maxRows: 2 }"
								style="margin: -5px 0"
								:value="text"
								@change="e => handleChangeTable(e.target.value, record.id, 'processInfo')"
								maxlength="100"
							></a-textarea>
						</div>
					</template>
					<!-- <template slot="workingHours" slot-scope="text, record, index">
						<div>
							<a-input
								type="number"
								oninput="if(value.length>10)value=value.slice(0,10)"
								style="margin: -5px 0"
								:value="text"
								@change="e => handleChangeTable(e.target.value, record.id, 'workingHours')"
							/>
						</div>
					</template>-->
					<template slot="chick" slot-scope="text, record, index">
						<div>
							<a-input maxlength="20" style="margin: -5px 0" :value="record.checkerName" disabled />
						</div>
					</template>
					<template slot="serialNo" slot-scope="text, record, index">
						<span class="serial_number">{{index+1}}</span>
					</template>
					<template slot="workTypeId" slot-scope="text, record, index">
						<div>
							<a-select
								style
								@change="(a,b)=>getProcessTypesId(a,b,record,index)"
								:value="text"
								placeholder="请选择"
								showSearch
								:filterOption="filterOption"
							>
								<a-select-option :value="i.id" v-for="i in processTypesList" :key="i.id">{{i.workTypeName}}</a-select-option>
							</a-select>
						</div>
					</template>
					<template slot="employeeId" slot-scope="text, record, index">
						<div>
							<a-input maxlength="20" style="margin: -5px 0" :value="record.employeeName" disabled />
							<!-- <a-select
								style
								:value="text"
								@change="(a,b)=>getEmployeeId(a,b,record,index)"
								placeholder="请选择"
								showSearch
								:filterOption="filterOption"
								disabled
							>
								<a-select-option
									:value="item.id"
									v-for="(item, index) in employeeList"
									:key="index"
								>{{item.userName}}</a-select-option>
							</a-select>-->
						</div>
					</template>
					<template slot="operation" slot-scope="text, record, index">
						<div class="editable-row-operations">
							<span class="handle_style">
								<a-popconfirm title="确定删除吗？" @confirm="onDelete(index)" okText="确定" cancelText="取消">
									<a-popover placement="top">
										<template slot="content">
											<span>删除</span>
										</template>
										<a-icon type="delete" style="color:red;" />
									</a-popover>
								</a-popconfirm>
							</span>
						</div>
					</template>
				</a-table>
				<div
					@click="handleAdd"
					style=" cursor: pointer;color:#1890ff;margin-top:12px;display:inline-block;"
					class="handle_table"
				>
					<a-icon type="plus-circle" />&nbsp;添加一行
				</div>
			</a-col>
			<a-col :span="24">
				<a-form-item style="display:block;text-align:right;margin-bottom:0;margin-top:20px;">
					<a-button @click="handleCancel" style="margin-right:12px;">取消</a-button>
					<a-button type="primary" @click="update">保存</a-button>
				</a-form-item>
			</a-col>
		</a-form>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Table,
	Col,
	Row,
	Popover,
	Progress,
	Form,
	Input,
	Select
} from "ant-design-vue";
Vue.use(Table);
Vue.use(Col);
Vue.use(Row);
Vue.use(Popover);
Vue.use(Progress);
Vue.use(Form);
Vue.use(Input);
Vue.use(Select);
const columns = [
	{
		dataIndex: "serialNo",
		title: "序号",
		width: 30,
		key: "serialNo",
		align: "center",
		scopedSlots: { customRender: "serialNo" }
	},
	{
		dataIndex: "workTypeId",
		title: "工种",
		width: 100,
		key: "workTypeId",
		scopedSlots: { customRender: "workTypeId" }
	},
	{
		dataIndex: "processInfo",
		key: "processInfo",
		title: "工序内容",
		width: 200,
		scopedSlots: { customRender: "processInfo" }
	},
	// {
	// 	dataIndex: "workingHours",
	// 	key: "workingHours",
	// 	title: "工时(h)",
	// 	width: 50,
	// 	scopedSlots: { customRender: "workingHours" }
	// },
	{
		dataIndex: "employeeId",
		key: "employeeId",
		title: "班组长",
		width: 60,
		scopedSlots: { customRender: "employeeId" }
	},
	{
		dataIndex: "checkerName",
		key: "checkerName",
		title: "检验人",
		width: 60,
		scopedSlots: { customRender: "chick" }
	},
	{
		dataIndex: "remarks",
		key: "remarks",
		title: "备注",
		width: 60,
		scopedSlots: { customRender: "remarks" }
	},
	{
		dataIndex: "operation",
		key: "operation",
		title: "操作",
		width: 40,
		align: "center",
		scopedSlots: { customRender: "operation" }
	}
];
export default {
	props: {
		drawingMsg: {
			default: null
		},
		chicker: {
			default: null
		},
		employeeList: {
			default: null
		}
	},
	data() {
		return {
			columns,
			form: this.$form.createForm(this),
			formMsg: {},
			materialVlaue: null,
			bordList: [],
			stickList: [],
			profileList: [],
			processTypesList: [],
			materialList: [],
			data: [
				// {
				// 	id: 99,
				// 	workTypeId: "",
				// 	processInfo: "",
				// 	workingHours: "",
				// 	employeeId: "",
				// 	remarks: "",
				// 	employee: []
				// }
			],
			count: 1000
			// employeeList: []
		};
	},
	methods: {
		chickNumber(rule, value, callback) {
			if (
				/^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入大于等于0，只能保留两位小数"));
			} else {
				callback();
			}
		},
		getProfileList() {
			this.Axios(
				{
					url: "/api-workorder/rawMaterial/list",
					params: {
						page: 1,
						size: -1,
						type: 3
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result.data.data);
						this.profileList = result.data.data;
					}
				},
				({ type, info }) => {}
			);
		},
		findChicker() {
			this.Axios(
				{
					url: "/api-platform/employee/findChecker",
					params: {},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result.data.data);
						this.chicker = result.data.data;
					}
				},
				({ type, info }) => {}
			);
		},
		filterOption(input, option) {
			return (
				option.componentOptions.children[0].text
					.toLowerCase()
					.indexOf(input.toLowerCase()) >= 0
			);
		},
		handleCancel() {
			// this.form.resetFields();
			let params = {
				type: "Cancel",
				value: false
			};
			this.$emit("editTechnology", params);
			console.log(params);
		},
		handleChangeTable(value, key, column) {
			const newData = [...this.data];
			const target = newData.filter(item => key === item.id)[0];
			if (target) {
				target[column] = value;
				this.data = newData;
			}
		},
		update() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log(values);
					console.log(this.data);
					if (this.data.length < 1) {
						this.$message.error(`请填写排配信息`);
						return false;
					}
					if (
						this.data
							.map(item => {
								return item.workTypeId != "";
							})
							.find(item => item == false) != undefined
					) {
						this.$message.error(`排配信息中有未选择工种`);
						return false;
					}
					// if (
					// 	this.data
					// 		.map(item => {
					// 			return item.processInfo != "";
					// 		})
					// 		.find(item => item == false) != undefined
					// ) {
					// 	this.$message.error(`排配信息中有未填写工序内容`);
					// 	return false;
					// }
					// if (
					// 	this.data
					// 		.map(item => {
					// 			return item.workingHours != "";
					// 		})
					// 		.find(item => item == false) != undefined
					// ) {
					// 	this.$message.error(`排配信息中有未填写工时`);
					// 	return false;
					// }
					// if (
					// 	this.data
					// 		.map(item => {
					// 			return (
					// 				/^\d+(\.\d{0,2})?$/.test(item.workingHours) &&
					// 				item.workingHours > 0
					// 			);
					// 		})
					// 		.find(item => item == false) != undefined
					// ) {
					// 	this.$message.error(`排配信息中工时必须大于0,且只能保留两位小数`);
					// 	return false;
					// }
					if (
						this.data
							.map(item => {
								return item.employeeId != "";
							})
							.find(item => item == false) != undefined
					) {
						this.$message.error(`排配信息中有未选择班组长`);
						return false;
					}
					let qs = require("qs");
					let data;
					console.log(values);
					if (values.type == 1) {
						data = {
							workOrderDesId: this.formMsg.workOrderDesId,
							embryoNum: values.embryoNum,
							heightOrLength: values.height,
							heightOrLengthError:
								values.heightError == null || values.heightError == ""
									? 0
									: values.heightError,
							inTheEmbryoComponents: values.inTheEmbryoComponents,
							lengthOrRadius: values.length1,
							lengthOrRadiusError:
								values.lengthError == null || values.lengthError == ""
									? 0
									: values.lengthError,
							widthOrRadiusError:
								values.widthError == null || values.widthError == ""
									? 0
									: values.widthError,
							rawMaterialId: values.rawMaterialId,
							widthOrRadius: values.width,
							remarks: values.remarks,
							processDTOS: this.data.map(item => {
								return {
									checkerId: item.checkerId,
									employeeId: item.employeeId,
									processInfo: item.processInfo,
									remarks: item.remarks,
									workTypeId: item.workTypeId
									// workingHours: item.workingHours
								};
							})
						};
					}
					if (values.type == 2) {
						data = {
							workOrderDesId: this.formMsg.workOrderDesId,
							embryoNum: values.embryoNum,
							heightOrLength: values.stickLength,
							heightOrLengthError:
								values.stickLengthError == null || values.stickLengthError == ""
									? 0
									: values.stickLengthError,
							inTheEmbryoComponents: values.inTheEmbryoComponents,
							lengthOrRadius: values.radius,
							lengthOrRadiusError:
								values.radiusError == null || values.radiusError == ""
									? 0
									: values.radiusError,
							widthOrRadiusError:
								values.radiusError == null || values.radiusError == ""
									? 0
									: values.radiusError,
							rawMaterialId: values.rawMaterialId,
							widthOrRadius: values.radius,
							remarks: values.remarks,
							processDTOS: this.data.map(item => {
								return {
									checkerId: item.checkerId,
									employeeId: item.employeeId,
									processInfo: item.processInfo,
									remarks: item.remarks,
									workTypeId: item.workTypeId
									// workingHours: item.workingHours
								};
							})
						};
					}
					if (values.type == 3) {
						data = {
							workOrderDesId: this.formMsg.workOrderDesId,
							embryoNum: values.embryoNum,
							heightOrLength: 1,
							heightOrLengthError: 0,
							inTheEmbryoComponents: values.inTheEmbryoComponents,
							lengthOrRadius: values.profileLength,
							lengthOrRadiusError:
								values.profileLengthError == null ||
								values.profileLengthError == ""
									? 0
									: values.profileLengthError,
							widthOrRadiusError: 0,
							rawMaterialId: values.rawMaterialId,
							widthOrRadius: 1,
							remarks: values.remarks,
							processDTOS: this.data.map(item => {
								return {
									checkerId: item.checkerId,
									employeeId: item.employeeId,
									processInfo: item.processInfo,
									remarks: item.remarks,
									workTypeId: item.workTypeId,
									checkerId: item.checkerId
									// workingHours: item.workingHours
								};
							})
						};
					}
					console.log(data);
					this.Axios(
						{
							url: "/api-workorder/drawing/update",
							params: data,
							type: "post",
							option: { successMsg: "修改成功！" },
							config: {
								headers: { "Content-Type": "application/json" }
							}
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								let params = {
									type: "affirm",
									value: false
								};
								this.$emit("editTechnology", params);
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		getOneDetails(id) {
			this.Axios(
				{
					url: "/api-workorder/drawing/detail",
					params: {
						workOrderDesId: id
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						if (result.data.data.rawMaterialDOS != null) {
							this.materialList = result.data.data.rawMaterialDOS;
						}
						if (result.data.data.process.length > 0) {
							for (let i = 0; i < result.data.data.process.length; i++) {
								result.data.data.process[i].employeeId =
									result.data.data.process[i].principalEmployeeId;
								result.data.data.process[i].employeeName =
									result.data.data.process[i].principalEmployeeName;
							}
							console.log(result.data.data.process[0].employeeId);
							if (result.data.data.process[0].employeeId) {
								this.data = result.data.data.process;
							}
						}
						this.materialVlaue =
							result.data.data.rawMaterialDO != null
								? result.data.data.rawMaterialDO.type
								: null;
						setTimeout(() => {
							this.form.setFieldsValue({
								profileLength: result.data.data.lengthOrRadius,
								profileLengthError: result.data.data.lengthOrRadiusError,
								length1: result.data.data.lengthOrRadius,
								lengthError: result.data.data.lengthOrRadiusError,
								width: result.data.data.widthOrRadius,
								widthError: result.data.data.widthOrRadiusError,
								height: result.data.data.heightOrLength,
								heightError: result.data.data.heightOrLengthError,
								remarks: result.data.data.remarks,
								radius: result.data.data.lengthOrRadius,
								radiusError: result.data.data.lengthOrRadiusError,
								stickLength: result.data.data.heightOrLength,
								stickLengthError: result.data.data.heightOrLengthError,
								rawMaterialId:
									result.data.data.rawMaterialDO != null
										? result.data.data.rawMaterialDO.id
										: "",
								type:
									result.data.data.rawMaterialDO != null
										? result.data.data.rawMaterialDO.type
										: "",
								inTheEmbryoComponents:
									result.data.data.inTheEmbryoComponents != null
										? result.data.data.inTheEmbryoComponents
										: 1,
								embryoNum: Math.ceil(
									this.formMsg.num /
										(result.data.data.inTheEmbryoComponents != null
											? result.data.data.inTheEmbryoComponents
											: 1)
								)
							});
						}, 100);
					}
				},
				({ type, info }) => {}
			);
		},
		getBordList() {
			this.Axios(
				{
					url: "/api-workorder/rawMaterial/list",
					params: {
						page: 1,
						size: -1,
						type: 1
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.bordList = result.data.data;
					}
				},
				({ type, info }) => {}
			);
		},
		getStickList() {
			this.Axios(
				{
					url: "/api-workorder/rawMaterial/list",
					params: {
						page: 1,
						size: -1,
						type: 2
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.stickList = result.data.data;
					}
				},
				({ type, info }) => {}
			);
		},
		getProcessTypesList() {
			this.Axios(
				{
					url: "/api-platform/workType/list",
					params: {
						page: 1,
						size: -1
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.processTypesList = result.data.data;
						this.processTypesList = this.processTypesList.map(item => {
							return {
								workTypeName:
									item.workTypeName +
									(item.remarks != null ? " (" + item.remarks + ")" : ""),
								id: item.id
							};
						});
					}
				},
				({ type, info }) => {}
			);
		},
		geteMbryoNum(e) {
			setTimeout(() => {
				this.form.setFieldsValue({
					embryoNum:
						Math.ceil(this.formMsg.num / e.target.value) != Infinity
							? Math.ceil(this.formMsg.num / e.target.value)
							: 0
				});
			}, 100);
		},
		handleMaterial(a) {
			this.materialVlaue = a;
			if (a == 1) {
				this.materialList = [...this.bordList];
				setTimeout(() => {
					this.form.setFieldsValue({
						rawMaterialId: "",
						radius: "",
						radiusError: "",
						length1: "",
						lengthError: ""
					});
				}, 100);
				return false;
			}
			if (a == 2) {
				this.materialList = [...this.stickList];
				setTimeout(() => {
					this.form.setFieldsValue({
						rawMaterialId: "",
						length1: "",
						lengthError: "",
						width: "",
						widthError: "",
						height: "",
						heightError: ""
					});
				}, 100);
				return false;
			}
			if (a == 3) {
				this.materialList = [...this.profileList];
				setTimeout(() => {
					this.form.setFieldsValue({
						rawMaterialId: "",
						length1: "",
						lengthError: "",
						width: "",
						widthError: "",
						height: "",
						heightError: "",
						radius: "",
						radiusError: "",
						stickLength: "",
						stickLengthError: ""
					});
				}, 100);
				return false;
			}
		},
		handleAdd() {
			const { count, data } = this;
			const newData = {
				id: count,
				workTypeId: "",
				processInfo: "",
				workingHours: "",
				employeeId: "",
				employeeName: "",
				remarks: "",
				employee: [],
				checkerId: this.chicker.id,
				checkerName: this.chicker.userName
			};
			this.data = [...data, newData];
			this.count = count + 1;
		},
		onDelete(key) {
			this.data.splice(key, 1);
		},
		getProcessTypesId(a, b, row, index) {
			console.log(a, index);
			this.data[index].workTypeId = a;
			this.data[index].employeeId = "";
			this.data[index].employeeName = "";
			this.Axios(
				{
					url: "/api-platform/employee/byWorkTypeRoleCode",
					params: {
						workTypeId: a
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						// this.employeeList[index] = result.data.data;
						if (result.data.data[0] != undefined) {
							this.data[index].employeeId = result.data.data[0].id;
							this.data[index].employeeName = result.data.data[0].userName;
						}
						let abc = [...this.data];
						this.data = abc;
						// this.data[index].employee = result.data.data;
						// console.log(this.data[index].employee);
					}
				},
				({ type, info }) => {}
			);
		},
		getEmployeeId(a, b, row, index) {
			console.log(a, b, row, index);
			this.data[index].employeeId = a;
			let abc = [...this.data];
			this.data = abc;
		}
	},
	created() {
		if (this.drawingMsg != "" && this.drawingMsg != null) {
			this.formMsg = { ...this.drawingMsg };
			this.getOneDetails(this.formMsg.workOrderDesId);
			this.getBordList();
			this.getStickList();
			this.getProcessTypesList();
			this.getProfileList();
		}
	},
	watch: {
		drawingMsg() {
			if (this.drawingMsg != "" && this.drawingMsg != null) {
				this.formMsg = { ...this.drawingMsg };
				this.getOneDetails(this.formMsg.workOrderDesId);
				this.getBordList();
				this.getStickList();
				this.getProcessTypesList();
				this.getProfileList();
			}
		}
	}
};
</script>
<style lang="less">
.technology_edit {
	overflow: hidden;
	.ant-form-inline .ant-form-item > .ant-form-item-label {
		width: 134px;
	}
	.ant-form-inline .ant-form-item {
		margin-bottom: 12px;
	}
	.ant-input-number-handler-wrap {
		display: none;
	}
	.table_style {
		padding-left: 20px;
		span {
			display: inline-block;
		}
	}
	.serial_number {
		display: inline-block;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background-color: #f2f2f2f2;
		line-height: 25px;
		text-align: center;
	}
	.ant-table-thead > tr > th,
	.ant-table-tbody > tr > td {
		padding: 8px 4px;
	}
}
</style>