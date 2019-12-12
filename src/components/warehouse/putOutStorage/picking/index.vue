<template>
  <div class="picking_list">
    <router-view></router-view>
    <div :class="[{hide:isHideList}]">
      <a-row>
        <a-col :span="24" style="padding:0 20px;">
          <a-row>
            <div style="line-height:50px;">
              <a-col :span="15">
                <permission-button
                  permCode
                  banType="hide"
                  @click="$router.push({path:'/picking/add'})"
                >
                  <a-icon style="color:#1890ff;" type="plus" />新增
                </permission-button>
                <permission-button
                  @click="toEdit"
                  permCode
                  banType="hide"
                  :disabled="selectedRowKeys.length!=1"
                >
                  <a-icon style="color:#1890ff;" type="edit" />修改
                </permission-button>
                <permission-button
                  permCode
                  banType="hide"
                  @click="audit"
                  :disabled="selectedRowKeys.length!=1"
                >审核</permission-button>
                <permission-button permCode banType="hide" :disabled="selectedRowKeys.length!=1">
                  <i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60c;</i>打印预览
                </permission-button>
                <permission-button
                  permCode
                  banType="hide"
                  :disabled="selectedRowKeys.length!=1"
                >导出excel</permission-button>
              </a-col>
            </div>
          </a-row>
          <a-row style="padding: 10px 0;">
            <a-row>
              <a-col :span="24">
                <span>仓库：</span>
                <a-select v-model="warehouseId" style="width: 200px">
                  <a-select-option :value="-1">全部</a-select-option>
                  <a-select-option
                    :value="item.id"
                    v-for="(item, index) in allWarehouse"
                    :key="index"
                  >{{item.name}}</a-select-option>
                </a-select>
                <span>日期 :</span>
                <a-date-picker
                  :disabledDate="disabledStartDate"
                  format="YYYY/MM/DD"
                  v-model="startValue"
                  placeholder="开始日期"
                  @change="(a,b)=>onChangeRange(a,b,1)"
                  style="width:130px;"
                />
                <a-date-picker
                  :disabledDate="disabledEndDate"
                  format="YYYY/MM/DD"
                  placeholder="结束日期"
                  v-model="endValue"
                  @change="(a,b)=>onChangeRange(a,b,2)"
                  style="width:130px;"
                />
                <span>关键词 :</span>
                <a-input
                  placeholder="单据编号/领用部门/领用原因"
                  style="width: 250px"
                  v-model="keyWords"
                  @keyup.enter.native="getList"
                ></a-input>
                <a-button @click="getList">搜索</a-button>
              </a-col>
            </a-row>
          </a-row>
          <a-row style="padding-top:10px;">
            <a-table
              :columns="columns"
              :pagination="false"
              :dataSource="data"
              :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
              rowKey="id"
            >
              <template slot="lingyongbumen" slot-scope="text, record, index">
                <a href="javascript:">{{text}}</a>
              </template>
              <template slot="remark" slot-scope="text, record, index">
                <div class="content_style" style="max-width:200px;">{{record.note}}</div>
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
          <!-- <a-modal
            title="新增"
            :footer="null"
            width="1400px"
            :visible="addVisible"
            @cancel="handleCancel(1)"
            :maskClosable="false"
            :destroyOnClose="true"
          >
            <add v-on:addModal="addModal" ref="addref"></add>
          </a-modal>
          <a-modal
            title="修改"
            :footer="null"
            width="800px"
            :visible="editVisible"
            @cancel="handleCancel(2)"
            :maskClosable="false"
            :destroyOnClose="true"
          ></a-modal>-->
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import add from "./add";
const columns = [
  {
    dataIndex: "code",
    key: "code",
    title: "单据编号",
    width: "15%"
  },
  {
    dataIndex: "outType",
    title: "单据类型",
    width: "8%",
    key: "outType",
    customRender: function(text, record, index) {
      return text == "RECEIVE"
        ? "领料出库"
        : text == "SALES"
        ? "销售出库"
        : text == "RETURN"
        ? "退货出库"
        : "其他出库";
    }
  },
  {
    dataIndex: "goName",
    title: "领用部门",
    width: "15%",
    key: "goName",
    scopedSlots: { customRender: "lingyongbumen" }
  },

  {
    dataIndex: "reason",
    key: "reason",
    title: "领用原因",
    width: "15%"
  },
  {
    dataIndex: "warehouse",
    key: "warehouse",
    title: "出货仓库",
    width: "8%"
  },
  {
    dataIndex: "state",
    key: "state",
    title: "状态",
    width: "8%",
    customRender: function(text, record, index) {
      return text == 0 ? "待审核" : text == -1 ? "已通过" : "";
    }
  },
  {
    dataIndex: "gmtCreated",
    key: "gmtCreated",
    title: "开单日期",
    width: "12%"
  },
  {
    dataIndex: "note",
    key: "note",
    title: "备注",
    width: "14%",
    scopedSlots: { customRender: "remark" }
  }
];
export default {
  data() {
    return {
      isHideList: this.$route.params.id !== undefined ? true : false,
      // addVisible: false,
      // editVisible: false,
      columns,
      data: [],
      pageSize: 10,
      current: 1,
      total: 0,
      selectedRowKeys: [],
      selectedRows: [],
      dateValue: [],
      keyWords: "",
      warehouseId: -1,
      startDate: null,
      endDate: null,
      startValue: null,
      endValue: null,
      allWarehouse: []
    };
  },
  methods: {
    audit() {
      if (this.selectedRows[0].state == 0) {
        this.Axios(
          {
            url:
              "/api-warehouse/out/outWarehouse?outOrderId=" +
              this.selectedRowKeys[0],
            params: {},
            type: "post",
            option: { successMsg: "审核成功！" }
          },
          this
        ).then(
          result => {
            if (result.data.code === 200) {
              this.getList();
            }
          },
          ({ type, info }) => {}
        );
      } else {
        this.$message.error(`只能对待审核状态下的单子进行审核`);
      }
    },
    toEdit() {
      if (this.selectedRows[0].state != 0) {
        this.$message.error(`不能修改该状态下的出库单`);
        return false;
      }
      this.$router.push({
        path: "/picking/edit/" + this.selectedRowKeys[0]
      });
    },
    onChangeRange(date, datestring, c) {
      if (c == 1) {
        this.startDate = datestring;
      }
      if (c == 2) {
        this.endDate = datestring;
      }
    },
    // handleCancel(a) {
    //   if (a == 1) {
    //     this.addVisible = false;
    //     // this.$refs.addref.quxiao();
    //   }
    // },
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    onSelectChange(selectedRowKeys, a) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = a;
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getList();
    },
    onChange(current, pageNumber) {
      console.log("Page: ", pageNumber);
      console.log("第几页: ", current);
      this.current = current;
      this.getList();
    },
    getList() {
      this.Axios(
        {
          url: "/api-warehouse/outOrder/list",
          params: {
            page: this.current,
            size: this.pageSize,
            outType: "RECEIVE",
            warehouseId: this.warehouseId != -1 ? this.warehouseId : null,
            startTime: this.startDate != "" ? this.startDate : null,
            endTime: this.endDate != "" ? this.endDate : null,
            keyword: this.keyword
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.selectedRowKeys = [];
            this.selectedRows = [];
            this.data = result.data.data.content;
            this.total = result.data.data.totalElement;
            this.data = this.data.map(item => {
              return {
                ...item,
                warehouse: item.warehouse.name
              };
            });
          }
        },
        ({ type, info }) => {}
      );
    },
    getWearhouse() {
      this.Axios(
        {
          url: "/api-warehouse/warehouse/list",
          params: {
            page: -1
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            this.allWarehouse = [...result.data.data];
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.getList();
    this.getWearhouse();
    let a = this.$route.matched.find(item => item.name === "add")
      ? true
      : false;
    let b = this.$route.params.id !== undefined ? true : false;
    this.isHideList = a || b ? true : false;
  },
  components: {
    add
  },
  watch: {
    $route() {
      this.getList();
      let a = this.$route.matched.find(item => item.name === "add")
        ? true
        : false;
      let b = this.$route.params.id !== undefined ? true : false;
      this.isHideList = a || b ? true : false;
    }
  }
};
</script>
<style lang="less">
.picking_list {
  overflow: hidden;
}
</style>