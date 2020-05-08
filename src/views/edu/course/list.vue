<template>
  <div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="请输入讲师名称(输入全称)" width="350"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.title" placeholder="课程名"/>
      </el-form-item>


      <el-button type="primary" icon="el-icon-search" @click="getCourseList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (currentpage - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程名称" width="80" />
      <el-table-column label="价格" width="100" align="center" >
        <template slot-scope="scope">
          {{ Number(scope.row.price) === 0 ? '免费' :
          '¥' + scope.row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" width="150" label="课时数" />


      <!--  课程封面    -->
      <el-table-column prop="cover" label="图片" min-width="20%" >
        <!-- 图片的显示 -->
        <template   slot-scope="scope">
          <img :src="scope.row.cover"  min-width="70" height="70" />
        </template>
      </el-table-column>

      <!--  讲师 TODO-->
      <el-table-column prop="teacherName" label="课程讲师" width="100" />

      <!-- 课程描述 -->
      <el-table-column prop="description" label="课程描述" width="100" />

      <!--课程状态-->
      <el-table-column prop="status" label="课程状态" width="100" >
        <template slot-scope="scope">
          {{ scope.row.status === 'Draft' ? '未发布':'已发布'}}
        </template>
      </el-table-column>



      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">  <!-- 点击修改按钮 跳转到修改页面-->
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getCourseList"
      :current-page="currentpage"
      :page-sizes="[5, 10, 15]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import course from '@/api/course'
  import teacher from '@/api/teacher'

  export default {
    name: "list",
    data(){
      return{
        list: null,// 数据列表
        total: 0, // 总记录数
        currentpage: 1, // 当前页码
        size: 5, // 每页记录数
        searchObj: {},// 查询条件

      }
    },
    created() {
      this.getCourseList()
    },
    methods:{

      //删除课程信息 包括课程描述
      removeDataById(id){
        console.log(id)
        this.$confirm('此操作将永久删除该课程信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(response =>{
          return course.deleteCourseInfo(id)
        })
          .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
            this.getCourseList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },


      //改变当前页面记录数
      handleSizeChange(val){
        this.size=val
        this.getCourseList()
      },


      //清空条件
      resetData(){
        this.searchObj={}
        this.getCourseList()
      },

      //查询课程信息
      getCourseList(page = 1){
        this.currentpage=page
        course.getCourseInfo(this.currentpage,this.size,this.searchObj)
          .then( response =>{

            this.total=response.data.total
           this.list= response.data.items
            console.log(this.list)
          })
          .catch(  () =>{
            // this.$message({
            //   type: 'info',
            //   message: '数据没了，请刷新！'
            // });
          })
      }
    }
  }
</script>

<style scoped>

</style>
