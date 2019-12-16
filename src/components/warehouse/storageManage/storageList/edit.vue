<template>
  <div class="editStorageList">
    <a-form :form="form">
      <a-form-item label="物料编码" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
        <span>{{ defaultMsg.code }}</span>
      </a-form-item>
      <a-form-item label="图号" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
        <span>{{ defaultMsg.drawingCode }}</span>
      </a-form-item>
      <a-form-item label="名称" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
        <span>{{ defaultMsg.name }}</span>
      </a-form-item>
      <a-form-item label="单位" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
        <a-select
          style="width: 100%"
          v-decorator="['unit',{rules: [{ required: true, message: '请选择单位' }]}]"
        >
          <a-select-option v-for="item in unitArr" :value="item.name" :key="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="物料分类" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
        <a-tree-select
          v-decorator="['category']"
          allowClear
          style="width: 100%"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="treeData"
          placeholder="请选择"
          treeDefaultExpandAll
        ></a-tree-select>
      </a-form-item>
      <a-form-item label="仓库" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
        <span>{{ warehouseName }}</span>
      </a-form-item>
      <a-form-item label="库存数量" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
        <span>{{ defaultMsg.amount }}</span>
      </a-form-item>
      <a-form-item label="物料下限" :labelCol="{ span: 3}" :wrapperCol="{ span: 19 }">
        <a-input v-decorator="['floor']"></a-input>
      </a-form-item>
      <a-form-item label="备注" :labelCol="{span:3}" :wrapperCol="{span:19}">
        <a-textarea v-decorator="['remark']" :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align:right">
        <a-button style="margin-right:12px;" @click="close">关闭</a-button>
        <a-button type="primary" @click="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
export default {
  props: {
    sendId: {
      default: ""
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      defaultMsg: [],
      unitArr: [],
      treeData: [],
      warehouseName: ""
    };
  },
  methods: {
    close() {
      this.form.resetFields();
      this.$emit('cancelEdit',false);
    },
    getWarehouseUnit(id) {
      this.Axios(
        {
          url: "/api-order/unit/list",
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
            this.unitArr = result.data.data.content;
          }
        },
        ({ type, info }) => {}
      );
    },
    findOne(id) {
      this.Axios(
        {
          url: "/api-warehouse/warehouseItem/findOne",
          params: {
            warehouseItemId: id
          },
          type: "get",
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.defaultMsg = result.data.data;
            this.warehouseName = result.data.data.warehouse.name;
            this.form.setFieldsValue({
              unit: this.defaultMsg.unit,
              category: this.defaultMsg.classification.id,
              floor: this.defaultMsg.warningAmount,
              remark: this.defaultMsg.note
            });
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
    submit() {
      const that = this;
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log("Received values of form: ", values);
					// if (!this.checkedKeys.length) {
					// 	this.$message.error("请分配角色权限");
					// 	return false;
					// }
					let qs = require("qs");
					let data = {
            classifyId: values.category,
            note: values.remark,
            unit: values.unit,
            warningAmount: values.floor,
            warehouseItemId: this.sendId
          };
					console.log(data);
					this.Axios(
						{
							url: "/api-warehouse/warehouseItem/update",
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
                this.close();
								
							}
						},
						({ type, info }) => {}
					);
				}
      });
    },
  },
  created() {
    this.findOne(this.sendId);
    this.getWarehouseUnit(this.sendId);
    this.getClassifyList();
  }
};
</script>
<style lang="less">
.editStorageList {
}
</style>