<template>
  <div class="edit_storageAllot">
    <a-row style="line-height:50px;">
      <a-button @click="$router.back(-1)" icon="left">返回</a-button>
    </a-row>
    <a-row>
      <a-form :form="form">
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="单据类型">
          <a-input
            v-decorator="[
                        'invoicesType',
                        {rules: [{ required: true, message: '请填写单据类型' }]}
                        ]"
            maxlength="10"
            disabled
          ></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="单据编号">
          <a-input
            v-decorator="[
                        'invoicesNo',
                        {rules: [{ required: true, message: '请填写单据编号' }]}
                        ]"
            maxlength="20"
          ></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="调出仓库">
          <a-select
            placeholder="请选择"
            v-decorator="[
                        'outputWarehouse',
                        {rules: [{ required: true, message: '请选择调出仓库' }]}
                        ]"
          >
            <a-select-option
              v-for="item in warehouseList"
              :key="item.id"
              :value="item.id"
            >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="调入仓库">
          <a-select
            placeholder="请选择"
            v-decorator="[
                        'inputWarehouse',
                        {rules: [{ required: true, message: '请选择调入仓库' }]}
                        ]"
          >
            <a-select-option
              v-for="item in warehouseList"
              :key="item.id"
              :value="item.id"
            >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="调拨日期">
          <a-date-picker
            style="width:100%;"
            @change="onChangeSign"
            v-decorator="['stockDate']"
            format="YYYY/MM/DD"
          />
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="经办人">
          <a-input
            v-decorator="[
                        'transactor',
                        {rules: [{ required: true, message: '请填写经办人' }]}
                        ]"
          ></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="制单人">
          <a-input v-decorator="['preparedBy']" maxlength="10" disabled></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 12 }" label="备注">
          <a-textarea v-decorator="['remark']" :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
        </a-form-item>
        <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id">
          <span slot="transferAmountTitle">
            <span style="color: #f5222d">*</span>调拨数量
          </span>
          <template slot="xuanzewuliao" slot-scope="text, record, index">
            <div class="choice">
              <span style="color:#1890FF;cursor: pointer;" @click="choiceModalShow(index)">
                <i class="iconfont" style="margin-right:8px;">&#xe647;</i>选择
              </span>
            </div>
          </template>
          <template slot="index" slot-scope="text, record, index">
            <span>{{index+1}}</span>
          </template>
          <template slot="transferAmount" slot-scope="text, record, index">
            <a-input
              type="number"
              oninput="if(value.length>10)value=value.slice(0,10)"
              :value="text"
              @change="(e)=>handleInputChange(e.target.value, record.id, 'transferAmount')"
              @blur="(e)=>editDetails(e.target.value, record.id)"
            ></a-input>
          </template>
          <template slot="remark" slot-scope="text, record, index">
            <a-input
              maxlength="50"
              :value="text"
              @change="(e)=>handleInputChange(e.target.value, record.id, 'remark')"
              @blur="(e)=>editDetails(e.target.value, record.id)"
            ></a-input>
          </template>
        </a-table>
        <div style="padding:12px 0;">
          <a style="color:#1890FF;cursor: pointer;" href="javascript:" @click="choiceModalShow()">
            <a-icon type="plus" style="font-size:18px;margin-right:8px;" />添加
          </a>
        </div>
        <a-form-item style="display:block;margin-bottom:0;">
          <!-- <a-button style="margin-right:12px;">取消</a-button> -->
          <a-button type="primary" @click="save">保存</a-button>
        </a-form-item>
      </a-form>
    </a-row>
    <a-row>
      <a-modal
        v-model="choiceShow"
        :footer="null"
        :destroyOnClose="true"
        :mask="false"
        :closable="false"
        width="800px"
        centered
      >
        <materialList v-on:choisceMsg="choisceMsg"></materialList>
      </a-modal>
    </a-row>
  </div>
