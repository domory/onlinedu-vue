import request from '@/utils/request'


export default {

  //删除视频
  deleteAliVedio(vedioId){
    return request({
      url:'/vedioservice/deleteVedio/'+vedioId,
      method:"delete"
    })
  },

  //删除小结信息
  deleteVedio(id){
    return request({
      url:'/eduservice/video/deleteVedio/'+id,
      method:"delete"
    })
  },


  //更新小结信息
  updateVedio(vedio){
    return request({
      url:'/eduservice/video/updateVedio/',
      method:"post",
      data: vedio
    })
  },

  //根据小结id进行数据回显
  getVedioInfoById(id){
    return request({
      url:'/eduservice/video/getVedioInfoById/'+id,
      method:"get",
    })
  },

  //添加小结方法
  addVedio(vedio){
    return request({
      url:'/eduservice/video/addVedio/',
      method:"post",
      data:vedio
    })
  },
}
