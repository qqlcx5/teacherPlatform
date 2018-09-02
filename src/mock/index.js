import Mock from 'mockjs'

Mock.setup({
  timeout: 400
})

Mock.mock(/\/routes$/, 'get', {
  errorCode: 200,
  success: true,
  message: '查询成功！',
  data: [
    {
      path: '/',
      redirect: '/question'
    },
    {
      path: '/dtextbook',
      name: 'DTextBook',
      redirect: '/dtextbook/index',
      componentPath: 'layout/Main',
      meta: {
        title: '双师教材',
        isMenu: 1,
        noDropdown: true,
        icon: 'tb'
      },
      children: [
        {
          path: '/dtextbook/index',
          name: 'DTextBook_index',
          meta: {
            title: '教材列表',
            isMenu: 0,
            noBreadCrumb: true
          },
          componentPath: 'dtextbook/list/index'
        },
        {
          path: '/dtextbook/:id',
          name: 'DTextBook_detail',
          meta: {
            title: '教材详情',
            isMenu: 0
          },
          componentPath: 'dtextbook/detail/index'
        },
        {
          path: '/dtextbook/:id/chapter/:chapterId/mainTeachingCase/:lectureId',
          name: 'DTextBook_detail_mainTeachingCase',
          meta: {
            title: '教材编辑',
            isMenu: 0
          },
          componentPath: 'material/index'
        }
      ]
    },
    {
      path: '/textbook',
      name: 'TextBook',
      redirect: '/textbook/index',
      componentPath: 'layout/Main',
      meta: {
        title: '精品教材',
        isMenu: 1,
        noDropdown: true,
        icon: 'tb'
      },
      children: [
        {
          path: '/textbook/index',
          name: 'TextBook_index',
          meta: {
            title: '精品教材',
            isMenu: 0,
            noBreadCrumb: true
          },
          componentPath: 'textbook/Index'
        },
        {
          path: '/textbook/index/:id',
          name: 'TextBook_detail',
          meta: {
            title: '教材详情',
            isMenu: 0
          },
          componentPath: 'textbook/Detail/index'
        }
      ]
    },
    {
      path: '/question',
      name: 'Question',
      redirect: '/question/index',
      componentPath: 'layout/Main',
      meta: {
        title: '题库',
        isMenu: 1,
        noDropdown: true,
        icon: 'qu'
      },
      children: [
        {
          path: '/question/index',
          name: 'Question_index',
          meta: {
            title: '题库',
            isMenu: 0,
            noBreadCrumb: true
          },
          componentPath: 'question/Index'
        }
      ]
    },
    {
      path: '/paper',
      name: 'Paper',
      redirect: '/paper/index',
      componentPath: 'layout/Main',
      meta: {
        title: '试卷库',
        isMenu: 1,
        noDropdown: true,
        icon: 'pap'
      },
      children: [
        {
          path: '/paper/index',
          name: 'Paper_index',
          meta: {
            title: '试卷库',
            isMenu: 0,
            noBreadCrumb: true
          },
          componentPath: 'paper/Index'
        },
        {
          path: '/paper/:id',
          name: 'Paper_detail',
          meta: {
            title: '试卷详情',
            isMenu: 0
          },
          componentPath: 'paper/Detail'
        }
      ]
    },
    {
      path: '/lectureLib',
      name: 'LectureLib',
      redirect: '/lectureLib/index',
      componentPath: 'layout/Main',
      meta: {
        title: '讲义库',
        isMenu: 1,
        noDropdown: true,
        icon: 'lec'
      },
      children: [
        {
          path: '/lectureLib/index',
          name: 'LectureLib_index',
          meta: {
            title: '讲义库',
            isMenu: 0,
            noBreadCrumb: true
          },
          componentPath: 'lecture-lib/Index'
        },
        {
          path: '/lectureLib/:lectureId',
          name: 'LectureLib_detail',
          meta: {
            title: '预览讲义',
            isMenu: 0
          },
          componentPath: 'lecture/groupLecture/SecondStep'
        }
      ]
    },
    {
      path: '/myCenter',
      name: 'myCenter',
      componentPath: 'layout/Main',
      meta: {
        title: '个人中心',
        isMenu: 1,
        icon: 'per'
      },
      children: [
        {
          path: '/myCenter/mylecture',
          name: 'mylecture',
          meta: {
            title: '我的资料库',
            isMenu: 1
          },
          redirect: '/myCenter/mylecture/index',
          componentPath: 'layout/RouteView',
          children: [
            {
              path: '/myCenter/mylecture/index',
              name: 'lecture_index',
              meta: {
                title: '讲义列表',
                isMenu: 0,
                noBreadCrumb: true
              },
              componentPath: 'lecture/Index'
            },
            {
              path: '/myCenter/groupLecture/:lectureId',
              name: 'groupLecture',
              meta: {
                title: '组讲义',
                isMenu: 0
              },
              componentPath: 'lecture/groupLecture/SecondStep'
            },
            {
              path: '/myCenter/lecturePreview/:lectureId',
              name: 'PreviewLecture',
              meta: {
                title: '预览讲义',
                isMenu: 0
              },
              componentPath: 'lecture/groupLecture/SecondStep'
            },
            {
              path: '/myCenter/mylecture/SetPoint',
              name: 'lecture_set_point',
              meta: {
                title: '设定知识点',
                isMenu: 0
              },
              componentPath: 'lecture/group/SetPoint'
            },
            {
              path: '/myCenter/mylecture/:lectureId/SetPoint',
              name: 'lecture_set_point_edit',
              meta: {
                title: '编辑设定知识点',
                isMenu: 0
              },
              componentPath: 'lecture/group/SetPoint'
            },
            {
              path: '/myCenter/mylecture/:lectureId/Explain',
              name: 'lecture_explain',
              meta: {
                title: '添加引入，框图',
                isMenu: 0
              },
              componentPath: 'lecture/group/Explain'
            },
            {
              path: '/myCenter/mylecture/:lectureId/PointDescription',
              name: 'lecture_description',
              meta: {
                title: '添加描述，总结',
                isMenu: 0
              },
              componentPath: 'lecture/group/PointDescription'
            },
            {
              path: '/myCenter/mylecture/:lectureId/ExercisesAndPointItems',
              name: 'lecture_exercises_items',
              meta: {
                title: '添加例题，练习题',
                isMenu: 0
              },
              componentPath: 'lecture/group/ExercisesAndPointItems'
            },
            {
              path: '/myCenter/mylecture/:lectureId/Finish',
              name: 'lecture_finish',
              meta: {
                title: '组讲义成功',
                isMenu: 0
              },
              componentPath: 'lecture/group/Finish'
            },
            {
              path: '/myCenter/lecture_my/:lectureId/Preview',
              name: 'lecture_preview',
              meta: {
                title: '预览讲义',
                isMenu: 0
              },
              componentPath: 'lecture/groupLecture/SecondStep'
            },
            {
              path: '/lecture/knowledgeImport',
              name: 'lecture_knowledge_import',
              meta: {
                title: '我的知识引入',
                isMenu: 0
              },
              componentPath: 'lecture/KnowledgeImport'
            },
            {
              path: '/lecture/knowledgeSumary',
              name: 'lecture_knowledge_sumary',
              meta: {
                title: '我的知识总结',
                isMenu: 0
              },
              componentPath: 'lecture/KnowledgeSumary'
            },
            {
              path: '/lecture/lecture-suite',
              name: 'lecture_suite',
              meta: {
                title: '讲义套件',
                isMenu: 0
              },
              componentPath: 'lecture/LectureSuite'
            },
            {
              path: '/lecture/lecture-suite/:id',
              name: 'lecture_suite_detail',
              meta: {
                title: '讲义套件详情',
                isMenu: 0
              },
              componentPath: 'lecture/LectureSuiteDetail'
            },
            {
              path: '/lecture/lecture-suite/:id/edit',
              name: 'lecture_suite_edit',
              meta: {
                title: '讲义套件编辑',
                isMenu: 0
              },
              componentPath: 'lecture/LectureSuiteDetail'
            },
            {
              path: '/my/paper',
              name: 'my_paper',
              meta: {
                title: '我的试卷',
                isMenu: 0
              },
              componentPath: 'paper/list'
            },
            {
              path: '/my/paper/:id',
              name: 'my_paper_detail',
              meta: {
                title: '试卷详情',
                isMenu: 0
              },
              componentPath: 'paper/Detail'
            },
            {
              path: '/paper-basket',
              name: 'Paper_basket',
              meta: {
                title: '组卷',
                isMenu: 0
              },
              componentPath: 'paper/basket/index'
            }
          ]
        },
        {
          path: '/lecture/DraftList',
          name: 'lecture_draft_list',
          meta: {
            title: '草稿箱副本',
            isMenu: 0
          },
          componentPath: 'lecture/DraftList'
        },
        {
          path: '/draft',
          name: 'draft',
          meta: {
            title: '草稿箱',
            isMenu: 1
          },
          redirect: '/draft/lecture',
          componentPath: 'my/draft/router-view',
          children: [
            {
              path: '/draft/lecture',
              name: 'draft_lecture',
              meta: {
                title: '我的讲义',
                isMenu: 0
              },
              componentPath: 'my/draft/lecture'
            },
            {
              path: '/draft/lecture-suite',
              name: 'draft_lecture-suite',
              meta: {
                title: '讲义套件',
                isMenu: 0
              },
              componentPath: 'my/draft/lecture-suite'
            }
          ]
        },
        {
          path: '/myCenter/schedule',
          name: 'schedule',
          meta: {
            title: '1对1日程表',
            isMenu: 1
          },
          componentPath: 'layout/RouteView',
          redirect: '/myCenter/schedule/index',
          children: [
            {
              path: '/myCenter/schedule/index',
              name: 'schedule_index',
              meta: {
                title: '1对1日程表',
                isMenu: 0
              },
              componentPath: 'my/schedule'
            },
            {
              path: '/myCenter/schedule/course/unit/:id',
              name: 'mycourseDetailUnit',
              meta: {
                title: '课次详情',
                isMenu: 0
              },
              componentPath: 'my/course/unit'
            }
          ]
        },
        {
          path: '/myCenter/course',
          name: 'course',
          meta: {
            title: '我的课程',
            isMenu: 1
          },
          componentPath: 'layout/RouteView',
          redirect: '/my/course',
          children: [
            {
              path: '/my/course',
              name: 'courseIndex',
              meta: {
                title: '课程列表',
                isMenu: 0
              },
              componentPath: 'my/course/index'
            },
            {
              path: '/my/course/:id',
              name: 'courseDetail',
              meta: {
                title: '课程详情',
                isMenu: 0
              },
              componentPath: 'my/course/detail'
            },
            {
              path: '/my/course/unit/:id',
              name: 'courseDetailUnit',
              meta: {
                title: '课次详情',
                isMenu: 0
              },
              componentPath: 'my/course/unit'
            }
          ]
        },
        {
          path: '/my/correct',
          name: 'correct',
          meta: {
            title: '题目纠错',
            isMenu: 1
          },
          componentPath: 'layout/RouteView',
          redirect: '/myCenter/correct/list',
          children: [
            {
              path: '/myCenter/correct/list',
              name: 'correct_index',
              meta: {
                title: '纠错列表',
                isMenu: 0
              },
              componentPath: 'my/correct/list'
            },
            {
              path: '/myCenter/correct/:id',
              name: 'correctDetail',
              meta: {
                title: '纠错详情',
                isMenu: 0
              },
              componentPath: 'my/correct/detail'
            }
          ]
        }
      ]
    },
    {
      path: '/video/:videoId',
      name: 'Video',
      title: '视频播放',
      meta: {
        isMenu: 0
      },
      componentPath: 'common/Video'
    }
  ]
})

