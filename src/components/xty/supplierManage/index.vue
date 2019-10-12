<template>
  <div class="supplierManage">
    <a-row style="line-height:50px;">
      <a-button @click="showAdd">
        <a-icon style="color:#1890ff;" type="plus" />新增
      </a-button>
      <a-button @click="showEdit" :disabled="selectedRowKeys.length!=1">
        <a-icon style="color:#1890ff;" type="edit" />修改
      </a-button>
      <a-button @click="showDeleteConfirm" :disabled="selectedRowKeys.length<1">
        <a-icon style="color:#1890ff;" type="delete" />删除
      </a-button>
    </a-row>
    <a-row>
        <a-col :span="5">
          <span>日期 :</span>
          <a-date-picker style="width:120px"></a-date-picker>
          <span>~</span>
          <a-date-picker style="width: 120px"></a-date-picker>
        </a-col>
        <a-col :span="8">
          <span>关键词 :</span>
          <a-input placeholder="供应商编码/名称/联系人/电话" style="width: 250px"></a-input>
          <a-button>搜索</a-button>
        </a-col>
      </a-row>
    <a-row>
      <a-table
       rowKey="id"
       :columns="columns" 
       :dataSource="data" 
       :pagination="false"
       :rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
       >
       <a slot="supplierName" slot-scope="details" href="javascript:;" @click="sendDetails()">{{ details }}</a>
       </a-table>
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
    <a-modal title="新增" v-model="addVisible"   :footer="null" width="800px">
      <a-form :form="form">
        <a-row>
          <a-form-item label="供应商编码" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
            <a-input
							v-decorator="[
							'supplierNo',
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
                    @change="handleProvinceChange"
                    :defaultValue="provinceData[0]"
                  >
                    <a-select-option v-for="province in provinceData" :key="province">{{province}}</a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="7">
                  <a-select
                    showSearch
                    placeholder="请选择"
                    style="width: 100%"
                    :defaultActiveFirstOption="false"
                    :notFoundContent="null"
                    v-model="secondCity"
                    @change="handleCityChange"
                  >
                    <a-select-option v-for="city in cities" :key="city">{{city}}</a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="7">
                  <a-select
                    showSearch
                    placeholder="请选择"
                    style="width: 100%"
                    :defaultActiveFirstOption="false"
                    :notFoundContent="null"
                    v-model="thirdCity"
                  >
                    <a-select-option v-for="area in thirdCity" :key="area">{{area}}</a-select-option>
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
        <a-row>
          <a-form-item :wrapper-col="{ span: 20,offset: 2 }" style="text-align:right">
            <a-button @click="cancelAdd()" style="margin-right:12px;">关闭</a-button>
						<a-button type="primary" @click="addSupplier()">提交</a-button>
					</a-form-item>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal title="修改" v-model="editVisible"   :footer="null" width="800px">
      <a-form :form="form">
        <a-row>
          <a-form-item label="供应商编码" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
            <a-input
							v-decorator="[
							'supplierNo',
							{rules: [{ required: true, message: '请填写供应商编码' }]}
							]"
              disabled
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
        <a-row>
          <a-form-item :wrapper-col="{ span: 20,offset: 2 }" style="text-align:right">
            <a-button @click="editVisible=false" style="margin-right:12px;">关闭</a-button>
						<a-button type="primary" @click="updata()">提交</a-button>
					</a-form-item>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "supplierNo",
    title: "供应商编码",
    key: "supplierNo",
    width: "15%"
  },
  {
    dataIndex: "supplierName",
    title: "供应商名称",
    key: "supplierName",
    scopedSlots: { customRender: 'supplierName'},
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
    key: "remark"
  }
];
const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};
const areaData = {
  Hangzhou: ['xihu1', 'xihu2', 'xihu3']
}
export default {
  data() {
    return {
      columns,
      data: [],
      addVisible: false,
      editVisible: false,
      showDetails: false,
      form: this.$form.createForm(this),
      current: 1,
			pageSize: 10,
      total: 0,
      selectedRowKeys: [],
      provinceData,
      cityData,
      areaData,
      cities: cityData[provinceData[0]],
      secondCity: cityData[provinceData[0]][0],
      thirdCity: areaData[cityData[provinceData[0]][0]][0]

    };
  },
  methods: {
    handleProvinceChange(value) {
      this.cities = cityData[value]
      this.secondCity = cityData[value][0]
    },
    handleCityChange (value) {
      this.secondCity = cityData[value]
      this.thirdCity = areaData[value]
    },
    sendDetails() {
      this.showDetails = true;
    },
    showAdd(){
      this.addVisible = true;
      this.getNo();
      
    },
    showEdit(){
      this.editVisible = true;
      this.findOne(this.selectedRowKeys[0]);
      console.log(this.selectedRowKeys[0]);
    },
    cancelAdd(){
      this.addVisible = false;
      this.form.resetFields();
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
			console.log(this.selectedRowKeys);
		},
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
    addSupplier() {
      this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log("Received values of form: ", values);
					// if (!this.checkedKeys.length) {
					// 	this.$message.error("请分配角色权限");
					// 	return false;
					// }
					let qs = require("qs");
					let data = {
            supplierNo: values.supplierNo,
						supplierName: values.supplierName,
            linkman: values.linkman,
            linkPhone: values.linkPhone,
            address: values.address,
            email: values.email,
            remark: values.remark
          };
          console.log(data);

					this.Axios(
						{
							url: "/api-order/supplier/add",
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
                this.getList();
                this.addVisible = false;
							}
						},
						({ type, info }) => {}
					);
				}
			});
    },
    updata() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log("Received values of form: ", values);
					// if (!this.checkedKeys.length) {
					// 	this.$message.error("请分配角色权限");
					// 	return false;
					// }
          let qs = require("qs");
					let data = {
            id: this.selectedRowKeys[0],
						supplierName: values.supplierName,
            linkman: values.linkman,
            linkPhone: values.linkPhone,
            address: values.address,
            email: values.email,
            remark: values.remark
					};
					this.Axios(
						{
							url: "/api-order/supplier/update",
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
                this.getList();
								this.editVisible = false;
							}
						},
						({ type, info }) => {}
					);
				}
			});
    },
    getNo() {
			this.Axios(
				{
					url: "/api-order/supplier/getNo",
          type: "get",
         	params: {},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
            console.log(result);
            setTimeout(() => {
							this.form.setFieldsValue({
								supplierNo: result.data.data,
							});
						}, 100);
					}
				},
				({ type, info }) => {}
			);
    },
    getList() {
			this.Axios(
				{
					url: "/api-order/supplier/list",
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
    onDelete(e) {
      console.log("delete" + this.selectedRowKeys);
			let qs = require("qs");
			let data = qs.stringify({
				id: this.selectedRowKeys[0]
			});
			this.Axios(
				{
					url: "/api-order/supplier/delete",
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
    findOne(id) {
			this.Axios(
				{
					url: "/api-order/supplier/findone",
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
						console.log(result.data.data);
						setTimeout(() => {
							this.form.setFieldsValue({
								supplierNo: result.data.data.supplierNo,
								supplierName: result.data.data.supplierName,
								linkman: result.data.data.linkman,
								linkPhone: result.data.data.linkPhone,
                address: result.data.data.address,
                email: result.data.data.email,
								remark: result.data.data.remark
							});
						}, 100);
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
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="less" scoped>
.supplierManage {
  padding:0 20px;
  .ant-row:nth-child(1) {
    margin-bottom: 10px;
  }
  .ant-row:nth-child(2) {
    margin-bottom: 10px;
  }
}
</style>
