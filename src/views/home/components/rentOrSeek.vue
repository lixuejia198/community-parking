<template>
  <div class="rentOrSeek-list">
    <div class="rentOrSeek-list-title">
      <h3>{{ title.titleContent }}</h3>
      <span>{{ title.titleButton }}</span>
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
    span {
      color: #d46b08;
      background: #fff7e6;
      border: 1px solid #ffd591;
      width: 74px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
  }
  .rentOrSeek-list-content {
    padding: 10px;
    // background-color: #edf2f7;
    height: calc(937px - 115px - 94px);
    // 超出范围垂直显示滚动条
    overflow-y: scroll;
  }
}
</style>
