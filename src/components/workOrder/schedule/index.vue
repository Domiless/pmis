<template>
  <div class="schedule_list">
    <a-row>
      <a-col :span="24" style="padding:0 20px;">
        <a-row>
          <div style="line-height:50px;">
            <a-col :span="15">
              <a-button @click="$router.back(-1)" icon="left" style="margin-right:20px;">返回</a-button>
            </a-col>
          </div>
        </a-row>
        <a-row style="padding-top:10px;">
          <a-table
            :columns="columns"
            :pagination="false"
            :dataSource="data"
            :rowClassName="bgcolor"
            rowKey="workOrderDesId"
            bordered
          >
            <template slot="schedule" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>工序：{{record.schedule.name}}</span>
                  <br />
                  <span>操作人：{{record.schedule.executiveName}}</span>
                  <br />
                  <span>单件工时：{{record.schedule.itemWorkTime}}</span>
                  <br />
                  <span>派工时间：{{record.schedule.startTime}}</span>
                  <br />
                  <span>完工时间：{{record.schedule.startTime!=record.schedule.endTime?record.schedule.endTime:""}}</span>
                </template>
                <div
                  v-if="record.schedule.name!=null"
                  :style="record.schedule!=null?record.schedule.state==5?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
                >
                  <span>{{record.schedule!=null?record.schedule.name:''}}</span>
                  <br />
                  <span>{{record.schedule!=null?record.schedule.executiveName:''}}</span>
                  <br />
                  <span>{{record.schedule!=null?record.schedule.time:''}}</span>
                </div>
              </a-popover>
            </template>
            <template slot="schedule1" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>工序：{{record.schedule1.name}}</span>
                  <br />
                  <span>操作人：{{record.schedule1.executiveName}}</span>
                  <br />
                  <span>单件工时：{{record.schedule1.itemWorkTime}}</span>
                  <br />
                  <span>派工时间：{{record.schedule1.startTime}}</span>
                  <br />
                  <span>完工时间：{{record.schedule1.startTime!=record.schedule1.endTime?record.schedule1.endTime:""}}</span>
                </template>
                <div
                  v-if="record.schedule1.name!=null"
                  :style="record.schedule1!=null?record.schedule1.state==5?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
                >
                  <span>{{record.schedule1!=null?record.schedule1.name:''}}</span>
                  <br />
                  <span>{{record.schedule1!=null?record.schedule1.executiveName:''}}</span>
                  <br />
                  <span>{{record.schedule1!=null?record.schedule1.time:''}}</span>
                </div>
              </a-popover>
            </template>
            <template slot="schedule2" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>工序：{{record.schedule2.name}}</span>
                  <br />
                  <span>操作人：{{record.schedule2.executiveName}}</span>
                  <br />
                  <span>单件工时：{{record.schedule2.itemWorkTime}}</span>
                  <br />
                  <span>派工时间：{{record.schedule2.startTime}}</span>
                  <br />
                  <span>完工时间：{{record.schedule2.startTime!=record.schedule2.endTime?record.schedule2.endTime:""}}</span>
                </template>
                <div
                  v-if="record.schedule2.name!=null"
                  :style="record.schedule2!=null?record.schedule2.state==5?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
                >
                  <span>{{record.schedule2!=null?record.schedule2.name:''}}</span>
                  <br />
                  <span>{{record.schedule2!=null?record.schedule2.executiveName:''}}</span>
                  <br />
                  <span>{{record.schedule2!=null?record.schedule2.time:''}}</span>
                </div>
              </a-popover>
            </template>
            <template slot="schedule3" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>工序：{{record.schedule3.name}}</span>
                  <br />
                  <span>操作人：{{record.schedule3.executiveName}}</span>
                  <br />
                  <span>单件工时：{{record.schedule3.itemWorkTime}}</span>
                  <br />
                  <span>派工时间：{{record.schedule3.startTime}}</span>
                  <br />
                  <span>完工时间：{{record.schedule3.startTime!=record.schedule3.endTime?record.schedule3.endTime:""}}</span>
                </template>
                <div
                  v-if="record.schedule3.name!=null"
                  :style="record.schedule3!=null?record.schedule3.state==5?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
                >
                  <span>{{record.schedule3!=null?record.schedule3.name:''}}</span>
                  <br />
                  <span>{{record.schedule3!=null?record.schedule3.executiveName:''}}</span>
                  <br />
                  <span>{{record.schedule3!=null?record.schedule3.time:''}}</span>
                </div>
              </a-popover>
            </template>
            <template slot="schedule4" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>工序：{{record.schedule4.name}}</span>
                  <br />
                  <span>操作人：{{record.schedule4.executiveName}}</span>
                  <br />
                  <span>单件工时：{{record.schedule4.itemWorkTime}}</span>
                  <br />
                  <span>派工时间：{{record.schedule4.startTime}}</span>
                  <br />
                  <span>完工时间：{{record.schedule4.startTime!=record.schedule4.endTime?record.schedule4.endTime:""}}</span>
                </template>
                <div
                  v-if="record.schedule4.name!=null"
                  :style="record.schedule4!=null?record.schedule4.state==5?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
                >
                  <span>{{record.schedule4!=null?record.schedule4.name:''}}</span>
                  <br />
                  <span>{{record.schedule4!=null?record.schedule4.executiveName:''}}</span>
                  <br />
                  <span>{{record.schedule4!=null?record.schedule4.time:''}}</span>
                </div>
              </a-popover>
            </template>
            <template slot="schedule5" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>工序：{{record.schedule5.name}}</span>
                  <br />
                  <span>操作人：{{record.schedule5.executiveName}}</span>
                  <br />
                  <span>单件工时：{{record.schedule5.itemWorkTime}}</span>
                  <br />
                  <span>派工时间：{{record.schedule5.startTime}}</span>
                  <br />
                  <span>完工时间：{{record.schedule5.startTime!=record.schedule5.endTime?record.schedule5.endTime:""}}</span>
                </template>
                <div
                  v-if="record.schedule5.name!=null"
                  :style="record.schedule5!=null?record.schedule5.state==5?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
                >
                  <span>{{record.schedule5!=null?record.schedule5.name:''}}</span>
                  <br />
                  <span>{{record.schedule5!=null?record.schedule5.executiveName:''}}</span>
                  <br />
                  <span>{{record.schedule5!=null?record.schedule5.time:''}}</span>
                </div>
              </a-popover>
            </template>
            <template slot="schedule6" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>工序：{{record.schedule6.name}}</span>
                  <br />
                  <span>操作人：{{record.schedule6.executiveName}}</span>
                  <br />
                  <span>单件工时：{{record.schedule6.itemWorkTime}}</span>
                  <br />
                  <span>派工时间：{{record.schedule6.startTime}}</span>
                  <br />
                  <span>完工时间：{{record.schedule6.startTime!=record.schedule6.endTime?record.schedule6.endTime:""}}</span>
                </template>
                <div
                  v-if="record.schedule6.name!=null"
                  :style="record.schedule6!=null?record.schedule6.state==5?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
                >
                  <span>{{record.schedule6!=null?record.schedule6.name:''}}</span>
                  <br />
                  <span>{{record.schedule6!=null?record.schedule6.executiveName:''}}</span>
                  <br />
                  <span>{{record.schedule6!=null?record.schedule6.time:''}}</span>
                </div>
              </a-popover>
            </template>
            <template slot="schedule7" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>工序：{{record.schedule7.name}}</span>
                  <br />
                  <span>操作人：{{record.schedule7.executiveName}}</span>
                  <br />
                  <span>单件工时：{{record.schedule7.itemWorkTime}}</span>
                  <br />
                  <!-- <span>派工时间：{{record.schedule7.startTime}}</span> -->
                  <!-- <br /> -->
                  <span>完工时间：{{record.schedule7.endTime}}</span>
                </template>
                <div
                  v-if="record.schedule7.name!=null"
                  :style="record.schedule7!=null?record.schedule7.state==5?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
                >
                  <span>{{record.schedule7!=null?record.schedule7.name:''}}</span>
                  <br />
                  <span>{{record.schedule7!=null?record.schedule7.executiveName:''}}</span>
                  <br />
                  <span>{{record.schedule7!=null?record.schedule7.time:''}}</span>
                </div>
              </a-popover>
            </template>
          </a-table>
          <!-- <a-pagination
            style="padding-top:12px;text-align: right;"
            showQuickJumper
            :defaultCurrent="current"
            :total="total"
            @change="onChange"
            showSizeChanger
            :pageSizeOptions="['10','20','30']"
            @showSizeChange="onShowSizeChange"
            :showTotal="total => `共 ${total} 条`"
          />-->
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "planCode",
    key: "planCode",
    title: "计划编号",
    width: 80,
    align: "center"
  },
  {
    dataIndex: "drawingNo",
    title: "图号",
    width: 150,
    key: "drawingNo"
  },
  {
    dataIndex: "name",
    title: "名称",
    width: 200,
    key: "name"
  },

  {
    dataIndex: "amount",
    key: "amount",
    title: "数量",
    width: 80
  },
  {
    dataIndex: "schedule",
    colSpan: 6,
    title: "工序进度",
    width: 120,
    scopedSlots: { customRender: "schedule" },
    align: "center"
  },
  {
    dataIndex: "schedule1",
    colSpan: 0,
    title: "工序进度2",
    width: 120,
    scopedSlots: { customRender: "schedule1" },
    align: "center"
  },
  {
    dataIndex: "schedule2",
    colSpan: 0,
    title: "工序进度3",
    width: 120,
    scopedSlots: { customRender: "schedule2" },
    align: "center"
  },
  {
    dataIndex: "schedule3",
    colSpan: 0,
    title: "工序进度4",
    width: 120,
    scopedSlots: { customRender: "schedule3" },
    align: "center"
  },
  {
    dataIndex: "schedule4",
    colSpan: 0,
    title: "工序进度5",
    width: 120,
    scopedSlots: { customRender: "schedule4" },
    align: "center"
  },
  {
    dataIndex: "schedule5",
    colSpan: 0,
    title: "工序进度6",
    width: 120,
    scopedSlots: { customRender: "schedule5" },
    align: "center"
  },
  {
    dataIndex: "schedule6",
    key: "schedule6",
    title: "表处",
    width: 120,
    scopedSlots: { customRender: "schedule6" },
    align: "center"
  },
  {
    dataIndex: "schedule7",
    key: "ruku",
    title: "入库",
    width: 120,
    scopedSlots: { customRender: "schedule7" },
    align: "center"
  }
];
export default {
  data() {
    return {
      addVisible: false,
      editVisible: false,
      columns,
      current: 1,
      total: 0,
      data: []
    };
  },
  methods: {
    bgcolor(row, index) {
      if (row.isDone == true) {
        return "bgcolor";
      }
    },
    // onShowSizeChange(current, pageSize) {
    //   this.pageSize = pageSize;
    //   this.current = 1;
    //   this.getList();
    // },
    // onChange(current, pageNumber) {
    //   console.log("Page: ", pageNumber);
    //   console.log("第几页: ", current);
    //   this.current = current;
    //   this.getList();
    // },
    getList() {
      this.Axios(
        {
          url: "/api-workorder/workOrder/schedule",
          params: {
            workOrderId: this.$route.params.id
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.data = result.data.data.map(item => {
              return {
                ...item,
                schedule: {
                  ...item.processResultArr[0],
                  time:
                    item.processResultArr[0] != null &&
                    item.processResultArr[0].startTime !=
                      item.processResultArr[0].endTime &&
                    item.processResultArr[0].startTime != null
                      ? item.processResultArr[0].startTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[0].startTime
                          .split(" ")[0]
                          .split("/")[2] +
                        "~" +
                        item.processResultArr[0].endTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[0].endTime
                          .split(" ")[0]
                          .split("/")[2]
                      : ""
                },
                schedule1: {
                  ...item.processResultArr[1],
                  time:
                    item.processResultArr[1] != null &&
                    item.processResultArr[1].startTime !=
                      item.processResultArr[1].endTime &&
                    item.processResultArr[1].startTime != null
                      ? item.processResultArr[1].startTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[1].startTime
                          .split(" ")[0]
                          .split("/")[2] +
                        "~" +
                        item.processResultArr[1].endTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[1].endTime
                          .split(" ")[0]
                          .split("/")[2]
                      : ""
                },
                schedule2: {
                  ...item.processResultArr[2],
                  time:
                    item.processResultArr[2] != null &&
                    item.processResultArr[2].startTime !=
                      item.processResultArr[2].endTime &&
                    item.processResultArr[2].startTime != null
                      ? item.processResultArr[2].startTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[2].startTime
                          .split(" ")[0]
                          .split("/")[2] +
                        "~" +
                        item.processResultArr[2].endTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[2].endTime
                          .split(" ")[0]
                          .split("/")[2]
                      : ""
                },
                schedule3: {
                  ...item.processResultArr[3],
                  time:
                    item.processResultArr[3] != null &&
                    item.processResultArr[3].startTime !=
                      item.processResultArr[3].endTime &&
                    item.processResultArr[3].startTime != null
                      ? item.processResultArr[3].startTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[3].startTime
                          .split(" ")[0]
                          .split("/")[2] +
                        "~" +
                        item.processResultArr[3].endTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[3].endTime
                          .split(" ")[0]
                          .split("/")[2]
                      : ""
                },
                schedule4: {
                  ...item.processResultArr[4],
                  time:
                    item.processResultArr[4] != null &&
                    item.processResultArr[4].startTime !=
                      item.processResultArr[4].endTime &&
                    item.processResultArr[4].startTime != null
                      ? item.processResultArr[4].startTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[4].startTime
                          .split(" ")[0]
                          .split("/")[2] +
                        "~" +
                        item.processResultArr[4].endTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[4].endTime
                          .split(" ")[0]
                          .split("/")[2]
                      : ""
                },
                schedule5: {
                  ...item.processResultArr[5],
                  time:
                    item.processResultArr[5] != null &&
                    item.processResultArr[5].startTime !=
                      item.processResultArr[5].endTime &&
                    item.processResultArr[5].startTime != null
                      ? item.processResultArr[5].startTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[5].startTime
                          .split(" ")[0]
                          .split("/")[2] +
                        "~" +
                        item.processResultArr[5].endTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[5].endTime
                          .split(" ")[0]
                          .split("/")[2]
                      : ""
                },
                schedule6: {
                  ...item.processResultArr[6],
                  time:
                    item.processResultArr[6] != null &&
                    item.processResultArr[6].startTime !=
                      item.processResultArr[6].endTime &&
                    item.processResultArr[6].startTime != null
                      ? item.processResultArr[6].startTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[6].startTime
                          .split(" ")[0]
                          .split("/")[2] +
                        "~" +
                        item.processResultArr[6].endTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[6].endTime
                          .split(" ")[0]
                          .split("/")[2]
                      : ""
                },
                schedule7: {
                  ...item.processResultArr[7],
                  time:
                    item.processResultArr[7] != null &&
                    item.processResultArr[7].startTime !=
                      item.processResultArr[7].endTime &&
                    item.processResultArr[7].startTime != null
                      ? item.processResultArr[7].endTime
                          .split(" ")[0]
                          .split("/")[1] +
                        "." +
                        item.processResultArr[7].endTime
                          .split(" ")[0]
                          .split("/")[2]
                      : ""
                }
              };
            });
            console.log(this.data);

            // this.total = result.data.data.totalElement;
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="less">
.schedule_list {
  overflow: hidden;
  .ant-table-tbody > tr > td {
    padding: 0px 0px;
  }
}
.bgcolor {
  background-color: #c8f3d1;
}
</style>
