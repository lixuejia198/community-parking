<template>
  <div class="xtx-carousel" @mouseenter="stopPlay" @mouseleave="startPlay">
    <ul class="carousel-body">
      <!-- 轮播图图片 -->
      <li
        class="carousel-item"
        v-for="(item, index) in carousels"
        :key="item.id"
        :class="{ fade: index === currentIndex }"
      >
        <img :src="item.imgUrl" alt="" />
      </li>
    </ul>
    <!-- 左按钮 -->
    <a href="javascript:" class="carousel-btn prev" @click="toggle(-1)">
      <LeftOutlined />
    </a>
    <!-- 右按钮 -->
    <a href="javascript:" class="carousel-btn next" @click="toggle(1)">
      <RightOutlined />
    </a>
    <!-- 小圆点导航 -->
    <div class="carousel-indicator">
      <span
        v-for="(item, index) in carousels"
        :key="item.id"
        :class="{ active: index === currentIndex }"
        @click="currentIndex = index"
      >
      </span>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from "vue";
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";

export default {
  name: "Carousel",
  props: {
    // 轮播图数据
    carousels: {
      type: Array,
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: false,
    },
    // 多久轮播一次
    duration: {
      type: Number,
      default: 3000,
    },
  },
  components: { LeftOutlined, RightOutlined },
  setup(props) {
    // 当前轮播图索引 默认显示第一张 小圆点也是默认第一个是亮的
    const currentIndex = ref(0);
    // 轮播图切换
    const toggle = (step = 1) => {
      // 计算索引
      const nextIndex = currentIndex.value + step;
      // 如果索引为负值,也就是小于第一张图片的索引
      if (nextIndex < 0) {
        // 让当前索引值为最后一张图片的索引
        currentIndex.value = props.carousels.length - 1;
        // 如果索引大于最后一张图片的索引
      } else if (nextIndex > props.carousels.length - 1) {
        // 让当前索引值为第一张图片的索引
        currentIndex.value = 0;
        // 索引范围正常
      } else {
        // 正常赋值
        currentIndex.value = nextIndex;
      }
    };
    // 用于存储定时器
    const timer = ref(null);
    // 开启自动轮播
    const startPlay = () => {
      // 判断调用者是否开启了自动轮播的功能 并且轮播图是否有数据(轮播图图片必须要大于1张)
      if (props.autoPlay && props.carousels?.length > 1) {
        // 开启定时器 自动轮播
        timer.value = setInterval(toggle, props.duration);
      }
    };
    // 停止自动轮播
    const stopPlay = () => {
      // 清除定时器
      clearInterval(timer.value);
    };
    // 组件挂载完之后试图开启自动轮播功能
    onMounted(startPlay);
    // 组件卸载之后停止自动轮播
    onUnmounted(stopPlay);
    return { currentIndex, toggle, startPlay, stopPlay };
  },
};
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 60%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
