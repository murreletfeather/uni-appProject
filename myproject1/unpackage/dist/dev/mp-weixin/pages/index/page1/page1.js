"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      parentListId: "parentListId",
      pageHeight: 300,
      dataList: [],
      refreshing: false,
      refreshText: "",
      refreshFlag: false
    };
  },
  created() {
    for (var i = 1; i <= 32; i++) {
      this.dataList.push({
        id: i,
        name: i
      });
    }
  },
  onReady() {
    this.pageHeight = common_vendor.index.getSystemInfoSync().windowHeight;
    common_vendor.index.createSelectorQuery().in(this).select("#head").boundingClientRect().exec((rect) => {
      this.$refs.sublist.setSpecialEffects({
        id: this.parentListId,
        headerHeight: rect[0].height
      });
    });
  },
  methods: {
    onrefresh(e) {
      this.refreshing = true;
      this.refreshText = "刷新中...";
      setTimeout(() => {
        this.refreshing = false;
        this.refreshFlag = false;
        this.refreshText = "已刷新";
      }, 2e3);
    },
    onpullingdown(e) {
      if (this.refreshing) {
        return;
      }
      this.pulling = false;
      if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
        this.refreshFlag = true;
        this.refreshText = "释放立即刷新";
      } else {
        this.refreshFlag = false;
        this.refreshText = "下拉可以刷新";
      }
    }
  }
};
if (!Array) {
  const _component_refresh = common_vendor.resolveComponent("refresh");
  const _component_cell = common_vendor.resolveComponent("cell");
  const _component_list = common_vendor.resolveComponent("list");
  (_component_refresh + _component_cell + _component_list)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.refreshText),
    b: common_vendor.o($options.onrefresh),
    c: common_vendor.o($options.onpullingdown),
    d: common_vendor.p({
      display: $data.refreshing ? "show" : "hide"
    }),
    e: common_vendor.f($data.dataList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.sr("item" + index, "364a2d75-5-" + i0 + ",364a2d75-4", {
          "f": 1
        }),
        c: item.id,
        d: "item" + index,
        e: common_vendor.o(_ctx.onclick, item.id),
        f: "364a2d75-5-" + i0 + ",364a2d75-4"
      };
    }),
    f: common_vendor.sr("sublist", "364a2d75-4,364a2d75-3"),
    g: common_vendor.p({
      ["offset-accuracy"]: 5,
      bounce: false,
      isSwiperList: "true"
    }),
    h: common_vendor.s("height:" + $data.pageHeight + "px"),
    i: $data.parentListId,
    j: common_vendor.p({
      id: $data.parentListId,
      bounce: false,
      isSwiperList: "true"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
