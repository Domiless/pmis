<template>
  <div class="preview">
    <a-row>
      <div style="text-align:center;">
          <h2>{{new Date().getFullYear()+'年'}}{{enterpriseName}}外购物资需求表</h2>
      </div>
    </a-row>
    <a-row>
        <table class="table_style">
            <tr>
                <th :colspan="2">业务归口部门：</th>
                <td>{{ procurementMsg.relevant }}</td>
                <th>提采时间：</th>
                <td :colspan="2">{{ procurementMsg.raisedate }}</td>
                <th>编号：</th>
                <td :colspan="4">{{ procurementMsg.no }}</td>
            </tr>
            <tr>
                <th :colspan="2">订单号：</th>
                <td>{{ procurementMsg.bomNo }}</td>
                <th>项目名称：</th>
                <td :colspan="5">{{ procurementMsg.projectName }}</td>
                <th>申请人：</th>
                <td>{{ procurementMsg.production }}</td>
            </tr>
            <tr style="background-color:#f1f1f1;color:#333333 ;font-weight:normal;">
              <th style="width:3%">序号</th>
              <th style="width:8%">物料代码</th>
              <th style="width:15%">物料名称</th>
              <th style="width:20%">型(牌)号、规格、标准</th>
              <th style="width:10%">计量单位</th>
              <th style="width:4%">需求数量</th>
              <th style="width:10%">推荐厂家(品牌)</th>
              <th style="width:10%">指定厂家</th>
              <th style="width:10%">要求到货时间</th>
              <th style="width:5%">备注</th>
              <th style="width:5%">物资分类</th>
            </tr>
            <tr v-for="(item,i) in procurementMsg.bomDes" :key="i+8888">
              <td style="width:3%">{{i+1}}</td>
              <td style="width:8%"></td>
              <td style="width:15%">{{ item.name }}</td>
              <td style="width:20%">{{ item.partCat }}</td>
              <td style="width:10%">{{ item.unit }}</td>
              <td style="width:4%">{{ item.addNum }}</td>
              <td style="width:10%">{{ item.adviseBrand }}</td>
              <td style="width:10%">{{ item.brand }}</td>
              <td style="width:10%">{{ item.arrivalTime }}</td>
              <td style="width:5%">{{ item.remake }}</td>
              <td style="width:5%"></td>
            </tr>
          </table>
          <div style="height: 200px">
          </div>
          <a-col :span="6">
            <span>部门主管：</span>
          </a-col>
          <a-col :span="6">
            <span>库管员：</span>
          </a-col>
          <a-col :span="6">
            <span>项目审核：</span>
          </a-col>
          <a-col :span="6">
            <span>项目经办：</span>
          </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
        procurementMsg: [],
      	enterpriseName: JSON.parse(sessionStorage.getItem("user")).enterpriseName,
		userNmae: JSON.parse(sessionStorage.getItem("user")).userName
    };
  },
  created() {
    this.priviewType = sessionStorage.getItem("priviewType");
    if (this.priviewType == 5) {
      let data = JSON.parse(sessionStorage.getItem("priview"));
      console.log(data);
      this.procurementMsg = data;
    }
    
  }
};
</script>
<style lang="less">
.preview {
    background-color: white;
    padding: 10px;
    overflow: hidden;
    margin-bottom: 10px;
    page-break-after: always;
    .table_style {
      width: 100%;
      border: 1px solid #000000;
      border-collapse: collapse;
      tr {
        width: 100%;
        th {
          text-align: center;
          border: 1px solid #000000;
          line-height: 28px;
          background-color:#f1f1f1;color:#333333 ;
        }
        td {
          text-align: center;
          border: 1px solid #000000;
          line-height: 28px;
        }
      }
    }
  
}
</style>