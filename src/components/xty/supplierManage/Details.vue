<template>
  <div class="details">
      <a-row>
          <span class="label_right">供应商编码：</span>
          <span>{{ data.contractNo }}</span>
      </a-row>
      <a-row>
          <span class="label_right">供应商名称：</span>
          <span>{{ data.contractName }}</span>
      </a-row>
      <a-row>
          <span class="label_right">联系人：</span>
          <span>{{ data.orderType }}</span>
      </a-row>
      <a-row>
          <span class="label_right">联系电话：</span>
          <span>{{ data.no }}</span>
      </a-row>
      <a-row>
          <span class="label_right">地址：</span>
          <span>{{ data.undertakeDep }}</span>
      </a-row>
      <a-row>
          <span class="label_right">电子邮箱：</span>
          <span>{{ data.dutyBy }}</span>
      </a-row>
      <a-row>
          <span class="label_right">备注：</span>
          <span>{{ data.customerName }}</span>
      </a-row>
  </div>
</template>
<script>
export default {
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
      this.Axios(
        {
          url: "/api-order/",
          type: "get",
          params: {
            orderId: 
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