<template>
  <div class="other_Stock">
    <router-view></router-view>
    <div :class="[{hide:isHideList}]">
      <a-row style="line-height:50px;" >
        <permission-button permCode banType="hide">
          <a-icon style="color:#1890ff;" type="plus" @click="$router.push({path:'/otherStock/addOtherStock'})" />新增
        </permission-button>
        <permission-button permCode banType="hide">
          <a-icon style="color:#1890ff;" type="edit" @click="edit"/>修改
        </permission-button>
        <permission-button permCode banType="hide">
          <i style="color:#1890ff;margin-right:4px;" class="iconfont">&#xe8ad;</i>审核
        </permission-button>
        <permission-button permCode banType="hide">
          <i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60c;</i>打印预览
        </permission-button>
        <permission-button permCode banType="hide">
          <i style="color:#1890ff;margin-right:4px;" class="iconfont">&#xe611;</i>导出Excel
        </permission-button>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-input-group class="changeDis">
            <span>仓库 : </span>
            <a-select style="width: 300px" optionFilterProp="children">
            </a-select>
          </a-input-group>
          <span>日期 :</span>
          <a-range-picker style="width:240px;margin-right: 10px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
          <span>关键词 :</span>
          <a-input
            placeholder="单据编号/物料来源"
            style="width: 250px"
            v-model="keyWords"
            @keyup.enter.native="getList"
          ></a-input>
          <a-button @click="getList">搜索</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-table
          rowKey="id"
          :columns="columns"
          :dataSource="data"
          :pagination="false"
          :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
        >
          <template slot="material_source" slot-scope="text, record">
            <a href="javascript:" @click="showDetails(record.id)">{{text}}</a>
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
    </div>
    <a-modal
        title="采购入库单"
        v-model="stockVisible" 
        style="top:20px" width="1200px" 
        :footer="null"
        :maskClosable="false"
        @cancel="handleCancel(1)">
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "invoicesNo",
    title: "单据编号",
    key: "invoicesNo",
    width: "15%"
  },
  {
    dataIndex: "invoicesType",
    title: "单据类型",
    key: "invoicesType",
    width: "10%"
  },
  {
    dataIndex: "material_source",
    title: "物料来源",
    key: "material_source",
    scopedSlots: { customRender: "material_source" },
    width: "20%"
  },
  {
    dataIndex: "warehouse",
    title: "退回仓库",
    key: "warehouse",
    width: "15%"
  },
  {
    dataIndex: "status",
    title: "状态",
    key: "status",
    width: "10%"
  },
  {
    dataIndex: "createDate",
    title: "开单日期",
    key: "createDate",
    width: "10%"
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark",
    width: "15%"
  },
];
export default {
  data() {
    return {
      columns,
      data: [],
      isHideList: this.$route.params.id !== undefined ? true : false,
      stockVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      dateValue: "",
      keyWords: "",
      current: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    edit() {
			this.$router.push({
				path: "/otherStock/editOtherStock/" + this.selectedRowKeys[0]
			});
		},
    showStock() {
        this.stockVisible = true;
    },
    onChangeRange(date, datestring) {
      this.dateValue = datestring;
      console.log(this.dateValue);
    },
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
    onSelectChange(selectedRowKeys,selectedRows) {
       this.selectedRowKeys = selectedRowKeys;
       this.selectedRows = selectedRows;
       console.log(this.selectedRowKeys);
       console.log(this.selectedRows);
    },
    handleCancel(num) {
      if( num == 1 ) {
        this.stockVisible = false;
      }
    },
    getList() {
      this.Axios(
        {
          url: "",
          type: "get",
          params: {
            page: this.current,
            size: this.pageSize,
            auditState: this.reviewSchedule != -1 ? this.reviewSchedule : null,
            keyword: this.keyWords,
            start: this.dateValue[0] != "" ? this.dateValue[0] : null,
            end: this.dateValue[1] != "" ? this.dateValue[1] : null
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
    }
  },
   created() {
    let a = this.$route.matched.find(item => item.name === "addOtherStock")
			? true
			: false;
		let b = this.$route.params.id !== undefined ? true : false;
		this.isHideList = a || b ? true : false;
  },
   watch: {
		$route() {
			let a = this.$route.matched.find(item => item.name === "addOtherStock")
				? true
				: false;
			let b = this.$route.params.id !== undefined ? true : false;
			this.isHideList = a || b ? true : false;
		}
	}
};
</script>
<style lang="less">
.other_Stock {
  padding: 0 20px;
  .changeDis {
    display: inline;
    margin: 0px 10px 0px 0px;
  }
  .ant-row:nth-child(1) {
    margin-bottom: 10px;
  }
  .ant-row:nth-child(2) {
    margin-bottom: 10px;
  }
}
</style>