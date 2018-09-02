export default {
  name: 'TableExtend',
  functional: true,
  props: {
    render: Function,
    data: {
      type: Object,
      default: () => {}
    }
  },
  render: (h, ctx) => ctx.props.render(h, ctx.props.data)
}
