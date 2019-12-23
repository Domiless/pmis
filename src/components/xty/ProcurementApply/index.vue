<template>
  <div class="procurementApply">
    <a-row style="line-height:50px;">
      <permission-button permCode banType="hide" @click="addVisible=true">
        <a-icon style="color:#1890ff;" type="plus" />新增
      </permission-button>
      <permission-button permCode banType="hide" @click="edit" :disabled="selectedRowKeys.length !== 1">
        <a-icon style="color:#1890ff;" type="edit" />修改
      </permission-button>
      <permission-button permCode banType="hide" @click="showAssign" :disabled="selectedRowKeys.length !== 1">
        <a-icon style="color:#1890ff;" type="submit" />指派采购员
      </permission-button>
      <permission-button permCode banType="hide" @click="handleCheck" :disabled="selectedRowKeys.length !== 1">
        <i style="color:#1890ff;margin-right:4px;" class="iconfont">&#xe8ad;</i>审批
      </permission-button>
      <permission-button permCode banType="hide" @click="toPreview" :disabled="selectedRowKeys.length !== 1">
        <i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60c;</i>打印预览
      </permission-button>
      <permission-button permCode banType="hide" @click="handleDel" :disabled="selectedRowKeys.length !== 1">
        <a-icon style="color:#1890ff;" type="delete" />删除
      </permission-button>
    </a-row>
    <a-row>
      <a-col :span="24">
        <span>日期 :</span>
        <a-range-picker style="width:240px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
        <span style="margin-left: 10px">关键词 :</span>
        <a-input
          placeholder="采购单号/项目名称/业务归口部门"
          style="width: 350px"
          v-model="keyWords"
          @keyup.enter.native="getList"
        ></a-input>
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
        <template slot="projectName" slot-scope="text, record">
          <a href="javascript:" @click="showDetails(record.id)">{{text}}</a>
        </template>
        <template slot="bomReviewSchedule" slot-scope="text">
						<div>
							<span v-if="text==2" style="font-size:14px;color:#f6003c;">未审</span>
							<span v-if="text==3" style="font-size:14px;color:#10CF0C;">已审</span>
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
        @cancel="handleCancel(1)"
        v-model="addVisible"
        width="1200px"
        :maskClosable="false"
        :footer="null"
        destroyOnClose
      >
        <addApply @changeAddOrder="cancelAddOrder" ref="addApply"></addApply>
    </a-modal>
    <a-modal
        title="修改"
        @cancel="handleCancel(2)"
        v-model="editVisible"
        :maskClosable="false"
        width="1200px"
        :footer="null"
        destroyOnClose
      >
        <editApply :procurementId="selectedRowKeys[0]" @changeEditOrder="cancelEditOrder" ref="editApply"></editApply>
      </a-modal>
    <a-modal
        title="指派采购员"
        v-model="assignVisible"
        width="1000px"
        :footer="null"
        :maskClosable="false"
        @cancel="handleCancel(3)"
        destroyOnClose
    >
        <assign-buyer @changeAssignOrder="cancelAssignOrder" :orderId="selectedRowKeys[0]" ref="assignBuyer"></assign-buyer>
    </a-modal>
    <a-modal
        title="详情"
        :footer="null"
        width="1000px"
        :visible="detailsVisible"
        @cancel="handleCancel(4)"
        :maskClosable="false"
        destroyOnClose
      >
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="基础信息" key="1">
            <a-row>
              <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">采购单号：</span>
                <span>{{details.bomNo}}</span>
              </a-col>
              <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">项目订单编号：</span>
                <span>{{details.workOrderNo}}</span>
              </a-col>
              <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">标题：</span>
                <span>{{details.title}}</span>
              </a-col>
              <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">项目名称：</span>
                <span>{{details.projectName}}</span>
              </a-col>
              <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">业务归口部门：</span>
                <span>{{details.relevant}}</span>
              </a-col>
              <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">提采日期：</span>
                <span>{{details.raisedate}}</span>
              </a-col>
              <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">编号：</span>
                <span>{{details.no}}</span>
              </a-col>
              <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">申请人：</span>
                <span>{{details.production}}</span>
              </a-col>
              <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">制单人：</span>
                <span>{{details.maker}}</span>
              </a-col>
              <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">备注：</span>
                <span>{{details.remake}}</span>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="BOM" key="2" style="margin-bottom: 20px">
            <a-row>
              <a-table
                :scroll="{ x: 1900, y: 400 }"
                :pagination="false"
                rowKey="id"
                :columns="detailsColumns"
                :dataSource="details.bomDes"
              >
                <template slot="index" slot-scope="text, record, index">
                  <span>{{index+1}}</span>
                </template>
              </a-table>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-modal>
  </div>
