<template>
  <div class="warehouse_add">
    <a-form :form="form">
      <a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 19 }" label="仓库编号">
        <a-input v-decorator="['warehouseNo',{rules: [{ required: true, message: '请填写仓库编号' }]}]"></a-input>
      </a-form-item>
      <a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 19 }" label="仓库名称">
        <a-input v-decorator="['warehouseName',{rules: [{ required: true, message: '请填写仓库名称' }]}]"></a-input>
      </a-form-item>
      <a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 19 }" label="库管员">
        <span
          v-decorator="['personName',{rules: [{ required: true, message: '请选择库管员' }]}]"
          style="padding-right:8px;"
        >
          <span
            v-for="(item, index) in personName"
            :key="index"
          >{{item.userName}}{{index!=personName.length-1?"、":""}}</span>
        </span>
        <a href="javascript:" @click="addPerson=true">选择人员</a>
      </a-form-item>
      <a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 19 }" label="联系方式">
        <a-input
          autocomplete="off"
          v-decorator="['phone',{rules: [{ required: true, message: '请填写联系方式' }]}]"
        ></a-input>
      </a-form-item>
      <a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 19 }" label="状态">
        <a-radio-group :options="options" v-model="radioValue" />
      </a-form-item>
      <a-form-item style="display:block;text-align:right;">
        <a-button style="margin-right:12px;" @click="quxiao">取消</a-button>
        <a-button type="primary" @click="toSave">保存</a-button>
      </a-form-item>
    </a-form>
    <a-modal
      title="新增库管员"
      :footer="null"
      width="800px"
      :visible="addPerson"
      @cancel="handleCancel()"
      :maskClosable="false"
    >
      <addperson v-on:addPersonModal="addpersonModal" ref="addref"></addperson>
    </a-modal>
  </div>
</template>
<script>
import addperson from "./addPerson";
export default {
  data() {
    return {
      addPerson: false,
      radioValue: "1",
      form: this.$form.createForm(this),
      options: [{ label: "启用", value: "1" }, { label: "禁用", value: "2" }],
      personName: []
    };
  },
  methods: {
    handleCancel() {
      this.addPerson = false;
    },
    addpersonModal(a) {
      this.addPerson = false;
      this.personName = a;
      setTimeout(() => {
        this.form.setFieldsValue({
          personName: a
        });
      }, 100);
    },
    quxiao() {
      this.form.resetFields();
      this.$emit("addModal", false);
      this.personName = [];
      //   this.getNum();
    },
    toSave() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let data = {
            gmtDelivery: this.dateValue,
            purchaseNo: values.purchaseNo,
            remark: values.remark,
            title: values.title,
            purchaseDesDTOList: this.selectedRowsRight.map(item => {
              return {
                id: item.id
              };
            })
          };
          this.Axios(
            {
              url: "/api-order/purchase/add",
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
                this.quxiao();
              }
            },
            ({ type, info }) => {}
          );
        }
      });
    }
  },
  created() {},
  components: {
    addperson
  }
};
</script>