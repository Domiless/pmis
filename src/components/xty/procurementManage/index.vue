<template>
  <div class="procurementManage">
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
        <a-date-picker style="width:120px" @change="onChangeBegin" format="YYYY/MM/DD"></a-date-picker>
        <span>~</span>
        <a-date-picker style="width: 120px" @change="onChangeEnd" format="YYYY/MM/DD"></a-date-picker>
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
        <template slot="procurementNo" slot-scope="text, record">
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
       <a-pagination
            style="padding-top:12px;text-align: right;"
            showQuickJumper
            :defaultCurrent="current"
            :total="total"
            @change="onChange"
            showSizeChanger
            :pageSizeOptions="['10','20','30']"
            @showSizeChange="onShowSizeChange"
            :showTotal="total => `共 ${total} 条`"
          />
    </a-row>
     <a-modal
     title="新增"
     v-model="addVisible"
     width="1200px"
     :footer="null"
     >
      <add-procurement @cancelAdd="closeAdd"></add-procurement>
    </a-modal>
    <a-modal
     title="修改"
     v-model="editVisible"
     width="1200px"
     :footer="null"
     >
      <edit-procurement></edit-procurement>
    </a-modal>
    <a-modal
			title="采购单号详情"
			:footer="null"
			width="600px"
			:visible="detailsVisible"
			@cancel="handleCancel()"
			:maskClosable="false"
		>
			<a-row>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">项目订单：</span>
					<span>{{procurementDetails.orderNo}}</span>
				</a-col>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">设计单号：</span>
					<span>{{procurementDetails.designNo}}</span>
				</a-col>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">采购单号：</span>
					<span>{{procurementDetails.procurementNo}}</span>
				</a-col>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">备注：</span>
					<span>{{procurementDetails.remark}}</span>
				</a-col>
			</a-row>
		</a-modal>
  </div>
</template>
<script>
import EditProcurement from "./editProcurement"
import AddProcurement from "./addProcurement"
const columns = [
  {
    dataIndex: "orderNo",
    title: "项目订单编号",
    key: "orderNo",
    width: "20%"
  },
  {
    dataIndex: "procurementNo",
    title: "采购单号",
    key: "procurementNo",
    scopedSlots: { customRender: "procurementNo" },
    width: "20%"
  },
  {
    dataIndex: "applicant",
    title: "申请人",
    key: "applicant",
    width: "10%"
  },
  {
    dataIndex: "applyDate",
    title: "申请日期",
    key: "applyDate",
    width: "10%"
  },
  {
    dataIndex: "enquiryMsg",
    title: "是否询价",
    key: "enquiryMsg",
    width: "10%"
  },
  {
    dataIndex: "orderReviewSchedule",
    title: "审批状态",
    key: "orderReviewSchedule",
    scopedSlots: { customRender: "orderReviewSchedule" },
    width: "10%"
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
      procurementDetails: [],
      addVisible: false,
      editVisible: false,
      detailsVisible: false,
      beginDate: null,
      endDate:null,
      current: 1,
      pageSize: 10,
      total: 0,
      state: -1
    };
  },
  methods: {
    closeAdd(params) {
      this.addVisible = params;
      this.getList();
    },
    handleCancel() {
      this.detailsVisible = false;
    },
    onChangeBegin(date,datestring){
      this.beginDate = datestring;
    },
    onChangeEnd(date,datestring){
      this.endDate = datestring;
    },
    showDetails(row) {
			this.procurementDetails = row;
			this.detailsVisible = true;
			console.log(this.procurementDetails);
    },
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
    onSelectChange(selectedRowKeys) {
       this.selectedRowKeys = selectedRowKeys;
       console.log(this.selectedRowKeys)
    },
    getList() {
			this.Axios(
				{
					url: "/api-order/purchase/list",
          type: "get",
         	params: {
						page: this.current,
            size: this.pageSize,
            auditState: this.state,
						start: this.beginDate != "" ? this.beginDate : null,
            end: this.endDate != "" ? this.endDate : null
					},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.data = result.data.data.content;
            this.total = result.data.data.totalElement;
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
		},
    onDelete(e) {
      console.log("delete" + this.selectedRowKeys);
			let qs = require("qs");
			let data = qs.stringify({
				id: this.selectedRowKeys[0]
			});
			this.Axios(
				{
					url: "/api-order/purchase/delete",
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
  },
  components: {
      AddProcurement,
      EditProcurement
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="less" scoped>
.procurementManage {
  padding:0 20px;
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