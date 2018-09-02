export default ctx => [
  {
    width: '55',
    type: 'selection',
    align: 'center'
  },
  {
    prop: 'teachingStepsName',
    width: 100,
    label: '模块'
  },
  {
    label: '类型',
    width: 100,
    render: (h, params) => {
      return <span>{params.row.refType === 'LECTURE' ? '讲义' : '试卷'}</span>
    }
  },
  {
    prop: 'templateName',
    label: '资源名称',
    'show-overflow-tooltip': true
  },
  {
    label: '操作',
    width: 80,
    align: 'center',
    render: (h, params) => {
      return (
        <div class="m-table-btn">
          <router-link
            tag="i"
            class="iconfont icon-See"
            title="查看"
            to={{ name: 'PreviewLecture', params: { lectureId: params.row.refId }, query: {type: 'view'} }}
          />
        </div>
      )
    }
  }
]
