<template>
    <div class="production_Stock">
        <a-row>
            <permission-button permCode banType="hide">
                <a-icon style="color:#1890ff;" type="submit" />物料入库
            </permission-button>
        </a-row>
        <a-row>
            <a-col :span="24">
                <a-input-group class="changeDis">
                    <span>仓库 : </span>
                    <a-select v-model="reviewSchedule" style="width: 100px" optionFilterProp="children">
                        <a-select-option :value="-1">全部</a-select-option>
                        <a-select-option :value="1">暂存</a-select-option>
                        <a-select-option :value="2">审批中</a-select-option>
                        <a-select-option :value="3">已通过</a-select-option>
                        <a-select-option :value="4">未通过</a-select-option>
                        <a-select-option :value="5">已终止</a-select-option>
                    </a-select>
                </a-input-group>
                <span>日期 :</span>
                <a-range-picker style="width:240px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
                <span>关键词 : </span>
                <a-input
                placeholder="单据编号/应商名称" 
                style="width: 250px" 
                v-model="keyWords"
                @keyup.enter.native="getList"
                ></a-input>
                <a-button @click="getList">搜索</a-button>
            </a-col>
        </a-row>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>
<style lang="less">

</style>