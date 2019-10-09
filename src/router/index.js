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
  ]
})
