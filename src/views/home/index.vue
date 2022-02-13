<template>
  <div class="home">
    <div class="home-left">three.js</div>
    <div class="home-center">
      <rent-or-seek :title="title1" list-button="我要共享" />
    </div>
    <div class="home-right">
      <rent-or-seek :title="title2" list-button="我想使用" />
    </div>
  </div>
</template>

<script>
import RentOrSeek from "@/views/home/components/rentOrSeek";
import { ref } from "vue";
export default {
  name: "Home",
  components: { RentOrSeek },
  setup() {
    const title1 = ref({
      titleContent: "正在出租车位",
      titleButton: "我想使用",
    });
    const title2 = ref({
      titleContent: "正在寻找车位",
      titleButton: "我要共享",
    });
    return {
      title1,
      title2,
    };
  },
};
</script>

<style scoped lang="less">
.home {
  height: 100%;
  position: relative;
  .home-left {
    position: absolute;
    left: 0;
    width: 50%;
    height: 100%;
    background-color: aquamarine;
  }
  .home-center {
    position: absolute;
    left: 50%;
    right: 25%;
    width: 25%;
    height: 100%;
  }
  .home-right {
    position: absolute;
    right: 0;
    width: 25%;
    height: 100%;
    border-left: 1px solid #dfdfdf;
    box-sizing: border-box;
  }
}
</style>
