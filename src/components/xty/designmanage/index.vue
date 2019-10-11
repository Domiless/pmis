<template>
  <div class="designManage">
    <div class="design_header">
      <a-row style="line-height:50px;">
        <a-button @click="addVisible=true">
          <a-icon style="color:#1890ff;" type="plus" />新增
        </a-button>
        <a-button>
          <a-icon style="color:#1890ff;" type="edit" />修改
        </a-button>
        <a-button @click="addBomVisible=true">
          <a-icon style="color:#1890ff;" type />BOM导入
        </a-button>
        <a-button>
          <a-icon style="color:#1890ff;" type />BOM导出
        </a-button>
        <a-button>
          <a-icon style="color:#1890ff;" type />提交审批
        </a-button>
        <a-button>
          <a-icon style="color:#1890ff;" type="delete" />删除
        </a-button>
      </a-row>
    </div>
    <div class="design_content">
      <a-row>
        <a-col :span="5">
          <span>日期 :</span>
          <a-date-picker style="width:120px"></a-date-picker>
          <span>~</span>
          <a-date-picker style="width: 120px"></a-date-picker>
        </a-col>
        <a-col :span="3">
          <a-input-group>
            <span>审批状态 :</span>
            <a-select :defaultValue="-1" style="width: 100px">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">暂存</a-select-option>
              <a-select-option :value="2">审批中</a-select-option>
              <a-select-option :value="3">已通过</a-select-option>
              <a-select-option :value="4">未通过</a-select-option>
              <a-select-option :value="5">已终止</a-select-option>
            </a-select>
          </a-input-group>
        </a-col>
        <a-col :span="8">
          <span>关键词 :</span>
          <a-input placeholder="订单编号/项目名称/部件名称/图号" style="width: 250px"></a-input>
          <a-button>搜索</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-table :columns="columns" :dataSource="data" :rowSelection="rowSelection"></a-table>
        <a-pagination
          style="padding-top:12px;text-align: right;"
          :total="30"
          showQuickJumper
          showSizeChanger
          :pageSizeOptions="['10','20','30']"
          :showTotal="total => `共 ${total} 条`"
        ></a-pagination>
      </a-row>
      <a-modal title="新增" v-model="addVisible" width="800px" :footer="null">
        <add-design-manage @changeAddOrder="cancelAddOrder"></add-design-manage>
      </a-modal>
      <a-modal
        title="导入BOM"
        v-model="addBomVisible"
        width="1500px"
        okText="提交"
        @ok="addBomVisible=false"
        @cancel="addBomVisible=false"
        cancelText="取消"
      >
        <import-bom></import-bom>
      </a-modal>
    </div>
  </div>
</template>
<script>
import AddDesignManage from './Add'
import importBom from './Bom'
const columns = [
    {
        dataIndex: 'workOrderNo',
        title: '订单编号',
        key: 'workOrderNo',
        width: '10%'
    },
    {
        dataIndex: 'projectName',
        title: '项目名称',
        key: 'orderName',
        width: '20%'
    },
    {
        dataIndex: 'partName',
        title: '部件名称',
        key: 'partName',
        width: '20%'
    },
    {
        dataIndex: 'bomDrawingNo',
        title: '图号',
        key: 'bomDrawingNo',
        width: '10%'
    },
    {
        dataIndex: 'number',
        title: '需求数量',
        key: 'number',
        width: '8%'
    },
    {
        dataIndex: 'approval_status',
        title: '审批状态',
        key: 'approval_status',
        width: '8%'
    },
    {
        dataIndex: 'bom',
        title: 'BOM',
        key: 'bom',
        width: '8%'
    },
    {
        dataIndex: 'remake',
        title: '备注',
        key: 'remake',
        width: '16%'
    },
]
export default {
    data() {
        return {
            columns,
            data: [],
            addVisible: false,
            addBomVisible: false
        }
    },
    methods: {
      cancelAddOrder(params) {
			this.addVisible = params;
		},
    //   getList() {
		// 	this.Axios(
		// 		{
		// 			url: "/api-order/bom/importBom",
    //       type: "get",
    //      	params: {
		// 				// page: this.current,
    //         // size: this.pageSize,
    //         // state: this.state,
		// 				// startTime: this.startTime != "" ? this.startTime : null,
		// 				// endTime: this.endTime != "" ? this.endTime : null
		// 			},
		// 			option: { enableMsg: false }
		// 		},
		// 		this
		// 	).then(
		// 		result => {
		// 			if (result.data.code === 200) {
		// 				console.log(result);
		// 				this.data = result.data.data.content;
    //         this.total = result.data.data.totalElement;
		// 			}
		// 		},
		// 		({ type, info }) => {}
		// 	);
    // },
    },
    computed: {
        rowSelection() {
        const { selectedRowKeys } = this;
        return {
            onChange: (selectedRowKeys, selectedRows) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
            );
            },
            getCheckboxProps: record => ({
            props: {
                disabled: record.name === "Disabled User", 
                name: record.name
            }
            })
        };
        }
    },
    components: {
        AddDesignManage,
        importBom
    }
};
</script>
<style lang="less" scoped>
.designManage {
  padding:0 20px;
  .design_header {
    margin-bottom: 10px;
  }
  .design_content {
    .ant-row:nth-child(1) {
      margin-bottom: 10px;
    }
  }
}
</style>