</template>
<script>
import addApply from "./add"
import editApply from "./edit"
import assignBuyer from "./assignBuyer"
const columns = [
  {
    dataIndex: "bomNo",
    title: "采购单号",
    key: "bomNo",
    width: "15%"
  },
  {
    dataIndex: "workOrderNo",
    title: "项目订单编号",
    key: "workOrderNo",
    width: "15%"
  },
  {
    dataIndex: "projectName",
    title: "项目名称",
    key: "projectName",
    scopedSlots: { customRender: "projectName" },
    width: "10%"
  },
  {
    dataIndex: "relevant",
    title: "业务归口部门",
    key: "relevant",
    width: "10%"
  },
  {
    dataIndex: "raisedate",
    title: "提采日期",
    key: "raisedate",
    width: "8%"
  },
  {
    dataIndex: "bomReviewSchedule",
    title: "审核",
    key: "bomReviewSchedule",
    scopedSlots: { customRender: "bomReviewSchedule" },
    width: "8%"
  },
  {
    dataIndex: "gmtCreated",
    title: "制单时间",
    key: "gmtCreated",
    width: "10%"
  },
  {
    dataIndex: "remake",
    title: "备注",
    key: "remake"
  }
];
const detailsColumns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    scopedSlots: { customRender: "index" },
    align: "center",
    // fixed: "left",
    width: 50
  },
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: 150
  },
  {
    title: "型号/规格",
    dataIndex: "partCat",
    key: "partCat",
    width: 150
  },
  {
    title: "计量单位",
    dataIndex: "unit",
    key: "unit",
    width: 150
  },
  {
    title: "需求数量",
    dataIndex: "addNum",
    key: "addNum",
    width: 150
  },
  {
    title: "推荐厂家",
    dataIndex: "adviseBrand",
    key: "adviseBrand",
    width: 150
  },
  {
    title: "指定厂家",
    dataIndex: "brand",
    key: "brand",
    width: 150
  },
  {
    title: "要求到货时间",
    dataIndex: "arrivalTime",
    key: "arrivalTime",
    width: 150
  },
  {
    title: "备注",
    dataIndex: "remake",
    key: "remake",
    width: 150
  }
];
export default {
  data() {
    return {
      data: [],
      detailsData: [],
      columns,
      detailsColumns,
      dateValue: '',
      selectedRowKeys: [],
      selectedRows: [],
      details: [],
      current: 1,
      pageSize: 10,
      total: 0,
      keyWords: "",
      addVisible: false,
      editVisible: false,
      detailsVisible: false,
      assignVisible: false,
    };
  },
  methods: {
    toPreview() {
      this.Axios(
				{
					url: '/api-order/bom/findone',
					params: {
            id: this.selectedRowKeys[0]
          },
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
            console.log(result);
            let sendMsg = result.data.data;
            sessionStorage.priview = JSON.stringify(sendMsg);
						sessionStorage.priviewType = 5;
						window.open("/priview.html", "_blank");
					}
				},
				({ type, info }) => {}
      );
    },
      handleCancel(a) {
      if (a == 1) {
        this.$refs.addApply.closeAdd();
      }
      if (a == 2) {
        this.$refs.editApply.closeEdit();
      }
      if (a == 3) {
        this.assignVisible = false;
        this.selectedRowKeys = [];
      }
      if (a == 4) {
        this.detailsVisible = false;
      }
    },
    cancelAddOrder(params) {
      this.addVisible = params;
      this.getList();
    },
    cancelEditOrder(params) {
      this.editVisible = params;
      this.getList();
      this.selectedRowKeys = [];
    },
    cancelAssignOrder(params) {
      this.assignVisible = params;
      this.getList();
      this.selectedRowKeys = [];
    },
    edit() {
      if ( this.selectedRows[0].bomReviewSchedule !== 2 ) {
        this.$message.error("只能修改未审批采购单");
        return false
      } 
      this.editVisible = true;
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
    onChangeRange(date, datestring) {
      this.dateValue = datestring;
      console.log(this.dateValue);
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      console.log(this.selectedRowKeys);
      console.log(this.selectedRows);
    },
    showAssign() {
      if ( this.selectedRows[0].bomReviewSchedule !== 3 ) {
        this.$message.error("不可指派未审核采购单");
        return false
      } 
      this.assignVisible = true;
    },
    showDetails(id) {
        this.detailsVisible = true;
        this.Axios(
				{
					url: '/api-order/bom/findone',
					params: {
            id: id
          },
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
            console.log(result.data.data);
            this.details = result.data.data;
					}
				},
				({ type, info }) => {}
			);
    },
    handleDel() {
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
      if(this.selectedRows[0].bomReviewSchedule == 3){
        this.$message.error("不可删除已审批采购单");
        this.selectedRowKeys = [];
        return false
      }
			console.log("delete" + this.selectedRowKeys);
			let qs = require("qs");
			let data = qs.stringify({
				bomId: this.selectedRowKeys[0]
			});
			this.Axios(
				{
					url: "/api-order/bom/deleteBom",
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
            this.selectedRows = [];            
					}
				},
				({ type, info }) => {}
			);
    },
    handleCheck() {
      let that = this;
			this.$confirm({
				title: "确定要审核该单据吗？",
				content: "",
				okText: "确定",
				okType: "primary",
				cancelText: "取消",
				onOk: function() {
					that.audit();
				},
				onCancel() {}
			});
    },
    audit() {
      if ( this.selectedRows[0].bomReviewSchedule !== 2 ) {
        this.$message.error("不可重复审批");
        return false
      } 
      this.Axios(
				{
					url: '/api-order/bom/audit?id=' + this.selectedRowKeys[0],
					params: {},
					type: "post",
          option: { successMsg: " 审核成功！" },
          config: {
              headers: { "Content-Type": "application/json" }
          }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
            console.log(result.data.data);
            this.selectedRowKeys = [];
            this.getList();
					}
				},
				({ type, info }) => {}
			);
    },
    getList() {
			this.Axios(
				{
					url: "/api-order/bom/list",
					type: "get",
					params: {
						page: this.current,
						size: this.pageSize,
						keyword: this.keyWords,
						type: 1,
						start: this.dateValue[0] != "" ? this.dateValue[0] : null,
						end: this.dateValue[1] != "" ? this.dateValue[1] : null
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
  },
  components: {
      addApply,
      editApply,
      assignBuyer
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="less">
.procurementApply {
  padding: 0 20px;
  .ant-row:nth-child(1) {
    margin-bottom: 10px;
  }
  .ant-row:nth-child(2) {
    margin-bottom: 10px;
  }
  
}
.label_right {
    display: inline-block;
    width: 120px;
    text-align: right;
  }
</style>