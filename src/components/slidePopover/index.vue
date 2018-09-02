<template>
  <div class="m-slide-popover">
    <div class="m-slide-popover__con" ref="popper" v-show="showPopper">
      <slot></slot>
    </div>
    <slot name="reference"></slot>
  </div>
</template>

<script>
function on(element, event, handler) {
  if (element && event && handler) {
    document.addEventListener
      ? element.addEventListener(event, handler, false)
      : element.attachEvent('on' + event, handler)
  }
}
function off(element, event, handler) {
  if (element && event) {
    document.removeEventListener
      ? element.removeEventListener(event, handler, false)
      : element.detachEvent('on' + event, handler)
  }
}

export default {
  props: {
    trigger: {
      type: String,
      default: 'hover',
      validator: value => ['hover', 'click'].indexOf(value) > -1
    },
    delayOnMouseOut: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      referenceElm: null,
      popper: null,
      showPopper: false,
      appendedToBody: false,
      timer: null
    }
  },
  methods: {
    toggle() {
      this.showPopper = !this.showPopper
    },
    handleDocumentClick(e) {
      if (
        !this.$el ||
        !this.referenceElm ||
        this.$el.contains(e.target) ||
        this.referenceElm.contains(e.target) ||
        !this.popper ||
        this.popper.contains(e.target)
      ) {
        return
      }
      this.showPopper = false
    },
    handleMouseOver() {
      this.showPopper = true
      clearTimeout(this.timer)
    },
    handleMouseOut() {
      this.timer = setTimeout(() => {
        this.showPopper = false
      }, this.delayOnMouseOut)
    },
    createPopper() {
      this.$nextTick(() => {
        if (!this.appendedToBody) {
          document.body.appendChild(this.popper.parentElement)
          let referenceElmRect = this.referenceElm.getBoundingClientRect()
          let popperRect = this.popper.parentElement.getBoundingClientRect()
          this.popper.parentElement.style.top =
            referenceElmRect.top +
            (referenceElmRect.height - popperRect.height) / 2 +
            'px'
          this.popper.parentElement.style.left =
            referenceElmRect.right - popperRect.width + 'px'
          this.appendedToBody = true
        }
      })
    },
    doDestory() {
      if (this.showPopper) {
        return
      }
      if (this.appendedToBody) {
        document.body.removeChild(this.popper.parentElement)
        this.appendedToBody = false
      }
    },
    destroyPopper() {
      off(this.referenceElm, 'click', this.toggle)
      off(this.referenceElm, 'mouseout', this.handleMouseOut)
      off(this.referenceElm, 'mouseover', this.handleMouseOver)
      off(document, 'click', this.handleDocumentClick)
      this.showPopper = false
      this.doDestory()
    }
  },
  watch: {
    showPopper(val) {
      if (val) {
        this.createPopper()
      }
    }
  },
  mounted() {
    this.referenceElm = this.$slots.reference[0].elm
    this.popper = this.$slots.default[0].elm
    switch (this.trigger) {
      case 'click':
        on(this.referenceElm, 'click', this.toggle)
        on(document, 'click', this.handleDocumentClick)
        break
      case 'hover':
        on(this.referenceElm, 'mouseover', this.handleMouseOver)
        on(this.popper.parentElement, 'mouseover', this.handleMouseOver)
        on(this.referenceElm, 'mouseout', this.handleMouseOut)
        on(this.popper.parentElement, 'mouseout', this.handleMouseOut)
        break
    }
  },
  destroyed() {
    this.destroyPopper()
  }
}
</script>

<style lang="less">
.m-slide-popover__con {
  position: absolute;
  z-index: 900;
  background: #fff;
  display: inline-flex;
}
</style>
