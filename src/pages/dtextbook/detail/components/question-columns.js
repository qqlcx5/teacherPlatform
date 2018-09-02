export default ctx => [
  {
    prop: 'createTime',
    label: '创建时间',
    width: 170
  },
  {
    prop: 'createUser',
    label: '创建人',
    width: 120
  },
  {
    prop: 'itemTypeName',
    label: '题型',
    type: 'html',
    width: 120
  },
  {
    label: '内容',
    render: (h, params) => {
      return <div domPropsInnerHTML={params.row.itemContent} style="display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical;overflow: hidden;max-height:64px" />
    }
  },
  {
    label: '操作',
    width: 140,
    align: 'center',
    render: (h, params) => {
      return (
        <div style="display: flex; align-items: center;justify-content:space-around">
        <el-tooltip effect="blue" content="查看" placement="top">
          <button
            class="m-table-btn__operate"
            onClick={() => {
              ctx.viewDTextbookMaterial(params.row)
            }}
          >
            <i class="iconfont icon-See" />
          </button>
        </el-tooltip>
          <el-tooltip effect="blue" content="编辑" placement="top">
            <button
              class="m-table-btn__operate"
              onClick={() => {
                ctx.editDTextbookMaterial(params.row)
              }}
            >
              <i class="iconfont icon-edit" />
            </button>
          </el-tooltip>
          <el-tooltip effect="blue" content="删除" placement="top">
            <button
              class="m-table-btn__operate"
              onClick={() => {
                ctx.removeDTextbookMaterial(params.row)
              }}
            >
              <i class="iconfont icon-delete_1" />
            </button>
          </el-tooltip>
        </div>
      )
    }
  }
]
