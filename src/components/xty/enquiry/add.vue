<template>
  <div class="enquiry_add">
    <a-table
      :scroll="{ x: 3020,y:500}"
      rowKey="id"
      class="table_style"
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      size="small"
    >
      <span slot="dingdanshuliangTitle">
        <span style="color: #f5222d">*</span>订单数量
      </span>
      <span slot="dingdandanweiTitle">
        <span style="color: #f5222d">*</span>订单单位
      </span>
      <span slot="jiaohuoriqiTitle">
        <span style="color: #f5222d">*</span>交货日期
      </span>
      <span slot="diyigongyingshangTitle">
        <span style="color: #f5222d">*</span>第1供应商
      </span>
      <span slot="diyibaojiaTitle">
        <span style="color: #f5222d">*</span>第1报价(元)
      </span>
      <span slot="jiagedanweiTitle">
        <span style="color: #f5222d">*</span>价格单位
      </span>
      <span slot="jianyigongyingshangTitle">
        <span style="color: #f5222d">*</span>建议供应商
      </span>
      <template v-for="col in ['shopName','remark']" :slot="col" slot-scope="text, record, index">
        <div :key="col">
          <a-input
            style="margin: -5px 0;max-width:120px"
            :value="text"
            @change="e => handleChange(e.target.value, record.id, col)"
            maxlength="50"
          />
        </div>
      </template>
      <template
        v-for="f in ['orderNumber','firstOffer','secondOffer','thirdOffer']"
        :slot="f"
        slot-scope="text, record, index"
      >
        <div :key="f">
          <a-input
            type="number"
            oninput="if(value.length>10)value=value.slice(0,10)"
            style="margin: -5px 0;max-width:80px;"
            :value="text"
            @blur="e=>checkInput(e.target.value)"
            @change="e => handleChange(e.target.value, record.id, f)"
          />
        </div>
      </template>
      <template
        v-for="l in ['firstSupplierId', 'secondSupplierId', 'thirdSupplierId']"
        :slot="l"
        slot-scope="text, record, index"
      >
        <div :key="l">
          <a-select
            allowClear
            showSearch
            :filterOption="filterOption"
            style="width:120px;margin: -5px 0;"
            :value="text"
            @change="e => handleChange(e, record.id, l)"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, index1) in supplierListValue"
              :key="index1"
            >{{item.supplierName}}</a-select-option>
          </a-select>
        </div>
      </template>
      <template v-for="i in ['priseUnitId']" :slot="i" slot-scope="text, record, index">
        <div :key="i">
          <a-select
            style="width:70px;margin: -5px 0"
            :value="text"
            @change="e => handleChange(e, record.id, i)"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, index) in unitListValue"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </div>
      </template>
      <template v-for="j in ['moneyType']" :slot="j" slot-scope="text, record, index">
        <div :key="j">
          <a-input
            style="width:80px;"
            maxlength="20"
            :value="text"
            @change="e => handleChange(e.target.value, record.id, j)"
          ></a-input>
        </div>
      </template>
      <template v-for="z in ['unitId']" :slot="z" slot-scope="text, record, index">
        <div :key="z">
          <a-select
            style="width:70px;margin: -5px 0"
            :value="text"
            @change="e => handleChange(e, record.id, z)"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, index) in unitListValue"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </div>
      </template>
      <template v-for="k in ['delivery']" :slot="k" slot-scope="text, record, index">
        <div :key="k">
          <a-date-picker
            :defaultValue="text!=''&&text!=null?moment(text, 'YYYY/MM/DD'):undefined"
            format="YYYY/MM/DD"
            @change="(a,b)=>onChange(a,b,record.id, k)"
            style="width:100%;"
          />
        </div>
      </template>
      <template v-for="r in ['supplierId']" :slot="r" slot-scope="text, record, index">
        <div :key="r">
          <a-select
            style="width:120px;margin: -5px 0"
            :value="text"
            @change="e => handleChangeSupplier(e, record.id, r)"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, index3) in record.supplierListValue"
              :key="index3"
            >{{item.supplierName}}</a-select-option>
          </a-select>
        </div>
      </template>
    </a-table>
    <div style="text-align:right;line-height:50px;">
      <a-button @click="quxiao">取消</a-button>
      <a-button type="primary" @click="toSave">提交</a-button>
    </div>
  </div>
