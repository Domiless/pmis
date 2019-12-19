<template>
    <div class="storageList">
        <a-row style="line-height:50px;margin-bottom: 20px;" >
            <permission-button permCode banType="hide" @click="showSetting">
                <i style="color:#1890ff;margin-right:4px;" class="iconfont">&#xe8ad;</i>预警设置
            </permission-button>
        </a-row>
        <a-row style="margin-bottom: 10px">
            <a-col :span="24">
            <a-input-group class="changeDis">
                <span>仓库 : </span>
                <a-select defaultValue="" style="width: 300px" optionFilterProp="children" @change="getWarehouseValue">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
            </a-input-group>
            <span>关键词 :</span>
            <a-input
                placeholder="物料编码/图号/名称"
                style="width: 250px"
                v-model="keyWords"
                @keyup.enter.native="search"
            ></a-input>
            <a-button @click="search" @keyup.enter.native="search">搜索</a-button>
            </a-col>
      </a-row>
      <a-row>
          <a-col :span="3">
              <div class="left_case">
                  <a-tree v-if="treeData.length" :treeData="treeData" @select="getList"
                   :defaultSelectedKeys="defaultChecked"
                   :defaultExpandedKeys="defaultChecked"
                   >
                  </a-tree>
              </div>
          </a-col>
          <a-col :span="21">
              <a-table
                rowKey="id"
                :columns="columns"
                :dataSource="data"
                :pagination="false"
                >
                    <template slot="code" slot-scope="text, record">
                         <a-tooltip>
                            <template slot="title">
                              {{text}}
                            </template>
                            <div class="codeMsg">{{text}}</div>
                        </a-tooltip>
                    </template>
                    <template slot="caozuo" slot-scope="text, record">
                        <a href="javascript:" @click="showEdit(record.id)">修改</a>
                    </template>
                    <template slot="name" slot-scope="text, record">
                        <a href="javascript:" @click="showDetails(record)">{{text}}</a>
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
          </a-col>
      </a-row>
      <a-modal
        title="预警设置"
        v-model="settingVisible" 
        style="top:20px;height=600px" width="1200px" 
        :footer="null"
        :maskClosable="false"
        @cancel="handleCancel(1)">
        <warnSetting></warnSetting>
    </a-modal>
    <a-modal
      title="修改"
      :footer="null"
      width="1000px"
      :visible="editVisible"
      @cancel="handleCancel(2)"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <Edit @cancelEdit="closeEdit" :sendId="sendEditId"></Edit>
    </a-modal>
    <a-modal
      title="详情"
      :footer="null"
      width="800px"
      :visible="detailsVisible"
      @cancel="handleCancel(3)"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <Details :detailsMsg="detailsMsg"></Details>
    </a-modal>
    </div>
