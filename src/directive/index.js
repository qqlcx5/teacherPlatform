import Vue from 'vue'

Vue.directive('power', {
  bind: function (el, binding) {
    if (!binding.value) {
      el.parentNode.removeChild(el)
    }
  }
})

Vue.directive('mathjax', (el, binding) => {
  if (window.MathJax) {
    Vue.nextTick(() => {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, el])
    })
  }
})
