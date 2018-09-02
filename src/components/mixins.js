/* eslint-disable */
export default {
  methods: {
    updateImgSrc(value, canReg = true, height = 450, width = 450) {
      if (!value) return ''
      if (!canReg) {
        return value + `?imageView2/2/h/${height}/w/${width}/interlace/1`
      }
      let imgReg = /<img.*?(?:>|\/>)/gi
      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
      let content = value.replace(imgReg, img => {
        let src = img.match(srcReg)
        if (src[1]) {
          let nSrc = 'src=' + '"' + src[1] + `?imageView2/2/h/${height}/w/${width}/interlace/1` + '"'
          let str = img.replace(srcReg, nSrc)
          return str
        } else {
          return ''
        }
      })
      return content
    },
    codePointLength(text) {
      let result = text.match(/[\s\S]/gu)
      console.log(result.length)
      return result ? result.length : 0
    }
  }
}
