"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      query: ""
    };
  },
  methods: {
    callService() {
      common_vendor.index.makePhoneCall({
        phoneNumber: "123456789"
        // 替换为实际客服电话
      });
    },
    submitQuery() {
      common_vendor.index.request({
        url: "https://your-api-url.com/contact",
        // 替换为实际接口
        method: "POST",
        data: {
          message: this.query
        },
        success: (res) => {
          common_vendor.index.showToast({
            title: "提交成功"
          });
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "提交失败",
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.callService && $options.callService(...args)),
    b: $data.query,
    c: common_vendor.o(($event) => $data.query = $event.detail.value),
    d: common_vendor.o((...args) => $options.submitQuery && $options.submitQuery(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
