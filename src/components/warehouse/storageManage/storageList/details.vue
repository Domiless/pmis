<template>
    <div class="details">
        <a-row>
            <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">物料编码：</span>
                <span>{{ detailsMsg.code }}</span>
            </a-col>
            <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">图号：</span>
                <span>{{ detailsMsg.drawingCode }}</span>
            </a-col>
            <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">名称：</span>
                <span>{{ detailsMsg.name }}</span>
            </a-col>
            <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">单位：</span>
                <span>{{ detailsMsg.unit }}</span>
            </a-col>
            <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">物料分类：</span>
                <span>{{ detailsMsg.classification.name }}</span>
            </a-col>
            <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">仓库：</span>
                <span>{{ detailsMsg.warehouse.name }}</span>
            </a-col>
            <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">库存数量：</span>
                <span>{{ detailsMsg.amount }}</span>
            </a-col>
            <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">物料下限：</span>
                <span>{{ detailsMsg.warningAmount }}</span>
            </a-col>
            <a-col :span="24" style="margin-bottom:12px;">
                <span class="label_right">备注：</span>
                <span>{{ detailsMsg.note }}</span>
            </a-col>
        </a-row>
    </div>
</template>
<script>
export default {
    props: {
        detailsMsg: {
            default: ""
            }
    },
    data (){
        return {

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