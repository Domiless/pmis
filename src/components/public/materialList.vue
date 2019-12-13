<template>
  <div class="materia_list">
    <a-row style="padding-bottom:12px;">
      <span>关键字：</span>
      <a-input :value="keyWords" placeholder maxlength="50" style="width:300px;"></a-input>
      <a-button type="primary">查询</a-button>
    </a-row>
    <a-row>
      <a-col :span="5">
        <div class="left_case">
          <a-tree :treeData="treeData" @select="getList" :defaultExpandAll="true" :autoExpandParent="true">
          </a-tree>
        </div>
      </a-col>
      <a-col :span="19" style="padding-left:4px;">
        <a-table
          :columns="columns"
          :pagination="pagination"
          :dataSource="data"
          rowKey="id"
          :customRow="(a,b)=>customRow(a,b)"
        >
        <template slot="code" slot-scope="text, record">
          <div class="codeMsg">{{text}}</div>
        </template>
        </a-table>
        <span class="msg">提示：双击可选择物料信息。</span>
      </a-col>
    </a-row>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "code",
    key: "code",
    title: "物料代码",
    scopedSlots: { customRender: "code" },
    width: 100
  },
  {
    dataIndex: "drawingCode",
    key: "drawingCode",
    title: "图号",
    width: 180
  },
  {
    dataIndex: "name",
    key: "name",
    title: "名称",
    width: 180
  },
  {
    dataIndex: "xinghaoguige",
    key: "xinghaoguige",
    title: "型号/规格",
    width: 140
  },
  {
    dataIndex: "specification",
    key: "specification",
    title: "型号/规格",
    width: 140
  },
  {
    dataIndex: "unit",
    key: "unit",
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
        // { tuhao: 123123, id: 1 },
        // { tuhao: 123123, id: 2 },
        // { tuhao: 123123, id: 3 },
        // { tuhao: 123123, id: 4 },
        // { tuhao: 123123, id: 5 },
        // { tuhao: 123123, id: 6 },
        // { tuhao: 123123, id: 7 },
        // { tuhao: 123123, id: 8 },
        // { tuhao: 123123, id: 9 },
        // { tuhao: 123123, id: 10 }
      ],
      total: 0,
      treeData: [],
      keyWords: ''
    };
  },
  methods: {
    customRow(record, index) {
      return {
        on: {
          dblclick: () => {
            // this.findOne(record.id);
            this.$emit("choisceMsg", record);
          }
        }
      };
    },
    findOne(id) {
      this.Axios(
        {
          url: "/api-warehouse/warehouseItem/findOne",
          type: "get",
          params: {
            warehouseItemId: id
          },
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);

          }
        },
        ({ type, info }) => {}
      );
    },
    getClassify() {
      this.Axios(
        {
          url: "/api-warehouse/classification/list",
          type: "get",
          params: {},
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.treeData = result.data.data.map(item => {
              return {
                title: item.name,
                key: item.id,
                value: item.id,
                organizeCode: parseInt(item.code),
                organizeParentCode: parseInt(item.parentCode),
                
                
              };
            });
            let code = Math.min.apply(
              null,
              this.treeData.map(item => {
                return item.organizeParentCode;
              })
            );
            this.treeData = this.filterArray(this.treeData, code);
          }
        },
        ({ type, info }) => {}
      );
    },
    filterArray(data, parent) {
      let vm = this;
      var tree = [];
      var temp;
      for (var i = 0; i < data.length; i++) {
        if (data[i].organizeParentCode == parent) {
          var obj = data[i];
          temp = this.filterArray(data, data[i].organizeCode);
          if (temp.length > 0) {
            obj.children = temp;
          }
          tree.push(obj);
        }
      }
      return tree;
    },
    getList(selectKey) {
      console.log(selectKey);
      if(selectKey.length === 0) {
          return false
      }
      this.Axios(
        {
          url: "/api-warehouse/warehouseItem/selectList",
          type: "get",
          params: {
            classifyId: selectKey[0],
            keyword: this.keyWords
          },
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.data = result.data.data;
            this.total = result.data.data.length;
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.getClassify();
  }
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
  .codeMsg {
    width: 100px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
}
</style>