<template>
  <div class="details">
      <a-row>
          <span class="label_right">合同号：</span>
          <span>{{ data.contractNo }}</span>
      </a-row>
      <a-row>
          <span class="label_right">项目名称：</span>
          <span>{{ data.contractName }}</span>
      </a-row>
      <a-row>
          <span class="label_right">订单类别：</span>
          <span>{{ data.orderType }}</span>
      </a-row>
      <a-row>
          <span class="label_right">项目订单编号：</span>
          <span>{{ data.no }}</span>
      </a-row>
      <a-row>
          <span class="label_right">承接部门：</span>
          <span>{{ data.undertakeDep }}</span>
      </a-row>
      <a-row>
          <span class="label_right">负责人：</span>
          <span>{{ data.dutyBy }}</span>
      </a-row>
      <a-row>
          <span class="label_right">客户名称：</span>
          <span>{{ data.customerName }}</span>
      </a-row>
      <a-row>
          <span class="label_right">合同金额：</span>
          <span>{{ data.totalMoney }}</span>
      </a-row>
      <a-row>
          <span class="label_right">计量单位：</span>
          <span>{{ data.measureUnit }}</span>
      </a-row>
      <a-row>
          <span class="label_right">订单数量：</span>
          <span>{{ data.orderQuantity }}</span>
      </a-row>
      <a-row>
          <span class="label_right">运输方式：</span>
          <span>{{ data.transportType }}</span>
      </a-row>
      <a-row>
          <span class="label_right">签订时间：</span>
          <span>{{ data.gmtCreate }}</span>
      </a-row>
      <a-row>
          <span class="label_right">交货地点：</span>
          <span>{{ data.deliveryPlace }}</span>
      </a-row>
      <a-row>
          <span class="label_right">交货日期：</span>
          <span>{{ data.gmtDelivery }}</span>
      </a-row>
      <a-row>
          <span class="label_right">附件：</span>
          <!-- <span>{{ data.orderDocs }}</span> -->
      </a-row>
      <a-row>
          <span class="label_right">备注：</span>
          <span>{{ data.remark }}</span>
      </a-row>
  </div>
</template>
<script>
export default {
  props: ["sendId"],
  data() {
    return {
      data: []
    };
  },
  methods: {
    closeDetails() {
      this.$emit('closeDetails',false);
    },
    getList() {
     console.log("sendid: " + this.sendId)
      this.Axios(
        {
          url: "/api-order/order/getOrder/",
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
  created() {
      this.getList()
  }
};
</script>
<style lang="less" scoped>
.details {
  .ant-row {
    height: 30px;
    .ant-form-item {
      height: 15px;
      line-height: 1;
    }
  }
  .ant-form-item-label {
    line-height: 15px;
  }
   .label_right{
    display: inline-block;
	  width: 120px;
	  text-align: right;
  }

}
</style>