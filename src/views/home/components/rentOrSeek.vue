<template>
  <div class="rentOrSeek-list">
    <div class="rentOrSeek-list-title">
      <h3>{{ title.titleContent }}</h3>
      <span>{{ title.titleButton }}</span>
    </div>
    <div class="rentOrSeek-list-blank"></div>
    <div class="rentOrSeek-list-content">
      <div class="rentOrSeek-list-content-item">
        <div class="rentOrSeek-list-content-number">
          <h3>168号</h3>
          <span>{{ listButton }}</span>
        </div>
        <div class="rentOrSeek-list-content-state">
          <span>状态</span>
          <p>空闲</p>
        </div>
        <div class="rentOrSeek-list-content-time">
          <span>时间</span>
          <p>可使用时间为2022年2月20日-2022年3月10日</p>
        </div>
        <div class="rentOrSeek-list-content-place">
          <span>位置</span>
          <p>佛山岭南隽庭</p>
        </div>
      </div>
      <div class="rentOrSeek-list-content-item">
        <div class="rentOrSeek-list-content-number">
          <h3>169号</h3>
          <span>{{ listButton }}</span>
        </div>
        <div class="rentOrSeek-list-content-state">
          <span>状态</span>
          <p>空闲</p>
        </div>
        <div class="rentOrSeek-list-content-time">
          <span>时间</span>
          <p>可使用时间为2022年2月20日-2022年3月10日</p>
        </div>
        <div class="rentOrSeek-list-content-place">
          <span>位置</span>
          <p>佛山岭南隽庭</p>
        </div>
      </div>
      <div class="rentOrSeek-list-content-item">
        <div class="rentOrSeek-list-content-number">
          <h3>170号</h3>
          <span>{{ listButton }}</span>
        </div>
        <div class="rentOrSeek-list-content-state">
          <span>状态</span>
          <p>空闲</p>
        </div>
        <div class="rentOrSeek-list-content-time">
          <span>时间</span>
          <p>可使用时间为2022年2月20日-2022年3月10日</p>
        </div>
        <div class="rentOrSeek-list-content-place">
          <span>位置</span>
          <p>佛山岭南隽庭</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "rentOrSeek",
  props: ["title", "listButton"],
};
</script>

<style scoped lang="less">
.rentOrSeek-list {
  padding: 15px 0;
  height: 100%;
  .rentOrSeek-list-title {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    height: 40px;
    margin-bottom: 10px;
    h3 {
      line-height: 38px;
    }
    span {
      color: #d46b08;
      background: #fff7e6;
      border: 1px solid #ffd591;
      padding: 8px;
      cursor: pointer;
    }
  }
  .rentOrSeek-list-blank {
    height: 15px;
    background-color: rgb(245, 241, 242);
  }
  .rentOrSeek-list-content {
    padding: 0 10px 10px;
    .rentOrSeek-list-content-item {
      border-bottom: 1px solid #dfdfdf;
      padding-top: 10px;
      .rentOrSeek-list-content-number {
        display: flex;
        justify-content: space-between;
        height: 40px;
        h3 {
          font-weight: bold;
          font-size: 18px;
          line-height: 40px;
        }
        span {
          font-size: 14px;
          padding: 8px;
          background-color: rgba(255, 115, 0, 1);
          color: white;
          cursor: pointer;
        }
      }
      .rentOrSeek-list-content-state,
      .rentOrSeek-list-content-time,
      .rentOrSeek-list-content-place {
        display: flex;
        margin-bottom: 10px;
        span {
          background-color: rgb(255, 85, 0);
          color: white;
          padding: 2px;
        }
        p {
          padding: 2px 0;
          margin: 0 0 0 8px;
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
  }
}
</style>