// 获取科目、年段、地区的基础信息
Mock.mock(/^\/sgr$/, 'get', {
  errorCode: 200,
  success: true,
  message: '查询成功！',
  data: {
    subjectList: [
      {
        label: '数学',
        value: 0
      },
      {
        label: '语文',
        value: 1
      }
    ],
    gradeList: [
      {
        label: '小学',
        value: 0
      },
      {
        label: '初中',
        value: 1
      },
      {
        label: '高中',
        value: 2
      }
    ],
    region: [
      {
        label: '厦门',
        value: '0592'
      },
      {
        label: '泉州',
        value: '0595'
      }
    ]
  }
})

// 更新科目、年段、地区的基础信息
// Mock.mock(/^\/sgr$/, 'put', {
//   code: 200,
//   data: {},
//   msg: '更新成功'
// })

// 获取页面选择器的数据
Mock.mock(/^\/topic-select$/, 'get', {
  errorCode: 200,
  success: true,
  message: '查询成功！',
  data: [
    {
      label: '年份',
      key: 'a',
      list: [
        {
          label: '2017',
          code: '2017',
          dataValue: null
        },
        {
          label: '2016',
          code: '2016',
          dataValue: null
        },
        {
          label: '2015',
          code: '2015',
          dataValue: null
        }
      ]
    },
    {
      label: '地区',
      key: 'b',
      list: [
        {
          label: '北京',
          code: '001',
          dataValue: null
        },
        {
          label: '福州',
          code: '0591',
          dataValue: null
        },
        {
          label: '厦门',
          code: '0592',
          dataValue: null
        }
      ]
    },
    {
      label: '年级',
      key: 'c',
      list: [
        {
          label: '新高一',
          code: '0',
          dataValue: null
        },
        {
          label: '高一',
          code: '1',
          dataValue: null
        },
        {
          label: '新高二',
          code: '2',
          dataValue: null
        }
      ]
    }
  ]
})

