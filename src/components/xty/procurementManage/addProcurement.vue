<template>
    <div class="addProcurement">
        <a-form :form="form">
            <a-row>
                <a-col :span="12">
                    <a-form-item label="项目订单" :labelCol="{ span: 4}" :wrapperCol="{ span: 18 }">
                        <a-input></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="申请人" :labelCol="{ span: 4}" :wrapperCol="{ span: 18 }">
                        <a-input></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <a-form-item label="采购单号" :labelCol="{ span: 4}" :wrapperCol="{ span: 18 }">
                        <a-input></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="备注" :labelCol="{ span: 4}" :wrapperCol="{ span: 18 }">
                        <a-input></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </div>    
</template>
<script>
export default {
    data() {
        return {
            form: this.$form.createForm(this)
        }
    }
}
</script>
<style lang="less" scoped>

</style>