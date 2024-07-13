"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      registerForm: {
        username: "",
        password: "",
        confirmPassword: ""
      }
    };
  },
  methods: {
    handleRegister() {
      if (this.registerForm.username === "") {
        common_vendor.index.showToast({
          title: "请输入账号",
          icon: "none",
          duration: 2e3
        });
      } else if (this.registerForm.password === "") {
        common_vendor.index.showToast({
          title: "请输入密码",
          icon: "none",
          duration: 2e3
        });
      } else if (this.registerForm.confirmPassword === "") {
        common_vendor.index.showToast({
          title: "请确认密码",
          icon: "none",
          duration: 2e3
        });
      } else if (this.registerForm.password !== this.registerForm.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入密码不一致",
          icon: "none",
          duration: 2e3
        });
      } else {
        this.register();
      }
    },
    handleUserLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/first/login"
      });
    },
    register() {
      console.log("注册成功");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.registerForm.username,
    b: common_vendor.o(($event) => $data.registerForm.username = $event.detail.value),
    c: $data.registerForm.password,
    d: common_vendor.o(($event) => $data.registerForm.password = $event.detail.value),
    e: $data.registerForm.confirmPassword,
    f: common_vendor.o(($event) => $data.registerForm.confirmPassword = $event.detail.value),
    g: common_vendor.o(($event) => $options.handleRegister()),
    h: common_vendor.o((...args) => $options.handleUserLogin && $options.handleUserLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
