<template>
    <div class="editStorageList">
        <a-form :form="form">
            <a-form-item label="物料编码" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <span></span>
            </a-form-item>
            <a-form-item label="图号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <span></span>
            </a-form-item>
            <a-form-item label="名称" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <span></span>
            </a-form-item>
            <a-form-item label="单位" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select
                v-decorator="['danwei', { rules: [{ required:'true', message: '请选择合同模板'}]}]"
                placeholder="请选择"
                :labelInValue="true"
              >
              </a-select>
            </a-form-item>
            <a-form-item label="物料分类" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
             
            </a-form-item>
            <a-form-item label="仓库" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <span></span>
            </a-form-item>
            <a-form-item label="库存数量" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <span></span>
            </a-form-item>
            <a-form-item label="物料下限" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input
               v-decorator="['wuliaoxiaxian']"></a-input>
            </a-form-item>
            <a-form-item label="备注" :labelCol="{span:3}" :wrapperCol="{span:19}">
              <a-textarea v-decorator="['remark']" :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align:right">
                <a-button style="margin-right:12px;" >关闭</a-button>
                <a-button type="primary">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: this.$form.createForm(this),
        }
    }
}
</script>
<style lang="less">
.editStorageList {

}
</style>