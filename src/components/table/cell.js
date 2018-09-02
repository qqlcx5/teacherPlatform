import TableExtend from './extend'

export default {
  name: 'table-cell',
  functional: true,
  components: { TableExtend },
  props: {
    column: {
      type: Object,
      default: () => {}
    }
  },
  render: (h, ctx) => {
    let tableColumnProps = ctx.props.column
    // 如果文本是带有 DOM,(富文本) 例如 <p>xxx</p>
    if (tableColumnProps.type === 'html') {
      return (
        <el-table-column
          {...{
            props: tableColumnProps,
            scopedSlots: {
              default: scope => {
                return (
                  <div
                    {...{
                      domProps: { innerHTML: scope.row[tableColumnProps.prop] }
                    }}
                  />
                )
              }
            }
          }}
        />
      )
    } else if (tableColumnProps.render) {
      return (
        <el-table-column
          {...{
            props: tableColumnProps,
            scopedSlots: {
              default: scope => (
                <TableExtend render={tableColumnProps.render} data={scope} />
              )
            }
          }}
        />
      )
    } else {
      return <el-table-column {...{ props: tableColumnProps }} />
    }
  }
}
