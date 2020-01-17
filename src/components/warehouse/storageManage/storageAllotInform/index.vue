<template>
    <div class="storageAllotInform">
        <a-row style="line-height:50px;margin-bottom: 20px;" >
            <permission-button permCode banType="hide" @click="showDispose" :disabled="selectedRowKeys.length !== 1">
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
                <template slot="transferNo" slot-scope="text, record">
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
        @cancel="handleCancel(1)"
        destroyOnClose
        >
        <Dispose :sendId="allotDetailsId"></Dispose>
      </a-modal>
      <a-modal
        title="调拨单详情"
        v-model="detailsVisible" 
        style="top:20px" width="1200px" 
        :footer="null"
        :maskClosable="false"
        @cancel="handleCancel(1)"
        destroyOnClose
        >
        <Details :sendId="showDetailsId"></Details>
      </a-modal>
    </div>
</template>
<script>
import Dispose from "./dispose"
import Details from "./details"
const columns = [
  {
    dataIndex: "transferNo",
    title: "单据编号",
    key: "transferNo",
    scopedSlots: { customRender: "transferNo" },
    width: "15%"
  },
  {
    dataIndex: "type",
    title: "单据类型",
    key: "type",
    width: "10%"
  },
  {
    dataIndex: "fromWarehouse.name",
    title: "调出仓库",
    key: "fromWarehouse.name",
    width: "20%"
  },
  {
    dataIndex: "toWareHouse.name",
    title: "调入仓库",
    key: "toWareHouse.name",
    width: "15%"
  },
  {
    dataIndex: "manager",
    title: "经办人",
    key: "manager",
    width: "10%"
  },
  {
    dataIndex: "transferDate",
    title: "开单日期",
    key: "transferDate",
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
            allotDetailsId: '',
            showDetailsId: ''
        }
    },
    methods: {
        handleCancel(num) {
            if( num == 1 ) {
                this.disposeVisible = false;
                this.selectedRowKeys = [];
            }
        },
        showDetails(id) {
            this.showDetailsId = id;
            this.detailsVisible = true;
            console.log(this.showDetailsId);
        },
        showDispose() {
            this.disposeVisible = true;
            this.allotDetailsId = this.selectedRowKeys[0];
            console.log(this.allotDetailsId);
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
                    url: "/api-warehouse/transfer/notice",
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
                            let listArr = result.data.data;
                            if( !listArr && typeof(listArr)!='undefined' && listArr!=0 ) {
                                this.data = [];
                            } else {
                                this.data = result.data.data.content;
                                this.total = result.data.data.totalElement;
                            }
                            
                        }
                },
                ({ type, info }) => {}
            );
        }
    },
    components: {
        Dispose,
        Details
    },
    created() {
        this.getList();
    }
}
</script>
<style lang="less">
.storageAllotInform {
    padding: 0 20px;
}
</style>