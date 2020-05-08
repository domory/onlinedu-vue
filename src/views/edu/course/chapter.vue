<template>
  <div class="app-container">
    <el-steps :active="2"  finish-status="success" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="发布课程"></el-step>
    </el-steps>


<!--    <ul>-->
<!--      <li  v-for="courseVedio in CourseVedioList" :key="courseVedio.id">-->
<!--        {{courseVedio.title}}-->
<!--        <ul>-->
<!--          <li v-for="vedio in courseVedio.child">-->
<!--            {{vedio.title}}-->
<!--          </li>-->
<!--        </ul>-->
<!--      </li>-->
<!--    </ul>-->

<!--    <el-input-->
<!--      placeholder="输入关键字进行过滤"-->
<!--      v-model="filterText">-->
<!--    </el-input>-->
<!--    <el-button type="text" @click="dialogFormVisible=true" style="font-size: 20px">添加章节</el-button>-->
<!--    <el-tree-->
<!--      class="filter-tree"-->
<!--      :data="coursevedioList"-->
<!--      :props="defaultProps"-->
<!--      :filter-node-method="filterNode"-->
<!--      :expand-on-click-node="false"-->
<!--      ref="tree">-->
<!--       <span class="custom-tree-node" slot-scope="{ node, data }">-->
<!--        <span>{{ node.label }}</span>-->
<!--        <span>-->
<!--          <el-button-->
<!--            v-if="node.level==1"-->
<!--            type="text"-->
<!--            size="mini"-->
<!--            @click=""-->
<!--            style="font-size: 15px">-->
<!--            添加小结-->
<!--          </el-button>-->
<!--          <el-button-->
<!--            type="text"-->
<!--            size="mini"-->
<!--        @click="() => {{node.level===1 ? getchapterInfo(data.id) : getvedioInfo(data.id)}}"-->
<!--            style="font-size: 15px">-->
<!--            编辑-->
<!--          </el-button>-->
<!--          <el-button-->
<!--            type="text"-->
<!--            size="mini"-->
<!--            @click="() => remove(node, data)"-->
<!--            style="font-size: 15px">-->
<!--            删除-->
<!--          </el-button>-->
<!--        </span>-->
<!--      </span>-->
<!--    </el-tree>-->

    <el-button type="text" @click="showdialog()">添加章节</el-button>
    <!-- 章节 -->

    <ul class="chanpterList">
      <li
        v-for="chapter in coursevedioList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
                <el-button type="text" @click="showaddVedio(chapter.id)">添加小结</el-button>
                <el-button style="" type="text" @click="dialogFormVisible=true;getChapterInfo(chapter.id)">编辑</el-button>
                <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 小结 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                        <el-button type="text" @click="dialogVedioVisible=true;getVedioInfoById(video.id)">编辑</el-button>
                        <el-button type="text" @click="removeVedioInfo(video.id)">删除</el-button>
                    </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!--章节添加和修改弹框-->
    <el-dialog :visible.sync="dialogFormVisible"  title="添加章节">
      <el-form :model="chapter"    label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" controls-position="right"  :min="0" ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="appendOrUpdateInfo()">确 定</el-button>
      </div>
    </el-dialog>


      <!--小结添加修改弹窗 -->
    <el-dialog :visible.sync="dialogVedioVisible"  title="添加小结">
      <el-form :model="vedio"    label-width="120px">
        <el-form-item label="小结标题">
          <el-input v-model="vedio.title"/>
        </el-form-item>
        <el-form-item label="小结排序">
          <el-input-number v-model="vedio.sort" controls-position="right"  :min="0" ></el-input-number>
        </el-form-item>


        <!--上传视频-->
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/vedioservice/uploadvedio'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVedioVisible = false">取 消</el-button>
        <el-button type="primary" @click="appendOrUpdateVedio()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import chapter from '@/api/chapter'
  import vedio from '@/api/vedio'

  export default {
    name: "chapter",
    data() {
      return {
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        saveBtnDisabled: false,

        fileList:[],
        BASE_API: process.env.BASE_API, // 接口API地址
        dialogFormVisible:false,//章节弹框是否可见
        dialogVedioVisible:false,//小结弹框是否可见
        courseId: null,
        coursevedioList: [],//章节小结列表
        vedio:{//小结初始值
          title:null,
          sort:0,
          courseId:null,
          chapterId:null,
          videoSourceId:null,
          videoName:null
        },
        chapter:{ //章节初始值
          id:null,
          title:null,
          sort:0,
          courseId:null,
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
      this.init()
      this.getCourseVedioList(this.courseId)
    },
    methods: {
      //树形结构
      // getchapterInfo(id){
      //   alert(id)
      //   this.dialogFormVisible=true
      //   chapter.getChapterInfoById(id)
      //     .then(response =>{
      //       this.chapter=response.data.item
      //     })
      //     .catch(response =>{
      //       this.$message({
      //         type: 'error',
      //         message: '查询章节信息失败!'
      //       })
      //     })
      // },
      // getvedioInfo(id){
      //   alert(id)
      //   this.dialogVedioVisible=true
      //   vedio.getVedioInfoById(id)
      //     .then(response =>{
      //       this.vedio=response.data.item
      //     })
      //     .catch( () =>{
      //       this.$message({
      //         type:'error',
      //         message:'小结数据显示失败'
      //       })
      //     })
      // },

      //删除视频
      handleRemove(files, fileList){
        vedio.deleteAliVedio(this.vedio.videoSourceId)
          .then(() =>{
            this.$message({
              type:'success',
              message:'删除视频成功'
            })
            this.vedio.videoSourceId=''
            this.vedio.videoName=''
          })
          .catch()
      },


      //点击删除视频 显示提示
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },


      //视频上传成功 返回视频id
      handleVodUploadSuccess(response, file, fileList){
        this.vedio.videoSourceId=response.data.vedioId
        this.vedio.videoName=file.name
      },


      //删除小结方法
      removeVedioInfo(id){
        this.$confirm('此操作将永久删除该小结, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
          return vedio.deleteVedio(id)
        })
          .then(() => {
            //删除之后刷新页面
            this.getCourseVedioList(this.courseId)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          .catch((responce) => {
            if (responce === 'cancel') {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            }
          })
      },

      //小结添加和修改方法
      appendOrUpdateVedio(){
        //判断增加还是修改
        //根据vedio id判断
        if(!this.vedio.id){
          //没有id则是添加
          this.addVedioInfo()
        }else {
          this.updateVedio()
        }
      },
      //更新小结信息
      updateVedio(){
        vedio.updateVedio(this.vedio)
          .then(response =>{
            this.$message({
              type:"success",
              message:"修改成功"
            })
            this.dialogVedioVisible=false//关闭弹窗
            this.getCourseVedioList(this.courseId)
          })
          .catch( () =>{
            this.$message({
              type:"error",
              message:"修改失败"
            })
          })
      },


      //编辑按钮数据回显
      getVedioInfoById(id){
        vedio.getVedioInfoById(id)
            .then(response =>{
              this.vedio=response.data.item
              //判断小结小面是否有视频
              if(this.vedio.videoName&& this.vedio.videoName!='') {
                this.fileList = [{'name': this.vedio.videoName}]
              }else {
                this.fileList=[]
              }
            })
            .catch( () =>{
              this.$message({
                type:'error',
                message:'小结数据显示失败'
              })
            })
      },

      //添加小结方法
      addVedioInfo(){
        this.vedio.courseId=this.courseId
        vedio.addVedio(this.vedio)
          .then( () =>{
            this.$message({
              type: 'success',
              message: '添加小结信息成功'
            })
            this.dialogVedioVisible=false//关闭弹窗
            this.getCourseVedioList(this.courseId)
          })
          .catch(() =>{
            this.$message({
              type: 'error',
              message: '添加小结信息失败'
            })
          })
      },

      //弹出添加小结弹框
     showaddVedio(chapterId){
        //弹框显示之前清空数据
         this.vedio.id=null
        this.vedio.title=null
        this.vedio.sort=0
        this.fileList=[]
        this.vedio.chapterId=chapterId
        this.dialogVedioVisible=true
      },

      //删除章节方法
      deleteChapter(id){
        this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
          return chapter.deleteChapterById(id)
        })
          .then(() => {
            //删除之后刷新页面
            this.getCourseVedioList(this.courseId)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          .catch((responce) => {
          if (responce === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          }
        })
      },


      //章节添加和修改方法
      appendOrUpdateInfo(){
        if(!this.chapter.id){
          //如果没有有id则是添加操作
        this.addchapter()
          }
        else {
          //否则是修改操作
          this.updatechapter()
        }
      },


      //修改章节信息方法
      updatechapter(){
        chapter.updateChapter(this.chapter)
          .then(()=> {
            this.$message({
              type: 'success',
              message: '修改章节信息成功'
            })
            //弹窗不可见
            this.dialogFormVisible=false
            //返回章节小结列表
            this.getCourseVedioList(this.courseId)
            //清空填充数据
            this.chapter.sort=0
            this.chapter.title=null
            this.chapter.courseId=null
            this.chapter.id=null
          })
          .catch(()=>{
            this.$message({
              type:'error',
              message:'修改章节信息失败'
            })
          })
      },


      //修改章节之前先数据回显
      getChapterInfo(id){
        chapter.getChapterInfoById(id)
          .then(response =>{
            this.chapter=response.data.item
          })
          .catch(response =>{
            this.$message({
              type: 'error',
              message: '查询章节信息失败!'
            })
          })

      },


      //添加章节显示弹窗
      showdialog(){
        this.chapter.sort=0
        this.chapter.title=null
        this.dialogFormVisible=true
      },


      //添加章节方法
      addchapter(){
        this.chapter.courseId=this.courseId
        chapter.addChapter(this.chapter)
          .then( response =>{
            this.$message({
              type: 'success',
              message: '添加章节成功!'
            })
            //弹窗不可见
            this.dialogFormVisible=false
            //返回章节小结列表
            this.getCourseVedioList(this.courseId)
            //清空填充数据
            this.chapter.sort=0
            this.chapter.title=null
            this.chapter.courseId=null
          })
          .catch(response =>{
            this.$message({
              type: 'error',
              message: '添加章节失败!'
            })
          })
        },


      //筛选方法
      filterNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },


      //根据courseId获得章节和小结信息
      getCourseVedioList(courseId) {
        chapter.getChapterVedioList(courseId)
          .then(response => {
            this.coursevedioList = response.data.items
          })
          .catch(response => {
            this.$message({
              type: 'error',
              message: '查询失败!'
            })
          })
      },


      init() {
        this.courseId = this.$route.params.id
      },


      next() {
        this.$router.push({path: '/course/publish/' + this.$route.params.id})
      },


      previous() {
        this.$router.push({path: '/course/info/' + this.$route.params.id})
      }

    }
  }
</script>

<style scoped>
  .chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .chanpterList li{
    position: relative;
  }

  .chanpterList p{
    float: left;
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }

  .chanpterList .acts {
    float: right;
    font-size: 14px;
  }

  .videoList{
    padding-left: 50px;
  }

  .videoList p{
    float: left;
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }

</style>
