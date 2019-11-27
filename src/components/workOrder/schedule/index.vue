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
            rowKey="id"
            bordered
          >
            <template slot="schedule" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>prompt text</span>
                </template>
                <div
                  :style="record.processArr[0]!=null?record.processArr[0].state==4?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
                >
                  <span>{{record.processArr[0]!=null?record.processArr[0].workTypeName:''}}</span>
                  <br />
                  <span>{{record.processArr[0]!=null?record.processArr[0].workTypeName:''}}</span>
                  <br />
                  <span>{{record.processArr[0]!=null?record.processArr[0].workTypeName:''}}</span>
                </div>
              </a-popover>
            </template>
            <template slot="schedule1" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>prompt text</span>
                </template>
              </a-popover>
              <div
                :style="record.processArr[1]!=null?record.processArr[1].state==4?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
              >
                <span>{{record.processArr[1]!=null?record.processArr[1].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[1]!=null?record.processArr[1].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[1]!=null?record.processArr[1].workTypeName:''}}</span>
              </div>
            </template>
            <template slot="schedule2" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>prompt text</span>
                </template>
              </a-popover>
              <div
                :style="record.processArr[2]!=null?record.processArr[2].state==4?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
              >
                <span>{{record.processArr[2]!=null?record.processArr[2].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[2]!=null?record.processArr[2].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[2]!=null?record.processArr[2].workTypeName:''}}</span>
              </div>
            </template>
            <template slot="schedule3" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>prompt text</span>
                </template>
              </a-popover>
              <div
                :style="record.processArr[3]!=null?record.processArr[3].state==4?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
              >
                <span>{{record.processArr[3]!=null?record.processArr[3].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[3]!=null?record.processArr[3].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[3]!=null?record.processArr[3].workTypeName:''}}</span>
              </div>
            </template>
            <template slot="schedule4" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>prompt text</span>
                </template>
              </a-popover>
              <div
                :style="record.processArr[4]!=null?record.processArr[4].state==4?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
              >
                <span>{{record.processArr[4]!=null?record.processArr[4].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[4]!=null?record.processArr[4].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[4]!=null?record.processArr[4].workTypeName:''}}</span>
              </div>
            </template>
            <template slot="schedule5" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>prompt text</span>
                </template>
              </a-popover>
              <div
                :style="record.processArr[5]!=null?record.processArr[5].state==4?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
              >
                <span>{{record.processArr[5]!=null?record.processArr[5].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[5]!=null?record.processArr[5].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[5]!=null?record.processArr[5].workTypeName:''}}</span>
              </div>
            </template>
            <template slot="schedule6" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>prompt text</span>
                </template>
              </a-popover>
              <div
                :style="record.processArr[6]!=null?record.processArr[6].state==4?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
              >
                <span>{{record.processArr[6]!=null?record.processArr[6].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[6]!=null?record.processArr[6].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[6]!=null?record.processArr[6].workTypeName:''}}</span>
              </div>
            </template>
            <template slot="schedule7" slot-scope="text, record, index">
              <a-popover placement="right">
                <template slot="content">
                  <span>prompt text</span>
                </template>
              </a-popover>
              <div
                :style="record.processArr[7]!=null?record.processArr[7].state==4?'background-color: #c8f3d1;padding:2px;':'padding:2px;':'padding:2px;'"
              >
                <span>{{record.processArr[7]!=null?record.processArr[7].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[7]!=null?record.processArr[7].workTypeName:''}}</span>
                <br />
                <span>{{record.processArr[7]!=null?record.processArr[7].workTypeName:''}}</span>
              </div>
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
    scopedSlots: { customRender: "schedule" }
  },
  {
    dataIndex: "schedule1",
    colSpan: 0,
    title: "工序进度2",
    width: 120,
    scopedSlots: { customRender: "schedule1" }
  },
  {
    dataIndex: "schedule2",
    colSpan: 0,
    title: "工序进度3",
    width: 120,
    scopedSlots: { customRender: "schedule2" }
  },
  {
    dataIndex: "schedule3",
    colSpan: 0,
    title: "工序进度4",
    width: 120,
    scopedSlots: { customRender: "schedule3" }
  },
  {
    dataIndex: "schedule4",
    colSpan: 0,
    title: "工序进度5",
    width: 120,
    scopedSlots: { customRender: "schedule4" }
  },
  {
    dataIndex: "schedule5",
    colSpan: 0,
    title: "工序进度6",
    width: 120,
    scopedSlots: { customRender: "schedule5" }
  },
  {
    dataIndex: "schedule6",
    key: "schedule6",
    title: "表处",
    width: 120,
    scopedSlots: { customRender: "schedule6" }
  },
  {
    dataIndex: "schedule7",
    key: "ruku",
    title: "入库",
    width: 120,
    scopedSlots: { customRender: "schedule7" }
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
                schedule: item.processArr[0],
                schedule1: item.processArr[1],
                schedule2: item.processArr[2],
                schedule3: item.processArr[3],
                schedule4: item.processArr[4],
                schedule5: item.processArr[5],
                schedule6: item.processArr[6],
                schedule7: item.processArr[7]
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
