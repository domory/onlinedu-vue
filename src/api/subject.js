import request from '@/utils/request'

export default {
  //添加二级分类
  addTwoNode(subject){
    return request({
      url: '/eduservice/subject/addTwoNode',
      method: 'post',
      data:subject
    })
  },

  //添加一级分类
  addOneNode(subject){
    return request({
      url: '/eduservice/subject/addOneNode',
      method: 'post',
      data:subject
    })
  },

  //删除层级结构 根据id 不区分一级二级
    deleteNode(id){
      return request({
        url: '/eduservice/subject/delete/'+id,
        method: 'delete',
      })
    },

  //或得树形结构 所有分类信息
    getTreeList(){
      return request({
        url: '/eduservice/subject',
        method: 'get',
      })
    }
}
