<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <img src="../../assets/img/img.jpg" title="点击上传头像" class="avatar">
<!--                <myUpload-->
<!--                    v-model="show"-->
<!--                    :headers="headers"-->
<!--                    :url="updateAvatarApi"-->
<!--                    @crop-upload-success="cropUploadSuccess"-->
<!--                />-->
              </div>
            </div>
            <ul class="user-info">
              <li><div style="height: 100%"><i class="el-icon-lx-exit"></i>登录账号<div class="userRight">admin</div></div></li>
              <li><i class="el-icon-lx-people"></i>用户昵称 <div class="userRight">luochuang</div></li>
              <li><i class="el-icon-lx-mobile"></i>手机号码 <div class="userRight">15871595179</div></li>
              <li><i class="el-icon-lx-mail"></i>用户邮箱 <div class="userRight">361808700@qq.com</div></li>
              <li>
                <i class="el-icon-lx-lock"></i>安全设置
                <div class="userRight">
                  <a @click="" style="margin-right: 10px">修改密码</a>
                  <a @click="">修改邮箱</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--    用户资料    -->
        <el-card class="box-card">
          <el-tabs value="first">
            <el-tab-pane label="用户资料" name="first">
              <el-form ref="form" :model="form" :rules="rules" style="margin-top: 10px;" size="small" label-width="65px">
                <el-form-item label="昵称" prop="nickName">
                  <el-input v-model="form.nickName" style="width: 35%" />
                  <span style="color: #C0C0C0;margin-left: 10px;">用户昵称不作为登录使用</span>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                  <el-input v-model="form.phone" style="width: 35%;" />
                  <span style="color: #C0C0C0;margin-left: 10px;">手机号码不能重复</span>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="form.gender" style="width: 178px">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                  <el-button size="mini" type="primary" @click="">保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
<!--    <updateEmail ref="email" :email="user.email" />-->
<!--    <updatePass ref="pass" />-->
  </div>
</template>

<script>
export default {
  name: "usercenter",
  data: function (){
    return{
      form: {
        nickName: '管理员',
        phone: '18888888889',
        gender: '男'
      },
      rules: {
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur'}
        ]
      }
    }
  },

}
</script>

<style scoped>
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.user-info {
  padding-left: 0;
  list-style: none;
}
.user-info li{
  border-bottom: 1px solid #F0F3F4;
  padding: 11px 0;
  font-size: 13px;
}
.userRight{
  float: right;
}
.user-info a{
  color: #317EF3;
}
</style>
