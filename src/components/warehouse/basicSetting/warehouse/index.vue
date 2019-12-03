<template>
  <div class="warehouse_list">
    <a-row>
      <a-col :span="24" style="padding:0 20px;">
        <a-row>
          <div style="line-height:50px;">
            <a-col :span="15">
              <permission-button permCode banType="hide" @click="addVisible=true">
                <a-icon style="color:#1890ff;" type="plus" />新增
              </permission-button>
              <permission-button
                permCode
                banType="hide"
                @click="editVisible=true"
                :disabled="selectedRowKeys.length!=1"
              >
                <a-icon style="color:#1890ff;" type="edit" />修改
              </permission-button>
              <permission-button
                permCode
                banType="hide"
                @click="showDeleteConfirm"
                :disabled="selectedRowKeys.length!=1"
              >
                <a-icon style="color:#1890ff;" type="delete" />删除
              </permission-button>
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
            <template slot="state" slot-scope="text, record, index">
              <a-switch
                checkedChildren="启用"
                unCheckedChildren="禁用"
                v-model="record.isAvailable"
                @click="switchChange(text,record,index)"
                class="qwwe"
              />
            </template>
            <template slot="warehouseNmae" slot-scope="text, record, index">
              <a href="javascript:">{{text}}</a>
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
      </a-col>
    </a-row>
    <a-modal
      title="新增"
      :footer="null"
      width="800px"
      :visible="addVisible"
      @cancel="handleCancel(1)"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <add v-on:addModal="addModal" ref="addref"></add>
    </a-modal>
    <a-modal
      title="修改"
      :footer="null"
      width="800px"
      :visible="editVisible"
      @cancel="handleCancel(2)"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <edit v-on:editModal="editModal" :msg="selectedRowKeys[0]" ref="editref"></edit>
    </a-modal>
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
const columns = [
  {
    dataIndex: "warehouseCode",
    key: "warehouseCode",
    title: "仓库编码",
    width: "20%"
  },
  {
    dataIndex: "name",
    title: "仓库名称",
    width: "30%",
    key: "name",
    scopedSlots: { customRender: "warehouseNmae" }
  },
  {
    dataIndex: "warehouseAdmins",
    title: "管理员",
    width: "20%",
    key: "warehouseAdmins"
  },

  {
    dataIndex: "phone",
    key: "phone",
    title: "联系方式",
    width: "15%"
  },
  {
    dataIndex: "isAvailable",
    key: "isAvailable",
    title: "当前状态",
    width: "10%",
    scopedSlots: { customRender: "state" }
  }
  // {
  //   dataIndex: "schedule",
  //   key: "schedule",
  //   title: "备注",
  //   width: "20%"
  // }
];
export default {
  data() {
    return {
      addVisible: false,
      editVisible: false,
      columns,
      current: 1,
      total: 0,
      data: [],
      selectedRowKeys: [],
      selectedRows: []
    };
  },
  methods: {
    addModal() {
      this.addVisible = false;
      this.getList();
    },
    editModal() {
      this.editVisible = false;
      this.getList();
    },
    handleCancel(a) {
      if (a == 1) {
        this.$refs.addref.quxiao();
      }
      if (a == 2) {
        this.$refs.editref.quxiao();
      }
    },
    switchChange(c, a, b) {
      if (c == true) {
        this.disable(a.id);
      } else if (c == false) {
        this.enable(a.id);
      }
      console.log(c, a, b);
    },
    onSelectChange(selectedRowKeys, a) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = a;
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
    getList() {
      this.Axios(
        {
          url: "/api-warehouse/warehouse/list",
          params: {
            page: this.current,
            size: this.pageSize
            // state: this.state,
            // keyword: this.keyword
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.data = result.data.data.content;
            this.data = this.data.map(item => {
              return {
                ...item,
                warehouseAdmins: item.warehouseAdmins
                  .map(item => item.employeeName)
                  .join("、")
              };
            });
            this.total = result.data.data.totalElement;
          }
        },
        ({ type, info }) => {}
      );
    },
    showDeleteConfirm() {
      let that = this;
      this.$confirm({
        title: "确定删除吗?",
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
    onDelete() {
      this.Axios(
        {
          url: "/api-warehouse/warehouse/del/" + this.selectedRowKeys,
          params: {},
          type: "delete",
          option: { successMsg: "删除成功！" }
          // config: {
          // 	headers: { "Content-Type": "application/json" }
          // }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            this.getList();
            this.selectedRowKeys = [];
            this.selectedRows = [];
          }
        },
        ({ type, info }) => {}
      );
    },
    disable(id) {
      this.Axios(
        {
          url: "/api-warehouse/warehouse/disable/" + id,
          params: {},
          type: "put",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            // console.log(result);
            this.getList();
          }
        },
        ({ type, info }) => {}
      );
    },
    enable(id) {
      this.Axios(
        {
          url: "/api-warehouse/warehouse/enable/" + id,
          params: {},
          type: "put",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            // console.log(result);
            this.getList();
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
<style lang="less">
.warehouse_list {
  overflow: hidden;
}
</style>