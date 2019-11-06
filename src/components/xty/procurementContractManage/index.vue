<template>
  <div class="procurementContractManage">
    <a-row style="line-height:50px;">
      <permission-button permCode="shopcontract_lookup.shopcontract_add" banType="hide" @click="addVisible=true">
        <a-icon style="color:#1890ff;" type="plus" />新增
      </permission-button>
      <permission-button permCode="shopcontract_lookup.shopcontract_update" banType="hide" @click="editShow" :disabled="selectedRowKeys.length!=1">
        <a-icon style="color:#1890ff;" type="edit" />修改
      </permission-button>
      <permission-button permCode="shopcontract_lookup.shopcontract_audit" banType="hide" :disabled="selectedRowKeys.length!=1" @click="approveShow">
        <a-icon style="color:#1890ff;" type="submit" />提交审批
      </permission-button>
      <permission-button permCode="shopcontract_lookup.shopcontract_delete" banType="hide" @click="showDeleteConfirm" :disabled="selectedRowKeys.length<1">
        <a-icon style="color:#1890ff;" type="delete" />删除
      </permission-button>
    </a-row>
    <a-row>
      <a-col :span="24">
        <span>日期 :</span>
        <a-range-picker style="width:240px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
        <a-input-group class="changeDis">
          <span>审批状态 : </span>
          <a-select v-model="reviewSchedule" style="width: 100px" optionFilterProp="children">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option :value="1">暂存</a-select-option>
            <a-select-option :value="2">审批中</a-select-option>
            <a-select-option :value="3">已通过</a-select-option>
            <a-select-option :value="4">未通过</a-select-option>
            <a-select-option :value="5">已终止</a-select-option>
          </a-select>
        </a-input-group>
        <span>关键词 : </span>
        <a-input
         placeholder="采购单号/合同编号/供方/业务员" 
         style="width: 250px" 
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
        <template slot="shopContractNo" slot-scope="text, record">
          <a href="javascript:" @click="showDetails(record)">{{text}}</a>
        </template>
        <template slot="reviewSchedule" slot-scope="text, record">
          <div style="padding-left: 15px">
            <span v-if="text==2" style="font-size:14px;color:#027DB4;">审批中</span>
            <span v-if="text==1" style="font-size:14px;color:#999999;">暂存</span>
            <a-popover title placement="right">
              <template slot="content">
                <span>审批意见：{{record.comment == null ? "无" : record.comment}}</span>
              </template>
              <span v-if="text==4" style="font-size:14px;color:#f6003c;">未通过</span>
            </a-popover>
            <a-popover title placement="right">
              <template slot="content">
                <span>审批意见：{{record.comment == null ? "无" : record.comment}}</span>
              </template>
              <span v-if="text==5" style="font-size:14px;color:#E02D2D;">已终止</span>
            </a-popover>
            <a-popover title placement="right">
                <template slot="content">
                  <span>审批意见：{{record.comment == null ? "无" : record.comment}}</span>
                </template>
                <span v-if="text==3" style="font-size:14px;color:#10CF0C;">已通过</span>
            </a-popover>
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
    </a-row>
    <a-modal title="新增" v-model="addVisible" style="top:20px" width="1200px" :footer="null" @cancel="handleCancel(1)">
      <add-procurement-contract @cancelAdd="closeAdd" ref="addProcurementContract"></add-procurement-contract>
    </a-modal>
    <a-modal title="修改" v-model="editVisible" style="top:20px" width="1200px" :footer="null" @cancel="handleCancel(2)">
      <edit-procurement-contract @cancelEdit="closeEdit" :procurementContractId="selectedRowKeys[0]" ref="editProcurementContract"></edit-procurement-contract>
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
      title="合同详情"
      :footer="null"
      width="1000px"
      :visible="detailsVisible"
      @cancel="handleCancel(3)"
      :maskClosable="false"
    >
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="基础信息" key="1">
        <a-row>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">采购单号：</span>
          <span>{{contractDetails.purchaseNo}}</span>
        </a-col>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">合同编号：</span>
          <span>{{contractDetails.shopContractNo}}</span>
        </a-col>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">合同模板：</span>
          <span>{{contractDetails.model}}</span>
        </a-col>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">供应商：</span>
          <span>{{contractDetails.supplier}}</span>
        </a-col>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">需求方：</span>
          <span>{{contractDetails.demand}}</span>
        </a-col>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">业务员：</span>
          <span>{{contractDetails.salesman}}</span>
        </a-col>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">总金额：</span>
          <span>{{contractDetails.summoney}}</span>
        </a-col>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">金额大写：</span>
          <span>{{contractDetails.chineseMoney}}</span>
        </a-col>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">签订地点：</span>
          <span>{{contractDetails.place}}</span>
        </a-col>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">签订日期：</span>
          <span>{{contractDetails.digndate}}</span>
        </a-col>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">供货方式：</span>
          <span>{{contractDetails.sendway}}</span>
        </a-col>
        <a-col :span="24" style="margin-bottom:12px;">
          <span class="label_right">备注：</span>
          <span>{{contractDetails.remark}}</span>
        </a-col>
      </a-row>
      </a-tab-pane>
      <a-tab-pane tab="采购明细" key="2" style="margin-bottom: 20px">
        <a-table rowKey="id" :columns="columns2" :dataSource="data2" :scroll="{ x: 1900, y: 500 }" :pagination="true"/>
      </a-tab-pane>
    </a-tabs>
      
    </a-modal>
  </div>
