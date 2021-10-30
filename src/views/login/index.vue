<template>
  <div class="login" :style="bgStyle">
    <div class="header">
      <img src="@/assets/logo/logo.png" />
      <span class="line"></span>
      <span class="header-title">数字孪生管理平台</span>
    </div>
    <div class="slideShadow" v-show="showSlide">
      <transition>
        <div class="slideSty animated bounce">
          <slide-verify
            @success="onSuccess"
            @fail="onFail"
            :sliderText="text"
            :w="350"
            :h="175"
            ref="slideDiv"
          ></slide-verify>
          <div class="iconBtn">
            <i class="el-icon-circle-close" @click="showSlide = false"></i
            ><i class="el-icon-refresh" @click="refresh"></i>
          </div>
        </div>
      </transition>
    </div>
    <div class="loginBox">
      <div class="loginCon">
        <div class="titleDiv">
          <h3>统一认证登录</h3>
          <p>欢迎使用山东大学数字孪生管理平台</p>
          <i class="el-icon-key"></i>
        </div>
        <el-form ref="loginForm" :rules="rules" :model="ruleForm">
          <el-form-item prop="user">
            <el-input
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              v-model="ruleForm.user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              v-model="ruleForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-button
            type="primary"
            class="loginBtn"
            @click="loginYz('loginForm')"
            >登录</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import SlideVerify from '@/components/SlideVerify'
export default {
  data() {
    return {
      notifyObj: null,
      text: '向右滑动',
      showSlide: false,
      ruleForm: {
        user: 'admin',
        password: '123456'
      },
      rules: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在3到5个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      bgStyle: {},
    }
  },
  mounted() {
    this.shopTip()
  },
  created() {
    this.bgStyle.backgroundImage =
      
      "url(" + require("@/assets/loginPic/bg01.jpg") + ")";
    this.bgStyle.backgroundRepeat = "no-repeat";
    this.bgStyle.backgroundSize = "100%";
  },
  methods: {
    onSuccess() {
      this.showSlide = false
      this._login()
    },
    onFail() {
      this.$message.error('验证失败')
    },
    refresh() {
      this.$refs.slideDiv.reset()
    },
    loginYz(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.showSlide = true
        } else {
          return
        }
      })
    },
    _login() {
      this.$store
        .dispatch('user/_login', this.ruleForm)
        .then(res => {
          if (!res.data.success) {
            this.refresh()
          } else {
            this.$router.push(this.$route.query.redirect)
            if (this.notifyObj) {
              this.notifyObj.close()
            }
            this.notifyObj = null
          }
        })
        .catch(error => {
          this.refresh()
          this.$message.error(error)
        })
    },
    shopTip() {
      this.notifyObj = this.$notify({
        title: '提示',
        message:
          '目前有两个登陆角色，管理员和普通用户，账号分别为：admin、user,密码都为：123456',
        duration: 0,
        iconClass: 'el-icon-s-opportunity'
      })
    }
  },
  components: {
    SlideVerify
  }
}
</script>
<style scoped lang="scss">
.header {
  position: absolute;
  width: 100%;
  height: 15%;
  top: 0;
}
.header img {
  float: left;
  margin-left: 10%;
  margin-top: 1%;
}
.header .line {
  height: 58px;
  border-left: 1px solid #fff;
  float: left;
  width: 20px;
  margin: 2% 0 0 10px;
}
.header .header-title {
  float: left;
  font-size: 28px;
  color: #fff;
  margin-top: 45px;
}

.login {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.loginBox {
  height: 455px;
  width: 550px;
  margin: 0 auto;
  position: relative;
  top: 50%;
  margin-top: -287px;
}
.loginH2 {
  font-size: 38px;
  color: #fff;
  text-align: center;
}
.loginCon {
  margin-top: 30px;
  background: #eee;
  border-radius: 4px;
  .titleDiv {
    padding: 0 28px;
    background: #fff;
    position: relative;
    height: 120px;
    border-radius: 4px 4px 0 0;
    h3 {
      font-size: 22px;
      color: #555;
      font-weight: initial;
      padding-top: 23px;
    }
    p {
      font-size: 16px;
      color: #888;
      padding-top: 12px;
    }
    i {
      font-size: 65px;
      color: #ddd;
      position: absolute;
      right: 27px;
      top: 29px;
    }
  }
  .el-form {
    padding: 25px 25px 30px 25px;
    background: #eee;
    border-radius: 0 0 4px 4px;
  }
}
.loginBtn {
  width: 100%;
  background: #19b9e7;
}
.slideShadow {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.slideSty {
  position: absolute;
  width: 380px;
  height: 311px;
  background: #e8e8e8;
  border: 1px solid #dcdcdc;
  left: 50%;
  top: 50%;
  margin-left: -188px;
  margin-top: -176px;
  z-index: 99;
  border-radius: 5px;
}
.iconBtn {
  padding: 9px 0 0 19px;
  color: #5f5f5f;
  border-top: 1px solid #d8d8d8;
  margin-top: 17px;
  i {
    font-size: 22px;
    cursor: pointer;
  }
  i:last-child {
    margin-left: 7px;
  }
}
</style>
<style>
.slideSty .slide-verify {
  margin: 13px auto 0 auto;
  width: 350px !important;
}
.slideSty .slide-verify-slider {
  width: 100% !important;
}
.slideSty .slide-verify-refresh-icon {
  display: none;
}
</style>
