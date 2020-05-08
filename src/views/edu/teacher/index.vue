<template>
  <div>
  <!--查询表单-->
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item>
      <el-input v-model="searchObj.name" placeholder="讲师名"/>
    </el-form-item>
    <el-form-item>
      <el-select v-model="searchObj.level" clearable placeholder="讲师头衔">
        <el-option :value="1" label="高级讲师"/>
        <el-option :value="2" label="首席讲师"/>
      </el-select>
    </el-form-item>

      <span class="demonstration">选择时间</span>
      <el-date-picker
        v-model="searchObj.begin"
        type="datetime"
        placeholder="选择开始时间">
      </el-date-picker>

      <el-date-picker
        v-model="searchObj.end"
        type="datetime"
        placeholder="选择截止时间"
      />

    <el-button type="primary" icon="el-icon-search" @click="getTeacherList()">查询</el-button>
    <el-button type="default" @click="resetData()">清空</el-button>
  </el-form>
  <!-- 表格 -->
  <el-table
    v-loading="listLoading"
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
        {{ (page - 1) * size + scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column prop="name" label="名称" width="80" />
    <el-table-column label="头衔" width="80">
      <template slot-scope="scope">
        {{ scope.row.level===1?'高级讲师':'首席讲师' }}
      </template>
    </el-table-column>
    <el-table-column prop="intro" label="资历" />
    <el-table-column prop="career" label="简介" />
    <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
    <el-table-column prop="sort" label="排序" width="60" />
    <el-table-column label="操作" width="200" align="center">
      <template slot-scope="scope">
      <router-link :to="'/teacher/edit/'+scope.row.id">  <!-- 点击修改按钮 跳转到修改页面-->
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
        </router-link>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

<!--  分页-->
    <el-pagination
      @current-change="getTeacherList"
      :current-page="page"
      :page-size="size"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import teacher from '@/api/teacher'
  export default {
    name: "index",
    data(){
      return{
      list: null,// 数据列表
      total: 0, // 总记录数
      page: 1, // 当前页码
      size: 10, // 每页记录数
      searchObj: {},// 查询条件
      }
    },
    created() {
      this.getTeacherList();
    },
    methods:{
      removeDataById(id){//删除讲师方法
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
           return  teacher.deleteTeacherById(id)//删除信息
          })
          .then(() => {
          this.getTeacherList()  //重新获得列表
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch((responce) => {
          if (responce === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        });

      },
      resetData(){//重置按钮方法
        this.searchObj={}
        this.getTeacherList()
      },
      getTeacherList(page = 1){//讲师分页方法
        this.page = page
       //this.listLoading = true
        teacher.getTeacherPageList(this.page,this.size,this.searchObj)
          .then( responce => {
            //每页数据
             this.list=  responce.data.items
            //总记录数
            this.total= responce.data.total
          //  console.log(this.list)
        // this.listLoading = false
          })
          .catch(  () =>{
            this.$message({
              type: 'info',
              message: '数据没了，请刷新！'
            });
          })
      }
    }
  }
</script>

<style scoped>

</style>
