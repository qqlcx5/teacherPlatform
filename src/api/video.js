import fetch from '@/utils/fetch'

export default {
  getVideoUrl ({videoId, ratio}) {
    return fetch.get(`/video/playUrl/${videoId}/${ratio}`)
  }
}
