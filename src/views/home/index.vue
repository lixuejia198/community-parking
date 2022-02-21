<template>
  <div class="home">
    <div class="home-left">three.js</div>
    <div class="home-center">
      <rent-or-seek :title="title1">
        <rent-item list-button="我想使用" v-for="i in 4" :key="i" />
      </rent-or-seek>
    </div>
    <div class="home-right">
      <rent-or-seek :title="title2">
        <rent-item list-button="我要共享" v-for="i in 4" :key="i" />
      </rent-or-seek>
    </div>
  </div>
</template>

<script>
import RentOrSeek from "@/views/home/components/rentOrSeek";
import { ref } from "vue";
import RentItem from "@/views/home/components/rentItem";
export default {
  name: "Home",
  components: { RentItem, RentOrSeek },
  setup() {
    const title1 = ref({
      titleContent: "正在出租车位",
      titleButton: "我要共享",
    });
    const title2 = ref({
      titleContent: "正在寻找车位",
      titleButton: "我想使用",
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
