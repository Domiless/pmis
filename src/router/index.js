import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import OrderList from '@/components/order/OrderList'
import OrderAdd from '@/components/order/OrderAdd'
import OrderEdit from '@/components/order/OrderEdit'
import MyDevice from '@/components/equipment/index'
import DeviceCategory from '@/components/equipment/DeviceCategory'
import AddEquipment from '@/components/equipment/AddEquipment'
import EditEquipment from '@/components/equipment/EditEquipment'
import Organization from '@/components/organization/index'
import Employee from '@/components/system/employee'
import AddEmployee from '@/components/system/AddEmployee'
import EditEmployee from '@/components/system/EditEmployee'

import Authority from '@/components/system/authority/Authority'
import AddAuthority from '@/components/system/authority/AddAuthority'
import EditAuthority from '@/components/system/authority/EditAuthority'
import ProcessTypes from '@/components/system/processtypes/ProcessTypes'
import Subcontract from '@/components/system/subcontract/Subcontract'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/Enterprise',
  },
  {
    path: '/DrawingsList',
    name: 'DrawingsList',
    components: require('../components/drawing/index.vue'),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/Feedback',
    name: 'Feedback',
    components: require('../components/feedback/Index.vue'),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/ModuleCustomization',
    name: 'ModuleCustomization',
    components: require('../components/system/moduleCustomization/ModuleCustomization.vue'),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/Enterprise',
    name: 'Enterprise',
    components: require('../components/enterprise/index.vue'),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/Dashboard',
    name: 'Dashboard',
    components: require('../components/Dashboard'),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/OrderList',
    name: 'OrderList',
    component: OrderList,
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'OrderAdd',
      name: 'OrderAdd',
      component: OrderAdd,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'OrderEdit/:id/',
      name: 'OrderEdit',
      component: OrderEdit,
      meta: {
        requireAuth: true,
      },
    },
    ]
  },
  {
    path: '/MyDevice',
    name: 'MyDevice',
    component: MyDevice,
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'AddEquipment',
      name: 'AddEquipment',
      component: AddEquipment,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'EditEquipment/:id/',
      name: 'EditEquipment',
      component: EditEquipment,
      meta: {
        requireAuth: true,
      },
    }
    ]
  },
  {
    path: '/DeviceCategory',
    name: 'DeviceCategory',
    component: DeviceCategory,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/Organization',
    name: 'Organization',
    component: Organization,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/Employee',
    name: 'Employee',
    component: Employee,
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'AddEmployee',
      name: 'AddEmployee',
      component: AddEmployee,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'EditEmployee/:id/',
      name: 'EditEmployee',
      component: EditEmployee,
      meta: {
        requireAuth: true,
      },
    }
    ]
  },
  {
    path: '/Authority',
    name: 'Authority',
    component: Authority,
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'AddAuthority',
      name: 'AddAuthority',
      component: AddAuthority,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'EditAuthority/:id/',
      name: 'EditAuthority',
      component: EditAuthority,
      meta: {
        requireAuth: true,
      },
    }
    ]
  },
  {
    path: '/ProcessTypes',
    name: 'ProcessTypes',
    component: ProcessTypes,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/Subcontract',
    name: 'Subcontract',
    component: Subcontract,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/OrderPrice',
    name: 'OrderPrice',
    components: require('@/components/orderPrice/Index.vue'),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/HistoricalQuote',
    name: 'HistoricalQuote',
    components: require('@/components/orderPrice/HistoricalQuote.vue'),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/WorkingHours',
    name: 'workingHours',
    components: require('@/components/workingHours/index.vue'),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/WorkOrderList',
    name: 'WorkOrderList',
    components: require('@/components/workOrder/WorkOrderList.vue'),
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'TransferOrder/:id/',
      name: 'TransferOrder',
      components: require('../components/workOrder/transferForm/TransferForm.vue'),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'schedule/:id/',
      name: 'schedule',
      components: require('@/components/workOrder/schedule/index'),
      meta: {
        requireAuth: true,
      },
      children: []
    },
    {
      path: 'WorkOrderDetailsList/:id/',
      name: 'WorkOrderDetailsList',
      components: require('../components/workOrder/workOrderDetails/Index.vue'),
      meta: {
        requireAuth: true,
      },
      children: [{
        path: 'WorkHoursHandle/:id/',
        name: 'WorkHoursHandle',
        components: require('../components/workOrder/workHoursHandle/index.vue'),
        meta: {
          requireAuth: true,
        },
      }]
    },
    {
      path: 'Inventory/:id/',
      name: 'Inventory',
      components: require('../components/workOrder/inventory/index.vue'),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'OrderPrice/:id',
      name: 'OrderPrice',
      components: require('@/components/orderPrice/Index.vue'),
      meta: {
        requireAuth: true,
      },
    },
    ]
  },
  {
    path: '/materialManagementList',
    name: 'materialManagementList',
    components: require('@/components/materialManagement/Index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/designmanage',
    name: 'designmanage',
    components: require('@/components/xty/designmanage/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/orderManage',
    name: 'orderManage',
    components: require('@/components/xty/orderManage/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/procurement',
    name: 'procurement',
    components: require('@/components/xty/procurementManage/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/supplierManage',
    name: 'supplierManage',
    components: require('@/components/xty/supplierManage/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/FlowPath',
    name: 'FlowPath',
    components: require('@/components/xty/flowPath/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/procurementContractManage',
    name: 'procurementContractManage',
    components: require('@/components/xty/procurementContractManage/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/contractManage',
    name: 'contractManage',
    components: require('@/components/xty/contractManage/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/measureUnit',
    name: 'measureUnit',
    components: require('@/components/xty/measureUnit/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/buyer',
    name: 'buyer',
    components: require('@/components/xty/buyer/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/procurementPlan',
    name: 'procurementPlan',
    components: require('@/components/xty/procurementPlan/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/procurementApply',
    name: 'procurementApply',
    components: require('@/components/xty/procurementApply/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/Message',
    name: 'Message',
    components: require('@/components/system/message'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/Blackboard',
    name: 'Blackboard',
    components: require('@/components/system/Blackboard'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/deliverySlip',
    name: 'deliverySlip',
    components: require('@/components/workOrder/deliverySlip/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/log',
    name: 'log',
    components: require('@/components/system/log/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/enquiry',
    name: 'enquiry',
    components: require('@/components/xty/enquiry/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/declaration',
    name: 'declaration',
    components: require('@/components/xty/declaration/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/warehouse',
    name: 'warehouse',
    components: require('@/components/warehouse/basicSetting/warehouse/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/unit',
    name: 'unit',
    components: require('@/components/warehouse/basicSetting/unit/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/location',
    name: 'location',
    components: require('@/components/warehouse/basicSetting/location/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/classify',
    name: 'classify',
    components: require('@/components/warehouse/basicSetting/classify/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/procurementStock',
    name: 'procurementStock',
    components: require('@/components/warehouse/stockManage/procurementStock/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/productionStock',
    name: 'productionStock',
    components: require('@/components/warehouse/stockManage/productionStock/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/backStock',
    name: 'backStock',
    components: require('@/components/warehouse/stockManage/backStock/index'),
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'addBackStock',
      name: 'addBackStock',
      component: require('../components/warehouse/stockManage/backStock/addBackStock.vue').default,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'editBackStock/:id/',
      name: 'editBackStock',
      component: require('../components/warehouse/stockManage/backStock/editBackStock.vue').default,
      meta: {
        requireAuth: true,
      },
    }
    ]
  },
  {
    path: '/otherStock',
    name: 'otherStock',
    components: require('@/components/warehouse/stockManage/otherStock/index'),
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'addOtherStock',
      name: 'addOtherStock',
      component: require('../components/warehouse/stockManage/otherStock/addOtherStock.vue').default,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'editOtherStock/:id/',
      name: 'editOtherStock',
      component: require('../components/warehouse/stockManage/otherStock/editOtherStock.vue').default,
      meta: {
        requireAuth: true,
      },
    }
    ]
  },
  {
    path: '/picking',
    name: 'picking',
    components: require('@/components/warehouse/putOutStorage/picking/index'),
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'add',
      name: 'add',
      component: require('../components/warehouse/putOutStorage/picking/add.vue').default,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'edit/:id',
      name: 'edit',
      component: require('../components/warehouse/putOutStorage/picking/edit.vue').default,
      meta: {
        requireAuth: true,
      },
    },
    ]
  },
  {
    path: '/market',
    name: 'market',
    components: require('@/components/warehouse/putOutStorage/market/index'),
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'add',
      name: 'add',
      component: require('../components/warehouse/putOutStorage/market/add.vue').default,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'edit/:id',
      name: 'edit',
      component: require('../components/warehouse/putOutStorage/market/edit.vue').default,
      meta: {
        requireAuth: true,
      },
    },
    ]
  },
  {
    path: '/others',
    name: 'others',
    components: require('@/components/warehouse/putOutStorage/others/index'),
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'add',
      name: 'add',
      component: require('../components/warehouse/putOutStorage/others/add.vue').default,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'edit/:id',
      name: 'edit',
      component: require('../components/warehouse/putOutStorage/others/edit.vue').default,
      meta: {
        requireAuth: true,
      },
    },
    ]
  },
  {
    path: '/purchaseReturn',
    name: 'purchaseReturn',
    components: require('@/components/warehouse/putOutStorage/purchaseReturn/index'),
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'add',
      name: 'add',
      component: require('../components/warehouse/putOutStorage/purchaseReturn/add.vue').default,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'edit/:id',
      name: 'edit',
      component: require('../components/warehouse/putOutStorage/purchaseReturn/edit.vue').default,
      meta: {
        requireAuth: true,
      },
    },
    ]
  },
  {
    path: '/storageList',
    name: 'storageList',
    components: require('@/components/warehouse/storageManage/storageList/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/storageCheck',
    name: 'storageCheck',
    components: require('@/components/warehouse/storageManage/storageCheck/index'),
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'addStorageCheck',
      name: 'addStorageCheck',
      component: require('../components/warehouse/storageManage/storageCheck/addStorageCheck.vue').default,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'editStorageCheck/:id/',
      name: 'editStorageCheck',
      component: require('../components/warehouse/storageManage/storageCheck/editStorageCheck.vue').default,
      meta: {
        requireAuth: true,
      },
    }
    ]
  },
  {
    path: '/storageAllot',
    name: 'storageAllot',
    components: require('@/components/warehouse/storageManage/storageAllot/index'),
    meta: {
      requireAuth: true,
    },
    children: [{
      path: 'addStorageAllot',
      name: 'addStorageAllot',
      component: require('../components/warehouse/storageManage/storageAllot/addStorageAllot.vue').default,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: 'editStorageAllot/:id/',
      name: 'editStorageAllot',
      component: require('../components/warehouse/storageManage/storageAllot/editStorageAllot.vue').default,
      meta: {
        requireAuth: true,
      },
    }
    ]
  },
  {
    path: '/storageAllotInform',
    name: 'storageAllotInform',
    components: require('@/components/warehouse/storageManage/storageAllotInform/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/putInSummaryStatement',
    name: 'putInSummaryStatement',
    components: require('@/components/warehouse/statistics/putInSummaryStatement/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/outboundSummaryStatement',
    name: 'outboundSummaryStatement',
    components: require('@/components/warehouse/statistics/outboundSummaryStatement/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/putInDetails',
    name: 'putInDetails',
    components: require('@/components/warehouse/statistics/putInDetails/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/outboundDetails',
    name: 'outboundDetails',
    components: require('@/components/warehouse/statistics/outboundDetails/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/InventoryDetails',
    name: 'InventoryDetails',
    components: require('@/components/warehouse/statistics/InventoryDetails/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  {
    path: '/requisitionDetails',
    name: 'requisitionDetails',
    components: require('@/components/warehouse/statistics/requisitionDetails/index'),
    meta: {
      requireAuth: true,
    },
    children: []
  },
  ]
})
