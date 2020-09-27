<template>
  <div class="userEdit-container">
    <el-form ref="postForm" :model="postForm" label-width="120px">
      <el-form-item label="Avatar:">
        <el-upload
          class="avatar-uploader"
          :action="upload_url"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="avatar" :src="avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="Username:" prop="username">
        <el-input v-model="postForm.username" />
      </el-form-item>
      <el-form-item label="Email:" prop="email">
        <el-input v-model="postForm.email" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input placeholder="Please input password" v-model="postForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="Enabled">
        <el-switch v-model="postForm.enabled" />
      </el-form-item>
      <el-form-item label="Roles" prop="roles">
        <el-checkbox-group v-model="postForm.roles">
          <el-checkbox label="admin" name="roles">Admin</el-checkbox>
          <el-checkbox label="editor" name="roles">Editor</el-checkbox>
          <el-checkbox label="customer" name="roles">Customer</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">{{ uid==='' ? 'Create' : 'Modify' }}</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { usersAPI } from '@/api/user'
import formLogic from '@/utils/form-logic'
import { getToken } from '@/utils/auth'

const defaultForm = {
  username: '',
  email: '',
  roles: ['customer'],
  enabled: true,
  password: '',
  avatar: false,
}

export default {
  name: 'UserEdit',
  props: {
    uid: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateLength = (rule, value, callback) => {
      if (value === '' || value.length < 6) {
        var msg = rule.field + ' shall not be shorter that 6 characters'
        this.$message({
          message: msg,
          type: 'error',
        })
        callback(new Error(msg))
      }
      else {
        callback()
      }
    }

    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      headers: {
        'X-Token': getToken(),
      },
      upload_url: process.env.VUE_APP_BASE_API + '/avatar',
      avatar: false,
      rules: {
        username: [{validator: validateLength}],
        password: [{validator: validateLength}],
      }
    }
  },
  created() {
    if (this.uid !== '') {
      usersAPI.get(this.uid)
        .then(response => {
          this.postForm = response.data
          if (this.postForm.avatar) {
            this.avatar = process.env.VUE_APP_BASE_API + '/' + this.postForm.avatar
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  methods: {
    submitForm() {
      formLogic.submit(this, this.uid, usersAPI, this.postForm)
      /*
      console.log(this.postForm)
      const msg = {
        success: {
          title: "Message",
          message: "Successfully saved.",
          type: 'success',
          duration: 2000
        },
        fail: {
          title: "Error",
          message: "Failed to save."
          type: 'error',
          duration: 2000
        }
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.uid !== '') {
            usersAPI.patch(this.uid, postForm)
              .then(response => {
                this.$notify(msg.success)
                this.loading = false
              })
              .catch(err => {
                this.$notify(msg.fail)
                this.loading = false
              })
          }
          else {
            usersAPI.create(postForm)
              .then(response => {
                this.$notify(msg.success)
                this.loading = false
              })
              .catch(err => {
                this.$notify(msg.fail)
                this.loading = false
              })
          }
        }
        else {
          console.log('Failed to submit')
          return false;
        }
      })*/
    },
    onCancel() {
      this.$router.push('/users')
    },
    handleAvatarSuccess(res, file) {
      console.log(res)
      var avatar = process.env.VUE_APP_BASE_API + '/' + res.data.file;
      this.avatar = avatar
      console.log(avatar)
      this.postForm.avatar = res.data.file
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('Avatar picture must be JPG format!');
      }
      if (!isLt2M) {
        this.$message.error('Avatar picture size can not exceed 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.avatar-uploader {
  border: 1px solid lightgray;
  width: 135pt;
}
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
