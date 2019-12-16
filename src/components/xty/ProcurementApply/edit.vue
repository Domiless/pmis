<template>
  <div class="editApply">
    <a-tabs v-model="activeKey">
      <a-tab-pane tab="基础信息" key="1">
        <a-form :form="form">
          <a-row>
            <a-form-item label="采购单号" :labelCol="{span:3}" :wrapperCol="{span:18}" required>
              <a-input
                v-decorator="['procurementNo',{rules: [{ required: true, message: '请填写采购单号' }]}]"
              ></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="项目订单编号" :labelCol="{span:3}" :wrapperCol="{span:18}" required>
              <a-input
                v-decorator="['orderNo',{rules: [{ required: true, message: '请填写项目订单编号' }]}]"
              ></a-input>
            </a-form-item>
            <a-form-item label="标题" :labelCol="{span:3}" :wrapperCol="{span:18}" required>
              <a-input
                v-decorator="['title',{rules: [{ required: true, message: '请填写标题' }]}]"
              ></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="项目名称" :labelCol="{span:3}" :wrapperCol="{span:18}" required>
              <a-input
                v-decorator="['name',{rules: [{ required: true, message: '请填写项目名称' }]}]"
              ></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="业务归口部门" :labelCol="{span:3}" :wrapperCol="{span:18}">
              <a-input
                v-decorator="['department',{rules: [{ required: true, message: '请填写业务归口部门' }]}]"
              ></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="提采日期" :labelCol="{span:3}" :wrapperCol="{span:18}">
              <a-date-picker 
                  style="width:100%;"
                  @change="onChangeSign" 
                  v-decorator="['stockDate',{rules: [{ required: true, message: '请选择提采日期' }]}]" 
                  format="YYYY/MM/DD"/>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="编号" :labelCol="{span:3}" :wrapperCol="{span:18}">
              <a-input
                v-decorator="['number',{rules: [{ required: true, message: '请填写编号' }]}]"
              ></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="申请人" :labelCol="{span:3}" :wrapperCol="{span:18}">
              <a-input
                v-decorator="['applicant',{rules: [{ required: true, message: '请填写申请人' }]}]"
              ></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="制单人" :labelCol="{span:3}" :wrapperCol="{span:18}">
              <a-input
                v-decorator="['processer',{rules: [{ required: true, message: '请填写制单人' }]}]"
              ></a-input>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item label="备注" :labelCol="{span:3}" :wrapperCol="{span:18}">
              <a-textarea :rows="4" :autosize="{ minRows: 4, maxRows: 4 }" v-decorator="['remake']"></a-textarea>
            </a-form-item>
          </a-row>
        </a-form>
      </a-tab-pane>
      <a-tab-pane tab="采购明细" key="2" style="margin-bottom: 20px">
        <a-row>
          <a-col style="text-align: right; margin-bottom: 10px">
            <a-button @click="addVisible=true" type="primary">批量导入</a-button>
          </a-col>
          <a-table
            :columns="columns"
            :dataSource="data"
            :scroll="{ x: 1900, y: 400 }"
            :pagination="false"
          >
            <template slot="index" slot-scope="text, record, index">
              <span>{{index+1}}</span>
            </template>
          </a-table>
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
        <br />1、下载excel模板
        <a href="http://114.116.238.150/model/BOM.xlsx">《外购物资需求表.xls》</a>；
        <br />2、按格式要求填写excel，请勿模板修改结构；
        <br />3、点击下方“选择文件”按钮导入数据；
        <br />4、校对并保存数据。
        <br />
        <span style="color:#f00">提示：重复导入时，已经有数据将会被清空。</span>
      </div>
      <div style="padding-top:12px; text-align: right">
        <a-upload
          :action="ApiSrc()"
          :headers="headers"
          :multiple="true"
          :fileList="fileList"
          :showUploadList="false"
          @change="handleChangeUpload"
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
import moment from "moment";
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    scopedSlots: { customRender: "index" },
    align: "center",
    // fixed: "left",
    width: 50
  },
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: 150
  },
  {
    title: "型号/规格",
    dataIndex: "partCat",
    key: "partCat",
    width: 150
  },
  {
    title: "计量单位",
    dataIndex: "unit",
    key: "unit",
    width: 150
  },
  {
    title: "需求数量",
    dataIndex: "addNum",
    key: "addNum",
    width: 150
  },
  {
    title: "推荐厂家",
    dataIndex: "adviseBrand",
    key: "adviseBrand",
    width: 150
  },
  {
    title: "指定厂家",
    dataIndex: "brand",
    key: "brand",
    width: 150
  },
  {
    title: "要求到货时间",
    dataIndex: "arrivalTime",
    key: "arrivalTime",
    width: 150
  },
  {
    title: "备注",
    dataIndex: "remake",
    key: "remake",
    width: 150
  }
];
export default {
  props: {
    procurementId: {
      default: {}
    }
  },
  data() {
    return {
      activeKey: "1",
      orderListValue: [],
      form: this.$form.createForm(this),
      orderNo: "",
      data: [],
      columns,
      addVisible: false,
      fileList: [],
      headers: {
        Authorization: "bearer " + sessionStorage.getItem("token")
        // encType: "multipart/form-data"
      },
      signDate: '',
      detailsMsg: []
    };
  },
  methods: {
    onChangeSign(data,dateString) {
        this.signDate = dateString;
        console.log(this.signDate);
    },
    chickNumber(rule, value, callback) {
      if (
        /^\+?[1-9]\d*$/.test(value) == false &&
        value != "" &&
        value != null
      ) {
        callback(new Error("只能输入大于0的整数"));
      } else {
        callback();
      }
    },
    onSearch() {
      this.Axios(
        {
          url: "/api-order/supplier/getNo",
          type: "get",
          params: {
            num: "SJ"
          },
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            setTimeout(() => {
              this.form.setFieldsValue({
                designNo: result.data.data
              });
            }, 100);
          }
        },
        ({ type, info }) => {}
      );
    },
    handleChangeUpload(info) {
      console.log(info.file);
      info.fileList = info.fileList.slice(-1);
      this.fileList = info.fileList;
      if (info.file.response.code === 200) {
        this.$message.success("上传成功！");
        // console.log(info);
        this.data = info.fileList[0].response.data;
        console.log(this.data);
        this.addVisible = false;
      } else {
        this.$message.error(info.file.response.msg);
      }
    },
    ApiSrc() {
      return this.global.apiSrc + "/api-order/bom/resolvezc";
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    closeAdd() {
      this.getList();
      this.form.resetFields();
      this.data = [];
      this.$emit("changeAddOrder", false);
    },
    addDesign() {
      if (Object.keys(this.data).length == 0) {
        this.$message.error(`请导入BOM！`);
      } else {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log("Received values of form: ", values);
            // if (!this.checkedKeys.length) {
            // 	this.$message.error("请分配角色权限");
            // 	return false;
            // }
            let qs = require("qs");
            let data = {
              id: this.procurementId,
              bomNo: values.procurementNo,
              maker: values.processer,
              no: values.number,
              production: values.applicant,
              projectName: values.name,
              raisedate: this.signDate,
              relevant: values.department,
              remake: values.remake,
              title: values.title,
              workOrderNo: values.orderNo,
              bomZhiExcelDTOS: this.data
            };
            console.log(data);

            this.Axios(
              {
                url: "/api-order/bom/zcupdate",
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
                  this.closeAdd();
                  this.form.resetFields();
                  this.data = [];
                  this.activeKey = "1";
                }
              },
              ({ type, info }) => {}
            );
          }
        });
      }
    },
    getList() {
      this.Axios(
        {
          url: "/api-order/order/getOrderList",
          type: "get",
          params: {
            page: 1,
            size: -1,
            reviewState: 3
          },
          option: { enableMsg: false }
        },
        this
      ).then(
        result => {
          if (result.data.code === 200) {
            console.log(result);
            this.orderListValue = result.data.data;
          }
        },
        ({ type, info }) => {}
      );
    },
    findOne(id) {
			this.Axios(
				{
					url: '/api-order/bom/findone',
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
            this.detailsMsg = result.data.data;
            this.signDate = this.detailsMsg.raisedate;
            setTimeout(()=> {
              this.form.setFieldsValue({
                procurementNo: this.detailsMsg.bomNo,
                orderNo: this.detailsMsg.workOrderNo,
                title: this.detailsMsg.title,
                name: this.detailsMsg.projectName,
                department: this.detailsMsg.relevant,
                stockDate: this.detailsMsg.raisedate == null ? undefined : moment(
                  this.detailsMsg.raisedate,
                  "YYYY/MM/DD"
                ),
                number: this.detailsMsg.no,
                applicant: this.detailsMsg.production,
                processer: this.detailsMsg.maker,
                remake: this.detailsMsg.remake
                });
                this.data = this.detailsMsg.bomDes
            },100)
					}
				},
				({ type, info }) => {}
			);
    }
  },
  created() {
    // this.getList();
    this.findOne(this.procurementId);
  }
};
</script>
<style lang="less" scoped>
</style>