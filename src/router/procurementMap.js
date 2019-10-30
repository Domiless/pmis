//主要为全部菜单结构和权限的配置，visible=true不在菜单显示，defaultDock=true会跳过lookUp权限默认在菜单显示
//permissionCode为权限映射码，若permissionCode未对应到用户权限则不显示也无跳转访问权限
//route和routeReg为匹配路由，二者必须有一个，若都有则为“或”逻辑
export default [{
  menu: '采购管理',
  permissionCode: 'procurement',
  icon: '&#xe60a;',
  defaultDock: true,
  subMenu: [{
      menu: '供应商管理',
      route: '/supplierManage',
      key: 'supplierManage',
      permissionCode: 'workdesk_desk_lookup',
    },
    {
      menu: '采购列表',
      route: '/procurement',
      key: 'procurement',
      permissionCode: 'workdesk_desk_lookup',
    },

    {
      menu: '采购合同',
      route: '/procurementContractManage',
      key: 'procurementContractManage',
      permissionCode: 'workdesk_desk_lookup',
    },
    {
      menu: '合同管理',
      route: '/contractManage',
      key: 'contractManage',
      permissionCode: 'workdesk_desk_lookup',
    },
    {
      menu: '计量单位',
      route: '/measureUnit',
      key: 'measureUnit',
      permissionCode: 'workdesk_desk_lookup',
    }
  ]
}, ]
