import type { FormData } from '@/types/formData'

// TODO: 移除info, 忘记当初为啥要维护这一坨了, 还是直接写组件里面好看

export const formInfoData: Record<string, any> = {
  configLevel: {
    options: [
      {
        value: 'beginner',
        label: '新手',
      },
      {
        value: 'intermediate',
        label: '初学者',
      },
      {
        value: 'advanced',
        label: '中级',
      },
      {
        value: 'expert',
        label: '高级',
      },
    ],
    'data-help': '为不同人群展示不同的配置项, 减少上手难度跟配置过多而产生的恐惧',
  },
  company: {
    label: '公司名',
    'data-help': '公司名排除或包含在集合中，模糊匹配，可用于只投或不投某个公司/子公司。',
  },
  jobTitle: {
    label: '岗位名',
    'data-help': '岗位名排除或包含在集合中，模糊匹配，可用于只投或不投某个岗位名。',
  },
  jobContent: {
    label: '工作内容',
    'data-help':
      "会自动检测上文(不是,不,无需),下文(系统,工具),例子：[外包,上门,销售,驾照], 排除: '外包岗位', 不排除: '不是外包'|'销售系统'",
  },
  hrPosition: {
    label: 'Hr职位',
    'data-help':
      'Hr职位一定包含/排除在集合中，精确匹配, 不在内置中可手动输入,能实现只向经理等进行投递，毕竟人事干的不一定是人事',
  },
  jobAddress: {
    label: '工作地址',
    'data-help': '只能为包含模式, 即投递工作地址当中必须包含当前内容中的任意一项，否则排除',
  },
  customGreeting: {
    label: '自定义招呼语',
    'data-help':
      '因为boss不支持将自定义的招呼语设置为默认招呼语。开启表示发送boss默认的招呼语后还会发送自定义招呼语',
  },
  greetingVariable: {
    label: '招呼语变量',
    'data-help': '使用mitem模板引擎来对招呼语进行渲染;',
  },
  hrActivityFilter: {
    label: 'HR活跃过滤',
    'data-help':
      '按HR本人的活跃状态过滤。HR不上线意味着招呼语没人看，这是最能避免浪费每天100次机会的一档。平台对HR只给文案不给时间戳，所以档位最细只能到「14天内」。',
  },
  companyActivityFilter: {
    label: '公司活跃过滤',
    'data-help':
      '按公司(品牌)的活跃时间过滤。注意公司活跃不等于HR活跃：大公司常年有人维护，但具体对接的HR可能几个月没登录，建议配合HR活跃过滤一起用。',
  },
  jobActivityFilter: {
    label: '职位更新过滤',
    'data-help':
      '按职位最后更新时间过滤，用于剔除长期挂着不动的陈旧岗位。这一判定在拉取岗位详情之前完成，能省下一次详情请求。平台不保证返回该时间，取不到时不过滤。',
  },
  goldHunterFilter: {
    label: '猎头过滤',
    'data-help':
      'Boss中有一些猎头发布的工作，但是一般而言这种工作不太行，点击可以过滤猎头发布的职位',
  },
  friendStatus: {
    label: '好友过滤(已聊)',
    'data-help': '判断和hr是否建立过聊天，理论上能过滤的同hr，但是不同岗位的工作',
  },
  bossGoldMedalHr: {
    label: '过滤金牌面试官',
    'data-help': '通过头像框来判断是否是金牌面试官, 据小红书经验 金牌面试官多数是刷kpi,并不靠谱',
  },
  sameCompanyFilter: {
    label: '相同公司过滤',
    'data-help':
      '投递成功后会将公司 ID 存储到浏览器本地，避免再次投递同一公司的不同岗位。旧版本按岗位 ID 记录的历史不会命中，可按需清除后重新积累。',
  },
  sameHrFilter: {
    label: '相同Hr过滤',
    'data-help':
      '投递成功后会将 HR ID 存储到浏览器本地，避免再次投递同一 HR 发布的不同岗位。旧版本按岗位 ID 记录的历史不会命中，可按需清除后重新积累。',
  },
  aiGreeting: {
    label: 'AI招呼语',
    'data-help':
      '即使前面招呼语开了也不会发送，只会发送AI生成的招呼语，让gpt来打招呼真是太棒了，毕竟开场白很重要。',
  },
  aiFiltering: {
    label: 'AI过滤',
    'data-help': '根据工作内容让gpt分析过滤，真是太稳健了，不放过任何一个垃圾',
  },
  aiReply: {
    label: 'AI回复',
    'data-help': '万一消息太多，回不过来了呢. 功能暂未实现',
  },
  record: {
    label: '内容记录',
    'data-help': '拿这些数据去训练个Ai岂不是美滋滋咯？',
  },
  amap: {
    enable: {
      label: '启用',
      'data-help': '启用高德地图, 用于获取工作地址的距离和时间进行筛选，需要配置自己的key',
    },
    key: {
      label: '高德地图key',
      'data-help': '高德地图key, 需要自己申请',
    },
    origins: {
      label: '起点经纬度',
      'data-help': '起点经纬度, 经度和纬度用","分隔, 可以输入完整地址点击按钮自动获取',
    },
    straightDistance: {
      label: '直线距离',
      'data-help': '直线距离, 为0禁用，单位: km',
    },
    drivingDistance: {
      label: '驾车距离',
      'data-help':
        '驾车距离, 为0禁用，会考虑当前时间的路况，不同时间结果不一样，策略为"速度优先", 单位: km',
    },
    drivingDuration: {
      label: '驾车时间',
      'data-help':
        '驾车时间, 为0禁用，会考虑当前时间的路况，不同时间结果不一样，策略为"速度优先", 单位: 分钟',
    },
    walkingDistance: {
      label: '步行距离',
      'data-help': '步行距离, 为0禁用，单位: km',
    },
    walkingDuration: {
      label: '步行时间',
      'data-help': '步行时间, 为0禁用，单位: 分钟',
    },
  },
}

