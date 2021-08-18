const routes = [
  {
    path: '/',
    name: "blank",
    component: () => import('pages/blank/Index'),
  },
  {
    path: '/home',
    name: "home",
    meta: {
      title: "健身教练App"
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/home/Index')}
    ]
  },
  {
    path: '/login',
    name: "登录",
    component: () => import('pages/login/Index'),
  },
  {
    path: '/main',
    component: () => import('layouts/CommonLayout'),
    children: [
      {
        path: 'coach/course',
        name: "course",
        meta: {
          title: "我的课程"
        },
        component: () => import('pages/mine/course/Index'),
      },
      {
        path: 'coach/appointment',
        name: "appointment",
        meta: {
          title: "所有预约"
        },
        component: () => import('pages/mine/appointment/Index'),
      },
      {
        path: 'coach/customer',
        name: "customer",
        meta: {
          title: "我的客户"
        },
        component: () => import('pages/mine/customer/Index')
      },
      {
        path: 'coach/achievement',
        name: "achievement",
        meta: {
          title: "业绩进度"
        },
        component: () => import('pages/mine/achievement/Index')
      },
      {
        path: 'coach/info',
        name: "info",
        meta: {
          title: "个人信息"
        },
        component: () => import('pages/mine/info/Index')
      },
      {
        path: 'coach/changePassword',
        name: "password",
        meta: {
          title: "修改密码"
        },
        component: () => import('pages/mine/changePassword/Index')
      },
      {
        path: 'about',
        name: "about",
        meta: {
          title: "关于"
        },
        component: () => import('pages/mine/about/Index')
      },
      {
        path: 'setting',
        name: "setting",
        meta: {
          title: "设置"
        },
        component: () => import('pages/mine/setting/Index')
      },
      {
        path: 'customer/list',
        name: "customerList",
        meta: {
          title: "客户列表"
        },
        component: () => import('pages/menu/customer/customerList/Index')
      },
      {
        path: 'customer/detail',
        name: "customerDetail",
        meta: {
          title: "客户详情"
        },
        component: () => import('pages/menu/customer/customerDetail/Index')
      },
      {
        path: 'customer/bodyTest',
        name: "customerBodyTest",
        meta: {
          title: "顾客体测数据"
        },
        component: () => import('pages/menu/customer/customerDetail/CustomerBodyTestPage'),
      },
      {
        path: 'customer/bodyStatus',
        name: "customerBodyStatus",
        meta: {
          title: "顾客体态数据"
        },
        component: () => import('pages/menu/customer/customerDetail/CustomerBodyStatusPage'),
      },
      {
        path: 'customer/dietPlan',
        name: "customerDietPlan",
        meta: {
          title: "顾客饮食计划"
        },
        component: () => import('pages/menu/customer/customerDetail/CustomerDietPlanPage'),
      },
      {
        path: 'customer/trainingGoal',
        name: "customerTrainingGoal",
        meta: {
          title: "顾客训练目标"
        },
        component: () => import('pages/menu/customer/customerDetail/CustomerTrainingGoalPage'),
      },
      {
        path: 'customer/customerPlan',
        name: "customerPlan",
        meta: {
          title: "顾客训练计划"
        },
        component: () => import('pages/menu/customer/customerDetail/CustomerPlanPage'),
      },
      {
        path: 'customer/form',
        name: "customerForm",
        meta: {
          title: "添加客户"
        },
        component: () => import('pages/menu/customer/customerForm/Index')
      },
      {
        path: 'customer/assignment',
        name: "customerAssignment",
        meta: {
          title: "客户辅助"
        },
        component: () => import('pages/menu/customer/customerAssignment/Index')
      },
      {
        path: 'classAssignment',
        name: "classAssignment",
        meta: {
          title: "课程辅导"
        },
        component: () => import('pages/menu/classAssignment/Index')
      },
      {
        path: 'classAssignment/detail',
        name: "classAssignmentDetail",
        meta: {
          title: "课程辅导详情"
        },
        component: () => import('pages/menu/classAssignment/assignmentDetail/Index')
      },
      {
        path: 'classAssignment/summary',
        name: "classAssignmentSummary",
        meta: {
          title: "课程辅导总结"
        },
        component: () => import('pages/menu/classAssignment/assignmentSummary/Index')
      },
      {
        path: 'diet/management',
        name: "diet",
        meta: {
          title: "饮食管理"
        },
        component: () => import('pages/menu/diet/dietManagement/Index')
      },
      {
        path: 'plan/equipment',
        name: "equipment",
        meta: {
          title: "器材管理"
        },
        component: () => import('pages/menu/plan/equipment/Index')
      },
      {
        path: 'plan/action',
        name: "action",
        meta: {
          title: "动作管理"
        },
        component: () => import('pages/menu/plan/action/Index'),
        children: [
          {
            path: 'type',
            name: "actionType",
            meta: {
              title: "动作分类"
            },
            component: () => import('components/action/ActionType')
          },
          {
            path: 'detail',
            name: "actionDetail",
            meta: {
              title: "动作详情"
            },
            component: () => import('components/action/ActionDetail')
          },
        ]
      },
      {
        path: 'plan/class/management',
        name: "classManagement",
        meta: {
          title: "课程维护"
        },
        component: () => import('pages/menu/plan/classManagement/Index')
      },
      {
        path: 'plan/template',
        name: "planTemplate",
        meta: {
          title: "训练计划模板"
        },
        component: () => import('pages/menu/plan/template/Index')
      }

    ],

  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
