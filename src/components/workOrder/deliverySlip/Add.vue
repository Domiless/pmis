<template>
  <div class="delivery_slip_add">
    <a-form :form="form" layout="inline">
      <a-form-item label="单据编号">
        <a-input
          style="width:335px;"
          v-decorator="['docNo',{rules: [{ required: true, message: '请填写单据编号' }]}]"
        ></a-input>
      </a-form-item>
      <a-form-item label="标题">
        <a-input
          style="width:335px;"
          v-decorator="['title',{rules: [{ required: true, message: '请填写标题' }]}]"
        ></a-input>
      </a-form-item>
      <a-form-item label="外协供应商">
        <a-input style="width:335px;" v-decorator="['receivingUnit']"></a-input>
      </a-form-item>
      <a-form-item label="送货单位">
        <a-input style="width:335px;" v-decorator="['deliveryUnit']"></a-input>
      </a-form-item>
      <a-form-item label="收货人">
        <a-input style="width:335px;" v-decorator="['receivingPerson']"></a-input>
      </a-form-item>
      <a-form-item label="送货人">
        <a-input style="width:335px;" v-decorator="['deliveryPerson']"></a-input>
      </a-form-item>
      <div style="overflow:hidden;">
        <a-col :span="12" style="padding: 12px;height:400px;background-color:#FAFAFA;">
          <a-col :span="24" style="line-height:40px;overflow:hidden;">
            <a-select
              showSearch
              style="width: 100%"
              v-model="gongZuoLingNo"
              @change="handleSelectChange"
              allowClear
              :filterOption="filterOption"
              placeholder="请选择工作令"
            >
              <a-select-option
                v-for="(item, index) in gongzuolings"
                :key="index"
                :value="item"
              >{{item}}</a-select-option>
            </a-select>
            <a-select
              showSearch
              v-model="workType"
              placeholder="请选择工序"
              style="width: 100%"
              @change="handleChange"
              allowClear
              :filterOption="filterOption"
            >
              <a-select-option value="-1">全部工序</a-select-option>
              <a-select-option value="SURFACE">表处</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="24">
            <a-table
              class="table_1"
              :scroll="{ x: 800, y: 258 }"
              size="small"
              rowKey="workOrderDesId"
              :columns="columns"
              :pagination="false"
              :dataSource="data"
              :rowSelection="{selectedRowKeys:selectedRowKeysLeft,onChange: (a,b)=>onSelectChange(a,b,1)}"
            ></a-table>
          </a-col>
        </a-col>
        <a-col :span="1" style="height:400px;padding:12px;line-height:400px;text-align:center;">
          <a-icon type="swap" style="font-size:16px;" />
        </a-col>
        <a-col :span="11" style="padding: 12px;height:400px;background-color:#FAFAFA;">
          <a-col :span="24" style="overflow:hidden;padding:7px 0;">
            <span style="font-size:14px;">已选择：{{selectedRowsRight.length}}</span>
            <span style="float:right;">
              <a-button size="small" @click="delSelect">删除已选</a-button>
              <a-button size="small" @click="delAll">清空全部</a-button>
            </span>
          </a-col>
          <a-col :span="24">
            <a-table
              class="table_2"
              :scroll="{ x: 800, y: 300 }"
              size="small"
              rowKey="workOrderDesId"
              :columns="columns"
              :pagination="false"
              :dataSource="selectedRowsRight"
              :rowSelection="{selectedRowKeys:selectedRowKeysRight,onChange:  (a,b)=>onSelectChange(a,b,2)}"
            ></a-table>
          </a-col>
        </a-col>
      </div>
      <div style="color:#999999">
        <span>注：</span>
        <span style="display:inline-block;vertical-align: top;">
          选择“全部工序”时，会加载已投产的所有工单明细；
          <br />选择“表处”时，只加载进行中的工单明细。
        </span>
      </div>
      <a-form-item style="text-align:right;display:block;">
        <a-button style="margin-right:12px;" @click="cancle">取消</a-button>
        <a-button type="primary" @click="add">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
