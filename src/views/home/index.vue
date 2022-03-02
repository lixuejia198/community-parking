<template>
  <div class="home">
    <!--  用户登录信息  -->
    <div class="login-info">用户登录信息</div>
    <!--  首页内容  -->
    <div class="home-content">
      <!-- 基于three.js的停车车位模型 -->
      <div class="home-left">three.js</div>
      <!-- 出租车位 -->
      <div class="home-center">
        <rent-or-seek :title="rentTitle">
          <template v-slot:item>
            <rent-item list-button="我想使用" v-for="i in 10" :key="i" />
          </template>
          <template v-slot:pagination>
            <CpPagination
              :pageSize="rentParams.pageSize"
              v-model:page="rentParams.page"
              :counts="rentParams.counts"
            />
          </template>
        </rent-or-seek>
      </div>
      <!-- 寻找车位 -->
      <div class="home-right">
        <rent-or-seek :title="seekTitle">
          <template v-slot:item>
            <seek-item list-button="我要共享" v-for="i in 10" :key="i" />
          </template>
          <template v-slot:pagination>
            <CpPagination
              :pageSize="seekParams.pageSize"
              v-model:page="seekParams.page"
              :counts="seekParams.counts"
            />
          </template>
        </rent-or-seek>
      </div>
    </div>
  </div>
</template>

<script>
import RentOrSeek from "@/views/home/components/rentOrSeek";
import { ref } from "vue";
import RentItem from "@/views/home/components/rentItem";
import SeekItem from "@/views/home/components/seekItem";
import CpPagination from "@/components/CpPagination";
export default {
  name: "Home",
  components: { CpPagination, SeekItem, RentItem, RentOrSeek },
  setup() {
    // 出租车位列表标题
    const rentTitle = ref({
      titleContent: "正在出租车位",
      titleButton: "我要共享",
    });
    // 寻找车位列表标题
    const seekTitle = ref({
      titleContent: "正在寻找车位",
      titleButton: "我想使用",
    });
    // 出租车位列表分页参数
    const rentParams = ref({
      // 当前页
      page: 1,
      // 每页显示多少条数据
      pageSize: 4,
      // 总数据条数
      counts: 24,
    });
    // 寻找车位列表分页参数
    const seekParams = ref({
      // 当前页
      page: 1,
      // 每页显示多少条数据
      pageSize: 4,
      // 总数据条数
      counts: 24,
    });

    return {
      rentTitle,
      seekTitle,
      rentParams,
      seekParams,
    };
  },
};
</script>

<style scoped lang="less">
.home {
  height: 100%;
  .login-info {
    height: 50px;
    border-bottom: 1px solid #ccc;
  }
  .home-content {
    height: calc(100% - 50px);
    position: relative;
    .home-left {
      position: absolute;
      left: 0;
      width: 60%;
      height: 100%;
      background-color: aquamarine;
    }
    .home-center {
      position: absolute;
      left: 60%;
      right: 20%;
      width: 20%;
      height: 100%;
      a {
        display: inline-block;
        color: #d46b08;
        width: 100%;
        height: 100%;
      }
    }
    .home-right {
      position: absolute;
      right: 0;
      width: 20%;
      height: 100%;
      border-left: 1px solid #ccc;
      box-sizing: border-box;
      a {
        display: inline-block;
        color: #d46b08;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
