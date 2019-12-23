<template>
  <div class="stock">
    <a-row class="detailsMsg">
      <a-col :span="12">
        <span class="label_right">单据编号：</span>
        <span>{{detailsMsg.orderCode}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_right">收货仓库：</span>
        <span>{{warehouseName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_right">供应商：</span>
        <span>{{detailsMsg.fromName}}</span>
      </a-col>
      <a-col :span="12">
        <span class="label_right">开单日期：</span>
        <span>{{detailsMsg.gmtCreated}}</span>
      </a-col>
    </a-row>
    <!-- <a-row style="line-height:50px;">
      <permission-button permCode banType="hide" type="primary">批量入库</permission-button>
    </a-row> -->
    <a-row>
      <a-table
        :scroll="{ x: 1600,y:500}"
        rowKey="id"
        class="table_style"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :rowClassName="bgcolor"
      >
        <!-- <template slot="code" slot-scope="text, record">
          <div class="codeMsg">{{text}}</div>
        </template> -->
        <template slot="warehouseUnit" slot-scope="text,record">
          <a-select
            style="width: 100%"
            @mouseenter = "getWarehouseUnit(record.id)"
            @change="(value,option) => {
                  let value1 = value;
                  handleChange(value1, record.id, 'warehouseUnit')
                  }"
            :disabled="isBan"
          >
            <a-select-option
              v-for="(item,index) in unitArr"
              :value="item"
              :key="index"
            >{{ item }}</a-select-option>
          </a-select>
        </template>
        <template slot="stockNumber" slot-scope="text,record">
          <div key="stockNumber">
            <a-input
              maxlength="20"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.id, 'stockNumber')"
              :disabled="isBan"
            />
          </div>
        </template>
        <template slot="batch" slot-scope="text,record">
          <div key="batch">
            <a-input
              maxlength="20"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.id, 'batch')"
              :disabled="isBan"
            />
          </div>
        </template>
        <template slot="category" slot-scope="text,record">
          <a-tree-select
            allowClear
            style="width: 100%"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="treeData"
            placeholder="请选择"
            treeDefaultExpandAll
            @change="(value,option) => {
                  let value1 = value;
                  handleChange(value1, record.id, 'category')
                  }"
            :disabled="isBan"
          >
          ></a-tree-select>
        </template>
        <template slot="note" slot-scope="text,record">
          <div key="note">
            <a-input
              maxlength="20"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.id, 'note')"
              :disabled="isBan"
            />
          </div>
        </template>
        <template slot="ruku" slot-scope="text,record">
           <a href="javascript:" @click="addStock(record.id)">入库</a>
        </template>
      </a-table>
    </a-row>
  </div>
