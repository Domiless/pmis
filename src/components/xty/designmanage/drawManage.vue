<template>
  <div class="drawManage">
    <a-row>
      <a-col :span="12">
        <a-button @click="addVisible=true">
          <a-icon style="color:#1890ff;" type="plus" />新增
        </a-button>
        <a-button>
          <a-icon style="color:#1890ff;" type="edit" />修改
        </a-button>
        <a-button>
          <a-icon style="color:#1890ff;" type="delete" />删除
        </a-button>
      </a-col>
      <a-col :span="12" style="text-align: right">
        <!-- <a-select
          showSearch
          placeholder="图纸号/图纸名称"
          optionFilterProp="children"
          style="width: 200px"
          :filterOption="filterOption"
        >
        </a-select>-->
        <a-input type="text" style="width:300px" placeholder="图纸号/图纸名称"></a-input>
        <a-button type="primary">查询</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-table :columns="columns" :dataSource="data" :rowSelection="rowSelection"></a-table>
    </a-row>
    <a-row>
      <a-pagination
        style="padding-top:12px;text-align: right;"
        :total="30"
        showQuickJumper
        showSizeChanger
        :pageSizeOptions="['10','20','30']"
        :showTotal="total => `共 ${total} 条`"
      ></a-pagination>
    </a-row>
    <a-modal title="新增" v-model="addVisible" width="1000px">
      <a-form :form="form">
        <a-row>
          <a-col :span="8">
            <a-form-item label="图纸号" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }" required>
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="图纸名称" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }" required>
              <a-input></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="录入人" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
              <a-input></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-form-item label="备注" :labelCol="{ span: 2}" :wrapperCol="{ span: 21}">
            <a-textarea :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item label="图纸图片" :labelCol="{ span: 2}" :wrapperCol="{ span: 21}">
            <a-upload
              name="picpurefile"
              :multiple="true"
              listType="picture"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            >
              <a-button>
                <a-icon type="upload" />upload
              </a-button>
            </a-upload>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item label="图纸源文件" :labelCol="{ span: 2}" :wrapperCol="{ span: 21}">
            <a-upload
              name="drawfile"
              :multiple="true"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            >
              <a-button>
                <a-icon type="upload" />选择文件
              </a-button>
            </a-upload>
          </a-form-item>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "drawNum",
    title: "图纸号",
    key: "drawNum",
    width: "20%"
  },
  {
    dataIndex: "drawName",
    title: "图纸名称",
    key: "drawName",
    width: "25%"
  },
  {
    dataIndex: "operator",
    title: "录入人",
    key: "operator",
    width: "15%"
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark",
    width: "25%"
  },
  {
    dataIndex: "createTime",
    title: "创建时间",
    key: "createTime",
    width: "15%"
  }
];
export default {
  data() {
    return {
      columns,
      data: [],
      addVisible: false,
      form: this.$form.createForm(this)
    };
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === "Disabled User",
            name: record.name
          }
        })
      };
    }
  }
};
</script>
<style lang="less" scoped>
.drawManage {
  .ant-row:nth-child(1) {
    margin-bottom: 30px;
  }
}
</style>