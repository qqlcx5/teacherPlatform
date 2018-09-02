export const itemColumnsList = function(vm) {
  return [
    {
      label: '序号',
      type: 'index',
      width: 80,
      align: 'center'
    },
    {
      label: '题型',
      align: 'center',
      prop: 'itemTypeName',
      width: 80
    },
    {
      label: '题干内容',
      render: (h, params) => {
        return <div domPropsInnerHTML={params.row.itemContent} style="display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical;overflow: hidden;max-height:64px" />
      }
    },
    {
      label: '操作',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return (
          <div style="display: flex; align-items: center;justify-content:space-around">
            <el-tooltip effect="blue" content="查看" placement="top" >
              <button
                class="m-table-btn__operate"
                onClick={() => {
                  vm.view(params.row.itemId)
                }} >
                <i class="iconfont icon-See" />
              </button>
            </el-tooltip>
            <el-tooltip effect="blue" content="添加" placement="top">
              <button
                disabled={!!params.row.addFlag}
                class="m-table-btn__operate"
                onClick={() => {
                  vm.addQu(params.row)
                }}
              >
                <i class="iconfont icon-tianjia" />
              </button>
            </el-tooltip>
          </div>
        )
      }
    }
  ]
}

export const textColumnsList = function(vm) {
  return [
    {
      label: '序号',
      type: 'index',
      width: 80,
      align: 'center'
    },
    {
      label: '内容',
      render: (h, params) => {
        return <div domPropsInnerHTML={params.row.materialContent} style="display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical;overflow: hidden;max-height:64px" />
      }
    },
    {
      label: '操作',
      align: 'center',
      width: 120,
      render: (h, params) => {
        return (
          <div style="display: flex; align-items: center;justify-content:space-around">
            <el-tooltip effect="blue" content="添加" placement="top" >
              <button
                class="m-table-btn__operate"
                onClick={() => {
                  vm.view(params.row)
                }} >
                <i class="iconfont icon-See" />
              </button>
            </el-tooltip>
            <el-tooltip effect="blue" content="选择" placement="top">
              <button
                disabled={!!params.row.addFlag}
                class="m-table-btn__operate"
                onClick={() => {
                  vm.addQu(params.row)
                }}
              >
                <i class="iconfont icon-tianjia" />
              </button>
            </el-tooltip>
          </div>
        )
      }
    }
  ]
}

export default {
  itemColumnsList,
  textColumnsList
}