</template>
<script>
const columns = [
  {
    title: "物料编码",
    key: "code",
    dataIndex: "code",
    scopedSlots: { customRender: "code" },
    width: 200
  },
  {
    title: "名称",
    key: "name",
    dataIndex: "name",
    width: 200
  },
  {
    title: "型号/规格",
    key: "specification",
    dataIndex: "specification",
    width: 200
  },
  {
    title: "单位",
    key: "unit",
    dataIndex: "unit",
    width: 100
  },
  {
    title: "总数量",
    key: "orderAmount",
    dataIndex: "orderAmount",
    width: 100
  },
  {
    title: "已入",
    key: "inStorage",
    dataIndex: "inStorage",
    width: 80
  },
  {
    title: "待入",
    key: "outStorage",
    dataIndex: "outStorage",
    width: 80
  },
  {
    title: "入库数量",
    key: "stockNumber",
    dataIndex: "stockNumber",
    width: 80,
    scopedSlots: { customRender: "stockNumber" }
  },
  {
    title: "库存单位",
    key: "warehouseUnit",
    dataIndex: "warehouseUnit",
    width: 80,
    scopedSlots: { customRender: "warehouseUnit" }
  },
  {
    title: "分类",
    key: "category",
    dataIndex: "category",
    width: 200,
    scopedSlots: { customRender: "category" }
  },
  {
    title: "批次",
    key: "batch",
    dataIndex: "batch",
    width: 80,
    scopedSlots: { customRender: "batch" }
  },
  {
    title: "备注",
    key: "note",
    dataIndex: "note",
    width: 140,
    scopedSlots: { customRender: "note" }
  },
  {
    title: "入库",
    key: "ruku",
    dataIndex: "ruku",
    // fixed: 'right',
    scopedSlots: { customRender: "ruku" }
  }
];
export default {
  props: {
    sendId: {
      default: ''
    }
  },
  data() {
    return {
      columns,
      data: [],
      unitArr: [],
      placeArr: [],
      categoryArr: [],
      detailsMsg: [],
      treeData: [],
      warehouseName: '',
      isBan: false
    };
  },
  methods: {
    bgcolor(row, index) {
      // console.log(row);
      if (row.outStorage == 0) {
        this.isBan = true;
        return "bgcolor";
      }
    },
    handleChange(value, key, column) {
      console.log(value);
      console.log(key);
      console.log(column);

      const newData = [...this.data];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
      console.log(this.data);
    },
    findOne(id) {
			this.Axios(
				{
					url: '/api-warehouse/order/findOne',
					params: {
            orderId: id
          },
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
            console.log(result);
            this.detailsMsg = result.data.data;
            this.data = result.data.data.orderItems;
            this.warehouseName = result.data.data.warehouse.name;
					}
				},
				({ type, info }) => {}
			);
    },
    getClassifyList() {
      this.Axios(
        {
          url: "/api-warehouse/classification/list",
          type: "get",
          params: {},
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.treeData = result.data.data.map(item => {
              return {
                title: item.name,
                key: item.id,
                value: item.id,
                organizeCode: parseInt(item.code),
                organizeParentCode: parseInt(item.parentCode),
                disabled: item.parentCode == 0
              };
            });
            let code = Math.min.apply(
              null,
              this.treeData.map(item => {
                return item.organizeParentCode;
              })
            );
            this.treeData = this.filterArray(this.treeData, code);
          }
        },
        ({ type, info }) => {}
      );
    },
    filterArray(data, parent) {
      let vm = this;
      var tree = [];
      var temp;
      for (var i = 0; i < data.length; i++) {
        if (data[i].organizeParentCode == parent) {
          var obj = data[i];
          temp = this.filterArray(data, data[i].organizeCode);
          if (temp.length > 0) {
            obj.children = temp;
          }
          tree.push(obj);
        }
      }
      return tree;
    },
    getWarehouseUnit(id) {
      this.Axios(
        {
          url: "/api-warehouse/order/warehouseUnit",
          type: "get",
          params: {
            entryOrderItemId: id
          },
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.unitArr = result.data.data;
          }
        },
        ({ type, info }) => {}
      );
    },
    addStock(id) {
          console.log(id);
          let list = this.data.filter(item => {
            return item.id === id;
          })
          let data = {
              list: list.map(item => {
                        return {
                          amount: item.stockNumber,
                          batch: item.batch,
                          classificationId: item.category,
                          note: item.note,
                          orderItemId: item.id,
                          warehouseUnit: item.warehouseUnit,
                        }
            })
          }
          console.log(data);
					this.Axios(
						{
							url: "/api-warehouse/orderEntry/entry",
							params: data,
							type: "post",
							option: { successMsg: "添加成功！" },
							config: {
								headers: { "Content-Type": "application/json" }
							}
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
                console.log(result);
                this.findOne(this.sendId);
							}
						},
						({ type, info }) => {}
					);
    },
  },
  created() {
    this.findOne(this.sendId);
    this.getClassifyList();
  }
};
</script>
<style lang="less">
.stock {
  .detailsMsg {
    margin-bottom: 10px;
  }
  .label_right {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  .table_style {
    .ant-table-body {
      min-height: 500px;
      max-height: 500px;
    }
  }
  .codeMsg {
    width: 150px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 4px 4px;
  }
  .bgcolor {
    background-color: #f3f3f3;
    &:hover {
      background-color: #f3f3f3;
    }
  }
}
</style>