<template>
  <div class="measureUnit">
    <a-row style="line-height:50px;">
      <permission-button permCode banType="hide" @click="addVisible=true">
        <a-icon style="color:#1890ff;" type="plus" />新增
      </permission-button>
      <permission-button permCode banType="hide" @click="editVisible=true">
        <a-icon style="color:#1890ff;" type="edit" />修改
      </permission-button>
      <permission-button permCode banType="hide">
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
    <a-modal
     title="新增"
     v-model="addVisible" 
     width="500px" 
    :footer="null"
    >
    </a-modal>
    <a-modal
     title="修改"
     v-model="editVisible" 
     width="500px" 
    :footer="null"
    >
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "measureUnit",
    title: "计量单位",
    key: "measureUnit",
    width: "60%"
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark",
    width: "40%"
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
  }
};
</script>
<style lang="less" scoped>
.measureUnit {
  padding: 0 20px;
  .ant-row:nth-child(1) {
    margin-bottom: 10px;
  }
  .ant-row:nth-child(2) {
      margin-bottom: 10px;
  }
}
</style>