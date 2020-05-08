import request from '@/utils/request'

export default {

  //发布课程
  updateCourseById(id){
    return request({
      url: '/eduservice/eduCourse/updateCourseStatus/'+id,
      method: 'post',
    })
  },


  //获得课程相关的所有信息 包括讲师，所属分类 图片等
  getAllCourseInfo(id){
    return request({
      url: '/eduservice/eduCourse/getAllCourseInfoById/'+id,
      method: 'get',
    })
  },


  //删除课程相关信息 包括课程描述 章节 小结
  deleteCourseInfo(id){
    return request({
      url: '/eduservice/eduCourse/deleteCourseInfo/'+id,
      method: 'delete',
    })
  },

  //分页查询课程信息
  getCourseInfo(page,size,coursequery){
    return request({
      url: '/eduservice/eduCourse/courseList/'+page+'/'+size,
      method: 'post',
      data: coursequery
    })
  },


  //更新课程信息
  updateTeacherInfo(courseInfoForm){
    return request({
      url: '/eduservice/eduCourse/updateCourseInfo',
      method: 'post',
      data: courseInfoForm
    })
  },



  //回显课程信息
  backShowCourseInfo(id){
    return request({
      url: '/eduservice/eduCourse/getCourseInfo/'+id,
      method: 'get',
    })
  },


  //查询所有教师信息
  getAllTeacher(){
    return request({
      url: '/eduservice/teacher/findAllTeacher',
      method: 'get',
    })
  },

  //添加课程基本信息
  addCourseInfo(course){
    return request({
      url: '/eduservice/eduCourse/addCourseInfo',
      method: 'post',
      data:course
    })
  }
}