</template>
<script>
import moment from "moment";
const columns = [
  {
    title: "项目订单编号",
    key: "workOrderNo",
    dataIndex: "workOrderNo",
    width: 150,
    fixed: "left"
  },
  {
    title: "图号",
    key: "drawingNo",
    dataIndex: "drawingNo",
    width: 150,
    fixed: "left"
  },
  {
    title: "名称",
    key: "name",
    dataIndex: "name",
    width: 150,
    fixed: "left"
  },
  {
    title: "需求数量",
    key: "addNum",
    dataIndex: "addNum",
    width: 80
  },
  {
    title: "指定品牌",
    key: "brand",
    dataIndex: "brand",
    width: 110
  },
  {
    title: "设计师",
    key: "planner",
    dataIndex: "planner",
    width: 80
  },
  {
    title: "采购名称",
    key: "shopName",
    dataIndex: "shopName",
    width: 120,
    scopedSlots: { customRender: "shopName" }
  },
  {
    // title: "订单数量",
    key: "orderNumber",
    dataIndex: "orderNumber",
    width: 80,
    scopedSlots: { customRender: "orderNumber" },
    slots: { title: "dingdanshuliangTitle" }
  },
  {
    // title: "订单单位",
    key: "unitId",
    dataIndex: "unitId",
    width: 80,
    slots: { title: "dingdandanweiTitle" },
    scopedSlots: { customRender: "unitId" }
  },
  {
    // title: "交货日期",
    key: "delivery",
    dataIndex: "delivery",
    width: 140,
    slots: { title: "jiaohuoriqiTitle" },
    scopedSlots: { customRender: "delivery" }
  },
  {
    // title: "第1供应商",
    key: "firstSupplierId",
    dataIndex: "firstSupplierId",
    width: 150,
    slots: { title: "diyigongyingshangTitle" },
    scopedSlots: { customRender: "firstSupplierId" }
  },
  {
    // title: "第1报价(元)",
    key: "firstOffer",
    dataIndex: "firstOffer",
    width: 100,
    slots: { title: "diyibaojiaTitle" },
    scopedSlots: { customRender: "firstOffer" }
  },
  {
    title: "第2供应商",
    key: "secondSupplierId",
    dataIndex: "secondSupplierId",
    width: 150,
    scopedSlots: { customRender: "secondSupplierId" }
  },
  {
    title: "第2报价(元)",
    key: "secondOffer",
    dataIndex: "secondOffer",
    width: 100,
    scopedSlots: { customRender: "secondOffer" }
  },
  {
    title: "第3供应商",
    key: "thirdSupplierId",
    dataIndex: "thirdSupplierId",
    width: 150,
    scopedSlots: { customRender: "thirdSupplierId" }
  },
  {
    title: "第3报价(元)",
    key: "thirdOffer",
    dataIndex: "thirdOffer",
    width: 100,
    scopedSlots: { customRender: "thirdOffer" }
  },
  {
    // title: "建议供应商",
    key: "supplierId",
    dataIndex: "supplierId",
    width: 150,
    slots: { title: "jianyigongyingshangTitle" },
    scopedSlots: { customRender: "supplierId" }
  },
  {
    title: "建议价格",
    key: "price",
    dataIndex: "price",
    width: 90
  },
  {
    // title: "价格单位",
    key: "priseUnitId",
    dataIndex: "priseUnitId",
    width: 90,
    slots: { title: "jiagedanweiTitle" },
    scopedSlots: { customRender: "priseUnitId" }
  },
  {
    title: "货币类型",
    key: "moneyType",
    dataIndex: "moneyType",
    width: 90,
    scopedSlots: { customRender: "moneyType" }
  },
  {
    title: "备注",
    key: "remark",
    dataIndex: "remark",
    width: 140,
    scopedSlots: { customRender: "remark" }
  },
  {
    title: "小计(元)",
    key: "total",
    dataIndex: "total",
    width: 100
  }
];
export default {
  props: {
    dataArray: {
      default: []
    }
  },
  data() {
    return {
      columns,
      data: [],
      unitListValue: [],
      supplierListValue: []
    };
  },
  methods: {
    checkInput(value) {
      if (
        (/^\d+(\.\d{0,2})?$/.test(value) == false || value <= 0) &&
        value != "" &&
        value != null
      ) {
        this.$message.error(`只能输入大于0的数，且只能保留两位小数`);
      }
    },
    toSave() {
      if (
        this.data
          .map(item => {
            return item.orderNumber != null && item.orderNumber != "";
          })
          .find(item => item == false) != undefined
      ) {
        this.$message.error(`订单数量不能为空`);
        return false;
      }
      if (
        this.data
          .map(item => {
            return item.unitId != null && item.unitId != "";
          })
          .find(item => item == false) != undefined
      ) {
        this.$message.error(`订单单位不能为空`);
        return false;
      }
      if (
        this.data
          .map(item => {
            return item.delivery != null && item.delivery != "";
          })
          .find(item => item == false) != undefined
      ) {
        this.$message.error(`交货日期不能为空`);
        return false;
      }
      if (
        this.data
          .map(item => {
            return item.firstSupplierId != null && item.firstSupplierId != "";
          })
          .find(item => item == false) != undefined
      ) {
        this.$message.error(`第1供应商不能为空`);
        return false;
      }
      if (
        this.data
          .map(item => {
            return item.firstOffer != null && item.firstOffer != "";
          })
          .find(item => item == false) != undefined
      ) {
        this.$message.error(`第1报价不能为空`);
        return false;
      }
      if (
        this.data
          .map(item => {
            return item.supplierId != null && item.supplierId != "";
          })
          .find(item => item == false) != undefined
      ) {
        this.$message.error(`建议供应商不能为空`);
        return false;
      }
      if (
        this.data
          .map(item => {
            return item.priseUnitId != null && item.priseUnitId != "";
          })
          .find(item => item == false) != undefined
      ) {
        this.$message.error(`价格单位不能为空`);
        return false;
      }
      this.saveEnquiry();
    },
    saveEnquiry() {
      let data = this.data.map(item => {
        return {
          addNum: item.addNum,
          appointId: item.appointId,
          appointName: item.appointName,
          bomDesId: item.id,
          brand: item.brand,
          delivery: item.delivery,
          planner: item.planner,
          drawingNo: item.drawingNo,
          firstOffer: item.firstOffer,
          firstSupplierId: item.firstSupplierId,
          moneyType: item.moneyType,
          name: item.name,
          orderNumber: item.orderNumber,
          price: item.price,
          priseUnitId: item.priseUnitId,
          remark: item.remark,
          secondOffer: item.secondOffer,
          secondSupplierId: item.secondSupplierId,
          shopName: item.shopName,
          supplierId: item.supplierId,
          thirdOffer: item.thirdOffer,
          thirdSupplierId: item.thirdSupplierId,
          total: item.total,
          unitId: item.unitId,
          workOrderNo: item.workOrderNo
        };
      });
      // console.log(data);
      this.Axios(
        {
          url: "/api-order/purchase/offer",
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
            // this.data = [];
            this.$emit("addModal", false);
          }
        },
        ({ type, info }) => {}
      );
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    quxiao() {
      this.$emit("addModal", false);
    },
    moment,
    onChange(a, b, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        target[column] = b;
        this.data = newData;
      }
    },
    handleChangeSupplier(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        target[column] = value;
        if (target.firstSupplierId == target.supplierId) {
          target.price = target.firstOffer;
          target.total = Number(target.price) * Number(target.orderNumber);
        }
        if (target.secondSupplierId == target.supplierId) {
          target.price = target.secondOffer;
          target.total = Number(target.price) * Number(target.orderNumber);
        }
        if (target.thirdSupplierId == target.supplierId) {
          target.price = target.thirdOffer;
          target.total = Number(target.price) * Number(target.orderNumber);
        }
        this.data = newData;
      }
    },
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        if (
          column == "firstSupplierId" ||
          column == "secondSupplierId" ||
          column == "thirdSupplierId"
        ) {
          target.supplierId = "";
          target.price = null;
          target.total = null;
        }
        if (column == "unitId") {
          target.priseUnitId = value;
        }
        target[column] = value;
        let item1, item2, item3;
        item1 = this.supplierListValue.find(
          item => item.id === target.firstSupplierId
        );
        item2 = this.supplierListValue.find(
          item => item.id === target.secondSupplierId
        );
        item3 = this.supplierListValue.find(
          item => item.id === target.thirdSupplierId
        );
        let arr = new Array();
        if (item1 != undefined) {
          arr.push(item1);
        }
        if (item2 != undefined) {
          arr.push(item2);
        }
        if (item3 != undefined) {
          arr.push(item3);
        }
        target.supplierListValue = [...arr];
        if (
          target.firstSupplierId == target.supplierId &&
          (target.supplierId != "" && target.supplierId != null)
        ) {
          target.price = target.firstOffer;
          target.total = Number(target.price) * Number(target.orderNumber);
        }
        if (
          target.secondSupplierId == target.supplierId &&
          (target.supplierId != "" && target.supplierId != null)
        ) {
          target.price = target.secondOffer;
          target.total = Number(target.price) * Number(target.orderNumber);
        }
        if (
          target.thirdSupplierId == target.supplierId &&
          (target.supplierId != "" && target.supplierId != null)
        ) {
          target.price = target.thirdOffer;
          target.total = Number(target.price) * Number(target.orderNumber);
        }
        this.data = newData;
      }
    },
    getUnitList() {
      this.Axios(
        {
          url: ["/api-order/unit/list", "/api-order/supplier/list"],
          type: "get",
          params: {
            page: 1,
            size: -1
          },
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          console.log(result);
          if (result[0].data.code === 200) {
            this.unitListValue = result[0].data.data;
          }
          if (result[1].data.code === 200) {
            this.supplierListValue = result[1].data.data;
          }
          // if (result.data.code === 200) {
          // 	console.log(result, result1);
          // }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.getUnitList();
    this.data = this.dataArray.map(item => {
      return {
        ...item,
        shopName: "",
        orderNumber: "",
        unitId: "",
        delivery: "",
        firstSupplierId: "",
        firstOffer: "",
        secondSupplierId: "",
        secondOffer: "",
        thirdSupplierId: "",
        thirdOffer: "",
        supplierId: "",
        price: "",
        priseUnitId: "",
        moneyType: "RMB",
        remark: "",
        total: "",
        supplierListValue: []
      };
    });
  },
  watch: {
    dataArray() {
      this.data = this.dataArray.map(item => {
        return {
          ...item,
          shopName: "",
          orderNumber: "",
          unitId: "",
          delivery: "",
          firstSupplierId: "",
          firstOffer: "",
          secondSupplierId: "",
          secondOffer: "",
          thirdSupplierId: "",
          thirdOffer: "",
          supplierId: "",
          price: "",
          priseUnitId: "",
          moneyType: "RMB",
          remark: "",
          total: "",
          supplierListValue: []
        };
      });
    }
  }
};
</script>
<style lang="less">
.enquiry_add {
  .ant-table-fixed-left,
  .ant-table-fixed-right {
    z-index: 2;
  }
  .table_style {
    .ant-table-body {
      min-height: 500px;
      max-height: 500px;
    }
  }
}
</style>