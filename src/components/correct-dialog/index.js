import Vue from 'vue'
import dialog from './dialog'

const CorrectDialogComponent = Vue.extend(dialog)

let instance = null
const correctDialog = (data = {visible: false}) => {
  if (instance) {
    Object.assign(instance, data)
    return instance
  }

  instance = new CorrectDialogComponent({
    data
  })
  const comp = instance.$mount()
  document.body.appendChild(comp.$el)
  return comp
}

export default correctDialog
