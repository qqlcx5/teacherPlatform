<template>
  <li class="menu-item" :class="{'is-active': data.id === currentChapter.id}">
    <el-input class="menu-item-ipt" size="mini" :class="{'is-error': isError}" :value="data.name" placeholder="请填写章节名称" v-if="canEdit" ref="ipt" @blur="blurHandler" @keyup.enter.native="onEnter"></el-input>
    <div v-else class="menu-item-inner" @click="onSelect">
      <!-- <em>第{{index + 1}}讲</em> -->
      <span :title="data.name">{{data.name}}</span>
      <i class="iconfont icon-edit" @click.stop="showIptBox"></i>
      <i class="iconfont icon-delete_1" @click.stop="onRemove(data)" v-if="isLast"></i>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    isLast: {
      type: Boolean,
      default: false
    },
    onUpdate: Function,
    onRemove: Function,
    canDo: {
      type: Boolean,
      default: true
    }
  },
  inject: ['currentChapter'],
  data() {
    return {
      canEdit: false,
      isError: false
    }
  },
  methods: {
    showIptBox() {
      if (!this.canDo) return
      this.canEdit = true
      this.$nextTick(() => {
        this.$refs.ipt.focus()
      })
    },
    onSelect() {
      Object.assign(this.currentChapter, this.data)
    },
    blurHandler(e) {
      let name = e.target.value || ''
      name = name.trim()
      if (name.length === 0 || name.length > 50) {
        this.$message.error('章节不能为空或章节长度不能大于50个字符！')
        this.onError()
      } else {
        this.onUpdate({ id: this.data.id, name: name })
          .then(() => {
            this.onSuccess()
          })
          .catch(() => {
            this.onError()
          })
      }
    },
    onError() {
      this.isError = true
      this.$emit('update:canDo', false)
    },
    onSuccess() {
      this.isError = false
      this.canEdit = false
      this.$emit('update:canDo', true)
    },
    onEnter() {
      this.$nextTick(() => {
        this.$refs.ipt.blur()
      })
    }
  }
}
</script>

<style lang="less">
.menu-item {
  height: 36px;
  cursor: pointer;
  padding: 0 20px;
  display: flex;
  align-items: center;
  overflow: hidden;
  font-size: 12px;
  &.is-active,&:hover {
    background: rgba(240, 246, 255, 1);
    color: var(--blue);
  }
  &:hover i {
    display: block;
  }
}
.menu-item-inner {
  display: flex;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 36px;
  & > em {
    width: 40px;
    font-style: normal;
    margin-right: 8px;
  }
  & > i {
    font-size: 14px;
    width: 16px;
    margin-left: 8px;
    color: var(--gray-light);
    display: none;
  }
  & > span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.menu-item-ipt.is-error .el-input__inner {
  border-color: var(--red) !important;
}
</style>
