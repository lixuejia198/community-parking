<template>
  <div class="list-content-item">
    <div class="list-content-title">
      <h3>{{ seek.cname }}</h3>
    </div>
    <a-tag
      class="list-content-tag"
      :color="seek.comid && seek.pid ? '#FF5500' : '#87d068'"
    >
      {{ seek.comid && seek.pid ? "已找到" : "寻找中" }}
    </a-tag>
    <div class="list-content-date">
      <div>
        <span class="list-content-time-title">开始</span>
        <span>
          {{ new Date(seek.starttime).toLocaleString().replaceAll("/", "-") }}
        </span>
      </div>
      <div>
        <span class="list-content-time-title list-title-2"> 结束 </span>
        <span>
          {{ new Date(seek.endtime).toLocaleString().replaceAll("/", "-") }}
        </span>
      </div>
    </div>
    <div class="list-content-place" v-if="seek.comname || seek.place">
      <span class="list-content-time-title"> 位置 </span>
      <span> {{ seek.comname }}({{ seek.place }}) </span>
    </div>
    <div class="bottom-slot">
      <slot class="item-button" name="itemButton" />
    </div>
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
.list-content-item {
  position: relative;
  padding: 4px;
  box-shadow: 0 6.1px 2px rgba(0, 0, 0, 0.025),
    0 10.6px 6.7px rgba(0, 0, 0, 0.036), 0 25px 30px rgba(0, 0, 0, 0.06);
  border-radius: 15px;
  margin-bottom: 10px;
  overflow: hidden;
  border: 1px solid #ccc;
  box-sizing: border-box;
  background-image: linear-gradient(to bottom, #f7e1d0, #fff, #fff, #fff, #fff);
  .list-content-title {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    h3 {
      font-weight: bold;
      font-size: 18px;
    }
  }
  .list-content-tag {
    position: absolute;
    top: 0;
    right: -10px;
    font-size: 14px;
    padding: 2px 14px 2px 8px;
    border-radius: 0 15px 0 15px;
  }
  .list-content-date {
    border-radius: 10px;
    padding-left: 10px;
    background-image: linear-gradient(to right, #2db7f5, #fff);
    margin: 4px 0 4px 4px;
  }
  .list-content-place {
    border-radius: 10px;
    padding-left: 10px;
    background-image: linear-gradient(to right, #1cb235, #fff);
    margin: 4px 0 4px 4px;
  }
  .list-content-time-title {
    display: inline-block;
    background-color: #fff;
    border-radius: 10px 0 10px 0;
    height: 100%;
    width: 3rem;
    text-align: center;
    margin-right: 4px;
    margin-left: -10px;
    box-sizing: border-box;
  }
  .list-content-date {
    .list-content-time-title {
      border: 1px solid #ccc;
    }
    .list-title-2 {
      border-radius: 0 10px 0 10px;
      background-color: #666;
      color: #fff;
    }
  }
  .list-content-place .list-content-time-title {
    border: 1px solid #ccc;
  }
  .item-button {
    width: 100%;
  }
}
.bottom-slot {
  width: 100%;
}
</style>
