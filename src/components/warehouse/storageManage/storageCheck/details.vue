<template>
    <div class="details">
        <a-row>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">单据类型：</span>
                <span>{{ detailsMsg.type }}</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">单据编号：</span>
                <span>{{ detailsMsg.checkNo }}</span>
            </a-col>
             <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">盘点仓库：</span>
                <span>{{ warehouseName }}</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">盘点日期：</span>
                <span>{{ detailsMsg.checkDate }}</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">经办人：</span>
                <span>{{ detailsMsg.manager }}</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">制单人：</span>
                <span>{{ detailsMsg.createdBy }}</span>
            </a-col>
            <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">备注：</span>
                <span>{{ detailsMsg.remark }}</span>
            </a-col>
        </a-row>
        <a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="id">
          <template slot="index" slot-scope="text, record, index">
                <span>{{index+1}}</span>
          </template>
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
    scopedSlots: { customRender: "index" },
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
    dataIndex: "code",
    key: "code",
    title: "物料编码",
    width: 120
  },
  {
    dataIndex: "drawingNo",
    key: "drawingNo",
    title: "图号",
    width: 140
  },
  {
    dataIndex: "name",
    key: "name",
    title: "名称",
    width: 140
  },
  {
    dataIndex: "unitEntry",
    key: "unitEntry",
    title: "单位",
    width: 80
  },
  {
    dataIndex: "warehouseName",
    key: "warehouseName",
    title: "仓库",
    width: 80
  },
  {
    dataIndex: "inventoryAmount",
    key: "inventoryAmount",
    title: "库存数量",
    width: 100
  },
  {
    dataIndex: "checkAmount",
    key: "checkAmount",
    title: "盘点数量",
    width: 120,
  },
  {
    dataIndex: "classify",
    key: "classify",
    title: "物料分类",
    width: 100
  },
  {
    dataIndex: "remark",
    key: "remark",
    title: "备注",
    width: 160
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
            url: "/api-warehouse/check/details",
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
              this.detailsMsg = result.data.data.checkDO;
              this.data = result.data.data.checkItemDOS;
              this.warehouseName = result.data.data.checkDO.warehouse.name;
            }
          },
          ({ type, info }) => {}
        );
      }
    },
    created() {
      this.findOne(this.sendId);
    },
    watch: {
      sendId() {
        this.findOne(this.sendId)
      }
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