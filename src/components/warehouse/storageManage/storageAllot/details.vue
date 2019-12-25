<template>
    <div class="details">
        <a-row>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">单据类型：</span>
                <span>{{ detailsMsg.type }}</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">单据编号：</span>
                <span>{{ detailsMsg.transferNo }}</span>
            </a-col>
             <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">调出仓库：</span>
                <span>{{ outputWarehouse }}</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">调入仓库：</span>
                <span>{{ inputWarehouse }}</span>
            </a-col>
            <a-col :span="12" style="margin-bottom:12px;">
                <span class="label_right">调拨日期：</span>
                <span>{{ detailsMsg.transferDate }}</span>
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
//   {
//     dataIndex: "xuanzewuliao",
//     key: "xuanzewuliao",
//     title: "选择物料",
//     width: 80,
//     scopedSlots: { customRender: "xuanzewuliao" }
//   },
  {
    dataIndex: "code",
    key: "code",
    title: "物料编码",
    width: 120
  },
  {
    dataIndex: "drawingCode",
    key: "drawingCode",
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
    dataIndex: "specification",
    key: "specification",
    title: "型号/规格",
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
    dataIndex: "classify",
    key: "classify",
    title: "物料分类",
    width: 100
  },
  {
    dataIndex: "inventoryAmount",
    key: "inventoryAmount",
    title: "库存数量",
    width: 100
  },
  {
    dataIndex: "transferAmount",
    key: "transferAmount",
    title: "调拨数量",
    width: 120
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
            outputWarehouse: '',
            inputWarehouse: ''
        }
    },
    methods: {
      findOne(id) {
        this.Axios(
          {
            url: "/api-warehouse/transfer/details",
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
              this.detailsMsg = result.data.data.transferDO;
              this.data = result.data.data.transferItemDO;
              this.outputWarehouse = this.detailsMsg.fromWarehouse.name;
              this.inputWarehouse = this.detailsMsg.toWareHouse.name;
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