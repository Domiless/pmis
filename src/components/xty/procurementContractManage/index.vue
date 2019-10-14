<template>
  <div class="procurementContractManage">
    <a-row style="line-height:50px;">
      <a-button @click="addVisible=true">
        <a-icon style="color:#1890ff;" type="plus" />新增
      </a-button>
      <a-button @click="editVisible=true" :disabled="selectedRowKeys.length!=1">
        <a-icon style="color:#1890ff;" type="edit" />修改
      </a-button>
      <a-button :disabled="selectedRowKeys.length!=1">
        <a-icon style="color:#1890ff;" type="submit" />提交审批
      </a-button>
      <a-button @click="showDeleteConfirm" :disabled="selectedRowKeys.length<1">
        <a-icon style="color:#1890ff;" type="delete" />删除
      </a-button>
    </a-row>
    <a-row>
      <a-col :span="24">
        <span>日期 :</span>
        <a-date-picker style="width:120px"></a-date-picker>
        <span>~</span>
        <a-date-picker style="width: 120px"></a-date-picker>
        <a-input-group class="changeDis">
          <span>审批状态 : </span>
          <a-select v-model="state" style="width: 100px" optionFilterProp="children">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option :value="1">暂存</a-select-option>
            <a-select-option :value="2">审批中</a-select-option>
            <a-select-option :value="3">已通过</a-select-option>
            <a-select-option :value="4">未通过</a-select-option>
            <a-select-option :value="5">已终止</a-select-option>
          </a-select>
        </a-input-group>
        <span>关键词 : </span>
        <a-input placeholder="请输入关键词" style="width: 250px"></a-input>
        <a-button>搜索</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-table
        rowKey="id"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
      >
        <template slot="contractNo" slot-scope="text, record">
          <a href="javascript:" @click="showDetails(record)">{{text}}</a>
        </template>
        <template slot="orderReviewSchedule" slot-scope="text, record">
          <div>
            <span v-if="text==2" style="font-size:14px;color:#027DB4;">审批中</span>
            <span v-if="text==1" style="font-size:14px;color:#999999;">暂存</span>
            <a-popover title placement="right">
              <template slot="content">
                <span>原因：{{record.reason}}</span>
              </template>
              <span v-if="text==4" style="font-size:14px;color:#f6003c;">未通过</span>
            </a-popover>
            <a-popover title placement="right">
              <template slot="content">
                <span>原因：{{record.reason}}</span>
              </template>
              <span v-if="text==5" style="font-size:14px;color:#E02D2D;">已终止</span>
            </a-popover>
            <span v-if="text==3" style="font-size:14px;color:#10CF0C;">已通过</span>
          </div>
        </template>
      </a-table>
    </a-row>
    <a-modal title="新增" v-model="addVisible" style="top:20px" width="1200px" :footer="null">
      <add-procurement-contract></add-procurement-contract>
    </a-modal>
    <a-modal title="修改" v-model="editVisible" style="top:20px" width="1200px" :footer="null">
      <edit-procurement-contract></edit-procurement-contract>
    </a-modal>
    <a-modal
      title="合同详情"
      :footer="null"
      width="600px"
      :visible="detailsVisible"
      @cancel="handleCancel()"
      :maskClosable="false"
    >
      <a-row>
        <a-col :span="12" style="margin-bottom:12px;">
          <span class="label_right">采购单号：</span>
          <span>{{contractDetails}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
          <span class="label_right">合同编号：</span>
          <span>{{contractDetails}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
          <span class="label_right">合同模板：</span>
          <span>{{contractDetails}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
          <span class="label_right">供应商：</span>
          <span>{{contractDetails}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
          <span class="label_right">需求方：</span>
          <span>{{contractDetails}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
          <span class="label_right">业务员：</span>
          <span>{{contractDetails}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
          <span class="label_right">总金额：</span>
          <span>{{contractDetails}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
          <span class="label_right">金额大写：</span>
          <span>{{contractDetails}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
          <span class="label_right">签订地点：</span>
          <span>{{contractDetails}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
          <span class="label_right">签订日期：</span>
          <span>{{}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
          <span class="label_right">供货方式：</span>
          <span>{{}}</span>
        </a-col>
        <a-col :span="12" style="margin-bottom:12px;">
          <span class="label_right">备注：</span>
          <span>{{contractDetails.remark}}</span>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import AddProcurementContract from "./addProcurementContract";
import EditProcurementContract from "./editProcurementContract";
const columns = [
  {
    dataIndex: "procurementNo",
    title: "采购单号",
    key: "procurementNo",
    width: "15%"
  },
  {
    dataIndex: "contractNo",
    title: "合同编号",
    key: "contractNo",
    scopedSlots: { customRender: "contractNo" },
    width: "15%"
  },
  {
    dataIndex: "provider",
    title: "供方",
    key: "provider",
    width: "20%"
  },
  {
    dataIndex: "applyDate",
    title: "业务员",
    key: "applyDate",
    width: "10%"
  },
  {
    dataIndex: "enquiryMsg",
    title: "签订日期",
    key: "enquiryMsg",
    width: "8%"
  },
  {
    dataIndex: "orderReviewSchedule",
    title: "审批状态",
    key: "orderReviewSchedule",
    scopedSlots: { customRender: "orderReviewSchedule" },
    width: "8%"
  },
  {
    dataIndex: "createDate",
    title: "创建日期",
    key: "createDate",
    width: "8%"
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark"
  }
];
export default {
  data() {
    return {
      columns,
      data: [],
      selectedRowKeys: [],
      contractDetails: [],
      addVisible: false,
      editVisible: false,
      detailsVisible: false,
      state: -1
    };
  },
  methods: {
    handleCancel() {
      this.detailsVisible = false;
    },
    onSelectChange() {},
    showDetails(row) {
      this.contractDetails = row;
      this.detailsVisible = true;
      console.log(this.contractDetails);
    },
    onDelete(e) {
      console.log(this.selectedRowKeys);
      let qs = require("qs");
      let data = qs.stringify({
        orderIds: this.selectedRowKeys.join(",")
      });
      this.Axios(
        {
          url: "/api-order/order/delOrder",
          params: data,
          type: "post",
          option: { successMsg: "删除成功！" }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.getList();
            this.selectedRowKeys = [];
          }
        },
        ({ type, info }) => {}
      );
    },
    showDeleteConfirm() {
      let that = this;
      this.$confirm({
        title: "确定删除吗？",
        content: "",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: function() {
          that.onDelete();
        },
        onCancel() {}
      });
    }
  },
  components: {
    AddProcurementContract,
    EditProcurementContract
  }
};
</script>
<style lang="less" scoped>
.procurementContractManage {
  padding: 0 20px;
  .ant-row:nth-child(1) {
    margin-bottom: 10px;
  }
  .ant-row:nth-child(2) {
    margin-bottom: 10px;
  }
  .label_right {
	display: inline-block;
	width: 120px;
	text-align: right;
  }
  .changeDis {
    display: inline;
    margin: 0px 50px 0px 50px;
  }
}
</style>