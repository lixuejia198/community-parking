<template>
  <div class="rentOrSeek-list-content-item">
    <div class="rentOrSeek-list-content-number">
      <h3>{{ seek.cname }}</h3>
      <slot name="itemButton" />
    </div>
    <a-row class="rentOrSeek-list-content-state">
      <a-col :span="3" class="rentOrSeek-list-content-col3">
        <span>状态</span>
      </a-col>
      <a-col :span="21">
        <p>{{ seek.state === 0 ? "未解决" : "已解决" }}</p>
      </a-col>
    </a-row>
    <a-row class="rentOrSeek-list-content-time">
      <a-col :span="3" class="rentOrSeek-list-content-col3">
        <span>时间</span>
      </a-col>
      <a-col :span="21">
        <p>
          可使用时间为{{ new Date(seek.starttime).toLocaleString() }}-
          {{ new Date(seek.endtime).toLocaleString() }}
        </p>
      </a-col>
    </a-row>
    <a-row class="rentOrSeek-list-content-place">
      <a-col :span="3" class="rentOrSeek-list-content-col3">
        <span>位置</span>
      </a-col>
      <a-col :span="21">
        <p>{{ seek.comname }}({{ seek.place }})</p>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "seekItem",
  props: {
    seek: {
      type: Object,
    },
  },
  setup() {},
};
</script>

<style scoped lang="less">
.rentOrSeek-list-content-item {
  border-bottom: 1px solid #dfdfdf;
  padding-top: 10px;
  box-shadow: 0 6.1px 2px rgba(0, 0, 0, 0.025),
    0 10.6px 6.7px rgba(0, 0, 0, 0.036), 0 25px 30px rgba(0, 0, 0, 0.06);
  border-radius: 15px;
  margin-bottom: 10px;
  background-color: white;
  .rentOrSeek-list-content-number {
    display: flex;
    justify-content: space-between;
    height: 40px;
    padding: 0 10px;
    margin-bottom: 10px;
    h3 {
      font-weight: bold;
      font-size: 18px;
      line-height: 40px;
    }
  }
  .rentOrSeek-list-content-state,
  .rentOrSeek-list-content-time,
  .rentOrSeek-list-content-place {
    margin-bottom: 10px;
    padding-left: 8px;
    span {
      background-color: rgb(255, 85, 0);
      color: white;
      padding: 1px;
      display: inline-block;
    }
    p {
      padding: 2px 0;
      margin: 0;
    }
  }
  .rentOrSeek-list-content-time {
    span {
      background-color: rgb(45, 183, 245);
    }
  }
  .rentOrSeek-list-content-place {
    span {
      background-color: rgb(135, 208, 104);
    }
  }
}
</style>