</template>
<script>
import materialList from "../../../public/materialList";
import moment from "moment";
const columns = [
  {
    dataIndex: "index",
    key: "index",
    title: "",
    width: 40,
    scopedSlots: { customRender: "index" },
    align: "center"
  },
  //   {
  //     dataIndex: "xuanzewuliao",
  //     key: "xuanzewuliao",
  //     title: "选择物料",
  //     width: 80,
  //     scopedSlots: { customRender: "xuanzewuliao" }
  //   },
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
    width: 140
  },
  {
    dataIndex: "name",
    key: "name",
    title: "名称",
    width: 140
  },
  {
    dataIndex: "specification",
    key: "specification",
    title: "型号/规格",
    width: 140
  },
  {
    dataIndex: "unitEntry",
    key: "unitEntry",
    title: "单位",
    width: 80
  },
  {
    dataIndex: "classify",
    key: "classify",
    title: "物料分类",
    width: 100
  },
  {
    dataIndex: "inventoryAmount",
    key: "inventoryAmount",
    title: "库存数量",
    width: 100
  },
  {
    dataIndex: "transferAmount",
    key: "transferAmount",
    // title: "数量",
    width: 120,
    scopedSlots: { customRender: "transferAmount" },
    slots: { title: "transferAmountTitle" }
  },
  {
    dataIndex: "remark",
    key: "remark",
    title: "备注",
    width: 160,
    scopedSlots: { customRender: "remark" }
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
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      signDate: "",
      choiceShow: false,
      columns,
      data: [],
      detailsMsg: [],
      warehouseList: [],
      inputwarehouse: "",
      outputwarehouse: ""
    };
  },
  methods: {
    choisceMsg(a) {
      console.log(a);
      this.choiceShow = false;
    },
    onChangeSign(data, dateString) {
      this.signDate = dateString;
    },
    choiceModalShow(index) {
      console.log(index);
      this.choiceShow = true;
    },
    editDetails(value, key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.id)[0];
      console.log(target);
      let qs = require("qs");
      let detailsData = qs.stringify({
        id: target.id,
        amount: target.transferAmount,
        remark: target.remark
      });
      this.Axios(
        {
          url: "/api-warehouse/transferItem/update?" + detailsData,
          params: {},
          type: "put",
          enableMsg: false,
          // option: { successMsg: "修改成功！" },
          config: {
            headers: { "Content-Type": "application/json" }
          }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
          }
        },
        ({ type, info }) => {}
      );
    },
    handleInputChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
      console.log(target);
    },
    getWareHouseList() {
      this.Axios(
        {
          url: "/api-warehouse/warehouse/list",
          type: "get",
          params: {
            page: -1
          },
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.warehouseList = result.data.data;
          }
        },
        ({ type, info }) => {}
      );
    },
    findOne(id) {
      this.Axios(
        {
          url: "/api-warehouse/transfer/details",
          params: {
            id: id
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.detailsMsg = result.data.data.transferDO;
            this.data = result.data.data.transferItemDO;
            this.signDate = this.detailsMsg.transferDate;
            this.form.setFieldsValue({
              invoicesType: this.detailsMsg.type,
              invoicesNo: this.detailsMsg.transferNo,
              outputWarehouse: this.detailsMsg.fromWarehouse.id,
              inputWarehouse: this.detailsMsg.toWareHouse.id,
              stockDate: this.detailsMsg.transferDate == null
                            ? undefined
                            : moment(this.detailsMsg.transferDate, "YYYY/MM/DD"),
              transactor: this.detailsMsg.manager,
              preparedBy: this.detailsMsg.createdBy,
              remark: this.detailsMsg.remark
            });
          }
        },
        ({ type, info }) => {}
      );
    },
    save() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          // if (!this.checkedKeys.length) {
          // 	this.$message.error("请分配角色权限");
          // 	return false;
          // }
          let qs = require("qs");
          let data = {
            transferId: this.$route.params.id,
            transferNo: values.invoicesNo,
            transferDate: this.signDate,
            manager: values.transactor,
            remark: values.remark
          };
          console.log(data);
          this.Axios(
            {
              url: "/api-warehouse/transfer/update",
              params: data,
              type: "put",
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
                this.form.resetFields();
                this.$router.back(-1);
              }
            },
            ({ type, info }) => {}
          );
        }
      });
    }
  },
  created() {
    this.getWareHouseList();
    this.findOne(this.$route.params.id);
  },
  components: {
    materialList
  }
};
</script>
<style lang="less">
.edit_storageAllot {
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