<template>
  <div class="login-container">
    <div class="login-area">
      <!-- <h3 class="title"></h3> -->
      <div class="login-content">
        <img src="../static/rest.png" class="img" />
        <div class="login-form-div">
          <div class="title-container">
            <h3 class="login-title">企业工作平台</h3>
          </div>
          <div class="swtich-count">
            <el-button :class="!showPhoneLoginForm ? 'active' : ''" type="text" @click="switchLoginForm">账号密码登录</el-button>
            <el-button :class="showPhoneLoginForm ? 'active' : ''" type="text" @click="switchLoginForm">手机号登录</el-button>
          </div>
          <div class="login-form-box">
            <!-- 账号密码登录 -->
            <el-form v-show="!showPhoneLoginForm" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
              <!-- <div class="title-container" /> -->
              <el-form-item prop="username">
                <span class="svg-container">
                  <svg-icon icon-class="user" />
                </span>
                <el-input v-model="loginForm.username" placeholder="请输入账号" name="username" type="text" tabindex="1" />
              </el-form-item>
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="请输入密码"
                  name="password"
                  tabindex="2"
                  @keyup.enter.native="handleLogin"
                />
                <span class="input-right-box" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
              <div class="login-check">
                <span class="saves">
                  <el-checkbox v-model="saveAccountChecked" />
                  <!-- <input class="save" name="save" type="checkbox" onClick="saveAccount" checked> -->
                </span>
                <span class="save-ck">记住账号</span>
                <!-- <div class="tip" @click="switchLoginForm">用手机号登录</div> -->
              </div>
              <el-button class="handleLogin" :loading="loading" type="primary" @click.native.prevent="handleLogin">登录</el-button>
            </el-form>
            <!-- 手机号登录 -->
            <el-form v-show="showPhoneLoginForm" ref="phoneLoginForm" :rules="phoneLoginRules" :model="phoneLoginForm" class="login-form" label-position="left">
              <el-form-item prop="phone">
                <span class="svg-container">
                  <i class="el-icon-phone" />
                </span>
                <el-input ref="phone" v-model="phoneLoginForm.phone" placeholder="请输入手机号码" name="phone" type="text" tabindex="1" />
              </el-form-item>

              <el-form-item prop="code">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input ref="code" v-model="phoneLoginForm.code" placeholder="请输入验证码" name="code " tabindex="2" @keyup.enter.native="handlePhoneLogin" />
                <span class="input-right-box" :class="{ disable: countdown != 0 }" @click="getCode">
                  获取验证码
                  <i v-if="countdown != 0" class="countdown">({{ countdown }})</i>
                </span>
              </el-form-item>
              <div class="login-check">
                <!-- <div class="tip" @click="switchLoginForm">用账号密码登录</div> -->
              </div>
              <el-button :loading="loading" type="primary" class="handleLogin" @click.native.prevent="handlePhoneLogin">登录</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-top">
        <el-button type="text">帮助</el-button>
        <el-button type="text">隐私</el-button>
        <el-button type="text">条款</el-button>
      </div>
      <div class="copyright">Copyright © 2020 城客科技有限公司</div>
    </div>
  </div>
</template>

<script>
import storage from '@/utils/storage'
import { isPhone } from '@/utils/validate'
// import { setTimeout } from 'timers'