// tree points
Mock.mock(/^\/tree$/, 'get', {
  success: true,
  errorCode: 200,
  message: '获取成功',
  data: {
    start: 0,
    limit: 15,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    list: [
      {
        nodeId: 14555,
        parentId: 14554,
        nodeName: '听力',
        title: '听力',
        expand: false,
        rootNode: 0,
        childNode: 1,
        nodes: [],
        children: [
          {
            nodeId: 14556,
            parentId: 14555,
            nodeName: '听力',
            title: '听力',
            expand: false,
            rootNode: 0,
            childNode: 1,
            nodes: [],
            children: [
              {
                nodeId: 14558,
                parentId: 14556,
                nodeName: '句子理解',
                title: '句子理解',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14558,
                parentId: 14556,
                nodeName: '句子理解',
                title: '句子理解',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              },
              {
                nodeId: 14557,
                parentId: 14556,
                nodeName: '信息词选择',
                title: '信息词选择',
                expand: false,
                rootNode: 0,
                childNode: 0,
                nodes: [],
                children: []
              }
            ]
          }
        ]
      },
      {
        nodeId: 14565,
        parentId: 14554,
        nodeName: '语音',
        title: '语音',
        expand: false,
        rootNode: 0,
        childNode: 1,
        nodes: [],
        children: [
          {
            nodeId: 14566,
            parentId: 14565,
            nodeName: '元音',
            title: '元音',
            expand: false,
            rootNode: 0,
            childNode: 1,
            children: [],
            nodes: []
          }
        ]
      }
    ]
  }
})

export default Mock
