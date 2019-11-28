<template>
  <div class="materia_list">
    <a-row style="padding-bottom:12px;">
      <span>关键字：</span>
      <a-input placeholder maxlength="50" style="width:300px;"></a-input>
      <a-button type="primary">查询</a-button>
    </a-row>
    <a-row>
      <a-col :span="5">
        <div class="left_case">
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
          <p>aa</p>
        </div>
      </a-col>
      <a-col :span="19" style="padding-left:4px;">
        <a-table
          :columns="columns"
          :pagination="pagination"
          :dataSource="data"
          rowKey="id"
          :customRow="(a,b)=>customRow(a,b)"
        ></a-table>
        <span class="msg">提示：双击可选择物料信息。</span>
      </a-col>
    </a-row>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "wuliaodainma",
    key: "wuliaodainma",
    title: "物料代码",
    width: 100
  },
  {
    dataIndex: "tuhao",
    key: "tuhao",
    title: "图号",
    width: 140
  },
  {
    dataIndex: "mingcheng",
    key: "mingcheng",
    title: "名称",
    width: 140
  },
  {
    dataIndex: "danwie",
    key: "danwie",
    title: "单位",
    width: 80
  }
];
export default {
  data() {
    return {
      pagination: {
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条`,
        size: "small"
      },
      columns,
      data: [
        { tuhao: 123123, id: 1 },
        { tuhao: 123123, id: 2 },
        { tuhao: 123123, id: 3 },
        { tuhao: 123123, id: 4 },
        { tuhao: 123123, id: 5 },
        { tuhao: 123123, id: 6 },
        { tuhao: 123123, id: 7 },
        { tuhao: 123123, id: 8 },
        { tuhao: 123123, id: 9 },
        { tuhao: 123123, id: 10 }
      ]
    };
  },
  methods: {
    customRow(record, index) {
      return {
        on: {
          dblclick: () => {
            this.$emit("choisceMsg", record);
          }
        }
      };
    }
  },
  created() {}
};
</script>
<style lang="less">
.materia_list {
  overflow: hidden;
  .ant-table-body {
    height: 330px;
  }
  .left_case {
    height: 330px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: auto;
    padding: 4px 8px;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 4px 4px;
  }
  .msg {
    position: absolute;
    bottom: 12px;
    left: -158px;
  }
  .ant-table-pagination.ant-pagination {
    margin: 8px 0;
    float: right;
  }
}
</style>