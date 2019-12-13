<template>
  <div class="procurement_Stock">
    <!-- <a-row style="line-height:50px;" >
      <permission-button permCode banType="hide" @click="showStock">
        <a-icon style="color:#1890ff;" type="plus" />采购入库
      </permission-button>
    </a-row> -->
    <a-row>
      <a-col :span="24">
        <a-input-group class="changeDis">
          <span>仓库 : </span>
          <a-select defaultValue="" style="width: 300px" optionFilterProp="children" @change="getWarehouseValue">
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-input-group>
        <span>日期 :</span>
        <a-range-picker style="width:240px;margin-right: 10px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
        <span>关键词 :</span>
        <a-input
          placeholder="单据编号/供应商"
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
        <template slot="caozuo" slot-scope="text, record">
          <a href="javascript:" @click="showStock(record.id)">立即处理</a>
        </template>
        <template slot="dataSource">
          <span>采购入库</span>
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
    <a-modal
        title="采购入库单"
        v-model="stockVisible" 
        style="top:20px" width="1300px" 
        :footer="null"
        :maskClosable="false"
        @cancel="handleCancel(1)">
      <stock :sendId="itemId"></stock>
    </a-modal>
    <a-modal
        title="详情"
        v-model="detailsVisible" 
        style="top:20px" width="1300px" 
        :footer="null"
        :maskClosable="false"
        @cancel="handleCancel(2)">
      <stockDetails :sendId="stockDetailsId"></stockDetails>
    </a-modal>
  </div>
</template>
<script>
import stock from "./stock"
import stockDetails from  "./details"
const columns = [
  {
    dataIndex: "orderCode",
    title: "单据编号",
    key: "orderCode",
    width: "25%"
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
    title: "供应商",
    key: "fromName",
    scopedSlots: { customRender: "fromName" },
    width: "20%"
  },
  {
    dataIndex: "warehouse.name",
    title: "收货仓库",
    key: "warehouse.name",
    width: "15%"
  },
  {
    dataIndex: "gmtCreated",
    title: "开单日期",
    key: "gmtCreated",
    width: "15%"
  },
  {
    dataIndex: "caozuo",
    title: "操作",
    key: "caozuo",
    scopedSlots: { customRender: "caozuo" },
    width: "10%"
  }
];
export default {
  data() {
    return {
      columns,
      data: [
        {
          createDate: "2019/12/4"
        }
      ],
      stockVisible: false,
      detailsVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      warehouseList: [],
      warehouseId: '',
      dateValue: "",
      keyWords: "",
      current: 1,
      pageSize: 10,
      total: 0,
      itemId: '',
      stockDetailsId: ''
    };
  },
  methods: {
    getWarehouseValue(value) {
      this.warehouseId = value;
      console.log(value);
    },
    showStock(id) {
      this.itemId = id;
      this.stockVisible = true;
      console.log(id);
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
    onSelectChange(selectedRowKeys,selectedRows) {
       this.selectedRowKeys = selectedRowKeys;
       this.selectedRows = selectedRows;
       console.log(this.selectedRowKeys);
       console.log(this.selectedRows);
    },
    handleCancel(num) {
      if( num === 1 ) {
        this.stockVisible = false;
      }
      if( num === 2 ) {
        this.detailsVisible = false;
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
          url: "/api-warehouse/order/list",
          type: "get",
          params: {
            dataSource: "PURCHASING",
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
      stock,
      stockDetails
  },
  created() {
    this.getWareHouseList();
    this.getList();
  }
};
</script>
<style lang="less">
.procurement_Stock {
  padding: 0 20px;
  .changeDis {
    display: inline;
    margin: 0px 10px 0px 0px;
  }
  .ant-row:nth-child(1) {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .ant-row:nth-child(2) {
    margin-bottom: 10px;
  }
}
</style>