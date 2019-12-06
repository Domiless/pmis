<template>
    <div class="add_backStock">
        <a-row style="line-height:50px;">
			<a-button @click="$router.back(-1)" icon="left">返回</a-button>
		</a-row>
        <a-row>
            <a-form :form="form">
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="单据类型">
					<a-input
                        v-decorator="[
                        'invoicesType',
                        {rules: [{ required: true, message: '请填写单据类型' }]}
                        ]"
                        maxlength="10"
                        disabled
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="单据编号">
					<a-input
                        v-decorator="[
                        'invoicesNo',
                        {rules: [{ required: true, message: '请填写单据编号' }]}
                        ]"
                        maxlength="20"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="原始单据号">
					<a-input
                        v-decorator="['originalInvoicesNo']"
                        maxlength="20"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="退料部门">
					<a-input
                        v-decorator="[
                        'backDepartment',
                        {rules: [{ required: true, message: '请填写退料部门' }]}
                        ]"
                        maxlength="10"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="返回仓库">
					<a-select placeholder="请选择" 
                        v-decorator="[
                        'backWarehouse',
                        {rules: [{ required: true, message: '请选择返回仓库' }]}
                        ]">
                        <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                    </a-select>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="入库日期">
                    <a-date-picker 
                        style="width:100%;"
                        @change="onChangeSign" 
                        v-decorator="['stockDate']" 
                        format="YYYY/MM/DD HH:MM:SS"/>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="经办人">
					<a-input
                        v-decorator="[
                        'transactor',
                        {rules: [{ required: true, message: '请填写经办人' }]}
                        ]"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="制单人">
					<a-input
                        v-decorator="['preparedBy']"
                        disabled
                        maxlength="10"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="备注">
					<a-textarea 
                        v-decorator="['remark']" 
                        :rows="4" 
                        :autosize="{ minRows: 4, maxRows: 4}"
                    ></a-textarea>
				</a-form-item>
            <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id">
                <span slot="numberTitle">
                <span style="color: #f5222d">*</span>数量
                </span>
                <template slot="xuanzewuliao" slot-scope="text, record, index">
                <div class="choice">
                    <span style="color:#1890FF;cursor: pointer;" @click="choiceModalShow(index)">
                    <i class="iconfont" style="margin-right:8px;">&#xe647;</i>选择
                    </span>
                </div>
                </template>
                <template slot="index" slot-scope="text, record, index">
                <span>{{index+1}}</span>
                </template>
                <template slot="number" slot-scope="text, record, index">
                <a-input
                    type="number"
                    oninput="if(value.length>10)value=value.slice(0,10)"
                    :value="text"
                    @change="(e)=>handleInputChange(e.target.value, record.id, 'number')"
                ></a-input>
                </template>
                <template slot="note" slot-scope="text, record, index">
                <a-input
                    maxlength="50"
                    :value="text"
                    @change="(e)=>handleInputChange(e.target.value, record.id, 'note')"
                ></a-input>
                </template>
                <template slot="caozuo" slot-scope="text, record, index">
                    <a-popover placement="top">
                    <template slot="content">
                        <span>删除</span>
                    </template>
                    <permission-button
                        permCode
                        banType="disabled"
                        class="button_text btn_disabled"
                        @click="delRow(record,index)"
                    >
                        <a-icon type="delete" style="color:red;" />
                    </permission-button>
                    </a-popover>
                </template>
            </a-table>
                <div style="padding:12px 0;">
                    <a style="color:#1890FF;cursor: pointer;" href="javascript:" @click="choiceModalShow()">
                    <a-icon type="plus" style="font-size:18px;margin-right:8px;" />添加
                    </a>
                </div>
                <a-form-item style="display:block;margin-bottom:0;">
                    <!-- <a-button style="margin-right:12px;">取消</a-button> -->
                    <a-button type="primary" @click="save">保存</a-button>
                </a-form-item>
            </a-form>
        </a-row>
        <a-row>
            <a-modal
                title="选择物料"
                v-model="choiceShow"
                :footer="null"
                :destroyOnClose="true"
                :mask="false"
                :closable="true"
                width="800px"
                centered
                >
                <materialList v-on:choisceMsg="choisceMsg"></materialList>
            </a-modal>
        </a-row>
    </div>
