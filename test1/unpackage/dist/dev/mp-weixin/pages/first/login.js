"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      register: true
    };
  },
  methods: {
    handleUserRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/first/register"
      });
    },
    handleLogin() {
      if (this.loginForm.username === "" || this.loginForm.password === "") {
        if (this.loginForm.username === "") {
          common_vendor.index.showToast({
            title: "请输入账号",
            icon: "none",
            duration: 2e3
          });
        } else if (this.loginForm.password === "") {
          common_vendor.index.showToast({
            title: "请输入密码",
            icon: "none",
            duration: 2e3
          });
        }
      } else {
        this.login();
      }
    },
    login() {
      console.log("登录成功");
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loginForm.username,
    b: common_vendor.o(($event) => $data.loginForm.username = $event.detail.value),
    c: $data.loginForm.password,
    d: common_vendor.o(($event) => $data.loginForm.password = $event.detail.value),
    e: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    f: $data.register
  }, $data.register ? {
    g: common_vendor.o((...args) => $options.handleUserRegister && $options.handleUserRegister(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
