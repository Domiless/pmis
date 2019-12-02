<template>
  <div class="storage_Allot">
    <router-view></router-view>
    <div :class="[{hide:isHideList}]">
      <a-row style="line-height:50px;" >
        <permission-button permCode banType="hide" @click="$router.push({path:'/storageAllot/addStorageAllot'})">
          <a-icon style="color:#1890ff;" type="plus" />新增
        </permission-button>
        <permission-button permCode banType="hide" @click="edit">
          <a-icon style="color:#1890ff;" type="edit" />修改
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
            placeholder="单据编号"
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
          <template slot="invoicesNo" slot-scope="text, record">
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
        title="详情"
        v-model="detailsVisible" 
        style="top:20px" width="1200px" 
        :footer="null"
        :maskClosable="false"
        @cancel="handleCancel(1)">
        <Details></Details>
    </a-modal>
  </div>
</template>
<script>
import Details from "./details"
const columns = [
  {
    dataIndex: "invoicesNo",
    title: "单据编号",
    key: "invoicesNo",
        scopedSlots: { customRender: "invoicesNo" },
    width: "15%"
  },
  {
    dataIndex: "invoicesType",
    title: "单据类型",
    key: "invoicesType",
    width: "10%"
  },
  {
    dataIndex: "back_department",
    title: "调出仓库",
    key: "back_department",
    width: "20%"
  },
  {
    dataIndex: "warehouse",
    title: "调入仓库",
    key: "warehouse",
    width: "15%"
  },
  {
    dataIndex: "status",
    title: "经办人",
    key: "status",
    width: "10%"
  },
  {
    dataIndex: "createDate",
    title: "调拨日期",
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
      detailsVisible: false,
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
            path: "/storageAllot/editStorageAllot/" + this.selectedRowKeys[0]
        });
    },
    showStock() {
        this.detailsVisible = true;
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
        this.detailsVisible = false;
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
  components: {
    Details
  },
  created() {
    let a = this.$route.matched.find(item => item.name === "addStorageAllot")
			? true
			: false;
		let b = this.$route.params.id !== undefined ? true : false;
		this.isHideList = a || b ? true : false;
  },
  watch: {
		$route() {
			let a = this.$route.matched.find(item => item.name === "addStorageAllot")
				? true
				: false;
			let b = this.$route.params.id !== undefined ? true : false;
			this.isHideList = a || b ? true : false;
		}
	}
};
</script>
<style lang="less">
.storage_Allot {
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