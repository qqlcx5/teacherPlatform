export default ctx => [
  {
    prop: 'lecturesuitName',
    label: '套件名称',
    'show-overflow-tooltip': true
  },
  {
    label: '状态',
    width: 100,
    render: (h, params) => {
      return <span>{params.row.status === 'DISABLED' ? '定稿' : '待定稿'}</span>
    }
  },
  {
    prop: 'createTime',
    label: '更新时间',
    width: 180
  },
  {
    label: '操作',
    width: 80,
    align: 'center',
    render: (h, params) => {
      return (
        <div class="m-table-btn__operate ">
          <span onClick={() => ctx.viewLectureSuiteDetail(params.row)} class="iconfont icon-See"></span>
        </div>
      )
    }
  }
]
