<template>
  <div class="work_order_list_details" style="overflow:hidden;">
    <a-col :span="12">
      <span class="right_label">工单号：</span>
      <span>{{Msg.no}}</span>
    </a-col>
    <a-col :span="12">
      <span class="right_label">工作令号：</span>
      <span>{{Msg.gongzuolingNo}}</span>
    </a-col>
    <a-col :span="12">
      <span class="right_label">工单标题：</span>
      <span>{{Msg.title}}</span>
    </a-col>
    <a-col :span="12">
      <span class="right_label">客户名称：</span>
      <span>{{Msg.client}}</span>
    </a-col>
    <a-col :span="12">
      <span class="right_label">需方订单号：</span>
      <span>{{Msg.demandOrderNo}}</span>
    </a-col>
    <a-col :span="12">
      <span class="right_label">承制单位：</span>
      <span>{{Msg.contractingUnits}}</span>
    </a-col>
    <a-col :span="12">
      <span class="right_label">计划开工时间：</span>
      <span>{{Msg.gmtPlanStart}}</span>
    </a-col>
    <a-col :span="12">
      <span class="right_label">实际开工时间：</span>
      <span>{{Msg.gmtRealStart}}</span>
    </a-col>
    <a-col :span="12">
      <span class="right_label">计划完工时间：</span>
      <span>{{Msg.gmtPlanCompleted}}</span>
    </a-col>
    <a-col :span="12">
      <span class="right_label">实际完工时间：</span>
      <span>{{Msg.gmtRealCompleted}}</span>
    </a-col>
    <a-col :span="12">
      <span class="right_label">优先级：</span>
      <span>{{Msg.isPriority==false?'正常':'优先'}}</span>
    </a-col>
    <a-col :span="24">
      <span class="right_label">备注：</span>
      <span style="display:inline-block;vertical-align:top">{{Msg.remark}}</span>
    </a-col>
  </div>
</template>
<script>
import Vue from "vue";
import { Col } from "ant-design-vue";
Vue.use(Col);
export default {
  props: {
    detailsMsg: {
      default: null
    }
  },
  data() {
    return {
      Msg: {}
    };
  },
  methods: {
    findOne() {
      this.Axios(
        {
          url: "/api-workorder/workOrder/findOne",
          params: {
            workOrderId: this.detailsMsg.workOrderId
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.Msg = result.data.data.workOrder;
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.findOne();
  },
  watch: {
    detailsMsg() {
      if (this.detailsMsg != null && this.detailsMsg != "") {
        this.findOne();
      }
    }
  }
};
</script>
<style lang="less">
.work_order_list_details {
  .right_label {
    display: inline-block;
    width: 120px;
    text-align: right;
  }
  .ant-col-12 {
    margin-bottom: 12px;
  }
}
</style>