<template>
  <div class="warehouse_add">
    <a-form :form="form">
      <a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 19 }" label="仓库编号">
        <a-input disabled v-decorator="['code',{rules: [{ required: true, message: '请填写仓库编号' }]}]"></a-input>
      </a-form-item>
      <a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 19 }" label="仓库名称">
        <a-input v-decorator="['name',{rules: [{ required: true, message: '请填写仓库名称' }]}]"></a-input>
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
  props: {
    msg: {
      default: null
    }
  },
  data() {
    return {
      addPerson: false,
      radioValue: true,
      form: this.$form.createForm(this),
      options: [
        { label: "启用", value: true },
        { label: "禁用", value: false }
      ],
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
      this.$emit("editModal", false);
      this.personName = [];
      //   this.getNum();
    },
    toSave() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let data = {
            warehouseId: this.msg,
            code: values.code,
            clerkIds: this.personName.map(item => item.id),
            isAvailable: this.radioValue,
            name: values.name,
            phone: values.phone
          };
          this.Axios(
            {
              url: "/api-warehouse/warehouse/update",
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
                this.quxiao();
              }
            },
            ({ type, info }) => {}
          );
        }
      });
    },
    findOne() {
      this.Axios(
        {
          url: "/api-warehouse/warehouse/findOne/" + this.msg,
          params: {},
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.personName = result.data.data.warehouseAdmins.map(item => {
              return {
                ...item,
                id: item.employeeId,
                userName: item.employeeName
              };
            });
            this.radioValue = result.data.data.isAvailable;
            setTimeout(() => {
              this.form.setFieldsValue({
                code: result.data.data.warehouseCode,
                name: result.data.data.name,
                phone: result.data.data.phone,
                personName: result.data.data.isAvailable
              });
            }, 100);
          }
        },
        ({ type, info }) => {}
      );
    }
  },
  created() {
    this.findOne();
  },
  components: {
    addperson
  }
};
</script>