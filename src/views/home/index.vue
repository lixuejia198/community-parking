<template>
  <div class="home">
    <!--  用户登录信息  -->
    <div class="login-info">
      <ul>
        <template v-if="userInfo.id">
          <li>
            <RouterLink to="/my" style="color: #333333">
              <UserOutlined />{{ userInfo.username }}
            </RouterLink>
          </li>
          <li @click="loginOut">退出登录</li>
        </template>
        <template v-else>
          <li>
            <RouterLink style="color: #333333" to="/login">请先登录</RouterLink>
          </li>
        </template>
      </ul>
    </div>
    <!--  首页内容  -->
    <div class="home-content">
      <!-- 基于three.js的停车车位模型 -->
      <div class="three-canvas home-left" ref="threeRef"></div>
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
        active: selectCarport.id === carport.id && carport.state === 0,
        disabled: carport.state === 1,
      }"
      @mouseenter="(e) => e.target.classList.add('hover')"
      @mouseleave="(e) => e.target.classList.remove('hover')"
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
import { onMounted, ref, watch } from "vue";
import RentItem from "@/views/home/components/rentItem";
import SeekItem from "@/views/home/components/seekItem";
import CpPagination from "@/components/CpPagination";
import { getCarport, getRentlist, getSeeklist } from "@/api";
import { UserOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { getUserInfo } from "@/utils/getUserInfo";
import { useRouter } from "vue-router";
import { useTEngine } from "@/hooks/useTEngine";
import { useCarModel } from "@/hooks/useCar";
import { Color } from "three";

export default {
  name: "Home",
  components: { CpPagination, SeekItem, RentItem, RentOrSeek, UserOutlined },
  setup() {
    const userInfo = ref(getUserInfo());
    const router = useRouter();
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
    const { rentList, rentListCount, rentParams } = useRentList();
    // 关于寻找车位列表
    const { seekList, seekListCount, seekParams } = useSeekList();
    // 控制弹框的显示与隐藏
    const rentVisible = ref(false);
    // 关于用户车位信息列表
    const { carportList, getData } = useCarport();
    // 退出登录
    const loginOut = () => {
      window.localStorage.removeItem("community-parking");
      router.push("/login");
    };
    // 点击我要共享按钮 显示车位信息弹框
    const rentCarport = async () => {
      await getData(userInfo.value.id);
      // 如果用户拥有车位
      if (carportList.value.length !== 0 && userInfo.value !== {}) {
        // 显示弹框
        rentVisible.value = true;
      } else if (carportList.value.length === 0 && userInfo.value === {}) {
        // 如果用户已经登录并且没有车位 提示相关警告信息
        message.warning("您还没有车位！");
      } else {
        // 如果用户没有登录 提示相关警告信息
        message.warning("您还没有登录或者登录失效！");
      }
    };
    // 选中的车位
    const selectCarport = ref({});
    // 选中车位
    const selectCarportList = (carport) => {
      if (selectCarport.value.id > 0) {
        // 如果当前是否选中车位 如果选中则取消选中
        selectCarport.value = {};
      } else if (carport.id !== 0 && carport.state === 0) {
        // 如果当前车位未被选中并且车位不处于禁用状态则选中
        selectCarport.value = carport;
      }
    };
    // 点击弹框的确定按钮的回调事件
    const handleOkRent = (e) => {
      console.log(e);
    };

    // three 绑定的元素
    const threeRef = ref(null);
    // 实例化的 ThreeJS 引擎
    let TE = null;
    // DOM 渲染完成后执行
    onMounted(() => {
      TE = useTEngine(threeRef.value);

      // 自动调整渲染器大小
      window.onresize = () => {
        return (() => {
          // 设置正投影相机大小
          TE.setOrthographicCameraSize(
            document.body.clientWidth,
            document.body.clientHeight
          );
        })();
      };

      const car = { name: "car-red" };
      // 渲染货物模型
      useCarModel({ car, groupScale: 8, color: new Color(0xff7300) }).then(
        (goodsModel) => {
          // 添加货物到场景中
          TE.addObject(goodsModel);
        }
      );
    });

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
      userInfo,
      loginOut,
      threeRef,
    };
  },
};
// 获取出租车位列表数据
function useRentList() {
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
function useSeekList() {
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
function useCarport() {
  // 车位列表
  const carportList = ref([]);
  // 根据用户id 获取车位信息
  const getData = async (uid) => {
    const data = await getCarport({ uid }).catch((error) => {
      console.log(error);
    });
    console.log(data, "data");
    // 如果返回的状态码为200(不过得先判断data是否为undefined)
    if (data?.status === 200) {
      // 存储用户车位信息
      carportList.value = data.data;
    }
  };

  return {
    carportList,
    getData,
  };
}
</script>

<style scoped lang="less">
.home {
  height: 100%;
  .login-info {
    height: 50px;
    border-bottom: 1px solid #ccc;
    ul {
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0;
      margin: 0;
      li {
        list-style: none;
        padding: 0 20px 0 6px;
        border-left: 2px solid #ff7300;
        font-size: 16px;
      }
    }
  }
  .home-content {
    height: calc(100% - 50px);
    position: relative;
    .home-left {
      position: absolute;
      left: 0;
      width: 60%;
      height: 100%;
      //background-color: aquamarine;
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
}
.hover {
  background-color: #fff7e6;
  border: 1px solid #ffd591;
  color: #000;
}
.active {
  background-color: #d46b08;
  border: 1px solid #ffd591;
  color: #fff;
}
.disabled {
  background-color: #eee;
  border: 1px solid #999;
  color: #000;
  cursor: not-allowed;
}
</style>
