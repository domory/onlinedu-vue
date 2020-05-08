import request from '@/utils/request'


export default {




  //删除章节信息
  deleteChapterById(id){
    return request({
      url:'/eduservice/chapter/deleteChapter/'+id,
      method:"delete",
    })
  },


  //根据id查询章节信息
  getChapterInfoById(id){
    return request({
      url:'/eduservice/chapter/getChapterInfo/'+id,
      method:"get",
    })
  },


  //根据id修改chapter
  updateChapter(eduChapter){
    return request({
      url:'/eduservice/chapter/updateChapter',
      method:"post",
      data:eduChapter
    })
  },


  //添加chapter
  addChapter(eduChapter){
    return request({
      url:'/eduservice/chapter/addChapter',
      method:"post",
      data:eduChapter
    })
  },

  //根据章节id 获得章节和小结列表
  getChapterVedioList(courseId){
    return request({
      url:'/eduservice/chapter/chapterVedioList/'+courseId,
      method:"get"
    })
  }


}
