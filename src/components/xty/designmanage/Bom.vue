<template>
  <div class="importBom">
    <a-row>
      <a-col style="text-align: right">
        <a-button @click="addVisible=true">导入BOM</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-table :columns="columns" :dataSource="data" :scroll="{ x: 1900, y: 400 }">
        <template slot="action" slot-scope="text">
          <a href="javascript:;">修改</a>
          <a href="javascript:;">删除</a>
        </template>
      </a-table>
    </a-row>
    <a-modal
			title="导入提示"
			:footer="null"
			width="420px"
			:visible="addVisible"
			@cancel="addVisible=false"
      @ok="addVisible=false"
			:maskClosable="false"
		>
			<div>
				导入步骤：
				<br />1、下载模板
				<a href="#">《BOM模板.xlsx》</a>；
				<br />2、按格式要求填写，请勿模板修改结构；
				<br />3、点击下方“选择文件”按钮导入数据；
				<br />4、校对并保存数据。
				<br />
				<span style="color:#f00">提示：重复导入时，已经有数据将会被清空。</span>
			</div>
			<div style="padding-top:12px; text-align: right">
				<a-upload
					:multiple="true"
					:fileList="fileList"
					:showUploadList="false"
				>
					<a-button type="primary">
						<a-icon type="upload" />选择文件
					</a-button>
				</a-upload>
			</div>
		</a-modal>
  </div>
</template>
<script>
const columns = [
  { 
    title: "图号",
    dataIndex: "drawId", 
    key: "drawId", 
    // fixed: "left", 
    width: 100 
  },
  { 
    title: "名称", 
    dataIndex: "name", 
    key: "name", 
    width: 150 
  },
  { 
    title: "装入部件号", 
    dataIndex: "address", 
    key: "1", 
    width: 150 
  },
  { 
    title: "组件中零件数量", 
    dataIndex: "address", 
    key: "2", 
    width: 150 
  },
  { 
    title: "单机中零件数量", 
    dataIndex: "address", 
    key: "3", 
    width: 150 
  },
  { 
    title: "需求总数量", 
    dataIndex: "address", 
    key: "4", 
    width: 150 
  },
  { 
    title: "装入整件号", 
    dataIndex: "address", 
    key: "5", 
    width: 150 
  },
  { 
    title: "领料单位", 
    dataIndex: "address", 
    key: "6", 
    width: 150 
  },
  { 
    title: "备注", 
    dataIndex: "address", 
    key: "7", 
    width: 150 
  },
  { 
    title: "零件类别", 
    dataIndex: "address", 
    key: "8", 
    width: 150 
  },
  { 
    title: "指定品牌",
    dataIndex: "address", 
    key: "9", 
    width: 150 
  },
  { 
    title: "设计师",
    dataIndex: "address",
    key: "10",
    width: 150
  },
  {
    title: "操作",
    key: "operation",
    // fixed: "right",
    width: 100,
    scopedSlots: { customRender: "action" }
  }
];
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    drawId: `GB/T889.1-2000 ${i}`,
    name: "锁紧螺母M6",
    address: `London Park no. ${i}`
  });
}

export default {
  data() {
    return {
      data,
      columns,
      addVisible: false,
      fileList: []
    };
  }
};
</script>
<style lang="less" scoped>
.importBom {
  .ant-row:nth-child(1) {
    margin-bottom: 20px;
  }
}
</style>