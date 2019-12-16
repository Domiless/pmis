<template>
  <div class="putInDetails_list">
    <a-row style="padding:0 20px;">
      <a-row>
        <a-col :span="24">
          <span class="span_lable">业务日期：</span>
          <a-date-picker
            :disabledDate="disabledStartDate"
            format="YYYY/MM/DD"
            v-model="startValue"
            placeholder="开始日期"
            @change="(a,b)=>changeDate(a,b,1)"
            style="width:130px;"
          />
          <a-date-picker
            :disabledDate="disabledEndDate"
            format="YYYY/MM/DD"
            placeholder="结束日期"
            v-model="endValue"
            @change="(a,b)=>changeDate(a,b,2)"
            style="width:130px;"
          />
          <span class="span_lable">单据类型：</span>
          <a-select v-model="dataSource" style="width: 140px">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option value="PURCHASING">采购入库</a-select-option>
            <a-select-option value="PRODUCE">生产入库</a-select-option>
            <a-select-option value="RETURN">退料入库</a-select-option>
            <a-select-option value="OTHER">其他入库</a-select-option>
          </a-select>
          <span class="span_lable">物料分类：</span>
          <a-tree-select
            allowClear
            v-model="classifyId"
            style="width: 140px"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="treeData"
            placeholder="请选择"
            treeDefaultExpandAll
          ></a-tree-select>
          <span class="span_lable">仓库：</span>
          <a-select v-model="warehouseId" style="width: 140px">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option
              :value="item.id"
              v-for="(item, index) in allWarehouse"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="24" style="padding-top:12px;">
          <span class="span_lable">单据编号：</span>
          <a-input placeholder v-model="orderCode" style="width: 264px"></a-input>
          <span class="span_lable">物料编码：</span>
          <a-input placeholder v-model="code" style="width: 140px"></a-input>
          <span class="span_lable">图号/名称：</span>
          <a-input placeholder v-model="drawingCode" style="width: 140px"></a-input>
          <span class="span_lable">型号/规格：</span>
          <a-input placeholder v-model="specification" style="width: 140px"></a-input>
          <a-button type="primary" @click="getList">查询</a-button>
        </a-col>
      </a-row>
      <a-row style="padding-top:10px;">
        <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id"></a-table>
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
    </a-row>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "gmtCreated",
    key: "gmtCreated",
    title: "业务日期",
    width: 140
  },
  {
    dataIndex: "warehouseName",
    title: "仓库",
    width: 100,
    key: "warehouseName",
    scopedSlots: { customRender: "warehouseNmae" }
  },
  {
    dataIndex: "orderCode",
    title: "单据编号",
    width: 160,
    key: "orderCode"
  },

  {
    dataIndex: "dataSource",
    key: "dataSource",
    title: "单据类型",
    width: 100,
    customRender: function(text, record, index) {
      return text == "PURCHASING"
        ? "采购入库"
        : text == "PRODUCE"
        ? "生产入库"
        : text == "RETURN"
        ? "退料入库"
        : "其他入库";
    }
  },
  {
    dataIndex: "code",
    key: "code",
    title: "物料编码",
    width: 100,
    scopedSlots: { customRender: "operation" }
  },
  {
    dataIndex: "drawingCode",
    key: "drawingCode",
    title: "图号",
    width: 120
  },
  {
    dataIndex: "name",
    key: "name",
    title: "名称",
    width: 180
  },
  {
    dataIndex: "specification",
    key: "specification",
    title: "型号/规格",
    width: 140
  },
  {
    dataIndex: "classify",
    key: "classify",
    title: "物料分类",
    width: 80
  },
  {
    dataIndex: "amount",
    key: "amount",
    title: "入库",
    width: 80
  },
  {
    dataIndex: "unit",
    key: "unit",
    title: "单位",
    width: 60
  },
  {
    dataIndex: "note",
    key: "note",
    title: "备注",
    width: 120
  }
];
export default {
  data() {
    return {
      current: 1,
      total: 0,
      columns,
      data: [],
      startValue: null,
      endValue: null,
      startDate: "",
      endDate: "",
      orderCode: "",
      code: "",
      drawingCode: "",
      specification: "",
      classifyId: null,
      treeData: [],
      allWarehouse: [],
      warehouseId: -1,
      dataSource: -1
    };
  },
  methods: {
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
          url: "/api-warehouse/report/entryOrder",
          params: {
            page: this.current,
            size: this.pageSize,
            dataSource: this.dataSource != -1 ? this.dataSource : null,
            classifyId: this.classifyId != -1 ? this.classifyId : null,
            warehouseId: this.warehouseId != -1 ? this.warehouseId : null,
            startTime: this.startDate != "" ? this.startDate : null,
            endTime: this.endDate != "" ? this.endDate : null,
            //单据编号
            orderCode: this.orderCode != "" ? this.orderCode : null,
            //物料编码
            code: this.code != "" ? this.code : null,
            drawingCode: this.drawingCode != "" ? this.drawingCode : null,
            //型号/规格
            specification: this.specification != "" ? this.specification : null
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.data = result.data.data.content;
            this.data = this.data.map(item => {
              return {
                ...item,
                classify: item.classification.name,
                warehouseName: item.warehouse.name
              };
            });
            this.total = result.data.data.totalElement;
          }
        },
        ({ type, info }) => {}
      );
    },
    changeDate(a, b, c) {
      console.log(a, b, c);

      if (c == 1) {
        this.startDate = b;
      }
      if (c == 2) {
        this.endDate = b;
      }
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    getWearhouse() {
      this.Axios(
        {
          url: "/api-warehouse/warehouse/list",
          params: {
            page: -1
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            this.allWarehouse = [...result.data.data];
          }
        },
        ({ type, info }) => {}
      );
    },
    getTreeDataList() {
      this.Axios(
        {
          url: "/api-warehouse/classification/list",
          params: {},
          type: "get",
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
                code: parseInt(item.code),
                parentCode: parseInt(item.parentCode)
              };
            });
            console.log(this.treeData);
            let code = Math.min.apply(
              null,
              this.treeData.map(item => {
                return item.parentCode;
              })
            );
            this.treeData = this.filterArray(this.treeData, code);
            console.log(this.treeData);
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
        if (data[i].parentCode == parent) {
          var obj = data[i];
          temp = this.filterArray(data, data[i].code);
          if (temp.length > 0) {
            obj.children = temp;
          }
          tree.push(obj);
        }
      }
      return tree;
    }
  },
  created() {
    this.getWearhouse();
    this.getTreeDataList();
    // this.getList();
  },
  watch: {}
};
</script>
<style lang="less">
.putInDetails_list {
  overflow: hidden;
  .span_lable {
    display: inline-block;
    width: 77px;
    text-align: right;
  }
}
</style>