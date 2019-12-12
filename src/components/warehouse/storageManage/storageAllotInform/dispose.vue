<template>
    <div class="dispose">
        <a-row style="margin-bottom: 20px">
            <a-col :span="12">
                <span class="label_right">单据编号：</span>
                <span>{{ detailsMsg.transferNo }}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">调出仓库：</span>
                <span>{{ outputWarehouse }}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">开单日期：</span>
                <span>{{ detailsMsg.transferDate }}</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">调入仓库：</span>
                <span>{{ inputWarehouse }}</span>
            </a-col>
        </a-row>
        <a-row>
            <a-table
                :scroll="{y:500}"
                rowKey="id"
                class="table_style"
                :columns="columns"
                :dataSource="data"
                :pagination="false"
            >
                <template slot="caozuo" slot-scope="text, record">
                    <a href="javascript:" @click="comfirm(record.id)">确认入库</a>
                </template>
                <template slot="index" slot-scope="text, record, index">
                  <span>{{index+1}}</span>
                </template>
            </a-table>
        </a-row>
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
    dataIndex: "transferAmount",
    key: "transferAmount",
    title: "数量",
    width: 120,
  },
  {
    dataIndex: "unitEntry",
    key: "unitEntry",
    title: "单位",
    width: 80
  },
  {
    dataIndex: "remark",
    key: "remark",
    title: "备注",
    width: 160,
  },
  {
    dataIndex: "caozuo",
    key: "caozuo",
    title: "操作",
    width: 100,
    scopedSlots: { customRender: "caozuo" }
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
      comfirm(id) {
        console.log(id);
        this.Axios(
          {
            url: "/api-warehouse/transferItem/confirmStorage?transferItemId=" + id,
            params: {},
            type: "put",
            option: { enableMsg: false }
          },
          this
        ).then(
          result => {
            if (result.data.code === 200) {
              console.log(result);
            }
          },
          ({ type, info }) => {}
        );
      },
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
.dispose {
    .label_right {
        display: inline-block;
        width: 80px;
        text-align: right;
    }
    .table_style {
        position: relative;
        .ant-table-body {
          min-height: 500px;
          max-height: 500px;
        }
        .ant-table-placeholder {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -44px;
        margin-top: -27px;
      }
    }
}
</style>