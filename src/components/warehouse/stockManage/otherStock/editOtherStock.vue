<template>
    <div class="edit_otherStock">
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
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="物料来源">
					<a-input
                        v-decorator="[
                        'backDepartment',
                        {rules: [{ required: true, message: '请填写物料来源' }]}
                        ]"
                        maxlength="10"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="收货仓库">
					<a-input
                        v-decorator="[
                        'backWarehouse',
                        {rules: [{ required: true, message: '请填写收货仓库' }]}
                        ]"
                        maxlength="10"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="入库日期">
                    <a-date-picker 
                        style="width:100%;"
                        @change="onChangeSign" 
                        v-decorator="['stockDate']" 
                        format="YYYY/MM/DD"/>
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
                <span slot="shuliangTitle">
                <span style="color: #f5222d">*</span>数量
                </span>
                <template slot="xuanzewuliao" slot-scope="text, record, index">
                <div class="choice">
                    <span style="color:#1890FF;cursor: pointer;" @click="choiceModalShow(index)">
                    <i class="iconfont" style="margin-right:8px;">&#xe647;</i>选择
                    </span>
                </div>
                </template>
                <template slot="xuhao" slot-scope="text, record, index">
                <span>{{index+1}}</span>
                </template>
                <template slot="shuliang" slot-scope="text, record, index">
                <a-input
                    type="number"
                    oninput="if(value.length>10)value=value.slice(0,10)"
                    :value="text"
                    @change="(e)=>handleInputChange(e.target.value, record.id, 'shuliang')"
                ></a-input>
                </template>
                <template slot="beizhu" slot-scope="text, record, index">
                <a-input
                    maxlength="50"
                    :value="text"
                    @change="(e)=>handleInputChange(e.target.value, record.id, 'beizhu')"
                ></a-input>
                </template>
            </a-table>
                <div style="padding:12px 0;">
                    <a style="color:#1890FF;cursor: pointer;" href="javascript:">
                    <a-icon type="plus" style="font-size:18px;margin-right:8px;" />添加
                    </a>
                </div>
                <a-form-item style="display:block;text-align:right;margin-bottom:0;">
                    <a-button style="margin-right:12px;">取消</a-button>
                    <a-button type="primary">保存</a-button>
                </a-form-item>
            </a-form>
        </a-row>
        <a-row>
            <a-modal
                v-model="choiceShow"
                :footer="null"
                :destroyOnClose="true"
                :mask="false"
                :closable="false"
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
    scopedSlots: { customRender: "xuhao" },
    align: "center"
  },
  {
    dataIndex: "xuanzewuliao",
    key: "xuanzewuliao",
    title: "选择物料",
    width: 80,
    scopedSlots: { customRender: "xuanzewuliao" }
  },
  {
    dataIndex: "wuliaobianma",
    key: "wuliaobianma",
    title: "物料编码",
    width: 120
  },
  {
    dataIndex: "tuhao",
    key: "tuhao",
    title: "图号",
    width: 140
  },
  {
    dataIndex: "mingcheng",
    key: "mingcheng",
    title: "名称",
    width: 140
  },
  {
    dataIndex: "danwei",
    key: "danwei",
    title: "单位",
    width: 80
  },
  {
    dataIndex: "kucunshuliang",
    key: "kucunshuliang",
    title: "库存数量",
    width: 100
  },
  {
    dataIndex: "shuliang",
    key: "shuliang",
    // title: "数量",
    width: 120,
    scopedSlots: { customRender: "shuliang" },
    slots: { title: "shuliangTitle" }
  },
  {
    dataIndex: "wuliaofenlei",
    key: "wuliaofenlei",
    title: "物料分类",
    width: 100
  },
  {
    dataIndex: "beizhu",
    key: "beizhu",
    title: "备注",
    width: 160,
    scopedSlots: { customRender: "beizhu" }
  }
];
export default {
    data() {
        return {
            form: this.$form.createForm(this),
            signDate: '',
            choiceShow: false,
            columns,
            data: [{ wuliaobianma: 11, shuliang: 111, id: 23 }]
        }
    },
    methods: {
        choisceMsg(a) {
            console.log(a);
            this.choiceShow = false;
        },
        onChangeSign(data,dateString) {
            this.signDate = dateString;
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
    },
    created() {},
    components: {
        materialList
    }
}
</script>
<style lang="less">
.edit_otherStock {
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