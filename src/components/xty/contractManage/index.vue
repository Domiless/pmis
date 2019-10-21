<template>
  <div class="contractManage">
    <a-row style="line-height:50px;">
      <permission-button permCode banType="hide" @click="addVisible=true">
        <a-icon style="color:#1890ff;" type="plus" />新增
      </permission-button>
      <permission-button permCode banType="hide" @click="editVisible=true" :disabled="selectedRowKeys.length!=1">
        <a-icon style="color:#1890ff;" type="edit" />修改
      </permission-button>
      <permission-button permCode banType="hide" @click="showDeleteConfirm" :disabled="selectedRowKeys.length<1">
        <a-icon style="color:#1890ff;" type="delete" />删除
      </permission-button>
    </a-row>
    <a-row>
      <a-table
        rowKey="id"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
      ></a-table>
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
    <a-modal title="新增" v-model="addVisible" :maskClosable="false" width="1200px" :footer="null">
      <add-contract-manage @changeAddContract="closeAdd"></add-contract-manage>
    </a-modal>
    <a-modal title="修改" v-model="editVisible" :maskClosable="false" width="1200px" :footer="null">
      <edit-contract-manage @changeEditContract="closeEdit" :contractId="this.selectedRowKeys[0]"></edit-contract-manage>
    </a-modal>
  </div>
</template>
<script>
import AddContractManage from "./add";
import EditContractManage from "./edit";
const columns = [
  {
    dataIndex: "title",
    title: "合同名称",
    key: "title",
    width: "60%"
  },
  {
    dataIndex: "editMan",
    title: "编辑人",
    key: "editMan",
    width: "20%"
  },
  {
    dataIndex: "gmtModified",
    title: "最后修改时间",
    key: "gmtModified",
    width: "20%"
  }
];
export default {
  data() {
    return {
      columns,
      data: [],
      selectedRowKeys: [],
      addVisible: false,
      editVisible: false,
      current: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
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
      console.log(this.selectedRowKeys);
    },
    closeAdd() {
      this.addVisible = false;
      this.getList();
    },
    closeEdit(){
      this.editVisible = false;
      this.selectedRowKeys = [];
      this.getList();
    },
    getList() {
      this.Axios(
        {
          url: "/api-order/template/list",
          type: "get",
          params: {
            page: this.current,
            size: this.pageSize,
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
          url: "/api-order/template/delete",
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
    AddContractManage,
    EditContractManage
  },
  created() {
	  this.getList();
  }
};
</script>
<style lang="less" scoped>
.contractManage {
  padding: 0 20px;
  .ant-row:nth-child(1) {
    margin-bottom: 10px;
  }
  .ant-row:nth-child(2) {
    margin-bottom: 10px;
  }
}
</style>