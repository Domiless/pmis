//主要为全部菜单结构和权限的配置，visible=true不在菜单显示，defaultDock=true会跳过lookUp权限默认在菜单显示
//permissionCode为权限映射码，若permissionCode未对应到用户权限则不显示也无跳转访问权限
//route和routeReg为匹配路由，二者必须有一个，若都有则为“或”逻辑
export default [{
  menu: '系统管理',
  permissionCode: 'system',
  icon: '&#xe60a;',
  defaultDock: false,
  subMenu: [{
      menu: '组织机构',
      route: '/Organization',
      key: 'organization',
      permissionCode: 'organize_lookup'
    },
    // {
    //   menu: '模块自定义',
    //   route: '/ModuleCustomization',
    //   key: 'ModuleCustomization',
    //   permissionCode: 'ModuleCustomization'
    // },
    {
      menu: '角色权限',
      route: '/Authority',
      key: 'authority',
      permissionCode: 'role_lookup'
    },
    {
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
    {
      menu: '员工列表',
      route: '/Employee',
      key: 'employee',
      permissionCode: 'employee_lookup'
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
    {
      menu: '合作单位',
      route: '/Subcontract',
      key: 'Subcontract',
      permissionCode: 'cooperate_lookup'
    },
    {
      menu: '留言反馈',
      route: '/Feedback',
      key: 'Feedback',
      permissionCode: 'advise_lookup'
    },
    {
      menu: '流程管理',
      route: '/FlowPath',
      key: 'FlowPath',
      permissionCode: 'process_lookup',
    },
    {
      menu: '消息管理',
      route: '/Message',
      key: 'Message',
      permissionCode: 'message_lookup',
    },
    {
      menu: '小黑板',
      route: '/Blackboard',
      key: 'Blackboard',
      permissionCode: 'blackborad_lookup',
    },
    {
      menu: '系统日志',
      route: '/log',
      key: 'log',
      permissionCode: 'blackborad_lookup',
    },
  ]
}, ]
