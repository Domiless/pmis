//主要为全部菜单结构和权限的配置，visible=true不在菜单显示，defaultDock=true会跳过lookUp权限默认在菜单显示
//permissionCode为权限映射码，若permissionCode未对应到用户权限则不显示也无跳转访问权限
//route和routeReg为匹配路由，二者必须有一个，若都有则为“或”逻辑
export default [{
  menu: '采购管理',
  permissionCode: 'procurement',
  icon: '&#xe60a;',
  defaultDock: false,
  subMenu: [{
    menu: '供应商管理',
    route: '/supplierManage',
    key: 'supplierManage',
    permissionCode: 'supplier_lookup',
  },
  {
    menu: '询价',
    route: '/enquiry',
    key: 'enquiry',
    permissionCode: 'shop_lookup',
  },
  {
    menu: '报审单',
    route: '/declaration',
    key: 'declaration',
    permissionCode: 'shop_lookup',
  },
  // {
  //   menu: '采购列表',
  //   route: '/procurement',
  //   key: 'procurement',
  //   permissionCode: 'shop_lookup',
  // },
  {
    menu: '采购合同',
    route: '/procurementContractManage',
    key: 'procurementContractManage',
    permissionCode: 'shopcontract_lookup',
  },
  {
    menu: '合同管理',
    route: '/contractManage',
    key: 'contractManage',
    permissionCode: 'contractmodel_lookup',
  },
  {
    menu: '计量单位',
    route: '/measureUnit',
    key: 'measureUnit',
    permissionCode: 'unit_lookup',
  },
  {
    menu: '采购员',
    route: '/buyer',
    key: 'buyer',
    permissionCode: 'unit_lookup',
  },
  {
    menu: '采购计划',
    route: '/procurementPlan',
    key: 'procurementPlan',
    permissionCode: 'unit_lookup',
  },

  ]
},]
