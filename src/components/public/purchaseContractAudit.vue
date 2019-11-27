<template>
  <div class="purchase_contract_audit">
    <a-col :span="24" style="display: block;overflow: hidden;">
      <a-col :span="12" style="margin-bottom: -1000px;padding-bottom: 1000px;float: left;">
        <a-col :span="24" style="padding-top:20px;padding-bottom:20px;">
          <!-- <a-col :span="24" class="case">
            <span class="audit_label">采购单号</span>
            <span>{{detailsValue.DO.purchaseNo}}</span>
          </a-col>-->
          <a-col :span="24" class="case">
            <span class="audit_label">合同编号</span>
            <span>{{detailsValue.DO.shopContractNo}}</span>
          </a-col>

          <a-col :span="24" class="case">
            <span class="audit_label">供方</span>
            <span>{{detailsValue.DO.supplier}}</span>
          </a-col>
          <a-col :span="24" class="case">
            <span class="audit_label">需方</span>
            <span>{{detailsValue.DO.demand}}</span>
          </a-col>
          <a-col :span="24" class="case">
            <span class="audit_label">业务员</span>
            <span>{{detailsValue.DO.salesman}}</span>
          </a-col>
          <a-col :span="24" class="case">
            <span class="audit_label">总金额</span>
            <span>{{detailsValue.DO.summoney}}元</span>
          </a-col>
          <a-col :span="24" class="case">
            <span class="audit_label">金额大写</span>
            <span>{{detailsValue.DO.chineseMoney}}</span>
          </a-col>
          <a-col :span="24" class="case">
            <span class="audit_label">签订地点</span>
            <span>{{detailsValue.DO.place}}</span>
          </a-col>
          <a-col :span="24" class="case">
            <span class="audit_label">签订日期</span>
            <span>{{detailsValue.DO.digndate}}</span>
          </a-col>
          <a-col :span="24" class="case">
            <span class="audit_label">供货方式</span>
            <span>{{detailsValue.DO.sendway}}</span>
          </a-col>
          <a-col :span="24" class="case">
            <span class="audit_label">合同模板</span>
            <span class="details" @click="modelShow">{{detailsValue.DO.model}}</span>
          </a-col>
          <a-col :span="24" class="case">
            <span class="audit_label">采购明细</span>
            <span class="details" @click="detailsVisible=true">查看明细</span>
          </a-col>
          <a-col :span="24" class="case">
            <span class="audit_label">备注</span>
            <pre style="display:inline-block;vertical-align: top;word-wrap:break-word;width:280px">{{detailsValue.DO.remark}}</pre>
          </a-col>
        </a-col>
      </a-col>
      <a-col
        :span="12"
        style="margin-bottom: -1000px;padding-bottom: 1000px;float: left;background-color:rgba(242, 242, 242, 0.435294117647059)"
      >
        <a-tabs defaultActiveKey="1" style="padding-bottom:20px;">
          <a-tab-pane tab="审批意见" key="1" v-if="auditType!=2">
            <a-col :span="24">
              <span class="opinion_style">发起人：</span>
              <span>{{detailsValue.auditData.userName}}</span>
            </a-col>
            <a-col :span="24">
              <span class="opinion_style">发起时间：</span>
              <span>{{detailsValue.auditData.startTime}}</span>
            </a-col>
            <a-col :span="24">
              <span class="opinion_style">停留时间：</span>
              <span>{{detailsValue.auditData.stopTime}}</span>
            </a-col>
            <a-col :span="24">
              <span class="opinion_style">审批意见：</span>
              <span>
                <a-radio-group v-model="value" style="vertical-align:top">
                  <a-radio :style="radioStyle" value="1">同意</a-radio>
                  <a-radio :style="radioStyle" value="0">驳回</a-radio>
                  <a-radio :style="radioStyle" value="-1">终止</a-radio>
                </a-radio-group>
              </span>
            </a-col>
            <a-col :span="24">
              <span class="opinion_style">审批说明：</span>
              <span>
                <a-textarea
                  v-model="comment"
                  style="vertical-align:top;width:260px;"
                  placeholder
                  :autosize="{ minRows: 4, maxRows: 4 }"
                />
              </span>
            </a-col>
            <a-col :span="24" style="padding-left:280px;">
              <a-button type="primary" @click="audit">提交</a-button>
            </a-col>
          </a-tab-pane>
          <a-tab-pane tab="审批日志" key="2" forceRender>
            <div class="log_case">
              <div v-for="(item, index) in detailsValue.log" :key="index" class="log_item_case">
                <h3>{{item.taskName}}</h3>
                <a-col :span="24">
                  <span>姓名：</span>
                  <span>{{item.name}}</span>
                </a-col>
                <a-col :span="24">
                  <span>处理时间：</span>
                  <span>{{item.dealTime}}</span>
                </a-col>
                <a-col :span="24" v-if="item.state!=0">
                  <span>处理结果：</span>
                  <span
                    :style="{color:item.state=='同意'?'#7ED321':item.state=='驳回'?'#FF9900':item.state=='终止'?'red':''}"
                  >
                    {{item.state}}
                    <span
                      v-if="item.comment!=null&&item.comment!=''"
                    >({{item.comment}})</span>
                  </span>
                </a-col>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="流程图" key="3">
            <div class="flow_case">
              <div class="content_case">
                <span class="item_case">开始</span>
                <div v-for="(item, index1) in flow" :key="index1">
                  <a-divider type="vertical" style="display: block;margin: auto;" />
                  <span
                    class="item_case"
                  >{{item.name}}（{{item.type==1?item.groups.label:item.users.map(i=>i.name).join(",")}}）</span>
                </div>
                <a-divider type="vertical" style="display: block;margin: auto;" />
                <span class="item_case">结束</span>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-col>
    <a-modal
      title="采购清单"
      :footer="null"
      width="1200px"
      @cancel="handleCancel(1)"
      :visible="detailsVisible"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <a-table
        size="small"
        :pagination="false"
        :columns="columns"
        :dataSource="data"
        :scroll="{ x: 2710, y: 500 }"
        rowKey="id"
      ></a-table>
    </a-modal>
    <a-modal
      title="合同详情"
      :footer="null"
      width="1000px"
      @cancel="handleCancel(2)"
      :visible="contractVisible"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <div v-html="contractValue"></div>
    </a-modal>
  </div>
