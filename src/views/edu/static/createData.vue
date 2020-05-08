<template>
  <div>

      <el-date-picker
        v-model="day"
        type="date"
        placeholder="选择日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary" @click="create()">生成</el-button>

  </div>
</template>

<script>
  import statics from '@/api/static'

  export default {
    name: "createData",
    data(){
      return{
        day:''
      }
    },
    methods:{
      create(){
        statics.createdata(this.day)
          .then(()=>{
            this.$message({
              type:'success',
              message:'生成成功'
            })
          })
      }
    }
  }
</script>

<style scoped>

</style>
