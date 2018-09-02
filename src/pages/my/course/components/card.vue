<template lang="html">
  <div class="course-card" @click.stop.prevent="gotoDetail(cardData.courseId)">
    <section class="course-card__item">
      <div class="course-card__item-header">
        <span :title="cardData.courseName">{{cardData.courseName}}</span>
      </div>
      <div class="course-card__item-body">
        <div class="tag">
          <span>{{cardData.gradeName}}</span>
          <span>{{cardData.subjectName}}</span>
        </div>
        <div class="info">
          <p :title="cardData.courseId">课程ID: <span>{{cardData.courseId}}</span></p>
          <p :title="cardData.branchName">校区: <span>{{cardData.branchName}}</span></p>
          <p v-if="cardData.courseSeasonName" :title="cardData.courseSeasonName">课程季: <span>{{cardData.courseSeasonName}}</span></p>
          <p :title="datePeriod">课程日期: <span>{{cardData.courseStartDate}} 至 {{cardData.courseEndDate}}</span></p>
          <p>主讲老师: <span>{{cardData.leadTeacherName}}</span></p>
        </div>
      </div>
      <div class="course-card__item-footer">
        <div class="status">
          <span v-if="cardData.status === 'UNFINISHED'"><i class="sidebar__sub-icon active"></i>未结课</span>
          <span v-else><i class="sidebar__sub-icon"></i>已结课</span>
        </div>
        <div class="detail">
          查看详情
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'COURSE-CARD',
  props: {
    cardData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      datePeriod: this.cardData.courseStartDate + '至' + this.cardData.courseEndDate
    }
  },
  methods: {
    gotoDetail(courseId) {
      this.$router.push({
        name: 'courseDetail',
        params: {
          id: courseId
        },
        query: this.$route.query
      })
    }
  }
}
</script>

<style lang="less" scoped>
.course-card {
  cursor: pointer;
  &__item {
    border: 1px solid #eee;
    background-color: #fff;
    border-radius: 4px;
    padding: 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    &-header {
      span {
        color: #2c5680;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        height: 20px;
      }
    }

    &-body {
      border-bottom: 1px dashed #ddd;
      margin-top: 10px;
      .tag {
        span {
          color: #fff;
          background-color: #409eff;
          padding: 4px 8px;
          border-radius: 4px;
        }
      }
      .info {
        margin-top: 10px;
        font-size: 12px;
        margin-bottom: 10px;
        p {
          color: #8492a6;
          margin: 5px 0 0 0;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          height: 20px;
          span {
            height: 14px;
          }
        }
      }
    }
    &-footer {
      margin-top: 10px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .status {
        i.active {
          background: #409eff;
        }
      }
      .detail {
        cursor: pointer;
        color: #3587FF;
      }
    }
  }
  .line-climp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
}
</style>
