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
            <rent-item
              list-button="我想使用"
              v-for="rent in rentList"
              :key="rent.id"
              :rent="rent"
            />
          </template>
          <template v-slot:pagination>
            <CpPagination
              :pageSize="rentParams.pageSize"
              v-model:page="rentParams.page"
              :counts="rentListCount"
            />
          </template>
        </rent-or-seek>
      </div>
      <!-- 寻找车位 -->
      <div class="home-right">
        <rent-or-seek :title="seekTitle">
          <template v-slot:item>
            <seek-item
              list-button="我要共享"
              v-for="seek in seekList"
              :key="seek.id"
              :seek="seek"
            />
          </template>
          <template v-slot:pagination>
            <CpPagination
              :pageSize="seekParams.pageSize"
              v-model:page="seekParams.page"
              :counts="seekListCount"
            />
          </template>
        </rent-or-seek>
      </div>
    </div>
  </div>
</template>

<script>
import RentOrSeek from "@/views/home/components/rentOrSeek";
import { ref, watch } from "vue";
import RentItem from "@/views/home/components/rentItem";
import SeekItem from "@/views/home/components/seekItem";
import CpPagination from "@/components/CpPagination";
import { getRentlist, getSeeklist } from "@/api/index";
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
    // 关于出租车位列表
    const { rentList, rentListCount, rentParams } = useRentlist();
    // 关于寻找车位列表
    const { seekList, seekListCount, seekParams } = useSeeklist();

    return {
      rentTitle,
      seekTitle,
      seekParams,
      rentParams,
      rentList,
      rentListCount,
      seekListCount,
      seekList,
    };
  },
};
// 获取出租车位列表数据
function useRentlist() {
  // 出租车位列表
  const rentList = ref(null);
  // 出租车位列表总数量
  const rentListCount = ref(0);
  // 出租车位列表分页参数
  const rentParams = ref({
    // 当前页
    page: 1,
    // 每页显示多少条数据
    pageSize: 5,
  });
  // 获取出租车位列表数据
  const getData = () => {
    getRentlist({
      page: rentParams.value.page,
      limit: rentParams.value.pageSize,
    }).then((data) => {
      // console.log(data, "data");
      if (data.status === 200) {
        // 存储出租车位列表数据
        rentList.value = data.data;
        // 存储总数量
        rentListCount.value = data.total;
      }
    });
  };
  // 监听请求参数的变化
  watch(
    rentParams.value,
    () => {
      getData();
    },
    // 初始调用 默认不会初始调用 设为true便会初始调用一次
    {
      immediate: true,
    }
  );
  return {
    rentListCount,
    rentList,
    rentParams,
  };
}
// 获取寻找车位列表数据
function useSeeklist() {
  // 寻找车位列表
  const seekList = ref(null);
  // 寻找车位列表总数量
  const seekListCount = ref(0);
  // 寻找车位列表分页参数
  const seekParams = ref({
    // 当前页
    page: 1,
    // 每页显示多少条数据
    pageSize: 5,
  });
  // 获取寻找车位列表数据
  const getData = () => {
    getSeeklist({
      page: seekParams.value.page,
      limit: seekParams.value.pageSize,
    }).then((data) => {
      // console.log(data, "data");
      if (data.status === 200) {
        // 存储寻找车位列表数据
        seekList.value = data.data;
        // 存储总数量
        seekListCount.value = data.total;
      }
    });
  };
  // 监听请求参数的变化
  watch(
    seekParams.value,
    () => {
      getData();
    },
    // 初始调用 默认不会初始调用 设为true便会初始调用一次
    {
      immediate: true,
    }
  );
  return {
    seekList,
    seekListCount,
    seekParams,
  };
}
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
