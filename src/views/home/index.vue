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
          <template v-slot:button>
            <span class="rentlist-button" @click="rentCarport">
              {{ rentTitle.titleButton }}
            </span>
          </template>
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
          <template v-slot:button>
            <span class="seeklist-button">{{ seekTitle.titleButton }}</span>
          </template>
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
  <a-modal
    v-model:visible="rentVisible"
    title="请选择你要共享的车位"
    cancelText="取消"
    okText="确定"
    @ok="handleOkRent"
  >
    <div
      v-for="carport in carportList"
      :key="carport.id"
      class="modal-com-item"
      :class="{
        active: selectCarport.id === carport.id,
      }"
      @click="selectCarportList(carport)"
    >
      <p>ID：{{ carport.id }}</p>
      <p>车位编码：{{ carport.pname }}</p>
      <p>所在花园：{{ carport.comname }}</p>
      <p>地址：{{ carport.place }}</p>
    </div>
  </a-modal>
</template>

<script>
import RentOrSeek from "@/views/home/components/rentOrSeek";
import { ref, watch } from "vue";
import RentItem from "@/views/home/components/rentItem";
import SeekItem from "@/views/home/components/seekItem";
import CpPagination from "@/components/CpPagination";
import { getCarport, getRentlist, getSeeklist } from "@/api/index";
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
    // 控制弹框的显示与隐藏
    const rentVisible = ref(false);
    // 关于用户车位信息列表
    const { carportList, getData } = useCarport();
    // 点击我要共享按钮 显示车位信息弹框
    const rentCarport = () => {
      // 显示弹框
      rentVisible.value = true;
      getData(1);
    };
    // 选中的车位
    const selectCarport = ref({});
    // 选中车位
    const selectCarportList = (carport) => {
      selectCarport.value =
        selectCarport.value.id === carport.id ? {} : carport;
    };
    // 点击弹框的确定按钮的回调事件
    const handleOkRent = (e) => {
      console.log(e);
    };

    return {
      rentTitle,
      seekTitle,
      seekParams,
      rentParams,
      rentList,
      rentListCount,
      seekListCount,
      seekList,
      rentCarport,
      rentVisible,
      handleOkRent,
      carportList,
      selectCarport,
      selectCarportList,
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
// 获取用户车位数据
const useCarport = () => {
  // 车位列表
  const carportList = ref([]);
  // 根据用户id 获取车位信息
  const getData = (uid) => {
    getCarport({ uid })
      .then((data) => {
        console.log(data, "data");
        // 如果返回的状态码为200
        if (data.status === 200) {
          carportList.value = data.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return {
    carportList,
    getData,
  };
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
      .rentlist-button {
        color: #d46b08;
        background: #fff7e6;
        border: 1px solid #ffd591;
        width: 74px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
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
      .seeklist-button {
        color: #d46b08;
        background: #fff7e6;
        border: 1px solid #ffd591;
        width: 74px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
    }
  }
}

.modal-com-item {
  border-bottom: 2px solid #dfdfdf;
  box-shadow: 0 6.1px 2px rgba(0, 0, 0, 0.025),
    0 10.6px 6.7px rgba(0, 0, 0, 0.036), 0 25px 30px rgba(0, 0, 0, 0.06);
  width: 100%;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 10px;

  &:hover {
    background-color: #fff7e6;
    border: 1px solid #ffd591;
    color: #000;
  }
}

.active {
  background-color: #d46b08;
  border: 1px solid #ffd591;
  color: #fff;
}
</style>
