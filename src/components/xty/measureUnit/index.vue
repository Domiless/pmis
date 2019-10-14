<template>
  <div class="measureUnit">
    <a-row style="line-height:50px;">
      <permission-button permCode banType="hide" @click="addVisible=true">
        <a-icon style="color:#1890ff;" type="plus" />新增
      </permission-button>
      <permission-button permCode banType="hide" @click="editVisible=true" :disabled="selectedRowKeys.length!=1">
        <a-icon style="color:#1890ff;" type="edit" />修改
      </permission-button>
      <permission-button permCode banType="hide" @click="showDeleteConfirm" :disabled="selectedRowKeys.length==0">
        <a-icon style="color:#1890ff;" type="delete" />删除
      </permission-button>
    </a-row>
    <a-row>
      <a-table
        rowKey="id"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
      ></a-table>
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
    <a-modal
      title="新增"
      v-model="addVisible"
      :maskClosable="false"
      width="500px"
      @cancel="handleCancel(1)"
    >
      <a-form :form="form">
        <a-form-item label="计量单位" :labelCol="{span:5}" :wrapperCol="{span:17}" required>
          <a-input
            v-decorator="['measureUnit', { rules: [{ required:'true', message: '请填写计量单位'}]}]"
          ></a-input>
        </a-form-item>
        <a-form-item label="备注" :labelCol="{span:5}" :wrapperCol="{span:17}">
          <a-textarea v-decorator="['remark']" :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="修改"
      v-model="editVisible"
      :maskClosable="false"
      width="500px"
      @cancel="handleCancel(2)"
    >
      <a-form :form="form">
        <a-form-item label="计量单位" :labelCol="{span:5}" :wrapperCol="{span:17}" required>
          <a-input
            v-decorator="['measureUnit', { rules: [{ required:'true', message: '请填写计量单位'}]}]"
          ></a-input>
        </a-form-item>
        <a-form-item label="备注" :labelCol="{span:5}" :wrapperCol="{span:17}">
          <a-textarea v-decorator="['remark']" :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "measureUnit",
    title: "计量单位",
    key: "measureUnit",
    width: "60%"
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark",
    width: "40%"
  }
];
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      columns,
      data: [],
      selectedRowKeys: [],
      addVisible: false,
      editVisible: false,
      current: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    onChange(current, pageNumber) {
      console.log("Page: ", pageNumber);
      console.log("第几页: ", current);
      this.current = current;
      this.getList();
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getList();
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      console.log(this.selectedRowKeys);
    },
    handleCancel(num) {
      if (num == 1) {
        this.addVisible = false;
      } else {
        this.editVisible = false;
      }
    },
    onDelete(e) {
      console.log(this.selectedRowKeys);
      let qs = require("qs");
      let data = qs.stringify({
        orderIds: this.selectedRowKeys.join(",")
      });
      this.Axios(
        {
          url: "/api-order/order/delOrder",
          params: data,
          type: "post",
          option: { successMsg: "删除成功！" }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.getList();
            this.selectedRowKeys = [];
          }
        },
        ({ type, info }) => {}
      );
    },
    showDeleteConfirm() {
      let that = this;
      this.$confirm({
        title: "确定删除吗？",
        content: "",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: function() {
          that.onDelete();
        },
        onCancel() {}
      });
    }
  }
};
</script>
<style lang="less" scoped>
.measureUnit {
  padding: 0 20px;
  .ant-row:nth-child(1) {
    margin-bottom: 10px;
  }
  .ant-row:nth-child(2) {
    margin-bottom: 10px;
  }
}
</style>