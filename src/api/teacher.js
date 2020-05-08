import request from '@/utils/request'

export default {
  getTeacherPageList(page, size, searchObj) {
    //分页条件查询方法
    return request({
      //后端controller路径
      url: `/eduservice/teacher/condition/${page}/${size}`,
      method: 'post',
      //如果传递参数时json格式就使用 data  如果不是json就是用params
      data: searchObj
    })
  },
  deleteTeacherById(id){  //删除讲师
    return request({
      url: '/eduservice/teacher/'+id,
      method: 'delete',
    })
  },

  addTeacher(eduTeacher){ //添加教师
    return request({
      url: '/eduservice/teacher/addTeacher',
      method: 'post',
      data: eduTeacher
    })
  },

  getTeacherById(id){//根据id查询教师信息
    return request({
      url: '/eduservice/teacher/getTeacher/'+id,
      method: 'get',
    })
  },

  updateTeacher(eduTeacher){//根据id修改教师信息
    return request({
      url: '/eduservice/teacher/updateTeacher/',
      method: 'post',
      data: eduTeacher
    })
  }
}
