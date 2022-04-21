<template>
  <div class="home">
    <div class="container">
      <!--  用户登录信息  -->
      <TopNav />
      <!--  轮播图和小区列表  -->
      <div class="home-banner">
        <!--  轮播图区域  -->
        <Carousel :carousels="banners" :autoPlay="true" />
        <!--  小区列表展示  -->
        <div class="home-community"></div>
      </div>
      <!--  出租车位和寻找车位列表展示(具体功能在小区模块实现)  -->
      <div class="home-show"></div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav";
import Carousel from "@/components/Carousel";

export default {
  components: { Carousel, TopNav },
  setup() {
    // 轮播图数据
    const banners = [
      { id: 1, imgUrl: "/images/carousel_01.webp" },
      { id: 2, imgUrl: "/images/carousel_02.webp" },
      { id: 3, imgUrl: "/images/carousel_03.webp" },
    ];

    return {
      banners,
    };
  },
};
</script>
<style scoped lang="less">
.home {
  height: 100%;
  .container {
    width: 1280px;
    height: 100%;
    margin: 0 auto;
    .home-banner {
      display: flex;
      width: 100%;
      height: 500px;
      .home-community {
        width: 40%;
        height: 100%;
      }
    }
  }
}
</style>
