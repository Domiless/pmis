<template>
    <div class="warnSetting">
        <a-row style="margin-bottom: 10px">
            <a-col :span="24">
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
                size="small"
                class="table_style"
                :scroll="{y:500}"
                :columns="columns"
                :dataSource="data"
                :pagination="false"
                >
                    <template slot="name" slot-scope="text, record">
                        <a href="javascript:" @click="showDetails(record)">{{text}}</a>
                    </template>
                    <template
                      slot="warningAmount"
                      slot-scope="text, record, index"
                    >
                      <div key="warningAmount">
                        <a-input
                          v-if="record.editable"
                          style="margin: -5px 0"
                          :value="text"
                          @change="e => handleChange(e.target.value, record.id, 'warningAmount')"
                        />
                        <template v-else>{{text}}</template>
                      </div>
                    </template>
                    <template slot="caozuo" slot-scope="text, record, index">
                         <div class="editable-row-operations">
                          <span v-if="record.editable">
                            <a @click="() => save(record.id)">保存</a>
                            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.id)">
                              <a>取消</a>
                            </a-popconfirm>
                          </span>
                          <span v-else>
                            <a @click="() => edit(record.id)">编辑</a>
                          </span>
                        </div>
                    </template>
              </a-table>
          </a-col>
          <a-col :span="12"  style="margin-top:12px;color: #999999;font-size:12px">
                <span>提示：若“物料下限”设置为0或为空时，表示不进行库存报警</span>
          </a-col>
          <a-col :span="12">
              <a-pagination
                style="padding-top:12px;text-align: right;"
                showQuickJumper
                size="small"
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
        title="详情"
        :footer="null"
        width="800px"
        :visible="detailsVisible"
        @cancel="handleCancel"
        :maskClosable="false"
        :destroyOnClose="true"
      >
        <Details :detailsMsg="detailsMsg"></Details>
      </a-modal>
    </div>
</template>
<script>
import Details from "./details"
const columns = [
  {
    dataIndex: "code",
    key: "code",
    title: "物料编码",
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
    dataIndex: "specification",
    key: "specification",
    title: "型号/规格",
    width: 100
  },
  {
    dataIndex: "unit",
    key: "unit",
    title: "单位",
    width: 80
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
    scopedSlots: { customRender: "warningAmount" },
    width: 120,
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
            keyWords: "",
            current: 1,
            pageSize: 10,
            total: 0,
            treeId: '',
            defaultChecked: [],
            detailsVisible: false,
            detailsMsg: [],
        }
    },
    methods: {
        handleCancel() {
          this.detailsVisible = false;
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
        showDetails(value) {
          this.detailsMsg = value;
          this.detailsVisible = true;
          console.log(this.detailsMsg);
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
                warehouseId: '',
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
        },
      handleChange(value, key, column) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.data = newData;
        }
      },
      edit(key) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target.editable = true;
          this.data = newData;
        }
        console.log(this.data);
      },
      save(key) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          delete target.editable;
          this.data = newData;
          this.cacheData = newData.map(item => ({ ...item }));
        }
      },
      cancel(key) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
          delete target.editable;
          this.data = newData;
        }
      },
    },
    components: {
        Details
    },
    created() {
      this.getClassify();
    }
}
</script>
<style lang="less">
.warnSetting {
  .label_right {
        display: inline-block;
        width: 80px;
        text-align: right;
    }
    .table_style {
        position: relative;
        .ant-table-body {
          min-height: 500px;
          max-height: 500px;
        }
        .ant-table-placeholder {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -44px;
        margin-top: -27px;
      }
    }
  .editable-row-operations a {
    margin-right: 8px;
  }
}
</style>