</template>
<script>
import WarnSetting  from "./warnSetting"
import Edit from "./edit"
import Details from "./details"
const columns = [
  {
    dataIndex: "code",
    key: "code",
    title: "物料编码",
    scopedSlots: { customRender: "code" },
    width: 200
  },
  {
    dataIndex: "drawingCode",
    key: "drawingCode",
    title: "图号",
    width: 140
  },
  {
    dataIndex: "name",
    key: "name",
    title: "名称",
    scopedSlots: { customRender: "name" },
    width: 140
  },
  {
    dataIndex: "unit",
    key: "unit",
    title: "单位",
    width: 80
  },
  {
    dataIndex: "classification.name",
    key: "classification.name",
    title: "物料分类",
    width: 100
  },
  {
    dataIndex: "warehouse.name",
    key: "warehouse.name",
    title: "仓库",
    width: 100
  },
  {
    dataIndex: "amount",
    key: "amount",
    title: "库存数量",
    width: 100
  },
  {
    dataIndex: "warningAmount",
    key: "warningAmount",
    title: "物料下限",
    width: 120,
  },
  {
    dataIndex: "note",
    key: "note",
    title: "备注",
    width: 160,
  },
  {
    dataIndex: "caozuo",
    key: "caozuo",
    title: "操作",
    width: 100,
    scopedSlots: { customRender: "caozuo" }
  }
];
export default {
    data() {
        return {
            columns,
            data: [],
            treeData: [],
            settingVisible: false,
            detailsVisible: false,
            editVisible: false,
            keyWords: "",
            current: 1,
            pageSize: 10,
            total: 0,
            sendEditId: '',
            detailsMsg: [],
            warehouseList: [],
            treeId: '',
            defaultChecked: []
        }
    },
    methods: {
        getWarehouseValue(value) {
          this.warehouseId = value;
          console.log(value);
        },
        showSetting() {
            this.settingVisible = true;
        },
        showEdit(id) {
          this.sendEditId = id;
          this.editVisible = true;
          console.log(id);
        },
        showDetails(value) {
          this.detailsMsg = value;
          this.detailsVisible = true;
          console.log(this.detailsMsg);
        },
        handleCancel(num) {
            if( num === 1 ) {
                this.settingVisible = false;
            }
            if( num === 2 ) {
                this.editVisible = false;
            }
            if( num === 3 ) {
                this.detailsVisible = false;
            }
        },
        closeEdit(params){
          this.editVisible = params;
          this.getList(this.defaultChecked);
        },
        onShowSizeChange(current, pageSize) {
            this.pageSize = pageSize;
            this.current = 1;
            this.search();
        },
        onChange(current, pageNumber) {
            console.log("Page: ", pageNumber);
            console.log("第几页: ", current);
            this.current = current;
            this.search();
        },
        getWareHouseList() {
          this.Axios(
            {
              url: "/api-warehouse/warehouse/list",
              type: "get",
              params: {
                page: -1
              },
              option: { enableMsg: false }
            },
            this
          ).then(
            result => {
              if (result.data.code === 200) {
                console.log(result);
                this.warehouseList = result.data.data;
              }
            },
            ({ type, info }) => {}
          );
        },
        // getList() {
        //     this.Axios(
        //         {
        //         url: "",
        //         type: "get",
        //         params: {
        //             page: this.current,
        //             size: this.pageSize,
        //             keyword: this.keyWords,
        //         },
        //         option: { enableMsg: false }
        //         },
        //         this
        //     ).then(
        //         result => {
        //         if (result.data.code === 200) {
        //             console.log(result);
        //             this.data = result.data.data.content;
        //             this.total = result.data.data.totalElement;
        //         }
        //         },
        //         ({ type, info }) => {}
        //     );
        // },
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
                console.log(this.treeData);
                this.defaultChecked.push(this.treeData[0].key);
                this.getList(this.defaultChecked);
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
          this.treeId = selectKey[0];
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
        },
        search() {
          if( this.treeId === '' ) {
            this.$message.error("请选择分类");
            return false;
          }
          this.Axios(
            {
              url: "/api-warehouse/warehouseItem/list",
              type: "get",
              params: {
                page: this.current,
                size: this.pageSize,
                warehouseId: this.warehouseId,
                classifyId: this.treeId,
                keyword: this.keyWords
              },
              option: { enableMsg: false }
            },
            this
          ).then(
            result => {
              if (result.data.code === 200) {
                console.log(result);
                this.data = result.data.data.content;
                this.total = result.data.data.length;
              }
            },
            ({ type, info }) => {}
          );
        }
    },
    components: {
        WarnSetting,
        Edit,
        Details
    },
    created() {
      this.getClassify();
      this.getWareHouseList();
    }
}
</script>
<style lang="less">
.storageList{
    padding: 0 20px;
    .changeDis {
    display: inline;
    margin: 0px 10px 0px 0px;
  }
  .treeArea {
      margin-right: 10px;
      height: 400px;
      border: 1px solid #999999;
  }
  .left_case {
    margin-right: 10px;
    height: 100%;
    // border: 1px solid #e8e8e8;
    // border-radius: 4px;
    overflow: auto;
    padding: 4px 8px;
  }
  .codeMsg {
    width: 200px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
}
</style>