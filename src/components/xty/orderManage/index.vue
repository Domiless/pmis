<template>
  <div class="orderManage">
    <div class="orderManage_header">
      <div class="header_wrap">
        <a-row>
          <a-col style="line-height:50px;">
            <a-button @click="addVisible=true">
              <a-icon type="plus" style="color: #1890ff" />新增
            </a-button>
            <a-button @click="editShow" :disabled="selectedRowKeys.length!=1">
              <a-icon type="edit" style="color: #1890ff" />修改
            </a-button>
            <a-button @click="approveShow" :disabled="selectedRowKeys.length!=1">
              <a-icon type="submit" style="color: #1890ff" />提交审批
            </a-button>
            <a-button @click="showDeleteConfirm" :disabled="selectedRowKeys.length==0" >
              <a-icon type="delete" style="color: #1890ff" />删除
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="orderManage_content">
      <div class="content_wrap">
        <a-row>
          <a-col :span="24">
            <span>日期 :</span>
            <a-range-picker style="width:240px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
            <a-input-group class="changeDis">
              <span>审批状态 : </span>
              <a-select v-model="reviewState" style="width: 100px" optionFilterProp="children">
                <a-select-option :value="-1">全部</a-select-option>
                <a-select-option :value="1">暂存</a-select-option>
                <a-select-option :value="2">审批中</a-select-option>
                <a-select-option :value="3">已通过</a-select-option>
                <a-select-option :value="4">未通过</a-select-option>
                <a-select-option :value="5">已终止</a-select-option>
              </a-select>
            </a-input-group>
            <span>关键词 :</span>
            <a-input placeholder="合同号/订单编号/项目名称/承接部门" style="width: 250px" v-model="keyWords"></a-input>
            <a-button @click="getList">搜索</a-button>
          </a-col>
        </a-row>
        <a-table
          rowKey="id"
          :columns="columns"
          :dataSource="data"
          :pagination="false"
          :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
        >
          <template slot="contractName" slot-scope="text, record">
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
          <template slot="orderType" slot-scope="text">
            <span v-if="text==1">贸易类</span>
            <span v-if="text==2">咨询类</span>
            <span v-if="text==3">设计制造类</span>
            <span v-if="text==4">其他</span>
          </template>
          <!-- <template slot="design_apply" slot-scope="text, record, index">
								<div>
									<i class="iconfont icon-check-copy" style="color: #10CF0C; font-size: 20px" v-if="text==true"></i>
                  <i class="iconfont icon-close-copy" style="color: #f6003c; font-size: 20px" v-if="text==false"></i>
								</div>
          </template>-->
        </a-table>
        <a-row>
          <a-col :span="8" style="margin-top: 12px">
            <span style="color: #999; height: 32px">提示: 项目订单审批通过后，将自动流转到设计部门。</span>
          </a-col>
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
      </div>
    </div>
    <a-modal title="新增" style="top:20px" v-model="addVisible" width="1000px" :maskClosable="false" :footer="null" @cancel="handleCancel(1)">
      <add-order-message @changeAddOrder="cancelAddOrder" :getlist="getList" ref="addOrderMessage"></add-order-message>
    </a-modal>
    <a-modal
				title="提交审批"
				v-model="approveVisible"
				:footer="null"
				width="600px"
				@cancel="approveVisible=false"
				:maskClosable="false"
			>
				<a-form :form="form">
					<a-form-item label="选择流程" :labelCol="{span:4}" :wrapperCol="{span:18}">
						<a-select
							v-decorator="[
								'procDefId',
								{rules: [{ required: true, message: '请选择流程' }]}
								]"
							showSearch
							placeholder="请选择"
							optionFilterProp="children"
							style="width: 100%"
							:filterOption="filterOption"
						>
							<a-select-option v-for="(i,j) in userProcess" :key="j" :value="i.id">{{i.name}}</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item label="说明" :labelCol="{span:4}" :wrapperCol="{span:18}">
						<a-textarea v-decorator="['description']" :autosize="{ minRows: 4, maxRows: 4 }" />
					</a-form-item>
					<a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align:right">
						<a-button style="margin-right:12px;" @click="approveVisible = false">取消</a-button>
						<a-button type="primary" @click="auditSubmit">提交</a-button>
					</a-form-item>
				</a-form>
			</a-modal>
    <a-modal
      title="修改"
      :footer="null"
      style="top:20px"
      width="1000px"
      :visible="editVisible"
      @cancel="handleCancel(2)"
      :maskClosable="false"
    >
      <edit-order-message :OrderMessageId="selectedRowKeys[0]" @cancelEdit="cancelEdit" ref="editOrderMessage"></edit-order-message>
    </a-modal>
    <a-modal
      title="详情"
      :visible="detailsVisible"
      width="800px"
      :maskClosable="false"
      :footer="null"
      @cancel="closeDetails"
    >
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">合同号：</span>
          <span>{{ orderDetails.contractNo }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">项目名称：</span>
          <span>{{ orderDetails.contractName }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">订单类别：</span>
          <span v-if="orderDetails.orderType==1">贸易类</span>
          <span v-if="orderDetails.orderType==2">咨询类</span>
          <span v-if="orderDetails.orderType==3">设计制造类</span>
          <span v-if="orderDetails.orderType==4">其他</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">项目订单编号：</span>
          <span>{{ orderDetails.no }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">承接部门：</span>
          <span>{{ orderDetails.undertakeDep }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">负责人：</span>
          <span>{{ orderDetails.dutyBy }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">客户名称：</span>
          <span>{{ orderDetails.customerName }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">合同金额：</span>
          <span>{{ orderDetails.totalMoney }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">计量单位：</span>
          <span>{{ orderDetails.measureUnit }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">订单数量：</span>
          <span>{{ orderDetails.orderQuantity }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">运输方式：</span>
          <span>{{ orderDetails.transportType }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">签订时间：</span>
          <span>{{ orderDetails.gmtSign }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">创建时间：</span>
          <span>{{ orderDetails.gmtCreate }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">交货地点：</span>
          <span>{{ orderDetails.deliveryPlace }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">交货日期：</span>
          <span>{{ orderDetails.gmtDelivery }}</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">附件：</span>
          <span style="display:inline-block;vertical-align:top">
						<p v-for="(item,index) in orderDetails.orderDocs" :key="index">
							<a :href="item.docPositionTrueUrl" target="_blank">{{item.docName}}</a>
						</p>
					</span>
      </a-row>
      <a-row>
          <span class="label_right" style="margin-bottom:12px;">备注：</span>
          <span>{{ orderDetails.remark }}</span>
      </a-row>

    </a-modal>
  </div>
</template>
<script>
import AddOrderMessage from "./AddOrderMessage";
import SubmitApproval from "./SubmitApproval";
import Details from "./Details";
import EditOrderMessage from "./EditOrderMessage";
const columns = [
  {
    dataIndex: "contractNo",
    title: "合同号",
    key: "contractNo",
    width: "16%"
  },
  {
    dataIndex: "no",
    title: "项目订单编号",
    key: "no",
    width: "13%"
  },
  {
    dataIndex: "contractName",
    title: "项目名称",
    key: "contractName",
    scopedSlots: { customRender: "contractName" },
    width: "20%"
  },
  {
    dataIndex: "undertakeDep",
    title: "承接部门",
    key: "undertakeDep",
    width: "20%"
  },
  {
    dataIndex: "orderType",
    title: "订单类别",
    key: "orderType",
    scopedSlots: { customRender: "orderType" },
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
    dataIndex: "remark",
    title: "备注",
    key: "remark",
    width: "8%"
  }
];
const rowSelection = {
  culumnsWidth: "5%",
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  }
};
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      columns,
      data: [],
      addVisible: false,
      approveVisible: false,
      editVisible: false,
      applyShow: false,
      detailsVisible: false,
      current: 1,
      pageSize: 10,
      total: 0,
      dateValue: [],
      employeeId: null,
      selectedRowKeys: [],
      selectedRows: [],
      orderDetails: [],
      reviewState: -1,
      keyWords: '',
      userProcess: []
    };
  },
  methods: {
    handleCancel(num){
      if(num == 1) {
        this.$refs.addOrderMessage.confirmCancel();
      }
      if(num == 2) {
        this.$refs.editOrderMessage.confirmCancel();
      }

    },
    editShow() {
      if (this.selectedRows[0].orderReviewSchedule != 1 && this.selectedRows[0].orderReviewSchedule != 4) {
				this.$message.error(`只能对暂存或未通过状态的订单进行修改！`);
			} else {
				this.editVisible = true;
			}
    },
    approveShow() {
      if (this.selectedRows[0].orderReviewSchedule != 1 && this.selectedRows[0].orderReviewSchedule != 4) {
				this.$message.error(`只能对暂存或未通过状态的订单提交审批！`);
			} else {
				this.approveVisible = true;
			}
    },
    auditSubmit() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log("Received values of form: ", values);
					let qs = require("qs");
					let data = qs.stringify({
						orderId: this.selectedRowKeys[0],
						procDefId: values.procDefId,
						description: values.description
          });
          console.log(data);
					console.log(this.selectedRowKeys[0]);

					this.Axios(
						{
							url: `/api-order/order/reviewOrder/${this.selectedRowKeys[0]}`,
							params: data,
							type: "post",
							option: { successMsg: "提交成功！" }
							// config: {
							// 	headers: { "Content-Type": "application/json" }
							// }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.approveVisible = false;
								this.form.resetFields();
								this.getList();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
    filterOption(input, option) {
			return (
				option.componentOptions.children[0].text
					.toLowerCase()
					.indexOf(input.toLowerCase()) >= 0
			);
		},
    onChangeRange(date,datestring){
      this.dateValue = datestring;
      console.log(this.dateValue)
    },
    showDetails(row) {
      this.orderDetails = row;
      this.detailsVisible = true;
      console.log(this.orderDetails);
    },
    cancelAddOrder(params) {
      this.addVisible = params;
    },
    cancelEdit(params) {
      this.editVisible = params;
      this.getList();
      this.selectedRowKeys = [];
    },
    cancelDetails(params) {
      this.detailsVisible = params;
    },
    onSelectChange(selectedRowKeys,selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      console.log(this.selectedRowKeys,selectedRows);
    },
    getTime(a, b) {
      console.log(b);
      this.startTime = b[0];
      this.endTime = b[1];
    },
    closeDetails() {
      this.detailsVisible = false;
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getList();
    },
    onChange(current, pageNumber) {
      console.log("Page: ", pageNumber);
      console.log("第几页: ", current);
      this.current = current;
      this.getList();
    },
    onDelete(e) {
      console.log(this.selectedRowKeys);
      let qs = require("qs");
      // let data = qs.stringify({
      //   orderIds: this.selectedRowKeys
      // });
      let data = {
        orderIds: this.selectedRowKeys.join(',')
      }
      console.log(data.orderIds)
      this.Axios(
        {
          url: `/api-order/order/delOrder/${data.orderIds}`,
          params: {},
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
    getList() {
      this.Axios(
        {
          url: "/api-order/order/getOrderList",
          type: "get",
          params: {
            page: this.current,
            size: this.pageSize,
            reviewState: this.reviewState != -1 ? this.reviewState : null,
            keyword: this.keyWords,
            beginDate: this.dateValue[0] != "" ? this.dateValue[0] : null,
            endDate: this.dateValue[1] != "" ? this.dateValue[1] : null
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
      if (this.selectedRows[0].orderReviewSchedule != 1 ) {
				this.$message.error(`只能删除暂存状态的订单！`);
			} else {
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
    getUserprocess() {
			this.Axios(
				{
					url: "/api-order/activiti/getUserprocess",
					// url: "/api-order/activiti/getprocess",
					type: "get",
					params: {
            type: "order"
          },
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.userProcess = result.data.data;
					}
				},
				({ type, info }) => {}
			);
		}
  },
  components: {
    AddOrderMessage,
    SubmitApproval,
    EditOrderMessage,
    Details
  },
  created() {
    this.getList();
    this.getUserprocess();
  }
};
</script>
<style lang="less" scoped>
.orderManage {
  padding: 0 20px;
  .orderManage_header {
    margin-bottom: 10px;
  }
  .orderManage_content {
    .content_wrap {
      .ant-row:nth-child(1) {
        margin-bottom: 10px;
      }
      .ant-table-wrapper {
        margin-top: 10px;
      }
    }
    
  }
  .changeDis {
    display: inline;
    margin: 0px 50px 0px 50px;
  }
}
.label_right{
    display: inline-block;
	  width: 120px;
	  text-align: right;
    }
</style>
