//主要为全部菜单结构和权限的配置，visible=true不在菜单显示，defaultDock=true会跳过lookUp权限默认在菜单显示
//permissionCode为权限映射码，若permissionCode未对应到用户权限则不显示也无跳转访问权限
//route和routeReg为匹配路由，二者必须有一个，若都有则为“或”逻辑
export default [{
    menu: '企业管理',
    permissionCode: 'enterprise',
    icon: '&#xe60a;',
    defaultDock: false,
    subMenu: [{
      menu: '企业列表',
      route: '/Enterprise',
      key: 'enterprise',
      permissionCode: 'enterprise_lookup',
    }, ]
  },
  {
    menu: '默认首页',
    permissionCode: 'workdesk',
    icon: '&#xe60a;',
    defaultDock: true,
    subMenu: [{
      menu: '首页',
      route: '/Dashboard',
      key: 'dashboard',
      permissionCode: 'workdesk_desk_lookup',
    }, ]
  },
  {
    menu: '工单管理',
    defaultDock: false,
    permissionCode: 'workorder',
    icon: '&#xe602;',
    subMenu: [{
        menu: '工单列表',
        route: '/WorkOrderList',
        key: 'workOrderList',
        permissionCode: 'workorder_manage_lookup'
      },
      {
        menu: '工单明细',
        routeReg: /^\/WorkOrderList\/WorkOrderDetailsList\/\w{1,}$/i,
        key: 'WorkOrderDetailsList',
        visible: true,
        permissionCode: 'workorder_detail_lookup'
      },
      {
        menu: '工时管理',
        routeReg: /^\/WorkOrderList\/WorkOrderDetailsList\/\w{1,}\/WorkHoursHandle\/.{1,}$/i,
        key: 'WorkHoursHandle',
        visible: true,
        permissionCode: 'workorder_worktime_lookup'
      },
      {
        menu: '物资清单',
        routeReg: /^\/WorkOrderList\/Inventory\/\w{1,}$/i,
        key: 'Inventory',
        visible: true,
        permissionCode: 'workorder_partlist_lookup'
      },
      {
        menu: '生产报价单',
        routeReg: /^\/WorkOrderList\/OrderPrice\/\w{1,}$/i,
        key: 'OrderPrice',
        visible: true,
        permissionCode: 'workorder_offer_lookup'
      },
    ]
  },

  // {
  //   menu: '订单报价',
  //   defaultDock: false,
  //   permissionCode: 'offer',
  //   icon: '&#xe61e;',
  //   subMenu: [{
  //       menu: '订单报价',
  //       route: '/OrderPrice',
  //       key: 'OrderPrice',
  //       permissionCode: 'offer_order_lookup'
  //     },
  //     {
  //       menu: '历史报价',
  //       route: '/HistoricalQuote',
  //       key: 'HistoricalQuote',
  //       permissionCode: 'offer_history_lookup'
  //     },
  //   ]
  // },

  {
    menu: '工种管理',
    defaultDock: false,
    permissionCode: 'worktype',
    icon: '&#xe605;',
    subMenu: [{
      menu: '工种列表',
      route: '/ProcessTypes',
      key: 'ProcessTypes',
      permissionCode: 'worktype_worktype_lookup'
    }, ]
  },
  {
    menu: '员工管理',
    defaultDock: false,
    permissionCode: 'employee',
    icon: '&#xe6de;',
    subMenu: [{
        menu: '员工列表',
        route: '/Employee',
        key: 'employee',
        permissionCode: 'employee_list_lookup'
      },
      {
        menu: '员工添加',
        route: '/Employee/AddEmployee',
        key: 'addEmployee',
        visible: true,
        permissionCode: 'employee_add_lookup'
      },
      {
        menu: '员工修改',
        routeReg: /^\/Employee\/EditEmployee\/\w{1,}$/i,
        key: 'editEmployee',
        visible: true,
        permissionCode: 'employee_update_lookup'
      },
    ]
  },
  {
    menu: '原材料管理',
    defaultDock: false,
    permissionCode: 'rawMateria',
    icon: '&#xe64a;',
    subMenu: [{
      menu: '原材料列表',
      route: '/materialManagementList',
      key: 'materialManagementList',
      permissionCode: 'raw_raw_lookup'
    }, ]
  },
  {
    menu: '图纸管理',
    defaultDock: false,
    permissionCode: 'drawing',
    icon: '&#xe616;',
    subMenu: [{
      menu: '图纸列表',
      route: '/DrawingsList',
      key: 'drawingsList',
      permissionCode: 'drawing_drawing_lookup'
    }]
  },
  {
    menu: '数据分析',
    defaultDock: false,
    permissionCode: 'workhours',
    icon: '&#xea06;',
    subMenu: [{
      menu: '工时统计',
      route: '/WorkingHours',
      key: 'workingHours',
      permissionCode: 'workhours_lookup'
    }, ]
  },
  {
    menu: '基础数据',
    defaultDock: false,
    permissionCode: 'collaboration',
    icon: '&#xe6a5;',
    subMenu: [{
      menu: '合作单位',
      route: '/Subcontract',
      key: 'Subcontract',
      permissionCode: 'collaboration_col_lookup'
    }, {
      menu: '留言反馈',
      route: '/Feedback',
      key: 'Feedback',
      permissionCode: 'advise_list_lookup'
    }]
  },
  // {
  //   menu: '留言反馈',
  //   defaultDock: false,
  //   permissionCode: 'advise',
  //   icon: '&#xe65f;',
  //   subMenu: [, ]
  // },
  {
    menu: '系统配置',
    defaultDock: false,
    permissionCode: 'systemSet',
    icon: '&#xe606;',
    subMenu: [{
        menu: '组织机构',
        route: '/Organization',
        key: 'organization',
        permissionCode: 'system_org_lookup'
      },
      {
        menu: '模块自定义',
        route: '/ModuleCustomization',
        key: 'ModuleCustomization',
        permissionCode: 'ModuleCustomization'
      },

      {
        menu: '角色权限',
        route: '/Authority',
        key: 'authority',
        permissionCode: 'system_role_list_lookup'
      }, {
        menu: '权限添加',
        route: '/Authority/AddAuthority',
        key: 'addAuthority',
        visible: true,
        permissionCode: 'role_add_lookup'
      }, {
        menu: '权限修改',
        routeReg: /^\/Authority\/EditAuthority\/\w{1,}$/i,
        key: 'editAuthority',
        visible: true,
        permissionCode: 'role_update_lookup'
      },
    ]
  }
]
