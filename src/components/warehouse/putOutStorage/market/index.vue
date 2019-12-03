<template>
  <div class="market_list">
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
                  @click="$router.push({path:'/market/add'})"
                >
                  <a-icon style="color:#1890ff;" type="plus" />新增
                </permission-button>
                <permission-button permCode banType="hide" :disabled="selectedRowKeys.length!=1">
                  <a-icon style="color:#1890ff;" type="edit" />修改
                </permission-button>
                <permission-button permCode banType="hide" :disabled="selectedRowKeys.length!=1">审核</permission-button>
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
                <a-select defaultValue="lucy" style="width: 200px">
                  <a-select-option value="jack">Jack</a-select-option>
                  <a-select-option value="lucy">Lucy</a-select-option>
                  <a-select-option value="Yiminghe">yiminghe</a-select-option>
                </a-select>
                <span>日期 :</span>
                <a-range-picker style="width:240px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
                <span>关键词 :</span>
                <a-input
                  placeholder="单据编号/客户名称/联系人/联系电话"
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
                <div class="content_style" style="max-width:200px;">{{record.remark}}</div>
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
    dataIndex: "bianhao",
    key: "bianhao",
    title: "单据编号",
    width: "15%"
  },
  {
    dataIndex: "leixing",
    title: "单据类型",
    width: "8%",
    key: "leixing"
  },
  {
    dataIndex: "bumen",
    title: "客户名称",
    width: "15%",
    key: "bumen",
    scopedSlots: { customRender: "lingyongbumen" }
  },

  {
    dataIndex: "yuanying",
    key: "yuanying",
    title: "联系人",
    width: "8%"
  },
  {
    dataIndex: "chuhuocangku",
    key: "chuhuocangku",
    title: "联系电话",
    width: "10%"
  },
  {
    dataIndex: "chuhuo",
    key: "chuhuo",
    title: "出货仓库",
    width: "8%"
  },
  {
    dataIndex: "state",
    key: "state",
    title: "状态",
    width: "8%"
  },
  {
    dataIndex: "riqi",
    key: "riqi",
    title: "开单日期",
    width: "12%"
  },
  {
    dataIndex: "remark",
    key: "remark",
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
      keyWords: ""
    };
  },
  methods: {
    addModal() {},
    onChangeRange(date, datestring) {
      this.dateValue = datestring;
      console.log(datestring);
    },
    // handleCancel(a) {
    //   if (a == 1) {
    //     this.addVisible = false;
    //     // this.$refs.addref.quxiao();
    //   }
    // },
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
          url: "/api-workorder/workOrder/list",
          params: {
            page: this.current,
            size: this.pageSize,
            state: this.state,
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
            this.data = result.data.data.data;
            this.total = result.data.data.totalElement;
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
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
.market_list {
  overflow: hidden;
}
</style>