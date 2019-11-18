<template>
  <div class="addBuyer">
    <a-row class="first_row">
      <a-col :span="12" class="table_case">
        <a-col :span="24">
          <a-tree-select
            allowClear
            style="width: 100%"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="treeData"
            placeholder="请选择"
            treeDefaultExpandAll
            @change="tableTreeselect"
          ></a-tree-select>
        </a-col>
        <a-col :span="24">
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
      </a-col>
      <a-col :span="12" class="value_case">
        <a-col :span="24">
          <ul>
            <h4>已选：</h4>
            <li v-for="(item, index) in selectedRows" :key="index">
              <span>{{item.userName}}</span>
              <a-icon type="close-circle" @click="delUserId(index)" />
            </li>
          </ul>
        </a-col>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="5" :offset="19">
        <permission-button permCode banType="hide" style="margin-right:12px;" @click="cancel">取消</permission-button>
        <permission-button permCode banType="hide" type="primary" @click="submit">提交</permission-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { TreeSelect } from "ant-design-vue";
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
      data: [],
      treeData: [],
      columns,
      selectedRowKeys: [],
      selectedRows: [],
      organizeId: ""
    };
  },
  methods: {
    cancel() {
			this.$emit("cancelAdd", false);
			this.selectedRowKeys = [];
			this.selectedRows = [];
    },
    submit() {
      let data = this.selectedRows.map(item => {
        return {
          userId: item.id,
          name: item.userName
        };
      });
      console.log(data);
      this.Axios(
        {
          url: "/api-order/buyer/add",
          params: data,
          type: "post",
          option: { successMsg: "添加成功！" },
          config: {
            headers: { "Content-Type": "application/json" }
          }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.cancel();
            this.selectedRowKeys = [];
            this.selectedRows = [];
          }
        },
        ({ type, info }) => {}
      );
    },
    tableTreeselect(e) {
      console.log(e);
    },
    onSelectChange(selectedRowKeys, a) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = a;
      console.log(this.selectedRowKeys);
      console.log(a);
    },
    delUserId(index) {
      this.selectedRowKeys.splice(index, 1);
      this.selectedRows.splice(index, 1);
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
.addBuyer {
  .first_row {
    margin-bottom: 10px;
  }
  .table_case {
    background-color: #fafafa;
    padding: 8px;
    border-radius: 4px;
    height: 395px;
    overflow: hidden;
  }
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