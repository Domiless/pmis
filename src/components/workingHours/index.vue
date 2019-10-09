<template>
	<div class="working_hours">
		<a-tabs defaultActiveKey="1">
			<a-tab-pane tab="人员工时统计" key="1">
				<EmployeeHours></EmployeeHours>
			</a-tab-pane>
			<a-tab-pane tab="工单工时统计" key="2" forceRender>
				<workOrderHours></workOrderHours>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>
<script>
import Vue from "vue";
import { Tabs } from "ant-design-vue";
Vue.use(Tabs);
import EmployeeHours from "./EmployeeHours";
import workOrderHours from "./workOrderHours";
export default {
	data() {
		return {};
	},
	methods: {},
	components: {
		EmployeeHours,
		workOrderHours
	},
	created() {}
};
</script>