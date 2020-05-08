<template>
<div>
  <el-steps :active="1"  finish-status="success" align-center style="margin-bottom: 40px;">
    <el-step title="填写课程基本信息"></el-step>
    <el-step title="创建课程大纲"></el-step>
    <el-step title="发布课程"></el-step>
  </el-steps>
  <el-form label-width="120px">
    <el-form-item label="课程标题">
      <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
    </el-form-item>

    <!-- 所属分类 TODO -->
    <!--一级分类-->
    <el-form-item label="课程分类">
      <el-select v-model="courseInfo.subjectParentId" @change="subjectLevelOneChanged" placeholder="请选择一级分类">
        <el-option
          v-for="subject in oneLevelSubjectList"
          :key="subject.id"
          :label="subject.title"
          :value="subject.id">
        </el-option>
      </el-select>
      <el-select v-model="courseInfo.subjectId"  placeholder="请选择二级分类">
        <el-option
          v-for="subject in twoLevelSubjectList"
          :key="subject.id"
          :label="subject.title"
          :value="subject.id">
        </el-option>
      </el-select>
    </el-form-item>


    <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id">
          </el-option>
        </el-select>
      </el-form-item>

    <el-form-item label="总课时">
      <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
    </el-form-item>

    <!-- 课程简介 TODO -->
    <el-form-item label="课程简介">
      <el-input v-model="courseInfo.description" placeholder=" 示例：简介"/>
    </el-form-item>
    <!-- 课程封面 TODO -->
    <el-form-item label="课程封面">
        <el-upload
          class="avatar-uploader"
          :action="BASE_API+'/eduservice/oss/fileLoad?host=course'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="courseInfo.cover" :src="courseInfo.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </el-form-item>

    <el-form-item label="课程价格">
      <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
    </el-form-item>
    <el-form-item>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
  import course from '@/api/course'
  import subject from '@/api/subject'

  export default {
    name: "info",
    data(){
      return{
        saveBtnDisabled:false,
        BASE_API: process.env.BASE_API, // 接口API地址
        courseInfo:{
          title: null,
          subjectId: null,
          teacherId: null,
          lessonNum: 0,
          description:null,
          cover:null,
          subjectParentId:null,
          price: 0
        },
        teacherList:[],//讲师信息集合
        oneLevelSubjectList:[],//一级分类
        twoLevelSubjectList:[]//二级分类
      }
    },
    watch: {
      $route(to, from) {
        console.log('watch $route')
        this.init()
      }
    },
    created() {
      // this.getOneLevelList()//获得一级分类
      // this.getAllTeacher()//获得所有讲师
      this.init()
    },
    methods:{

      //判断是修改还是保存课程信息
      init(){
        if(this.$route.params && this.$route.params.id){
          //数据回显
          console.log(this.$route.params.id)
          //根据id 查询课程信息
              course.backShowCourseInfo(this.$route.params.id)
                .then( response =>{
                  //console.log(response)
                  this.courseInfo = response.data.courseInfo
                  subject.getTreeList()
                    .then(response =>{
                      this.oneLevelSubjectList= response.data.items
                      console.log(this.oneLevelSubjectList)
                      for(let i=0;i<this.oneLevelSubjectList.length;i++){
                            if(this.oneLevelSubjectList[i].id==this.courseInfo.subjectParentId){
                              this.twoLevelSubjectList=this.oneLevelSubjectList[i].children
                            }
                      }
                    })
                })
                .catch(response =>{

                })
              this.getAllTeacher()//获得所有讲师
            //修改操作

        }else {
          this.getOneLevelList()//获得一级分类
          this.getAllTeacher()//获得所有讲师
          //表单数据情空
          this.courseInfo={title: null,
            subjectId: null,
            teacherId: null,
            lessonNum: 0,
            description:null,
            cover:null,
            subjectParentId:null,
            price: 0}

        }
      },
      //上传课程图片成功后将图片路径返回给cover
      handleAvatarSuccess(ref,file){
        console.log(ref.data.path)
        this.courseInfo.cover=ref.data.path
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      //出发change事件，根据一级分类选择二级分类
      //@change事件会自动将选择的一级分类的id传递过来
      subjectLevelOneChanged(value){
        //console.log(value)
        for(let i=0;i<this.oneLevelSubjectList.length;i++){
          if(this.oneLevelSubjectList[i].id==value){
            this.twoLevelSubjectList=this.oneLevelSubjectList[i].children
            this.courseInfo.subjectId =''
          }
        }
      },

        //获得一级分类信息 一级分类包含所有分类信息
      getOneLevelList(){
        subject.getTreeList()
          .then(response =>{
           this.oneLevelSubjectList= response.data.items
          })
          .catch()
      },
      //查询讲师信息
      getAllTeacher() {
        course.getAllTeacher()
          .then(response => {
            this.teacherList = response.data.item
          })
          .catch( response =>{
            this.$message({
              type: 'error',
              message: '查询讲师信息失败!'
            })
          })
      },
      //填写课程信息
      next(){
        //根据课程id判断是添加还是修改
        if(!this.courseInfo.id){
          //没有id为添加
          this.addCoureseInfo()
        }else {
          //修改
          this.updateCourse()
        }

      },
      //添加课程信息
      addCoureseInfo(){
        course.addCourseInfo(this.courseInfo)
          .then(response =>{
            const courseId=response.data.courseId
            console.log(courseId)
            this.$router.push({path:'/course/chapter/'+courseId})
          })
          .catch( response =>{
            this.$message({
              type: 'error',
              message: '添加失败!'
            })
          })
      },
      //修改课程信息
      updateCourse(){
        course.updateTeacherInfo(this.courseInfo)
          .then(response =>{
            this.$router.push({path:'/course/chapter/'+this.courseInfo.id})
          })
          .catch(response =>{
            this.$message({
              type: 'error',
              message: '修改失败!'
            })
          } )
      }
    }
  }
</script>

<style >

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

