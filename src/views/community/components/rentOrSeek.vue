<template>
  <div class="rentOrSeek-list">
    <div class="rentOrSeek-list-title">
      <h3>{{ title.titleContent }}</h3>
      <slot name="button" />
    </div>
    <div class="rentOrSeek-list-content">
      <slot name="item" />
    </div>
    <slot name="pagination" />
  </div>
</template>

<script>
export default {
  name: "rentOrSeek",
  props: {
    title: {
      type: Object,
    },
  },
  setup() {},
};
</script>

<style scoped lang="less">
.rentOrSeek-list {
  padding: 15px 0;
  height: 100%;
  .rentOrSeek-list-title {
    display: flex;
    justify-content: space-between;
    padding: 0 10px 10px;
    height: 50px;
    border-bottom: 1px solid #ccc;
    h3 {
      line-height: 38px;
    }
  }
  .rentOrSeek-list-content {
    padding: 10px;
    // background-color: #edf2f7;
    height: calc(100% - 130px);
    // 超出范围垂直显示滚动条(auto是溢出才显示滚动条)
    overflow-y: auto;
  }
}
</style>
