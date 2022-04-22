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
        <!--  出租车位列表展示   -->
        <div class="home-show-rent">
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
        <!--  寻找车位列表展示  -->
        <div class="home-show-seek">
          <rent-or-seek
            :title="{
              titleContent: '正在寻找车位',
            }"
          >
            <template v-slot:item>
              <seek-item v-for="seek in seekList" :key="seek.id" :seek="seek">
              </seek-item>
            </template>
          </rent-or-seek>
        </div>
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
import { useSeekList } from "@/hooks/useSeekList";
import SeekItem from "@/views/community/components/seekItem";

export default {
  components: { SeekItem, RentItem, RentOrSeek, Carousel, TopNav },
  setup() {
    // 轮播图数据
    const banners = [
      { id: 1, imgUrl: "/images/carousel_01.webp" },
      { id: 2, imgUrl: "/images/carousel_02.webp" },
      { id: 3, imgUrl: "/images/carousel_03.webp" },
    ];
    const { rentList } = useRentList({ pageSize: 20 });
    const { seekList } = useSeekList({ pageSize: 20 });

    return {
      banners,
      rentList,
      seekList,
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
    .home-show {
      display: flex;
      height: 800px;
      .home-show-rent {
        width: 50%;
        .rentOrSeek-list-content {
          height: calc(100% - 60px);
        }
      }
      .home-show-seek {
        width: 50%;
        .rentOrSeek-list-content {
          height: calc(100% - 60px);
        }
      }
    }
  }
}
</style>
