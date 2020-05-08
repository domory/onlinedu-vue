<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="选择Excel">

        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"

          :limit="1"
          :action="BASE_API+'/eduservice/subject/upload'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "import",
    data() {
      return {
        BASE_API: process.env.BASE_API, // 接口API地址
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false
    }
    },
    methods: {
    submitUpload() {
      this.importBtnDisabled = true
      this.$refs.upload.submit()
    },
    fileUploadSuccess(response) {
      if (response.success === true) {
        this.loading = false
        this.$message({
          type: 'success',
        message: "上传成功！"
      })
      } else {

        const messages = response.data.msg
        let msgString = '<ul>'
        messages.forEach(msg => {
          msgString += `<li>${msg}</li>`
        })
        msgString += '</ul>'
        this.$alert(msgString, response.message, {
          dangerouslyUseHTMLString: true
      })
      }
    },
    fileUploadError(response) {
      this.$message({
        type: 'error',
      message: '导入失败'
    })
    }
  }
  }
</script>

<style scoped>

</style>