export const defaultFormData: FormData = {
  configLevel: 'beginner',
  company: {
    include: false,
    value: [],
    options: [],
    enable: false,
  },
  jobTitle: {
    include: true,
    value: [],
    options: [],
    enable: false,
  },
  jobContent: {
    include: false,
    value: [],
    options: [],
    enable: false,
  },
  hrPosition: {
    include: true,
    value: [],
    options: ['经理', '主管', '法人', '人力资源主管', 'hr', '招聘专员'],
    enable: false,
  },
  jobAddress: {
    value: [],
    options: [],
    enable: false,
    include: true,
  },
  salaryRange: {
    value: [8, 13, false],
    advancedValue: {
      // 默认全部关闭，避免用户未配置而投递错误岗位
      H: [0, 1, false],
      D: [0, 1, false],
      M: [0, 1, false],
    },
    enable: false,
  },
  companySizeRange: {
    value: [500, 2000, true],
    enable: false,
  },
  customGreeting: {
    value: '',
    enable: false,
  },
  deliveryLimit: {
    value: 120,
  },
  greetingVariable: {
    value: false,
  },
  hrActivityFilter: {
    value: false,
    expire: 14 * 24 * 60 * 60 * 1000,
  },
  companyActivityFilter: {
    value: false,
    expire: 30 * 24 * 60 * 60 * 1000,
  },
  jobActivityFilter: {
    value: false,
    expire: 30 * 24 * 60 * 60 * 1000,
  },
  friendStatus: {
    value: true,
  },
  bossGoldMedalHr: {
    value: false,
  },
  sameCompanyFilter: {
    value: false,
    expire: 0,
  },
  sameHrFilter: {
    value: true,
    expire: 0,
  },
  goldHunterFilter: {
    value: false,
  },
  notification: {
    value: true,
  },
  useCache: {
    value: false,
  },
  aiGreeting: {
    enable: false,
    prompt: [
      {
        role: 'system',
        content: `## 角色
  求职小能手
  
  ## input：
  1 **求职者信息**
  \`\`\`
  1. ....
  2. ....
  3. ....
  \`\`\`
  
  ## outputformat
  招呼语字符串，无书信格式和前缀，和聊天开场白一样的介绍求职者`,
      },
      {
        role: 'user',
        content: `### 待处理的岗位信息:\`\`\`
  <岗位信息>
  岗位名:{{ jobData.jobName }}   薪资: {{ jobData.salary }}
  学历要求: {{ jobData.degreeName }}
  技能要求: {{ jobData.skills }}
  岗位标签:{{ jobData.jobLabels }}
    <岗位描述>
    {{ jobData.jobDescription }}
    <岗位描述/>
  </岗位信息>
  \`\`\``,
      },
    ],
  },
  aiFiltering: {
    enable: false,
    prompt: [
      {
        role: 'system',
        content: `## 角色
  求职评委
  
  最终返回下面格式的JSON字符串,不要有任何其他字符
  
  interface aiFilteringItem {
    reason: string; // 扣分或加分的理由
    score: number ; // 分数变化 正整数 不需要+-正负符号
  }
  
  interface aiFiltering {
    negative: aiFilteringItem[]; // 扣分项
    positive: aiFilteringItem[] ; // 加分项
  }
  
  ## 求职者需求
  - 加分: 双休,早九晚五,新技术,机会多,年轻人多 每个加分项 10分
  - 扣分: 需要上门,福利少,需要和客户交流,需要推销 每个扣分项 10分
  `,
      },
      {
        role: 'user',
        content: `## 待处理的岗位信息:
  <岗位信息>
  岗位名:{{ jobData.jobName }}   薪资: {{ jobData.salary }}
  学历要求: {{ jobData.degreeName }}    工作经验要求: {{ jobData.experienceName }}
  福利列表: {{ jobData.welfareList }}
  技能要求: {{ jobData.skills }}
  岗位标签:{{ jobData.jobLabels }}
    <岗位描述>
    {{ jobData.jobDescription }}
    <岗位描述/>
  </岗位信息>`,
      },
    ],
    score: 10,
  },
  aiReply: {
    enable: false,
    prompt: [{ role: 'user', content: '帮我写一个回复的提示' }],
  },
  amap: {
    key: '',
    origins: '',
    straightDistance: 0,
    drivingDistance: 0,
    drivingDuration: 0,
    walkingDistance: 0,
    walkingDuration: 0,
    enable: false,
  },
  record: {
    enable: false,
  },
  delayDeliveryStarts: 3,
  delayDeliveryInterval: 5,
  delayDeliveryPageNext: 60,
  delayMessageSending: 2,
  version: '20260718',
}
