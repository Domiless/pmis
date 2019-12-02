<template>
  <div class="editContractManage">
    <a-form :form="form">
      <a-form-item label="合同名称" :labelCol="{span:2}" :wrapperCol="{span:21}" required>
        <a-input v-decorator="['contractName', { rules: [{ required:'true', message: '请填写合同名称'}]}]"></a-input>
      </a-form-item>
      <a-form-item label="合同内容" :labelCol="{span:2}" :wrapperCol="{span:21}" style="margin-bottom: 0px">
        <editor v-on:tinymceValue="tinymceValue" :value="tinymceHtml"></editor>
			</a-form-item>
       <a-row>
        <a-col :span="24" :offset="2">
          <span style="color: #1890ff;cursor: pointer" @click="checkVariable">查看变量</span>
        </a-col>
      </a-row>
       <a-form-item :wrapper-col="{ span: 21,offset: 2 }" style="text-align:right"  class="btn">
        <a-button @click="confirmCancel" style="margin-right:12px;">关闭</a-button>
        <a-button type="primary" @click="editContract()">提交</a-button>
      </a-form-item>
    </a-form>
    <a-modal
      title="变量列表"
      v-model="showVisible"
			:maskClosable="false"
			width="800px"
			:footer="null"
			@cancel="showVisible = false"
      >
      <a-row>
       <a-col :span="12" style="margin-bottom:12px;" v-for="(item,i) in variableMsg" :key="i">
            <span class="label_right">{{item}}:</span>
            <span>{{variableVal[item]}}</span>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import editor from "../../public/Editor";
export default {
  props: {
    contractId: {
      default: ''
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      content: "",
      tinymceHtml: "",
      showVisible: false,
      variableMsg: [],
      variableVal: []
      
    };
  },
  methods: {
    checkVariable() {
      this.showVisible = true;
      this.Axios(
				{
					url: "/api-order/template/getReplace",
					type: "get",
					params: {},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
            console.log(result);
            this.variableVal = result.data.data;
            this.variableMsg = result.data.data;
            this.variableMsg = Object.keys(this.variableMsg);
					}
				},
				({ type, info }) => {}
			);
    },
		tinymceValue(value) {
			this.content = value;
			console.log(this.content);
    },
    confirmCancel() {
      this.$emit("changeEditContract", false);
      this.form.resetFields();
    },
    findOne(id) {
      let that = this;
			this.Axios(
				{
					url: '/api-order/template/findOne',
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
            let msg = result.data.data;
            this.tinymceHtml= msg.content;
            setTimeout(()=> {
              this.form.setFieldsValue({
                contractName: msg.title,
                
                });
            },100)
					}
				},
				({ type, info }) => {}
			);
		},
    editContract(){
      this.form.validateFieldsAndScroll((err, values) => {
        console.log(values);
        if (!err) {
          let qs = require("qs");
          let data = qs.stringify({
            id: this.contractId,
            title: values.contractName,
            content: this.content
          });
          console.log(data);
          this.Axios(
            {
              url: "/api-order/template/update",
              params: data,
              type: "post",
              option: { successMsg: "修改成功！" },
              // config: {
              //   headers: { "Content-Type": "application/json" }
              // }
            },
            this
          ).then(
            result => {
              if (result.data.code === 200) {
                console.log(result);
                this.confirmCancel();
                
              }
            },
            ({ type, info }) => {}
          );
        }
      });
    }
	},
  components: {
		editor
  },
  created() {
    this.findOne(this.contractId)
  },
  watch: {
    contractId() {
      if(this.contractId != '') {
        this.findOne(this.contractId)
      }
    }
  }
};
</script>
<style lang="less">
.editContractManage {
  .label_right{
      display: inline-block;
      width: 100px;
      text-align: right;
    }
  .btn {
    margin-bottom: 0px;
  }
  #mceu_901 {
    height: 580px;
  }
  .mce-edit-area.mce-container.mce-panel.mce-stack-layout-item {
    height: 580px;
  }
}
</style>