<template>
  <view class="normal-login-container">
    <view class="background-animation"></view>
    <view class="login-form-content">
      <view class="input-item flex align-center">
        <view class="iconfont icon-user icon"></view>
        <input v-model="loginForm.username" class="input" type="text" placeholder="请输入账号" maxlength="30" />
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-password icon"></view>
        <input v-model="loginForm.password" type="password" class="input" placeholder="请输入密码" maxlength="20" />
      </view>
      <view class="action-btn">
        <button @click="handleLogin" class="login-btn cu-btn block bg-blue lg round">登录</button>
      </view>
      <view class="reg text-center" v-if="register">
        <text class="text-grey1">没有账号？</text>
        <text @click="handleUserRegister" class="text-blue">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      register: true
    };
  },
  methods: {
    handleUserRegister() {
      uni.navigateTo({
        url: '/pages/first/register'
      });
    },
    handleLogin() {
      if (this.loginForm.username === '' || this.loginForm.password === '') {
        if (this.loginForm.username === '') {
          uni.showToast({
            title: '请输入账号',
            icon: 'none',
            duration: 2000
          });
        } else if (this.loginForm.password === '') {
          uni.showToast({
            title: '请输入密码',
            icon: 'none',
            duration: 2000
          });
        }
      } else {
        // 登录成功逻辑
        this.login();
      }
    },
    login() {
      console.log('登录成功');
      uni.switchTab({
          url: '/pages/index/index'
      });
    }
  }
};
</script>

<style lang="scss">
.normal-login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
  position: relative;
  overflow: hidden;
}


.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #778bff, #9bb2f0, #845ef7);
  background-size: 600% 600%;
  animation: gradientAnimation 16s ease infinite;
  z-index: -1;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.login-form-content {
  text-align: center;
  margin: 20px auto;
  width: 80%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  z-index: 1;

  .input-item {
    margin: 20px auto;
    background-color: #f5f6f7;
    height: 30px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .icon {
      font-size: 38rpx;
      margin-left: 10px;
      color: #999;
    }

    .input {
      width: 100%;
      font-size: 14px;
      line-height: 20px;
      border: none;
      outline: none;
      background: transparent;
      padding-left: 15px;
    }
  }

  .login-btn {
    margin-top: 40px;
    height: 45px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .login-btn:hover {
    background-color: #0056b3;
  }

  .reg {
    margin-top: 15px;
  }

  .text-blue {
    color: blue;
  }
}
</style>
