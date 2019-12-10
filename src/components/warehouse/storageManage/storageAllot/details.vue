<template>
    <div class="details">
        <a-row>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">单据类型：</span>
                <span></span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">单据编号：</span>
                <span></span>
            </a-col>
             <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">调出仓库：</span>
                <span></span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">调入仓库：</span>
                <span></span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">调拨日期：</span>
                <span></span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">经办人：</span>
                <span></span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">制单人：</span>
                <span></span>
            </a-col>
            <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">备注：</span>
                <span></span>
            </a-col>
        </a-row>
        <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id">
        </a-table>
    </div>
</template>
<script>
const columns = [
  {
    dataIndex: "index",
    key: "index",
    title: "",
    width: 40,
    scopedSlots: { customRender: "xuhao" },
    align: "center"
  },
  {
    dataIndex: "xuanzewuliao",
    key: "xuanzewuliao",
    title: "选择物料",
    width: 80,
    scopedSlots: { customRender: "xuanzewuliao" }
  },
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
    width: 140
  },
  {
    dataIndex: "mingcheng",
    key: "mingcheng",
    title: "名称",
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
    width: 160,
    scopedSlots: { customRender: "beizhu" }
  }
];
export default {
    props: {
        sendId: {
          default: ""
        }
      },
    data() {
        return {
            columns,
            data: [],
            detailsMsg: [],
            warehouseName: ''
        }
    },
    methods: {
      findOne(id) {
        this.Axios(
          {
            url: "/api-warehouse/transferItem/details",
            params: {
              transferItemId: id
            },
            type: "get",
            option: { enableMsg: false }
          },
          this
        ).then(
          result => {
            if (result.data.code === 200) {
              console.log(result);
              this.detailsMsg = result.data.data;
              this.data = result.data.data.orderItems;
              this.warehouseName = result.data.data.warehouse.name;
            }
          },
          ({ type, info }) => {}
        );
      }
    },
    created() {
      this.findOne(this.sendId);
    }
}
</script>
<style lang="less">
.details {
    .label_right {
        display: inline-block;
        width: 100px;
        text-align: right;
    }
}
</style>