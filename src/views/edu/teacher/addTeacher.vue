<template>
  <el-form ref="eduTeacher" :model="eduTeacher" label-width="80px">
    <el-form-item label="讲师名称">
      <el-input v-model="eduTeacher.name"></el-input>
    </el-form-item>
    <el-form-item label="讲师排序">
      <el-input-number v-model="eduTeacher.sort" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="讲师头衔">
      <el-select v-model="eduTeacher.level" placeholder="请选择讲师头衔">
        <el-option label="高级讲师" :value="1"></el-option>
        <el-option label="首席讲师" :value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="讲师资历">
      <el-input v-model="eduTeacher.intro"></el-input>
    </el-form-item>
    <el-form-item label="讲师简介">
      <el-input v-model="eduTeacher.career"></el-input>
    </el-form-item>

    <!-- 讲师头像 -->
    <el-form-item label="讲师头像">
      <!-- 头衔缩略图 -->
      <pan-thumb :image="eduTeacher.avatar"/>
      <!-- 文件上传按钮 -->
      <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
      </el-button>
      <!--
  v-show：是否显示上传组件
  :key：类似于id，如果一个页面多个图片上传控件，可以做区分
  :url：后台上传的url地址
  @close：关闭上传组件
  @crop-upload-success：上传成功后的回调 -->
      <image-cropper
        v-show="imagecropperShow"
        :width="300"
        :height="300"
        :key="imagecropperKey"
        :url="BASE_API+'/eduservice/oss/fileLoad'"
        field="file"
        @close="close"
        @crop-upload-success="cropSuccess"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveOrUpdateTeacher()">添加</el-button>
      <el-button v-show="show" @click="back()">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import teacher from '@/api/teacher'
  //图像组件
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'


  const  defaultForm={
    name:null,
    sort:0,
    level:1,
    career:null,
    intro:null,
    avatar:null
  }
  export default {
    name: "addTeacher",
    components:{ImageCropper,PanThumb},
    data(){
      return {
        imagecropperShow:false,
        imagecropperKey:0,
        BASE_API: process.env.BASE_API, // 接口API地址
        eduTeacher:defaultForm,
        show:false
      }
    },
    watch: {
        $route(to, from) {
        console.log('watch $route')
        this.init()
       }
  },
    created(){
      this.init();
    },
    methods:{
      //点击上传按钮
      cropSuccess(data){
        console.log(data)
        this.imagecropperShow=false
        this.eduTeacher.avatar=data.path
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1

      },
      //关闭上传组件
      close(){
        this.imagecropperShow=false
        // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      },
      init(){
        if(this.$route.params && this.$route.params.id){//数据回显
          this.show=true
          const id = this.$route.params.id
          this.getTeacherInfo(id)
        }else { //表单数据清空
          this.eduTeacher={...defaultForm}
        }
      },

      //添加和修改使用一个表单
      saveOrUpdateTeacher(){
        if(this.eduTeacher.id){
          this.updateTeacher()
        }else {
        this.saveTeacher()}
      },


      //修改讲师
      getTeacherInfo(id){//数据回显
        teacher.getTeacherById(id)
          .then( responce =>{
           this.eduTeacher=responce.data.item
          })
          .catch( () =>{
            this.$message({
              type: 'success',
              message: '获取数据失败!'
            });
          })
      },
      updateTeacher(){
        teacher.updateTeacher(this.eduTeacher)
          .then( () =>{
            return  this.$message({
              type: 'success',
              message: '修改成功!'
            });
          })
          .then(() =>{
            this.$router.push("/teacher/list")
          })
          .catch( () =>{
            this.$message({
              type: 'success',
              message: '修改失败!'
            });
          })
      },
      back(){//修改时返回
        this.$router.push("/teacher/list")
      },


      //添加讲师
      saveTeacher(){
        teacher.addTeacher(this.eduTeacher)
          .then(() => {
           return  this.$message({
              type: 'success',
              message: '添加成功!'
            });
          })
          .then( () =>{
            this.$router.push("/teacher/list")
          })
          .catch(() =>{
            return  this.$message({
              type: 'error',
              message: '添加失败!'
            });
          })
      }
    }
  }
</script>

<style scoped>

</style>
