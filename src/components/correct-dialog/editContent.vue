<template>
  <div contenteditable="true" v-html="value" @blur="changeText" @paste="paste" ref="box" class="no-mathjax"></div>
</template>
<script>
import { app } from '../../api'
export default {
  props: ['value'],
  data() {
    return { innerText: this.value }
  },
  methods: {
    changeText() {
      this.innerText = this.$el.innerHTML
      this.$emit('input', this.innerText)
    },
    paste(e) {
      e.preventDefault()
      if (!e.clipboardData && e.clipboardData.items) return
      // for (let i = 0; i < e.clipboardData.items.length; i++) {
      let item = e.clipboardData.items[0]
      if (item.kind === 'file') {
        let file = item.getAsFile()
        if (file.size === 0) return
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = event => {
          let str = event.target.result
          app
            .uploadImg(file.name, str)
            .then(res => {
              const url = res.data.fileUrl
              const img = document.createElement('img')
              img.src = url
              img.style = 'max-width: 100%'
              const range = window.getSelection().getRangeAt(0)
              range.deleteContents()
              range.insertNode(img)
              // 光标后移动到插入img元素后面
              range.setStartAfter(img)
            })
            .catch(() => {
              this.$message.error('粘贴图片失败...')
            })
        }
      }
      if (item.kind === 'string') {
        item.getAsString(str => {
          const div = document.createElement('div')
          div.innerHTML = str
          const span = document.createElement('span')
          span.innerText = div.innerText
          const range = window.getSelection().getRangeAt(0)
          range.deleteContents()
          range.insertNode(span)
          // // 光标后移动到插入img元素后面
          range.setStartAfter(span)
          // // console.log(div.innerText)
        })
      }
      // }
      // if (
      //   e.clipboardData &&
      //   e.clipboardData.items[0].type.indexOf('image') > -1
      // ) {
      //   let file = e.clipboardData.items[0].getAsFile()
      //   if (file) {
      //     let reader = new FileReader()
      //     reader.readAsDataURL(file)
      //     reader.onload = event => {
      //       let str = event.target.result
      //       app
      //         .uploadImg(file.name, str)
      //         .then(res => {
      //           const url = res.data.fileUrl
      //           const img = document.createElement('img')
      //           img.src = url
      //           img.style = 'max-width: 100%'
      //           const range = window.getSelection().getRangeAt(0)
      //           range.deleteContents()
      //           range.insertNode(img)
      //           // 光标后移动到插入img元素后面
      //           range.setStartAfter(img)
      //         })
      //         .catch(() => {
      //           this.$message.error('粘贴图片失败...')
      //         })
      //     }
      //   }
      // } else {
      //   let str = e.clipboardData.items[0].getAsString()
      //   console.log(str)
      // }
    }
  }
}
</script>

<style lang="less">
.correct-post-remark__textarea {
  width: 100%;
  height: 248px;
  border: 1px solid #eee;
  box-sizing: border-box;
  padding: 10px;
  overflow-y: scroll;
  &:focus {
    outline: none;
  }
  &::-webkit-scrollbar {
    width: 10px;
    background-color: #fff;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: hsla(220, 4%, 58%, 0.3);
    display: none;
  }
  &:hover::-webkit-scrollbar-thumb {
    display: block;
  }
}
</style>
