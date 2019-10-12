<template>
  <div class="editProcurement">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="基础信息" key="1">
        <a-form :form="form">
          <a-row>
            <a-form-item label="项目订单" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select
                v-decorator="['orderNo', { rules: [{ required:'true', message: '请选择项目订单'}]}]"
                placeholder="请选择"
              >
                <a-select-option value="1">1</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="设计单号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
              <a-select
                v-decorator="['workOrderNo', { rules: [{ required:'true', message: '请选择设计单号'}]}]"
                placeholder="请选择"
              >
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
      <a-tab-pane tab="采购明细" key="2" style="margin-bottom: 20px">
        <a-table :columns="columns" :dataSource="data" :scroll="{ x: 1900, y: 500 }" />
        <a-col :span="12" style="padding-top: 12px; height: 36px;">
          <span style="line-height: 12px">合计：</span>
        </a-col>
        <a-col :span="12">
          <a-pagination
            style="padding-top:12px;text-align: right;"
            size="small"
            :total="total"
            showQuickJumper
            showSizeChanger
            @change="onChange"
            @showSizeChange="onShowSizeChange"
            :pageSizeOptions="['10','20','50','100']"
            :showTotal="total => `共 ${total} 条`"
          ></a-pagination>
        </a-col>
      </a-tab-pane>
    </a-tabs>
    <a-row>
      <a-form-item :wrapper-col="{ span: 20,offset: 2 }" style="text-align:right">
        <a-button style="margin-right:12px;">关闭</a-button>
        <a-button type="primary">提交</a-button>
      </a-form-item>
    </a-row>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "bomDrawingNo",
    title: "图号",
    key: "bomDrawingNo",
    width: 100
  },
  {
    dataIndex: "name",
    title: "名称",
    key: "name",
    width: 100
  },
  {
    dataIndex: "number",
    title: "需求数量",
    key: "number",
    width: 100
  },
  {
    dataIndex: "brand",
    title: "指定品牌",
    key: "brand",
    width: 100
  },
  {
    dataIndex: "designer",
    title: "设计师",
    key: "designer",
    width: 100
  },
  {
    dataIndex: "supplier",
    title: "订单数量",
    key: "supplier",
    width: 100
  },
  {
    dataIndex: "orderUnit",
    title: "订单单位",
    key: "orderUnit",
    width: 100
  },
  {
    dataIndex: "deliveryDate",
    title: "交货日期",
    key: "deliveryDate",
    width: 100
  },
  {
    dataIndex: "unitPrice",
    title: "单价",
    key: "unitPrice",
    width: 100
  },
  {
    dataIndex: "taxrate",
    title: "税率",
    key: "taxrate",
    width: 100
  },
  {
    dataIndex: "supplier",
    title: "供应商",
    key: "supplier",
    width: 100
  },
  {
    dataIndex: "priceUnit",
    title: "价格单位",
    key: "priceUnit",
    width: 100
  },
  {
    dataIndex: "currencyType",
    title: "货币类型",
    key: "currencyType",
    width: 100
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark",
    width: 100
  },
  {
    dataIndex: "summation",
    title: "小计",
    key: "summation",
    width: 100
  }
];
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      columns,
      data: []
    };
  },
  methods: {
    onChange(current, pageNumber) {
      console.log("Page: ", pageNumber);
      console.log("第几页: ", current);
      this.current = current;
      this.getList();
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getList();
    },
  }
};
</script>
<style lang="less" scoped>
</style>