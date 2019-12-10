<template>
  <div class="market_add">
    <a-col :span="24" style="padding:0 20px;">
      <a-row>
        <div style="line-height:50px;">
          <a-col :span="15">
            <a-button @click="$router.back(-1)" icon="left" style="margin-right:20px;">返回</a-button>
          </a-col>
        </div>
      </a-row>
      <a-form style="padding-top:10px;" :form="form">
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="单据类型">
          <a-select
            v-decorator="['type',{rules: [{ required: true, message: '请选择单据类型' }]}]"
            style="width: 100%"
            placeholder="请选择"
          >
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="单据编号">
          <a-input
            v-decorator="['type',{rules: [{ required: true, message: '请填写单据编号' }]}]"
            autocomplete="off"
            maxlength="20"
          ></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="销售合同号">
          <a-input v-decorator="['bumen']" autocomplete="off" maxlength="20"></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="客户名称">
          <a-input
            v-decorator="['yuanyin',{rules: [{ required: true, message: '请填写领用原因' }]}]"
            autocomplete="off"
            maxlength="20"
          ></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="联系人">
          <a-input v-decorator="['yuanyin']" autocomplete="off" maxlength="20"></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="联系电话">
          <a-input v-decorator="['yuanyin']" autocomplete="off" maxlength="20"></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="出货仓库">
          <a-select
            v-decorator="['cangku',{rules: [{ required: true, message: '请选择出货仓库' }]}]"
            style="width: 100%"
            placeholder="请选择"
          >
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="出库日期">
          <a-date-picker v-decorator="['riqi']" @change="onDateChange" style="width:100%;" />
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="经办人">
          <a-input
            v-decorator="['jingbanren',{rules: [{ required: true, message: '请填写经办人' }]}]"
            autocomplete="off"
            maxlength="20"
          ></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="制单人">
          <a-input v-decorator="['zhidanren']" autocomplete="off" disabled></a-input>
        </a-form-item>
        <a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="备注">
          <a-textarea
            maxlength="50"
            v-decorator="['remark']"
            style="width:100%;"
            :autosize="{ minRows: 4, maxRows: 4 }"
          ></a-textarea>
        </a-form-item>
        <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id">
          <span slot="shuliangTitle">
            <span style="color: #f5222d">*</span>数量
          </span>
          <template slot="xuanzewuliao" slot-scope="text, record, index">
            <div class="choice">
              <span style="color:#1890FF;cursor: pointer;">
                <i class="iconfont" style="margin-right:8px;">&#xe647;</i>选择
              </span>
            </div>
          </template>
          <template slot="xuhao" slot-scope="text, record, index">
            <span>{{index+1}}</span>
          </template>
          <template slot="shuliang" slot-scope="text, record, index">
            <a-input
              type="number"
              oninput="if(value.length>10)value=value.slice(0,10)"
              :value="text"
              @change="(e)=>handleInputChange(e.target.value, record.id, 'shuliang')"
            ></a-input>
          </template>
          <template slot="beizhu" slot-scope="text, record, index">
            <a-input
              maxlength="50"
              :value="text"
              @change="(e)=>handleInputChange(e.target.value, record.id, 'beizhu')"
            ></a-input>
          </template>
          <template slot="caozuo" slot-scope="text, record, index">
            <a-popover placement="top">
              <template slot="content">
                <span>删除</span>
              </template>
              <permission-button
                permCode
                banType="disabled"
                class="button_text btn_disabled"
                @click="delRow(record,index)"
              >
                <a-icon type="delete" style="color:red;" />
              </permission-button>
            </a-popover>
          </template>
        </a-table>
        <div style="padding:12px 0;">
          <a style="color:#1890FF;cursor: pointer;" href="javascript:" @click="choiceModalShow()">
            <a-icon type="plus" style="font-size:18px;margin-right:8px;" />添加
          </a>
        </div>
        <a-form-item style="display:block;margin-bottom:0;">
          <!-- <a-button style="margin-right:12px;">取消</a-button> -->
          <a-button type="primary">保存</a-button>
        </a-form-item>
      </a-form>
    </a-col>
    <a-modal
      title="选择物料"
      v-model="choiceShow"
      :footer="null"
      :destroyOnClose="true"
      :mask="false"
      :closable="true"
      width="800px"
      centered
    >
      <materialList v-on:choisceMsg="choisceMsg"></materialList>
    </a-modal>
  </div>
</template>
<script>
import materialList from "../../../public/materialList";
const columns = [
  {
    dataIndex: "index",
    key: "index",
    title: "",
    width: 40,
    scopedSlots: { customRender: "xuhao" },
    align: "center"
  },
  // {
  //   dataIndex: "xuanzewuliao",
  //   key: "xuanzewuliao",
  //   title: "选择物料",
  //   width: 80,
  //   scopedSlots: { customRender: "xuanzewuliao" }
  // },
  {
    dataIndex: "wuliaobianma",
    key: "wuliaobianma",
    title: "物料编码",
    width: 120
  },
  {
    dataIndex: "tuhao",
    key: "tuhao",
    title: "图号",
    width: 180
  },
  {
    dataIndex: "mingcheng",
    key: "mingcheng",
    title: "名称",
    width: 180
  },
  {
    dataIndex: "xinghaoguige",
    key: "xinghaoguige",
    title: "型号/规格",
    width: 140
  },
  {
    dataIndex: "danwei",
    key: "danwei",
    title: "单位",
    width: 80
  },
  {
    dataIndex: "kucunshuliang",
    key: "kucunshuliang",
    title: "库存数量",
    width: 100
  },
  {
    dataIndex: "shuliang",
    key: "shuliang",
    // title: "数量",
    width: 120,
    scopedSlots: { customRender: "shuliang" },
    slots: { title: "shuliangTitle" }
  },
  {
    dataIndex: "wuliaofenlei",
    key: "wuliaofenlei",
    title: "物料分类",
    width: 100
  },
  {
    dataIndex: "beizhu",
    key: "beizhu",
    title: "备注",
    width: 200,
    scopedSlots: { customRender: "beizhu" }
  },
  {
    dataIndex: "caozuo",
    key: "caozuo",
    title: "操作",
    width: 60,
    scopedSlots: { customRender: "caozuo" },
    align: "center"
  }
];
import { log } from "util";
export default {
  data() {
    return {
      choiceShow: false,
      form: this.$form.createForm(this),
      columns,
      data: [{ wuliaobianma: 11, shuliang: 111, id: 23 }]
    };
  },
  methods: {
    delRow(row, index) {
      console.log(index);
      this.data.splice(index, 1);
    },
    choisceMsg(a) {
      console.log(a);
      // this.choiceShow = false;
      if (
        this.data.find(item => {
          return item.id == a.id;
        })
      ) {
        this.$message.error(`该条数据已被选择`);
        return false;
      }
      this.data.push(a);
    },
    handleInputChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    onDateChange(a, b) {
      console.log(a, b);
    },
    choiceModalShow(index) {
      console.log(index);
      this.choiceShow = true;
    }
  },
  created() {},
  components: {
    materialList
  }
};
</script>
<style lang="less">
.market_add {
  overflow: hidden;
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 4px 4px;
  }
  .choice {
    position: relative;
    // .choice_show_style {
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    // }
  }
}
</style>