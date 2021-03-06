//主要为全部菜单结构和权限的配置，visible=true不在菜单显示，defaultDock=true会跳过lookUp权限默认在菜单显示
//permissionCode为权限映射码，若permissionCode未对应到用户权限则不显示也无跳转访问权限
//route和routeReg为匹配路由，二者必须有一个，若都有则为“或”逻辑
export default [
    {
        menu: '统计报表',
        permissionCode: 'statistics',
        icon: '&#xe60a;',
        defaultDock: false,
        subMenu: [{
            menu: '入库单汇总表',
            route: '/putInSummaryStatement',
            key: 'putInSummaryStatement',
            permissionCode: 'order_lookup',
        },
        {
            menu: '入库明细表',
            route: '/putInDetails',
            key: 'putInDetails',
            permissionCode: 'order_lookup',
        },
        {
            menu: '出库单汇总表',
            route: '/outboundSummaryStatement',
            key: 'outboundSummaryStatement',
            permissionCode: 'order_lookup',
        },
        {
            menu: '出库明细表',
            route: '/outboundDetails',
            key: 'OutboundDetails',
            permissionCode: 'order_lookup',
        },
        {
            menu: '盘点明细表',
            route: '/InventoryDetails',
            key: 'InventoryDetails',
            permissionCode: 'order_lookup',
        },
        {
            menu: '调拨明细表',
            route: '/requisitionDetails',
            key: 'requisitionDetails',
            permissionCode: 'order_lookup',
        },
        ]
    },
    {
        menu: '基础设置',
        permissionCode: 'warehouse',
        icon: '&#xe60a;',
        defaultDock: false,
        subMenu: [{
            menu: '仓库列表',
            route: '/warehouse',
            key: 'warehouse',
            permissionCode: 'order_lookup',
        },
        // {
        //     menu: '库存单位',
        //     route: '/unit',
        //     key: 'unit',
        //     permissionCode: 'order_lookup',
        // },
        {
            menu: '库位管理',
            route: '/location',
            key: 'location',
            permissionCode: 'order_lookup',
        },
        {
            menu: '分类管理',
            route: '/classify',
            key: 'classify',
            permissionCode: 'order_lookup',
        },
        ]
    },
    {
        menu: '入库管理',
        permissionCode: 'putInStorage',
        icon: '&#xe60a;',
        defaultDock: false,
        subMenu: [{
            menu: '采购入库单',
            route: '/procurementStock',
            key: 'procurementStock',
            permissionCode: 'order_lookup',
        },
        {
            menu: '生产入库单',
            route: '/productionStock',
            key: 'productionStock',
            permissionCode: 'order_lookup',
        },
        {
            menu: '退料入库单',
            route: '/backStock',
            key: 'backStock',
            permissionCode: 'order_lookup',
        },
        {
            menu: '退料入库新增',
            route: '/backStock/addBackStock',
            key: 'addBackStock',
            visible: true,
            permissionCode: 'order_lookup',
        },
        {
            menu: '退料入库修改',
            routeReg: /^\/backStock\/editBackStock\/\w{1,}$/i,
            key: 'editBackStock',
            visible: true,
            permissionCode: 'order_lookup',
        },
        {
            menu: '其它入库单',
            route: '/otherStock',
            key: 'otherStock',
            permissionCode: 'order_lookup',
        },
        {
            menu: '其它入库新增',
            route: '/otherStock/addOtherStock',
            key: 'addOtherStock',
            visible: true,
            permissionCode: 'order_lookup',
        },
        {
            menu: '其它入库修改',
            routeReg: /^\/otherStock\/editOtherStock\/\w{1,}$/i,
            key: 'editOtherStock',
            visible: true,
            permissionCode: 'order_lookup',
        },
        ]
    },
    {
        menu: '出库管理',
        permissionCode: 'putOutStorage',
        icon: '&#xe60a;',
        defaultDock: false,
        subMenu: [{
            menu: '领料出库单',
            route: '/picking',
            key: 'picking',
            permissionCode: 'order_lookup',
        },
        {
            menu: '领料新增',
            route: '/picking/add',
            key: 'pickingAdd',
            visible: true,
            permissionCode: 'order_lookup'
        },
        {
            menu: '领料修改',
            routeReg: /^\/picking\/edit\/\w{1,}$/i,
            key: 'pickingEdit',
            visible: true,
            permissionCode: 'order_lookup'
        },
        {
            menu: '销售出库单',
            route: '/market',
            key: 'market',
            permissionCode: 'order_lookup',
        },
        {
            menu: '销售新增',
            route: '/market/add',
            key: 'marketAdd',
            visible: true,
            permissionCode: 'order_lookup'
        },
        {
            menu: '销售修改',
            routeReg: /^\/market\/edit\/\w{1,}$/i,
            key: 'pickingEdit',
            visible: true,
            permissionCode: 'order_lookup'
        },
        {
            menu: '采购退货单',
            route: '/purchaseReturn',
            key: 'purchaseReturn',
            permissionCode: 'order_lookup',
        },
        {
            menu: '采购退货新增',
            route: '/purchaseReturn/add',
            key: 'purchaseReturnAdd',
            visible: true,
            permissionCode: 'order_lookup'
        },
        {
            menu: '采购退货修改',
            routeReg: /^\/purchaseReturn\/edit\/\w{1,}$/i,
            key: 'pickingEdit',
            visible: true,
            permissionCode: 'order_lookup'
        },
        {
            menu: '其它出库单',
            route: '/others',
            key: 'others',
            permissionCode: 'order_lookup',
        },
        {
            menu: '其它新增',
            route: '/others/add',
            key: 'othersAdd',
            visible: true,
            permissionCode: 'order_lookup'
        },
        {
            menu: '其它修改',
            routeReg: /^\/others\/edit\/\w{1,}$/i,
            key: 'pickingEdit',
            visible: true,
            permissionCode: 'order_lookup'
        },
        ]
    },
    {
        menu: '库存管理',
        permissionCode: 'storageManage',
        icon: '&#xe60a;',
        defaultDock: false,
        subMenu: [{
            menu: '库存列表',
            route: '/storageList',
            key: 'storageList',
            permissionCode: 'order_lookup',
        },
        {
            menu: '库存盘点',
            route: '/storageCheck',
            key: 'storageCheck',
            permissionCode: 'order_lookup',
        },
        {
            menu: '库存盘点新增',
            route: '/storageCheck/addStorageCheck',
            key: 'addBackStock',
            visible: true,
            permissionCode: 'order_lookup',
        },
        {
            menu: '库存盘点修改',
            routeReg: /^\/storageCheck\/editStorageCheck\/\w{1,}$/i,
            key: 'editStorageCheck',
            visible: true,
            permissionCode: 'order_lookup',
        },
        {
            menu: '库存调拨',
            route: '/storageAllot',
            key: 'storageAllot',
            permissionCode: 'order_lookup',
        },
        {
            menu: '库存调拨新增',
            route: '/storageAllot/addStorageAllot',
            key: 'addStorageAllot',
            visible: true,
            permissionCode: 'order_lookup',
        },
        {
            menu: '库存调拨修改',
            routeReg: /^\/storageAllot\/editStorageAllot\/\w{1,}$/i,
            key: 'editStorageAllot',
            visible: true,
            permissionCode: 'order_lookup',
        },
        {
            menu: '库存调拨通知单',
            route: '/storageAllotInform',
            key: 'storageAllotInform',
            permissionCode: 'order_lookup',
        },
        ]
    },

]