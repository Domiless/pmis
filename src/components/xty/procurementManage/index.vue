<template>
  <div class="procurementManage">
    <a-row>
      <a-button @click="addVisible=true">
        <a-icon style="color:#1890ff;" type="plus" />新增
      </a-button>
      <a-button>
        <a-icon style="color:#1890ff;" type="edit" />修改
      </a-button>
      <a-button>
        <a-icon style="color:#1890ff;" type="submit" />提交审批
      </a-button>
      <a-button>
        <a-icon style="color:#1890ff;" type="delete" />删除
      </a-button>
    </a-row>
    <a-row>
      <a-col :span="5">
        <span>日期 :</span>
        <a-date-picker style="width:120px"></a-date-picker>
        <span>~</span>
        <a-date-picker style="width: 120px"></a-date-picker>
      </a-col>
      <a-col :span="3">
        <a-input-group>
          <span>审批状态 :</span>
          <a-select v-model="state" style="width: 100px" optionFilterProp="children">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option :value="1">暂存</a-select-option>
            <a-select-option :value="2">审批中</a-select-option>
            <a-select-option :value="3">已通过</a-select-option>
            <a-select-option :value="4">未通过</a-select-option>
            <a-select-option :value="5">已终止</a-select-option>
          </a-select>
        </a-input-group>
      </a-col>
      <a-col :span="8">
        <span>关键词 :</span>
        <a-input placeholder="请输入关键词" style="width: 250px"></a-input>
        <a-button @click="getList">搜索</a-button>
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
        <a
          slot="procurementNo"
          slot-scope="text"
          href="javascript:;"
        >{{ text }}</a>
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
     <a-modal
     title="新增"
     v-model="addVisible"
     width="1000px"
     :footer="null"
     >
      <add-procurement></add-procurement>
    </a-modal>
  </div>
</template>
<script>
import AddProcurement from "./addProcurement"
const columns = [
  {
    dataIndex: "orderNo",
    title: "项目订单编号",
    key: "orderNo",
    width: "10%"
  },
  {
    dataIndex: "procurementNo",
    title: "采购单号",
    key: "procurementNo",
    scopedSlots: { customRender: "procurementNo" },
    width: "15%"
  },
  {
    dataIndex: "applicant",
    title: "申请人",
    key: "applicant",
    width: "8%"
  },
  {
    dataIndex: "applyDate",
    title: "申请日期",
    key: "applyDate",
    width: "10%"
  },
  {
    dataIndex: "enquiryMsg",
    title: "询价信息",
    key: "enquiryMsg",
    width: "5%"
  },
  {
    dataIndex: "orderReviewSchedule",
    title: "审批状态",
    key: "orderReviewSchedule",
    scopedSlots: { customRender: "orderReviewSchedule" },
    width: "8%"
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark",
  }
];
export default {
  data() {
    return {
      columns,
      data: [],
      selectedRowKeys: [],
      addVisible: false,
      state: -1
    };
  },
  methods: {
    onSelectChange() {},
    getList() {}
  },
  components: {
      AddProcurement
  }
};
</script>
<style lang="less" scoped>
.procurementManage {
  .ant-row:nth-child(1) {
    margin-bottom: 30px;
  }
  .ant-row:nth-child(2) {
      margin-bottom: 10px;
  }
}
</style>
