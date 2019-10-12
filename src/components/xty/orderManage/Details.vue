


















































































<template>
  <div class="details">
    <a-form :form="form">
      <a-row>
        <a-form-item label="合同号" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.contractNo }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="项目名称" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.contractName }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="订单类别" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.orderType }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="项目订单编号" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.no }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="承接部门" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.undertakeDep }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="负责人" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.dutyBy }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="客户名称" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.customerName }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="合同金额" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.totalMoney }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="计量单位" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.measureUnit }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="订单数量" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.orderQuantity }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="运输方式" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.transportType }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="签订时间" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.gmtCreate }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="交货地点" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.deliveryPlace }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="交货日期" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.gmtDelivery }}</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="附件" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <!-- <span>{{ data.orderDocs }}</span> -->
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="备注" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <span>{{ data.remark }}</span>
        </a-form-item>
      </a-row>
    </a-form>
  </div>
</template>
<script>
export default {
  props: ["sendId"],
  data() {
    return {
      form: this.$form.createForm(this),
      data: []
    };
  },
  methods: {
    getList() {
     console.log("sendid: " + this.sendId)
      this.Axios(
        {
          url: "/order/getOrder",
          type: "get",
          params: {
            orderId: this.sendId
          }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.data = result.data.data;
            console.log(this.data)
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  mounted() {
      this.getList()
  }
};
</script>
<style lang="less" scoped>
.details {
  .ant-form > .ant-row {
    height: 40px;
  }
}
.ant-form-item-label {
  line-height: 20px;
}
</style>
