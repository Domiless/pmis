<template>
  <div class="stock">
    <a-row>
      <a-col :span="12">
        <span class="label_right">单据编号：</span>
      </a-col>
      <a-col :span="12">
        <span class="label_right">收货仓库：</span>
      </a-col>
      <a-col :span="12">
        <span class="label_right">生产部门：</span>
      </a-col>
      <a-col :span="12">
        <span class="label_right">开单日期：</span>
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
      >
        <template slot="stockNumber" slot-scope="text,record">
          <div key="stockNumber">
            <a-input
              maxlength="20"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.id, 'stockNumber')"
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
            />
          </div>
        </template>
        <template slot="category" slot-scope="text,record">
          <a-select
            style="width: 100%"
            @change="(value,option) => {
                  let value1 = value;
                  handleChangeTable(value1, record.id, 'category')
                  }"
          >
            <a-select-option
              v-for="item in categoryArr"
              :value="item.name"
              :key="item.id"
            >{{ item.name }}</a-select-option>
          </a-select>
        </template>
        <template slot="remark" slot-scope="text,record">
          <div key="remark">
            <a-input
              maxlength="20"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.id, 'remark')"
            />
          </div>
        </template>
        <template slot="ruku" slot-scope="text,record">
           <a href="javascript:" @click="showDetails(record.id)">入库</a>
        </template>
      </a-table>
    </a-row>
  </div>
</template>
<script>
const columns = [
  {
    title: "物料编码",
    key: "workOrderNo",
    dataIndex: "workOrderNo",
    width: 100
  },
  {
    title: "图号",
    key: "drawingNo",
    dataIndex: "drawingNo",
    width: 150
  },
  {
    title: "名称",
    key: "name",
    dataIndex: "name",
    width: 150
  },
  {
    title: "生产部门",
    key: "production_department",
    dataIndex: "production_department",
    width: 150
  },
  {
    title: "订单数量",
    key: "planner",
    dataIndex: "planner",
    width: 80
  },
  {
    title: "已入",
    key: "shopName",
    dataIndex: "shopName",
    width: 80
  },
  {
    title: "待入",
    key: "orderNumber",
    dataIndex: "orderNumber",
    width: 80
  },
  {
    title: "单位",
    key: "unitId",
    dataIndex: "unitId",
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
    title: "批次",
    key: "batch",
    dataIndex: "batch",
    width: 80,
    scopedSlots: { customRender: "batch" }
  },
  {
    title: "分类",
    key: "category",
    dataIndex: "category",
    width: 100,
    scopedSlots: { customRender: "category" }
  },
  {
    title: "备注",
    key: "remark",
    dataIndex: "remark",
    width: 140,
    scopedSlots: { customRender: "remark" }
  },
  {
    title: "入库",
    key: "ruku",
    dataIndex: "ruku",
    fixed: 'right',
    width: 50,
    scopedSlots: { customRender: "ruku" }
  }
];
export default {
  data() {
    return {
      columns,
      data: [],
      unitArr: [],
      placeArr: [],
      categoryArr: []
    };
  },
  methods: {
    handleChange(value, key, column) {
      // console.log(value);
      // console.log(key);
      // console.log(column);

      const newData = [...this.data];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    }
  }
};
</script>
<style lang="less">
.stock {
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
}
</style>