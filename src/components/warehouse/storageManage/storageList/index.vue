<template>
    <div class="storageList">
        <a-row style="line-height:50px;margin-bottom: 20px;" >
            <permission-button permCode banType="hide" @click="showSetting">
                <i style="color:#1890ff;margin-right:4px;" class="iconfont">&#xe8ad;</i>预警设置
            </permission-button>
        </a-row>
        <a-row style="margin-bottom: 10px">
            <a-col :span="24">
            <a-input-group class="changeDis">
                <span>仓库 : </span>
                <a-select style="width: 300px" optionFilterProp="children">
                </a-select>
            </a-input-group>
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
              <div class="treeArea">

              </div>
          </a-col>
          <a-col :span="21">
              <a-table
                rowKey="id"
                :columns="columns"
                :dataSource="data"
                :pagination="false"
                >
                    <template slot="mingcheng" slot-scope="text, record">
                        <a href="javascript:" @click="showDetails(record)">{{text}}</a>
                    </template>
                    <template slot="caozuo" >
                        <span>修改</span>
                    </template>
              </a-table>
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
          </a-col>
      </a-row>
      <a-modal
        title="预警设置"
        v-model="settingVisible" 
        style="top:20px" width="1200px" 
        :footer="null"
        :maskClosable="false"
        @cancel="handleCancel(1)">
        <warnSetting></warnSetting>
    </a-modal>
    <a-modal
      title="合同详情"
      :footer="null"
      width="1000px"
      :visible="detailsVisible"
      @cancel="handleCancel(3)"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <Details></Details>
    </a-modal>
    </div>
</template>
<script>
import WarnSetting  from "./warnSetting"
import Details from "./details"
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
    dataIndex: "wuliaofenlei",
    key: "wuliaofenlei",
    title: "物料分类",
    width: 100
  },
  {
    dataIndex: "cangku",
    key: "cangku",
    title: "仓库",
    width: 100
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
    title: "物料下限",
    width: 120,
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
            settingVisible: false,
            detailsVisible: false,
            keyWords: "",
            current: 1,
            pageSize: 10,
            total: 0,
        }
    },
    methods: {
        showSetting() {
            this.settingVisible = true;
        },
        handleCancel(num) {
            if( num == 1 ) {
                this.settingVisible = false;
            }
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
    },
    components: {
        WarnSetting,
        Details
    }
}
</script>
<style lang="less">
.storageList{
    padding: 0 20px;
    .changeDis {
    display: inline;
    margin: 0px 10px 0px 0px;
  }
  .treeArea {
      margin-right: 10px;
      height: 400px;
      border: 1px solid #999999;
  }
}
</style>