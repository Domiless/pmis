<template>
  <div class="supplierManage">
    <a-row>
      <a-button @click="addVisible=true">
        <a-icon style="color:#1890ff;" type="plus" />新增
      </a-button>
      <a-button>
        <a-icon style="color:#1890ff;" type="edit" />修改
      </a-button>
      <a-button>
        <a-icon style="color:#1890ff;" type="delete" />删除
      </a-button>
    </a-row>
    <a-row>
      <a-table :columns="columns" :dataSource="data" :rowSelection="rowSelection"></a-table>
    </a-row>
    <a-row>
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
    <a-modal title="新增" v-model="addVisible" width="800px" okText="保存">
      <a-form :form="form">
        <a-row>
          <a-form-item label="供应商编码" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
            <a-input
							v-decorator="[
							'id',
							{rules: [{ required: true, message: '请填写供应商编码' }]}
							]"
						></a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item label="供应商名称" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}" required>
            <a-input
							v-decorator="[
							'supplierName',
							{rules: [{ required: true, message: '请填写供应商名称' }]}
							]"
						></a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item label="联系人" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}" required>
            <a-input
							v-decorator="[
							'linkman',
							{rules: [{ required: true, message: '请填写联系人' }]}
							]"
						></a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item label="联系电话" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}" required>
            <a-input
							v-decorator="[
							'linkPhone',
							{rules: [{ required: true, message: '请填写联系电话' }]}
							]"
						></a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="地址" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
              <a-row type="flex" justify="space-between">
                <a-col :span="7">
                  <a-select
                    showSearch
                    placeholder="请选择"
                    style="width: 100%"
                    :defaultActiveFirstOption="false"
                    :notFoundContent="null"
                    :showArrow="false"
                  >
                    <a-select-option
                      v-for="i in 25"
                      :key="(i + 9).toString(36) + i"
                    >{{(i + 9).toString(36) + i}}</a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="7">
                  <a-select
                    showSearch
                    placeholder="请选择"
                    style="width: 100%"
                    :defaultActiveFirstOption="false"
                    :notFoundContent="null"
                    :showArrow="false"
                  >
                    <a-select-option
                      v-for="i in 25"
                      :key="(i + 9).toString(36) + i"
                    >{{(i + 9).toString(36) + i}}</a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="7">
                  <a-select
                    showSearch
                    placeholder="请选择"
                    style="width: 100%"
                    :defaultActiveFirstOption="false"
                    :notFoundContent="null"
                    :showArrow="false"
                  >
                    <a-select-option
                      v-for="i in 25"
                      :key="(i + 9).toString(36) + i"
                    >{{(i + 9).toString(36) + i}}</a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
          <a-col :span="24" :offset="4">
            <a-form-item :wrapperCol="{ span: 18}">
              <a-input placeholder="详细地址"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-form-item label="电子邮箱" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
            <a-input v-decorator="['email']"></a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item label="备注" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
            <a-textarea v-decorator="['remark']" :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
          </a-form-item>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "id",
    title: "供应商编码",
    key: "id",
    width: "15%"
  },
  {
    dataIndex: "supplierName",
    title: "供应商名称",
    key: "supplierName",
    width: "25%"
  },
  {
    dataIndex: "linkman",
    title: "联系人",
    key: "linkman",
    width: "15%"
  },
  {
    dataIndex: "linkPhone",
    title: "联系电话",
    key: "linkPhone",
    width: "15%"
  },
  {
    dataIndex: "remark",
    title: "备注",
    key: "remark",
    width: "15%"
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
      form: this.$form.createForm(this),
      current: 1,
			pageSize: 10,
			total: 0,
    };
  },
  methods: {
    onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			this.getList();
		},
		onChange(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
			this.getList();
    },
    getList() {
			this.Axios(
				{
					url: "/list",
          type: "get",
         	params: {
						// page: this.current,
            // size: this.pageSize,
            // state: this.state,
						// startTime: this.startTime != "" ? this.startTime : null,
						// endTime: this.endTime != "" ? this.endTime : null
					},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.data = result.data.data.content;
            this.total = result.data.data.totalElement;
					}
				},
				({ type, info }) => {}
			);
    },
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
.supplierManage {
  .ant-row:nth-child(1) {
    margin-bottom: 30px;
  }
}
</style>