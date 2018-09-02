<template>
  <div class="knowledge-suite-head" :class="{'is-edit': canEdit}" :contenteditable="canEdit" @focus="handleFocus" @blur="handleBlur">
  </div>
</template>

<script>
export default {
  props: {
    canEdit: {
      type: Boolean
    },
    value: {
      type: String
    }
  },
  watch: {
    value (val) {
      if (val) this.initData()
    }
  },
  methods: {
    initData() {
      let sHtml = this.value || ''
      if (this.canEdit) sHtml = sHtml.trim() + '<span class="knowledge-suite-head__edit">(点击编辑)</span>'
      this.$nextTick(() => {
        this.$el.innerHTML = sHtml
      })
    },
    handleFocus() {
      this.$nextTick(() => {
        this.removeTipsNode()
      })
    },
    handleBlur() {
      this.$nextTick(() => {
        let txt = this.$el.innerText.trim()
        this.$el.innerHTML = txt
        this.$emit('input', txt)
        this.$emit('on-blur', txt)
        this.addTipsNode()
      })
    },
    addTipsNode() {
      let node = document.createElement('span')
      node.className = 'knowledge-suite-head__edit'
      node.innerText = '(点击编辑)'
      this.$el.appendChild(node)
    },
    removeTipsNode() {
      let child = document.documentElement.querySelector(
        '.knowledge-suite-head__edit'
      )
      this.$el.removeChild(child)
    }
  }
}
</script>

<style lang="less">
.knowledge-suite-head {
  line-height: 56px;
  text-align: center;
  font-size: 20px;
  padding: 0 20px;
  outline: none;
  &.is-edit {
    border: 1px dashed #aaa;
    cursor: pointer;
  }
  &:focus {
    border-style: solid;
    border-color: #3587ff;
  }
  &__inner {
    outline: none;
  }
  &__edit {
    color: #cbcdd2;
    z-index: 1000;
  }
}
</style>
