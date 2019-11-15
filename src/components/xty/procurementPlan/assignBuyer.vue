<template>
    <div class="assignBuyer">
    <a-form :form="form">
        <a-row style="margin-bottom: 10px">
            <a-col :span="12">
                <span class="label_right">项目订单编号: </span>
				<span>{{orderMsg.workOrderNo}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">设计单号: </span>
				<span>{{orderMsg.bomNo}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">部件名称: </span>
				<span>{{orderMsg.partName}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">图号: </span>
				<span>{{orderMsg.bomDrawingNo}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">设计负责人: </span>
				<span>{{orderMsg.production}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">创建时间: </span>
				<span>{{orderMsg.gmtCreated}}</span>
            </a-col>
        </a-row>
        <a-row>
            <a-table
                rowKey="id"
                :columns="columns"
                :dataSource="data"
                :pagination="false"
            >
                <span slot="appointNameTitle">
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
                </template>
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
const columns = [
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
		width: "30%"
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
        slots: { title: "appointNameTitle" },
		scopedSlots: { customRender: "appointName" },
		width: "20%"
	},
]
export default {
    props: {
        orderMsg: {
            default: ''
        }
    },
    data() {
        return {
            form: this.$form.createForm(this),
            data: [],
            columns,
            buyerArr: [],
            appointId: ''
        }
    },
    methods: {
         close() {
            this.$emit("cancelAssign", false);
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
                console.log(data);
                this.Axios(
                    {
                    url: "/api-order/bom/setBomPoint",
                    params: data,
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
                        ({ type, info }) => {}
                            );
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
        getList() {
            this.Axios(
				{
					url: "/api-order/bom/getBomdes",
					type: "get",
					params: {
						bomIdS: this.orderMsg.id
					},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.data = result.data.data;
					}
				},
				({ type, info }) => {}
			);
        }
    },
    created() {
        this.getList();
        this.getBuyer();
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