let columns = [
  {
    dataIndex: "planCode",
    key: "planCode",
    title: "计划编号",
    width: 80
  },
  {
    dataIndex: "gongZuoLingNo",
    key: "gongZuoLingNo",
    title: "工作令",
    width: 120
  },
  {
    dataIndex: "drawingNo",
    key: "drawingNo",
    title: "图号",
    width: 120
  },
  {
    dataIndex: "drawingName",
    key: "drawingName",
    title: "名称",
    width: 120
  },
  {
    dataIndex: "amount",
    key: "amount",
    title: "数量",
    width: 80
  }
];
export default {
  data() {
    return {
      columns,
      data: [],
      dataRight: [],
      form: this.$form.createForm(this),
      selectedRowKeysLeft: [],
      selectedRowKeysRight: [],
      selectedRows: [],
      selectedRowsRight: [],
      gongzuolings: [],
      gongZuoLingNo: undefined,
      workType: "-1"
    };
  },
  methods: {
    getCode() {
      this.Axios(
        {
          url: "/api-workorder/delivery/code",
          params: {},
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            setTimeout(() => {
              this.form.setFieldsValue({
                docNo: result.data.data
              });
            }, 100);
          }
        },
        ({ type, info }) => {}
      );
    },
    cancle() {
      this.form.resetFields();
      this.selectedRowKeysRight = [];
      this.selectedRowsRight = [];
      this.selectedRows = [];
      this.selectedRowKeysLeft = [];
      this.gongZuoLingNo = undefined;
      this.workType = "-1";
      this.getProcesslist();
      this.$emit("addModal", false);
      this.getCode();
    },
    add() {
      if (this.selectedRows.length < 1) {
        this.$message.error(`请选择工单明细`);
      } else {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            let qs = require("qs");
            let data = {
              deliveryPerson: values.deliveryPerson,
              deliveryUnit: values.deliveryUnit,
              docNo: values.docNo,
              receivingPerson: values.receivingPerson,
              receivingUnit: values.receivingUnit,
              title: values.title,
              workOrderDesIds: this.selectedRowsRight.map(
                item => item.workOrderDesId
              )
            };
            console.log(data);
            this.Axios(
              {
                url: "/api-workorder/delivery/add",
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
                  this.form.resetFields();
                  this.selectedRowKeysRight = [];
                  this.selectedRows = [];
                  this.selectedRowKeysLeft = [];
                  this.gongZuoLingNo = undefined;
                  this.workType = "-1";
                  this.getProcesslist();
                  this.selectedRowsRight = [];
                  this.$emit("addModal", false);
                  this.getCode();
                }
              },
              ({ type, info }) => {}
            );
          }
        });
      }
    },
    delAll() {
      this.selectedRowKeysRight = [];
      this.selectedRows = [];
      this.selectedRowKeysLeft = [];
      this.selectedRowsRight = [];
    },
    delSelect() {
      for (let i = 0; i < this.selectedRowKeysRight.length; i++) {
        this.selectedRowsRight = this.selectedRowsRight.filter(item => {
          return item.workOrderDesId != this.selectedRowKeysRight[i];
        });
        this.selectedRowKeysLeft = this.selectedRowKeysLeft.filter(item => {
          return item != this.selectedRowKeysRight[i];
        });
      }
      this.selectedRowKeysRight = [];
    },
    handleSelectChange(value) {
      this.getProcesslist();
    },
    handleChange(value) {
      this.getProcesslist();
    },
    onSelectChange(a, b, c) {
      console.log(c);
      if (c == 1) {
        this.selectedRowKeysLeft = a;
        this.selectedRows = b;

        let arr = new Array();
        arr = [...this.selectedRowsRight];
        this.selectedRowsRight = [];
        arr = arr.concat(b);
        arr = Array.from(new Set(arr));
        if (this.selectedRowKeysLeft.length < 1) {
          this.selectedRowsRight = [];
        } else {
          for (let i = 0; i < this.selectedRowKeysLeft.length; i++) {
            this.selectedRowsRight.push(
              arr.find(item => {
                return item.workOrderDesId == this.selectedRowKeysLeft[i];
              })
            );
          }
        }
      }
      if (c == 2) {
        this.selectedRowKeysRight = a;
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    getGongZuoLing() {
      this.Axios(
        {
          url: "/api-workorder/delivery/gongzuolings",
          params: {},
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.gongzuolings = result.data.data;
          }
        },
        ({ type, info }) => {}
      );
    },
    getProcesslist() {
      this.Axios(
        {
          url: "/api-workorder/delivery/processlist",
          params: {
            gongZuoLingNo: this.gongZuoLingNo,
            workType: this.workType != "-1" ? this.workType : ""
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.data = result.data.data;
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.getGongZuoLing();
    this.getCode();
    // this.getProcesslist();
  }
};
</script>
<style lang="less">
.delivery_slip_add {
  .ant-form-item-label {
    width: 120px;
  }
  .ant-form-item {
    margin-bottom: 20px;
  }
  .table_1 {
    .ant-table-body {
      min-height: 258px;
    }
    .ant-table-placeholder {
      position: relative;
      top: -150px;
    }
  }
  .table_2 {
    .ant-table-body {
      min-height: 300px;
    }
    .ant-table-placeholder {
      position: relative;
      top: -190px;
    }
  }
}
</style>