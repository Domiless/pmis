//主要为全部菜单结构和权限的配置，visible=true不在菜单显示，defaultDock=true会跳过lookUp权限默认在菜单显示
//permissionCode为权限映射码，若permissionCode未对应到用户权限则不显示也无跳转访问权限
//route和routeReg为匹配路由，二者必须有一个，若都有则为“或”逻辑
export default [{
  menu: '系统管理',
  permissionCode: 'system',
  icon: '&#xe60a;',
  defaultDock: true,
  subMenu: [{
      menu: '流程管理',
      route: '/FlowPath',
      key: 'FlowPath',
      permissionCode: 'workdesk_desk_lookup',
    },

  ]
}, ]
