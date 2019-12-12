<template>
  <div class="procurementApply">
    <a-row style="line-height:50px;">
      <permission-button permCode banType="hide" @click="addVisible=true">
        <a-icon style="color:#1890ff;" type="plus" />新增
      </permission-button>
      <permission-button permCode banType="hide" @click="edit">
        <a-icon style="color:#1890ff;" type="edit" />修改
      </permission-button>
      <permission-button permCode banType="hide" @click="showAssign">
        <a-icon style="color:#1890ff;" type="submit" />指派采购员
      </permission-button>
      <permission-button permCode banType="hide">
        <i style="color:#1890ff;margin-right:4px;" class="iconfont">&#xe8ad;</i>审批
      </permission-button>
      <permission-button permCode banType="hide">
        <i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60c;</i>打印预览
      </permission-button>
      <permission-button permCode banType="hide">
        <a-icon style="color:#1890ff;" type="delete" />删除
      </permission-button>
    </a-row>
    <a-row>
      <a-col :span="24">
        <span>日期 :</span>
        <a-range-picker style="width:240px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
        <span style="margin-left: 10px">关键词 :</span>
        <a-input
          placeholder="项目订单编号/设计单号/部件名称/图号/设计负责人"
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
        <template slot="partName" slot-scope="text, record">
          <a href="javascript:" @click="showDetails(record.id)">{{text}}</a>
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
      >
        <addApply ref="addApply"></addApply>
    </a-modal>
    <a-modal
        title="修改"
        @cancel="handleCancel(2)"
        v-model="editVisible"
        :maskClosable="false"
        width="1200px"
        :footer="null"
      >
        <editApply ref="editApply"></editApply>
      </a-modal>
    <a-modal
        title="指派采购员"
        v-model="assignVisible"
        width="1000px"
        :footer="null"
        :maskClosable="false"
        @cancel="handleCancel(3)"
    >
        <assign-buyer ref="assignBuyer"></assign-buyer>
    </a-modal>
    <a-modal
        title="详情"
        :footer="null"
        width="1000px"
        :visible="detailsVisible"
        @cancel="handleCancel(4)"
        :maskClosable="false"
    >
        <a-row style="margin-bottom: 10px">
            <a-col :span="12">
                <span class="label_right">项目订单编号: </span>
                <span>{{details.workOrderNo}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">设计单号: </span>
                <span>{{details.bomNo}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">部件名称: </span>
                <span>{{details.partName}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">图号: </span>
                <span>{{details.bomDrawingNo}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">设计负责人: </span>
                <span>{{details.production}}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">创建时间: </span>
                <span>{{details.gmtCreated}}</span>
            </a-col>
        </a-row>
        <a-row>
            <a-table
                rowKey="id"
                :columns="detailsColumns"
                :dataSource="detailsData"
                :pagination="false"
                :scroll="{y: 400}"
            >
            </a-table>
        </a-row>
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
    dataIndex: "partName",
    title: "项目名称",
    key: "partName",
    scopedSlots: { customRender: "partName" },
    width: "10%"
  },
  {
    dataIndex: "bomDrawingNo",
    title: "业务归口部门",
    key: "bomDrawingNo",
    width: "10%"
  },
  {
    dataIndex: "number",
    title: "提采日期",
    key: "number",
    width: "8%"
  },
  {
    dataIndex: "production",
    title: "审核",
    key: "production",
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
		dataIndex: "drawingNo",
		title: "图号",
		key: "drawingNo",
		width: "20%"
	},
	{
		dataIndex: "name",
		title: "名称",
		key: "name",
		width: "20%"
	},
	{
		dataIndex: "brand",
		title: "指定品牌",
		key: "brand",
		width: "10%"
	},
	{
		dataIndex: "addNum",
		title: "需求数量",
		key: "addNum",
		width: "10%"
	},
	{
		dataIndex: "appointName",
		title: "指派采购员",
		key: "appointName",
		width: "20%"
    },
    {
		dataIndex: "assignerTime",
		title: "指派时间",
		key: "assignerTime",
		width: "20%"
	},
]
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
      assignVisible: false
    };
  },
  methods: {
      handleCancel(a) {
      if (a == 1) {
        this.$refs.addApply.closeAdd();
      }
      if (a == 2) {
        this.$refs.editApply.closeEdit();
      }
      if (a == 3) {
        this.assignVisible = false;
      }
      if (a == 4) {
        this.detailsVisible = false;
      }
    },
    edit() {
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
        this.assignVisible = true;
    },
    showDetails(row) {
        this.details = row;
        this.detailsVisible = true;
        console.log(this.details);
        // this.Axios(
        //     {
        //         url: "/api-order/bom/getBomdes",
        //         type: "get",
        //         params: {
        //             bomIdS: this.details.id
        //         },
        //         option: { enableMsg: false }
        //     },
        //     this
        // ).then(
        //     result => {
        //         if (result.data.code === 200) {
        //             console.log(result);
        //             this.detailsData = result.data.data;
        //         }
        //     },
        //     ({ type, info }) => {}
        // );
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
    }
  },
  components: {
      addApply,
      editApply,
      assignBuyer
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
</style>