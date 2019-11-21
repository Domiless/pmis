<template>
  <div class="add_person">
    <a-col :span="12">
      <a-tree-select
        allowClear
        style="width: 100%;margin-bottom:8px;"
        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
        :treeData="treeData"
        placeholder="请选择"
        treeDefaultExpandAll
        @change="tableTreeselect"
        v-model="value"
      ></a-tree-select>
      <a-table
        :scroll="{ y: 300 }"
        size="small"
        :columns="columns"
        :pagination="false"
        :dataSource="data"
        :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
        rowKey="id"
      ></a-table>
    </a-col>
    <a-col :span="12" class="value_case">
      <ul>
        <h4>已选：</h4>
        <li v-for="(item, index) in selectedRows" :key="index">
          <span>{{item.userName}}</span>
          <a-icon type="close-circle" @click="delUserId(index)" />
        </li>
      </ul>
    </a-col>
    <a-col :span="5" :offset="19" style="margin-top:20px;">
      <permission-button permCode banType="hide" style="margin-right:12px;" @click="cancel">取消</permission-button>
      <permission-button permCode banType="hide" type="primary" @click="submit">提交</permission-button>
    </a-col>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "userName",
    title: "名称",
    width: "45%",
    key: "userName"
  },
  {
    dataIndex: "workTypeName",
    title: "职能/工种",
    width: "50%",
    key: "workTypeName"
  }
];
export default {
  data() {
    return {
      value: undefined,
      treeData: [],
      columns,
      selectedRowKeys: [],
      selectedRows: [],
      data: [],
      organizeId: ""
    };
  },
  methods: {
    cancel() {
      this.organizeId = "";
      this.$emit("addPersonModal", false);
      this.selectedRowKeys = [];
      this.selectedRows = [];
      this.getTreeDataList();
      this.getEmployeeList();
    },
    submit() {
      if (this.selectedRows.length < 1) {
        this.$message.error(`请选择人员`);
      } else {
        let params = [...this.selectedRows];
        this.$emit("addPersonModal", params);
        this.organizeId = "";
        this.selectedRowKeys = [];
        this.selectedRows = [];
        this.getTreeDataList();
        this.getEmployeeList();
      }
    },
    delUserId(index) {
      this.selectedRowKeys.splice(index, 1);
      this.selectedRows.splice(index, 1);
    },
    onSelectChange(selectedRowKeys, a) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = a;
    },
    getTreeDataList() {
      this.Axios(
        {
          url: "/api-platform/organize/list",
          params: {},
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.treeData = result.data.data.map(item => {
              return {
                title: item.organizeName,
                key: item.id,
                value: item.id,
                organizeCode: parseInt(item.organizeCode),
                organizeParentCode: parseInt(item.organizeParentCode),
                disabled: item.organizeParentCode == 0
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
    tableTreeselect(e) {
      console.log(e);
      this.organizeId = e != undefined ? e : "";
      this.selectedRowKeys = [];
      this.selectedRows = [];
      this.getEmployeeList();
    },
    getEmployeeList() {
      this.Axios(
        {
          url: "/api-platform/employee/organize?organizeId=" + this.organizeId,
          params: {},
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.data = result.data.data;

            for (let i = 0; i < this.data.length; i++) {
              this.data[i].workTypeName = "";
              if (this.data[i].workType != null) {
                for (let j = 0; j < this.data[i].workType.length; j++) {
                  this.data[i].workTypeName +=
                    this.data[i].workType[j].workTypeName +
                    (j == this.data[i].workType.length - 1 ? "" : "、");
                }
              }
            }
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.getTreeDataList();
    this.getEmployeeList();
  }
};
</script>
<style lang="less">
.add_person {
  overflow: hidden;
  .value_case {
    padding: 0px 12px;
    border-radius: 8px;
    height: 395px;
    overflow: hidden;
    ul {
      height: 395px;
      overflow-y: auto;
      background-color: #fafafa;
      border-radius: 4px;
      padding: 0 4px;
      line-height: 2.5;
      li {
        list-style-type: none;
        padding: 0 4px;
        position: relative;
        &:hover {
          background-color: #e6f7ff;
        }
        i {
          position: absolute;
          right: 12px;
          top: 12px;
          cursor: pointer;
          &:hover {
            color: #1890ff;
          }
        }
      }
    }
  }
}
</style>