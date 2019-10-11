//主要为全部菜单结构和权限的配置，visible=true不在菜单显示，defaultDock=true会跳过lookUp权限默认在菜单显示
//permissionCode为权限映射码，若permissionCode未对应到用户权限则不显示也无跳转访问权限
//route和routeReg为匹配路由，二者必须有一个，若都有则为“或”逻辑
export default [{
  menu: '订单管理',
  permissionCode: 'workdesk',
  icon: '&#xe60a;',
  defaultDock: true,
  subMenu: [{
    menu: '订单列表',
    route: '/orderManage',
    key: 'orderManage',
    permissionCode: 'workdesk_desk_lookup',
  }, ]
}, ]
