<template>
  <div class="work_order_hours">
    <a-row style="padding-top:10px;">
      <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="workOrderId">
        <template slot="operation" slot-scope="text, record, index">
          <div>
            <a href="javascript:" @click="showDetails(record)">查看明细</a>
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
    <a-modal
      title="工时明细"
      :footer="null"
      width="600px"
      :visible="detailsVisible"
      @cancel="handleCancel()"
      :maskClosable="false"
    >
      <div class="work_order_hours_details">
        <p v-for="(item,index) in oneWorkOrderHours" :key="index">
          <span class="label_right">{{item.workTypeName}}：</span>
          <span>{{item.workLoad}}分钟</span>
        </p>
      </div>
    </a-modal>
  </div>
</template>
<script>
import Vue from "vue";
import { Table, Row, Modal, Pagination } from "ant-design-vue";
Vue.use(Pagination);
Vue.use(Table);
Vue.use(Row);
Vue.use(Modal);
const columns = [
  {
    dataIndex: "gongzuoLing",
    title: "工作令号",
    width: "20%",
    key: "gongzuoLing"
  },
  {
    dataIndex: "workOrderNo",
    title: "工单号",
    width: "20%",
    key: "workOrderNo"
  },
  {
    dataIndex: "title",
    title: "工单标题",
    width: "30%",
    key: "title"
  },
  {
    dataIndex: "workLoad",
    key: "workLoad",
    title: "总工时(H)",
    width: "20%"
  },
  {
    dataIndex: "operation",
    key: "operation",
    title: "操作",
    width: "10%",
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  data() {
    return {
      detailsVisible: false,
      columns,
      data: [
        {
          employeeNo: 1,
          userName: 2
        }
      ],
      current: 1,
      pageSize: 10,
      total: 0,
      oneWorkOrderHours: []
    };
  },
  methods: {
    showDetails(row) {
      console.log(row);
      this.Axios(
        {
          url: "/api-workorder/workLoadCounting/des",
          params: {
            workOrderId: row.workOrderId
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.oneWorkOrderHours = result.data.data;
            this.detailsVisible = true;
          }
        },
        ({ type, info }) => {}
      );
    },
    handleCancel() {
      this.detailsVisible = false;
      this.oneWorkOrderHours = [];
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
          url: "/api-workorder/workLoadCounting/workOrder",
          params: {
            page: this.current,
            size: this.pageSize
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
  watch: {},
  components: {},
  created() {
    this.getList();
  }
};
</script>
<style lang="less">
.work_order_hours {
}
.label_right {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.work_order_hours_details {
  height: 200px;
  max-height: 300px;
  overflow: auto;
}
</style>