<template>
  <div class="addDesign">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="基础信息" key="1">
        <a-form :form="form">
          <a-row>
            <a-form-item label="关联订单" :labelCol="{span:3}" :wrapperCol="{span:18}" required>
              <!-- <a-select
            showSearch
            placeholder="请选择"
            style="width: 100%"
            :defaultActiveFirstOption="false"
            :notFoundContent="null"
          >
            <a-select-option
              v-for="i in 25"
              :key="(i + 9).toString(36) + i"
            >{{(i + 9).toString(36) + i}}</a-select-option>
              </a-select>-->
              <a-input
                v-decorator="[
							'workOrderNo',
							{rules: [{ required: true, message: '请填写关联订单' }]}
							]"
              ></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="项目名称" :labelCol="{span:3}" :wrapperCol="{span:18}" required>
              <a-input
                v-decorator="[
							'projectName',
							{rules: [{ required: true, message: '请填写项目名称' }]}
							]"
              ></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="部件名称" :labelCol="{span:3}" :wrapperCol="{span:18}" required>
              <a-input
                v-decorator="[
							'partName',
							{rules: [{ required: true, message: '请填写部件名称' }]}
							]"
              ></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="图号" :labelCol="{span:3}" :wrapperCol="{span:18}">
              <a-input v-decorator="['bomDrawingNo']"></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="需求数量" :labelCol="{span:3}" :wrapperCol="{span:18}">
              <a-input v-decorator="['number']"></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="备注" :labelCol="{span:3}" :wrapperCol="{span:18}">
              <a-textarea :rows="4" :autosize="{ minRows: 4, maxRows: 4 }" v-decorator="['remake']"></a-textarea>
            </a-form-item>
          </a-row>
        </a-form>
      </a-tab-pane>
      <a-tab-pane tab="Bom" key="2" style="margin-bottom: 20px">
        <a-row>
          <a-col style="text-align: right; margin-bottom: 10px">
            <a-button @click="addVisible=true">导入BOM</a-button>
          </a-col>
          <a-table :columns="columns" :dataSource="data" :scroll="{ x: 1900, y: 400 }" :pagination="false"></a-table>
          <a-pagination
          style="padding-top:12px;text-align: right;"
          size= 'small'
          :total="30"
          showQuickJumper
          showSizeChanger
          :pageSizeOptions="['10','20','50','100']"
          :showTotal="total => `共 ${total} 条`"
        ></a-pagination>
        </a-row>
      </a-tab-pane>
    </a-tabs>
    <a-row>
      <a-form-item :wrapper-col="{ span: 22,offset: 2 }" style="text-align:right">
        <a-button @click="closeAdd" style="margin-right:12px;">关闭</a-button>
        <a-button type="primary" @click="addDesign()">提交</a-button>
      </a-form-item>
    </a-row>
    <a-modal
			title="导入提示"
			:footer="null"
			width="420px"
			:visible="addVisible"
			@cancel="addVisible=false"
      @ok="addVisible=false"
			:maskClosable="false"
		>
			<div>
				导入步骤：
				<br />1、下载模板
				<a href="#">《BOM模板.xlsx》</a>；
				<br />2、按格式要求填写，请勿模板修改结构；
				<br />3、点击下方“选择文件”按钮导入数据；
				<br />4、校对并保存数据。
				<br />
				<span style="color:#f00">提示：重复导入时，已经有数据将会被清空。</span>
			</div>
			<div style="padding-top:12px; text-align: right">
				<a-upload
					:multiple="true"
					:fileList="fileList"
					:showUploadList="false"
				>
					<a-button type="primary">
						<a-icon type="upload" />选择文件
					</a-button>
				</a-upload>
			</div>
		</a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "图号",
    dataIndex: "drawId",
    key: "drawId",
    // fixed: "left",
    width: 150
  },
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: 150
  },
  {
    title: "装入部件号",
    dataIndex: "address",
    key: "1",
    width: 150
  },
  {
    title: "组件中零件数量",
    dataIndex: "address",
    key: "2",
    width: 150
  },
  {
    title: "单机中零件数量",
    dataIndex: "address",
    key: "3",
    width: 150
  },
  {
    title: "需求总数量",
    dataIndex: "address",
    key: "4",
    width: 150
  },
  {
    title: "装入整件号",
    dataIndex: "address",
    key: "5",
    width: 150
  },
  {
    title: "领料单位",
    dataIndex: "address",
    key: "6",
    width: 150
  },
  {
    title: "备注",
    dataIndex: "address",
    key: "7",
    width: 150
  },
  {
    title: "零件类别",
    dataIndex: "address",
    key: "8",
    width: 150
  },
  {
    title: "指定品牌",
    dataIndex: "address",
    key: "9",
    width: 150
  },
  {
    title: "设计师",
    dataIndex: "address",
    key: "10",
    width: 150
  }
];
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    drawId: `GB/T889.1-2000 ${i}`,
    name: "锁紧螺母M6",
    address: `London Park no. ${i}`
  });
}
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      orderNo: "",
      data,
      columns,
      addVisible: false,
      filelist: []
    };
  },
  methods: {
    closeAdd() {
      this.$emit("changeAddOrder", false);
    },
    addDesign() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          // if (!this.checkedKeys.length) {
          // 	this.$message.error("请分配角色权限");
          // 	return false;
          // }
          let qs = require("qs");
          let data = {
            id: values.id,
            workOrderId: values.workOrderId,
            workOrderNo: values.linkPhone,
            projectName: values.projectName,
            bomDrawingNo: values.bomDrawingNo,
            partName: values.partName,
            number: values.number,
            remake: values.remake
          };
          console.log(data);

          this.Axios(
            {
              url: "/api-order/bom/add",
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
                this.closeAdd();
              }
            },
            ({ type, info }) => {}
          );
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
</style>