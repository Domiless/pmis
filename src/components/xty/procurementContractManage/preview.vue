<template>
  <div class="preview">
    <a-row>
      <!-- <a-col :span="24" class="title">
        <span>采 购 合 同</span>
      </a-col> -->
    <!-- </a-row>
    <a-row>
      <a-col :span="12">
        <span>供方：[--GF--]</span>
      </a-col>
      <a-col :span="12">
        <span>合同编号：[--HTBH--]</span>
      </a-col>
      <a-col :span="12">
        <span>需方：[--XF--]</span>
      </a-col>
      <a-col :span="12">
        <span>签订地点：[--QDDD--]</span>
      </a-col>
      <a-col :span="12">
        <span>签订时间：[--QDSJ--]</span>
      </a-col>
    </a-row>
    <a-row>
      <span>一、产品名称、商标型号、数量、金额、供货时间及数量</span>
    </a-row>
    <a-row>
      <span class="msg_money">
        <p>合计贷款：[--HJHK--]</p>
        <p>合计税金：[--HJSJ--]</p>
        <p>合计人民币金额：[--HJRMB--]</p>
      </span>
      <span class="msg_chineseMoney">
        <p>大写：[--DXHJHK--]</p>
        <p>大写：[--DXHJSJ--]</p>
        <p>大写：[--DXHJRMB--]</p>
      </span>
      <p>（采购清单详见附件）</p>
    </a-row>
    <a-row>
      <a-col :span="24" class="contractRules2">
        <p>二、质量要求技术标准、供方对质量负责的条件和期限：依照双方签订的《技术协议》、《质量赔偿协议》。</p>
        <p>三、交（提）货地点、方式：[--QDDD--] / [--JHFS--]。</p>
        <p>四、运输方式及到达站港和费用负担：按经济快捷原则选定运输方式，由供负责运杂费及包装费。</p>
        <p>五、合理损耗及计算方式：不得缺数短少，入库后原装短少由需方向供方索赔或在原货款中扣除。</p>
        <p>六、包装标准，包装物的供应与回收：包装应能保护产品，经受运输、标志清楚、方便管理。包装物不回收。</p>
        <p>七、验收标准，方法及提出异议期限：按本合同及《质量法》执行。</p>
        <p>八、随机备品、配件、工具数量及供应方法: 按照双方签订技术协议标准执行。</p>
        <p>九、供方提供给需方的产品，如侵范了他人的知识产权，一切责任由供方承担。需方向供方提供的一切图纸、创意、手册、图案、模型、配方等，供方应妥善保管。非经需方书面同意，供方不得擅自复制、拷贝，更不得向第三方泄漏。如因供方原因给需方带来的损失，所带来的一切责任、一切经济损失、一切相关费用，由供方承担。</p>
        <p>十、结算方式：货到需方验收合格入库后，按合同凭增值税发票办理结算，方式为六个月银行承兑。</p>
        <p>十一、违约责任：按《合同法》及本合同第七条执行。逾期交货每天按货款总金额3‰处罚，处罚总额最高不超过货款总额 。如因供方产品质量原因给需方造成损失，需方可根据损失情况向供方提出索赔。</p>
        <p>十二、解决合同纠纷的方式：发生纠纷由双方协商解决；如果协商不成，双方同意提交绵阳仲裁委员会仲裁。</p>
        <p>十三、本合同由双方法定代表人或委托代理人签字或加盖双方合同专用章或公章生效。</p>
        <p>十四、其它约定事项 ：如需方有合同变更或供方交货期发生变更，均应提前10-20天通知对方才有效;在合同有效期内如遇价格变动,按供需双方约定的时间，数量执行新价格。</p>
        <p>十五、供货方必须遵守国家环境保护的法律、法规，无重大环境事故发生，工业“四废”排放达到国家标准。</p>
        <p>十六、合同有效期自： {{ contractMsg.validity.split(" ~ ")[0] }} 至 {{ contractMsg.validity.split(" ~ ")[1] }} 。</p>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-col :span="8" class="msg_col">
          <pre style="text-align: center">供  方</pre>
          <p>单位名称：[--DWMC--]</p>
          <p>单位地址：[--DWDZ--]</p>
          <p>法定代表人：[--FDDBR--]</p>
          <p>委托代理人：[--WTDLR--]</p>
          <pre>电    话：[--DH--]</pre>
          <p>开户银行：[--KHYH--]</p>
          <pre>账    号：[--ZH--]</pre>
          <p>邮政编码：[--YZBM--]</p>
        </a-col>
        <a-col :span="8" class="msg_col msg_col2">
          <pre style="text-align: center">需  方</pre>
          <p>单位名称：四川长虹智能制造技术有限公司</p>
          <p>单位地址：绵阳高新区普明南路东段95号</p>
          <p>法定代表人：潘晓勇</p>
          <p>经办人：</p>
          <pre>传    真：0816-2416752</pre>
          <pre>电    话：0816-2416752</pre>
          <p>开户银行：工行高新区支行</p>
          <pre>账    号：2308414109100052696</pre>
          <p>邮政编码：621000</p>
        </a-col>
        <a-col :span="8" class="msg_col msg_col3">
          <p style="margin-top: 35px;margin-bottom: 150px">鉴（公）证意见：</p>
          <p style="text-align: center">经办人：</p>
          <p style="text-align: center">鉴（公）证机关（章）</p>
          <pre style="margin-left: 400px">     年     月     日</pre>
        </a-col>
      </a-col>
      <a-col :span="24">
        <span>备注：本合同不得随意增减、删改，否则合同无效。本合同履行期间，双方以传真件、复印件、扫描件等方式签订的具体实施内容的合同与本合同具有同等法律效力。</span>
      </a-col>
    </a-row> -->
    </a-row>
    <a-row>
      <a-col :span="24">
        <span v-html="contractTem"></span>
      </a-col>
    </a-row>

    <div style="page-break-after:always"></div>
    <a-row>
      <a-col :span="24">
        <table class="table_contract">
          <tr>
            <td colspan="8" style="text-align: center;font-size: 20px">合同清单</td>
          </tr>
          <tr style="font-size: 16px">
            <td colspan="5">
              <span>供方：{{contractMsg.supplier}}</span>
            </td>
            <td colspan="3" style="border-left:none">
              <span>合同编号：{{contractMsg.shopContractNo}}</span>
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <span>需方：{{contractMsg.demand}}</span>
            </td>
            <td colspan="3" style="border-left:none">
              <span>签订时间：{{contractMsg.digndate}}</span>
            </td>
          </tr>
          <tr style="text-align:center">
            <td>序号</td>
            <td>工作令</td>
            <td>名称型号</td>
            <td>单位</td>
            <td>数量</td>
            <td>不含税单价</td>
            <td>不含税总价</td>
            <td>交货时间</td>
          </tr>
          <tr
            v-for="(item,index) in contractMsg.purchaseDesDOList"
            :key="item.id"
            style="text-align: center"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.workOrderNo }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.priseUnit }}</td>
            <td>{{ item.orderNumber }}</td>
            <td>{{ item.total/item.orderNumber }}</td>
            <td>{{ item.total }}</td>
            <td>{{ item.delivery }}</td>
          </tr>
          <tr style="text-align: center">
            <td colspan="6">合计：</td>
            <td>{{ totalMoney }}</td>
            <td></td>
          </tr>
          <tr style="text-align: center">
            <td colspan="8">合计（不含13%增值税，含运费、贵司物流或快递至我司指定地点）：{{ totalMoney }}元</td>
          </tr>
        </table>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      contractMsg: [],
      contractTem: '',
      totalMoney: 0
    };
  },
  created() {
    this.priviewType = sessionStorage.getItem("priviewType");
    if (this.priviewType == 4) {
      let data = JSON.parse(sessionStorage.getItem("priview"));
      this.contractTem = data[0];
      this.contractMsg = data[1];
      console.log(data);
      console.log(this.contractMsg);
      console.log(this.contractTem);
      this.contractMsg.purchaseDesDOList.forEach(item => {
                                                    this.totalMoney += item.total;
                                                });
    }
    
  }
};
</script>
<style lang="less">
.preview {
  padding: 0px 5px;
  background-color: #ffffff;
  .title {
    font-size: 24px;
    text-align: center;
    margin-bottom: 20px;
  }
  .msg_money {
    width: 40%;
    display: inline-block;
    p {
      margin-bottom: 7px;
    }
  }
  .msg_chineseMoney {
    width: 50%;
    display: inline-block;
    p {
      margin-bottom: 7px;
    }
  }
  .msg_col {
    border: 1px solid #000000;
    p,
    pre {
      margin-left: 10px;
    }
  }
  .msg_col2 {
    border-left: 0px;
    height: 317px;
    p,
    pre {
      margin-bottom: 10px;
    }
  }
  .msg_col3 {
    border-left: 0px;
    height: 317px;
  }
  .table_contract {
    width: 100%;
    tr,
    td {
      border: 1px solid #000000;
    }
  }
  .contractRules2 {
    p {
      margin-bottom: 7px;
    }
  }
}
</style>