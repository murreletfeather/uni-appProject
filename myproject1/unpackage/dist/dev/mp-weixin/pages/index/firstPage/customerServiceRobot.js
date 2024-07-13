"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  setup() {
    const state = common_vendor.reactive({
      msgLoad: false,
      anData: {},
      animationData: {},
      showTow: false,
      msgList: [{
        my: false,
        msg: "你好我是客服机器人娜娜,请问有什么问题可以帮助您?(问候模板)",
        type: 1,
        questionList: ["如何注销用户", "我想了解业务流程", "手机号如何更换"]
      }],
      msg: "",
      go: 0,
      srcollHeight: 0
    });
    const sendMsg = () => {
      if (state.msg === "")
        return;
      state.msgList.push({
        "msg": state.msg,
        "my": true
      });
      msgGo();
      msgKf(state.msg);
      state.msg = "";
    };
    const msgGo = () => {
      const query = common_vendor.index.createSelectorQuery();
      setTimeout(() => {
        query.select("#okk").boundingClientRect((data) => {
          if (data.height - wh > 0) {
            state.go = data.height - wh;
          }
        }).exec();
      }, 100);
    };
    const msgKf = (x) => {
      state.msgLoad = true;
      setTimeout(() => {
        state.msgLoad = false;
        state.msgList.push({
          my: false,
          msg: "娜娜还在学习中,没能明白您的问题,请点击下方提交反馈与问题，我们会尽快人工处理。",
          type: 0,
          questionList: ["如何注销用户", "我想了解业务流程", "手机号如何更换"]
        });
        msgGo();
      }, 2e3);
    };
    const answer = (id) => {
      console.log(id);
    };
    const hideKey = () => {
      common_vendor.index.hideKeyboard();
    };
    const ckAdd = () => {
      if (!state.showTow) {
        upTowmn(-180, 350);
      } else {
        upTowmn(0, 200);
      }
      state.showTow = !state.showTow;
    };
    const upTowmn = (x, t) => {
      const animation = common_vendor.index.createAnimation({
        duration: t,
        timingFunction: "ease"
      });
      state.animation = animation;
      animation.translateY(x).step();
      state.animationData = animation.export();
    };
    common_vendor.onMounted(() => {
      const query = getSystemInfoSync();
      l.value = query.screenWidth / 750;
      wh.value = query.windowHeight;
      state.srcollHeight = `${query.windowHeight}px`;
    });
    return {
      ...state,
      sendMsg,
      answer,
      hideKey,
      ckAdd,
      upTowmn
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: _ctx.anData,
    b: common_vendor.f(_ctx.msgList, (x, i, i0) => {
      return common_vendor.e({
        a: x.my
      }, x.my ? {
        b: common_vendor.t(x.msg)
      } : common_vendor.e({
        c: common_assets._imports_0,
        d: common_vendor.t(x.msg),
        e: x.type == 1
      }, x.type == 1 ? {
        f: common_vendor.f(x.questionList, (item, index, i1) => {
          return {
            a: common_vendor.t(item),
            b: common_vendor.o(($event) => $setup.answer(index), index),
            c: index
          };
        })
      } : x.type == 2 ? {
        h: common_vendor.f(x.questionList, (item, index, i1) => {
          return {
            a: common_vendor.t(item),
            b: common_vendor.o(($event) => $setup.answer(index), index),
            c: index
          };
        })
      } : {
        i: common_vendor.f(x.questionList, (item, index, i1) => {
          return {
            a: common_vendor.t(item),
            b: common_vendor.o(($event) => $setup.answer(index), index),
            c: index
          };
        })
      }, {
        g: x.type == 2
      }), {
        j: i
      });
    }),
    c: common_assets._imports_0,
    d: _ctx.msgLoad,
    e: common_vendor.o((...args) => $setup.hideKey && $setup.hideKey(...args)),
    f: _ctx.srcollHeight,
    g: _ctx.go,
    h: common_vendor.o((...args) => $setup.sendMsg && $setup.sendMsg(...args)),
    i: _ctx.msg,
    j: common_vendor.o(($event) => _ctx.msg = $event.detail.value),
    k: common_vendor.o((...args) => $setup.sendMsg && $setup.sendMsg(...args)),
    l: common_vendor.o((...args) => $setup.ckAdd && $setup.ckAdd(...args)),
    m: _ctx.animationData
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
