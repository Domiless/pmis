<template>
  <div class="flow_path">
    <a-col :span="24" style="padding:0 20px;overflow:hidden;">
      <a-row>
        <div style="line-height:50px;">
          <a-col :span="8">
            <permission-button permCode="process_lookup.process_add" banType="hide" @click="add">
              <a-icon style="color:#1890ff;" type="plus" />新增
            </permission-button>
            <permission-button
              permCode="process_lookup.process_update"
              banType="hide"
              @click="findOne"
              :disabled="selectedRowKeys.length!=1"
            >
              <a-icon style="color:#1890ff;" type="edit" />修改
            </permission-button>
            <permission-button
              permCode="process_lookup.process_user"
              banType="hide"
              :disabled="selectedRowKeys.length!=1"
              @click="updateProcessState"
            >启用/禁用</permission-button>
          </a-col>
        </div>
      </a-row>
      <a-row style="padding-top:10px;">
        <a-table
          :columns="columns"
          :pagination="false"
          :dataSource="data"
          :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
          rowKey="id"
        >
          <template slot="type" slot-scope="text, record, index">
            <div>
              <span>{{text==1?"订单审批":text==2?"设计审批":text==3?"报审单审批":text==4?"采购合同审批":""}}</span>
            </div>
          </template>
          <template slot="suspension" slot-scope="text, record, index">
            <div>
              <span>{{text=="false"?"启用":"禁用"}}</span>
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
        :footer="null"
        width="800px"
        :visible="addVisible"
        @cancel="handleCancel(1)"
        :maskClosable="false"
      >
        <add v-on:addCancel="addCancel" ref="addPage"></add>
      </a-modal>
      <a-modal
        title="修改"
        :footer="null"
        width="800px"
        :visible="editVisible"
        @cancel="handleCancel(2)"
        :maskClosable="false"
      >
        <edit v-on:editCancel="editCancel" ref="editPage" :editMsg="editMsg"></edit>
      </a-modal>
    </a-col>
  </div>
</template>
<script>
import add from "./add&&edit/add";
import edit from "./add&&edit/edit";
const columns = [
  {
    dataIndex: "type",
    title: "流程类型",
    width: "20%",
    key: "type",
    scopedSlots: { customRender: "type" }
  },
  {
    dataIndex: "name",
    title: "流程名称",
    width: "60%",
    key: "name"
  },
  {
    dataIndex: "suspension",
    title: "状态",
    width: "15%",
    key: "suspension",
    scopedSlots: { customRender: "suspension" }
  }
];
export default {
  inject: ["reload"],
  data() {
    return {
      editVisible: false,
      addVisible: false,
      columns,
      data: [],
      current: 1,
      pageSize: 10,
      total: 0,
      selectedRowKeys: [],
      selectedRows: [],
      editMsg: ""
    };
  },
  methods: {
    addCancel() {
      this.addVisible = false;
      this.getList();
      this.selectedRowKeys = [];
      this.selectedRows = [];
    },
    editCancel() {
      this.editVisible = false;
      this.getList();
      this.selectedRowKeys = [];
      this.selectedRows = [];
    },
    add() {
      this.addVisible = true;
    },
    edit() {},
    handleCancel(a) {
      if (a == 1) {
        // this.addVisible = false;
        this.$refs.addPage.quexiao();
      }
      if (a == 2) {
        this.editVisible = false;
      }
    },
    onSelectChange(selectedRowKeys, b) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = b;
      console.log(this.selectedRows);
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
      this.selectedRowKeys = [];
      this.getList();
    },
    getList() {
      this.Axios(
        {
          url: "/api-order/activiti/getprocess",
          params: {
            page: this.current,
            size: this.pageSize
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.data = result.data.data.data;
            this.total = Number(result.data.data.totalElement);
          }
        },
        ({ type, info }) => {}
      );
    },
    findOne() {
      this.Axios(
        {
          url: "/api-order/activiti/getModelProcess",
          params: {
            procDefId: this.selectedRowKeys[0]
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.editVisible = true;
            this.editMsg = result.data.data;
          }
        },
        ({ type, info }) => {}
      );
    },
    updateProcessState() {
      let qs = require("qs");
      let data = qs.stringify({
        state: this.selectedRows[0].suspension == "false" ? 1 : 0,
        procDefId: this.selectedRows[0].id
      });
      let showMsg;
      if (this.selectedRows[0].suspension == "false") {
        showMsg = "禁用成功";
      } else {
        showMsg = "启用成功";
      }
      this.Axios(
        {
          url: "/api-order/activiti/updateProcessState",
          params: data,
          type: "post",
          option: { successMsg: showMsg }
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
    }
  },
  created() {
    this.getList();
  },
  components: {
    add,
    edit
  }
};
</script>