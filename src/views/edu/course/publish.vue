<template>
  <div>
    <el-steps :active="3"  finish-status="success" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="发布课程"></el-step>
    </el-steps>


    <div class="ccInfo">
      <img :src="courseInfo.cover">
      <div class="main">
        <h2>{{ courseInfo.title }}</h2>
        <p><span>所属分类：{{ courseInfo.levelone }} — {{ courseInfo.leveltwo }}</span></p>
        <p>课程讲师：{{ courseInfo.teacherName }}</p>
        <p ><span>价格：</span>
          {{  courseInfo.price=== 0 ? '免费' :
          '¥' + courseInfo.price.toFixed(2) }}
        </p>
      </div>
    </div>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">发布课程</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import course from '@/api/course'
  export default {
    name: "publish",
    data(){
      return{
        saveBtnDisabled:false,
        id:null,
        courseInfo:{}
      }
    },
    created() {
      this.init()
      this.getAllCourseInfo()
    },
    methods:{
      //获得课程信息
      getAllCourseInfo(){
        course.getAllCourseInfo(this.id)
          .then(response =>{
            this.courseInfo=response.data.item
          })
          .catch(response =>{
            this.$message({
              type:'error',
              message:'数据显示错误'
            })
          })
      },
      init(){
        this.id=this.$route.params.id
      },

      //发布课程
      publish(){
        course.updateCourseById(this.id)
          .then(response =>{
            this.$message({
              type: 'success',
              message:'发布课程成功'
            })
            this.$router.push({path:'/course'})
          })
          .catch(() =>{
            this.$message({
              type: 'error',
              message:'发布课程失败'
            })
          })
      },

      //返回上一步修改
      previous(){
        this.$router.push({path:'/course/chapter/'+this.id})
      },

    }
  }
</script>

<style scoped>

  .ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
  }

  .ccInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
  }

  .ccInfo .main {
    margin-left: 520px;
  }

  .ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
  }

  .ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
  }

  .ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
  }

  .ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;}
</style>
