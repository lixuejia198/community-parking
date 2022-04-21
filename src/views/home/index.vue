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
      <div class="home-show">
        <rent-or-seek
          :title="{
            titleContent: '正在出租车位',
          }"
        >
          <template v-slot:item>
            <rent-item v-for="rent in rentList" :key="rent.id" :rent="rent" />
          </template>
        </rent-or-seek>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav";
import Carousel from "@/components/Carousel";
import RentOrSeek from "@/views/community/components/rentOrSeek";
import RentItem from "@/views/community/components/rentItem";
import { useRentList } from "@/hooks/useRentList";

export default {
  components: { RentItem, RentOrSeek, Carousel, TopNav },
  setup() {
    // 轮播图数据
    const banners = [
      { id: 1, imgUrl: "/images/carousel_01.webp" },
      { id: 2, imgUrl: "/images/carousel_02.webp" },
      { id: 3, imgUrl: "/images/carousel_03.webp" },
    ];
    const { rentList } = useRentList();

    return {
      banners,
      rentList,
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
