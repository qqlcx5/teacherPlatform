/**
 * 至少要有一个动态路由
 */
export default [
  {
    prop: 'jiaoAn',
    name: '教案',
    file: () => import('./TeachCase')
  },
  {
    prop: 'stuCase',
    name: '教材',
    file: () => import('./StudentCase')
  },
  // {
  //   prop: 'keJian',
  //   name: '课件',
  //   file: () => import('./CourseWare')
  // },
  {
    prop: 'matter',
    name: '题材库',
    file: () => import('./Matter')
  },
  {
    prop: 'lectureSuiteList',
    name: '讲义套件',
    file: () => import('./LectureSuiteList')
  }
]