</template>
<script>
let columns = [
  {
    title: "项目订单编号",
    key: "workOrderNo",
    dataIndex: "workOrderNo",
    width: 150
  },
  {
    title: "图号",
    key: "drawingNo",
    dataIndex: "drawingNo",
    width: 150
  },
  {
    title: "名称",
    key: "name",
    dataIndex: "name",
    width: 150
  },
  {
    title: "需求数量",
    key: "number",
    dataIndex: "number",
    width: 80
  },
  {
    title: "指定品牌",
    key: "brand",
    dataIndex: "brand",
    width: 110
  },
  {
    title: "设计师",
    key: "planner",
    dataIndex: "planner",
    width: 80
  },
  {
    title: "采购名称",
    key: "shopName",
    dataIndex: "shopName",
    width: 120,
    scopedSlots: { customRender: "shopName" }
  },
  {
    title: "订单数量",
    key: "orderNumber",
    dataIndex: "orderNumber",
    width: 80,
    scopedSlots: { customRender: "orderNumber" },
    slots: { title: "dingdanshuliangTitle" }
  },
  {
    title: "订单单位",
    key: "unit",
    dataIndex: "unit",
    width: 80,
    slots: { title: "dingdandanweiTitle" },
    scopedSlots: { customRender: "unitId" }
  },
  {
    title: "交货日期",
    key: "delivery",
    dataIndex: "delivery",
    width: 140,
    slots: { title: "jiaohuoriqiTitle" },
    scopedSlots: { customRender: "delivery" }
  },
  {
    title: "第1供应商",
    key: "firstSupplier",
    dataIndex: "firstSupplier",
    width: 150,
    slots: { title: "diyigongyingshangTitle" },
    scopedSlots: { customRender: "firstSupplierId" }
  },
  {
    title: "第1报价(元)",
    key: "firstOffer",
    dataIndex: "firstOffer",
    width: 100,
    slots: { title: "diyibaojiaTitle" },
    scopedSlots: { customRender: "firstOffer" }
  },
  {
    title: "第2供应商",
    key: "secondSupplier",
    dataIndex: "secondSupplier",
    width: 150,
    scopedSlots: { customRender: "secondSupplierId" }
  },
  {
    title: "第2报价(元)",
    key: "secondOffer",
    dataIndex: "secondOffer",
    width: 100,
    scopedSlots: { customRender: "secondOffer" }
  },
  {
    title: "第3供应商",
    key: "thirdSupplier",
    dataIndex: "thirdSupplier",
    width: 150,
    scopedSlots: { customRender: "thirdSupplierId" }
  },
  {
    title: "第3报价(元)",
    key: "thirdOffer",
    dataIndex: "thirdOffer",
    width: 100,
    scopedSlots: { customRender: "thirdOffer" }
  },
  {
    title: "建议供应商",
    key: "supplier",
    dataIndex: "supplier",
    width: 150,
    slots: { title: "jianyigongyingshangTitle" },
    scopedSlots: { customRender: "supplierId" }
  },
  {
    title: "建议价格",
    key: "price",
    dataIndex: "price",
    width: 90
  },
  {
    title: "价格单位",
    key: "priseUnit",
    dataIndex: "priseUnit",
    width: 90,
    slots: { title: "jiagedanweiTitle" },
    scopedSlots: { customRender: "priseUnitId" }
  },
  {
    title: "货币类型",
    key: "moneyType",
    dataIndex: "moneyType",
    width: 90,
    scopedSlots: { customRender: "moneyType" }
  },
  {
    title: "备注",
    key: "remark",
    dataIndex: "remark",
    width: 140,
    scopedSlots: { customRender: "remark" }
  },
  {
    title: "小计(元)",
    key: "total",
    dataIndex: "total",
    width: 80
  }
];
import Vue from "vue";
import { Divider } from "ant-design-vue";
Vue.use(Divider);
export default {
  props: {
    auditValue: {
      default: {}
    },
    auditParams: {
      default: ""
    }
  },
  data() {
    return {
      contractValue: "",
      contractVisible: false,
      detailsValue: {
        DO: {},
        auditData: {},
        log: []
      },
      columns,
      data: [],
      detailsVisible: false,
      value: "",
      radioStyle: {
        display: "block",
        lineHeight: "24px"
      },
      rizi: {},
      flow: [],
      comment: "",
      auditType: ""
    };
  },
  methods: {
    modelShow() {
      this.Axios(
        {
          url: "/api-order/shopContract/print",
          params: {
            id: this.auditValue.DO.id
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.contractValue = result.data.data;
            this.contractVisible = true;
          }
        },
        ({ type, info }) => {}
      );
    },
    handleCancel(a) {
      if (a == 1) {
        this.detailsVisible = false;
      }
      if (a == 2) {
        this.contractVisible = false;
      }
    },
    getModel() {
      this.Axios(
        {
          url: "/api-order/activiti/getModelProcess",
          params: {
            procDefId: this.auditValue.auditData.processDefinitionId
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.flow = result.data.data.userTask;
          }
        },
        ({ type, info }) => {}
      );
    },
    audit() {
      if (this.value == "" || this.value == null) {
        this.$message.error("请选择审批意见！");
        return false;
      }
      if ((this.value == 0 || this.value == -1) && this.comment == "") {
        this.$message.error("驳回或终止需要填写审批说明！");
        return false;
      }
      let qs = require("qs");
      let data = qs.stringify({
        comment: this.comment,
        state: this.value,
        taskID: this.auditValue.auditData.id
      });
      this.Axios(
        {
          url: "/api-order/activiti/audit",
          params: data,
          type: "post",
          option: { successMsg: "审批成功！" }
          // config: {
          // 	headers: { "Content-Type": "application/json" }
          // }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.comment = "";
            this.value = "";
            let params = {
              type: 4
            };
            this.$emit("auditParams", params);
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    // this.rizi = this.auditValue.log[this.auditValue.log.length - 1];
    this.detailsValue = this.auditValue;
    // this.detailsValue.log.pop();
    this.getModel();
    this.data = this.auditValue.DO.purchaseDesDOList;
    this.auditType = this.$store.state.homeStore.details;
  },
  watch: {
    auditValue() {
      // this.rizi = this.auditValue.log[this.auditValue.log.length - 1];
      this.detailsValue = this.auditValue;
      // this.detailsValue.log.pop();
      this.getModel();
      this.data = this.auditValue.DO.purchaseDesDOList;
      this.auditType = this.$store.state.homeStore.details;
    }
  }
};
</script>
<style lang="less">
.purchase_contract_audit {
  overflow: hidden;
  .details {
    cursor: pointer;
    color: rgba(24, 144, 255, 1);
    &:hover {
      text-decoration: underline;
    }
  }
  .case:not(:last-child) {
    margin-bottom: 8px;
  }
  .audit_label {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 8px;
    color: #999999;
  }
  .opinion_style {
    display: inline-block;
    width: 80px;
    text-align: right;
    color: #999999;
  }
  .ant-tabs {
    span {
      line-height: 24px;
    }
    .ant-col-24:not(:last-child) {
      margin-bottom: 12px;
    }
  }
  .log_case {
    max-height: 500px;
    overflow: auto;
    padding: 0 20px 0;
    span {
      line-height: 24px;
    }
    .ant-col-24:not(:last-child) {
      margin-bottom: 0px;
    }
    .log_item_case:not(:last-child) {
      overflow: hidden;
      margin-bottom: 20px;
    }
  }
  .flow_case {
    .content_case {
      text-align: center;
      padding-top: 12px;
      max-height: 500px;
      overflow: auto;
      .item_case {
        margin: auto;
        display: block;
        width: 160px;
        background-color: rgba(24, 144, 255, 1);
        line-height: 40px;
        border-radius: 5px;
        color: white;
      }
      .ant-divider {
        background-color: rgba(24, 144, 255, 1);
        height: 1.9em;
        width: 2px;
      }
    }
  }
}
</style>