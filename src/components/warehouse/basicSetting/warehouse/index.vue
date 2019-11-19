<template>
  <div class="warehouse_list">
    <a-row>
      <a-col :span="24" style="padding:0 20px;">
        <a-row>
          <div style="line-height:50px;">
            <a-col :span="15">
              <permission-button permCode banType="hide">
                <a-icon style="color:#1890ff;" type="plus" />新增
              </permission-button>
              <permission-button permCode banType="hide" :disabled="selectedRowKeys.length!=1">
                <a-icon style="color:#1890ff;" type="edit" />修改
              </permission-button>
              <permission-button
                permCode
                banType="hide"
                @click="showDeleteConfirm"
                :disabled="selectedRowKeys.length<1"
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
            <template slot="title11" slot-scope="text, record, index">
              <div>
                <!-- <a-button class="button_text" @click="showDetails(record)">{{text}}</a-button> -->
                <a href="jsvascript:" @click="showDetails(record)">{{text}}</a>
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
      </a-col>
    </a-row>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "docNo",
    key: "docNo",
    title: "仓库编码",
    width: "20%"
  },
  {
    dataIndex: "title",
    title: "仓库名称",
    width: "20%",
    key: "title",
    scopedSlots: { customRender: "hasWorkLoad" }
  },
  {
    dataIndex: "deliveryUnit",
    title: "管理员",
    width: "10%",
    key: "deliveryUnit"
  },

  {
    dataIndex: "receivingPerson",
    key: "receivingPerson",
    title: "联系方式",
    width: "15%"
  },
  {
    dataIndex: "gmtCreated",
    key: "gmtCreated",
    title: "当前状态",
    width: "10%",
    scopedSlots: { customRender: "state" }
  },
  {
    dataIndex: "schedule",
    key: "schedule",
    title: "备注",
    width: 120
  }
];
export default {
  data() {
    return {
      columns,
      current: 1,
      total: 0,
      data: [],
      selectedRowKeys: [],
      selectedRows: []
    };
  },
  methods: {
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
          url: "/api-workorder/workOrder/list",
          params: {
            page: this.current,
            size: this.pageSize,
            state: this.state,
            keyword: this.keyword
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
          url: "/api-workorder/delivery/del",
          params: { data: this.selectedRowKeys },
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
    }
  },
  created() {}
};
</script>
<style lang="less">
.warehouse_list {
  overflow: hidden;
}
</style>