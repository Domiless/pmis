<template>
    <div class="storageAllotInform">
        <a-row style="line-height:50px;margin-bottom: 20px;" >
            <permission-button permCode banType="hide" @click="showDispose">
                <i style="color:#1890ff;margin-right:4px;" class="iconfont">&#xe8ad;</i>立即处理
            </permission-button>
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
      <a-modal
        title="立即处理"
        v-model="disposeVisible" 
        style="top:20px" width="1200px" 
        :footer="null"
        :maskClosable="false"
        @cancel="handleCancel(1)">
        <Dispose></Dispose>
      </a-modal>
      <a-modal
        title="调拨单详情"
        v-model="detailsVisible" 
        style="top:20px" width="1200px" 
        :footer="null"
        :maskClosable="false"
        @cancel="handleCancel(1)">
        
      </a-modal>
    </div>
</template>
<script>
import Dispose from "./dispose"
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
    title: "开单日期",
    key: "createDate",
    width: "10%"
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark",
    width: "15%"
  }
];
export default {
    data() {
        return {
            columns,
            data: [],
            disposeVisible: false,
            detailsVisible: false,
            selectedRowKeys: [],
            selectedRows: [],
            current: 1,
            pageSize: 10,
            total: 0,
        }
    },
    methods: {
        handleCancel(num) {
            if( num == 1 ) {
                this.disposeVisible = false;
            }
        },
        showDispose() {
            this.disposeVisible = true;
        },
        onChange(current, pageNumber) {
            console.log("Page: ", pageNumber);
            console.log("第几页: ", current);
            this.current = current;
            this.getList();
        },
        onSelectChange(selectedRowKeys,selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
            console.log(this.selectedRowKeys);
            console.log(this.selectedRows);
        },
        onShowSizeChange(current, pageSize) {
            this.pageSize = pageSize;
            this.current = 1;
            this.getList();
        },
        getList() {
            this.Axios(
                {
                url: "",
                type: "get",
                params: {
                    page: this.current,
                    size: this.pageSize,
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
        Dispose,
        Details
    }
}
</script>
<style lang="less">
.storageAllotInform {
    padding: 0 20px;
}
</style>