</template>
<script>
import AddProcurementContract from "./addProcurementContract";
import EditProcurementContract from "./editProcurementContract";
const columns = [
  {
    dataIndex: "purchaseNo",
    title: "采购单号",
    key: "purchaseNo",
    width: "15%"
  },
  {
    dataIndex: "shopContractNo",
    title: "合同编号",
    key: "shopContractNo",
    scopedSlots: { customRender: "shopContractNo" },
    width: "15%"
  },
  {
    dataIndex: "supplier",
    title: "供方",
    key: "supplier",
    width: "20%"
  },
  {
    dataIndex: "salesman",
    title: "业务员",
    key: "salesman",
    width: "10%"
  },
  {
    dataIndex: "digndate",
    title: "签订日期",
    key: "digndate",
    width: "8%"
  },
  {
    dataIndex: "reviewSchedule",
    title: "审批状态",
    key: "reviewSchedule",
    scopedSlots: { customRender: "reviewSchedule" },
    width: "8%"
  },
  {
    dataIndex: "gmtCreated",
    title: "创建日期",
    key: "gmtCreated",
    width: "12%"
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark"
  }
];
const columns2 = [
  {
    dataIndex: "drawingNo",
    title: "图号",
    key: "drawingNo",
    width: 100
  },
  {
    dataIndex: "name",
    title: "名称",
    key: "name",
    width: 100
  },
  {
    dataIndex: "number",
    title: "需求数量",
    key: "number",
    width: 100
  },
  {
    dataIndex: "brand",
    title: "指定品牌",
    key: "brand",
    width: 100
  },
  {
    dataIndex: "designer",
    title: "设计师",
    key: "designer",
    width: 100
  },
  {
    dataIndex: "orderNumber",
    title: "订单数量",
    key: "orderNumber",
    width: 100
  },
  {
    dataIndex: "unit",
    title: "订单单位",
    key: "unit",
    width: 100
  },
  {
    dataIndex: "delivery",
    title: "交货日期",
    key: "delivery",
    width: 120
  },
  {
    dataIndex: "price",
    title: "单价",
    key: "price",
    width: 100
  },
  {
    dataIndex: "taxrate",
    title: "税率",
    key: "taxrate",
    width: 100
  },
  {
    dataIndex: "supplier",
    title: "供应商",
    key: "supplier",
    width: 100
  },
  {
    dataIndex: "priseUnit",
    title: "价格单位",
    key: "priseUnit",
    width: 100
  },
  {
    dataIndex: "moneyType",
    title: "货币类型",
    key: "moneyType",
    width: 100
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark",
    width: 100
  }
];
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      columns,
      columns2,
      data: [],
      data2: [],
      selectedRowKeys: [],
      selectedRows: [],
      contractDetails: [],
      dateValue: [],
      addVisible: false,
      editVisible: false,
      detailsVisible: false,
      approveVisible: false,
      current: 1,
      pageSize: 10,
      total: 0,
      reviewSchedule: -1,
      keyWords: '',
      userProcess: []
    };
  },
  methods: {
    handleCancel(num) {
      if( num == 1 ) {
        this.$refs.addProcurementContract.close();
      }
      if( num == 2 ) {
        this.$refs.editProcurementContract.close();
      }
      if( num == 3 ) {
        this.detailsVisible = false;
      }
    },
    editShow(){
       if (this.selectedRows[0].reviewSchedule != 1 && this.selectedRows[0].reviewSchedule != 4) {
				this.$message.error(`只能对暂存或未通过状态的订单进行修改！`);
			} else {
				this.editVisible = true;
			}
    },
    approveShow(){
       if (this.selectedRows[0].reviewSchedule != 1 && this.selectedRows[0].reviewSchedule != 4) {
				this.$message.error(`只能对暂存或未通过状态的订单进行修改！`);
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
						shopContractId: this.selectedRowKeys[0],
						procDefId: values.procDefId,
						description: values.description
					});
					console.log(data);

					this.Axios(
						{
							url: "/api-order/shopContract/submit",
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
     closeAdd(params) {
      this.addVisible = params;
      this.getList();
    },
    closeEdit(params){
      this.editVisible = params;
      this.getList();
      this.selectedRowKeys = [];
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
    onChangeRange(date,datestring){
      this.dateValue = datestring;
      console.log(this.dateValue)
    },
    onSelectChange(selectedRowKeys,selectedRows) {
       this.selectedRowKeys = selectedRowKeys;
       this.selectedRows = selectedRows;
       console.log(this.selectedRowKeys);
       console.log(this.selectedRows);
    },
    showDetails(row) {
      this.contractDetails = row;
      this.detailsVisible = true;
      console.log(this.contractDetails);
      this.findOne(row.id);
    },
    findOne(id){
      this.Axios(
				{
					url: '/api-order/shopContract/findone',
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
            console.log(result);
            this.data2 = result.data.data.shopContractDesDOList
					}
				},
				({ type, info }) => {}
			);
    },
    getList() {
			this.Axios(
				{
					url: "/api-order/shopContract/list",
          type: "get",
         	params: {
						page: this.current,
            size: this.pageSize,
            auditState: this.reviewSchedule != -1 ? this.reviewSchedule : null,
            keyword: this.keyWords,
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
    onDelete(e) {
      console.log(this.selectedRowKeys);
      let qs = require("qs");
      let data = qs.stringify({
        id: this.selectedRowKeys.join(",")
      });
      this.Axios(
        {
          url: "/api-order/shopContract/delete",
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
      if (this.selectedRows[0].reviewSchedule != 1 && this.selectedRows[0].reviewSchedule != 4) {
				this.$message.error(`只能删除暂存或未通过状态的订单！`);
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
            type: "contract"
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
    AddProcurementContract,
    EditProcurementContract
  },
  created() {
    this.getList();
    this.getUserprocess();
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