</template>
<script>
import materialList from "../../../public/materialList";
const columns = [
  {
    dataIndex: "index",
    key: "index",
    title: "",
    width: 40,
    scopedSlots: { customRender: "index" },
    align: "center"
  },
//   {
//     dataIndex: "xuanzewuliao",
//     key: "xuanzewuliao",
//     title: "选择物料",
//     width: 80,
//     scopedSlots: { customRender: "xuanzewuliao" }
//   },
  {
    dataIndex: "code",
    key: "code",
    title: "物料编码",
    width: 120
  },
  {
    dataIndex: "drawingCode",
    key: "drawingCode",
    title: "图号",
    width: 140
  },
  {
    dataIndex: "name",
    key: "name",
    title: "名称",
    width: 140
  },
  {
    dataIndex: "specification",
    key: "specification",
    title: "型号/规格",
    width: 140
  },
  {
    dataIndex: "unit",
    key: "unit",
    title: "单位",
    width: 80
  },
  {
    dataIndex: "amount",
    key: "amount",
    title: "库存数量",
    width: 100
  },
  {
    dataIndex: "number",
    key: "number",
    // title: "数量",
    width: 120,
    scopedSlots: { customRender: "number" },
    slots: { title: "numberTitle" }
  },
  {
    dataIndex: "classification.name",
    key: "classification.name",
    title: "物料分类",
    width: 100
  },
  {
    dataIndex: "note",
    key: "note",
    title: "备注",
    width: 160,
    scopedSlots: { customRender: "note" }
  },
  {
    dataIndex: "caozuo",
    key: "caozuo",
    title: "操作",
    width: 60,
    scopedSlots: { customRender: "caozuo" },
    align: "center"
  }
];
export default {
    data() {
        return {
            form: this.$form.createForm(this),
            signDate: '',
            choiceShow: false,
            columns,
            data: [],
            warehouseList: []
        }
    },
    methods: {
        delRow(row, index) {
            console.log(index);
            this.data.splice(index, 1);
        },
        choisceMsg(a) {
            console.log(a);
            // this.choiceShow = false;
            if (
                this.data.find(item => {
                return item.id == a.id;
                })
            ) {
                this.$message.error(`该条数据已被选择`);
                return false;
            }
            this.data.push(a);
        },
        onChangeSign(data,dateString) {
            this.signDate = dateString;
            console.log(this.signDate);
        },
        choiceModalShow(index) {
            console.log(index);
            this.choiceShow = true;
        },
        handleInputChange(value, key, column) {
            const newData = [...this.data];
            const target = newData.filter(item => key === item.id)[0];
            if (target) {
                target[column] = value;
                this.data = newData;
            }
        },
        getCode() {
            this.Axios(
                {
                url: "/api-warehouse/order/code",
                type: "get",
                params: {},
                option: { enableMsg: false }
                },
                this
            ).then(
                result => {
                if (result.data.code === 200) {
                    console.log(result);
                    this.form.setFieldsValue({
                        invoicesNo: result.data.data
                    })
                }
                },
                ({ type, info }) => {}
            );
        },
        getWareHouseList() {
            this.Axios(
                {
                url: "/api-warehouse/warehouse/list",
                type: "get",
                params: {
                    page: -1
                },
                option: { enableMsg: false }
                },
                this
            ).then(
                result => {
                if (result.data.code === 200) {
                    console.log(result);
                    this.warehouseList = result.data.data;
                }
                },
                ({ type, info }) => {}
            );
        },
        save() {
            this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log("Received values of form: ", values);
					// if (!this.checkedKeys.length) {
					// 	this.$message.error("请分配角色权限");
					// 	return false;
					// }
					let data = {
                        code: values.invoicesNo,
                        dataSource: "RETRUE",
                        fromName: values.backDepartment,
                        date: this.signDate,
                        handlerName: values.transactor,
                        warehouseId: values.backWarehouse,
                        oldOrderCode: values.originalInvoicesNo,
                        note: values.remark,
                        orderItemList: this.data.map(item => {
                                    return {
                                        code: item.code,
                                        drawingNo: item.drawingCode,
                                        name: item.name,
                                        note: item.note,
                                        orderAmount: item.number,
                                        specification: item.specification,
                                        unit: item.unit,
                                        warehouseUnit: item.unit
                                    }
                        })
                        };
					console.log(data);
					this.Axios(
						{
							url: "/api-warehouse/order/add",
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
                                this.form.resetFields();
                                this.$router.back(-1);
							}
						},
						({ type, info }) => {}
					);
				}
            });
        }
    },
    components: {
        materialList
    },
    created() {
        this.getWareHouseList();
        this.getCode();
        
    },
    mounted() {
        this.form.setFieldsValue({
            invoicesType: "退料入库",
            preparedBy: JSON.parse(sessionStorage.getItem('user')).userName
        })
    }
}
</script>
<style lang="less">
.add_backStock {
   overflow: hidden;
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 4px 4px;
  }
  .choice {
    position: relative;
    // .choice_show_style {
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    // }
  }
}
</style>