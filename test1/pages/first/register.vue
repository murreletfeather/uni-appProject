<template>
  <view class="normal-login-container">
    <view class="background-animation"></view>
    <view class="login-form-content">
      <view class="input-item flex align-center">
        <view class="iconfont icon-user icon"></view>
        <input v-model="registerForm.username" class="input" type="text" placeholder="请输入账号" maxlength="30" />
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-password icon"></view>
        <input v-model="registerForm.password" type="password" class="input" placeholder="请输入密码" maxlength="20" />
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-password icon"></view>
        <input v-model="registerForm.confirmPassword" type="password" class="input" placeholder="请输入重复密码" maxlength="20" />
      </view>
      <view class="action-btn">
        <button @click="handleRegister()" class="register-btn cu-btn block bg-blue lg round">注册</button>
      </view>
    </view>
    <view class="xieyi">
      <text @click="handleUserLogin" class="text" style="color: blue;">使用已有账号登录</text>
    </view>
  </view>
</template>


<script>
export default {
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    handleRegister() {
      if (this.registerForm.username === '') {
        uni.showToast({
          title: '请输入账号',
          icon: 'none',
          duration: 2000
        });
      } else if (this.registerForm.password === '') {
        uni.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 2000
        });
      } else if (this.registerForm.confirmPassword === '') {
        uni.showToast({
          title: '请确认密码',
          icon: 'none',
          duration: 2000
        });
      } else if (this.registerForm.password !== this.registerForm.confirmPassword) {
        uni.showToast({
          title: '两次输入密码不一致',
          icon: 'none',
          duration: 2000
        });
      } else {
        this.register();
      }
    },
    handleUserLogin() {
      // 跳转到登录页面
      uni.navigateTo({
        url: '/pages/first/login'
      });
    },
    register() {
      console.log("注册成功");
      // 这里可以添加注册成功后的逻辑处理，例如跳转页面等
    }
  }
}
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
  background: linear-gradient(45deg, #778bff, #f06595, #845ef7);
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
}

.login-form-content:hover {
  transform: translateY(-10px);
}

.input-item {
  margin: 20px auto;
  background-color: #f5f6f7;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 20px;
  margin-right: 10px;
  color: #999;
}

.input {
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  border: none;
  outline: none;
  background: transparent;
  padding-left: 10px;
}

.register-btn {
  margin-top: 40px;
  height: 45px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-btn:hover {
  background-color: #0056b3;
}

.xieyi {
  color: #333;
  margin-top: 20px;
  text-align: center;
}

.xieyi .text {
  cursor: pointer;
  transition: color 0.3s;
}

.xieyi .text:hover {
  color: #0044cc;
}
</style>


