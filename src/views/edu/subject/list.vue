<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
    <el-button type="text" @click="showAddOneLevel()" style="font-size: 20px">添加一级分类</el-button>
    <el-tree
      class="filter-tree"
      :data="subjectList"
      :props="defaultProps"
      :expand-on-click-node="false"

      :filter-node-method="filterNode"
      ref="tree"
      node-key="id">

    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level==1"
            type="text"
            size="mini"
            @click="() => {dialogFormVisible=true;subject.parentId=data.id}"
            style="font-size: 15px">
            添加二级分类
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)"
            style="font-size: 15px">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

<!--添加弹框-->
    <el-dialog :visible.sync="dialogFormVisible"  title="添加分类">
      <el-form :model="subject"    label-width="120px">
        <el-form-item label="分类标题">
          <el-input v-model="subject.title"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="appendLevel()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import subject from '@/api/subject'
  export default {
    name: "list",
    data(){
      return{
        dialogFormVisible:false,
        filterText: '',
        subjectList: [],
        subject:{
          title:null,
          parentId:null,
        },
        defaultProps: {
        children: 'children',
        label: 'title'
      }
     }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
      this.fetchNodeList()

    },
    methods:{
      //添加分类
      appendLevel(){
        if(this.subject.parentId){//如果没有parentId则是添加一级分类
          this.addTwoLevel()
        }
        else {
         this.addOneLevel()
          }
        },

      //添加二级分类
      addTwoLevel(){
        subject.addTwoNode(this.subject)
          .then( () =>{
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.dialogFormVisible=false
            this.fetchNodeList()
            this.subject.title = null// 重置类别标题
            this.subject.parentId = null// 重置表单parentId
          })
          .catch(() =>{
            this.$message({
              type: 'error',
              message: '添加失败!'
            })
          })
      },
      //添加一级分类
      addOneLevel(){

        subject.addOneNode(this.subject)
          .then( () =>{
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.dialogFormVisible=false
            this.fetchNodeList()
            this.subject.title = null// 重置类别标题
            this.subject.parentId = null // 重置表单parentId
          })
          .catch(() =>{
            this.$message({
              type: 'error',
              message: '添加失败!'
            })
          })
      },
      //弹出添加分类框
      showAddOneLevel(){
        this.subject.title = null// 重置类别标题
        this.subject.parentId = null // 重置表单parentId
        this.dialogFormVisible=true
      },
      remove(node, data){
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
         return subject.deleteNode(data.id)
        })
          .then(() => {
            //删除之后刷新页面
            //this.fetchNodeList()
            this.$refs.tree.remove(node) // 删除节点（效率高）
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
          }
        });

      },
      fetchNodeList(){
        subject.getTreeList()
          .then( responce =>{
            if(responce.success==true){
              this.subjectList=responce.data.items
            }
          })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
      }
    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
