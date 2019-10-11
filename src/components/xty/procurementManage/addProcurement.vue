<template>
  <div class="addProcurement">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="基础信息" key="1">
        <a-form :form="form">
          <a-row>
            <a-form-item label="项目订单" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select  v-decorator="['orderNo', { rules: [{ required:'true', message: '请选择项目订单'}]}]" placeholder="请选择">
                  <a-select-option value="1">1</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="设计单号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select v-decorator="['workOrderNo', { rules: [{ required:'true', message: '请选择设计单号'}]}]" placeholder="请选择">
                  <a-select-option value="2">2</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="采购单号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['procurementNo', { rules: [{ required:'true'}]}]"></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="备注" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-input v-decorator="['remark']"></a-input>
            </a-form-item>
          </a-row>
        </a-form>
      </a-tab-pane>
      <a-tab-pane tab="采购明细" key="2">
          <a-table  :columns="columns" :dataSource="data" :scroll="{ x: 1800, y: 500 }"/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
const columns = [
    {
        dataIndex: 'bomDrawingNo',
        title: '图号',
        key: 'bomDrawingNo',
        width: '100px'
    },
    {
        dataIndex: 'name',
        title: '名称',
        key: 'name',
        width: '100px'
    },
    {
        dataIndex: 'number',
        title: '需求数量',
        key: 'number',
        width: '100px'
    },
    {
        dataIndex: 'brand',
        title: '指定品牌',
        key: 'brand',
        width: '100px'
    },
    {
        dataIndex: 'designer',
        title: '设计师',
        key: 'designer',
        width: '100px'
    },
    {
        dataIndex: 'supplier',
        title: '订单数量',
        key: 'supplier',
        width: '100px'
    },
    {
        dataIndex: 'remake',
        title: '订单单位',
        key: 'remake',
        width: '100px'
    },
    {
        dataIndex: 'remake',
        title: '交货日期',
        key: 'remake',
        width: '100px'
    },
    {
        dataIndex: 'remake',
        title: '单价',
        key: 'remake',
        width: '100px'
    },
    {
        dataIndex: 'remake',
        title: '税率',
        key: 'remake',
        width: '100px'
    },
    {
        dataIndex: 'remake',
        title: '供应商',
        key: 'remake',
        width: '100px'
    },
    {
        dataIndex: 'pricceUnit',
        title: '价格单位',
        key: 'pricceUnit',
        width: '100px'
    },
    {
        dataIndex: 'currencyType',
        title: '货币类型',
        key: 'currencyType',
        width: '100px'
    },
    {
        dataIndex: 'remark',
        title: '备注',
        key: 'remark',
        width: '100px'
    },
    {
        dataIndex: 'summation',
        title: '小计',
        key: 'summation',
        width: '100px'
    },
]
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      columns,
      data: []
    };
  }
};
</script>
<style lang="less" scoped>
</style>