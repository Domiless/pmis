<template>
    <div class="add_backStock">
        <a-row style="line-height:50px;">
			<a-button @click="$router.back(-1)" icon="left">返回</a-button>
		</a-row>
        <a-row>
            <a-form :form="form">
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="单据类型">
					<a-input
                        v-decorator="[
                        'invoicesType',
                        {rules: [{ required: true, message: '请填写单据类型' }]}
                        ]"
                        maxlength="10"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="单据编号">
					<a-input
                        v-decorator="[
                        'invoicesNo',
                        {rules: [{ required: true, message: '请填写单据编号' }]}
                        ]"
                        maxlength="20"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="原始单据号">
					<a-input
                        v-decorator="['originalInvoicesNo']"
                        maxlength="20"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="退料部门">
					<a-input
                        v-decorator="[
                        'backDepartment',
                        {rules: [{ required: true, message: '请填写退料部门' }]}
                        ]"
                        maxlength="10"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="返回仓库">
					<a-input
                        v-decorator="[
                        'backWarehouse',
                        {rules: [{ required: true, message: '请填写返回仓库' }]}
                        ]"
                        maxlength="10"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="入库日期">
                    <a-date-picker 
                        @change="onChangeSign" 
                        v-decorator="['stockDate']" 
                        format="YYYY/MM/DD"/>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="经办人">
					<a-input
                        v-decorator="[
                        'transactor',
                        {rules: [{ required: true, message: '请填写经办人' }]}
                        ]"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="制单人">
					<a-input
                        v-decorator="['preparedBy']"
                        maxlength="10"
                    ></a-input>
				</a-form-item>
                <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="备注">
					<a-textarea 
                        v-decorator="['remark']" 
                        :rows="4" 
                        :autosize="{ minRows: 4, maxRows: 4}"
                    ></a-textarea>
				</a-form-item>
            </a-form>
        </a-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: this.$form.createForm(this),
            signDate: ''
        }
    },
    methods: {
        onChangeSign(data,dateString) {
            this.signDate = dateString;
        },
    }
}
</script>
<style lang="less">

</style>