// import { postVerificationCode } from '@/api/system-module/userApi'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value || value.length < 3) {
        callback(new Error('密码至少3位数以上'))
      } else {
        callback()
      }
    }
    return {
      saveAccountChecked: false,
      timer: null,
      countdown: 0,
      showPhoneLoginForm: false, // 默认账号密码登录
      loginForm: {
        username: '',
        password: ''
      },
      phoneLoginForm: {
        phone: '',
        key: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      phoneLoginRules: {
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { type: 'string', min: 11, message: '手机号不允许小于11位', trigger: 'blur' },
        //   { validator: isPhone, trigger: 'blur' }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // if (storage.getLocalStorage('loginAccount')) {
    //   this.loginForm.username = storage.getLocalStorage('loginAccount')
    //   this.saveAccountChecked = true
    // }
  },
  mounted(){
    if (storage.getLocalStorage('loginAccount')) {
      this.loginForm.username = storage.getLocalStorage('loginAccount')
      this.saveAccountChecked = true
    }
  },
  beforeRouteLeave(to, from, next) {
    this.stopCountDown()
    next()
  },
  methods: {
    // 用手机号登录
    switchLoginForm() {
      this.showPhoneLoginForm = !this.showPhoneLoginForm
      // if (this.showPhoneLoginForm) {
      //   this.$refs.loginForm.resetFields()
      // } else {
      //   this.$refs.phoneLoginForm.resetFields()
      // }
    },
    getCode() {
      if (!/^1[3456789]\d{9}$/.test(this.phoneLoginForm.phone)) {
        this.$message({
          message: '请输入正确的手机号',
          type: 'error'
        })
        return
      }
      if (this.countdown !== 0) {
        this.$message('已经发送验证码了，请查收')
        return
      }
      this.$actionLoading.show()
      postVerificationCode(this.phoneLoginForm.phone).then(res => {
        this.phoneLoginForm.key = res.data.key
        console.log(res)
        this.$message({
          message: '已经成功发送验证码',
          type: 'success'
        })
        this.countdown = 60
        this.timer = setInterval(() => {
          this.countdown--
          if (this.countdown <= 0) {
            this.stopCountDown()
          }
        }, 1000)
      })
    },
    stopCountDown() {
      if (this.timer) {
        window.clearInterval(this.timer)
        this.timer = null
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(res => {
              if (res.code === '200') {
                // 获取系统消息
                if (this.saveAccountChecked) {
                  storage.setLocalStorage('loginAccount', this.loginForm.username)
                } else {
                  storage.removeLocalStorageItem('loginAccount')
                }
              }
              // 判断是否客服链接云信

              // this.$store.dispatch('nimModule/connect', {
              //   yunId: 'yzb-3423606777997709432',
              //   yunToken: '3423606777997709432'
              // })
              // this.$router.push({ path: this.redirect || '/' })
              let params = {}
              if (this.redirect) {
                params = { path: this.redirect }
              } else {
                params = { name: this.$store.state.premission.firstRouteName }
              }
            //   this.$router.push(params)
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    handlePhoneLogin() {
      this.$refs.phoneLoginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/codeLogin', this.phoneLoginForm)
            .then(res => {
              // 获取系统消息
              // this.$store.dispatch('app/getTaskListNoneReadData')
            //   this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.handleLogin {
  margin-bottom: 52px;
}
@media screen and (min-width: 768px) {
  .login-area {
    width: 1100px;
    margin: 0 auto;
  }
  .title {
    font-size: 50px;
  }
  .img {
    width: 550px;
    height: 459px;
  }
}
@media screen and (max-width: 768px) {
  .login-area {
    width: 100%;
    .title {
      font-size: 30px;
    }
    .login-content {
      width: 100%;
      .img {
        width: 420px;
        height: 420px;
      }
    }
  }
}
/* reset element-ui css */
.login-container {
  width: 100%;
  overflow: hidden;
  height: 100%;
  margin: 0 auto;
//   background: url('../static/login.png');
  // background-image: linear-gradient(35deg, #195bb9, #0983e8);
  .login-area {
    height: 100%;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // flex-direction: column;
    text-align: center;
    .title {
      color: #fff;
      line-height: 50px;
      text-align: center;
      margin-bottom: 0;
    }
    .login-content {
      display: flex;
      justify-content: center;
      height: 100%;
      align-items: center;
      .img {
        flex: 1;
      }
      .el-input {
        display: inline-block;
        height: 47px;
        width: 88%;

        input {
          background: transparent;
          border: 0px;
          -webkit-appearance: none;
          border-radius: 0px;
          padding: 12px 5px 12px 15px;
          color: $light_gray;
          height: 47px;
          caret-color: $cursor;

          &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px $bg inset !important;
            -webkit-text-fill-color: $cursor !important;
          }
        }
      }

      .el-form-item {
        // border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
        margin-left: 40px;
      }
      .el-form-item__error {
        padding-top: 9px;
      }
    }
  }
  .footer {
    // margin-top: 100px;
    width: 1100px;
    color: #779ae7;
    position: absolute;
    bottom: 10px;
    text-align: center;
    left: 50%;
    transform: translate(-50%, 0);
    .footer-top {
      .el-button {
        width: 84px;
        color: #779ae7;
      }
    }
    // .copyright {
    //   margin-top: 20px;
    // }
  }
}

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
    height: 100vh;
  .login-form-div {
    flex: 1;
    height: 459px;
    background: white;
    box-shadow: 0px 0px 20px 0px rgba(205, 205, 205, 0.5);
    .login-title {
      display: block;
      margin-top: 50px;
      color: #779ae7;
      font-size: 26px;
      text-align: center;
    }
    .swtich-count {
      width: 248px;
      margin: 0 auto;
      justify-content: center;
      display: flex;
      margin-bottom: 25px;
      .el-button {
        color: rgba(80, 80, 80, 1);
        border-radius: 0;
        font-size: 16px;
      }
      .el-button.active {
        color: #779ae7;
        border-bottom: 2px solid #779ae7;
      }
    }
    .login-form-box {
      width: 100%;
    }
    .login-form {
      width: 100% !important;
      // border: 8px solid rgba(65, 150, 243, 0.6);
      box-sizing: border-box;
      color: rgba(80, 80, 80, 1);
      background-color: rgba(255, 255, 255, 1);
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      font-size: 14px;
      margin-left: 0px !important;
      padding: 0 67px;
      // line-height: 150%;
      text-align: center;

      ::-ms-reveal {
        display: none;
      }

      .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
      }

      .title-container {
        position: relative;
      }

      .input-right-box {
        position: absolute;
        right: -8px;
        top: 2px;
        font-size: 14px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
        &.disable-click {
          color: rgb(104, 104, 104);
        }
      }
      .login-check {
        width: 298px;
        height: 21px;
        margin: 31px auto 38px;
        .save-ck {
          height: 21px;
          line-height: 21px;
          float: left;
          padding-left: 4px;
        }
        .saves {
          float: left;
          height: 21px;
          line-height: 21px;
          .save {
            width: 16px;
            height: 16px;
            line-height: 21px;
            display: inline-block;
            text-align: left;
            margin-top: 3px;
          }
        }
        .tip {
          float: right;
          // display: inline-block;
          text-align: right;
          color: rgba(128, 128, 128, 1);
          font-size: 14px;
          line-height: 21px;
        }
      }
    }
  }
}
.login-container /deep/ .el-form-item {
  width: 316px;
  height: 40px;
  border: 0;
  .el-form-item__error {
    padding-left: 34px;
    padding-top: 5px;
  }
  .el-form-item__content {
    width: 298px;
    height: 40px;
    background: #fff;
    line-height: 40px;
    font-size: 14px;
    .svg-container {
      color: #889aa4;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      position: absolute;
      left: 12px;
      top: -6px;
      z-index: 9;
    }
    .el-input input {
      width: 298px;
      height: 40px;
      left: 1140px;
      top: 491px;
      padding-left: 34px;
      color: rgba(80, 80, 80, 1);
      background-color: rgba(255, 255, 255, 1);
      border-radius: 4px;
      font-size: 10px;
      line-height: 150%;
      border: rgba(208, 208, 208, 1) solid 1px;
    }
  }
}
.el-button /deep/ {
  width: 298px;
  height: 40px;
}
</style>