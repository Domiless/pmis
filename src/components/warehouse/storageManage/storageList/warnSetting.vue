<template>
    <div class="warnSetting">
        <a-row style="margin-bottom: 10px">
            <a-col :span="24">
                <span>关键词 :</span>
                <a-input
                    placeholder="单据编号"
                    style="width: 250px"
                    v-model="keyWords"
                    @keyup.enter.native="getList"
                ></a-input>
                <a-button @click="getList">搜索</a-button>
            </a-col>
        </a-row>
        <a-row>
          <a-col :span="3">

          </a-col>
          <a-col :span="21">
              <a-table
                rowKey="id"
                size="small"
                :scroll="{y:500}"
                :columns="columns"
                :dataSource="data"
                :pagination="false"
                >
                    <template slot="mingcheng" slot-scope="text, record">
                        <a href="javascript:" @click="showDetails(record.id)">{{text}}</a>
                    </template>
                    <template slot="caozuo" >
                        <span>编辑</span>
                    </template>
              </a-table>
          </a-col>
          <a-col :span="12"  style="margin-top:12px;color: #999999;font-size:12px">
                <span>提示：若“物料下限”设置为0或为空时，表示不进行库存报警</span>
          </a-col>
          <a-col :span="12">
              <a-pagination
                style="padding-top:12px;text-align: right;"
                showQuickJumper
                size="small"
                :defaultCurrent="current"
                :total="total"
                @change="onChange"
                showSizeChanger
                :pageSizeOptions="['10','20','30']"
                @showSizeChange="onShowSizeChange"
                :showTotal="total => `共 ${total} 条`"
                />
          </a-col>
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
    dataIndex: "danwei",
    key: "danwei",
    title: "单位",
    width: 80
  },
  {
    dataIndex: "kucunshuliang",
    key: "kucunshuliang",
    title: "库存数量",
    width: 100,
    scopedSlots: { customRender: "kucunshuliang" }
  },
  {
    dataIndex: "shuliang",
    key: "shuliang",
    title: "物料下限",
    width: 120,
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
            keyWords: "",
            current: 1,
            pageSize: 10,
            total: 0,
        }
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
                url: "",
                type: "get",
                params: {
                    page: this.current,
                    size: this.pageSize,
                    keyword: this.keyWords,
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
        }
    }
}
</script>
<style>
.warnSetting {

}
</style>