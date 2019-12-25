<template>
  <div class="market_edit">
    <a-col :span="24" style="padding:0 20px;">
      <a-row>
        <div style="line-height:50px;">
          <a-col :span="15">
            <a-button @click="$router.back(-1)" icon="left" style="margin-right:20px;">返回</a-button>
          </a-col>
        </div>
      </a-row>
      <a-form style="padding-top:10px;" :form="form">
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="单据类型">
          <a-select
            v-decorator="['outType',{rules: [{ required: true, message: '请选择单据类型' }]}]"
            style="width: 100%"
            disabled
          >
            <a-select-option value="RECEIVE">领料出库</a-select-option>
            <a-select-option value="SALES">销售出库</a-select-option>
            <a-select-option value="RETURNGOODS">退货出库</a-select-option>
            <a-select-option value="OTHER">其他出库</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="单据编号">
          <a-input
            v-decorator="['code',{rules: [{ required: true, message: '请填写单据编号' }]}]"
            autocomplete="off"
            maxlength="20"
            disabled
          ></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="销售合同号">
          <a-input v-decorator="['goCode']" autocomplete="off" maxlength="20"></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="客户名称">
          <a-input
            v-decorator="['goName',{rules: [{ required: true, message: '请填写领用原因' }]}]"
            autocomplete="off"
            maxlength="20"
          ></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="联系人">
          <a-input v-decorator="['goPerson']" autocomplete="off" maxlength="20"></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="联系电话">
          <a-input
            type="number"
            oninput="if(value.length>11)value=value.slice(0,11)"
            v-decorator="['goPhone',{rules: [{validator: chickPhone}]}]"
            autocomplete="off"
            maxlength="11"
          ></a-input>
        </a-form-item>
        <!-- <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="出货仓库">
          <a-select
            v-decorator="['warehouseId',{rules: [{ required: true, message: '请选择出货仓库' }]}]"
            style="width: 100%"
            placeholder="请选择"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, index) in allWarehouse"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>-->
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="出库日期">
          <a-date-picker
            format="YYYY/MM/DD"
            v-decorator="['outDate']"
            @change="onDateChange"
            style="width:100%;"
          />
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="经办人">
          <a-input
            v-decorator="['handlerName',{rules: [{ required: true, message: '请填写经办人' }]}]"
            autocomplete="off"
            maxlength="20"
          ></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="制单人">
          <a-input v-decorator="['preparedName']" autocomplete="off" disabled></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="备注">
          <a-textarea
            maxlength="50"
            v-decorator="['note']"
            style="width:100%;"
            :autosize="{ minRows: 4, maxRows: 4 }"
          ></a-textarea>
        </a-form-item>
        <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id">
          <span slot="shuliangTitle">
            <span style="color: #f5222d">*</span>数量
          </span>
          <template slot="xuanzewuliao" slot-scope="text, record, index">
            <div class="choice">
              <span style="color:#1890FF;cursor: pointer;">
                <i class="iconfont" style="margin-right:8px;">&#xe647;</i>选择
              </span>
            </div>
          </template>
          <template slot="xuhao" slot-scope="text, record, index">
            <span>{{index+1}}</span>
          </template>
          <template slot="shuliang" slot-scope="text, record, index">
            <a-input
              type="number"
              oninput="if(value.length>10)value=value.slice(0,10)"
              v-model="record.number"
              @change="(e)=>handleInputChange(e.target.value, record.id, 'shuliang')"
            ></a-input>
          </template>
          <template slot="beizhu" slot-scope="text, record, index">
            <a-input
              maxlength="50"
              v-model="record.remark"
              @change="(e)=>handleInputChange(e.target.value, record.id, 'beizhu')"
            ></a-input>
          </template>
          <template slot="caozuo" slot-scope="text, record, index">
            <a-popover placement="top">
              <template slot="content">
                <span>删除</span>
              </template>
              <permission-button
                permCode
                banType="disabled"
                class="button_text btn_disabled"
                @click="delRow(record,index)"
              >
                <a-icon type="delete" style="color:red;" />
              </permission-button>
            </a-popover>
          </template>
        </a-table>
        <div style="padding:12px 0;">
          <a style="color:#1890FF;cursor: pointer;" href="javascript:" @click="choiceModalShow()">
            <a-icon type="plus" style="font-size:18px;margin-right:8px;" />添加
          </a>
        </div>
        <a-form-item style="display:block;margin-bottom:0;">
          <!-- <a-button style="margin-right:12px;">取消</a-button> -->
          <a-button type="primary" @click="add">保存</a-button>
        </a-form-item>
      </a-form>
    </a-col>
    <a-modal
      title="选择物料"
      v-model="choiceShow"
      :footer="null"
      :destroyOnClose="true"
      :mask="false"
      :closable="true"
      width="800px"
      centered
    >
      <materialList v-on:choisceMsg="choisceMsg"></materialList>
    </a-modal>
  </div>
