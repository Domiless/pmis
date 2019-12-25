<template>
    <div class="assignBuyer">
    <a-form :form="form">
        <a-row style="margin-bottom: 10px">
            <a-col :span="12">
                <span class="label_right">采购单号: </span>
				<span>{{orderMsg.bomNo}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">项目名称: </span>
				<span>{{orderMsg.projectName}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">项目订单编号: </span>
				<span>{{orderMsg.workOrderNo}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">业务归口部门: </span>
				<span>{{orderMsg.relevant}}</span>
            </a-col>
        </a-row>
        <a-row class="second_row">
            <a-col :span="24">
                <span>指派采购员：</span>
                <a-select
                 style="width: 240px"
                 @change="handleChange" 
                 placeholder="请选择"
                 :labelInValue="true"
                 v-model="defaultValue"
                >
                    <a-select-option v-for="i in buyerArr" :key="i.id" :value="i.id">{{ i.name }}</a-select-option>
                </a-select>
                <permission-button
                    permCode
                    banType="hide"
                    @click="setBuyer"
                    :disabled="selectedRowKeys.length == 0 || buyerValue.length == 0"
                    type="primary"
                >
				分配
			</permission-button>
            </a-col>
        </a-row>
        <a-row>
            <a-table
                rowKey="id"
                :columns="columns"
                :dataSource="data"
                :pagination="false"
                :scroll="{ y: 400 }"
                :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange,
                                getCheckboxProps: record => ({
                                                props: {
                                                disabled: record.isOffer === 1,
                                                }
                                })}"
            >
                <!-- <span slot="appointNameTitle">
                    <span style="color: #f5222d">*</span>指派采购员
                </span>
                <template slot="appointName" slot-scope="text,record">
                    <a-select
                    style="width: 100%"
                    @change="(value,option) => {
                        let value1 = value;
                        handleChangeTable(value1, record.id, 'appointName')
                        }"
                    >
                        <a-select-option
                            v-for="item in buyerArr"
                            :value="item.name"
                            :key="item.id"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </template> -->
            </a-table>
        </a-row>
        <a-row>
            <a-form-item :wrapper-col="{ span: 22,offset: 2 }" style="text-align:right">
                <a-button style="margin-right:12px;" @click="close">关闭</a-button>
                <a-button type="primary" @click="submit">提交</a-button>
            </a-form-item>
        </a-row>
    </a-form>    
    </div>
</template>
<script>
import { log } from 'util';
const columns = [
    // {
	// 	dataIndex: "drawingNo",
	// 	title: "图号",
	// 	key: "drawingNo",
	// 	width: "20%"
	// },
	{
		dataIndex: "name",
		title: "名称",
		key: "name",
		width: "30%"
	},
	{
		dataIndex: "brand",
		title: "指定品牌",
		key: "brand",
		width: "30%"
	},
	{
		dataIndex: "addNum",
		title: "需求数量",
		key: "addNum",
		width: "20%"
	},
	{
		dataIndex: "appointName",
		title: "采购员",
        key: "appointName",
        // slots: { title: "appointNameTitle" },
		// scopedSlots: { customRender: "appointName" },
		width: "20%"
	},
]
export default {
    props: {
        orderId: {
            default: ''
        },
    },
    data() {
        return {
            form: this.$form.createForm(this),
            data: [],
            columns,
            buyerArr: [],
            buyerValue: [],
            appointId: '',
            selectedRows: [],
            selectedRowKeys: [],
            defaultValue: '',
            copyData: [],
            orderMsg: []
        }
    },
    methods: {
         close() {
            this.$emit("changeAssignOrder", false);
            this.selectedRowKeys = [];
            this.defaultValue = ''
        },
        onSelectChange(selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys;
			this.selectedRows = selectedRows;
			console.log(this.selectedRowKeys);
			console.log(this.selectedRows);
        },
        setBuyer() {
            for(let i = 0; i < this.selectedRowKeys.length; i++) {
                this.handleChangeTable(this.buyerValue.label,this.selectedRowKeys[i],"appointName");
            }
            this.selectedRowKeys = [];
        },
        handleChange(value, option) {
            console.log(value);
            this.buyerValue = value;
        },
        submit() {
            const that = this;
            this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                console.log("Received values of form: ", values);
                // if (!this.checkedKeys.length) {
                // 	this.$message.error("请分配角色权限");
                // 	return false;
                // }
                let qs = require("qs");
                let data = this.data.map(item => {
                                return {
                                    id: item.id,
                                    appointId: item.appointId,
                                    appointName: item.appointName
                                }
                            })
                data = data.filter((item,index,arr) => { return !(!item.appointName && typeof(item.appointName)!='undefined' && item.appointName!=0) });
                let data2 = [];
                for( let i = 0; i < data.length; i ++) {
                    var item = data[i];
                    var num = data[i].id;
                    var appointNum = data[i].appointId;
                    for( let j = 0; j < this.copyData.length; j ++) {
                        if(num == this.copyData[j].id && appointNum !== this.copyData[j].appointId) {
                            data2.push(item);
                        }
                    }
                }
                console.log(data);
                console.log(data2);
                console.log(this.copyData);
                if( data.length == 0 || data2.length == 0 ) {
                    return this.$message.error(`请指派采购员`);
                }
                this.Axios(
                    {
                    url: "/api-order/bom/setBomPoint",
                    params: data2,
                    type: "post",
                    option: { successMsg: "添加成功！" },
                    config: {
                        headers: { "Content-Type": "application/json" }
                    }
                    },
                    this
                ).then(
                    result => {
                    if (result.data.code === 200) {
                        console.log(result);
                        this.close();
                        this.form.resetFields();
                        
                    }
                    },
                        ({ type, info }) => {});
                        }
                    });
        },
        handleChangeTable(value, key, column) {
            console.log(value);
            console.log(key);
            console.log(column);

            const newData = [...this.data];
            const target = newData.filter(item => key === item.id)[0];
            if (target) {
                target[column] = value;
                this.data = newData;
            }
            for(let i = 0; i < this.buyerArr.length; i++) {
                if(this.buyerArr[i].name == value) {
                    this.appointId = this.buyerArr[i].userId;
                }
            }
            for(let i = 0; i < this.data.length; i++) {
                if(this.data[i].appointName == value) {
                    this.data[i].appointId = this.appointId;
                }
            }
            console.log(this.data);
            console.log(this.copyData);
        },
        getBuyer() {
            this.Axios(
				{
					url: "/api-order/buyer/list",
					type: "get",
					params: {},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
                        console.log(result);
                        this.buyerArr = result.data.data.content;
					}
				},
				({ type, info }) => {}
			);
        },
        getList(id) {
            this.Axios(
				{
					url: "/api-order/bom/findone",
					type: "get",
					params: {
						id: id
					},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
                        console.log(result);
                        this.orderMsg = result.data.data;
                        this.data = result.data.data.bomDes;
                        this.copyData = JSON.parse(JSON.stringify(this.data));
                        console.log(this.copyData);
					}
				},
				({ type, info }) => {}
			);
        }
    },
    created() {
        this.getList(this.orderId);
        this.getBuyer();
    },
    watch: {
        orderId() {
            if(this.orderId != '') {
                this.getList(this.orderId);
                this.getBuyer();
            }
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
        width: 90px;
        text-align: right;
    }
    .second_row {
        margin-top: 20px;
        margin-bottom: 10px;
    }
}
</style>