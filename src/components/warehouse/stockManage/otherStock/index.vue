<template>
  <div class="other_Stock">
    <router-view></router-view>
    <div :class="[{hide:isHideList}]">
      <a-row style="line-height:50px;">
        <permission-button
          permCode
          banType="hide"
          @click="$router.push({path:'/otherStock/addOtherStock'})"
        >
          <a-icon style="color:#1890ff;" type="plus" />新增
        </permission-button>
        <permission-button
          permCode
          banType="hide"
          @click="edit"
          :disabled="selectedRowKeys.length !== 1"
        >
          <a-icon style="color:#1890ff;" type="edit" />修改
        </permission-button>
        <permission-button
          permCode
          banType="hide"
          @click="handleCheck"
          :disabled="selectedRowKeys.length !== 1"
        >
          <i style="color:#1890ff;margin-right:4px;" class="iconfont">&#xe8ad;</i>审核
        </permission-button>
        <a-tooltip placement="top">
          <template slot="title">
            <span>即将上线...</span>
          </template>
          <permission-button permCode banType="hide" :disabled="selectedRowKeys.length !== 1">
            <i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60c;</i>打印预览
          </permission-button>
        </a-tooltip>
        <a-tooltip placement="top">
          <template slot="title">
            <span>即将上线...</span>
          </template>
          <permission-button permCode banType="hide" :disabled="selectedRowKeys.length !== 1">
            <i style="color:#1890ff;margin-right:4px;" class="iconfont">&#xe611;</i>导出Excel
          </permission-button>
        </a-tooltip>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-input-group class="changeDis">
            <span>仓库 :</span>
            <a-select
              defaultValue
              style="width: 300px"
              optionFilterProp="children"
              @change="getWarehouseValue"
            >
              <a-select-option value>全部</a-select-option>
              <a-select-option
                v-for="item in warehouseList"
                :key="item.id"
                :value="item.id"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-input-group>
          <span>日期 :</span>
          <a-range-picker
            style="width:240px;margin-right: 10px"
            @change="onChangeRange"
            format="YYYY/MM/DD"
          ></a-range-picker>
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
          <template slot="fromName" slot-scope="text, record">
            <a href="javascript:" @click="showDetails(record.id)">{{text}}</a>
          </template>
          <template slot="dataSource">
            <span>其他入库</span>
          </template>
          <template slot="state" slot-scope="text">
            <div>
              <span v-if="text==0" style="font-size:14px;color:#f6003c;">未审</span>
              <span v-if="text==-1" style="font-size:14px;color:#10CF0C;">已审</span>
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
    </div>
    <a-modal
      title="详情"
      v-model="detailsVisible"
      style="top:20px"
      width="1200px"
      :footer="null"
      :maskClosable="false"
      @cancel="handleCancel(1)"
      destroyOnClose
    >
      <Details :sendId="stockDetailsId"></Details>
    </a-modal>
  </div>
</template>
<script>
import Details from "./details";
const columns = [
  {
    dataIndex: "orderCode",
    title: "单据编号",
    key: "orderCode",
    width: "15%"
  },
  {
    dataIndex: "dataSource",
    title: "单据类型",
    key: "dataSource",
    scopedSlots: { customRender: "dataSource" },
    width: "10%"
  },
  {
    dataIndex: "fromName",
    title: "物料来源",
    key: "fromName",
    scopedSlots: { customRender: "fromName" },
    width: "20%"
  },
  // {
  //   dataIndex: "warehouse.name",
  //   title: "退回仓库",
  //   key: "warehouse.name",
  //   width: "15%"
  // },
  {
    dataIndex: "state",
    title: "状态",
    key: "state",
    scopedSlots: { customRender: "state" },
    width: "10%"
  },
  {
    dataIndex: "gmtCreated",
    title: "开单日期",
    key: "gmtCreated",
    width: "10%"
  },
  {
    dataIndex: "note",
    title: "备注",
    key: "note",
    width: "30%"
  }
];
export default {
  data() {
    return {
      columns,
      data: [],
      isHideList: this.$route.params.id !== undefined ? true : false,
      detailsVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      warehouseList: [],
      warehouseId: "",
      dateValue: "",
      keyWords: "",
      current: 1,
      pageSize: 10,
      total: 0,
      stockDetailsId: ""
    };
  },
  methods: {
    getWarehouseValue(value) {
      this.warehouseId = value;
      console.log(value);
    },
    edit() {
      if (this.selectedRows[0].state != 0) {
        this.$message.error(`不能修改该状态下的出库单`);
        return false;
      }
      this.$router.push({
        path: "/otherStock/editOtherStock/" + this.selectedRowKeys[0]
      });
    },
    handleCheck() {
      let that = this;
			this.$confirm({
				title: "确定要审核该单据吗？",
				content: "",
				okText: "确定",
				okType: "primary",
				cancelText: "取消",
				onOk: function() {
					that.check();
				},
				onCancel() {}
			});
    },
    check() {
      if (this.selectedRows[0].state === -1) {
        this.$message.error(`只能对待审核状态下的单子进行审核`);
        return false;
      }
      this.Axios(
        {
          url:
            "/api-warehouse/orderEntry/otherEntry?orderId=" +
            this.selectedRowKeys[0],
          params: {},
          type: "post",
          option: { successMsg: "审核成功！" }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
              console.log(result);
              this.selectedRowKeys = [];
              this.getList();
          }
        },
        ({ type, info }) => {}
      );
    },
    showDetails(id) {
      this.stockDetailsId = id;
      this.detailsVisible = true;
      console.log(this.stockDetailsId);
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      console.log(this.selectedRowKeys);
      console.log(this.selectedRows);
    },
    handleCancel(num) {
      if (num == 1) {
        this.detailsVisible = false;
        this.stockDetailsId = "";
      }
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
    getList() {
      this.Axios(
        {
          url: "/api-warehouse/returnEntry/list",
          type: "get",
          params: {
            dataSource: "OTHER",
            warehouseId: this.warehouseId,
            page: this.current,
            size: this.pageSize,
            keyword: this.keyWords,
            startTime: this.dateValue[0] != "" ? this.dateValue[0] : null,
            endTime: this.dateValue[1] != "" ? this.dateValue[1] : null
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
  components: {
    Details
  },
  created() {
    let a = this.$route.matched.find(item => item.name === "addOtherStock")
      ? true
      : false;
    let b = this.$route.params.id !== undefined ? true : false;
    this.isHideList = a || b ? true : false;
    this.getWareHouseList();
    this.getList();
  },
  watch: {
    $route() {
      this.getList();
      this.selectedRowKeys = [];
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