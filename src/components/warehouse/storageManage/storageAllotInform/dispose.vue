<template>
    <div class="dispose">
        <a-row style="margin-bottom: 20px">
            <a-col :span="12">
                <span class="label_right">单据编号：</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">调出仓库：</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">开单日期：</span>
            </a-col>
            <a-col :span="12">
                <span class="label_right">调入仓库：</span>
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
                <template slot="caozuo" >
                    <span>确认入库</span>
                </template>
            </a-table>
        </a-row>
    </div>
</template>
<script>
const columns = [
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
    dataIndex: "shuliang",
    key: "shuliang",
    title: "数量",
    width: 120,
  },
  {
    dataIndex: "danwei",
    key: "danwei",
    title: "单位",
    width: 80
  },
  {
    dataIndex: "beizhu",
    key: "beizhu",
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
    data() {
        return {
            columns,
            data: [],
        }
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