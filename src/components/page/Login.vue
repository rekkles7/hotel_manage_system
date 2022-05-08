<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">酒店后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="账号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.password"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
              <el-form-item prop="code" >
                <el-input
                    placeholder="验证码"
                    v-model="param.code"
                    style="width: 63%"
                >
                  <el-button slot="prepend" icon="el-icon-lx-info"></el-button>
                </el-input>
                <div class="login-code">
                  <img class="code-img" :src="codeUrl" @click="getCode">
                </div>
              </el-form-item>
              <el-checkbox v-model="param.rememberMe" style="margin:0 0 25px 0;">
                记住我
              </el-checkbox>
                <div class="login-btn">
                    <el-button type="primary" @click="handleLogin()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import {getCodeImg} from "@/api/login";
import { encrypt} from '@/utils/rsaEncrypt'
import Cookies from 'js-cookie'
import Config from '@/settings'
export default {
    data: function() {
        return {
            param: {
                username: 'admin',
                password: '123456',
                code: '',
                uuid: '',
                rememberMe: false
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
            },
          codeUrl:'',
          cookiePass: ''
        };
    },
    created() {
      this.getCode()
      this.getCookie()
    },
    methods: {
      getCookie() {
        const username = Cookies.get('username')
        let password = Cookies.get('password')
        const rememberMe = Cookies.get('rememberMe')
        // 保存cookie里面的加密后的密码
        this.cookiePass = password === undefined ? '' : password
        password = password === undefined ? this.param.password : password
        this.param = {
          username: username === undefined ? this.param.username : username,
          password: password,
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
          code: ''
        }
      },
      handleLogin(){
        this.$refs.login.validate(valid =>{
          if (valid){//如果表单校验通过，则发送登陆请求
            const user = {
              username: this.param.username,
              password: this.param.password,
              rememberMe: this.param.rememberMe,
              code: this.param.code,
              uuid: this.param.uuid
            }
            if (user.password !== this.cookiePass) {
              user.password = encrypt(user.password)
            }
            if (user.rememberMe) {
              Cookies.set('username', user.username, { expires: Config.passCookieExpires })
              Cookies.set('password', user.password, { expires: Config.passCookieExpires })
              Cookies.set('rememberMe', user.rememberMe, { expires: Config.passCookieExpires })
            } else {
              Cookies.remove('username')
              Cookies.remove('password')
              Cookies.remove('rememberMe')
            }
            this.$store.dispatch('Login', user).then(res=>{
              this.$router.push('/')
            }).catch(()=>{
              this.$message({
                message: '登录信息有误',
                type: 'error'
              });
              this.getCode()
            })
          }else alert('请按要求完善登陆信息！')
        })
      },
      getCode(){
        getCodeImg().then(res=>{
          this.codeUrl = res.data.img
          this.param.uuid = res.data.uuid
        })
      },
    }
};
</script>

<style scoped>
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;
}
.code-img {
  height: 31px;
  width: 94px;
  cursor: pointer;
  vertical-align:middle
}
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: black;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
