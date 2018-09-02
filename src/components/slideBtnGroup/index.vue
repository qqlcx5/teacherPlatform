<template>
  <span>
    <transition :name="transition">
      <div ref="popper" v-show="showPopper" class="m-popover">
        <slot></slot>
      </div>
    </transition>
    <slot name="reference" ref="reference"></slot>
  </span>
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
    },
    transition: {
      type: String,
      default: 'fade-in-linear'
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
      this.popper.style.zIndex = 1000
      document.body.appendChild(this.popper)
      this.appendedToBody = true
    },
    updatePopper() {
      this.$nextTick(() => {
        let referenceElmRect = this.referenceElm.getBoundingClientRect()
        if (!this.appendedToBody) this.createPopper()
        let popperRect = this.popper.getBoundingClientRect()
        this.popper.style.top = referenceElmRect.top + (referenceElmRect.height - popperRect.height) / 2 + 'px'
        this.popper.style.left = referenceElmRect.left - popperRect.width + referenceElmRect.width + 'px'
      })
    },
    doDestroy() {
      if (this.showPopper) {
        return
      }
      if (this.appendedToBody) {
        document.body.removeChild(this.popper)
        this.appendedToBody = false
      }
    },
    destroyPopper() {
      off(this.referenceElm, 'mouseout', this.handleMouseOut)
      off(this.referenceElm, 'mouseover', this.handleMouseOver)
      this.showPopper = false
      this.doDestroy()
    }
  },
  watch: {
    showPopper(val) {
      val && this.updatePopper()
    }
  },
  mounted() {
    this.referenceElm = this.$slots.reference[0].elm
    this.popper = this.$slots.default[0].elm.parentElement
    switch (this.trigger) {
      case 'hover':
        on(this.referenceElm, 'mouseover', this.handleMouseOver)
        on(this.popper, 'mouseover', this.handleMouseOver)
        on(this.referenceElm, 'mouseout', this.handleMouseOut)
        on(this.popper, 'mouseout', this.handleMouseOut)
        break
    }
  },
  destroyed() {
    this.destroyPopper()
  }
}
</script>

<style lang="less">
.m-popover{
  position: absolute;
  background: #fff;
  min-width: 20px;
  padding: 5px;
}
// .m-slide-popover__con {
//   position: absolute;
//   z-index: 900;
//   background: #fff;
//   display: inline-flex;
// }
</style>