</template>
<script>
import moment from "moment";
import materialList from "../../../public/materialList";
const columns = [
  {
    dataIndex: "index",
    key: "index",
    title: "",
    width: 40,
    scopedSlots: { customRender: "xuhao" },
    align: "center"
  },
  // {
  //   dataIndex: "xuanzewuliao",
  //   key: "xuanzewuliao",
  //   title: "选择物料",
  //   width: 80,
  //   scopedSlots: { customRender: "xuanzewuliao" }
  // },
  {
    dataIndex: "code",
    key: "code",
    title: "物料编码",
    width: 120
  },
  {
    dataIndex: "drawingCode",
    key: "drawingCode",
    title: "图号",
    width: 180
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
    dataIndex: "unit",
    key: "unit",
    title: "单位",
    width: 80
  },
  {
    dataIndex: "warehouseName",
    key: "warehouseName",
    title: "仓库",
    width: 100
  },
  {
    dataIndex: "amount",
    key: "amount",
    title: "库存数量",
    width: 100
  },
  {
    dataIndex: "shuliang",
    key: "shuliang",
    // title: "数量",
    width: 120,
    scopedSlots: { customRender: "shuliang" },
    slots: { title: "shuliangTitle" }
  },
  {
    dataIndex: "classifiName",
    key: "classifiName",
    title: "物料分类",
    width: 100
  },
  {
    dataIndex: "remark",
    key: "remark",
    title: "备注",
    width: 200,
    scopedSlots: { customRender: "beizhu" }
  },
  {
    dataIndex: "caozuo",
    key: "caozuo",
    title: "操作",
    width: 60,
    scopedSlots: { customRender: "caozuo" },
    align: "center"
  }
];
import { log } from "util";
export default {
  data() {
    return {
      allWarehouse: [],
      choiceShow: false,
      form: this.$form.createForm(this),
      columns,
      data: [],
      outDate: ""
    };
  },
  methods: {
    chickPhone(rule, value, callback) {
      if (
        /^1[23456789]\d{9}$/.test(value) == false &&
        value != "" &&
        value != null
      ) {
        callback(new Error("请输入正确的电话号码"));
      } else {
        callback();
      }
    },
    moment,
    add() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.data.length < 1) {
            this.$message.error(`请添加物料`);
          } else if (
            this.data
              .map(item => item.number == null || item.number == "")
              .find(item => item == true) != undefined
          ) {
            this.$message.error(`请填写物料数量`);
          } else if (
            this.data
              .map(item =>
                /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/.test(
                  item.number
                )
              )
              .find(item => item == false) != undefined
          ) {
            this.$message.error(`物料数量必须大于0,且只能保留3位小数`);
          } else if (
            this.data
              .map(item => item.number > item.amount)
              .find(item => item == true) != undefined
          ) {
            this.$message.error(`数量不能大于库存数量`);
          } else {
            let data = {
              outOrderId: this.$route.params.id,
              code: values.code,
              outType: values.outType,
              goName: values.goName,
              goCode: values.goCode,
              goPerson: values.goPerson,
              goPhone: values.goPhone,
              // warehouseId: values.warehouseId,
              handlerName: values.handlerName,
              note: values.note,
              outDate: this.outDate,
              outOrderItemDTOS: this.data.map(item => {
                return {
                  amount: item.number,
                  note: item.remark,
                  warehouseItemId: item.id
                };
              })
            };
            console.log(data);
            this.Axios(
              {
                url: "/api-warehouse/outOrder/update",
                params: data,
                type: "post",
                option: { successMsg: "修改成功！" },
                config: {
                  headers: { "Content-Type": "application/json" }
                }
              },
              this
            ).then(
              result => {
                if (result.data.code === 200) {
                  console.log(result);
                  this.$router.back(-1);
                }
              },
              ({ type, info }) => {}
            );
          }
        }
      });
    },
    delRow(row, index) {
      console.log(index);
      this.data.splice(index, 1);
    },
    choisceMsg(a) {
      console.log(a);
      // this.choiceShow = false;
      if (
        this.data.find(item => {
          return item.id == a.id;
        })
      ) {
        this.$message.error(`该条数据已被选择`);
        return false;
      } else {
        let b = {
          ...a,
          classifiName: a.classification.name,
          number: "",
          remark: ""
        };
        this.data.push(b);
      }
    },
    handleInputChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    onDateChange(a, b) {
      console.log(a, b);
      this.outDate = b;
    },
    choiceModalShow() {
      this.choiceShow = true;
    },
    getCode() {
      this.Axios(
        {
          url: "/api-warehouse/outOrder/code",
          params: {
            outType: "SALES"
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            this.form.setFieldsValue({
              code: result.data.data
            });
          }
        },
        ({ type, info }) => {}
      );
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
    findOne() {
      this.Axios(
        {
          url: "/api-warehouse/outOrder/findOne/" + this.$route.params.id,
          params: {},
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            let OneMsg = { ...result.data.data };
            console.log(OneMsg);
            this.data = OneMsg.orderItems.map(item => {
              return {
                number: item.amount,
                remark: item.note,
                drawingCode: item.warehouseItem.drawingCode,
                code: item.warehouseItem.code,
                name: item.warehouseItem.name,
                id: item.warehouseItem.id,
                specification: item.warehouseItem.specification,
                unit: item.warehouseItem.unit,
                amount: item.warehouseItem.amount,
                classifiName: item.warehouseItem.classification.name,
                warehouseName: item.warehouseItem.warehouse.name
              };
            });
            this.outDate = OneMsg.outDate;
            setTimeout(() => {
              this.form.setFieldsValue({
                outType: OneMsg.outType,
                code: OneMsg.code,
                goName: OneMsg.goName,
                reason: OneMsg.reason,
                goPerson: OneMsg.goPerson,
                goCode: OneMsg.goCode,
                goPhone: OneMsg.goPhone,
                // warehouseId: OneMsg.warehouse.id,
                outDate:
                  OneMsg.outDate == null
                    ? undefined
                    : moment(OneMsg.outDate, "YYYY/MM/DD"),
                preparedName: OneMsg.preparedName,
                note: OneMsg.note,
                handlerName: OneMsg.handlerName
              });
            }, 100);
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.getWearhouse();
    this.findOne();
  },
  mounted() {},
  components: {
    materialList
  }
};
</script>
<style lang="less">
.market_edit {
  overflow: hidden;
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 4px 4px;
  }
  .choice {
    position: relative;
    // .choice_show_style {
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    // }
  }
}
</style>