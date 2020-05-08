
import request from '@/utils/request'


export default {


  createdata(day){
    return request({
      url:'/edustatic/statisticsDaily/getRegisterCount/'+day,
      method:'get',
    })
  },

  showStaticsData(type,begin,end){
    return request({
      url:'/edustatic/statisticsDaily/statics/'+type+'/'+begin+'/'+end,
      method:'get',
    })
  }

}
